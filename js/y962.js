// game.js - 全文（不具合修正：どのスロットでも回転・停止できるように activeSlot を保持）
(() => {
  const state = {
    mode: null,
    displayLabelSecond: 'COM',
    // 各プレイヤーは内部IDで '1P' と 'COM'
    slots: {
      '1P': [null, null, null, null],
      'COM': [null, null, null, null]
    },
    turnOrder: [],
    currentPickIndex: 0,
    running: false,
    shuffleTimer: null,
    shuffleValue: 1,
    picksPerPlayer: 4,
    // 現在回転中のスロット情報を保持（null または { playerId, slotIndex }）
    activeSlot: null
  };

  const el = {
    screenStart: null,
    btn1p: null,
    btn2p: null,
    gameScreen: null,
    playerRows: {},
    bigBtn: null,
    msg: null,
    resetBtn: null
  };

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function bind() {
    el.screenStart = document.getElementById('start-screen');
    el.btn1p = document.getElementById('start-1p');
    el.btn2p = document.getElementById('start-2p');
    el.gameScreen = document.getElementById('game-screen');
    el.bigBtn = document.getElementById('big-button');
    el.msg = document.getElementById('message');
    el.resetBtn = document.getElementById('reset-button');

    el.btn1p.addEventListener('click', () => startGame('1p'));
    el.btn2p.addEventListener('click', () => startGame('2p'));
    el.bigBtn.addEventListener('click', onBigButton);
    el.resetBtn.addEventListener('click', resetToStart);

    ['1P', 'COM'].forEach(id => {
      el.playerRows[id] = {
        container: document.getElementById(`row-${id}`),
        slots: Array.from({ length: 4 }, (_, i) => document.getElementById(`${id}-s${i}`)),
        score: document.getElementById(`${id}-score`),
        label: document.getElementById(`${id}-label`),
        formulaText: document.getElementById(`${id}-formula`)
      };
    });
  }

  function startGame(mode) {
    state.mode = mode;
    state.displayLabelSecond = mode === '2p' ? '2P' : 'COM';
    state.slots = { '1P': [null, null, null, null], 'COM': [null, null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;

    el.screenStart.style.display = 'none';
    el.gameScreen.style.display = 'block';
    el.resetBtn.style.display = 'none';
    el.playerRows['COM'].label.textContent = state.displayLabelSecond;

    state.turnOrder = [];
    for (let r = 0; r < state.picksPerPlayer; r++) {
      state.turnOrder.push('1P');
      state.turnOrder.push('COM');
    }

    setMessage(`${displayLabelOf(state.turnOrder[0])} の番です`);
    updateAllDisplays();
    updateBigButtonState();
    maybeAutoPlayForCOM();
  }

  function resetToStart() {
    stopShuffleImmediate();
    state.mode = null;
    state.displayLabelSecond = 'COM';
    state.slots = { '1P': [null, null, null, null], 'COM': [null, null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;
    el.gameScreen.style.display = 'none';
    el.screenStart.style.display = 'flex';
    setMessage('');
  }

  function onBigButton() {
    if (state.running) {
      stopShuffle(true);
    } else {
      if (state.currentPickIndex >= state.turnOrder.length) return;
      const currentPlayer = state.turnOrder[state.currentPickIndex];
      // 再計算ではなく、そのターンで決めるべきスロットを直接決定（内部的には turn が順序を保証）
      const playerSlotIndex = getNextSlotIndex(currentPlayer);
      if (playerSlotIndex === null) return;
      startShuffle(currentPlayer, playerSlotIndex);
    }
  }

  // 次の空スロットを返す
  function getNextSlotIndex(playerId) {
    const arr = state.slots[playerId];
    for (let i = 0; i < arr.length; i++) if (arr[i] === null) return i;
    return null;
  }

  // 回転を開始するときに activeSlot に固定しておく（ここが修正点の核）
  function startShuffle(playerId, slotIndex) {
    // 複数回押せないように保護
    if (state.running) return;
    state.running = true;
    state.activeSlot = { playerId, slotIndex };
    el.bigBtn.textContent = 'とめる';
    el.bigBtn.classList.add('stop-mode');

    state.shuffleTimer = setInterval(() => {
      state.shuffleValue = randInt(1, 9);
      renderShufflePreview(playerId, slotIndex, state.shuffleValue);
    }, 80);

    // COM の自動停止（1人用モードのCOM）
    if (playerId === 'COM' && state.displayLabelSecond === 'COM') {
      const delay = randInt(600, 1400);
      setTimeout(() => {
        if (state.running && state.activeSlot && state.activeSlot.playerId === 'COM') stopShuffle(true);
      }, delay);
    }
  }

  // プレビュー表示は activeSlot を使って正確にターゲットを書き換える
  function renderShufflePreview(playerId, slotIndex, value) {
    const row = el.playerRows[playerId];
    if (!row) return;
    // ターゲットスロットだけを一時更新
    row.slots[slotIndex].textContent = value;
    row.slots[slotIndex].classList.add('preview');
    updateFormulaDisplay(playerId);
  }

  // 停止時は activeSlot に基づきコミットする（getNextSlotIndexを使わない）
  function stopShuffle(commit = true) {
    if (!state.running) return;
    clearInterval(state.shuffleTimer);
    state.shuffleTimer = null;
    state.running = false;
    el.bigBtn.textContent = 'すうじ';
    el.bigBtn.classList.remove('stop-mode');

    const active = state.activeSlot;
    if (active && commit) {
      const { playerId, slotIndex } = active;
      // 念のためまだ空かを確認してコミット（重複コミットを避ける）
      if (state.slots[playerId][slotIndex] === null) {
        state.slots[playerId][slotIndex] = state.shuffleValue;
      }
    }

    state.activeSlot = null;
    clearPreviewDisplays();
    updateAllDisplays();

    if (commit) {
      state.currentPickIndex++;
      if (state.currentPickIndex >= state.turnOrder.length) {
        finalizeGame();
      } else {
        setMessage(`${displayLabelOf(state.turnOrder[state.currentPickIndex])} の番です`);
        maybeAutoPlayForCOM();
      }
    } else {
      setMessage('ストップされました');
    }
    updateBigButtonState();
  }

  // 即時停止（再描画やコミットなし、リセット系で使用）
  function stopShuffleImmediate() {
    if (state.shuffleTimer) {
      clearInterval(state.shuffleTimer);
      state.shuffleTimer = null;
    }
    state.running = false;
    state.activeSlot = null;
    el.bigBtn.textContent = 'すうじ';
    el.bigBtn.classList.remove('stop-mode');
    clearPreviewDisplays();
  }

  function clearPreviewDisplays() {
    Object.values(el.playerRows).forEach(row => {
      row.slots.forEach(cell => cell.classList.remove('preview'));
    });
  }

  function updateAllDisplays() {
    Object.keys(el.playerRows).forEach(key => {
      const row = el.playerRows[key];
      row.label.textContent = key === 'COM' ? state.displayLabelSecond : key;
      const arr = state.slots[key];
      for (let i = 0; i < 4; i++) {
        const v = arr[i];
        row.slots[i].textContent = v === null ? '□' : v;
        row.slots[i].classList.toggle('filled', v !== null);
      }
      updateFormulaDisplay(key);
      const score = computeScore(arr);
      row.score.textContent = score === null ? '-' : score;
    });
    highlightNextPick();
  }

  // 例: a＋b＋c－d＝得点（未確定は □、得点は未確定であれば "得点" 表示）
  function updateFormulaDisplay(playerId) {
    const row = el.playerRows[playerId];
    if (!row) return;
    const arr = state.slots[playerId];
    const a = arr[0] === null ? '□' : arr[0];
    const b = arr[1] === null ? '□' : arr[1];
    const c = arr[2] === null ? '□' : arr[2];
    const d = arr[3] === null ? '□' : arr[3];
    const score = computeScore(arr);
    const scoreText = score === null ? '得点' : score;
    row.formulaText.textContent = `${a}＋${b}＋${c}－${d}＝${scoreText}`;
  }

  function highlightNextPick() {
    Object.values(el.playerRows).forEach(row => row.slots.forEach(s => s.classList.remove('active')));
    if (state.currentPickIndex >= state.turnOrder.length) return;
    const currentPlayer = state.turnOrder[state.currentPickIndex];
    const idx = getNextSlotIndex(currentPlayer);
    const row = el.playerRows[currentPlayer];
    if (row && idx !== null) row.slots[idx].classList.add('active');
  }

  function computeScore(arr) {
    if (!arr || arr.length < 4) return null;
    if (arr.some(v => v === null)) return null;
    return arr[0] + arr[1] + arr[2] - arr[3];
  }

  function finalizeGame() {
    updateAllDisplays();
    const s1 = computeScore(state.slots['1P']);
    const s2 = computeScore(state.slots['COM']);
    let message = '';
    if (s1 === null || s2 === null) {
      message = '結果を計算できません';
    } else if (s1 > s2) {
      message = `1P の勝ち！ ${s1} 対 ${s2}`;
    } else if (s2 > s1) {
      message = `${state.displayLabelSecond} の勝ち！ ${s1} 対 ${s2}`;
    } else {
      message = `引き分け ${s1} 対 ${s2}`;
    }
    setMessage(message);
    el.bigBtn.disabled = true;
    el.resetBtn.style.display = 'inline-block';
  }

  function setMessage(txt) {
    el.msg.textContent = txt;
  }

  function updateBigButtonState() {
    if (state.currentPickIndex >= state.turnOrder.length) {
      el.bigBtn.disabled = true;
      return;
    }
    el.bigBtn.disabled = false;
    if (!state.running) el.bigBtn.textContent = 'すうじ';
  }

  function displayLabelOf(internalId) {
    return internalId === 'COM' ? state.displayLabelSecond : internalId;
  }

  function maybeAutoPlayForCOM() {
    if (state.currentPickIndex >= state.turnOrder.length) return;
    const next = state.turnOrder[state.currentPickIndex];
    if (next === 'COM' && state.displayLabelSecond === 'COM') {
      setTimeout(() => {
        if (!state.running && state.currentPickIndex < state.turnOrder.length) {
          // 再度取得した next のスロットで開始（activeSlot を必ずセット）
          const playerSlotIndex = getNextSlotIndex('COM');
          if (playerSlotIndex !== null) startShuffle('COM', playerSlotIndex);
        }
      }, randInt(400, 900));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bind();
    el.gameScreen.style.display = 'none';
    el.resetBtn.style.display = 'none';
    setMessage('');
  });

  window.__mathGameReset = resetToStart;
})();