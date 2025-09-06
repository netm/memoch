// script.js

document.addEventListener('DOMContentLoaded', () => {
  const form                   = document.getElementById('calculator');
  const modeRadios             = form.elements['mode'];
  const principalInput         = document.getElementById('principal');
  const rateInput              = document.getElementById('rate');
  const frequencySelect        = document.getElementById('frequency');
  const yearsInput             = document.getElementById('years');
  const contributionInput      = document.getElementById('contribution');
  const contribFrequencySelect = document.getElementById('contribution-frequency');
  const savingsAmountLabel     = document.getElementById('savings-label');
  const savingsCountLabel      = document.getElementById('savings-count-label');
  const outputSpan             = document.getElementById('output');

  // 計算モード切り替え時の表示制御
  function onModeChange() {
    const mode = form.elements['mode'].value;
    const showSavings = mode === 'savings';
    savingsAmountLabel.style.display = showSavings ? '' : 'none';
    savingsCountLabel.style.display  = showSavings ? '' : 'none';
    calculate();
  }

  // 複利／積立複利 計算本体
  function calculate() {
    const P = parseFloat(principalInput.value) || 0;
    const r = (parseFloat(rateInput.value) || 0) / 100;
    const n = parseInt(frequencySelect.value, 10) || 1;
    const t = parseFloat(yearsInput.value) || 0;
    const mode = form.elements['mode'].value;

    let A = 0;
    if (mode === 'compound') {
      // 通常の複利計算
      A = P * Math.pow(1 + r / n, n * t);

    } else {
      // 積立複利計算
      const C = parseFloat(contributionInput.value) || 0;
      const m = parseInt(contribFrequencySelect.value, 10) || 1;

      if (r === 0) {
        // 金利0% の場合は単純合算
        A = P + C * m * t;
      } else {
        const growthPrincipal = Math.pow(1 + r / n, n * t);
        const growthContrib   = Math.pow(1 + r / m, m * t);
        // A = 元本成長 + 積立成長
        A = P * growthPrincipal
          + C * ((growthContrib - 1) / (r / m));
      }
    }

    // 日本円フォーマットで表示
    outputSpan.textContent = A.toLocaleString('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    });
  }

  // 各要素にイベントをバインド
  [principalInput, rateInput, yearsInput, contributionInput]
    .forEach(el => el.addEventListener('input', calculate));
  [frequencySelect, contribFrequencySelect]
    .forEach(el => el.addEventListener('change', calculate));
  Array.from(modeRadios)
    .forEach(radio => radio.addEventListener('change', onModeChange));

  // 初期表示
  onModeChange();
});