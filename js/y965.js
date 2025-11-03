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
  const IMAGES = {}; // key -> HTMLImageElement
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
  let playerTurn = true; // 1Pモード用（プレイヤーの入力許可）
  let currentPlayer = 1; // 2Pモード用: 1 or 2
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let dragEnd = { x: 0, y: 0 };
  let activeBall = null;

  // 選択された画像キー
  let selectedImageKeyP1 = null;
  let selectedImageKeyP2 = null;

  // --- preload images ---
  function preloadImages(keys, callback) {
    let loaded = 0;
    for (const k of keys) {
      const img = new Image();
      img.src = k;
      img.onload = () => {
        loaded++;
        if (loaded === keys.length) {
          imagesLoaded = true;
          callback && callback();
        }
      };
      img.onerror = () => {
        // ローカル開発時にパスが変わるときの保険: 透明な1x1で代替
        const fallback = document.createElement('canvas');
        fallback.width = fallback.height = 64;
        const fctx = fallback.getContext('2d');
        fctx.fillStyle = '#fff';
        fctx.fillRect(0, 0, 64, 64);
        img.src = fallback.toDataURL();
        loaded++;
        if (loaded === keys.length) {
          imagesLoaded = true;
          callback && callback();
        }
      };
      IMAGES[k] = img;
    }
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
    const computedBall = Math.round(shortSide * 0.03);
    const computedHole = Math.round(shortSide * 0.06);

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
      // 影
      ctx.beginPath();
      ctx.arc(this.x + 1.5, this.y + 1.5, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();
      ctx.closePath();

      // 画像があれば円形にクリップして描画
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (this.imageKey && IMAGES[this.imageKey]) {
        const img = IMAGES[this.imageKey];
        // 画像をボールにフィットさせて描画
        const size = this.radius * 2;
        ctx.drawImage(img, this.x - this.radius, this.y - this.radius, size, size);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }
      ctx.restore();

      // 外周ライン
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

  class Hole {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // 中央は真っ黒、ふちに少しグラデーション
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

    // プレイヤー1
    player = new Ball(canvasWidth * 0.25, canvasHeight / 2, BR, '#ff5b84ff', selectedImageKeyP1);
    player2 = null;

    if (gameMode === '1p') {
      // 敵（COM）は stage 個。COMのイメージはランダムで選ぶ（選ばれなかった画像を使う）
      const available = IMAGE_KEYS.filter(k => k !== selectedImageKeyP1);
      for (let i = 0; i < stage; i++) {
        const pos = getSafePosition(BR);
        const key = available[Math.floor(Math.random() * available.length)];
        const e = new Ball(pos.x, pos.y, BR, '#800093ff', key);
        enemies.push(e);
      }
      allBalls = [player, ...enemies];
    } else {
      // 2p: player2 を作成（選択済み image）
      player2 = new Ball(canvasWidth * 0.75, canvasHeight / 2, BR, '#800093ff', selectedImageKeyP2);
      allBalls = [player, player2];
    }

    // 穴設定: 中央に必ず1つ。中間以外に 1〜6 個のランダム穴
    const centerHole = new Hole(canvasWidth / 2, canvasHeight / 2, window.COMPUTED_HOLE_RADIUS);
    holes.push(centerHole);

    const extraCount = Math.floor(Math.random() * 6) + 1; // 1..6
    for (let i = 0; i < extraCount; i++) {
      const pos = getSafePosition(window.COMPUTED_HOLE_RADIUS);
      holes.push(new Hole(pos.x, pos.y, window.COMPUTED_HOLE_RADIUS));
    }

    // 補正
    allBalls.forEach(b => clampBallPosition(b));
    holes.forEach(h => clampHolePosition(h));

    gameLoop();
  }

  // --- 安全な位置を取得 ---
  function getSafePosition(radius) {
    let x, y, safe;
    let attempts = 0;
    do {
      safe = true;
      attempts++;
      x = BORDER_WIDTH + radius + Math.random() * (stageWidth - radius * 2);
      y = BORDER_WIDTH + radius + Math.random() * (stageHeight - radius * 2);

      // 他のボールとチェック
      for (const ball of allBalls) {
        const dist = Math.hypot(x - ball.x, y - ball.y);
        if (dist < radius + ball.radius + 10) {
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

      // 無限ループ保護: 試行回数が多ければ妥協して返す
      if (attempts > 200) break;
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

    // 1P: COM の移動
    if (gameMode === '1p' && !playerTurn && allStopped) {
      moveEnemies();
      playerTurn = true; // 敵が動き始めたらプレイヤーの入力を再び許可するのは停止後判定で行う
    }

    // 2P: ターン切替（入力後、すべて停止していれば切替）
    if (gameMode === '2p' && allStopped && !isDragging && activeBall === null) {
      // 切替はプレイヤーがショットを終えた時に発生するようにするため、
      // activeBallはショット時に null にされるのでここで currentPlayer を切替
      // （ただし初期状態では player1）
      // 実装上、handleShot で activeBall を null にしているためここでは安全に切替れる
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

  // --- 描画処理 ---
  function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#c5c4a2ff';
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

  // --- 敵の移動 (1P) ---
  function moveEnemies() {
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
          pvx *= FRICTION;
          pvy *= FRICTION;
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
        gameOverMessage.textContent = '1Pの勝利　再戦する';
        showScreen(gameOverScreen);
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

  // --- 入力イベント（pointer events 使用） ---
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
      const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
      if (dist <= player.radius) activeBall = player;
    } else if (gameMode === '2p') {
      if (currentPlayer === 1) {
        const dist = Math.hypot(pos.x - player.x, pos.y - player.y);
        if (dist <= player.radius) activeBall = player;
      } else {
        const dist = Math.hypot(pos.x - player2.x, pos.y - player2.y);
        if (dist <= player2.radius) activeBall = player2;
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

    // ショット直後は activeBall を null にして入力を切り替えのトリガーに
    activeBall = null;

    if (gameMode === '1p') {
      playerTurn = false;
    } else if (gameMode === '2p') {
      // 2P はターン制: 相手のターンにする（ただし相手が落ちるまで動作）
      currentPlayer = (currentPlayer === 1) ? 2 : 1;
    }
  }

  // --- イベントリスナー登録 ---
  canvas.addEventListener('pointerdown', handleDragStart);
  canvas.addEventListener('pointermove', handleDragMove);
  canvas.addEventListener('pointerup', handleDragEnd);
  canvas.addEventListener('pointercancel', handleDragEnd);
  window.addEventListener('resize', () => {
    if (!gameOver) resizeCanvas();
  });

  // --- ボタンリスナー / 画像選択UI ---
  // 画像選択用オーバーレイを作る（動的）
  function showImagePicker(forMode) {
    // forMode: '1p-single' (1p selects, rest go to COM) or '2p-choose' (p1 then p2)
    // モーダル要素作成
    const modal = document.createElement('div');
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
    box.style.background = '#fff';
    box.style.padding = '16px';
    box.style.borderRadius = '8px';
    box.style.maxWidth = '90%';
    box.style.boxSizing = 'border-box';
    box.style.textAlign = 'center';
    box.style.color = '#000';

    const title = document.createElement('div');
    title.style.marginBottom = '12px';
    title.style.fontSize = '18px';
    title.textContent = (forMode === '1p-single') ? '1Pの画像を選んでください' : 'プレイヤー1の画像を選んでください';
    box.appendChild(title);

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.flexWrap = 'wrap';
    row.style.justifyContent = 'center';

    // 画像サムネイルを作る
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
        document.body.removeChild(modal);
        if (forMode === '1p-single') {
          selectedImageKeyP1 = key;
          // 1P の他の画像はランダムで COM に割り当てられる（initGame 内で処理）
          showScreen(gameScreen);
          initGame();
        } else if (forMode === '2p-choose-p1') {
          selectedImageKeyP1 = key;
          // 次はプレイヤー2に選ばせる（選べるのは残りの画像）
          showImagePicker('2p-choose-p2');
        } else if (forMode === '2p-choose-p2') {
          // player2 は選択肢から player1 の画像を除いたものにする
          if (key === selectedImageKeyP1) {
            // 同じ画像を選ばれた場合は許可しない（ユーザビリティ）
            // 代わりに無視して再表示（シンプル）
            showImagePicker('2p-choose-p2');
            return;
          }
          selectedImageKeyP2 = key;
          showScreen(gameScreen);
          initGame();
        }
      });

      row.appendChild(thumb);
    });

    box.appendChild(row);

    const cancel = document.createElement('div');
    cancel.style.marginTop = '12px';
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'キャンセル';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      showScreen(startScreen);
    });
    cancel.appendChild(cancelBtn);
    box.appendChild(cancel);

    modal.appendChild(box);
    document.body.appendChild(modal);
  }

  start1PButton.addEventListener('click', () => {
    gameMode = '1p';
    // 1Pを選んだら1Pの画像選択を促す
    preloadImages(IMAGE_KEYS, () => {
      showImagePicker('1p-single');
    });
  });

  start2PButton.addEventListener('click', () => {
    gameMode = '2p';
    preloadImages(IMAGE_KEYS, () => {
      // 2P: まず P1 を選択 -> 次に P2 を選択（残りから）
      showImagePicker('2p-choose-p1');
    });
  });

  restartButton.addEventListener('click', () => {
    // 同じモードで再挑戦。2Pは両者の画像をそのまま使う。1Pは同じ選択を使用
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

  // --- 初期起動 ---
  showScreen(startScreen);
  preloadImages(IMAGE_KEYS, () => {
    // 画像だけ先に読み込んでおく（選択画面で使う）
  });

  // --- イベント: 終了画面をクリックで再戦 ---
  gameOverScreen.addEventListener('click', () => {
    // 再戦：同じモードで画像選択はスキップしてそのまま initGame
    gameOver = false;
    showScreen(gameScreen);
    initGame();
  });

  // --- ウィンドウリサイズ初期呼び出し ---
  resizeCanvas();
});