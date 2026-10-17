document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const mainTitle = document.getElementById('main-title');
    const col1Title = document.getElementById('col1-title');
    const col2Title = document.getElementById('col2-title');
    const total1El = document.getElementById('total-1');
    const total2El = document.getElementById('total-2');
    const bgPattern = document.getElementById('bg-pattern');

    // カラーピッカー・ボタン要素
    const titleColorPicker = document.getElementById('title-color-picker');
    const monthColorPicker = document.getElementById('month-color-picker');
    const plusColorPicker = document.getElementById('plus-color-picker');
    const minusColorPicker = document.getElementById('minus-color-picker');
    const bgCustomColor = document.getElementById('bg-custom-color');

    // 1月〜12月の行を生成
    const tableBody = document.getElementById('table-body');
    for (let i = 1; i <= 12; i++) {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="month-label">${i}月</div>
            <div class="input-group">
                <input type="number" class="amount-input col-1" data-month="${i}" placeholder="0">
                <button type="button" class="toggle-sign-btn">±</button>
            </div>
            <div class="input-group">
                <input type="number" class="amount-input col-2" data-month="${i}" placeholder="0">
                <button type="button" class="toggle-sign-btn">±</button>
            </div>
        `;
        tableBody.appendChild(row);
    }

    const allInputs = document.querySelectorAll('.amount-input');
    const monthLabels = document.querySelectorAll('.month-label');

    // 合計金額の計算
    function calculateTotals() {
        let total1 = 0;
        let total2 = 0;

        allInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            if (input.classList.contains('col-1')) {
                total1 += val;
            } else {
                total2 += val;
            }

            // 入力値のプラスマイナスによる色分け
            if (val > 0) {
                input.style.color = plusColorPicker.value;
            } else if (val < 0) {
                input.style.color = minusColorPicker.value;
            } else {
                input.style.color = '#333333';
            }
        });

        total1El.textContent = total1.toLocaleString();
        total2El.textContent = total2.toLocaleString();

        // 合計の数字の色分け
        total1El.style.color = total1 >= 0 ? plusColorPicker.value : minusColorPicker.value;
        total2El.style.color = total2 >= 0 ? plusColorPicker.value : minusColorPicker.value;
    }

    // +/- 反転ボタンの処理
    document.querySelectorAll('.toggle-sign-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            if (input.value) {
                input.value = parseFloat(input.value) * -1;
                calculateTotals();
                saveData();
            }
        });
    });

    // イベントリスナーの一括設定
    tableBody.addEventListener('input', () => {
        calculateTotals();
        saveData();
    });

    [mainTitle, col1Title, col2Title].forEach(el => {
        el.addEventListener('input', saveData);
    });

    // 色変更用の共通処理
    function applyColors() {
        // タイトル色
        mainTitle.style.color = titleColorPicker.value;
        // 月の色
        monthLabels.forEach(lbl => lbl.style.color = monthColorPicker.value);
        // 背景色
        if (bgPattern.value === 'custom') {
            document.body.style.backgroundColor = bgCustomColor.value;
        } else {
            document.body.style.backgroundColor = bgPattern.value;
        }
        calculateTotals();
    }

    // クイック色選択ボタンのイベント
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.dataset.target;
            const color = e.target.dataset.color;
            const picker = document.getElementById(`${target}-color-picker`);
            picker.value = color;
            applyColors();
            saveData();
        });
    });

    // 背景クイック選択ボタン
    document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            bgPattern.value = color;
            if (color !== 'custom') {
                document.body.style.backgroundColor = color;
            } else {
                document.body.style.backgroundColor = bgCustomColor.value;
            }
            saveData();
        });
    });

    // カラーピッカー変更時
    [titleColorPicker, monthColorPicker, plusColorPicker, minusColorPicker].forEach(picker => {
        picker.addEventListener('input', () => {
            applyColors();
            saveData();
        });
    });

    bgCustomColor.addEventListener('input', () => {
        bgPattern.value = 'custom';
        document.body.style.backgroundColor = bgCustomColor.value;
        applyColors();
        saveData();
    });

    // データ保存機能 (LocalStorage)
    function saveData() {
        const data = {
            mainTitle: mainTitle.value,
            col1Title: col1Title.value,
            col2Title: col2Title.value,
            titleColor: titleColorPicker.value,
            monthColor: monthColorPicker.value,
            plusColor: plusColorPicker.value,
            minusColor: minusColorPicker.value,
            bgColorType: bgPattern.value,
            bgCustomColor: bgCustomColor.value,
            amounts: []
        };

        allInputs.forEach(input => {
            data.amounts.push({
                month: input.dataset.month,
                col: input.classList.contains('col-1') ? 1 : 2,
                val: input.value
            });
        });

        localStorage.setItem('annual_profit_data', JSON.stringify(data));
    }

    // データ読み込み機能
    function loadData() {
        const json = localStorage.getItem('annual_profit_data');
        if (!json) return;
        const data = JSON.parse(json);

        mainTitle.value = data.mainTitle || '';
        col1Title.value = data.col1Title || '';
        col2Title.value = data.col2Title || '';
        titleColorPicker.value = data.titleColor || '#000000';
        monthColorPicker.value = data.monthColor || '#000000';
        plusColorPicker.value = data.plusColor || '#ff0000';
        minusColorPicker.value = data.minusColor || '#0000ff';
        bgPattern.value = data.bgColorType || '#fffde7';
        bgCustomColor.value = data.bgCustomColor || '#fffde7';

        if (data.amounts) {
            data.amounts.forEach(item => {
                const input = document.querySelector(`.amount-input.col-${item.col}[data-month="${item.month}"]`);
                if (input) input.value = item.val;
            });
        }
        applyColors();
    }

    // すべて消去ボタン
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('入力されたデータと色設定をすべて消去しますか？')) {
            localStorage.removeItem('annual_profit_data');
            mainTitle.value = 'NISA株とデイトレ（家計簿）';
            col1Title.value = 'NISA株';
            col2Title.value = 'デイトレ';
            titleColorPicker.value = '#000000';
            monthColorPicker.value = '#333333';
            plusColorPicker.value = '#000000';
            minusColorPicker.value = '#000000';
            bgPattern.value = '#fffde7';
            document.body.style.backgroundColor = '#fffde7';
            allInputs.forEach(input => input.value = '');
            applyColors();
        }
    });

    // PNG画像として保存ボタン (HTML5 Canvasを用いた簡易実装)
    document.getElementById('png-btn').addEventListener('click', () => {
        alert('画像生成を開始します。画面全体のキャプチャをお手持ちのスマートフォンのスクリーンショット機能で保存することもお勧めします。');
        const container = document.getElementById('app-container');
        
        // 簡易的なデータテキスト書き出しによる画像化の代替、あるいはスクショの案内
        // 高精度なDOM画像化にはhtml2canvasライブラリ等が必要なため、標準機能での簡易保存ロジック
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = document.body.style.backgroundColor || '#fffde7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = titleColorPicker.value;
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(mainTitle.value || '年間損益表', 20, 40);

        // 簡易保存リンクの生成
        const link = document.createElement('a');
        link.download = 'annual-profit.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // シェアボタンの設定
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('スマホ・PCで簡単に使える「2つの月別の年間損益表」で収支管理をはじめよう！');

    document.getElementById('share-x').href = `https://x.com{shareUrl}&text=${shareText}`;
    document.getElementById('share-line').href = `https://line.me{shareUrl}`;
    document.getElementById('share-instagram').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Instagramへは、クリップボードにURLをコピーしました。ストーリーやプロフィールに貼り付けてシェアしてください！');
        navigator.clipboard.writeText(window.location.href);
    });
    document.getElementById('share-email').href = `mailto:?subject=${shareText}&body=${shareUrl}`;

    // 初期化実行
    loadData();
    if(!localStorage.getItem('annual_profit_data')) {
        applyColors();
    }
});
