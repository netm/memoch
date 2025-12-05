    // --- 定数・設定 ---
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 600;
    const GRAVITY = 0.24;
    const FRICTION = 0.99; // 空気抵抗
    const WALL_BOUNCE = 0.99; // 壁の跳ね返り係数

    // ゲーム設定
    const INITIAL_BALLS = 10;
    const SCORE_BLACK = 10;
    const SCORE_RED = 30;
    const BONUS_BALLS = 10;
    const GAME_OVER_DELAY = 3000; // ms

    // 要素取得
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const ballDisplay = document.getElementById('ball-display');
    const msgOverlay = document.getElementById('message-overlay');
    const finalScoreSpan = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    // 状態変数
    let balls = []; // 盤面上のボール
    let pegs = []; // 釘
    let holes = []; // 穴
    let score = 0;
    let remainingBalls = INITIAL_BALLS;
    let isDragging = false;
    let dragStartY = 0;
    let dragCurrentY = 0;
    let springPower = 0; // 0.0 to 1.0
    let gameOverTimer = null;
    let isGameOver = false;
    let rafId = null;

    // --- クラス定義 ---

    class Ball {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.radius = 12;
            this.markedForDeletion = false;

            // 停止判定用
            this.prevX = x;
            this.prevY = y;
            this.stoppedSince = null;      // 停止開始時刻（ms）または null
            this.stopThreshold = 0.8;      // 位置差の閾値（ピクセル） - 調整可
            this.stopDuration = 1000;      // 停止で消すまでの時間（ms）
        }

        update() {
            // 重力
            this.vy += GRAVITY;
            // 摩擦
            this.vx *= FRICTION;
            this.vy *= FRICTION;

            // 位置更新
            this.x += this.vx;
            this.y += this.vy;

            // --- 壁判定 ---
            // 右側のバネエリアとの境界線 (x=360あたり)
            if (this.x > 350 - this.radius && this.x < 360 && this.y > 100) {
                if (this.vx > 0) {
                    this.x = 350 - this.radius;
                    this.vx *= -WALL_BOUNCE;
                }
            }

            // 右端（バネエリア内）
            if (this.x > CANVAS_WIDTH - this.radius) {
                this.x = CANVAS_WIDTH - this.radius;
                this.vx *= -WALL_BOUNCE;
            }

            // 左端
            if (this.x < this.radius) {
                this.x = this.radius;
                this.vx *= -WALL_BOUNCE;
            }

            // 上部のカーブ判定 (半円)
            const arcCenterX = 200;
            const arcCenterY = 200;
            const arcRadius = 190;

            if (this.y < arcCenterY) {
                const dx = this.x - arcCenterX;
                const dy = this.y - arcCenterY;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist > arcRadius - this.radius) {
                    const nx = dx / dist;
                    const ny = dy / dist;

                    const overlap = dist - (arcRadius - this.radius);
                    this.x -= nx * overlap;
                    this.y -= ny * overlap;

                    const dot = this.vx * nx + this.vy * ny;
                    this.vx = (this.vx - 2 * dot * nx) * WALL_BOUNCE;
                    this.vy = (this.vy - 2 * dot * ny) * WALL_BOUNCE;
                }
            }

            // 下に落ちたら消える
            if (this.y > CANVAS_HEIGHT + this.radius) {
                this.markedForDeletion = true;
                return;
            }

            // 画面内で停止しているか判定（停止1秒で消える）
            const onScreen = this.y >= -this.radius && this.y <= CANVAS_HEIGHT + this.radius;
            const dx = Math.abs(this.x - this.prevX);
            const dy = Math.abs(this.y - this.prevY);

            // 速度ベースの判定も併用すると安定する（微小な位置変化を許容）
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const speedEps = 0.05; // 速度がこれ以下ならほぼ停止とみなす

            if (onScreen && dx < this.stopThreshold && dy < this.stopThreshold && speed < speedEps) {
                if (this.stoppedSince === null) {
                    this.stoppedSince = Date.now();
                } else if (Date.now() - this.stoppedSince >= this.stopDuration) {
                    this.markedForDeletion = true;
                }
            } else {
                // 動いたら停止判定をリセット
                this.stoppedSince = null;
            }

            // 次フレーム用に位置を保存
            this.prevX = this.x;
            this.prevY = this.y;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    }

    class Peg {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 4;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#555555ff'; // 釘の色
            ctx.fill();
            ctx.closePath();

            // 光沢
            ctx.beginPath();
            ctx.arc(this.x - 1, this.y - 1, 1, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.closePath();
        }
    }

    class Hole {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type; // 'black' or 'red'
            this.radius = 14;
            this.points = type === 'red' ? SCORE_RED : SCORE_BLACK;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.type === 'red' ? '#d32f2f' : '#212121';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.stroke();
            ctx.closePath();

            // 穴のラベル
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.points, this.x, this.y);
        }
    }

    // --- ゲームロジック関数 ---

    function initGame() {
        score = 0;
        remainingBalls = INITIAL_BALLS;
        balls = [];
        pegs = [];
        holes = [];
        isGameOver = false;
        msgOverlay.style.display = 'none';
        if (gameOverTimer) { clearTimeout(gameOverTimer); gameOverTimer = null; }
        updateUI();
        generateMap();
        if (rafId) cancelAnimationFrame(rafId);
        loop();
    }

    function generateMap() {
        const safeZone = { xMin: 30, xMax: 320, yMin: 150, yMax: 500 };
        const entities = [];

        function checkOverlap(x, y, r) {
            for (let e of entities) {
                const dist = Math.sqrt((e.x - x)**2 + (e.y - y)**2);
                if (dist < e.r + r + 20) return true;
            }
            return false;
        }

        // 穴の生成
        const holeTypes = ['red', 'red', 'black', 'black', 'black', 'black', 'black', 'black', 'black'];

        for (let type of holeTypes) {
            let placed = false;
            let attempt = 0;
            while (!placed && attempt < 200) {
                const x = Math.random() * (safeZone.xMax - safeZone.xMin) + safeZone.xMin;
                const y = Math.random() * (safeZone.yMax - safeZone.yMin) + safeZone.yMin;
                if (!checkOverlap(x, y, 15)) {
                    holes.push(new Hole(x, y, type));
                    entities.push({x, y, r: 15});
                    placed = true;
                }
                attempt++;
            }
        }

        // 釘の生成 (6本)
        for (let i = 0; i < 6; i++) {
            let placed = false;
            let attempt = 0;
            while (!placed && attempt < 200) {
                const x = Math.random() * (safeZone.xMax - safeZone.xMin) + safeZone.xMin;
                const y = Math.random() * (safeZone.yMax - safeZone.yMin) + safeZone.yMin;
                if (!checkOverlap(x, y, 5)) {
                    pegs.push(new Peg(x, y));
                    entities.push({x, y, r: 5});
                    placed = true;
                }
                attempt++;
            }
        }
    }

    function spawnBall(power) {
        if (remainingBalls <= 0) return;

        remainingBalls--;
        const maxSpeed = -25;
        const minSpeed = -15;
        const vy = minSpeed + (maxSpeed - minSpeed) * power;

        balls.push(new Ball(375, 550, 0, vy));
        updateUI();

        if (gameOverTimer) {
            clearTimeout(gameOverTimer);
            gameOverTimer = null;
        }
    }

    function checkCollisions() {
        for (let b of balls) {
            // 対 釘
            for (let p of pegs) {
                const dx = b.x - p.x;
                const dy = b.y - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = b.radius + p.radius;

                if (dist < minDist && dist > 0) {
                    const angle = Math.atan2(dy, dx);
                    const speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);

                    const bounce = 0.5 + Math.random() * 0.3;

                    b.vx = Math.cos(angle) * speed * bounce;
                    b.vy = Math.sin(angle) * speed * bounce;

                    const overlap = minDist - dist;
                    b.x += Math.cos(angle) * overlap;
                    b.y += Math.sin(angle) * overlap;
                }
            }

            // 対 穴
            for (let h of holes) {
                const dx = b.x - h.x;
                const dy = b.y - h.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < h.radius * 0.5 && !b.markedForDeletion) {
                    score += h.points;
                    b.markedForDeletion = true;

                    if (h.type === 'red') {
                        remainingBalls += BONUS_BALLS;
                    }
                    updateUI();
                }
            }
        }
    }

    function update() {
        balls.forEach(b => b.update());
        checkCollisions();

        // 削除フラグのボールを除去
        balls = balls.filter(b => !b.markedForDeletion);

        // ゲームオーバー判定
        if (remainingBalls === 0 && balls.length === 0 && !isGameOver && !gameOverTimer) {
            gameOverTimer = setTimeout(() => {
                if (remainingBalls === 0 && balls.length === 0) {
                    isGameOver = true;
                    showGameOver();
                }
            }, GAME_OVER_DELAY);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 上部アーチ描画
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(200, 200, 200, Math.PI, 0);
        ctx.lineTo(400, 600);
        ctx.lineTo(0, 600);
        ctx.fill();

        // 盤面描画
        ctx.fillStyle = '#eaffea';
        ctx.beginPath();
        ctx.arc(200, 200, 190, Math.PI, 0);
        ctx.lineTo(350, 600);
        ctx.lineTo(10, 600);
        ctx.lineTo(10, 200);
        ctx.fill();

        // 右側レーン
        ctx.fillStyle = 'rgba(234,255,234,0.5)';
        ctx.fillRect(355, 0, 40, 600);

        // オブジェクト
        pegs.forEach(p => p.draw());
        holes.forEach(h => h.draw());
        balls.forEach(b => b.draw());

        // バネ (UI)
        drawSpring();
    }

    function drawSpring() {
        const laneX = 375;
        const baseY = 580;
        const handleHeight = 20;

        const pullPixels = isDragging ? (dragCurrentY - dragStartY) : 0;
        const pullClamped = Math.max(0, Math.min(150, pullPixels));
        const springTop = 450 + pullClamped;

        ctx.beginPath();
        ctx.moveTo(laneX, springTop);
        for(let y=springTop; y < baseY; y+=5) {
            ctx.lineTo(laneX + (y%10===0?5:-5), y);
        }
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isDragging ? '#ff5722' : '#333';
        ctx.fillRect(laneX - 15, springTop - handleHeight, 30, handleHeight);
    }

    // --- UI / ループ / イベント ---

    function updateUI() {
        scoreDisplay.textContent = score;
        ballDisplay.textContent = remainingBalls;
    }

    function showGameOver() {
        finalScoreSpan.textContent = score;
        msgOverlay.style.display = 'flex';
    }

    function loop() {
        update();
        draw();
        // ゲームオーバーになっていて盤面にボールが無ければ停止
        if (!isGameOver || balls.length > 0) {
            rafId = requestAnimationFrame(loop);
        }
    }

    // --- 入力ハンドリング (PC & Mobile) ---

    // バネエリアの判定
    function isSpringArea(x, y) {
        return x > 350 && y > 400;
    }

    function handleStart(x, y) {
        // キャンバス内の座標に変換
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const cx = (x - rect.left) * scaleX;
        const cy = (y - rect.top) * scaleY;

        if (isSpringArea(cx, cy) && remainingBalls > 0) {
            isDragging = true;
            dragStartY = cy;
            dragCurrentY = cy;
        }
    }

    function handleMove(x, y) {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;
        const cy = (y - rect.top) * scaleY;
        dragCurrentY = cy;
    }

    function handleEnd() {
        if (!isDragging) return;

        const pullDist = Math.max(0, dragCurrentY - dragStartY);
        const maxPull = 150;
        const power = Math.min(pullDist, maxPull) / maxPull; // 0.0 - 1.0

        if (power > 0.1) {
            spawnBall(power);
        }

        isDragging = false;
        dragStartY = 0;
        dragCurrentY = 0;
    }

    // Mouse Events
    canvas.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleEnd);

    // Touch Events
    canvas.addEventListener('touchstart', e => {
        e.preventDefault(); // スクロール防止
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive: false});

    window.addEventListener('touchmove', e => {
        if(isDragging) e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive: false});

    window.addEventListener('touchend', handleEnd);

    // Restart
    restartBtn.addEventListener('click', initGame);

    // --- シェア機能 ---
    window.shareSocial = function(platform) {
        const text = `スマートボールWebゲームで遊んだよ！\nスコア: ${score}点\n`;
        const url = window.location.href;
        const hash = "#スマートボール";

        let shareUrl = "";

        switch(platform) {
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=スマートボール,WebGame`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'line':
                shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text + " " + url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=スマートボールゲーム&body=${encodeURIComponent(text + "\n" + url)}`;
                break;
            case 'native':
                if (navigator.share) {
                    navigator.share({
                        title: 'スマートボールWebゲーム',
                        text: text,
                        url: url,
                    }).catch(console.error);
                    return;
                } else {
                    alert("お使いのブラウザはシェア機能に対応していません。");
                    return;
                }
        }

        if(shareUrl) window.open(shareUrl, '_blank');
    };

    // --- ネイティブシェアボタンの表示制御 ---
    if (!navigator.share) {
        const btn = document.getElementById('native-share-btn');
        if (btn) btn.style.display = 'none';
    }

    // --- ゲーム開始 ---
    initGame();