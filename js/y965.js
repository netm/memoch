document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素 ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const stageClearScreen = document.getElementById('stage-clear-screen');
    const gameOverMessage = document.getElementById('game-over-message');

    const start1PButton = document.getElementById('start-1p');
    const start2PButton = document.getElementById('start-2p');
    const restartButton = document.getElementById('restart-button');
    const menuButton = document.getElementById('menu-button');
    const nextStageButton = document.getElementById('next-stage-button');

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // --- ゲーム設定（動的半径用の閾値含む） ---
    const BORDER_WIDTH = 20; // 落ちる黒い領域の幅（px）
    const BALL_RADIUS_MIN = 8;
    const BALL_RADIUS_MAX = 24;
    const HOLE_RADIUS_MIN = 14;
    const HOLE_RADIUS_MAX = 40;

    const FRICTION = 0.945; // 摩擦
    const MIN_SPEED = 0.1;   // 停止とみなす速度
    const SHOT_POWER = 0.09; // ショットの強さの係数（少し小さくした）

    let canvasWidth, canvasHeight;
    let stageWidth, stageHeight; // 内側のプレイ可能領域

    // --- 動的決定される半径（resizeCanvasで設定） ---
    window.COMPUTED_BALL_RADIUS = 15;
    window.COMPUTED_HOLE_RADIUS = 25;

    // --- ゲーム状態 ---
    let player;
    let player2;
    let enemies = [];
    let holes = [];
    let allBalls = [];

    let gameMode = null; // '1p' or '2p'
    let stage = 1;
    let gameOver = false;
    let playerTurn = true; // 1Pモード用
    let currentPlayer = 1; // 2Pモード用
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragEnd = { x: 0, y: 0 };
    let activeBall = null; // 現在操作中のボール

    // --- 画面リサイズ対応（半径再計算、位置補正） ---
    function resizeCanvas() {
        const aspectRatio = 4 / 3;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (screenWidth / screenHeight > aspectRatio) {
            canvasHeight = screenHeight * 0.9;
            canvasWidth = canvasHeight * aspectRatio;
        } else {
            canvasWidth = screenWidth * 0.9;
            canvasHeight = canvasWidth / aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        stageWidth = canvasWidth - BORDER_WIDTH * 2;
        stageHeight = canvasHeight - BORDER_WIDTH * 2;

        // --- 動的半径計算（短辺基準の割合） ---
        const shortSide = Math.min(stageWidth, stageHeight);
        const computedBall = Math.round(shortSide * 0.03); // 例: 3%
        const computedHole = Math.round(shortSide * 0.06); // 例: 6%

        window.COMPUTED_BALL_RADIUS = Math.max(BALL_RADIUS_MIN, Math.min(BALL_RADIUS_MAX, computedBall || 15));
        window.COMPUTED_HOLE_RADIUS = Math.max(HOLE_RADIUS_MIN, Math.min(HOLE_RADIUS_MAX, computedHole || 25));

        // 既存オブジェクトの半径を更新し、位置がステージ内に収まるよう補正
        const br = window.COMPUTED_BALL_RADIUS;
        const hr = window.COMPUTED_HOLE_RADIUS;

        if (player) {
            player.radius = br;
            clampBallPosition(player);
        }
        if (player2) {
            player2.radius = br;
            clampBallPosition(player2);
        }
        enemies.forEach(e => {
            e.radius = br;
            clampBallPosition(e);
        });
        holes.forEach(h => {
            h.radius = hr;
            clampHolePosition(h);
        });
    }

    function clampBallPosition(ball) {
        ball.x = Math.max(BORDER_WIDTH + ball.radius, Math.min(canvasWidth - BORDER_WIDTH - ball.radius, ball.x));
        ball.y = Math.max(BORDER_WIDTH + ball.radius, Math.min(canvasHeight - BORDER_WIDTH - ball.radius, ball.y));
    }

    function clampHolePosition(hole) {
        hole.x = Math.max(BORDER_WIDTH + hole.radius, Math.min(canvasWidth - BORDER_WIDTH - hole.radius, hole.x));
        hole.y = Math.max(BORDER_WIDTH + hole.radius, Math.min(canvasHeight - BORDER_WIDTH - hole.radius, hole.y));
    }

    // --- 画面切り替え ---
    function showScreen(screen) {
        startScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
        stageClearScreen.classList.remove('active');
        screen.classList.add('active');
    }

    // --- ボールクラス ---
    class Ball {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.radius = radius;
            this.color = color;
            this.active = true; // 落ちたらfalse
        }

        draw() {
            if (!this.active) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (!this.active) return;

            // 摩擦
            this.vx *= FRICTION;
            this.vy *= FRICTION;

            // 速度が小さければ停止
            if (Math.abs(this.vx) < MIN_SPEED) this.vx = 0;
            if (Math.abs(this.vy) < MIN_SPEED) this.vy = 0;

            // 位置更新（境界で反発させない — 境界を越えると checkFalling() で落ちる）
            this.x += this.vx;
            this.y += this.vy;
        }

        isStopped() {
            return this.vx === 0 && this.vy === 0;
        }
    }

    // --- 穴クラス ---
    class Hole {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
        }
    }

    // --- 初期化 ---
    function initGame() {
        resizeCanvas();
        gameOver = false;
        playerTurn = true;
        currentPlayer = 1;
        isDragging = false;
        enemies = [];
        holes = [];
        allBalls = [];

        const BR = window.COMPUTED_BALL_RADIUS || 15;
        const HR = window.COMPUTED_HOLE_RADIUS || 25;

        // プレイヤー1作成
        player = new Ball(canvasWidth * 0.25, canvasHeight / 2, BR, 'blue');
        allBalls.push(player);

        if (gameMode === '1p') {
            // 敵を作成 (ステージ数)
            for (let i = 0; i < stage; i++) {
                let pos = getSafePosition(BR);
                enemies.push(new Ball(pos.x, pos.y, BR, 'orange'));
            }
            allBalls.push(...enemies);

            // 穴を作成 (ステージ数)
            for (let i = 0; i < stage; i++) {
                let pos = getSafePosition(HR);
                holes.push(new Hole(pos.x, pos.y, HR));
            }
        } else if (gameMode === '2p') {
            // プレイヤー2作成
            player2 = new Ball(canvasWidth * 0.75, canvasHeight / 2, BR, 'orange');
            allBalls.push(player2);

            // 穴を作成 (ランダム 1〜7個)
            let holeCount = Math.floor(Math.random() * 7) + 1;
            for (let i = 0; i < holeCount; i++) {
                let pos = getSafePosition(HR);
                holes.push(new Hole(pos.x, pos.y, HR));
            }
        }

        // 衝突重なりリスク回避のため初期位置補正
        allBalls.forEach(b => clampBallPosition(b));
        holes.forEach(h => clampHolePosition(h));

        gameLoop();
    }

    // --- 安全な位置を取得 (他のボールや穴と重ならない) ---
    function getSafePosition(radius) {
        let x, y, safe;
        do {
            safe = true;
            x = BORDER_WIDTH + radius + Math.random() * (stageWidth - radius * 2);
            y = BORDER_WIDTH + radius + Math.random() * (stageHeight - radius * 2);

            // 他のボールとチェック
            for (const ball of allBalls) {
                const dist = Math.hypot(x - ball.x, y - ball.y);
                if (dist < radius + ball.radius + 10) { // 10はマージン
                    safe = false;
                    break;
                }
            }
            if (!safe) continue;

            // 他の穴とチェック
            for (const hole of holes) {
                const dist = Math.hypot(x - hole.x, y - hole.y);
                if (dist < radius + hole.radius + 10) {
                    safe = false;
                    break;
                }
            }
        } while (!safe);
        return { x, y };
    }

    // --- ゲームループ ---
    function gameLoop() {
        if (gameOver) return;

        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // --- 更新処理 ---
    function update() {
        let allStopped = areAllBallsStopped();

        // 1Pモードで敵のターン処理
        if (gameMode === '1p' && !playerTurn && allStopped) {
            moveEnemies();
            playerTurn = true; // 敵が動き始めたら、次はプレイヤーのターン（止まったら）
        }

        // 2Pモードでターン切り替え
        if (gameMode === '2p' && allStopped && activeBall) {
            currentPlayer = (currentPlayer === 1) ? 2 : 1;
            activeBall = null; // ターンリセット
        }

        // 全ボールの更新
        allBalls.forEach(ball => ball.update());

        // ボール同士の衝突判定
        for (let i = 0; i < allBalls.length; i++) {
            for (let j = i + 1; j < allBalls.length; j++) {
                checkBallCollision(allBalls[i], allBalls[j]);
            }
        }

        // 穴と落下判定
        allBalls.forEach(ball => {
            if (!ball.active) return;
            checkFalling(ball);
        });

        // ゲーム状態チェック
        checkGameState();
    }

    // --- 描画処理 ---
    function draw() {
        // 全体を黒でクリア (外枠)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // ステージ内側を描画
        ctx.fillStyle = '#cccccc'; //薄い灰色
        ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, stageWidth, stageHeight);

        // 穴を描画
        holes.forEach(hole => hole.draw());

        // ボールを描画
        allBalls.forEach(ball => ball.draw());

        // ドラッグ線を描画
        if (isDragging && activeBall) {
            ctx.beginPath();
            ctx.moveTo(activeBall.x, activeBall.y);
            ctx.lineTo(dragEnd.x, dragEnd.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
    }

    // --- 敵の移動 (1P) ---
    // 停止中のCOMだけを動かす。移動方向はステージ中心方向にバイアスして
    // 直接ステージ端に落ちないように複数回試行して安全なベクトルを選ぶ。
    function moveEnemies() {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        enemies.forEach(enemy => {
            if (!enemy.active) return;

            // すでに動いている（プレイヤーに弾かれている等）のは変更しない
            if (!enemy.isStopped()) return;

            // 試行して安全な方向を探す
            let chosenVx = 0;
            let chosenVy = 0;
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                // 中心方向へのベース角度にランダムオフセットを足す（オフセットは狭め）
                const baseAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
                const randomOffset = (Math.random() - 0.5) * Math.PI * 0.6; // ±0.3π程度のばらつき
                const angle = baseAngle + randomOffset;

                // 力は小さめに（自爆を防ぐため）
                const force = 3 + Math.random() * 2; // 3〜5 の範囲で短め

                const vx = Math.cos(angle) * force;
                const vy = Math.sin(angle) * force;

                // 予測位置（短めの時間ステップで安全か判定）
                const predictSteps = 12;
                let px = enemy.x;
                let py = enemy.y;
                let safe = true;
                let pvx = vx;
                let pvy = vy;

                for (let s = 0; s < predictSteps; s++) {
                    // 摩擦を簡易適用して予測
                    pvx *= FRICTION;
                    pvy *= FRICTION;
                    px += pvx;
                    py += pvy;

                    // ボール半径を考慮してステージ外に出るかを判定
                    if (px - enemy.radius < BORDER_WIDTH || px + enemy.radius > canvasWidth - BORDER_WIDTH ||
                        py - enemy.radius < BORDER_WIDTH || py + enemy.radius > canvasHeight - BORDER_WIDTH) {
                        safe = false;
                        break;
                    }
                }

                if (safe) {
                    chosenVx = vx;
                    chosenVy = vy;
                    break;
                }

                attempts++;
            }

            // 安全な方向が見つかったらセット。見つからなければ中心方向へ小さめに押す
            if (attempts < maxAttempts) {
                enemy.vx = chosenVx;
                enemy.vy = chosenVy;
            } else {
                // それでも見つからないときは中心方向へ非常に小さな力を与える（落下リスク低）
                const fallbackAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
                const fallbackForce = 2; // ごく小さい力
                enemy.vx = Math.cos(fallbackAngle) * fallbackForce;
                enemy.vy = Math.sin(fallbackAngle) * fallbackForce;
            }
        });
    }

    // --- 全ボール停止チェック ---
    function areAllBallsStopped() {
        return allBalls.every(ball => !ball.active || ball.isStopped());
    }

    // --- ボール同士の衝突 ---
    function checkBallCollision(ball1, ball2) {
        if (!ball1.active || !ball2.active) return;

        const dist = Math.hypot(ball1.x - ball2.x, ball1.y - ball2.y);
        if (dist < ball1.radius + ball2.radius) {
            // 簡単な反発処理（正確な物理計算ではない）
            const angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
            const totalSpeed = Math.hypot(ball1.vx, ball1.vy) + Math.hypot(ball2.vx, ball2.vy);

            ball1.vx = -Math.cos(angle) * totalSpeed * 0.5;
            ball1.vy = -Math.sin(angle) * totalSpeed * 0.5;
            ball2.vx = Math.cos(angle) * totalSpeed * 0.5;
            ball2.vy = Math.sin(angle) * totalSpeed * 0.5;

            // 重なりを解消
            const overlap = (ball1.radius + ball2.radius) - dist;
            const adjustX = (overlap / 2) * Math.cos(angle);
            const adjustY = (overlap / 2) * Math.sin(angle);
            ball1.x -= adjustX;
            ball1.y -= adjustY;
            ball2.x += adjustX;
            ball2.y += adjustY;
        }
    }

    // --- 落下判定（単純化版） ---
    // ステージ外（黒い領域）へは「ボール中心が外側に出たとき」にのみ落ちる。
    // 穴はボール中心が穴の中心から hole.radius 未満なら落ちる。
    function checkFalling(ball) {
        if (!ball.active) return;

        // ボール中心がステージ内（ボーダーを除いた領域）にあるかチェック
        const cx = ball.x;
        const cy = ball.y;

        // ステージ内矩形（ボーダーを除いた内側）
        const left = BORDER_WIDTH;
        const right = canvasWidth - BORDER_WIDTH;
        const top = BORDER_WIDTH;
        const bottom = canvasHeight - BORDER_WIDTH;

        // 中心点がステージ外（黒い領域）にあるなら落ちる
        if (cx < left || cx > right || cy < top || cy > bottom) {
            ball.active = false;
            return;
        }

        // 穴（hole）の判定は従来どおり、中心同士の距離で判定
        for (const hole of holes) {
            const d = Math.hypot(ball.x - hole.x, ball.y - hole.y);
            if (d < hole.radius) {
                ball.active = false;
                return;
            }
        }
    }

    // --- ゲーム状態チェック ---
    function checkGameState() {
        if (gameOver) return;

        if (gameMode === '1p') {
            // プレイヤーが落ちた
            if (!player.active) {
                gameOver = true;
                gameOverMessage.textContent = 'ゲームオーバー';
                showScreen(gameOverScreen);
                return;
            }
            // 敵を全て倒した
            const allEnemiesDown = enemies.every(enemy => !enemy.active);
            if (allEnemiesDown) {
                gameOver = true; // 一時停止
                showScreen(stageClearScreen);
                return;
            }
        } else if (gameMode === '2p') {
            // どちらかが落ちた
            if (!player.active) {
                gameOver = true;
                gameOverMessage.textContent = 'プレイヤー2の勝ち！';
                showScreen(gameOverScreen);
            } else if (!player2.active) {
                gameOver = true;
                gameOverMessage.textContent = 'プレイヤー1の勝ち！';
                showScreen(gameOverScreen);
            }
        }
    }

    // --- 入力イベント ---
    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
        const clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function handleDragStart(evt) {
        evt.preventDefault();
        if (!areAllBallsStopped()) return;

        const pos = getMousePos(evt);
        activeBall = null;

        if (gameMode === '1p' && playerTurn) {
            const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
            if (dist <= player.radius) {
                activeBall = player;
            }
        } else if (gameMode === '2p') {
            if (currentPlayer === 1) {
                const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
                if (dist <= player.radius) {
                    activeBall = player;
                }
            } else { // currentPlayer === 2
                const dist = Math.hypot(pos.x - player2.x, pos.y - player2.y);
                if (dist <= player2.radius) {
                    activeBall = player2;
                }
            }
        }

        if (activeBall) {
            isDragging = true;
            dragStart = pos;
            dragEnd = pos;
        }
    }

    function handleDragMove(evt) {
        evt.preventDefault();
        if (!isDragging || !activeBall) return;
        dragEnd = getMousePos(evt);
    }

    function handleDragEnd(evt) {
        evt.preventDefault();
        if (!isDragging || !activeBall) return;

        isDragging = false;

        const dx = dragStart.x - dragEnd.x;
        const dy = dragStart.y - dragEnd.y;

        // 速度を少し短くするためSHOT_POWERは小さめに設定済み
        activeBall.vx = dx * SHOT_POWER;
        activeBall.vy = dy * SHOT_POWER;

        if (gameMode === '1p') {
            playerTurn = false;
        }
        // 2Pモードのターン切り替えは update() 内の allStopped 判定で行う
    }

    // --- イベントリスナー登録 ---
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('touchstart', handleDragStart, { passive: false });
    canvas.addEventListener('touchmove', handleDragMove, { passive: false });
    canvas.addEventListener('touchend', handleDragEnd, { passive: false });
    window.addEventListener('resize', () => {
        if (!gameOver) {
            resizeCanvas();
        }
    });

    // --- ボタンリスナー ---
    start1PButton.addEventListener('click', () => {
        gameMode = '1p';
        stage = 1;
        showScreen(gameScreen);
        initGame();
    });

    start2PButton.addEventListener('click', () => {
        gameMode = '2p';
        showScreen(gameScreen);
        initGame();
    });

    restartButton.addEventListener('click', () => {
        showScreen(gameScreen);
        initGame(); // 現在のモードとステージで再初期化
    });

    menuButton.addEventListener('click', () => {
        showScreen(startScreen);
    });

    nextStageButton.addEventListener('click', () => {
        stage++;
        showScreen(gameScreen);
        initGame();
    });

    // --- 初期起動 ---
    showScreen(startScreen);
});