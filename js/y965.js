// y965.js
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

  const FRICTION = 0.950;
  const MIN_SPEED = 0.1;
  const SHOT_POWER = 0.09;

  let canvasWidth, canvasHeight;
  let stageWidth, stageHeight;

  window.COMPUTED_BALL_RADIUS = 15;
  window.COMPUTED_HOLE_RADIUS = 25;

  // --- 画像リソース ---
  const IMAGE_KEYS = ['/images/oha1.png', '/images/oha2.png', '/images/oha3.png', '/images/oha4.png'];
  const IMAGES = {};
  let imagesLoaded = false;

  // --- ゲーム状態 ---
  let player = null;
  let player2 = null;
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
  let activeBall = null;

  let selectedImageKeyP1 = null;
  let selectedImageKeyP2 = null;

  // keep reference to any open modal to ensure it can be removed
  let currentModal = null;

  // --- preload images ---
  function preloadImages(keys, callback) {
    let loaded = 0;
    if (!keys || keys.length === 0) {
      imagesLoaded = true;
      callback && callback();
      return;
    }
    keys.forEach(k => {
      const img = new Image();
      img.src = k;
      img.onload = () => {
        loaded++;
        IMAGES[k] = img;
        if (loaded === keys.length) {
          imagesLoaded = true;
          callback && callback();
        }
      };
      img.onerror = () => {
        // fallback 64x64 white
        const fallback = document.createElement('canvas');
        fallback.width = fallback.height = 64;
        const fctx = fallback.getContext('2d');
        fctx.fillStyle = '#fff';
        fctx.fillRect(0, 0, 64, 64);
        img.src = fallback.toDataURL();
        loaded++;
        IMAGES[k] = img;
        if (loaded === keys.length) {
          imagesLoaded = true;
          callback && callback();
        }
      };
    });
  }

  // --- 画面リサイズ対応 ---
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
    const computedBall = Math.round(shortSide * 0.06);
    const computedHole = Math.round(shortSide * 0.07);

    window.COMPUTED_BALL_RADIUS = Math.max(BALL_RADIUS_MIN, Math.min(BALL_RADIUS_MAX, computedBall || 15));
    window.COMPUTED_HOLE_RADIUS = Math.max(HOLE_RADIUS_MIN, Math.min(HOLE_RADIUS_MAX, computedHole || 25));

    const br = window.COMPUTED_BALL_RADIUS;
    const hr = window.COMPUTED_HOLE_RADIUS;

    if (player) { player.radius = br; clampBallPosition(player); }
    if (player2) { player2.radius = br; clampBallPosition(player2); }
    enemies.forEach(e => { e.radius = br; clampBallPosition(e); });
    holes.forEach(h => { h.radius = hr; clampHolePosition(h); });
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
    // ensure any modal is removed when switching screens
    removeCurrentModal();
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    stageClearScreen.classList.remove('active');
    screen.classList.add('active');
  }

  // --- ボールクラス（イメージ描画対応） ---
  class Ball {
    constructor(x, y, radius, color, imageKey = null) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.radius = radius;
      this.color = color;
      this.active = true;
      this.imageKey = imageKey;
    }

    draw() {
      if (!this.active) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x + 1.5, this.y + 1.5, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (this.imageKey && IMAGES[this.imageKey]) {
        const img = IMAGES[this.imageKey];
        const size = this.radius * 2;
        ctx.drawImage(img, this.x - this.radius, this.y - this.radius, size, size);
      } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = Math.max(1, this.radius * 0.08);
      ctx.stroke();
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
      const g = ctx.createRadialGradient(this.x, this.y, this.radius * 0.2, this.x, this.y, this.radius);
      g.addColorStop(0, '#000000');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
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

    player = new Ball(canvasWidth * 0.25, canvasHeight / 2, BR, '#ff5b84ff', selectedImageKeyP1);
    player2 = null;

    if (gameMode === '1p') {
      // 1P仕様: ステージ番号 = 敵数 = 穴数
      for (let i = 0; i < stage; i++) {
        const pos = getSafePosition(BR);
        const available = IMAGE_KEYS.filter(k => k !== selectedImageKeyP1);
        const key = available.length ? available[Math.floor(Math.random() * available.length)] : null;
        const e = new Ball(pos.x, pos.y, BR, '#800093ff', key);
        enemies.push(e);
      }
      for (let i = 0; i < stage; i++) {
        const pos = getSafePosition(HR);
        holes.push(new Hole(pos.x, pos.y, HR));
      }
      allBalls = [player, ...enemies];
    } else if (gameMode === '2p') {
      player2 = new Ball(canvasWidth * 0.75, canvasHeight / 2, BR, '#800093ff', selectedImageKeyP2);
      allBalls = [player, player2];

      const centerHole = new Hole(canvasWidth / 2, canvasHeight / 2, HR);
      holes.push(centerHole);
      const extraCount = Math.floor(Math.random() * 6) + 1;
      for (let i = 0; i < extraCount; i++) {
        const pos = getSafePosition(HR);
        holes.push(new Hole(pos.x, pos.y, HR));
      }
    }

    allBalls.forEach(b => clampBallPosition(b));
    holes.forEach(h => clampHolePosition(h));

    gameLoop();
  }

  // --- 安全な位置を取得 (他のオブジェクトと重ならないように) ---
  function getSafePosition(radius) {
    let x, y, safe;
    let attempts = 0;
    do {
      safe = true;
      attempts++;
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
      if (attempts > 400) break;
    } while (!safe);
    return { x, y };
  }

  // --- ゲームループ ---
  let rafId = null;
  function gameLoop() {
    if (gameOver) return;
    update();
    draw();
    rafId = requestAnimationFrame(gameLoop);
  }

  // --- 更新処理 ---
  function update() {
    const allStopped = areAllBallsStopped();

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

    // 1P: 敵の移動終了でプレイヤーにターンを戻す
    if (gameMode === '1p' && !playerTurn && areAllBallsStopped()) {
      playerTurn = true;
    }

    checkGameState();
  }

  // --- 描画処理 ---
  function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#947663ff';
    ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, stageWidth, stageHeight);

    holes.forEach(h => h.draw());
    allBalls.forEach(b => b.draw());

    if (isDragging && activeBall) {
      ctx.beginPath();
      ctx.moveTo(activeBall.x, activeBall.y);
      ctx.lineTo(dragEnd.x, dragEnd.y);
      ctx.strokeStyle = 'rgba(254,162,199,1)';
      ctx.lineWidth = Math.max(6, activeBall.radius * 0.6);
      ctx.stroke();
      ctx.closePath();
    }
  }

  // --- 敵の移動 (1P) 安全発射ロジック（補助） ---
  function moveEnemiesSafely() {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    enemies.forEach(enemy => {
      if (!enemy.active) return;
      if (!enemy.isStopped()) return;

      let chosenVx = 0, chosenVy = 0;
      let attempts = 0, maxAttempts = 10;

      while (attempts < maxAttempts) {
        const baseAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
        const randomOffset = (Math.random() - 0.5) * Math.PI * 0.6;
        const angle = baseAngle + randomOffset;
        const force = 3 + Math.random() * 2;
        const vx = Math.cos(angle) * force;
        const vy = Math.sin(angle) * force;

        const predictSteps = 12;
        let px = enemy.x, py = enemy.y, pvx = vx, pvy = vy;
        let safe = true;
        for (let s = 0; s < predictSteps; s++) {
          pvx *= FRICTION; pvy *= FRICTION;
          px += pvx; py += pvy;
          if (px - enemy.radius < BORDER_WIDTH || px + enemy.radius > canvasWidth - BORDER_WIDTH ||
              py - enemy.radius < BORDER_WIDTH || py + enemy.radius > canvasHeight - BORDER_WIDTH) {
            safe = false; break;
          }
        }

        if (safe) { chosenVx = vx; chosenVy = vy; break; }
        attempts++;
      }

      if (attempts < maxAttempts) {
        enemy.vx = chosenVx; enemy.vy = chosenVy;
      } else {
        const fallbackAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
        const fallbackForce = 2;
        enemy.vx = Math.cos(fallbackAngle) * fallbackForce;
        enemy.vy = Math.sin(fallbackAngle) * fallbackForce;
      }
    });
  }

  // --- プレイヤーが打った直後に全COMを少し動かす（即時挙動） ---
  function nudgeEnemiesTowardCenterSmall() {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      const baseAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
      const randomOffset = (Math.random() - 0.5) * Math.PI * 0.4;
      const angle = baseAngle + randomOffset;
      const force = 1 + Math.random() * 1.2;
      enemy.vx += Math.cos(angle) * force;
      enemy.vy += Math.sin(angle) * force;
    });
  }

  // --- 判定補助 ---
  function areAllBallsStopped() {
    return allBalls.every(b => !b.active || b.isStopped());
  }

  function checkBallCollision(ball1, ball2) {
    if (!ball1.active || !ball2.active) return;
    const dist = Math.hypot(ball1.x - ball2.x, ball1.y - ball2.y);
    if (dist < ball1.radius + ball2.radius) {
      const angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
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
      ball1.x -= adjustX; ball1.y -= adjustY;
      ball2.x += adjustX; ball2.y += adjustY;
    }
  }

  // --- 落下判定（ボール半径考慮） ---
  function checkFalling(ball) {
    if (!ball.active) return;
    const left = BORDER_WIDTH + ball.radius;
    const right = canvasWidth - BORDER_WIDTH - ball.radius;
    const top = BORDER_WIDTH + ball.radius;
    const bottom = canvasHeight - BORDER_WIDTH - ball.radius;

    if (ball.x < left || ball.x > right || ball.y < top || ball.y > bottom) {
      ball.active = false;
      return;
    }

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
      if (!player.active) {
        gameOver = true;
        gameOverMessage.textContent = 'COMの勝利　再戦する';
        showScreen(gameOverScreen);
        return;
      }
      const allEnemiesDown = enemies.every(e => !e.active);
      if (allEnemiesDown) {
        gameOver = true;
        gameOverMessage.textContent = '1Pの勝利　次のステージへ';
        showScreen(stageClearScreen);
        return;
      }
    } else if (gameMode === '2p') {
      if (!player.active && !player2.active) {
        gameOver = true;
        gameOverMessage.textContent = '引き分け　再戦する';
        showScreen(gameOverScreen);
      } else if (!player.active) {
        gameOver = true;
        gameOverMessage.textContent = '2Pの勝利　再戦する';
        showScreen(gameOverScreen);
      } else if (!player2.active) {
        gameOver = true;
        gameOverMessage.textContent = '1Pの勝利　再戦する';
        showScreen(gameOverScreen);
      }
    }
  }

  // --- 入力イベント（pointer events） ---
  function getPointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  function handleDragStart(evt) {
    if (gameOver) return;
    evt.preventDefault();
    if (!areAllBallsStopped()) return;

    const pos = getPointerPos(evt);
    activeBall = null;

    if (gameMode === '1p') {
      if (!playerTurn) return;
      if (Math.hypot(pos.x - player.x, pos.y - player.y) <= player.radius) activeBall = player;
    } else if (gameMode === '2p') {
      if (currentPlayer === 1) {
        if (Math.hypot(pos.x - player.x, pos.y - player.y) <= player.radius) activeBall = player;
      } else {
        if (Math.hypot(pos.x - player2.x, pos.y - player2.y) <= player2.radius) activeBall = player2;
      }
    }

    if (activeBall) {
      isDragging = true;
      dragStart = pos;
      dragEnd = pos;
    }
  }

  function handleDragMove(evt) {
    if (!isDragging || !activeBall) return;
    evt.preventDefault();
    dragEnd = getPointerPos(evt);
  }

  function handleDragEnd(evt) {
    if (!isDragging || !activeBall) return;
    evt.preventDefault();
    isDragging = false;

    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;

    activeBall.vx = dx * SHOT_POWER;
    activeBall.vy = dy * SHOT_POWER;

    activeBall = null;

    if (gameMode === '1p') {
      playerTurn = false;
      // immediate small nudge for all enemies toward center
      nudgeEnemiesTowardCenterSmall();
      // then try safe enemy moves shortly after for natural feel
      setTimeout(() => moveEnemiesSafely(), 60);
    } else if (gameMode === '2p') {
      currentPlayer = (currentPlayer === 1) ? 2 : 1;
    }
  }

  // --- イベントリスナー登録 ---
  canvas.addEventListener('pointerdown', handleDragStart);
  canvas.addEventListener('pointermove', handleDragMove);
  canvas.addEventListener('pointerup', handleDragEnd);
  canvas.addEventListener('pointercancel', handleDragEnd);
  window.addEventListener('resize', () => { if (!gameOver) resizeCanvas(); });

  // --- 画像選択UI ---
  function removeCurrentModal() {
    if (currentModal && currentModal.parentNode) {
      currentModal.parentNode.removeChild(currentModal);
      currentModal = null;
    }
  }

  function showImagePicker(forMode) {
    removeCurrentModal();

    // forMode: '1p-single', '2p-choose-p1', '2p-choose-p2'
    const modal = document.createElement('div');
    currentModal = modal;
    modal.className = 'image-modal';
    modal.style.position = 'fixed';
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.zIndex = 9999;

    const box = document.createElement('div');
    box.className = 'image-box';
    box.style.background = '#fff';
    box.style.padding = '16px';
    box.style.borderRadius = '8px';
    box.style.maxWidth = '92%';
    box.style.boxSizing = 'border-box';
    box.style.textAlign = 'center';
    box.style.color = '#000';

    let titleText = '';
    if (forMode === '1p-single') titleText = '1Pをえらんでね';
    else if (forMode === '2p-choose-p1') titleText = '1Pをえらんでください';
    else if (forMode === '2p-choose-p2') titleText = '2Pもえらんでね';

    const title = document.createElement('div');
    title.style.marginBottom = '12px';
    title.style.fontSize = '18px';
    title.textContent = titleText;
    box.appendChild(title);

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.flexWrap = 'wrap';
    row.style.justifyContent = 'center';

    IMAGE_KEYS.forEach(key => {
      const thumb = document.createElement('div');
      thumb.style.width = '96px';
      thumb.style.height = '96px';
      thumb.style.borderRadius = '8px';
      thumb.style.overflow = 'hidden';
      thumb.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      thumb.style.cursor = 'pointer';
      thumb.style.display = 'flex';
      thumb.style.alignItems = 'center';
      thumb.style.justifyContent = 'center';
      thumb.style.background = '#eee';

      const img = IMAGES[key] || new Image();
      img.src = key;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.alt = key;

      thumb.appendChild(img);

      thumb.addEventListener('click', () => {
        removeCurrentModal();
        if (forMode === '1p-single') {
          selectedImageKeyP1 = key;
          showScreen(gameScreen);
          initGame();
        } else if (forMode === '2p-choose-p1') {
          selectedImageKeyP1 = key;
          showImagePicker('2p-choose-p2');
        } else if (forMode === '2p-choose-p2') {
          selectedImageKeyP2 = key;
          showScreen(gameScreen);
          initGame();
        }
      });

      row.appendChild(thumb);
    });

    box.appendChild(row);

    const cancelWrap = document.createElement('div');
    cancelWrap.style.marginTop = '12px';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.addEventListener('click', () => {
      removeCurrentModal();
      // when cancelling selection return to start screen
      showScreen(startScreen);
    });
    cancelWrap.appendChild(cancelBtn);
    box.appendChild(cancelWrap);

    modal.appendChild(box);
    document.body.appendChild(modal);
  }

  // --- スタート / ボタン動作（修正版） ---
  start1PButton.addEventListener('click', () => {
    gameMode = '1p';
    stage = 1;
    preloadImages(IMAGE_KEYS, () => {
      showImagePicker('1p-single');
    });
  });

  start2PButton.addEventListener('click', () => {
    gameMode = '2p';
    preloadImages(IMAGE_KEYS, () => {
      showImagePicker('2p-choose-p1');
    });
  });

  // リスタート（終了画面の「リスタート」）
  restartButton.addEventListener('click', () => {
    gameOver = false;
    showScreen(gameScreen);
    initGame();
  });

  // 修正: メニューに戻るボタン — 「最初の画面」に確実に戻るようにする
  menuButton.addEventListener('click', () => {
    // stop game loop and mark as over so animation won't continue in background
    gameOver = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // clear runtime state that shouldn't persist when returning to menu
    isDragging = false;
    activeBall = null;
    enemies = [];
    holes = [];
    allBalls = [];
    player = null;
    player2 = null;

    // remove any modal overlays if present
    removeCurrentModal();

    // show the very first start screen
    showScreen(startScreen);
  });

  // 次のステージ（ステージクリア画面）
  nextStageButton.addEventListener('click', () => {
    stage = Math.max(1, stage) + 1;
    gameOver = false;
    showScreen(gameScreen);
    initGame();
  });

  // 初期表示
  showScreen(startScreen);
  preloadImages(IMAGE_KEYS, () => { /* preload done */ });

  // 終了画面をクリックで再戦（現在の stage を維持）
  gameOverScreen.addEventListener('click', () => {
    gameOver = false;
    showScreen(gameScreen);
    initGame();
  });

  // ウィンドウリサイズ初回呼び出し
  resizeCanvas();
});