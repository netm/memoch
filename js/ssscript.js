document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    let gameRunning = false;
    let player;
    let enemies = [];
    let playerBalls = [];
    let enemyBalls = [];
    let whiteDots = [];
    let stage = 1; // 迴ｾ蝨ｨ縺ｮ繧ｹ繝��繧ｸ謨ｰ
    let currentWhiteDots = 7; // 笘�､画峩轤ｹ: 逋ｽ縺�せ縺ｮ謨ｰ繧堤ｮ｡逅�☆繧句､画焚

    const PLAYER_SPEED = 3;
    const BALL_SPEED = 7;
    const PLAYER_SIZE = 36;
    const ENEMY_SIZE = 40;
    const BALL_SIZE = 5;
    const DOT_SIZE = 10;
    const ENEMY_MIN_MOVE_INTERVAL = 1000;
    const ENEMY_MAX_MOVE_INTERVAL = 3000;

    // const NUMBER_OF_WHITE_DOTS = 7; // 笘�､画峩轤ｹ: 縺薙�陦後ｒ蜑企勁

    let playerMoveDirection = 0;
    let lastPlayerShotTime = 0;
    const PLAYER_SHOT_INTERVAL = 1000;

    const ENEMY_SHOT_INTERVAL = 1000;
    const ENEMY_SHOT_OFFSET = 100;

    let animationFrameId;

    // --- 逕ｻ蜒上�隱ｭ縺ｿ霎ｼ縺ｿ ---
    const playerImage = new Image();
    playerImage.src = 'zsensha1.png';

    const playerLeftImage = new Image();
    playerLeftImage.src = 'zsensha1.png';

    const playerRightImage = new Image();
    playerRightImage.src = 'zsensha1.png';

    const enemyImage = new Image();
    enemyImage.src = 'zsensha4.png';

    let imagesLoadedCount = 0;
    const totalImages = 4;

    const onImageLoad = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === totalImages) {
            console.log("All images loaded!");
            startScreen.style.display = 'flex';
            setCanvasSize();
        }
    };

    playerImage.onload = onImageLoad;
    playerLeftImage.onload = onImageLoad;
    playerRightImage.onload = onImageLoad;
    enemyImage.onload = onImageLoad;
    // --- 逕ｻ蜒上�隱ｭ縺ｿ霎ｼ縺ｿ邨ゅｏ繧� ---

    const setCanvasSize = () => {
        canvas.width = window.innerWidth > 500 ? 500 : window.innerWidth;
        canvas.height = window.innerHeight > 900 ? 900 : window.innerHeight;
        const controlsHeight = document.getElementById('controls').offsetHeight;
        canvas.height -= controlsHeight + 40;
        if (canvas.width < 300) canvas.width = 300;
        if (canvas.height < 500) canvas.height = 500;
    };

    // 蛻晄悄蛹夜未謨ｰ
    const initGame = (gameResetType = 'start') => {
        setCanvasSize();

        player = {
            x: canvas.width / 2 - PLAYER_SIZE / 2,
            y: canvas.height - PLAYER_SIZE - 60,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            shootingDirection: { x: 0, y: -1 }
        };
        playerBalls = [];
        enemyBalls = [];
        whiteDots = [];

        // 笘�､画峩轤ｹ: 繧ｹ繝��繧ｸ縺ｨ逋ｽ縺�せ縺ｮ謨ｰ縺ｮ邂｡逅�
        if (gameResetType === 'start' || gameResetType === 'victory') {
            if (gameResetType === 'victory') {
                stage++;
                currentWhiteDots++; // 繧ｹ繝��繧ｸ繧ｯ繝ｪ繧｢縺ｧ逋ｽ縺�せ繧�1縺､蠅励ｄ縺�
            } else { // 'start' 縺ｮ蝣ｴ蜷�
                stage = 1;
                currentWhiteDots = 7; // 蛻晄悄蛟､縺ｫ繝ｪ繧ｻ繝�ヨ
            }
            enemies = [];
            for (let i = 0; i < stage; i++) {
                addEnemy(i);
            }
        } else if (gameResetType === 'gameOver') {
            enemies.forEach((enemy, i) => {
                enemy.y = 20;
                enemy.x = Math.random() * (canvas.width - ENEMY_SIZE);
                enemy.lastMoveTime = performance.now();
                enemy.nextMoveChangeTime = performance.now() + Math.random() * (ENEMY_MAX_MOVE_INTERVAL - ENEMY_MIN_MOVE_INTERVAL) + ENEMY_MIN_MOVE_INTERVAL;
                enemy.lastShotTime = performance.now() - (i * ENEMY_SHOT_OFFSET);
            });
        }

        // 笘�､画峩轤ｹ: 螟画焚繧剃ｽｿ縺｣縺ｦ逋ｽ縺�せ繧堤函謌�
        for (let i = 0; i < currentWhiteDots; i++) {
            addWhiteDot();
        }

        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        victoryScreen.style.display = 'none';

        gameRunning = true;
        gameLoop();
    };

    const addEnemy = (index) => {
        enemies.push({
            x: Math.random() * (canvas.width - ENEMY_SIZE),
            y: 20,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            speed: 1 + Math.random() * 2,
            direction: Math.random() < 0.5 ? 1 : -1,
            lastMoveTime: performance.now(),
            nextMoveChangeTime: performance.now() + Math.random() * (ENEMY_MAX_MOVE_INTERVAL - ENEMY_MIN_MOVE_INTERVAL) + ENEMY_MIN_MOVE_INTERVAL,
            lastShotTime: performance.now() - (index * ENEMY_SHOT_OFFSET)
        });
    };

    const addWhiteDot = () => {
        whiteDots.push({
            x: Math.random() * (canvas.width - DOT_SIZE),
            y: Math.random() * (canvas.height - DOT_SIZE - 100) + 50,
            width: DOT_SIZE,
            height: DOT_SIZE,
            color: 'white'
        });
    };

    // 謠冗判髢｢謨ｰ
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let currentPlayerImage = playerImage;
        if (playerMoveDirection === -1) {
            currentPlayerImage = playerLeftImage;
        } else if (playerMoveDirection === 1) {
            currentPlayerImage = playerRightImage;
        }
        ctx.drawImage(currentPlayerImage, player.x, player.y, player.width, player.height);

        enemies.forEach(enemy => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        });

        playerBalls.forEach(ball => {
            ctx.fillStyle = 'lime';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        enemyBalls.forEach(ball => {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        whiteDots.forEach(dot => {
            ctx.fillStyle = dot.color;
            ctx.fillRect(dot.x, dot.y, dot.width, dot.height);
        });
    };

    // 譖ｴ譁ｰ髢｢謨ｰ
    const update = (currentTime) => {
        player.x += playerMoveDirection * PLAYER_SPEED;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        if (currentTime - lastPlayerShotTime > PLAYER_SHOT_INTERVAL) {
            let shootAngle = 0;
            if (playerMoveDirection === 1) {
                shootAngle = -Math.PI / 4;
            } else if (playerMoveDirection === -1) {
                shootAngle = -Math.PI * 3 / 4;
            } else {
                shootAngle = -Math.PI / 2;
            }

            playerBalls.push({
                x: player.x + player.width / 2,
                y: player.y,
                radius: BALL_SIZE,
                dx: BALL_SPEED * Math.cos(shootAngle),
                dy: BALL_SPEED * Math.sin(shootAngle)
            });
            lastPlayerShotTime = currentTime;
        }

        enemies.forEach(enemy => {
            if (currentTime - enemy.lastMoveTime > (enemy.nextMoveChangeTime - enemy.lastMoveTime)) {
                enemy.direction *= -1;
                enemy.lastMoveTime = currentTime;
                enemy.nextMoveChangeTime = currentTime + Math.random() * (ENEMY_MAX_MOVE_INTERVAL - ENEMY_MIN_MOVE_INTERVAL) + ENEMY_MIN_MOVE_INTERVAL;
            }
            enemy.x += enemy.direction * enemy.speed;

            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
                enemy.direction *= -1;
                enemy.x = Math.max(0, Math.min(enemy.x, canvas.width - enemy.width));
            }

            if (currentTime - enemy.lastShotTime > ENEMY_SHOT_INTERVAL) {
                enemyBalls.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height,
                    radius: BALL_SIZE,
                    dx: 0,
                    dy: BALL_SPEED
                });
                enemy.lastShotTime = currentTime;
            }
        });

        playerBalls.forEach((ball, index) => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y + ball.radius < 0 || ball.y - ball.radius > canvas.height) {
                playerBalls.splice(index, 1);
                return;
            }

            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                ball.dx *= -1;
                if (ball.x - ball.radius < 0) ball.x = ball.radius;
                if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                if (checkCollision(ball, enemy)) {
                    playerBalls.splice(index, 1);
                    enemies.splice(i, 1);
                    break;
                }
            }

            whiteDots.forEach(dot => {
                if (checkCollision(ball, dot)) {
                    if (ball.y < dot.y + dot.height && ball.y + ball.radius > dot.y && Math.abs(ball.x - (dot.x + dot.width / 2)) < dot.width / 2) {
                        ball.dy *= -1;
                    } else if (ball.x < dot.x + dot.width && ball.x + ball.radius > dot.x && Math.abs(ball.y - (dot.y + dot.height / 2)) < dot.height / 2) {
                        ball.dx *= -1;
                    }
                }
            });
        });

        enemyBalls.forEach((ball, index) => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y + ball.radius < 0 || ball.y - ball.radius > canvas.height) {
                enemyBalls.splice(index, 1);
                return;
            }

            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                ball.dx *= -1;
                if (ball.x - ball.radius < 0) ball.x = ball.radius;
                if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
            }

            if (checkCollision(ball, player)) {
                gameRunning = false;
                cancelAnimationFrame(animationFrameId);
                gameOverScreen.style.display = 'flex';
                return;
            }

            whiteDots.forEach(dot => {
                if (checkCollision(ball, dot)) {
                    if (ball.y < dot.y + dot.height && ball.y + ball.radius > dot.y && Math.abs(ball.x - (dot.x + dot.width / 2)) < dot.width / 2) {
                        ball.dy *= -1;
                    } else if (ball.x < dot.x + dot.width && ball.x + ball.radius > dot.x && Math.abs(ball.y - (dot.y + dot.height / 2)) < dot.height / 2) {
                        ball.dx *= -1;
                    }
                }
            });
        });

        if (enemies.length === 0 && gameRunning) {
            gameRunning = false;
            cancelAnimationFrame(animationFrameId);
            victoryScreen.style.display = 'flex';
        }
    };

    const checkCollision = (circle, rect) => {
        const distX = Math.abs(circle.x - (rect.x + rect.width / 2));
        const distY = Math.abs(circle.y - (rect.y + rect.height / 2));

        if (distX > (rect.width / 2 + circle.radius)) { return false; }
        if (distY > (rect.height / 2 + circle.radius)) { return false; }

        if (distX <= (rect.width / 2)) { return true; }
        if (distY <= (rect.height / 2)) { return true; }

        const dx = distX - rect.width / 2;
        const dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    };

    const gameLoop = (currentTime) => {
        if (!gameRunning) return;
        update(currentTime);
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    };

    // --- 繧､繝吶Φ繝医Μ繧ｹ繝翫� ---
    startScreen.addEventListener('touchstart', (e) => {
        e.preventDefault();
        initGame('start');
    });
    gameOverScreen.addEventListener('touchstart', (e) => {
        e.preventDefault();
        initGame('gameOver');
    });
    victoryScreen.addEventListener('touchstart', (e) => {
        e.preventDefault();
        initGame('victory');
    });

    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        playerMoveDirection = -1;
    });
    leftButton.addEventListener('touchend', () => {
        playerMoveDirection = 0;
    });
    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        playerMoveDirection = 1;
    });
    rightButton.addEventListener('touchend', () => {
        playerMoveDirection = 0;
    });

    document.addEventListener('keydown', (e) => {
        if (gameRunning) {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === '4') {
                playerMoveDirection = -1;
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === '6') {
                playerMoveDirection = 1;
            }
        } else {
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'w' || e.key === '8') {
                if (startScreen.style.display === 'flex') {
                    initGame('start');
                } else if (gameOverScreen.style.display === 'flex') {
                    initGame('gameOver');
                } else if (victoryScreen.style.display === 'flex') {
                    initGame('victory');
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === '6' || e.key === 'ArrowRight' || e.key === 'd' || e.key === '4') {
            playerMoveDirection = 0;
        }
    });

    gameOverScreen.style.display = 'none';
    victoryScreen.style.display = 'none';
});