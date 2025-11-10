/* app.js - 全文 */
/* シンプルな掛け算暗算ゲームのロジック */
(() => {
  // DOM要素キャッシュ
  const el = {
    leftNum: null,
    midNum: null,
    rightNum: null,
    answerDisplay: null,
    keypad: null,
    clearBtn: null,
    submitBtn: null,
    feedback: null,
    score: null,
    shareX: null,
    shareFB: null,
    shareLine: null,
    shareMail: null,
    nextBtn: null
  };

  // ゲーム状態
  let numbers = [0, 0, 0];
  let inputBuffer = ''; // ユーザ入力（文字列）
  let correctCount = 0;

  // 初期化
  function init() {
    el.leftNum = document.getElementById('num-left');
    el.midNum = document.getElementById('num-mid');
    el.rightNum = document.getElementById('num-right');
    el.answerDisplay = document.getElementById('answer-display');
    el.keypad = document.getElementById('keypad');
    el.clearBtn = document.getElementById('btn-clear');
    el.submitBtn = document.getElementById('btn-submit');
    el.feedback = document.getElementById('feedback');
    el.score = document.getElementById('score-count');
    el.shareX = document.getElementById('share-x');
    el.shareFB = document.getElementById('share-fb');
    el.shareLine = document.getElementById('share-line');
    el.shareMail = document.getElementById('share-mail');
    el.nextBtn = document.getElementById('btn-next');

    bindKeypad();
    bindShareButtons();
    newQuestion();
    updateScore();
  }

  // ランダムに0〜9の整数を生成
function randDigit() {
  // 0..7 を作って +2 することで 2..9 の範囲にする
  return Math.floor(Math.random() * 8) + 2;
  }

  // 新しい問題を作る
  function newQuestion() {
    numbers = [randDigit(), randDigit(), randDigit()];
    // それぞれの枠に表示
    el.leftNum.textContent = numbers[0];
    el.midNum.textContent = numbers[1];
    el.rightNum.textContent = numbers[2];

    inputBuffer = '';
    renderInput();
    el.feedback.textContent = '';
    el.feedback.className = 'feedback';
    el.submitBtn.removeAttribute('disabled');
    el.nextBtn.setAttribute('aria-hidden', 'true');
  }

  // 入力表示を更新
  function renderInput() {
    el.answerDisplay.textContent = inputBuffer || '＿';
  }

  // キーパッドのバインド
  function bindKeypad() {
    // 数字ボタン
    el.keypad.addEventListener('click', (e) => {
      const t = e.target;
      if (!t.matches('button')) return;
      const v = t.dataset.value;
      if (v === 'clear') {
        inputBuffer = '';
        renderInput();
        return;
      }
      if (v === 'del') {
        inputBuffer = inputBuffer.slice(0, -1);
        renderInput();
        return;
      }
      if (v === 'submit') {
        submitAnswer();
        return;
      }
      // 数字入力、先頭の0を避ける（ただし "0" 単体は許容）
      if (inputBuffer.length >= 4) return; // 長すぎ防止
      if (inputBuffer === '0' && v === '0') return;
      if (inputBuffer === '0' && v !== '0') inputBuffer = v;
      else inputBuffer += v;
      renderInput();
    });

    // クリア/次へボタン
    el.clearBtn.addEventListener('click', () => {
      inputBuffer = '';
      renderInput();
    });
    el.nextBtn.addEventListener('click', () => {
      newQuestion();
    });

    // フォーム送信用（Enter/Backspace）
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        // 同じ制約を適用
        if (inputBuffer.length >= 4) return;
        if (inputBuffer === '0' && e.key === '0') return;
        if (inputBuffer === '0' && e.key !== '0') inputBuffer = e.key;
        else inputBuffer += e.key;
        renderInput();
      } else if (e.key === 'Backspace') {
        inputBuffer = inputBuffer.slice(0, -1);
        renderInput();
      } else if (e.key === 'Enter') {
        submitAnswer();
      }
    });

    // 送信ボタン
    el.submitBtn.addEventListener('click', submitAnswer);
  }

  // 正解・不正解処理
  function submitAnswer() {
    if (inputBuffer === '') return;
    const user = parseInt(inputBuffer, 10);
    const correct = numbers[0] * numbers[1] * numbers[2];
    if (user === correct) {
      correctCount++;
      el.feedback.textContent = '正解';
      el.feedback.className = 'feedback correct';
    } else {
      el.feedback.textContent = '不正解';
      el.feedback.className = 'feedback wrong';
    }
    updateScore();
    el.submitBtn.setAttribute('disabled', 'true');
    el.nextBtn.removeAttribute('aria-hidden');
    // 次の問題は数秒後に自動で出す（短め、ユーザーが次ボタンで早めに進める）
    setTimeout(newQuestion, 1200);
  }

  // スコア表示更新
  function updateScore() {
    el.score.textContent = String(correctCount);
  }

  // シェアボタンの挙動
  function bindShareButtons() {
    const pageUrl = encodeURIComponent(location.href);
    const title = encodeURIComponent(document.title);

    el.shareX.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://twitter.com/intent/tweet?text=${title}&url=${pageUrl}`;
      window.open(url, '_blank', 'noopener');
    });

    el.shareFB.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      window.open(url, '_blank', 'noopener');
    });

    el.shareLine.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
      window.open(url, '_blank', 'noopener');
    });

    el.shareMail.addEventListener('click', (e) => {
      e.preventDefault();
      const body = encodeURIComponent(`掛け算の暗算ゲームを試してみてください: ${location.href}`);
      const mailto = `mailto:?subject=${title}&body=${body}`;
      location.href = mailto;
    });
  }

  // DOMContentLoadedの代わりに即実行（スクリプトはbody末尾読み込みを想定）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // デバッグ用: グローバルにエクスポートしない（必要なら console で操作可能）
})();