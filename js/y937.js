// JavaScript全文: グラフの描画・操作、データ保存、シェア機能の制御
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cryptoChart');
    const ctx = canvas.getContext('2d');
    const titleInput = document.getElementById('chartTitle');
    const lineColorPicker = document.getElementById('lineColorPicker');
    const bgColorPicker = document.getElementById('bgColorPicker');

    // グラフ状態管理
    let days = 31;
    let values = new Array(days).fill(50); // 初期値は中央(50)
    let isDragging = false;
    let currentLineColor = '#007bff';
    let currentBgColor = '#ffffff';

    // ローカルストレージから復元
    if (localStorage.getItem('assetChartTitle')) {
        titleInput.value = localStorage.getItem('assetChartTitle');
    }
    if (localStorage.getItem('assetChartValues')) {
        values = JSON.parse(localStorage.getItem('assetChartValues'));
    }
    if (localStorage.getItem('assetChartLineColor')) {
        currentLineColor = localStorage.getItem('assetChartLineColor');
        lineColorPicker.value = currentLineColor;
    }
    if (localStorage.getItem('assetChartBgColor')) {
        currentBgColor = localStorage.getItem('assetChartBgColor');
        bgColorPicker.value = currentBgColor;
    }

    // キャンバス解像度自動調整（レスポンシブ対応）
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        drawChart();
    }

    // グラフ描画ロジック（外部ライブラリ不使用）
    function drawChart() {
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;
       
        ctx.fillStyle = currentBgColor;
        ctx.fillRect(0, 0, w, h);

        // 背景の補助目盛線
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 5; i++) {
            let y = (h / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // グラフ線の描画
        ctx.strokeStyle = currentLineColor;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();

        const stepX = w / (days - 1);
        for (let i = 0; i < days; i++) {
            let x = i * stepX;
            let y = h - (values[i] / 100) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // データ点の描画
        for (let i = 0; i < days; i++) {
            let x = i * stepX;
            let y = h - (values[i] / 100) * h;
            ctx.fillStyle = currentLineColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ドラッグ・タッチ操作による値の変更
    function handlePointer(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        const stepX = w / (days - 1);
        let dayIndex = Math.round(x / stepX);
        if (dayIndex < 0) dayIndex = 0;
        if (dayIndex >= days) dayIndex = days - 1;

        let pct = ((h - y) / h) * 100;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;

        values[dayIndex] = pct;
        saveData();
        drawChart();
    }

    // イベントリスナー登録 (マウス & タッチ)
    canvas.addEventListener('mousedown', (e) => { isDragging = true; handlePointer(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => { if (isDragging) handlePointer(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { isDragging = false; });

    canvas.addEventListener('touchstart', (e) => { isDragging = true; handlePointer(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, {passive: false});
    window.addEventListener('touchmove', (e) => { if (isDragging) { handlePointer(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); } }, {passive: false});
    window.addEventListener('touchend', () => { isDragging = false; });

    // データ自動保存機能
    function saveData() {
        localStorage.setItem('assetChartValues', JSON.stringify(values));
        localStorage.setItem('assetChartTitle', titleInput.value);
        localStorage.setItem('assetChartLineColor', currentLineColor);
        localStorage.setItem('assetChartBgColor', currentBgColor);
    }

    titleInput.addEventListener('input', saveData);

    // カラー変更パレット制御
    document.querySelectorAll('.preset-line').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLineColor = btn.dataset.color;
            lineColorPicker.value = currentLineColor;
            saveData();
            drawChart();
        });
    });
    lineColorPicker.addEventListener('input', (e) => {
        currentLineColor = e.target.value;
        saveData();
        drawChart();
    });

    document.querySelectorAll('.preset-bg').forEach(btn => {
        btn.addEventListener('click', () => {
            currentBgColor = btn.dataset.color;
            bgColorPicker.value = currentBgColor;
            saveData();
            drawChart();
        });
    });
    bgColorPicker.addEventListener('input', (e) => {
        currentBgColor = e.target.value;
        saveData();
        drawChart();
    });

    // すべて消去
    document.getElementById('clearBtn').addEventListener('click', () => {
        if(confirm('入力されたグラフデータとタイトルをすべて消去しますか？')) {
            values.fill(50);
            titleInput.value = '2026年7月の株資産';
            currentLineColor = '#007bff';
            currentBgColor = '#ffffff';
            lineColorPicker.value = currentLineColor;
            bgColorPicker.value = currentBgColor;
            saveData();
            drawChart();
        }
    });

    // PNG画像として保存
    document.getElementById('savePngBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = (titleInput.value || 'asset-chart') + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // 初期化実行
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});