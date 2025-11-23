const SPIN_DURATION = 200; // ms（高速化）
const COM_THINK = 300; // ms

let gameMode = null;
let player1Scores = [];
let player2Scores = [];
let turn = 1;
let rollIndex = 0;
let isRolling = false;

const modeSelectionEl = document.getElementById('mode-selection');
const gameScreenEl = document.getElementById('game-screen');
const player2TitleEl = document.getElementById('player2-title');
const currentTurnEl = document.getElementById('current-turn');
const gameMessageEl = document.getElementById('game-message');
const player1DiceContainer = document.getElementById('player1-dice-container');
const player2DiceContainer = document.getElementById('player2-dice-container');
const player1ScoreEl = document.getElementById('player1-score');
const player2ScoreEl = document.getElementById('player2-score');
const player1RollResultEl = document.getElementById('player1-roll-result');
const player2RollResultEl = document.getElementById('player2-roll-result');
const rollButton = document.getElementById('roll-button');
const finalResultEl = document.getElementById('final-result');
const resultTextEl = document.getElementById('result-text');

function initDice(containerEl) {
  containerEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dice-face-wrapper';
    wrapper.setAttribute('data-index', i);
    const die = document.createElement('div');
    die.className = 'dice-face';
    die.setAttribute('data-value', '0');
    const pipContainer = document.createElement('div');
    pipContainer.className = 'pip-container';
    die.appendChild(pipContainer);
    const faceTop = document.createElement('div');
    faceTop.className = 'die-top';
    die.appendChild(faceTop);
    wrapper.appendChild(die);
    containerEl.appendChild(wrapper);
  }
}

function renderDieValue(dieEl, value) {
  const pipContainer = dieEl.querySelector('.pip-container');
  pipContainer.innerHTML = '';
  dieEl.setAttribute('data-value', String(value || 0));
  if (!value) return;
  const POS = {
    1: [[50,50]],
    2: [[28,28],[72,72]],
    3: [[50,50],[28,28],[72,72]],
    4: [[28,28],[72,28],[28,72],[72,72]],
    5: [[50,50],[28,28],[72,28],[28,72],[72,72]],
    6: [[28,22],[28,50],[28,78],[72,22],[72,50],[72,78]]
  };
  const coords = POS[value] || [];
  coords.forEach((c) => {
    const span = document.createElement('span');
    span.className = 'pip';
    span.style.left = c[0] + '%';
    span.style.top = c[1] + '%';
    pipContainer.appendChild(span);
  });
}

function startSpinVisual(dieEl) {
  dieEl.classList.add('dice-spinning');
}
function stopSpinVisual(dieEl) {
  dieEl.classList.remove('dice-spinning');
}

function rollSingleDieVisual(dieEl) {
  return new Promise(resolve => {
    startSpinVisual(dieEl);
    setTimeout(() => {
      stopSpinVisual(dieEl);
      const value = Math.floor(Math.random() * 6) + 1;
      renderDieValue(dieEl, value);
      resolve(value);
    }, SPIN_DURATION);
  });
}

function calculateScoreFromArray(diceValues) {
  const counts = {};
  diceValues.forEach(v => { if (v) counts[v] = (counts[v] || 0) + 1; });
  let totalScore = 0;
  let foundZorome = false;
  const messages = [];

  for (let face = 1; face <= 6; face++) {
    const count = counts[face] || 0;
    if (count >= 2) {
      foundZorome = true;
      let groupScore = 0;
      if (face === 1) {
        switch (count) {
          case 2: groupScore = 11; messages.push('1と1で11点'); break;
          case 3: groupScore = 111; messages.push('1の三つ揃いで111点'); break;
          case 4: groupScore = 1111; messages.push('1の四つ揃いで1111点'); break;
          case 5: groupScore = 11111; messages.push('1の五つ揃いで11111点'); break;
          default: break;
        }
      } else {
        groupScore = face * count;
        messages.push(`${face}の${count}つ揃いで${groupScore}点`);
      }
      totalScore += groupScore;
    }
  }

  if (!foundZorome) return { score: 0, message: 'ゾロ目なし、0点' };
  return { score: totalScore, message: `合計 ${totalScore} 点: ${messages.join(' + ')}` };
}

function updateTurnDisplay() {
  currentTurnEl.textContent = turn === 1
    ? `ターン: プレイヤー 1（${Math.min(rollIndex + 1,5)} / 5）`
    : (gameMode === 'com' ? `ターン: COM（${Math.min(rollIndex + 1,5)} / 5）` : `ターン: プレイヤー 2（${Math.min(rollIndex + 1,5)} / 5）`);

  if (turn === 2 && gameMode === 'com') {
    gameMessageEl.textContent = 'COMが振るのを待っています...';
  } else {
    gameMessageEl.textContent = '「サイコロを振る」を押してください。';
  }
}

function startGame(mode) {
  gameMode = mode;
  player1Scores = [];
  player2Scores = [];
  turn = 1;
  rollIndex = 0;
  isRolling = false;

  modeSelectionEl.classList.add('hidden');
  gameScreenEl.classList.remove('hidden');
  finalResultEl.classList.add('hidden');

  player2TitleEl.textContent = (gameMode === 'com' ? 'COM' : 'プレイヤー 2');
  player1ScoreEl.textContent = '0';
  player2ScoreEl.textContent = '0';
  player1RollResultEl.textContent = '';
  player2RollResultEl.textContent = '';

  initDice(player1DiceContainer);
  initDice(player2DiceContainer);

  updateTurnDisplay();
  rollButton.disabled = false;
}

async function handleRoll() {
  if (isRolling) return;
  if (!gameMode) return;
  if (rollIndex >= 5) return;

  isRolling = true;
  rollButton.disabled = true;
  updateTurnDisplay();

  if (turn === 1) {
    gameMessageEl.textContent = 'プレイヤー1がサイコロを振っています...';
    const dieWrapper = player1DiceContainer.querySelector(`.dice-face-wrapper[data-index="${rollIndex}"]`);
    const dieEl = dieWrapper.querySelector('.dice-face');
    const value = await rollSingleDieVisual(dieEl);
    player1Scores[rollIndex] = value;

    if (gameMode === 'com') {
      turn = 2;
      updateTurnDisplay();
      setTimeout(() => { comRoll(); }, COM_THINK);
      return;
    } else {
      turn = 2;
      updateTurnDisplay();
      rollButton.disabled = false;
      isRolling = false;
      gameMessageEl.textContent = 'プレイヤー2の番です。サイコロを振ってください。';
      return;
    }
  } else {
    gameMessageEl.textContent = 'プレイヤー2がサイコロを振っています...';
    const dieWrapper = player2DiceContainer.querySelector(`.dice-face-wrapper[data-index="${rollIndex}"]`);
    const dieEl = dieWrapper.querySelector('.dice-face');
    const value = await rollSingleDieVisual(dieEl);
    player2Scores[rollIndex] = value;

    rollIndex++;
    if (rollIndex >= 5) {
      setTimeout(showFinalResult, 200);
    } else {
      turn = 1;
      updateTurnDisplay();
      rollButton.disabled = false;
      isRolling = false;
      gameMessageEl.textContent = 'プレイヤー1の番です。サイコロを振ってください。';
    }
  }
}

async function comRoll() {
  if (!isRolling) isRolling = true;
  gameMessageEl.textContent = 'COMがサイコロを振っています...';
  const dieWrapper = player2DiceContainer.querySelector(`.dice-face-wrapper[data-index="${rollIndex}"]`);
  const dieEl = dieWrapper.querySelector('.dice-face');
  const value = await rollSingleDieVisual(dieEl);
  player2Scores[rollIndex] = value;

  rollIndex++;
  if (rollIndex >= 5) {
    setTimeout(() => {
      isRolling = false;
      showFinalResult();
    }, 200);
  } else {
    turn = 1;
    updateTurnDisplay();
    isRolling = false;
    rollButton.disabled = false;
    gameMessageEl.textContent = 'プレイヤー1の番です。サイコロを振ってください。';
  }
}

function showFinalResult() {
  const p1 = player1Scores.slice(0,5).map(v => v || 0);
  const p2 = player2Scores.slice(0,5).map(v => v || 0);
  const r1 = calculateScoreFromArray(p1);
  const r2 = calculateScoreFromArray(p2);

  player1ScoreEl.textContent = String(r1.score);
  player2ScoreEl.textContent = String(r2.score);
  player1RollResultEl.textContent = r1.message;
  player2RollResultEl.textContent = r2.message;

  gameMessageEl.textContent = 'ゲーム終了！';
  rollButton.disabled = true;
  finalResultEl.classList.remove('hidden');

  let resultMessage = '';
  let resultClass = '';

  if (r1.score > r2.score) {
    // プレイヤー1の勝ち
    resultMessage = 'プレイヤー1の勝ち';
    resultClass = 'result-win';
  } else if (r1.score < r2.score) {
    // プレイヤー2の勝ち（COM含む）
    resultMessage = 'プレイヤー2（COM含む）の勝ち';
    resultClass = 'result-lose';
  } else {
    resultMessage = '引き分け';
    resultClass = 'result-draw';
  }

  // 1の特別ボーナス表示（五つ揃い > 四つ揃い）
  const p1Ones = p1.filter(v => v === 1).length;
  const p2Ones = p2.filter(v => v === 1).length;

  // プレイヤー1が勝った場合の強調
  if (r1.score > r2.score) {
    if (p1Ones >= 5) {
      resultMessage = '✨ 究極のゾロ目11111達成！ 驚異の11111点で勝利！ ✨';
      resultClass = 'result-11111';
    } else if (p1Ones >= 4) {
      resultMessage = '✨ 大勝利！奇跡のゾロ目1111達成！ ✨';
      resultClass = 'result-1111';
    }
  }

  // プレイヤー2（またはCOM）が勝った場合の強調
  if (r2.score > r1.score) {
    if (p2Ones >= 5) {
      resultMessage = '✨ プレイヤー2（COM含む）が究極のゾロ目11111達成！ 驚異の11111点で勝利！ ✨';
      resultClass = 'result-11111';
    } else if (p2Ones >= 4) {
      resultMessage = '✨ プレイヤー2（COM含む）が大勝利！奇跡のゾロ目1111達成！ ✨';
      resultClass = 'result-1111';
    }
  }

  // 引き分けでも両者が特別条件を満たす場合の表示（例: 両者とも11111）
  if (r1.score === r2.score && r1.score !== 0) {
    if (p1Ones >= 5 && p2Ones >= 5) {
      resultMessage = '✨ 両者とも究極のゾロ目11111！ 引き分けだが歴史的瞬間！ ✨';
      resultClass = 'result-11111';
    } else if (p1Ones >= 4 && p2Ones >= 4) {
      resultMessage = '✨ 両者とも奇跡のゾロ目1111で引き分け！ ✨';
      resultClass = 'result-1111';
    }
  }

  resultTextEl.textContent = resultMessage;
  finalResultEl.className = `text-center p-6 rounded-lg border-4 ${resultClass}`;
}

function resetGame() {
  player1Scores = [];
  player2Scores = [];
  rollIndex = 0;
  turn = 1;
  isRolling = false;

  player1ScoreEl.textContent = '0';
  player2ScoreEl.textContent = '0';
  player1RollResultEl.textContent = '';
  player2RollResultEl.textContent = '';
  finalResultEl.classList.add('hidden');
  resultTextEl.classList.remove('result-text');

  initDice(player1DiceContainer);
  initDice(player2DiceContainer);

  updateTurnDisplay();
  rollButton.disabled = false;
}

function shareSocial(platform) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("奇跡のゾロ目1111を狙え！「サイコロゾロ目ゲーム1111」で遊んでみた！");
  const title = encodeURIComponent("サイコロゾロ目ゲーム1111");
  let shareUrl = '';
  switch (platform) {
    case 'x': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
    case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
    case 'line': shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`; break;
    case 'email': shareUrl = `mailto:?subject=${title}&body=${text}%0A${url}`; break;
    case 'native':
      if (navigator.share) { navigator.share({ title, text, url: window.location.href }).catch(()=>{}); return; }
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
  }
  if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
}

window.addEventListener('DOMContentLoaded', () => {
  window.startGame = startGame;
  window.handleRoll = handleRoll;
  window.resetGame = resetGame;
  window.shareSocial = shareSocial;
  initDice(player1DiceContainer);
  initDice(player2DiceContainer);
  updateTurnDisplay();
});