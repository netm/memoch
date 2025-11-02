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
    const BORDER_WIDTH = 20; // 外側の黒い領域の幅（px）
    const BALL_RADIUS_MIN = 8;
    const BALL_RADIUS_MAX = 24;
    const HOLE_RADIUS_MIN = 14;
    const HOLE_RADIUS_MAX = 40;

    const FRICTION = 0.977; // 摩擦
    const MIN_SPEED = 0.1;   // 停止とみなす速度
    const SHOT_POWER = 0.10; // ショットの強さの係数（少し小さくした）

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
    let currentPlayer = 1; // 2Pモード用 (1 or 2)
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragEnd = { x: 0, y: 0 };
    let activeBall = null; // 現在操作中のボール（ショットしたボールを示す）

    // --- 画面リサイズ対応（半径再計算、位置補正） ---
    function resizeCanvas() {
        // 保存: 既存ボール位置の相対比率（ステージ内基準）
        const prevStageW = stageWidth || (canvasWidth - BORDER_WIDTH * 2) || 1;
        const prevStageH = stageHeight || (canvasHeight - BORDER_WIDTH * 2) || 1;
        const ratios = allBalls.map(b => ({ rx: (b.x - BORDER_WIDTH) / prevStageW, ry: (b.y - BORDER_WIDTH) / prevStageH }));

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

        // 既存オブジェクトの半径を更新し、位置を比率から復元してステージ内に収める
        const br = window.COMPUTED_BALL_RADIUS;
        const hr = window.COMPUTED_HOLE_RADIUS;

        allBalls.forEach((b, i) => {
            b.radius = br;
            const r = ratios[i] || { rx: 0.5, ry: 0.5 };
            b.x = BORDER_WIDTH + Math.max(b.radius, Math.min(stageWidth - b.radius, r.rx * stageWidth));
            b.y = BORDER_WIDTH + Math.max(b.radius, Math.min(stageHeight - b.radius, r.ry * stageHeight));
        });

        holes.forEach((h, i) => {
            h.radius = hr;
            // if we had ratios for holes, we'd restore them; else clamp
            h.x = Math.max(BORDER_WIDTH + h.radius, Math.min(canvasWidth - BORDER_WIDTH - h.radius, h.x || canvasWidth / 2));
            h.y = Math.max(BORDER_WIDTH + h.radius, Math.min(canvasHeight - BORDER_WIDTH - h.radius, h.y || canvasHeight / 2));
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

            // 位置更新
            this.x += this.vx;
            this.y += this.vy;

            // ステージ内壁との反発（端は跳ね返る壁にする）
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
        activeBall = null;

        const BR = window.COMPUTED_BALL_RADIUS || 15;
        const HR = window.COMPUTED_HOLE_RADIUS || 25;

        // プレイヤー1作成
        player = new Ball(canvasWidth * 0.25, canvasHeight / 2, BR, 'white');
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
            // 敵に小さな力を与えたらプレイヤーのターンは enemies の停止を待って切り替える
            // ここでは playerTurn を切り替えず、敵が発射されたタイミングで playerTurn を true にするのではなく
            // 敵が完全に止まった時点で playerTurn を true にする方が自然 -> 次のフレームで allStopped false になるため制御可能
        }

        // 2Pモードでターン切り替え: プレイヤーがショットして、そのショットが完全に止まったら交代する
        if (gameMode === '2p' && activeBall && allStopped) {
            // ショットが止まったらターンを切り替える
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

        // 穴と落下判定（端は跳ね返るため穴のみで落とす）
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
        ctx.fillStyle = '#855d00e4';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // ステージ内側を描画
        ctx.fillStyle = '#168500ff'; //みどり色
        ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, stageWidth, stageHeight);

        // 穴を描画
        holes.forEach(hole => hole.draw());

        // ボールを描画
        allBalls.forEach(ball => ball.draw());

        // ドラッグ線を描画
        if (isDragging && (gameMode === '1p' && playerTurn || gameMode === '2p')) {
            // 2PはcurrentPlayer でドラッグを許可しているため、描画は activeBall がいる場合に表示
            let drawFrom = null;
            if (gameMode === '1p' && playerTurn) drawFrom = player;
            if (gameMode === '2p') {
                drawFrom = (currentPlayer === 1) ? player : player2;
            }
            if (drawFrom) {
                ctx.beginPath();
                ctx.moveTo(drawFrom.x, drawFrom.y);
                ctx.lineTo(dragEnd.x, dragEnd.y);
                ctx.strokeStyle = 'rgba(207, 188, 94, 0.97)';
                ctx.lineWidth = 9;
                ctx.stroke();
                ctx.closePath();
            }
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

    // --- 全ボール停止チェック ---
    function areAllBallsStopped() {
        return allBalls.every(ball => !ball.active || ball.isStopped());
    }

    // --- ボール同士の衝突 ---
    function checkBallCollision(b1, b2) {
        if (!b1.active || !b2.active) return;

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;
        if (dist < b1.radius + b2.radius) {
            // 単純な弾性衝突（質量同等、速度成分で反射）
            const nx = dx / dist;
            const ny = dy / dist;

            const rvx = b2.vx - b1.vx;
            const rvy = b2.vy - b1.vy;
            const relVelAlongNormal = rvx * nx + rvy * ny;

            // 既に離れている（反発方向）なら何もしない
            if (relVelAlongNormal > 0) {
                // ただし重なりは解消しておく
                const overlap = b1.radius + b2.radius - dist;
                const shiftX = (overlap / 2) * nx;
                const shiftY = (overlap / 2) * ny;
                b1.x -= shiftX;
                b1.y -= shiftY;
                b2.x += shiftX;
                b2.y += shiftY;
                return;
            }

            const restitution = 0.9; // 弾性係数
            const j = -(1 + restitution) * relVelAlongNormal / 2; // 質量1想定で半分ずつ

            b1.vx -= j * nx;
            b1.vy -= j * ny;
            b2.vx += j * nx;
            b2.vy += j * ny;

            // 重なり解消
            const overlap = b1.radius + b2.radius - dist;
            const shiftX = (overlap / 2) * nx;
            const shiftY = (overlap / 2) * ny;
            b1.x -= shiftX;
            b1.y -= shiftY;
            b2.x += shiftX;
            b2.y += shiftY;
        }
    }

    // --- 落下判定（端は跳ね返る壁に変更） ---
    // 穴のみで落ちる仕様。ステージ端は跳ね返るため中心判定は行わない。
    function checkFalling(ball) {
        if (!ball.active) return;

        for (const hole of holes) {
            const d = Math.hypot(ball.x - hole.x, ball.y - hole.y);
            if (d < hole.radius) {
                ball.active = false;
                ball.vx = 0;
                ball.vy = 0;
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

        // touchend では touches が空になることがあるため changedTouches を使う
        const touch = (evt.touches && evt.touches[0]) || (evt.changedTouches && evt.changedTouches[0]);
        const clientX = evt.clientX !== undefined ? evt.clientX : (touch && touch.clientX);
        const clientY = evt.clientY !== undefined ? evt.clientY : (touch && touch.clientY);

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function canStartDragForCurrentMode(pos) {
        if (!areAllBallsStopped()) return null;

        if (gameMode === '1p' && playerTurn) {
            const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
            if (dist <= player.radius) return player;
        } else if (gameMode === '2p') {
            if (currentPlayer === 1) {
                const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
                if (dist <= player.radius) return player;
            } else {
                const dist = Math.hypot(pos.x - player2.x, pos.y - player2.y);
                if (dist <= player2.radius) return player2;
            }
        }
        return null;
    }

    function handleDragStart(evt) {
        evt.preventDefault();
        const pos = getMousePos(evt);
        const ballToDrag = canStartDragForCurrentMode(pos);
        if (!ballToDrag) return;

        activeBall = null; // 候補を取らない（ショット時に activeBall をセット）
        isDragging = true;
        dragStart = pos;
        dragEnd = pos;
        // store which ball we're dragging visually (not the activeBall shot state)
        activeBall = ballToDrag; // temporarily set so drag line can render from correct ball
        // Note: in 2P mode we keep activeBall as the one being dragged, but will only treat it
        // as "shot" after handleDragEnd sets velocity; update() uses activeBall presence to detect
        // whether to switch turns after allStopped.
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

        // 2Pモード: ショットを発射したボールを activeBall ショット管理用にセットして、
        // update() が全停止を検知したら currentPlayer を切り替える。
        if (gameMode === '1p') {
            // 1P: プレイヤーがショットしたら敵ターンに移行（敵は update 側で処理）
            playerTurn = false;
            // clear the dragging marker but keep the ball moving
            activeBall = null;
        } else if (gameMode === '2p') {
            // 保持している activeBall（ショット済み）をそのまま残すことで
            // update() 内で allStopped を検知したときにターン交代する
            // ここでは activeBall をショットしたボールオブジェクトの参照にしておく
            // (既に activeBall はそのボールへの参照)
            // ただし描画中の drag 用フラグと混同しないよう isDragging を false にしておく
            // activeBall はショット中のボール管理として残す
            // （ドラッグ中にも同じ変数を使っているため特に変更の必要はない）
            // ここで何もしない（activeBallはそのまま）
        }
    }

    // --- イベントリスナー登録 ---
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('touchstart', handleDragStart, { passive: false });
    canvas.addEventListener('touchmove', handleDragMove, { passive: false });
    canvas.addEventListener('touchend', handleDragEnd, { passive: false });
    window.addEventListener('resize', () => {
        // リサイズは常に行ってUIを整える（ゲーム中でも）
        resizeCanvas();
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
        currentPlayer = 1;
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