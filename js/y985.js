document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('clockCanvas');
    const ctx = canvas.getContext('2d');

    const DEFAULTS = {
        clockColor: '#333333',
        design: 'classic',
        backgroundColor: '#f3f4f6',
    };
    let settings = {};

    const clockColors  = ['#3f3f3fff', '#ebebebff', '#ffb835ff', '#daff35ff', '#e53e3e', '#ff3e6eff', '#89299eff', '#38a169', '#3182ce'];
    const designs      = ['classic', 'minimal', 'modern'];
    const bgColors     = ['#252525ff', '#3f4e6cff', '#ffd5a3ff', '#f7ffb9ff', '#ffc2c2ff', '#8849a2ff', '#d9ffe3ff', '#c3eaffff'];

    const changeColorBtn  = document.getElementById('changeColorBtn');
    const changeDesignBtn = document.getElementById('changeDesignBtn');
    const changeBgBtn     = document.getElementById('changeBgBtn');
    const savePngBtn      = document.getElementById('savePngBtn');
    const resetBtn        = document.getElementById('resetBtn');

    function saveSettings() {
        localStorage.setItem('analogClockSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem('analogClockSettings');
        if (saved) {
            settings = JSON.parse(saved);
        } else {
            settings = { ...DEFAULTS };
        }
        applySettings();
    }

    function applySettings() {
        document.body.style.backgroundColor = settings.backgroundColor;
    }

    function drawClock() {
        const radius = canvas.width / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(radius, radius);

        switch (settings.design) {
            case 'minimal': drawFaceMinimal(ctx, radius); break;
            case 'modern':  drawFaceModern(ctx, radius);  break;
            case 'classic':
            default:        drawFaceClassic(ctx, radius); break;
        }

        drawHands(ctx, radius);
        ctx.restore();
        requestAnimationFrame(drawClock);
    }

    function drawFaceClassic(ctx, radius) {
        const baseRadius = radius * 0.95;

        // 外枠
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, 2 * Math.PI);
        ctx.fillStyle = settings.backgroundColor === '#1a202c' ? '#4a5568' : 'white';
        ctx.fill();
        const grad = ctx.createRadialGradient(
            0, 0, baseRadius * 0.95,
            0, 0, baseRadius * 1.05
        );
        grad.addColorStop(0,   '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1,   '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();

        // 中心点
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = settings.clockColor;
        ctx.fill();

        // 数字（拡大＆内側寄せ）
        const numberFontSize = radius * 0.20;
        ctx.font = numberFontSize + "px 'Inter'";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = settings.clockColor;
        for (let num = 1; num <= 12; num++) {
            const ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -baseRadius * 0.75);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, baseRadius * 0.75);
            ctx.rotate(-ang);
        }

        // 目盛り
        for (let i = 0; i < 60; i++) {
            const ang = i * Math.PI / 30;
            ctx.beginPath();
            ctx.rotate(ang);
            ctx.moveTo(0, -baseRadius * 0.9);
            if (i % 5 === 0) {
                ctx.lineWidth = 3;
                ctx.lineTo(0, -baseRadius * 0.8);
            } else {
                ctx.lineWidth = 1;
                ctx.lineTo(0, -baseRadius * 0.85);
            }
            ctx.strokeStyle = settings.clockColor;
            ctx.stroke();
            ctx.rotate(-ang);
        }
    }

    function drawFaceMinimal(ctx, radius) {
        const baseRadius = radius * 0.90;
        ctx.lineWidth = 4;
        ctx.strokeStyle = settings.clockColor;
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = Math.sin(angle) * (baseRadius - 20);
            const y1 = -Math.cos(angle) * (baseRadius - 20);
            const x2 = Math.sin(angle) * baseRadius;
            const y2 = -Math.cos(angle) * baseRadius;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.03, 0, 2 * Math.PI);
        ctx.fillStyle = settings.clockColor;
        ctx.fill();
    }

    function drawFaceModern(ctx, radius) {
        const baseRadius = radius * 0.95;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, 2 * Math.PI);
        ctx.fillStyle = settings.backgroundColor === '#1a202c' ? '#2d3748' : '#e2e8f0';
        ctx.fill();

        ctx.font = "bold " + radius * 0.2 + "px 'Inter'";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = settings.clockColor;
        ctx.fillText("12", 0, -baseRadius * 0.75);
        ctx.fillText("3", baseRadius * 0.75, 0);
        ctx.fillText("6", 0, baseRadius * 0.75);
        ctx.fillText("9", -baseRadius * 0.75, 0);

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = settings.clockColor;
        ctx.fill();
    }

    function drawHands(ctx, radius) {
        const now = new Date();
        let hour   = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        drawHand(ctx, hour,   radius * 0.5, radius * 0.07, settings.clockColor);

        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, settings.clockColor);

        second = second * Math.PI / 30;
        drawHand(ctx, second, radius * 0.9, radius * 0.02, '#e53e3e');
    }

    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    function setupEventListeners() {
        changeColorBtn.addEventListener('click', () => {
            let idx = clockColors.indexOf(settings.clockColor);
            settings.clockColor = clockColors[(idx + 1) % clockColors.length];
            saveSettings();
        });
        changeDesignBtn.addEventListener('click', () => {
            let idx = designs.indexOf(settings.design);
            settings.design = designs[(idx + 1) % designs.length];
            saveSettings();
        });
        changeBgBtn.addEventListener('click', () => {
            let idx = bgColors.indexOf(settings.backgroundColor);
            settings.backgroundColor = bgColors[(idx + 1) % bgColors.length];
            applySettings();
            saveSettings();
        });
        savePngBtn.addEventListener('click', () => {
            // 修正点: PNG の背景が黒くなる問題を防ぐため、エクスポート時に背景色を下敷きとして描画してから画像化する
            const dpr = window.devicePixelRatio || 1;
            const cssSize = canvas.parentElement.offsetWidth;
            const tmp = document.createElement('canvas');
            tmp.width = Math.round(cssSize * dpr);
            tmp.height = Math.round(cssSize * dpr);
            const tctx = tmp.getContext('2d');

            // デバイスピクセル比を考慮してクリアとスケールを設定
            tctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // 背景を塗る（settings.backgroundColor を使用）
            tctx.fillStyle = settings.backgroundColor || DEFAULTS.backgroundColor;
            tctx.fillRect(0, 0, cssSize, cssSize);

            // 現在の表示キャンバスを上に描画
            // canvas は CSS ピクセルで描画されている前提なのでそのまま描画する
            tctx.drawImage(canvas, 0, 0, cssSize, cssSize);

            const link = document.createElement('a');
            link.download = 'analog-clock.png';
            link.href = tmp.toDataURL('image/png');
            link.click();
        });
        resetBtn.addEventListener('click', () => {
            if (confirm('設定をリセットしますか？')) {
                localStorage.removeItem('analogClockSettings');
                loadSettings();
            }
        });

        const shareUrl  = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent('このアナログ時計サイト、カスタマイズできて面白いよ！');
        document.getElementById('twitterShare').href  =
            `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        document.getElementById('facebookShare').href =
            `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        document.getElementById('lineShare').href     =
            `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;
    }

    function init() {
        const size = canvas.parentElement.offsetWidth;
        canvas.width  = size;
        canvas.height = size;
        window.addEventListener('resize', () => {
            const s = canvas.parentElement.offsetWidth;
            canvas.width  = s;
            canvas.height = s;
        });
        loadSettings();
        setupEventListeners();
        requestAnimationFrame(drawClock);
    }

    init();
});