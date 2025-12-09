// js - 修正版
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  const startBtn = document.getElementById('startBtn');
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const volumeSlider = document.getElementById('volume');
  const resultOverlay = document.getElementById('resultOverlay');
  const resultScore = document.getElementById('resultScore');

  // 上部（ヘッダ）にあるシェアボタン群（HTML上の上部ボタンを想定）
  const headerShareButtons = {
    x: document.querySelectorAll('header .shareBtn.x, .shareRow .shareBtn.x, #shareX'),
    fb: document.querySelectorAll('header .shareBtn.fb, .shareRow .shareBtn.fb, #shareFB'),
    line: document.querySelectorAll('header .shareBtn.line, .shareRow .shareBtn.line, #shareLINE'),
    mail: document.querySelectorAll('header .shareBtn.mail, .shareRow .shareBtn.mail, #shareMail'),
    native: document.querySelectorAll('header .shareBtn.native, .shareRow .shareBtn.native, #shareNative')
  };

  // ゲーム状態
  let running = false;
  let score = 0;
  let remaining = 60;
  let spawnIntervalId = null;
  let gameTimerId = null;
  let spawnRate = 900;
  let globalVolume = Number(volumeSlider?.value ?? 0.6);

  // タッチ二重発火／ダブルタップ抑止
  let lastTapTime = 0;
  const DOUBLE_TAP_THRESHOLD = 350;

  // AudioContext（ユーザー操作時に resume）
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  function ensureAudioCtx() {
    if (!AudioCtx) return null;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    return audioCtx;
  }

  // 共有リンクをヘッダのボタンに設定（ヘッダのみ）
  function updateHeaderShareLinks() {
    const text = encodeURIComponent(`暇つぶしブラウザゲームで${score}点を獲得しました！`);
    const url = encodeURIComponent(location.href);

    headerShareButtons.x.forEach(a => {
      if (a) {
        a.setAttribute('href', `https://twitter.com/intent/tweet?text=${text}&url=${url}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
    headerShareButtons.fb.forEach(a => {
      if (a) {
        a.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
    headerShareButtons.line.forEach(a => {
      if (a) {
        a.setAttribute('href', `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
    headerShareButtons.mail.forEach(a => {
      if (a) {
        a.setAttribute('href', `mailto:?subject=${encodeURIComponent('暇つぶしブラウザゲームのスコア')}&body=${text}%0A${url}`);
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
    // ネイティブ共有はクリック時に navigator.share を使う（hrefは不要）
  }

  // ヘッダのシェアボタンにクリックハンドラを付与（ヘッダボタンが確実に動くように）
  function attachHeaderShareHandlers() {
    // 汎用リンク系（X, FB, LINE, Mail）
    ['x','fb','line','mail'].forEach(key => {
      headerShareButtons[key].forEach(el => {
        if (!el) return;
        // 既存のリスナを重複して付けないために一旦削除（安全策）
        el.removeEventListener('click', headerShareClickHandler);
        el.addEventListener('click', headerShareClickHandler);
      });
    });
    // ネイティブ共有（ヘッダ）
    headerShareButtons.native.forEach(el => {
      if (!el) return;
      el.removeEventListener('click', headerNativeShareHandler);
      el.addEventListener('click', headerNativeShareHandler);
    });
  }

  function headerShareClickHandler(e) {
    const el = e.currentTarget;
    const href = el.getAttribute('href');
    if (!href) return;
    if (href.startsWith('mailto:')) {
      // mailto は既定の動作に任せる
      return;
    }
    e.preventDefault();
    window.open(href, '_blank', 'noopener');
  }

  async function headerNativeShareHandler(e) {
    e.preventDefault();
    const shareText = `暇つぶしブラウザゲームで${score}点を獲得しました！ ${location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: '暇つぶしブラウザゲーム', text: shareText, url: location.href }); }
      catch (_) {}
    } else {
      const mailUrl = `mailto:?subject=${encodeURIComponent('暇つぶしブラウザゲームのスコア')}&body=${encodeURIComponent(shareText)}`;
      window.open(mailUrl, '_blank', 'noopener');
    }
  }

  // ポップ音（簡易）
  function playPop() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 800 + Math.random() * 200;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12 * globalVolume, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.start(now);
    o.stop(now + 0.2);
    setTimeout(()=>{ try { o.disconnect(); g.disconnect(); } catch(e){} }, 400);
  }

  // ターゲット生成
  function spawnHima() {
    if (!running || !stage) return;
    if (stage.querySelectorAll('.hima').length >= 12) return;

    const hima = document.createElement('span');
    hima.className = 'hima';
    hima.textContent = '暇';
    hima.setAttribute('role', 'button');
    hima.setAttribute('tabindex', '0');
    hima.style.position = 'absolute';
    hima.style.userSelect = 'none';
    hima.style.webkitUserSelect = 'none';
    hima.style.webkitTouchCallout = 'none';

    const size = 28 + Math.floor(Math.random() * 36);
    hima.style.fontSize = size + 'px';

    const rect = stage.getBoundingClientRect();
    const padding = 8;
    const maxLeft = Math.max(0, rect.width - size - padding * 2);
    const maxTop = Math.max(0, rect.height - size - padding * 2);
    const x = Math.random() * maxLeft + padding;
    const y = Math.random() * maxTop + padding;
    hima.style.left = Math.round(x) + 'px';
    hima.style.top = Math.round(y) + 'px';
    hima.style.opacity = '0';
    hima.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg) scale(0.95)`;

    stage.appendChild(hima);

    requestAnimationFrame(() => {
      hima.style.transition = 'transform .18s ease, opacity .18s ease';
      hima.style.opacity = '1';
      hima.style.transform = hima.style.transform.replace('scale(0.95)', 'scale(1)');
    });

    // 自動削除タイマー
    const removeTimer = setTimeout(() => {
      if (hima.parentNode) {
        hima.classList.add('fadeout');
        setTimeout(() => { if (hima.parentNode) hima.parentNode.removeChild(hima); }, 300);
      }
    }, 6000);
    hima._removeTimer = removeTimer;

    // pointerdown で統一
    const onPop = (ev) => {
      if (ev.type === 'pointerdown' && ev.pointerType === 'touch') {
        const now = Date.now();
        if (now - lastTapTime < DOUBLE_TAP_THRESHOLD) {
          ev.preventDefault();
          return;
        }
        lastTapTime = now;
      }
      try { ev.preventDefault(); } catch (e) {}
      if (hima._removeTimer) { clearTimeout(hima._removeTimer); hima._removeTimer = null; }

      hima.classList.add('explode');
      playPop();

      score += 10;
      scoreEl.textContent = score;

      setTimeout(() => { if (hima.parentNode) hima.parentNode.removeChild(hima); }, 220);

      // ヘッダのシェアリンクを最新化（ヘッダのみ）
      updateHeaderShareLinks();
    };

    hima.addEventListener('pointerdown', onPop, { once: true });
    hima.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPop(new PointerEvent('pointerdown', { bubbles: true }));
      }
    });
  }

  // スポーン管理
  function startSpawning() {
    stopSpawning();
    spawnIntervalId = setInterval(() => {
      if (!running) return;
      if (remaining <= 30) {
        spawnHima();
        if (Math.random() < 0.5) spawnHima();
      } else {
        spawnHima();
      }
    }, spawnRate);
  }
  function stopSpawning() {
    if (spawnIntervalId) { clearInterval(spawnIntervalId); spawnIntervalId = null; }
  }

  // ゲーム開始 / 終了
  function startGame() {
    if (running) return;
    running = true;
    score = 0;
    remaining = 60;
    scoreEl.textContent = score;
    timerEl.textContent = remaining;
    if (resultOverlay) resultOverlay.classList.remove('visible');

    ensureAudioCtx();
    startSpawning();

    if (gameTimerId) clearInterval(gameTimerId);
    gameTimerId = setInterval(() => {
      remaining--;
      timerEl.textContent = remaining;
      if (remaining === 30) {
        stopSpawning();
        spawnRate = Math.max(200, Math.floor(spawnRate * 0.6));
        startSpawning();
      }
      if (remaining <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    if (!running) return;
    running = false;
    stopSpawning();
    if (gameTimerId) { clearInterval(gameTimerId); gameTimerId = null; }

    // 残っている hima を削除
    Array.from(stage.querySelectorAll('.hima')).forEach(el => {
      if (el._removeTimer) { clearTimeout(el._removeTimer); el._removeTimer = null; }
      el.classList.add('fadeout');
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    });

    // 結果表示（オーバーレイ内のシェアボタンは削除する）
    if (resultScore) resultScore.textContent = score;

    if (resultOverlay) {
      // オーバーレイ内にある .shareBtn 要素をすべて削除（ゲーム終了時だけ表示されるボタンを排除）
      Array.from(resultOverlay.querySelectorAll('.shareBtn')).forEach(btn => {
        try { btn.parentNode && btn.parentNode.removeChild(btn); } catch (e) {}
      });

      // オーバーレイは「この特典をシェアしよう」等のテキストは残す想定
      resultOverlay.classList.add('visible');

      // フォーカス移動（アクセシビリティ）
      const card = resultOverlay.querySelector('.resultCard') || resultOverlay;
      card.setAttribute('tabindex', '-1');
      card.focus();
    }

    // ヘッダのシェアリンクは最新スコアで更新しておく
    updateHeaderShareLinks();
    attachHeaderShareHandlers();
  }

  // ボリューム設定
  function setVolume(v) { globalVolume = Math.max(0, Math.min(1, Number(v))); }

  // ヘッダのシェアハンドラをアタッチ（初期化時と更新時に呼ぶ）
  function attachHeaderShareHandlers() {
    // X/FB/LINE/Mail
    ['x','fb','line','mail'].forEach(key => {
      headerShareButtons[key].forEach(el => {
        if (!el) return;
        el.removeEventListener('click', headerShareClickHandler);
        el.addEventListener('click', headerShareClickHandler);
      });
    });
    // ネイティブ共有
    headerShareButtons.native.forEach(el => {
      if (!el) return;
      el.removeEventListener('click', headerNativeShareHandler);
      el.addEventListener('click', headerNativeShareHandler);
    });
  }

  function headerShareClickHandler(e) {
    const el = e.currentTarget;
    const href = el.getAttribute('href');
    if (!href) return;
    if (href.startsWith('mailto:')) return;
    e.preventDefault();
    window.open(href, '_blank', 'noopener');
  }

  async function headerNativeShareHandler(e) {
    e.preventDefault();
    const shareText = `暇つぶしブラウザゲームで${score}点を獲得しました！ ${location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: '暇つぶしブラウザゲーム', text: shareText, url: location.href }); }
      catch (_) {}
    } else {
      const mailUrl = `mailto:?subject=${encodeURIComponent('暇つぶしブラウザゲームのスコア')}&body=${encodeURIComponent(shareText)}`;
      window.open(mailUrl, '_blank', 'noopener');
    }
  }

  // stage の長押しメニュー抑止
  if (stage) stage.addEventListener('contextmenu', (e) => e.preventDefault());

  // document レベルでのダブルタップ抑止（補助）
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTapTime < DOUBLE_TAP_THRESHOLD) {
      e.preventDefault();
    }
    lastTapTime = now;
  }, { passive: false });

  // 結果オーバーレイの閉じ処理（背景クリックで閉じる）
  if (resultOverlay) {
    resultOverlay.addEventListener('click', (e) => {
      if (e.target === resultOverlay) resultOverlay.classList.remove('visible');
    });
    const closeLink = resultOverlay.querySelector('a[href="#"]');
    if (closeLink) {
      closeLink.addEventListener('click', (e) => { e.preventDefault(); resultOverlay.classList.remove('visible'); });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resultOverlay.classList.contains('visible')) resultOverlay.classList.remove('visible');
    });
  }

  // キーボードショートカット
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (!running) return;
      e.preventDefault();
      const himas = Array.from(stage.querySelectorAll('.hima'));
      if (!himas.length) return;
      const cx = stage.clientWidth / 2;
      const cy = stage.clientHeight / 2;
      himas.sort((a, b) => {
        const ax = (a.offsetLeft + a.offsetWidth / 2) - cx;
        const ay = (a.offsetTop + a.offsetHeight / 2) - cy;
        const bx = (b.offsetLeft + b.offsetWidth / 2) - cx;
        const by = (b.offsetTop + b.offsetHeight / 2) - cy;
        return (ax * ax + ay * ay) - (bx * bx + by * by);
      });
      himas[0].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    } else if (e.code === 'Enter') {
      e.preventDefault();
      if (!running) startBtn && startBtn.click();
      else endGame();
    }
  });

  // リサイズ補正
  window.addEventListener('resize', () => {
    Array.from(stage.querySelectorAll('.hima')).forEach(h => {
      const size = parseFloat(window.getComputedStyle(h).fontSize) || 32;
      const maxLeft = Math.max(0, stage.clientWidth - size - 8);
      const maxTop = Math.max(0, stage.clientHeight - size - 8);
      const left = parseFloat(h.style.left) || 0;
      const top = parseFloat(h.style.top) || 0;
      if (left > maxLeft) h.style.left = maxLeft + 'px';
      if (top > maxTop) h.style.top = maxTop + 'px';
    });
  });

  // 初期化
  updateHeaderShareLinks();
  attachHeaderShareHandlers();
  setVolume(Number(volumeSlider ? volumeSlider.value : 0.6));

  function setVolume(v) { globalVolume = Math.max(0, Math.min(1, Number(v))); }

}); // DOMContentLoaded end