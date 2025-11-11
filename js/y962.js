(() => {
  const state = {
    mode: null,
    displayLabelSecond: 'COM',
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
    replayBtn: null
  };

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function bind() {
    el.screenStart = document.getElementById('start-screen');
    el.btn1p = document.getElementById('start-1p');
    el.btn2p = document.getElementById('start-2p');
    el.gameScreen = document.getElementById('game-screen');
    el.bigBtn = document.getElementById('big-button');
    el.msg = document.getElementById('message');
    el.replayBtn = document.getElementById('replay-button');

    el.btn1p.addEventListener('click', () => startGame('1p'));
    el.btn2p.addEventListener('click', () => startGame('2p'));
    el.bigBtn.addEventListener('click', onBigButton);
    el.replayBtn.addEventListener('click', replayGame);

    ['1P', 'COM'].forEach(id => {
      el.playerRows[id] = {
        container: document.getElementById(`row-${id}`),
        slots: Array.from({ length: 4 }, (_, i) => document.getElementById(`${id}-s{i}`.replace('{i}', i))),
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
    el.replayBtn.style.display = 'none';
    el.playerRows['COM'].label.textContent = state.displayLabelSecond;

    buildTurnOrder();
    setMessage(`${displayLabelOf(state.turnOrder[0])} の番です`, { big: true });
    updateAllDisplays();
    updateBigButtonState();
    maybeAutoPlayForCOM();
  }

  function replayGame() {
    if (!state.mode) return;
    stopShuffleImmediate();
    state.slots = { '1P': [null, null, null, null], 'COM': [null, null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;
    el.replayBtn.style.display = 'none';
    el.playerRows['COM'].label.textContent = state.displayLabelSecond;

    buildTurnOrder();
    setMessage(`${displayLabelOf(state.turnOrder[0])} の番です`, { big: true });
    updateAllDisplays();
    updateBigButtonState();
    maybeAutoPlayForCOM();
  }

  function buildTurnOrder() {
    state.turnOrder = [];
    for (let r = 0; r < state.picksPerPlayer; r++) {
      state.turnOrder.push('1P');
      state.turnOrder.push('COM');
    }
  }

  function onBigButton() {
    // 無効化条件: ゲーム終了済 or 回転中以外で、かつ COM の番（1人用モード）の場合は無視
    if (state.currentPickIndex >= state.turnOrder.length) return;
    const currentPlayer = state.turnOrder[state.currentPickIndex];
    if (currentPlayer === 'COM' && state.mode === '1p') return;
    if (state.running) {
      // 回転中にボタン押下で停止（ただし COM の自動回転時にユーザー操作で止めさせない）
      // COM の自動回転中は activeSlot.playerId === 'COM' だが mode が '1p' の場合は先に弾いているためここは安全
      stopShuffle(true);
    } else {
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

  function startShuffle(playerId, slotIndex) {
    if (state.running) return;
    // ユーザー操作での開始は COM のターンで 1人用モードならブロック済み
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

  function renderShufflePreview(playerId, slotIndex, value) {
    const row = el.playerRows[playerId];
    if (!row) return;
    row.slots[slotIndex].textContent = value;
    row.slots[slotIndex].classList.add('preview');
    updateFormulaDisplay(playerId);
  }

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
        setMessage(`${displayLabelOf(state.turnOrder[state.currentPickIndex])} の番です`, { big: true });
        maybeAutoPlayForCOM();
      }
    } else {
      setMessage('ストップされました');
    }
    updateBigButtonState();
  }

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
      setMessage(message);
    } else if (s1 > s2) {
      message = `1P の勝ち！ ${s1} 対 ${s2}`;
      setMessage(message, { big: true });
    } else if (s2 > s1) {
      message = `${state.displayLabelSecond} の勝ち！ ${s1} 対 ${s2}`;
      setMessage(message, { big: true });
    } else {
      message = `引き分け ${s1} 対 ${s2}`;
      setMessage(message, { big: true });
    }
    el.bigBtn.disabled = true;
    el.replayBtn.style.display = 'inline-block';
  }

  function setMessage(txt, opts = {}) {
    const big = opts.big || /の番です|勝ち|引き分け/.test(txt);
    if (big) {
      el.msg.innerHTML = `<strong class="big-msg-text">${txt}</strong>`;
      el.msg.classList.add('big-msg');
    } else {
      el.msg.textContent = txt;
      el.msg.classList.remove('big-msg');
      el.msg.innerHTML = txt;
    }
  }

  function updateBigButtonState() {
    if (state.currentPickIndex >= state.turnOrder.length) {
      el.bigBtn.disabled = true;
      return;
    }
    const currentPlayer = state.turnOrder[state.currentPickIndex];
    // COM の番で 1人用ならボタンを無効化
    if (currentPlayer === 'COM' && state.mode === '1p') {
      el.bigBtn.disabled = true;
    } else {
      el.bigBtn.disabled = false;
    }
    if (!state.running) el.bigBtn.textContent = 'すうじ';
  }

  function displayLabelOf(internalId) {
    return internalId === 'COM' ? state.displayLabelSecond : internalId;
  }

  function maybeAutoPlayForCOM() {
    if (state.currentPickIndex >= state.turnOrder.length) return;
    const next = state.turnOrder[state.currentPickIndex];
    if (next === 'COM' && state.displayLabelSecond === 'COM') {
      // COM の自動処理中はユーザーによるボタン反応を無効にしておく
      setTimeout(() => {
        if (!state.running && state.currentPickIndex < state.turnOrder.length) {
          const playerSlotIndex = getNextSlotIndex('COM');
          if (playerSlotIndex !== null) startShuffle('COM', playerSlotIndex);
        }
      }, randInt(400, 900));
    }
    updateBigButtonState();
  }

  document.addEventListener('DOMContentLoaded', () => {
    bind();
    el.gameScreen.style.display = 'none';
    el.replayBtn.style.display = 'none';
    setMessage('');
  });

  window.__mathGameReset = () => {
    // 互換用：常に最初のスタート画面に戻す
    stopShuffleImmediate();
    state.mode = null;
    state.displayLabelSecond = 'COM';
    state.slots = { '1P': [null, null, null, null], 'COM': [null, null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;
    el.gameScreen.style.display = 'none';
    el.screenStart.style.display = 'flex';
    el.replayBtn.style.display = 'none';
    setMessage('');
  };
})();