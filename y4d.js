// game.js

// --- Image Assets ---
const imgP1    = new Image();
imgP1.src      = 'znp1.png';
const imgP2    = new Image();
imgP2.src      = 'znp2.png';
const imgEnemy = new Image();
imgEnemy.src   = 'znp2.png';

// --- Canvas & Global Setup ---
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx    = canvas.getContext('2d');
document.body.style.margin          = '0';
document.body.style.overflow        = 'hidden';
document.body.style.backgroundColor = 'black';
document.body.style.userSelect      = 'none';
canvas.style.touchAction            = 'none';
canvas.addEventListener('contextmenu', e => e.preventDefault());

// --- Game States & Modes ---
const STATE = {
  TITLE:       'title',
  PLAYING:     'playing',
  STAGE_CLEAR: 'stageClear',
  GAME_OVER:   'gameOver',
  PVP_RESULT:  'pvpResult'
};
const MODE = {
  VS_COM: 'vsCOM',
  VS_2P:  'vs2P'
};

// --- Physics & UI Constants ---
let GROUND_Y;
const GRAVITY          = 0.165;
const PLAYER_HOR_SPEED = 8;
const COM_HOR_SPEED    = 7;
const FLY_VER_SPEED    = -4.6;
const SHURIKEN_SPEED   = 6;
const ARROW_SPEED      = 3.5;
const PAD        = 20;
const BTN_WIDTH  = 80;
const BTN_HEIGHT = 120;
const BTN_BG     = '#444444';

// --- Globals ---
let gameState = STATE.TITLE;
let gameMode, stage;
let p1, p2, enemies, projectiles;

// --- Utility Functions ---
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  GROUND_Y      = canvas.height - 50;
}

function getStageBounds() {
  return {
    minX: PAD + BTN_WIDTH,
    maxX: canvas.width - PAD - BTN_WIDTH
  };
}

function drawText(text, x, y, size, color, align = 'center') {
  ctx.fillStyle    = color;
  ctx.font         = `bold ${size}px sans-serif`;
  ctx.textAlign    = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function isColliding(a, b) {
  return a.x > b.x &&
         a.x < b.x + b.width &&
         a.y > b.y &&
         a.y < b.y + b.height;
}

function drawShuriken(x, y, color) {
  const s = 12;
  ctx.fillStyle = color;
  ctx.fillRect(x - s,   y,      s*2,   s/3);
  ctx.fillRect(x,       y - s,  s/3,   s*2);
  ctx.fillRect(x - s/2, y - s/2, s,    s);
}

function drawArrow(x, y, color, left) {
  const w = 6, h = 3;
  ctx.fillStyle = color;
  ctx.beginPath();
  if (left) {
    ctx.moveTo(x + w, y - h);
    ctx.lineTo(x,     y);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fillRect(x - w, y - 1, w, 2);
  } else {
    ctx.moveTo(x - w, y - h);
    ctx.lineTo(x,     y);
    ctx.lineTo(x - w, y + h);
    ctx.closePath();
    ctx.fillRect(x,     y - 1, w, 2);
  }
  ctx.fill();
}

// --- Nagoya Castle Roof & Shachihoko ---
function drawTenshukaku() {
  const { minX, maxX } = getStageBounds();
  const roofWidth      = maxX - minX;
  const pixel          = 4;
  const rows           = 15;
  const startX         = minX;

  // flared roof: bottom wider than top
  for (let i = 0; i < rows; i++) {
    const y     = GROUND_Y + i * pixel;
    const flare = Math.floor(Math.pow(i / (rows - 1), 1.5) * pixel * rows * 0.5);
    const w     = roofWidth + flare * 2;
    const x     = startX - flare;
    ctx.fillStyle = '#32998d';
    ctx.fillRect(x, y, w, pixel);
  }

  // crescent‐moon curved fish shape (10×8)
  const artRight = [
    [0,0,0,0,0,1,1,0,1,1],
    [0,0,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,1,1,0],
    [0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,0,0]
  ];
  const artLeft = artRight.map(row => row.slice().reverse());

  const cols = artRight[0].length;
  const rowsA= artRight.length;
  const shpW = cols * pixel;
  const shpH = rowsA * pixel;
  const yTop = GROUND_Y - shpH;

  // place exactly at roof edges
  const xLeft  = startX - pixel;
  const xRight = startX + roofWidth - shpW + pixel;

  ctx.fillStyle = '#ffff99';
  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < cols; c++) {
      if (artLeft[r][c]) {
        ctx.fillRect(xLeft  + c * pixel, yTop + r * pixel, pixel, pixel);
      }
      if (artRight[r][c]) {
        ctx.fillRect(xRight + c * pixel, yTop + r * pixel, pixel, pixel);
      }
    }
  }
}

// --- Character Base ---
class Character {
  constructor(x, y, w, h) {
    this.x        = x;
    this.y        = y;
    this.width    = w;
    this.height   = h;
    this.vx       = 0;
    this.vy       = 0;
    this.onGround = false;
    this.lastShot = 0;
  }

  applyGravity() {
    if (this.y + this.height < GROUND_Y || this.vy < 0) {
      this.vy += GRAVITY;
      this.onGround = false;
    } else {
      this.vy       = 0;
      this.y        = GROUND_Y - this.height;
      this.onGround = true;
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) {
      this.y  = 0;
      this.vy = 0;
    }
    const minX = PAD + BTN_WIDTH;
    const maxX = canvas.width - PAD - BTN_WIDTH - this.width;
    if (this.x < minX)              this.x = minX;
    if (this.x + this.width > maxX) this.x = maxX - this.width;
  }
}

// --- Player ---
class Player extends Character {
  constructor(x, y, img, color, shurikenColor, dir) {
    super(x, y, 20, 30);
    this.img           = img;
    this.color         = color;
    this.shurikenColor = shurikenColor;
    this.direction     = dir;
    this.winner        = false;
  }
  fly() {
    this.vy       = FLY_VER_SPEED;
    this.vx       = (this.direction==='right'?1:-1)*PLAYER_HOR_SPEED;
    this.onGround = false;
    const now = Date.now();
    if (now - this.lastShot >= 700) {
      this.lastShot = now;
      projectiles.push(new Projectile(
        this.x + this.width/2,
        this.y + this.height/2,
        this.direction==='right'?SHURIKEN_SPEED:-SHURIKEN_SPEED,
        0,
        this.shurikenColor,
        this===p1?'p1':'p2',
        true
      ));
    }
  }
  update() {
    this.vx *= 0.8;
    super.applyGravity();
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// --- Enemy (COM) ---
class Enemy extends Character {
  constructor(x, y, type) {
    super(x, y, 20, 30);
    this.type          = type;
    this.shootCooldown = Math.random()*200+90;
    this.moveCooldown  = 90;
    this.direction     = 'left';
  }
  update() {
    super.applyGravity();
    if (--this.moveCooldown <= 0) this.decideAction();
    if (--this.shootCooldown <= 0 && !this.onGround) {
      const now = Date.now();
      if (now - this.lastShot >= 1500) {
        this.lastShot = now;
        this.shoot();
      }
    }
  }
  decideAction() {
    const r  = Math.random();
    const wC = [0.2,0.1,0.05][this.type]||0.1;
    if (this.onGround && r > wC) {
      this.vx = (Math.random()>0.5?1:-1)*2;
      this.direction    = this.vx>0?'right':'left';
      this.moveCooldown = 30;
    } else {
      this.shoot();
    }
  }
  shoot() {
    this.direction = Math.random()>0.5?'left':'right';
    const sp = this.direction==='left'? -ARROW_SPEED : ARROW_SPEED;
    projectiles.push(new Projectile(
      this.x + this.width/2,
      this.y + this.height/2,
      sp, 0, 'white','enemy', false
    ));
    this.vy = FLY_VER_SPEED;
    this.vx = (this.direction==='right'?1:-1)*COM_HOR_SPEED;
    this.shootCooldown = 100;
    this.moveCooldown  = 40;
  }
  draw() {
    ctx.drawImage(imgEnemy, this.x, this.y, this.width, this.height);
  }
}

// --- Projectile ---
class Projectile {
  constructor(x,y,vx,vy,color,owner,isShuriken) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color; this.owner = owner;
    this.isShuriken = isShuriken;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    if (this.isShuriken) drawShuriken(this.x, this.y, this.color);
    else                 drawArrow(this.x, this.y, this.color, this.vx<0);
  }
}

// --- Game Setup Functions ---
function setupVsCOM() {
  gameMode    = MODE.VS_COM;
  stage       = stage || 1;
  p1          = new Player(PAD+BTN_WIDTH, GROUND_Y-30, imgP1, 'red', 'gray', 'right');
  p2          = null;
  enemies     = [];
  projectiles = [];
  for (let i = 0; i < stage; i++) {
    enemies.push(new Enemy(
      canvas.width - PAD - BTN_WIDTH - 20,
      Math.random() * (GROUND_Y / 2),
      Math.floor(Math.random() * 3)
    ));
  }
  gameState = STATE.PLAYING;
}

function setupVs2P() {
  gameMode    = MODE.VS_2P;
  p1          = new Player(PAD+BTN_WIDTH, GROUND_Y-30, imgP1, 'red', 'gray', 'right');
  p2          = new Player(canvas.width - PAD - BTN_WIDTH - 20, GROUND_Y-30, imgP2, 'blue', 'white', 'left');
  p1.winner = p2.winner = false;
  enemies     = [];
  projectiles = [];
  gameState   = STATE.PLAYING;
}

// --- Main Update Logic ---
function updatePlaying() {
  p1.update();
  if (p2) p2.update();
  enemies.forEach(e => e.update());
  projectiles.forEach(p => p.update());

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    if (proj.owner === 'p1') {
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (isColliding(proj, enemies[j])) {
          enemies.splice(j, 1);
          projectiles.splice(i, 1);
          break;
        }
      }
      if (!projectiles[i] && p2) continue;
      if (p2 && isColliding(proj, p2)) {
        projectiles.splice(i, 1);
        p1.winner = true;
        gameState = STATE.PVP_RESULT;
      }
      continue;
    }
    if (proj.owner === 'p2') {
      if (isColliding(proj, p1)) {
        projectiles.splice(i, 1);
        p2.winner = true;
        gameState = STATE.PVP_RESULT;
      }
      continue;
    }
    if (proj.owner === 'enemy') {
      if (isColliding(proj, p1)) {
        projectiles.splice(i, 1);
        gameState = STATE.GAME_OVER;
        continue;
      }
      if (p2 && isColliding(proj, p2)) {
        projectiles.splice(i, 1);
        p2.winner = true;
        gameState = STATE.PVP_RESULT;
        continue;
      }
    }
    if (proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
      projectiles.splice(i, 1);
    }
  }

  if (gameMode === MODE.VS_COM && enemies.length === 0) {
    gameState = STATE.STAGE_CLEAR;
  }
}

// --- Drawing & Main Loop ---
function drawPlaying() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTenshukaku();

  p1.draw();
  if (p2) p2.draw();
  enemies.forEach(e => e.draw());
  projectiles.forEach(p => p.draw());

  ctx.fillStyle = BTN_BG;
  ctx.fillRect(PAD, PAD, BTN_WIDTH, BTN_HEIGHT);
  drawText('右', PAD + BTN_WIDTH/2, PAD + BTN_HEIGHT/2, 30, 'white');
  ctx.fillRect(PAD, PAD*2 + BTN_HEIGHT, BTN_WIDTH, BTN_HEIGHT);
  drawText('左', PAD + BTN_WIDTH/2, PAD*2 + BTN_HEIGHT + BTN_HEIGHT/2, 30, 'grey');

  if (gameMode === MODE.VS_2P) {
    const rX = canvas.width - PAD - BTN_WIDTH;
    ctx.fillRect(rX, PAD, BTN_WIDTH, BTN_HEIGHT);
    drawText('左', rX + BTN_WIDTH/2, PAD + BTN_HEIGHT/2, 30, 'white');
    ctx.fillRect(rX, PAD*2 + BTN_HEIGHT, BTN_WIDTH, BTN_HEIGHT);
    drawText('右', rX + BTN_WIDTH/2, PAD*2 + BTN_HEIGHT + BTN_HEIGHT/2, 30, 'grey');
  }
}

function drawMessage(main, sub) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawText(main, canvas.width/2, canvas.height/2 - 40, 60, 'white');
  if (sub) drawText(sub, canvas.width/2, canvas.height/2 + 40, 20, 'white');
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  switch (gameState) {
    case STATE.TITLE:
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawText('左タッチ 1P よこ画面', canvas.width/4, canvas.height/2 - 30, 24, 'white');
      drawText('右タッチ vs 2P', canvas.width*3/4, canvas.height/2 - 30, 24, 'white');
      break;
    case STATE.PLAYING:
      updatePlaying();
      drawPlaying();
      break;
    case STATE.STAGE_CLEAR:
      drawPlaying();
      drawMessage('大勝利☆', `${stage+1} 面へ`);
      break;
    case STATE.GAME_OVER:
      drawPlaying();
      drawMessage('コンティニュー', `${stage} 面  再スタート`);
      break;
    case STATE.PVP_RESULT:
      drawPlaying();
      const resultText = p1.winner ? '1P 勝利' : '2P 勝利';
      drawMessage(resultText, '再戦する');
      break;
  }
  requestAnimationFrame(gameLoop);
}

// --- Input Handlers ---
function handleStart(e) {
  e.preventDefault();
  const touches = e.changedTouches ? e.changedTouches : [e];
  for (let t of touches) {
    const x = t.clientX, y = t.clientY;
    if (gameState === STATE.TITLE) {
      stage = 1;
      if (x < canvas.width/2) setupVsCOM();
      else                   setupVs2P();
      return;
    }
    if (gameState === STATE.PLAYING) {
      if (x >= PAD && x <= PAD+BTN_WIDTH && y >= PAD && y <= PAD+BTN_HEIGHT) {
        p1.direction = 'right'; p1.fly(); continue;
      }
      if (x >= PAD && x <= PAD+BTN_WIDTH && y >= PAD*2+BTN_HEIGHT && y <= PAD*2+BTN_HEIGHT*2) {
        p1.direction = 'left'; p1.fly(); continue;
      }
      if (gameMode === MODE.VS_2P) {
        const rX = canvas.width - PAD - BTN_WIDTH;
        if (x >= rX && x <= rX+BTN_WIDTH && y >= PAD && y <= PAD+BTN_HEIGHT) {
          p2.direction = 'left'; p2.fly(); continue;
        }
        if (x >= rX && x <= rX+BTN_WIDTH && y >= PAD*2+BTN_HEIGHT && y <= PAD*2+BTN_HEIGHT*2) {
          p2.direction = 'right'; p2.fly(); continue;
        }
      }
    }
    if (gameState === STATE.STAGE_CLEAR) {
      stage++;
      setupVsCOM();
      return;
    }
    if (gameState === STATE.GAME_OVER) {
      setupVsCOM();
      return;
    }
    if (gameState === STATE.PVP_RESULT) {
      setupVs2P();
      return;
    }
  }
}

function handleEnd(e) {
  e.preventDefault();
}

window.addEventListener('mousedown', handleStart);
window.addEventListener('mouseup',   handleEnd);
canvas.addEventListener('touchstart', handleStart, { passive:false });
canvas.addEventListener('touchend',   handleEnd,   { passive:false });
window.addEventListener('keydown', e => {
  if (e.key === 'd' || e.key === 'ArrowRight') { p1.direction='right'; p1.fly(); }
  if (e.key === 'a' || e.key === 'ArrowLeft')  { p1.direction='left';  p1.fly(); }
  if (p2 && (e.key==='4' || e.key==='Numpad4')) {
    p2.direction='left'; p2.fly();
  }
  if (p2 && (e.key==='6' || e.key==='Numpad6')) {
    p2.direction='right'; p2.fly();
  }
  if (e.key === ' ' || e.key === 'Enter') handleStart(e);
});
window.addEventListener('keyup', handleEnd);

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
gameLoop();