(() => {
  'use strict';

  /* --- 定数と状態 --- */
  const MODES = {
    '1p-com': ['1P', 'COM'],
    '1p-2p': ['1P', '2P'],
    '3p': ['1P', '2P', '3P']
  };

  let state = {
    mode: '1p-com',
    players: [], // ['1P','COM',...]
    turnIndex: 0,
    phase: 'place', // 'place' or 'land' or 'readyToExplode' or 'exploded' or 'gameover'
    placingPlayerIndex: 0,
    placedCounts: {}, // {player: n}
    mines: Array(9).fill(0), // 各マスに埋められた地雷数 (0-3)
    // mineOwners: 各マスごとに誰が何個置いたかを記録するオブジェクト配列
    mineOwners: Array(9).fill(null).map(() => ({})), // [{ '1P':1, 'COM':2 }, ...]
    occupants: Array(9).fill(null), // 各マスに着地しているプレイヤー名またはnull
    hearts: {}, // {player: heartsLeft}
    maxMinesPerPlayer: 3,
    maxHearts: 2,
    volume: 0.8,
    hideInfoUntilExplosion: true
  };

  /* --- AudioContext（単一インスタンス） --- */
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext || null;
  let audioCtx = null; // 再利用する AudioContext
  let masterGain = null;

  async function ensureAudioCtx() {
    if (!AudioCtxClass) return null;
    if (!audioCtx) {
      try {
        audioCtx = new AudioCtxClass();
        // マスターゲインを作成しておく
        masterGain = audioCtx.createGain();
        masterGain.gain.value = state.volume;
        masterGain.connect(audioCtx.destination);
      } catch (err) {
        console.warn('AudioContext create failed', err);
        audioCtx = null;
        masterGain = null;
        return null;
      }
    }
    // ブラウザが suspended にしている場合は resume() を呼ぶ（ユーザー操作が必要）
    try {
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    } catch (err) {
      console.warn('AudioContext resume failed', err);
    }
    return audioCtx;
  }

  /* --- DOM 要素 --- */
  const el = {
    title: document.getElementById('site-title'),
    shareButtons: document.querySelectorAll('.share-btn'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    volumeRange: document.getElementById('volume-range'),
    volumeLabelLeft: document.getElementById('volume-left'),
    volumeLabelRight: document.getElementById('volume-right'),
    grid: document.getElementById('game-grid'),
    desc: document.getElementById('description'),
    explodeBtn: document.getElementById('explode-btn'),
    heartsWrap: document.getElementById('hearts-wrap'),
    playExamples: document.getElementById('play-examples'),
    howToPlay: document.getElementById('how-to-play'),
    relatedLinks: document.getElementById('related-links'),
    otherLinks: document.getElementById('other-links'),
    topLink: document.getElementById('top-link'),
    sitemapLink: document.getElementById('sitemap-link')
  };

  /* --- 初期化 --- */
  function init() {
    setupModeButtons();
    setupGrid();
    setupVolume();
    setupExplodeButton();
    setupShareButtons();
    setupSeoContent(); // 動的に説明文などを初期化
    resetGame();
    renderUI();

    // ユーザーが最初に何か操作したときに AudioContext を初期化しておくと安定する
    // ただし強制的に作らず、最初のユーザー操作で ensureAudioCtx を呼ぶようにする
    document.addEventListener('pointerdown', onFirstUserGesture, { once: true, passive: true });
    document.addEventListener('touchstart', onFirstUserGesture, { once: true, passive: true });
  }

  async function onFirstUserGesture() {
    // ユーザー操作があったら AudioContext を作って resume しておく（任意）
    await ensureAudioCtx();
    if (masterGain) masterGain.gain.value = state.volume;
  }

  function resetGame() {
    state.players = MODES[state.mode].slice();
    state.turnIndex = 0;
    state.phase = 'place';
    state.placingPlayerIndex = 0;
    state.placedCounts = {};
    state.players.forEach(p => state.placedCounts[p] = 0);
    state.mines = Array(9).fill(0);
    state.mineOwners = Array(9).fill(null).map(() => ({}));
    state.occupants = Array(9).fill(null);
    state.hearts = {};
    state.players.forEach(p => state.hearts[p] = state.maxHearts);
    state.hideInfoUntilExplosion = true;
    updateDescription(`${state.players[0]} が地雷を ${state.maxMinesPerPlayer} つ埋めて下さい`);
    clearGridVisuals();
    renderHearts();
  }

  /* --- UI セットアップ --- */
  function setupModeButtons() {
    el.modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (!MODES[mode]) return;
        state.mode = mode;
        resetGame();
        renderUI();
      });
    });
  }

  function setupGrid() {
    // 3x3 のマスを生成
    el.grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('button');
      cell.className = 'grid-cell';
      cell.dataset.index = i;
      cell.setAttribute('aria-label', `マス ${i + 1}`);
      cell.innerHTML = `
        <div class="cell-bg"></div>
        <div class="cell-content" aria-hidden="true">
          <svg class="bomb-icon" viewBox="0 0 64 64" aria-hidden="true">
            <g fill="none" stroke="#222" stroke-width="1">
              <circle cx="30" cy="34" r="12" fill="#222"/>
              <rect x="38" y="18" width="10" height="6" rx="2" fill="#444"/>
              <path d="M44 14c2-3 6-4 8-2" stroke="#666" stroke-width="2" fill="none"/>
            </g>
          </svg>
          <svg class="human-icon" viewBox="0 0 64 64" aria-hidden="true">
            <g fill="#111">
              <circle cx="32" cy="18" r="6"/>
              <path d="M20 44c0-6 12-10 12-10s12 4 12 10v6H20v-6z"/>
            </g>
          </svg>
          <div class="mine-count" aria-hidden="true"></div>
          <div class="occupant-label" aria-hidden="true"></div>
        </div>
      `;
      cell.addEventListener('click', onCellClick);
      el.grid.appendChild(cell);
    }
  }

  function setupVolume() {
    el.volumeRange.addEventListener('input', (e) => {
      state.volume = Number(e.target.value);
      // マスターゲインがあれば反映
      if (masterGain && audioCtx) {
        try {
          masterGain.gain.setValueAtTime(state.volume, audioCtx.currentTime);
        } catch (e) {
          try { masterGain.gain.value = state.volume; } catch (e2) {}
        }
      }
    });
  }

  function setupExplodeButton() {
    el.explodeBtn.addEventListener('click', async () => {
      // ユーザー操作の文脈で AudioContext を resume しておく
      await ensureAudioCtx();
      if (audioCtx && masterGain) {
        try {
          masterGain.gain.setValueAtTime(state.volume, audioCtx.currentTime);
        } catch (e) {
          try { masterGain.gain.value = state.volume; } catch (e2) {}
        }
      }
      if (state.phase === 'readyToExplode' || state.phase === 'land') {
        await triggerExplosion();
      } else {
        updateDescription('全員着地してから爆破スイッチを押して下さい');
      }
    });
  }

  function setupShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const type = btn.dataset.share;
        const url = location.href;
        const title = document.title;
        const text = '地雷ゲーム 3人対戦も面白い - 一緒に遊ぼう！';
        if (type === 'native' && navigator.share) {
          try {
            await navigator.share({ title, text, url });
          } catch (err) {
            // ユーザーがキャンセルした場合など
          }
          return;
        }
        let shareUrl = '#';
        switch (type) {
          case 'x':
            shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'line':
            shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
            break;
          case 'instagram':
            shareUrl = `https://www.instagram.com/`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n' + url)}`;
            break;
          default:
            shareUrl = '#';
        }
        if (shareUrl !== '#') window.open(shareUrl, '_blank', 'noopener');
      });
    });
  }

  /* --- ゲーム操作 --- */
  function onCellClick(e) {
    const idx = Number(e.currentTarget.dataset.index);
    if (state.phase === 'place') {
      handlePlaceMine(idx);
    } else if (state.phase === 'land') {
      handleLand(idx);
    } else {
      // それ以外は無視
    }
  }

  function handlePlaceMine(idx) {
    const player = state.players[state.placingPlayerIndex];
    if (state.placedCounts[player] >= state.maxMinesPerPlayer) {
      updateDescription(`${player} の地雷は既に ${state.maxMinesPerPlayer} 個埋められています`);
      return;
    }
    // マスに最大3個まで
    if (state.mines[idx] >= 3) {
      updateDescription('このマスにはこれ以上地雷を埋められません');
      return;
    }
    state.mines[idx] += 1;
    // mineOwners を更新
    const owners = state.mineOwners[idx];
    owners[player] = (owners[player] || 0) + 1;

    state.placedCounts[player] += 1;
    updateDescription(`${player} がマス ${idx + 1} に地雷を埋めました (${state.placedCounts[player]}/${state.maxMinesPerPlayer})`);
    renderCellVisual(idx, false);
    // 次のプレイヤーの地雷埋めフェーズへ
    if (state.placedCounts[player] >= state.maxMinesPerPlayer) {
      state.placingPlayerIndex++;
      if (state.placingPlayerIndex >= state.players.length) {
        // 全員が地雷を埋め終わった -> 着地フェーズへ
        state.phase = 'land';
        state.turnIndex = 0;
        updateDescription(`${state.players[0]} が着地するマスを選んで下さい`);
        // If next player is COM, auto-land for COM
        maybeAutoForCOM();
      } else {
        updateDescription(`${state.players[state.placingPlayerIndex]} が地雷を ${state.maxMinesPerPlayer} つ埋めて下さい`);
        // If COM needs to place, do it automatically
        maybeAutoPlaceForCOM();
      }
    } else {
      updateDescription(`${player} が地雷を ${state.maxMinesPerPlayer} つ埋めて下さい (${state.placedCounts[player]}/${state.maxMinesPerPlayer})`);
    }
  }

  function maybeAutoPlaceForCOM() {
    const player = state.players[state.placingPlayerIndex];
    if (player === 'COM') {
      // COM はランダムに残り必要数を埋める（重複可）
      const need = state.maxMinesPerPlayer - state.placedCounts[player];
      for (let i = 0; i < need; i++) {
        let attempts = 0;
        while (true) {
          const idx = Math.floor(Math.random() * 9);
          attempts++;
          if (state.mines[idx] < 3) {
            state.mines[idx] += 1;
            const owners = state.mineOwners[idx];
            owners['COM'] = (owners['COM'] || 0) + 1;
            state.placedCounts[player] += 1;
            break;
          }
          if (attempts > 50) break; // 念のための安全策
        }
      }
      updateDescription('COM が地雷を埋めました');
      state.placingPlayerIndex++;
      if (state.placingPlayerIndex >= state.players.length) {
        state.phase = 'land';
        state.turnIndex = 0;
        updateDescription(`${state.players[0]} が着地するマスを選んで下さい`);
        maybeAutoForCOM();
      } else {
        updateDescription(`${state.players[state.placingPlayerIndex]} が地雷を ${state.maxMinesPerPlayer} つ埋めて下さい`);
        maybeAutoPlaceForCOM();
      }
    }
  }

  function handleLand(idx) {
    const player = state.players[state.turnIndex];
    // 既に誰かが着地している場合は上書き不可
    if (state.occupants[idx]) {
      updateDescription('そのマスには既に着地しています。別のマスを選んで下さい');
      return;
    }
    state.occupants[idx] = player;
    updateDescription(`${player} がマス ${idx + 1} に着地しました`);
    renderCellVisual(idx, false);
    // カーソル枠は自動で消える（UI上は選択時に枠を表示しない実装）
    state.turnIndex++;
    if (state.turnIndex >= state.players.length) {
      // 全員着地完了
      state.phase = 'readyToExplode';
      updateDescription('全員着地! 下の爆破スイッチを押す!');
      state.hideInfoUntilExplosion = true;
    } else {
      updateDescription(`${state.players[state.turnIndex]} が着地するマスを選んで下さい`);
      maybeAutoForCOM();
    }
  }

  function maybeAutoForCOM() {
    const current = state.players[state.turnIndex];
    if (current === 'COM' && state.phase === 'land') {
      // COM はランダムに空いているマスに着地するが、
      // 「COM が地雷を置いたマス」には着地しないようにする
      const empty = [];
      for (let i = 0; i < 9; i++) {
        if (!state.occupants[i]) {
          const owners = state.mineOwners[i] || {};
          // COM がそのマスに地雷を置いていない場合のみ候補に入れる
          if (!owners['COM'] || owners['COM'] === 0) empty.push(i);
        }
      }
      // もし COM が置いたマス以外に空きがない場合は、通常の空きマスから選ぶ（フォールバック）
      if (empty.length === 0) {
        for (let i = 0; i < 9; i++) if (!state.occupants[i]) empty.push(i);
      }
      if (empty.length === 0) return;
      const idx = empty[Math.floor(Math.random() * empty.length)];
      // 少し遅延して着地感を出す
      setTimeout(() => {
        handleLand(idx);
      }, 600);
    }
  }

  /* --- 爆破処理 --- */
  async function triggerExplosion() {
    if (state.phase !== 'readyToExplode' && state.phase !== 'land') {
      updateDescription('まだ爆破できません');
      return;
    }

    // --- ここで確実に AudioContext を用意し、マスターゲインに音量を反映する ---
    await ensureAudioCtx();
    if (audioCtx && masterGain) {
      try {
        // 既存のスケジュールをクリアしてから設定
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(state.volume, audioCtx.currentTime);
      } catch (e) {
        try { masterGain.gain.value = state.volume; } catch (e2) {}
      }
    }
    // ---------------------------------------------------------------

    state.phase = 'exploded';
    state.hideInfoUntilExplosion = false;
    renderAllCellsReveal();

    // 再生前に AudioContext が suspended なら resume（念のため）
    try {
      if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();
    } catch (e) {}

    // 爆破音を鳴らす（await してから演出）
    try {
      await playBoomSound(state.volume);
    } catch (err) {
      console.warn('playBoomSound error', err);
    }

    flashBackgroundRed(5000);
    // ダメージ計算
    const damageLog = [];
    state.players.forEach(player => {
      // player がどのマスにいるかを探す
      const idx = state.occupants.findIndex(p => p === player);
      if (idx === -1) {
        damageLog.push(`${player} は着地していません`);
        return;
      }
      const mineCount = state.mines[idx] || 0;
      if (mineCount === 0) {
        damageLog.push(`${player} 着地成功☆`);
      } else if (mineCount === 1) {
        state.hearts[player] = Math.max(0, state.hearts[player] - 1);
        damageLog.push(`${player} 地雷を1つ踏んだ!`);
      } else if (mineCount >= 2) {
        state.hearts[player] = 0;
        damageLog.push(`${player} 地雷${mineCount}つ踏んだ!!　${player} の負け`);
      }
    });
    renderHearts();
    updateDescription(damageLog.join('　'));
    // 5秒後に地雷を0にして次ラウンドへ
    setTimeout(() => {
      state.mines = Array(9).fill(0);
      state.mineOwners = Array(9).fill(null).map(() => ({}));
      state.occupants = Array(9).fill(null);
      // ゲームオーバー判定
      const someoneDead = state.players.some(p => state.hearts[p] <= 0);
      if (someoneDead) {
        state.phase = 'gameover';
        const losers = state.players.filter(p => state.hearts[p] <= 0);
        updateDescription(`ゲームオーバー: ${losers.join(', ')} のハートが0になりました`);
      } else {
        // 次ラウンド: 全員再び地雷を埋めるフェーズ
        state.phase = 'place';
        state.placingPlayerIndex = 0;
        state.players.forEach(p => state.placedCounts[p] = 0);
        updateDescription(`${state.players[0]} が地雷を ${state.maxMinesPerPlayer} つ埋めて下さい`);
        clearGridVisuals();
      }
    }, 5000);
  }

  /* --- 表示更新 --- */
  function renderUI() {
    // モードボタンの active 表示
    el.modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.mode);
    });
    renderGrid();
    renderHearts();
  }

  function renderGrid() {
    for (let i = 0; i < 9; i++) renderCellVisual(i, true);
  }

  function renderCellVisual(idx, hideSensitive) {
    const cell = el.grid.querySelector(`.grid-cell[data-index="${idx}"]`);
    if (!cell) return;
    const mineCount = state.mines[idx];
    const occupant = state.occupants[idx];
    const mineEl = cell.querySelector('.mine-count');
    const occEl = cell.querySelector('.occupant-label');
    const bombIcon = cell.querySelector('.bomb-icon');
    const humanIcon = cell.querySelector('.human-icon');

    // 表示ルール:
    if (state.hideInfoUntilExplosion) {
      mineEl.textContent = '';
      occEl.textContent = '';
      bombIcon.style.opacity = '0';
      humanIcon.style.opacity = '0';
    } else {
      mineEl.textContent = mineCount > 0 ? `x${mineCount}` : '';
      occEl.textContent = occupant ? occupant : '';
      bombIcon.style.opacity = mineCount > 0 ? '1' : '0';
      humanIcon.style.opacity = occupant ? '1' : '0';
      bombIcon.style.transform = `scale(${1 + (mineCount > 0 ? (mineCount - 1) * 0.25 : 0)})`;
    }
  }

  function renderAllCellsReveal() {
    state.hideInfoUntilExplosion = false;
    for (let i = 0; i < 9; i++) renderCellVisual(i, false);
  }

  function clearGridVisuals() {
    state.hideInfoUntilExplosion = true;
    for (let i = 0; i < 9; i++) {
      const cell = el.grid.querySelector(`.grid-cell[data-index="${i}"]`);
      if (!cell) continue;
      cell.querySelector('.mine-count').textContent = '';
      cell.querySelector('.occupant-label').textContent = '';
      cell.querySelector('.bomb-icon').style.opacity = '0';
      cell.querySelector('.human-icon').style.opacity = '0';
    }
  }

  function renderHearts() {
    el.heartsWrap.innerHTML = '';
    state.players.forEach(p => {
      const wrap = document.createElement('div');
      wrap.className = 'player-heart';
      wrap.innerHTML = `<strong>${p}</strong> <span class="hearts">${'❤'.repeat(state.hearts[p])}${'♡'.repeat(state.maxHearts - state.hearts[p])}</span>`;
      el.heartsWrap.appendChild(wrap);
    });
  }

  /* --- 効果音と演出 --- */
  // playBoomSound は Promise を返し、音が終わると解決する
  // ここを「ボガーン」という低い重い音になるように調整
async function playBoomSound(volume = 0.8) {
  const ctx = await ensureAudioCtx();
  if (!ctx) return Promise.resolve();
  try { if (ctx.state === 'suspended') await ctx.resume(); } catch (e) {}

  return new Promise((resolve) => {
    try {
      const now = ctx.currentTime;

      // --- メイン低域（ピッチスイープで「落ちる」感） ---
      const lowOsc = ctx.createOscillator();
      lowOsc.type = 'sine';
      lowOsc.frequency.setValueAtTime(80, now); // 開始周波数（高めにして落とす）
      // ピッチをゆっくり下げる（ボーン→ボガーン感）
      lowOsc.frequency.exponentialRampToValueAtTime(28, now + 1.6);

      // --- サブ低音で厚み（より低く、少しデチューン） ---
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(40, now);
      subOsc.detune.setValueAtTime(-12, now); // 少し下にデチューン

      // --- 中低域のアタック用ノイズ（長めにして低域寄り） ---
      const noiseDur = 0.5; // ノイズを少し長めに
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        // 初速の強い衝撃感を与えつつ徐々に減衰
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * (0.8);
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      // ノイズは低域寄りにフィルタリングして「ボガーン」のアタックに
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(200, now);
      noiseFilter.Q.setValueAtTime(0.8, now);

      // --- 軽い歪みで迫力を追加 ---
      const waveShaper = ctx.createWaveShaper();
      function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n = 44100;
        const curve = new Float32Array(n);
        const deg = Math.PI / 180;
        for (let i = 0; i < n; ++i) {
          const x = (i * 2) / n - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }
      waveShaper.curve = makeDistortionCurve(8);
      waveShaper.oversample = '2x';

      // --- ローシェルフで低域をブースト（重さを強調） ---
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.setValueAtTime(120, now);
      lowShelf.gain.setValueAtTime(6, now); // +6dB 程度

      // --- 簡易リバーブ／ディレイで長い余韻を作る ---
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.12, now);
      const fb = ctx.createGain();
      fb.gain.setValueAtTime(0.45, now); // フィードバック量（余韻の長さ）
      // 高域を少し削るフィードバック用フィルタ
      const fbFilter = ctx.createBiquadFilter();
      fbFilter.type = 'lowpass';
      fbFilter.frequency.setValueAtTime(1200, now);

      // --- ゲインとエンベロープ ---
      const gain = ctx.createGain();
      const noiseGain = ctx.createGain();

      // マスター接続
      if (masterGain) {
        gain.connect(masterGain);
        noiseGain.connect(masterGain);
      } else {
        gain.connect(ctx.destination);
        noiseGain.connect(ctx.destination);
      }

      // ディレイのループ接続（delay -> fbFilter -> fb -> delay）
      delay.connect(fbFilter);
      fbFilter.connect(fb);
      fb.connect(delay);
      // ディレイ出力をマスターに混ぜる（余韻）
      delay.connect(gain);

      // 接続
      lowOsc.connect(lowShelf);
      subOsc.connect(lowShelf);
      lowShelf.connect(gain);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(waveShaper);
      waveShaper.connect(noiseGain);
      noiseGain.connect(gain);

      // エンベロープ設定（低音はゆっくり立ち上がり、長めに減衰）
      const attack = 0.03;
      const decay = 2.0; // 長めにして余韻を強調
      const sustainLevel = 0.3;
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.95), now + attack);
        gain.gain.exponentialRampToValueAtTime(sustainLevel, now + attack + decay);
      } catch (e) {
        try { gain.gain.value = volume * 0.95; } catch (e2) {}
      }

      // ノイズは短めの強いアタックで破裂感を出すが、少し長めに尾を残す
      try {
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.006);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      } catch (e) {
        try { noiseGain.gain.value = volume * 0.7; } catch (e2) {}
      }

      // スタート
      lowOsc.start(now);
      subOsc.start(now);
      noiseSrc.start(now);

      // 停止タイミング（余韻を含めて長め）
      const stopAt = now + 2.6;
      lowOsc.stop(stopAt);
      subOsc.stop(stopAt);
      noiseSrc.stop(now + noiseDur);

      // 終了後に解放
      setTimeout(() => {
        try { lowOsc.disconnect(); } catch (e) {}
        try { subOsc.disconnect(); } catch (e) {}
        try { noiseSrc.disconnect(); } catch (e) {}
        try { noiseFilter.disconnect(); } catch (e) {}
        try { waveShaper.disconnect(); } catch (e) {}
        try { gain.disconnect(); } catch (e) {}
        try { noiseGain.disconnect(); } catch (e) {}
        try { lowShelf.disconnect(); } catch (e) {}
        try { delay.disconnect(); } catch (e) {}
        try { fb.disconnect(); } catch (e) {}
        try { fbFilter.disconnect(); } catch (e) {}
      }, 3000);

      // resolve は音が止まる少し後に呼ぶ
      setTimeout(() => resolve(), 2800);
    } catch (err) {
      console.warn('Error while playing boom sound', err);
      resolve();
    }
  });
}

  function flashBackgroundRed(duration = 5000) {
    const body = document.body;
    body.classList.add('flash-red');
    setTimeout(() => body.classList.remove('flash-red'), duration);
  }

  /* --- 説明文と SEO 用の動的テキスト --- */
  function updateDescription(text) {
    el.desc.innerHTML = `<p>${escapeHtml(text)}</p>`;
  }

  function generateLinksList(items) {
    return `<ul>${items.map(i => `<li><a href="${i.href}" class="blue-link">${escapeHtml(i.text)}</a></li>`).join('')}</ul>`;
  }

  /* --- ユーティリティ --- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* --- 初期化呼び出し --- */
  document.addEventListener('DOMContentLoaded', init);

})();