// game.js - 全文（式: a×b÷c の計算、タイトルは「かけ算わり算ゲーム」）
(() => {
  const state = {
    mode: null,
    displayLabelSecond: 'COM',
    // 各プレイヤーは内部IDで '1P' と 'COM'
    slots: {
      '1P': [null, null, null],
      'COM': [null, null, null]
    },
    turnOrder: [],
    currentPickIndex: 0,
    running: false,
    shuffleTimer: null,
    shuffleValue: 1,
    picksPerPlayer: 3,
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
    resetBtn: null,
    title: null
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
    el.title = document.getElementById('title');

    el.btn1p.addEventListener('click', () => startGame('1p'));
    el.btn2p.addEventListener('click', () => startGame('2p'));
    el.bigBtn.addEventListener('click', onBigButton);
    el.resetBtn.addEventListener('click', resetToStart);

    ['1P', 'COM'].forEach(id => {
      el.playerRows[id] = {
        container: document.getElementById(`row-${id}`),
        slots: Array.from({ length: 3 }, (_, i) => document.getElementById(`${id}-s${i}`)),
        score: document.getElementById(`${id}-score`),
        label: document.getElementById(`${id}-label`),
        formulaText: document.getElementById(`${id}-formula`)
      };
    });
  }

  function startGame(mode) {
    state.mode = mode;
    state.displayLabelSecond = mode === '2p' ? '2P' : 'COM';
    state.slots = { '1P': [null, null, null], 'COM': [null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;

    el.screenStart.style.display = 'none';
    el.gameScreen.style.display = 'block';
    el.resetBtn.style.display = 'none';
    el.playerRows['COM'].label.textContent = state.displayLabelSecond;
    el.title.textContent = 'かけ算わり算ゲーム';

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
    state.slots = { '1P': [null, null, null], 'COM': [null, null, null] };
    state.currentPickIndex = 0;
    state.running = false;
    state.activeSlot = null;
    el.gameScreen.style.display = 'none';
    el.screenStart.style.display = 'flex';
    el.title.textContent = 'かけ算わり算ゲーム';
    setMessage('');
  }

  function onBigButton() {
    if (state.running) {
      stopShuffle(true);
    } else {
      if (state.currentPickIndex >= state.turnOrder.length) return;
      const currentPlayer = state.turnOrder[state.currentPickIndex];
      const playerSlotIndex = getNextSlotIndex(currentPlayer);
      if (playerSlotIndex === null) return;
      startShuffle(currentPlayer, playerSlotIndex);
    }
  }

  function getNextSlotIndex(playerId) {
    const arr = state.slots[playerId];
    for (let i = 0; i < arr.length; i++) if (arr[i] === null) return i;
    return null;
  }

  function startShuffle(playerId, slotIndex) {
    if (state.running) return;
    state.running = true;
    state.activeSlot = { playerId, slotIndex };
    el.bigBtn.textContent = 'とめる';
    el.bigBtn.classList.add('stop-mode');

    state.shuffleTimer = setInterval(() => {
      state.shuffleValue = randInt(1, 9);
      renderShufflePreview(playerId, slotIndex, state.shuffleValue);
    }, 80);

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
        setMessage(`${displayLabelOf(state.turnOrder[state.currentPickIndex])} の番です`);
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
      for (let i = 0; i < 3; i++) {
        const v = arr[i];
        row.slots[i].textContent = v === null ? '□' : v;
        row.slots[i].classList.toggle('filled', v !== null);
      }
      updateFormulaDisplay(key);
      const score = computeScore(arr);
      row.score.textContent = score === null ? '-' : formatScoreValue(score);
    });
    highlightNextPick();
  }

  function formatScoreValue(n) {
    if (n === null) return '得点';
    if (Number.isFinite(n)) {
      if (Number.isInteger(n)) return String(n);
      return String(Number(n.toFixed(2)));
    }
    return String(n);
  }

  function updateFormulaDisplay(playerId) {
    const row = el.playerRows[playerId];
    if (!row) return;
    const arr = state.slots[playerId];
    const a = arr[0] === null ? '□' : arr[0];
    const b = arr[1] === null ? '□' : arr[1];
    const c = arr[2] === null ? '□' : arr[2];
    const score = computeScore(arr);
    const scoreText = score === null ? '得点' : formatScoreValue(score);
    row.formulaText.textContent = `${a}×${b}÷${c}＝${scoreText}`;
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
    if (!arr || arr.length < 3) return null;
    if (arr.some(v => v === null)) return null;
    const a = arr[0];
    const b = arr[1];
    const c = arr[2];
    // 演算は a * b / c
    const result = a * b / c;
    return result;
  }

  function finalizeGame() {
    updateAllDisplays();
    const s1 = computeScore(state.slots['1P']);
    const s2 = computeScore(state.slots['COM']);
    let message = '';
    if (s1 === null || s2 === null) {
      message = '結果を計算できません';
    } else if (s1 > s2) {
      message = `1P の勝ち！ ${formatScoreValue(s1)} 対 ${formatScoreValue(s2)}`;
    } else if (s2 > s1) {
      message = `${state.displayLabelSecond} の勝ち！ ${formatScoreValue(s1)} 対 ${formatScoreValue(s2)}`;
    } else {
      message = `引き分け ${formatScoreValue(s1)} 対 ${formatScoreValue(s2)}`;
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
    el.title.textContent = 'かけ算わり算ゲーム';
    setMessage('');
  });

  window.__mathGameReset = resetToStart;
})();