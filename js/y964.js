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
    const BORDER_WIDTH = 20;
    const BALL_RADIUS_MIN = 8;
    const BALL_RADIUS_MAX = 24;
    const HOLE_RADIUS_MIN = 14;
    const HOLE_RADIUS_MAX = 40;

    const FRICTION = 0.977;
    const MIN_SPEED = 0.1;
    const SHOT_POWER = 0.10;

    let canvasWidth, canvasHeight;
    let stageWidth, stageHeight;

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
    let playerTurn = true; // 1P用（1Pモードでのプレイヤーのターンか）
    let currentPlayer = 1; // 2P用：1 または 2
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragEnd = { x: 0, y: 0 };
    let activeBall = null;

    // --- resize & radius recalculation ---
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

        const shortSide = Math.min(stageWidth, stageHeight);
        const computedBall = Math.round(shortSide * 0.03);
        const computedHole = Math.round(shortSide * 0.06);

        window.COMPUTED_BALL_RADIUS = Math.max(BALL_RADIUS_MIN, Math.min(BALL_RADIUS_MAX, computedBall || 15));
        window.COMPUTED_HOLE_RADIUS = Math.max(HOLE_RADIUS_MIN, Math.min(HOLE_RADIUS_MAX, computedHole || 25));

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

    // --- 画面切替 ---
    function showScreen(screen) {
        startScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
        stageClearScreen.classList.remove('active');
        screen.classList.add('active');
    }

    // --- Ball class ---
    class Ball {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.radius = radius;
            this.color = color;
            this.active = true;
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

            this.vx *= FRICTION;
            this.vy *= FRICTION;

            if (Math.abs(this.vx) < MIN_SPEED) this.vx = 0;
            if (Math.abs(this.vy) < MIN_SPEED) this.vy = 0;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x - this.radius < BORDER_WIDTH) {
                this.x = BORDER_WIDTH + this.radius;
                this.vx *= -1;
            } else if (this.x + this.radius > canvasWidth - BORDER_WIDTH) {
                this.x = canvasWidth - BORDER_WIDTH - this.radius;
                this.vx *= -1;
            }
            if (this.y - this.radius < BORDER_WIDTH) {
                this.y = BORDER_WIDTH + this.radius;
                this.vy *= -1;
            } else if (this.y + this.radius > canvasHeight - BORDER_WIDTH) {
                this.y = canvasHeight - BORDER_WIDTH - this.radius;
                this.vy *= -1;
            }
        }

        isStopped() {
            return this.vx === 0 && this.vy === 0;
        }
    }

    // --- Hole class ---
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
        player = null;
        player2 = null;
        activeBall = null;

        const BR = window.COMPUTED_BALL_RADIUS || 15;
        const HR = window.COMPUTED_HOLE_RADIUS || 25;

        // プレイヤー1作成
        player = new Ball(canvasWidth * 0.25, canvasHeight / 2, BR, 'white');
        allBalls.push(player);

        if (gameMode === '1p') {
            for (let i = 0; i < stage; i++) {
                let pos = getSafePosition(BR);
                const e = new Ball(pos.x, pos.y, BR, 'orange');
                enemies.push(e);
                allBalls.push(e);
            }

            for (let i = 0; i < stage; i++) {
                let pos = getSafePosition(HR);
                const h = new Hole(pos.x, pos.y, HR);
                holes.push(h);
            }
        } else if (gameMode === '2p') {
            // プレイヤー2作成
            player2 = new Ball(canvasWidth * 0.75, canvasHeight / 2, BR, 'orange');
            allBalls.push(player2);

            // 穴をランダム（1〜7個）
            let holeCount = Math.floor(Math.random() * 7) + 1;
            for (let i = 0; i < holeCount; i++) {
                let pos = getSafePosition(HR);
                holes.push(new Hole(pos.x, pos.y, HR));
            }
        }

        // 初期位置補正
        allBalls.forEach(b => clampBallPosition(b));
        holes.forEach(h => clampHolePosition(h));

        gameLoop();
    }

    // --- 安全な位置取得 ---
    function getSafePosition(radius) {
        let x, y, safe;
        let tries = 0;
        const maxTries = 300;
        do {
            tries++;
            safe = true;
            x = BORDER_WIDTH + radius + Math.random() * (stageWidth - radius * 2);
            y = BORDER_WIDTH + radius + Math.random() * (stageHeight - radius * 2);

            for (const ball of allBalls) {
                const dist = Math.hypot(x - ball.x, y - ball.y);
                if (dist < radius + ball.radius + 10) {
                    safe = false;
                    break;
                }
            }
            if (!safe) continue;

            for (const hole of holes) {
                const dist = Math.hypot(x - hole.x, y - hole.y);
                if (dist < radius + hole.radius + 10) {
                    safe = false;
                    break;
                }
            }

            if (tries > maxTries) {
                x = BORDER_WIDTH + radius + (stageWidth - radius * 2) * 0.5;
                y = BORDER_WIDTH + radius + (stageHeight - radius * 2) * 0.5;
                safe = true;
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

    // --- 更新 ---
    function update() {
        let allStopped = areAllBallsStopped();

        if (gameMode === '1p' && !playerTurn && allStopped) {
            moveEnemies();
            playerTurn = true;
        }

        if (gameMode === '2p' && allStopped) {
            // 2P: ターン切り替えはショット後の停止確認で行う
            if (activeBall === null) {
                // 何もしない。次のプレイヤーが選択できる状態
            } else {
                // activeBall があるが全停止なら activeBall はすでに null のはずだが念のためリセット
                activeBall = null;
            }
        }

        allBalls.forEach(ball => ball.update());

        for (let i = 0; i < allBalls.length; i++) {
            for (let j = i + 1; j < allBalls.length; j++) {
                checkBallCollision(allBalls[i], allBalls[j]);
            }
        }

        allBalls.forEach(ball => {
            if (!ball.active) return;
            checkFalling(ball);
        });

        checkGameState();
    }

    // --- 描画 ---
    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgba(133,93,0,0.89)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = '#168500ff';
        ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, stageWidth, stageHeight);

        holes.forEach(hole => hole.draw());

        allBalls.forEach(ball => ball.draw());

        if (isDragging && activeBall) {
            ctx.beginPath();
            ctx.moveTo(activeBall.x, activeBall.y);
            ctx.lineTo(dragEnd.x, dragEnd.y);
            ctx.strokeStyle = 'rgba(207,188,94,0.97)';
            ctx.lineWidth = Math.max(4, canvasWidth * 0.01);
            ctx.stroke();
            ctx.closePath();
        }
    }

    // --- 敵の移動 (1P) ---
    function moveEnemies() {
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        enemies.forEach(enemy => {
            if (!enemy.active) return;
            if (!enemy.isStopped()) return;

            let chosenVx = 0;
            let chosenVy = 0;
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                const baseAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
                const randomOffset = (Math.random() - 0.5) * Math.PI * 0.6;
                const angle = baseAngle + randomOffset;
                const force = 3 + Math.random() * 2;

                const vx = Math.cos(angle) * force;
                const vy = Math.sin(angle) * force;

                const predictSteps = 12;
                let px = enemy.x;
                let py = enemy.y;
                let safe = true;
                let pvx = vx;
                let pvy = vy;

                for (let s = 0; s < predictSteps; s++) {
                    pvx *= FRICTION;
                    pvy *= FRICTION;
                    px += pvx;
                    py += pvy;

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

            if (attempts < maxAttempts) {
                enemy.vx = chosenVx;
                enemy.vy = chosenVy;
            } else {
                const fallbackAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
                const fallbackForce = 2;
                enemy.vx = Math.cos(fallbackAngle) * fallbackForce;
                enemy.vy = Math.sin(fallbackAngle) * fallbackForce;
            }
        });
    }

    // --- 停止チェック ---
    function areAllBallsStopped() {
        return allBalls.every(ball => !ball.active || ball.isStopped());
    }

    // --- 衝突 ---
    function checkBallCollision(ball1, ball2) {
        if (!ball1.active || !ball2.active) return;

        let dx = ball2.x - ball1.x;
        let dy = ball2.y - ball1.y;
        let dist = Math.hypot(dx, dy);

        if (dist === 0) {
            const angle = Math.random() * Math.PI * 2;
            dx = Math.cos(angle) * 0.01;
            dy = Math.sin(angle) * 0.01;
            dist = Math.hypot(dx, dy);
        }

        if (dist < ball1.radius + ball2.radius) {
            const angle = Math.atan2(dy, dx);
            const speed1 = Math.hypot(ball1.vx, ball1.vy);
            const speed2 = Math.hypot(ball2.vx, ball2.vy);
            const totalSpeed = speed1 + speed2;

            ball1.vx = -Math.cos(angle) * totalSpeed * 0.5;
            ball1.vy = -Math.sin(angle) * totalSpeed * 0.5;
            ball2.vx = Math.cos(angle) * totalSpeed * 0.5;
            ball2.vy = Math.sin(angle) * totalSpeed * 0.5;

            const overlap = (ball1.radius + ball2.radius) - dist;
            const adjustX = (overlap / 2) * Math.cos(angle);
            const adjustY = (overlap / 2) * Math.sin(angle);
            ball1.x -= adjustX;
            ball1.y -= adjustY;
            ball2.x += adjustX;
            ball2.y += adjustY;
        }
    }

    // --- 落下判定 ---
    function checkFalling(ball) {
        if (!ball.active) return;
        for (const hole of holes) {
            const d = Math.hypot(ball.x - hole.x, ball.y - hole.y);
            if (d < Math.max(1, hole.radius - ball.radius * 0.5)) {
                ball.active = false;
                return;
            }
        }
    }

    // --- ゲーム状態チェック ---
    function checkGameState() {
        if (gameOver) return;

        if (gameMode === '1p') {
            if (!player.active) {
                gameOver = true;
                gameOverMessage.textContent = 'ゲームオーバー';
                showScreen(gameOverScreen);
                return;
            }
            const allEnemiesDown = enemies.every(enemy => !enemy.active);
            if (allEnemiesDown) {
                gameOver = true;
                showScreen(stageClearScreen);
                return;
            }
        } else if (gameMode === '2p') {
            if (!player.active) {
                gameOver = true;
                gameOverMessage.textContent = 'プレイヤー2の勝ち！ 再戦する';
                showScreen(gameOverScreen);
                return;
            } else if (!player2.active) {
                gameOver = true;
                gameOverMessage.textContent = 'プレイヤー1の勝ち！ 再戦する';
                showScreen(gameOverScreen);
                return;
            }
        }
    }

    // --- 入力ヘルパー ---
    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX = evt.clientX;
        let clientY = evt.clientY;
        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        } else if (evt.changedTouches && evt.changedTouches.length > 0) {
            clientX = evt.changedTouches[0].clientX;
            clientY = evt.changedTouches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // --- ドラッグ開始 ---
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
            } else {
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

    // --- ドラッグ移動 ---
    function handleDragMove(evt) {
        evt.preventDefault();
        if (!isDragging || !activeBall) return;
        dragEnd = getMousePos(evt);
    }

    // --- ドラッグ終了（ショット） ---
    function handleDragEnd(evt) {
        evt.preventDefault();
        if (!isDragging || !activeBall) return;

        isDragging = false;

        const dx = dragStart.x - dragEnd.x;
        const dy = dragStart.y - dragEnd.y;

        activeBall.vx = dx * SHOT_POWER;
        activeBall.vy = dy * SHOT_POWER;

        if (gameMode === '1p') {
            playerTurn = false;
        } else if (gameMode === '2p') {
            // 2P: ショットを放ったら当該ボールをアクティブ状態として保持し、
            // 全ボールが停止したらターンを切り替える
            // ここで activeBall を一時的に保持し、update 内の areAllBallsStopped 判定で切替を行う。
            // 実際には全停止後 activeBall を null にして currentPlayer をトグルする。
            // ここでは投げたボールを記録しておく。
            const thrown = activeBall;
            activeBall = thrown;
            // currentPlayer は update() の停止判定後に切り替え
            // ただし安全のため、投げた瞬間に currentPlayer の次の値を予備で計算しておく
            // （切り替え実行は全停止確認後に以下の短いタイミングで行う）
            setTimeout(() => {
                // ポーリングで全停止確認してから切り替える
                const checkAndToggle = () => {
                    if (gameOver) return;
                    if (areAllBallsStopped()) {
                        currentPlayer = (currentPlayer === 1) ? 2 : 1;
                        activeBall = null;
                    } else {
                        requestAnimationFrame(checkAndToggle);
                    }
                };
                requestAnimationFrame(checkAndToggle);
            }, 0);
        }
    }

    // --- イベント登録 ---
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('touchstart', handleDragStart, { passive: false });
    canvas.addEventListener('touchmove', handleDragMove, { passive: false });
    canvas.addEventListener('touchend', handleDragEnd, { passive: false });

    window.addEventListener('resize', () => {
        if (!gameOver) {
            resizeCanvas();
        } else {
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
        initGame();
    });

    menuButton.addEventListener('click', () => {
        showScreen(startScreen);
    });

    nextStageButton.addEventListener('click', () => {
        stage++;
        showScreen(gameScreen);
        initGame();
    });

    // --- GameOver 画面をタップしたら再戦（2P の勝利表示はここで再戦に繋げる） ---
    gameOverScreen.addEventListener('click', () => {
        if (!gameMode) return;
        // 再戦（同じモードで再初期化）
        showScreen(gameScreen);
        initGame();
    });

    // --- 初期表示 ---
    showScreen(startScreen);
});