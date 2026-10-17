document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const currentYearEl = document.getElementById('current-year');
    const tableTitleInput = document.getElementById('table-title-input');
    const labelCol1Input = document.getElementById('label-col1-input');
    const labelCol2Input = document.getElementById('label-col2-input');
    const summaryLabel1 = document.getElementById('summary-label-1');
    const summaryLabel2 = document.getElementById('summary-label-2');
    const total1El = document.getElementById('total-1');
    const total2El = document.getElementById('total-2');
    
    const root = document.documentElement;

    // 現在の年を自動設定
    currentYearEl.textContent = new Date().getFullYear();

    // 1月〜12月の入力欄を生成
    const tbody = document.getElementById('months-tbody');
    for (let m = 1; m <= 12; m++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="month-label">${m}月</td>
            <td><input type="text" class="amount-input col-1" data-month="${m}" inputmode="text" placeholder="0"></td>
            <td><input type="text" class="amount-input col-2" data-month="${m}" inputmode="text" placeholder="0"></td>
        `;
        tbody.appendChild(tr);
    }

    const col1Inputs = document.querySelectorAll('.amount-input.col-1');
    const col2Inputs = document.querySelectorAll('.amount-input.col-2');

    // 数字とマイナス記号のみを許可する入力制御＆色適用
    function handleInput(input) {
        let val = input.value;
        // 半角・全角のマイナス、数字以外を排除（最初のマイナスのみ維持）
        val = val.replace(/[ー−−—]/g, '-'); // 様々なマイナス記号の正規化
        val = val.replace(/[^0-9.-]/g, '');
        
        // マイナスが途中にあれば除去、先頭のみ許可
        if (val.indexOf('-') > 0) {
            val = val.charAt(0) + val.substring(1).replace(/-/g, '');
        }
        // 小数点が複数ある場合は最初のみ
        const parts = val.split('.');
        if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
        }

        input.value = val;

        // プラス・マイナスの色分けクラス適用
        const num = parseFloat(val);
        if (!isNaN(num) && num < 0) {
            input.classList.remove('pos-color');
            input.classList.add('neg-color');
        } else if (!isNaN(num) && num > 0) {
            input.classList.remove('neg-color');
            input.classList.add('pos-color');
        } else {
            input.classList.remove('pos-color', 'neg-color');
        }

        calculateTotals();
        saveData();
    }

    // イベントリスナーの一括設定
    tbody.addEventListener('input', (e) => {
        if (e.target.classList.contains('amount-input')) {
            handleInput(e.target);
        }
    });

    [tableTitleInput, labelCol1Input, labelCol2Input].forEach(input => {
        input.addEventListener('input', () => {
            summaryLabel1.textContent = labelCol1Input.value || '項目1';
            summaryLabel2.textContent = labelCol2Input.value || '項目2';
            saveData();
        });
    });

    // 合計金額の計算
    function calculateTotals() {
        let total1 = 0;
        let total2 = 0;

        col1Inputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            total1 += val;
        });
        col2Inputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            total2 += val;
        });

        total1El.textContent = total1.toLocaleString();
        total2El.textContent = total2.toLocaleString();

        setTotalColor(total1El, total1);
        setTotalColor(total2El, total2);
    }

    function setTotalColor(element, value) {
        if (value > 0) {
            element.className = 'pos-color';
        } else if (value < 0) {
            element.className = 'neg-color';
        } else {
            element.className = '';
        }
    }

    // カラーチェンジャーの設定
    function initColorButtons(prefix, variableName) {
        const container = document.getElementById(`${prefix}-picker-container`);
        if (!container) return;

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-btn')) {
                const color = e.target.getAttribute('data-color');
                root.style.setProperty(variableName, color);
                saveData();
            }
        });

        const customPicker = document.getElementById(`custom-${prefix}`);
        if (customPicker) {
            customPicker.addEventListener('input', (e) => {
                root.style.setProperty(variableName, e.target.value);
                saveData();
            });
        }
    }

    initColorButtons('title', '--title-color');
    initColorButtons('month', '--month-color');
    initColorButtons('pos', '--pos-color');
    initColorButtons('neg', '--neg-color');
    initColorButtons('bg', '--bg-color');

    // データ保存機能 (LocalStorage)
    function saveData() {
        const data = {
            title: tableTitleInput.value,
            labelCol1: labelCol1Input.value,
            labelCol2: labelCol2Input.value,
            amounts1: Array.from(col1Inputs).map(i => i.value),
            amounts2: Array.from(col2Inputs).map(i => i.value),
            colors: {
                title: root.style.getPropertyValue('--title-color'),
                month: root.style.getPropertyValue('--month-color'),
                pos: root.style.getPropertyValue('--pos-color'),
                neg: root.style.getPropertyValue('--neg-color'),
                bg: root.style.getPropertyValue('--bg-color'),
            }
        };
        localStorage.setItem('annual_profit_loss_data', JSON.stringify(data));
    }

    // データ読み込み機能
    function loadData() {
        const saved = localStorage.getItem('annual_profit_loss_data');
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            tableTitleInput.value = data.title || '';
            labelCol1Input.value = data.labelCol1 || '';
            labelCol2Input.value = data.labelCol2 || '';
            summaryLabel1.textContent = data.labelCol1 || '項目1';
            summaryLabel2.textContent = data.labelCol2 || '項目2';

            if (data.amounts1) {
                col1Inputs.forEach((input, index) => {
                    input.value = data.amounts1[index] || '';
                    handleInput(input);
                });
            }
            if (data.amounts2) {
                col2Inputs.forEach((input, index) => {
                    input.value = data.amounts2[index] || '';
                    handleInput(input);
                });
            }

            if (data.colors) {
                if (data.colors.title) root.style.setProperty('--title-color', data.colors.title);
                if (data.colors.month) root.style.setProperty('--month-color', data.colors.month);
                if (data.colors.pos) root.style.setProperty('--pos-color', data.colors.pos);
                if (data.colors.neg) root.style.setProperty('--neg-color', data.colors.neg);
                if (data.colors.bg) root.style.setProperty('--bg-color', data.colors.bg);
            }
            calculateTotals();
        } catch (e) {
            console.error("保存データの読み込みに失敗しました", e);
        }
    }

    // 全て消去ボタン
    document.getElementById('clear-all-btn').addEventListener('click', () => {
        if (confirm('入力されたすべてのデータと配色設定をクリアします。よろしいですか？')) {
            localStorage.removeItem('annual_profit_loss_data');
            tableTitleInput.value = '';
            labelCol1Input.value = '';
            labelCol2Input.value = '';
            summaryLabel1.textContent = '項目1';
            summaryLabel2.textContent = '項目2';
            col1Inputs.forEach(i => { i.value = ''; i.className = 'amount-input col-1'; });
            col2Inputs.forEach(i => { i.value = ''; i.className = 'amount-input col-2'; });
            root.style.removeProperty('--title-color');
            root.style.removeProperty('--month-color');
            root.style.removeProperty('--pos-color');
            root.style.removeProperty('--neg-color');
            root.style.removeProperty('--bg-color');
            calculateTotals();
        }
    });

    // PNG画像で保存（html2canvasライブラリ等がない場合の簡易代替として、テーブル内容を元にCanvas描画して保存）
    document.getElementById('save-png-btn').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 900;

        // 背景描画
        ctx.fillStyle = getComputedStyle(root).getPropertyValue('--bg-color').trim() || '#fffde7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // テキスト描画設定
        ctx.fillStyle = getComputedStyle(root).getPropertyValue('--title-color').trim() || '#333333';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${currentYearEl.textContent}年 ${tableTitleInput.value || '年間損益表'}`, canvas.width / 2, 60);

        // テーブルヘッダー
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = getComputedStyle(root).getPropertyValue('--month-color').trim() || '#333333';
        ctx.fillText('月', 150, 130);
        ctx.fillText(labelCol1Input.value || '項目1', 400, 130);
        ctx.fillText(labelCol2Input.value || '項目2', 650, 130);

        // 区切り線
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, 150); ctx.lineTo(720, 150);
        ctx.stroke();

        // 各月のデータ描画
        let yOffset = 190;
        ctx.font = '18px sans-serif';
        
        for (let m = 1; m <= 12; m++) {
            ctx.fillStyle = getComputedStyle(root).getPropertyValue('--month-color').trim() || '#333333';
            ctx.fillText(`${m}月`, 150, yOffset);

            const val1 = parseFloat(col1Inputs[m-1].value) || 0;
