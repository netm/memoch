// indez997.js
// DOMが読み込まれたら初期化処理を実行
document.addEventListener('DOMContentLoaded', () => {
  const monthInput   = document.getElementById('month-selector');
  const form         = document.getElementById('household-form');
  const totalAmount  = document.getElementById('total-amount');
  const inputs       = form.querySelectorAll('input[type="number"]');
  const saveBtn      = document.getElementById('save-btn');
  const clearBtn     = document.getElementById('clear-btn');

  // 初期化
  const initialize = () => {
    setInitialMonth();
    loadData();
    calculateTotal();
    addEventListeners();
  };

  // イベントリスナーを追加
  const addEventListeners = () => {
    monthInput.addEventListener('change', () => {
      loadData();
      calculateTotal();
    });

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        saveData();
        calculateTotal();
      });
    });

    saveBtn.addEventListener('click', saveAsImage);
    clearBtn.addEventListener('click', clearData);
  };

  // ページを開いたときの年月をセット
  const setInitialMonth = () => {
    const today = new Date();
    const year  = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    monthInput.value = `${year}-${month}`;
  };

  // localStorage 用キーを取得
  const getKey = () => `householdData-${monthInput.value}`;

  // ブラウザにデータを保存
  const saveData = () => {
    const key  = getKey();
    const data = {};
    inputs.forEach(i => data[i.id] = i.value);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ブラウザからデータを読み込み
  const loadData = () => {
    const key       = getKey();
    const raw       = localStorage.getItem(key);
    const savedData = raw ? JSON.parse(raw) : {};

    inputs.forEach(i => {
      i.value = savedData[i.id] || '';
    });
  };

  // 合計を計算して表示
  const calculateTotal = () => {
    let income  = 0;
    let expense = 0;

    document.querySelectorAll('.income-item input')
      .forEach(i => income  += Number(i.value) || 0);

    document.querySelectorAll('.expense-item input')
      .forEach(i => expense += Number(i.value) || 0);

    const total = income - expense;
    totalAmount.textContent = total.toLocaleString();

    const wrapper = totalAmount.parentElement;
    wrapper.classList.toggle('negative', total < 0);
    wrapper.classList.toggle('positive', total >= 0);
  };

  // すべてのデータをクリア
  const clearData = () => {
    const key = getKey();
    // input を空にする
    inputs.forEach(i => i.value = '');
    // localStorage から削除
    localStorage.removeItem(key);
    // 合計再計算
    calculateTotal();
  };

  // PNG 画像として保存
  const saveAsImage = () => {
    html2canvas(document.querySelector('.container')).then(canvas => {
      const link = document.createElement('a');
      link.download = `家計簿-${monthInput.value}.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    });
  };

  initialize();
});