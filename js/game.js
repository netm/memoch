// game.js

// --- HTML要素＆コンテキスト取得 ---
const canvas            = document.getElementById('gameCanvas');
const ctx               = canvas.getContext('2d');
const fuelDisplay       = document.getElementById('fuel');
const durabilityDisplay = document.getElementById('durability');
const distanceDisplay   = document.getElementById('distance');
const startButton       = document.getElementById('startButton');
const leftButton        = document.getElementById('leftButton');
const rightButton       = document.getElementById('rightButton');
const upButton          = document.getElementById('upButton');
const downButton        = document.getElementById('downButton');

// --- 画像ロード設定 ---
const images       = {};
const imagePaths   = {
  playerCar:  '/images/zcar1.png',
  enemyCar:   '/images/zcar2.jpg',
  fuelItem:   '/images/zcar3.jpg',
  repairItem: '/images/zcar4.jpg'
};
let imagesLoadedCount = 0;
const totalImages     = Object.keys(imagePaths).length;

// --- ゲーム状態変数 ---
let gameRunning   = false;
let distance      = 0;
let prevPadStates = [];

// --- 入力状態管理 ---
// キーボード＋タッチ入力
const keyboardKeys = {
  ArrowLeft:  false,
  ArrowRight: false,
  ArrowUp:    false,
  ArrowDown:  false
};
// ゲームパッド入力（毎フレーム上書き）
const gamepadKeys  = {
  ArrowLeft:  false,
  ArrowRight: false,
  ArrowUp:    false,
  ArrowDown:  false
};

// --- プレイヤー車の定義 ---
const playerCar = {
  x:                   canvas.width / 2,
  y:                   canvas.height - 100,
  width:               36,
  height:              63,
  speed:               0,
  maxSpeed:            7,
  acceleration:        0.2,
  deceleration:        0.1,
  turnSpeed:           0.05,
  angle:              -Math.PI / 2,
  maxFuel:             100,
  fuel:                100,
  fuelConsumptionRate: 0.05,
  maxDurability:       100,
  durability:          100,
  collisionDamage:     25
};

// --- 敵車設定 ---
const enemyCars          = [];
const maxEnemyCars       = 7;
const enemyBaseSpeed     = 2;
const enemySpawnInterval = 90;
let enemySpawnCounter    = 0;

// --- アイテム設定 ---
const items             = [];
const itemSpawnInterval = 250;
let itemSpawnCounter    = 0;
const itemSize          = 35;

// --- 画像ロード ---
function loadImages() {
  for (const key in imagePaths) {
    const img = new Image();
    img.src    = imagePaths[key];
    img.onload = () => {
      images[key] = img;
      imagesLoadedCount++;
      if (imagesLoadedCount === totalImages) {
        startButton.disabled = false;
      }
    };
    img.onerror = () => console.error(`Failed to load ${imagePaths[key]}`);
  }
}

// --- 入力設定（クリック・タッチ・キーボード・ゲームパッド） ---
function setupInput() {
  // タッチ → keyboardKeys にマッピング
  const setKey = (k, v) => { keyboardKeys[k] = v; };
  leftButton .addEventListener('touchstart', e => { e.preventDefault(); setKey('ArrowLeft',  true ); });
  leftButton .addEventListener('touchend',   e => { e.preventDefault(); setKey('ArrowLeft',  false); });
  rightButton.addEventListener('touchstart', e => { e.preventDefault(); setKey('ArrowRight', true ); });
  rightButton.addEventListener('touchend',   e => { e.preventDefault(); setKey('ArrowRight', false); });
  upButton    .addEventListener('touchstart', e => { e.preventDefault(); setKey('ArrowUp',    true ); });
  upButton    .addEventListener('touchend',   e => { e.preventDefault(); setKey('ArrowUp',    false); });
  downButton  .addEventListener('touchstart', e => { e.preventDefault(); setKey('ArrowDown',  true ); });
  downButton  .addEventListener('touchend',   e => { e.preventDefault(); setKey('ArrowDown',  false); });

  // キーボード操作
  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !gameRunning) {
      e.preventDefault();
      startGame();
      return;
    }
    if (keyboardKeys.hasOwnProperty(e.key)) {
      e.preventDefault();
      keyboardKeys[e.key] = true;
    }
  });
  window.addEventListener('keyup', e => {
    if (keyboardKeys.hasOwnProperty(e.key)) {
      e.preventDefault();
      keyboardKeys[e.key] = false;
    }
  });

  // スタートボタン：クリック＆タッチ対応
  startButton.addEventListener('click', () => {
    startGame();
  });
  startButton.addEventListener('touchend', e => {
    e.preventDefault();
    startGame();
  });
}

// --- ゲームパッドポーリング ---
function pollGamepad() {
  const gps = navigator.getGamepads?.() || [];
  ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].forEach(k => gamepadKeys[k] = false);

  gps.forEach((gp, i) => {
    if (!gp) return;
    gamepadKeys.ArrowUp    ||= gp.buttons[12]?.pressed;
    gamepadKeys.ArrowDown  ||= gp.buttons[13]?.pressed;
    gamepadKeys.ArrowLeft  ||= gp.buttons[14]?.pressed;
    gamepadKeys.ArrowRight ||= gp.buttons[15]?.pressed;

    const enterNow = gp.buttons[9]?.pressed || gp.buttons[0]?.pressed || gp.buttons[2]?.pressed;
    const prev     = prevPadStates[i]?.enter || false;
    if (enterNow && !prev && !gameRunning) startGame();
    prevPadStates[i] = { enter: enterNow };
  });
}

// --- 初期化・開始・終了 ---
function initializeGame() {
  playerCar.x          = canvas.width  / 2;
  playerCar.y          = canvas.height - 100;
  playerCar.speed      = 0;
  playerCar.angle      = -Math.PI / 2;
  playerCar.fuel       = playerCar.maxFuel;
  playerCar.durability = playerCar.maxDurability;

  distance           = 0;
  enemyCars.length   = 0;
  items.length       = 0;
  enemySpawnCounter  = 0;
  itemSpawnCounter   = 0;
  prevPadStates      = [];

  Object.keys(keyboardKeys).forEach(k => keyboardKeys[k] = false);
  Object.keys(gamepadKeys).forEach(k   => gamepadKeys[k]   = false);

  updateStatus();
  gameRunning = false;
  startButton.textContent = '開始';
}

function startGame() {
  console.log('▶ startGame() 呼び出し');
  if (imagesLoadedCount < totalImages) {
    alert('画像を読み込み中です…');
    return;
  }
  if (!gameRunning) {
    initializeGame();
    gameRunning = true;
  }
}

function endGame() {
  gameRunning = false;
  alert(`走行距離: ${distance.toFixed(0)} m\nもう一度挑戦しよう！`);
}

// --- ステータス更新 ---
function updateStatus() {
  fuelDisplay.textContent        = playerCar.fuel.toFixed(0);
  durabilityDisplay.textContent = playerCar.durability.toFixed(0);
  distanceDisplay.textContent   = distance.toFixed(0);
}

// --- 描画 ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー車
  ctx.save();
  ctx.translate(playerCar.x, playerCar.y);
  ctx.rotate(playerCar.angle + Math.PI/2);
  ctx.drawImage(
    images.playerCar,
    -playerCar.width/2, -playerCar.height/2,
     playerCar.width,    playerCar.height
  );
  ctx.restore();

  // 敵車
  enemyCars.forEach(car => {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle + Math.PI/2);
    ctx.drawImage(
      images.enemyCar,
      -car.width/2, -car.height/2,
       car.width,    car.height
    );
    ctx.restore();
  });

  // アイテム
  items.forEach(item => {
    const img = item.type === 'fuel' ? images.fuelItem : images.repairItem;
    ctx.drawImage(
      img,
      item.x - item.size/2,
      item.y - item.size/2,
      item.size,
      item.size
    );
  });
}

// --- 衝突判定 (AABB) ---
function checkCollision(a, b) {
  const ax = a.x - a.width/2, ay = a.y - a.height/2;
  const bx = b.x - b.width/2, by = b.y - b.height/2;
  return ax < bx + b.width &&
         ax + a.width > bx &&
         ay < by + b.height &&
         ay + a.height > by;
}

// --- ゲームロジック更新 ---
function updatePlayerCar() {
  const left  = keyboardKeys.ArrowLeft  || gamepadKeys.ArrowLeft;
  const right = keyboardKeys.ArrowRight || gamepadKeys.ArrowRight;
  const up    = keyboardKeys.ArrowUp    || gamepadKeys.ArrowUp;
  const down  = keyboardKeys.ArrowDown  || gamepadKeys.ArrowDown;

  if (left)  playerCar.angle -= playerCar.turnSpeed;
  if (right) playerCar.angle += playerCar.turnSpeed;

  if (up) {
    playerCar.speed = Math.min(playerCar.maxSpeed, playerCar.speed + playerCar.acceleration);
  } else if (down) {
    playerCar.speed = Math.max(-playerCar.maxSpeed/2,
                               playerCar.speed - playerCar.deceleration * 1.5);
  } else {
    if (playerCar.speed > 0) {
      playerCar.speed = Math.max(0, playerCar.speed - playerCar.deceleration);
    } else {
      playerCar.speed = Math.min(0, playerCar.speed + playerCar.deceleration);
    }
  }

  playerCar.x += playerCar.speed * Math.cos(playerCar.angle);
  playerCar.y += playerCar.speed * Math.sin(playerCar.angle);

  playerCar.x = Math.min(canvas.width  - playerCar.width/2,
                         Math.max(playerCar.width/2, playerCar.x));
  playerCar.y = Math.min(canvas.height - playerCar.height/2,
                         Math.max(playerCar.height/2, playerCar.y));

  playerCar.fuel -= playerCar.fuelConsumptionRate *
                    (Math.abs(playerCar.speed)/playerCar.maxSpeed + 0.5);
  if (playerCar.fuel < 0) playerCar.fuel = 0;
}

function updateEnemyCars() {
  enemySpawnCounter++;
  if (enemySpawnCounter >= enemySpawnInterval &&
      enemyCars.length < maxEnemyCars) {
    const car = {
      width:  45,
      height: 72,
      speed:  enemyBaseSpeed + Math.random()*2
    };
    const side = Math.floor(Math.random()*3);
    if (side === 0) {
      car.x     = Math.random()*(canvas.width - car.width) + car.width/2;
      car.y     = -car.height/2;
      car.angle = Math.PI/2;
    } else if (side === 1) {
      car.x     = -car.width/2;
      car.y     = Math.random()*(canvas.height - car.height)+car.height/2;
      car.angle = 0;
    } else {
      car.x     = canvas.width + car.width/2;
      car.y     = Math.random()*(canvas.height - car.height)+car.height/2;
      car.angle = Math.PI;
    }
    enemyCars.push(car);
    enemySpawnCounter = 0;
  }

  enemyCars.forEach((car, idx) => {
    car.x += car.speed * Math.cos(car.angle);
    car.y += car.speed * Math.sin(car.angle);
    if (
      car.x < -car.width*2 ||
      car.x > canvas.width + car.width*2 ||
      car.y < -car.height*2 ||
      car.y > canvas.height + car.height*2
    ) {
      enemyCars.splice(idx, 1);
    }
  });
}

function updateItems() {
  itemSpawnCounter++;
  if (itemSpawnCounter >= itemSpawnInterval) {
    items.push({
      x:     Math.random()*(canvas.width - itemSize*2)+itemSize,
      y:     -itemSize,
      size:  itemSize,
      speed: enemyBaseSpeed,
      type:  Math.random()<0.7?'fuel':'repair'
    });
    itemSpawnCounter = 0;
  }

  items.forEach((it, idx) => {
    it.y += it.speed;
    if (it.y > canvas.height + it.size) items.splice(idx, 1);
  });
}

function updateGameLogic() {
  updatePlayerCar();
  updateEnemyCars();
  updateItems();

  distance += Math.abs(playerCar.speed) * 0.1;

  enemyCars.forEach((e, i) => {
    if (checkCollision(playerCar, e)) {
      playerCar.durability = Math.max(0, playerCar.durability - playerCar.collisionDamage);
      enemyCars.splice(i, 1);
    }
  });

  items.forEach((it, i) => {
    const rectIt = { x: it.x, y: it.y, width: it.size, height: it.size };
    const rectPl = {
      x: playerCar.x - playerCar.width/2,
      y: playerCar.y - playerCar.height/2,
      width:  playerCar.width,
      height: playerCar.height
    };
    if (checkCollision(rectPl, rectIt)) {
      if (it.type === 'fuel') {
        playerCar.fuel = Math.min(playerCar.maxFuel, playerCar.fuel + 30);
      } else {
        playerCar.durability = Math.min(playerCar.maxDurability, playerCar.durability + 25);
      }
      items.splice(i, 1);
    }
  });

  updateStatus();
  if (playerCar.fuel <= 0 || playerCar.durability <= 0) endGame();
}

// --- メインループ ---
function mainLoop() {
  pollGamepad();
  if (gameRunning) {
    updateGameLogic();
    draw();
  }
  requestAnimationFrame(mainLoop);
}

// --- エントリポイント ---
initializeGame();
loadImages();
setupInput();
startButton.disabled = true;
requestAnimationFrame(mainLoop);