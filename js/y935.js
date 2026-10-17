document.addEventListener('DOMContentLoaded', () => {
    // 現在の年を自動設定
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // DOM要素の取得
    const appContainer = document.getElementById('profit-loss-app');
    const tableTitle = document.getElementById('table-title');
    const col1Header = document.getElementById('col1-header');
    const col2Header = document.getElementById('col2-header');
    const total1Display = document.getElementById('total-1');
    const total2Display = document.getElementById('total-2');

    // カラーピッカー・ボタン要素
    const titleColorPicker = document.getElementById('title-color-picker');
    const monthColorPicker = document.getElementById('month-color-picker');
    const plusColorPicker = document.getElementById('plus-color-picker');
    const minusColorPicker = document.getElementById('minus-color-picker');
    const bgColorPicker = document.getElementById('bg-color-picker');

    // 1月〜12月の入力欄を生成
    const tbody = document.getElementById('monthly-inputs');
    for (let m = 1; m <= 12; m++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="month-label">${m}月</td>
            <td><input type="number" class="amount-input col-1" data-month="${m}" placeholder="0"></td>
            <td><input type="number" class="amount-input col-2" data-month="${m}" placeholder="0"></td>
        `;
        tbody.appendChild(tr);
    }

    const allInputs = document.querySelectorAll('.amount-input');
    const monthLabels = document.querySelectorAll('.month-label');

    // 合計金額の計算と色の適用
    function calculateTotals() {
        let total1 = 0;
        let total2 = 0;

        allInputs.forEach(input => {
            const val = parseFloat(input.value) || 0;
            
            // 入力値の正負に応じた色変更
            const plusColor = plusColorPicker.value;
            const minusColor = minusColorPicker.value;
            if (val > 0) {
                input.style.color = plusColor;
            } else if (val < 0) {
                input.style.color = minusColor;
            } else {
                input.style.color = 'inherit';
            }

            if (input.classList.contains('col-1')) {
                total1 += val;
            } else {
                total2 += val;
            }
        });

        total1Display.textContent = total1.toLocaleString();
        total2Display.textContent = total2.toLocaleString();

        // 合計部分の文字色もプラス・マイナスに対応
        applyTotalColor(total1Display, total1);
        applyTotalColor(total2Display, total2);
    }

    function applyTotalColor(element, value) {
        if (value > 0) element.style.color = plusColorPicker.value;
        else if (value < 0) element.style.color = minusColorPicker.value;
        else element.style.color = 'inherit';
    }

    // ローカルストレージへの保存
    function saveData() {
        const data = {
            title: tableTitle.value,
            col1Header: col1Header.value,
            col2Header: col2Header.value,
            inputs: Array.from(allInputs).map(i => i.value),
            colors: {
                title: titleColorPicker.value,
                month: monthColorPicker.value,
                plus: plusColorPicker.value,
                minus: minusColorPicker.value,
                bg: bgColorPicker.value
            }
        };
        localStorage.setItem('profit_loss_data_2026', JSON.stringify(data));
    }

    // ローカルストレージからの読み込み
    function loadData() {
        const saved = localStorage.getItem('profit_loss_data_2026');
        if (saved) {
            const data = JSON.parse(saved);
            tableTitle.value = data.title || '';
            col1Header.value = data.col1Header || 'NISA株';
            col2Header.value = data.col2Header || 'デイトレ（家計簿）';
            
            if (data.inputs) {
                allInputs.forEach((input, index) => {
                    input.value = data.inputs[index] || '';
                });
            }
            if (data.colors) {
                titleColorPicker.value = data.colors.title || '#000000';
                monthColorPicker.value = data.colors.month || '#000000';
                plusColorPicker.value = data.colors.plus || '#000000';
                minusColorPicker.value = data.colors.minus || '#000000';
                bgColorPicker.value = data.colors.bg || '#fffee0';
            }
            applyColors();
            calculateTotals();
        }
    }

    // 色の適用処理
    function applyColors() {
        tableTitle.style.color = titleColorPicker.value;
        monthLabels.forEach(label => label.style.color = monthColorPicker.value);
        appContainer.style.backgroundColor = bgColorPicker.value;
        calculateTotals();
    }

    // クイック色変更ボタンのイベント設定
    function setupPresetButtons(className, pickerElement) {
        document.querySelectorAll(`.${className}`).forEach(button => {
            button.addEventListener('click', () => {
                pickerElement.value = button.getAttribute('data-color');
                applyColors();
                saveData();
            });
        });
    }

    setupPresetButtons('btn-title-color', titleColorPicker);
    setupPresetButtons('btn-month-color', monthColorPicker);
    setupPresetButtons('btn-plus-color', plusColorPicker);
    setupPresetButtons('btn-minus-color', minusColorPicker);
    setupPresetButtons('btn-bg-color', bgColorPicker);

    // ピッカー直接変更時のイベント
    [titleColorPicker, monthColorPicker, plusColorPicker, minusColorPicker, bgColorPicker].forEach(picker => {
        picker.addEventListener('input', () => {
            applyColors();
            saveData();
        });
    });

    // 入力時の自動計算と自動保存
    appContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('amount-input') || e.target.tagName === 'INPUT') {
            calculateTotals();
            saveData();
        }
    });

    // 全て消去ボタン
    document.getElementById('clear-btn').addEventListener('click', () => {
        if (confirm('入力されたすべてのデータを消去しますか？')) {
            allInputs.forEach(i => i.value = '');
            tableTitle.value = 'NISA株とデイトレ（家計簿）';
            col1Header.value = 'NISA株';
            col2Header.value = 'デイトレ（家計簿）';
            titleColorPicker.value = '#000000';
            monthColorPicker.value = '#000000';
            plusColorPicker.value = '#228b22';
            minusColorPicker.value = '#ff0000';
            bgColorPicker.value = '#fffee0';
            applyColors();
            saveData();
        }
    });

    // PNG画像として保存ボタン (簡易版・HTML2Canvas等のライブラリがないためウィンドウ印刷またはCSSキャプチャの代替案内を兼ねる仕組み、ここでは標準機能としてコンテナ要素を画像化する仕組みのダミー、あるいは背景色を含んだ新しいウィンドウを開いて印刷させる処理を推奨しますが、ネイティブで組むため印刷ダイアログを起動します)
    document.getElementById('png-btn').addEventListener('click', () => {
        alert('「ページを印刷」からPDFまたは画像として保存するか、スマホのスクリーンショット機能をご利用ください。');
        window.print();
    });

    // シェアボタンの設定
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('2つの月別年間損益表でNISAやデイトレ、家計簿を簡単管理！');

    document.getElementById('share-x').href = `https://x.com{shareUrl}&text=${shareText}`;
    document.getElementById('share-line').href = `https://line.me{shareUrl}`;
    document.getElementById('share-instagram').href = `https://instagram.com`; // インスタは直接URL共有不可のためアプリ誘導
    document.getElementById('share-email').href = `mailto:?subject=${shareText}&body=${shareUrl}`;

    // 初期データの読み込み
    loadData();
});
