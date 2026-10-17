// localStorageのキー
const STORAGE_KEY = 'annual_profit_loss_data';

// DOM要素の取得
const currentYearEl = document.getElementById('current-year');
const tableTitleEl = document.getElementById('table-title');
const label1Inputs = document.querySelectorAll('.label-1');
const label2Inputs = document.querySelectorAll('.label-2');
const label1TitleEl = document.getElementById('label-1-title');
const label2TitleEl = document.getElementById('label-2-title');
const total1El = document.getElementById('total-1');
const total2El = document.getElementById('total-2');
const monthLabels = document.querySelectorAll('.month-label');
const bgElement = document.getElementById('app-container');

// 初期設定（現在の年を自動表示）
currentYearEl.textContent = new Date().getFullYear();

// データ保存用オブジェクト
let appData = {
    title: "NISA株とデイトレ（家計簿）",
    label1: "NISA株",
    label2: "デイトレ（家計簿）",
    values: Array(12).fill(null).map(() => ({ col1: "", col2: "" })),
    colors: {
        month: "#333333",
        positive: "#10b981",
        negative: "#ef4444",
        bg: "#fefcbf"
    }
};

// データの読み込み
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            appData = JSON.parse(saved);
        } catch (e) {
            console.error("データの読み込みに失敗しました", e);
        }
    }
    renderData();
}

// データの保存
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// 画面への反映と再計算
function renderData() {
    tableTitleEl.value = appData.title;
    label1Inputs.forEach(el => el.value = appData.label1);
    label2Inputs.forEach(el => el.value = appData.label2);
    label1TitleEl.textContent = appData.label1;
    label2TitleEl.textContent = appData.label2;

    let total1 = 0;
    let total2 = 0;

    for (let i = 0; i < 12; i++) {
        const rowData = appData.values[i] || { col1: "", col2: "" };
        const input1 = document.getElementById(`val-1-${i}`);
        const input2 = document.getElementById(`val-2-${i}`);
        
        input1.value = rowData.col1;
        input2.value = rowData.col2;

        const val1 = parseFloat(rowData.col1) || 0;
        const val2 = parseFloat(rowData.col2) || 0;

        total1 += val1;
        total2 += val2;

        applyInputColor(input1, val1);
        applyInputColor(input2, val2);
    }

    total1El.textContent = total1.toLocaleString();
    total2El.textContent = total2.toLocaleString();
    applyInputColor(total1El, total1);
    applyInputColor(total2El, total2);

    applyStyles();
}

// 数値に応じた色適用
function applyInputColor(element, val) {
    if (val > 0) {
        element.style.color = appData.colors.positive;
    } else if (val < 0) {
        element.style.color = appData.colors.negative;
    } else {
        element.style.color = "#333333";
    }
}

// スタイルの適用
function applyStyles() {
    monthLabels.forEach(el => el.style.color = appData.colors.month);
    bgElement.style.backgroundColor = appData.colors.bg;
}

// イベントリスナーの設定
tableTitleEl.addEventListener('input', (e) => {
    appData.title = e.target.value;
    saveData();
});

label1Inputs.forEach(el => el.addEventListener('input', (e) => {
    appData.label1 = e.target.value;
    label1Inputs.forEach(i => i.value = e.target.value);
    label1TitleEl.textContent = e.target.value;
    saveData();
}));

label2Inputs.forEach(el => el.addEventListener('input', (e) => {
    appData.label2 = e.target.value;
    label2Inputs.forEach(i => i.value = e.target.value);
    label2TitleEl.textContent = e.target.value;
    saveData();
}));

// 各入力欄へのインプットイベント登録
for (let i = 0; i < 12; i++) {
    document.getElementById(`val-1-${i}`).addEventListener('input', (e) => {
        appData.values[i].col1 = e.target.value;
        saveData();
        renderData();
    });
    document.getElementById(`val-2-${i}`).addEventListener('input', (e) => {
        appData.values[i].col2 = e.target.value;
        saveData();
        renderData();
    });
}

// カラー変更関数
function changeColor(type, color) {
    appData.colors[type] = color;
    saveData();
    renderData();
}

// カスタムカラーピッカー
document.getElementById('picker-month').addEventListener('input', (e) => changeColor('month', e.target.value));
document.getElementById('picker-pos').addEventListener('input', (e) => changeColor('positive', e.target.value));
document.getElementById('picker-neg').addEventListener('input', (e) => changeColor('negative', e.target.value));
document.getElementById('picker-bg').addEventListener('input', (e) => changeColor('bg', e.target.value));

// 全消去
document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('すべての入力データを消去しますか？（カスタム色設定は維持されます）')) {
        appData.values = Array(12).fill(null).map(() => ({ col1: "", col2: "" }));
        saveData();
        renderData();
    }
});

// PNG保存（html2canvasライブラリが必要）
document.getElementById('btn-png').addEventListener('click', () => {
    if (typeof html2canvas !== 'undefined') {
        html2canvas(document.getElementById('capture-area')).then(canvas => {
            const link = document.createElement('a');
            link.download = `年間損益表_${appData.title}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert('PNG保存機能を利用するにはhtml2canvasライブラリが必要です。HTMLのヘッドにCDNを追加してください。');
    }
});

// シェアボタンのリンク生成
document.getElementById('share-x').addEventListener('click', () => {
    const text = encodeURIComponent(`【${appData.title}】月別の年間損益を自動計算して管理中！ ` + window.location.href);
    window.open(`https://twitter.com{text}`, '_blank');
});

document.getElementById('share-line').addEventListener('click', () => {
    const text = encodeURIComponent(`【${appData.title}】月別の年間損益表で資産管理を行っています： ` + window.location.href);
    window.open(`https://line.me{text}`, '_blank');
});

document.getElementById('share-insta').addEventListener('click', () => {
    alert('Instagramへの直接シェアは制限されているため、スクリーンショット画像を保存して投稿してください。URL: ' + window.location.href);
});

document.getElementById('share-email').addEventListener('click', () => {
    const subject = encodeURIComponent(`月別年間損益表：${appData.title}`);
    const body = encodeURIComponent(`こちらのツールで年間収支を管理しています。\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

// 初期起動
loadData();
