// --- DOM 要素取得 ---
const display         = document.getElementById('display');
const keys            = document.querySelector('.keys');
const modeSelect      = document.getElementById('modeSelect');
const converterPanel  = document.getElementById('converterPanel');
const unitFrom        = document.getElementById('unitFrom');
const unitTo          = document.getElementById('unitTo');
const convertInput    = document.getElementById('convertInput');
const doConvertBtn    = document.getElementById('doConvert');
const historyArea     = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clearHistory');
const copyHistoryBtn  = document.getElementById('copyHistory');

// --- 計算状態 ---
let currentInput = '';
let operator     = null;
let prevRaw      = null;  // 履歴用オリジナル入力
let prevValue    = null;  // 数値演算用

// --- 単位換算データ ---
const rates = {
  currency: { 'USD_JPY': 145,   'JPY_USD': 1/145 },
  length:   { 'm_km':   0.001,  'km_m': 1000,
              'cm_m':   0.01,   'm_cm': 100,
              'inch_cm':2.54 },
  weight:   { 'g_kg':   0.001,  'kg_g': 1000,
              'lb_kg':  0.453592,'kg_lb':2.20462 },
  time:     { 's_min':  1/60,   'min_s':60,
              'min_hr': 1/60,   'hr_min':60 }
};
const unitOptions = {
  currency:['USD','JPY'],
  length:  ['m','km','cm','inch'],
  weight:  ['g','kg','lb'],
  time:    ['s','min','hr']
};

// --- 初期化 ---
handleModeChange();
updateDisplay();

// --- イベントリスナ ---
// 画面ボタン操作
keys.addEventListener('click', e => {
  const btn    = e.target;
  const val    = btn.textContent;
  const action = btn.dataset.action;

  if (!action)                 appendNumber(val);
  if (action === 'operator')   chooseOperator(val);
  if (action === 'clear')      clearAll();
  if (action === 'delete')     deleteLast();
  if (action === 'calculate')  calculate();
  if (action === 'percent')    handlePercent();
  if (action === 'tax')        handleTax();
  if (action === 'sqrt')       handleSqrt();
  if (action === 'fractionSlash') appendSlash();

  updateDisplay();
});

// キーボード操作
document.addEventListener('keydown', e => {
  const key = e.key;

  // 数字・小数点
  if (/^[0-9]$/.test(key) || key === '.') {
    appendNumber(key);
  }

  // 分数モード専用スラッシュ
  if (key === '/' && modeSelect.value === 'fraction') {
    e.preventDefault();
    appendSlash();
  }

  // 演算子キー（+ - ^ * /）
  if (['+','-','^','*','/'].includes(key) && !(key === '/' && modeSelect.value === 'fraction')) {
    const map = {
      '+': '+',
      '-': '−',
      '^': '^',
      '*': '×',
      '/': '÷'
    };
    chooseOperator(map[key]);
  }

  if (key === 'Enter' || key === '=') calculate();
  if (key === 'Backspace')            deleteLast();
  if (key === 'Escape')               clearAll();
  if (key === '%')                    handlePercent();
  if (key.toLowerCase() === 't')      handleTax();
  if (key.toLowerCase() === 'r')      handleSqrt();

  updateDisplay();
});

// モード切替
modeSelect.addEventListener('change', handleModeChange);

// 単位換算
doConvertBtn.addEventListener('click', () => {
  const mode = modeSelect.value;
  const from = unitFrom.value;
  const to   = unitTo.value;
  const val  = parseFloat(convertInput.value);
  const key  = `${from}_${to}`;
  let   res  = NaN;

  if (rates[mode] && rates[mode][key] != null) {
    res = val * rates[mode][key];
  }

  display.textContent = isNaN(res) ? 'Error' : res;
  logHistory(`${val}${from}`, '→', `${res}${to}`);
});

// 履歴クリア／コピー
clearHistoryBtn.addEventListener('click', () => historyArea.textContent = '');
copyHistoryBtn.addEventListener('click', () => navigator.clipboard.writeText(historyArea.textContent));

// 履歴クリックで再計算
historyArea.addEventListener('click', e => {
  if (!e.target.classList.contains('history-line')) return;
  const parts = e.target.textContent.split(' ');
  const aRaw  = parts[0];
  const op    = parts[1];
  const bRaw  = parts[2];
  const aNum  = parseFloat(aRaw);
  const bNum  = parseFloat(bRaw);

  if (modeSelect.value === 'fraction') {
    prevRaw      = aRaw;
    operator     = op;
    currentInput = bRaw;
    calculate();
    updateDisplay();
  }
  else if (modeSelect.value === 'root') {
    if (op === '^') {
      prevValue    = aNum;
      operator     = '^';
      currentInput = bNum.toString();
      calculate();
      updateDisplay();
    }
  }
  else if (unitOptions[modeSelect.value]) {
    convertInput.value = aNum;
    unitFrom.value     = aRaw.replace(/[0-9.\-]+/, '');
    unitTo.value       = bRaw.replace(/[0-9.\-]+/, '');
    doConvertBtn.click();
  }
  else {
    prevRaw      = aRaw;
    prevValue    = aNum;
    operator     = op;
    currentInput = bRaw.toString();
    calculate();
    updateDisplay();
  }
});

// --- ヘルパー関数 ---
// 浮動小数点誤差対策：任意桁で丸め
function round(num, decimals = 12) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

// 数字・小数点入力
function appendNumber(n) {
  if (n === '.' && currentInput.includes('.')) return;
  currentInput = (currentInput === '0' || currentInput === '') ? n : currentInput + n;
}

// 分数スラッシュ入力
function appendSlash() {
  if (modeSelect.value !== 'fraction') return;
  if (currentInput.includes('/')) return;
  currentInput = currentInput === '' ? '0/' : currentInput + '/';
}

// 演算子選択
function chooseOperator(op) {
  if (currentInput === '') return;
  prevRaw   = currentInput;
  prevValue = (modeSelect.value === 'fraction') ? null : parseFloat(currentInput);
  operator  = op;
  currentInput = '';
}

// 計算実行
function calculate() {
  const mode = modeSelect.value;

  // 分数モード
  if (mode === 'fraction') {
    if (!operator || !prevRaw || !currentInput) return;
    const f1 = parseFraction(prevRaw);
    const f2 = parseFraction(currentInput);
    let n, d;
    switch (operator) {
      case '+': n = f1.n*f2.d + f2.n*f1.d; d = f1.d*f2.d; break;
      case '−': n = f1.n*f2.d - f2.n*f1.d; d = f1.d*f2.d; break;
      case '×': n = f1.n*f2.n;              d = f1.d*f2.d; break;
      case '÷': n = f1.n*f2.d;              d = f1.d*f2.n; break;
      default:  return;
    }
    const g = gcd(Math.abs(n), Math.abs(d));
    n /= g; d /= g;
    const result = `${n}/${d}`;
    logHistory(prevRaw, operator, currentInput, result);
    currentInput = result;
    operator = prevRaw = null;
    return;
  }

  // Rootモード
  if (mode === 'root') {
    if (operator !== '^' || prevValue === null || currentInput === '') return;
    const b      = parseFloat(currentInput);
    let   result = Math.pow(prevValue, b);
    result = round(result);
    logHistory(prevValue, '^', b, result);
    currentInput = result.toString();
    operator = prevValue = null;
    return;
  }

  // Standardモード（四則＋累乗）
  if (!operator || currentInput === '') return;
  const a = prevValue;
  const b = parseFloat(currentInput);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '−': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = a / b; break;
    case '^': result = Math.pow(a, b); break;
    default:  return;
  }
  result = round(result);
  logHistory(a, operator, b, result);
  currentInput = result.toString();
  operator = prevValue = null;
}

// % 計算
function handlePercent() {
  if (!currentInput) return;
  const raw = parseFloat(currentInput) * 0.01;
  const val = round(raw, 4);
  logHistory(currentInput, '%', val);
  currentInput = val.toString();
}

// 消費税計算 (+10%)
function handleTax() {
  if (!currentInput) return;
  const raw = parseFloat(currentInput) * 1.10;
  const val = round(raw, 4);
  logHistory(currentInput, 'TAX', val);
  currentInput = val.toString();
}

// √ 計算（Rootモード専用）
function handleSqrt() {
  if (modeSelect.value !== 'root' || !currentInput) return;
  const val    = parseFloat(currentInput);
  const result = round(Math.sqrt(val));
  logHistory(`√(${currentInput})`, '=', result);
  currentInput = result.toString();
}

// 最後の文字削除
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
}

// 全クリア
function clearAll() {
  currentInput = '';
  operator     = prevRaw = prevValue = null;
}

// ディスプレイ更新
function updateDisplay() {
  display.textContent = currentInput || '0';
}

// 履歴追加
function logHistory(a, op, b, res) {
  const line = document.createElement('div');
  line.classList.add('history-line');
  const text = res === undefined
    ? `${a} ${op} ${b}`
    : `${a} ${op} ${b} = ${res}`;
  line.textContent = text;
  historyArea.appendChild(line);
  historyArea.scrollTop = historyArea.scrollHeight;
}

// モード切替時にコンバータ表示／非表示
function handleModeChange() {
  const m = modeSelect.value;
  if (unitOptions[m]) {
    converterPanel.style.display = 'flex';
    populateUnits(unitOptions[m]);
  } else {
    converterPanel.style.display = 'none';
  }
}

// 単位ドロップダウン生成
function populateUnits(list) {
  unitFrom.innerHTML = '';
  unitTo.innerHTML   = '';
  list.forEach(u => {
    unitFrom.appendChild(new Option(u, u));
    unitTo.appendChild(new Option(u, u));
  });
}

// 分数文字列を数値分数にパース
function parseFraction(str) {
  if (!str.includes('/')) return { n: parseInt(str,10), d: 1 };
  const [nu, de] = str.split('/');
  return { n: parseInt(nu,10), d: parseInt(de,10) };
}

// 最大公約数
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}