// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const stageColor = "#0c0f40";
canvas.width = 600;
canvas.height = 400;

let gameState = "title";
let keys = {};
let buttons = { up: false, down: false, left: false, right: false };

const playerImg = new Image();
playerImg.src = "/images/zsensuikan1.png";
const enemyImg = new Image();
enemyImg.src = "/images/zsensuikan2.png";
const obstacleImg = new Image();
obstacleImg.src = "/images/zsensuikan3.png";

class Entity {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.img = img;
    this.alive = true;
  }
  draw() {
    if (!this.alive) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

class Player extends Entity {
  constructor() {
    super(20, canvas.height / 2 - 16, playerImg);
    this.ball = null;
    this.ballDir = [1, 0];
  }
  update() {
    const speed = 2.5;
    let nextX = this.x;
    let nextY = this.y;
    if (buttons.up) nextY -= speed;
    if (buttons.down) nextY += speed;
    if (buttons.left) nextX -= speed;
    if (buttons.right) nextX += speed;

    const tempRect = { x: nextX, y: nextY, width: this.width, height: this.height };
    if (!obstacles.some(obs => rectsIntersect(tempRect, obs.getRect()))) {
      this.x = Math.max(0, Math.min(nextX, canvas.width - this.width));
      this.y = Math.max(0, Math.min(nextY, canvas.height - this.height));
    }

    if (!this.ball || !this.ball.alive) {
      let dirX = 1, dirY = 0;
      if (buttons.up) [dirX, dirY] = [0, -1];
      else if (buttons.down) [dirX, dirY] = [0, 1];
      else if (buttons.left) [dirX, dirY] = [-1, 0];
      else if (buttons.right) [dirX, dirY] = [1, 0];
      this.ballDir = [dirX, dirY];
      this.ball = new Ball(this.x + this.width, this.y + this.height / 2, dirX, dirY, "#cccccc", true);
      balls.push(this.ball);
    }
  }
}

class Ball {
  constructor(x, y, dx, dy, color, isPlayer) {
    this.x = x;
    this.y = y;
    this.angle = Math.atan2(dy, dx);
    this.color = color;
    this.isPlayer = isPlayer;
    this.radius = 4;
    this.alive = true;
  }
  update() {
    const speed = 4;
    const turnRate = 0.05;
    if (this.isPlayer) {
      if (buttons.left) this.angle -= turnRate;
      if (buttons.right) this.angle += turnRate;
    }
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
    if (
      this.x < 0 || this.x > canvas.width ||
      this.y < 0 || this.y > canvas.height
    ) {
      this.alive = false;
    }
  }
  draw() {
    if (!this.alive) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  getRect() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }
}

class Enemy extends Entity {
  constructor(x, y, pattern) {
    super(x, y, enemyImg);
    this.pattern = pattern;
    this.moveTimer = 0;
    this.fireTimer = Math.random() * 1000;
    this.dir = [0, 0];
    this.step = 0;
    this.times = [
      [2000, 2000],
      [3000, 1000],
      [1000, 3000]
    ];
    this.nextMove();
  }
  nextMove() {
    const angle = Math.random() * Math.PI * 2;
    this.dir = [Math.cos(angle), Math.sin(angle)];
    this.moveTimer = this.times[this.pattern][this.step % 2];
    this.step++;
  }
  update(delta) {
    if (!this.alive) return;
    this.moveTimer -= delta;
    this.fireTimer -= delta;
    if (this.moveTimer <= 0) this.nextMove();
    let nextX = this.x + this.dir[0];
    let nextY = this.y + this.dir[1];
    const tempRect = { x: nextX, y: nextY, width: this.width, height: this.height };
    if (!obstacles.some(obs => rectsIntersect(tempRect, obs.getRect()))) {
      this.x = Math.max(0, Math.min(nextX, canvas.width - this.width));
      this.y = Math.max(0, Math.min(nextY, canvas.height - this.height));
    }
    if (this.fireTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      balls.push(new Ball(this.x + this.width / 2, this.y + this.height / 2, Math.cos(angle), Math.sin(angle), "red", false));
      this.fireTimer = 1000;
    }
  }
}

class Obstacle extends Entity {
  constructor(x, y) {
    super(x, y, obstacleImg);
  }
}

let player = new Player();
let enemies = [];
let balls = [];
let obstacles = [];

function rectsIntersect(r1, r2) {
  return r1.x < r2.x + r2.width &&
         r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height &&
         r1.y + r1.height > r2.y;
}

function startStage(count) {
  enemies = [];
  balls = [];
  obstacles = [];
  for (let i = 0; i < count; i++) {
    const y = 60 + i * 60;
    enemies.push(new Enemy(canvas.width - 60, y, i % 3));
  }
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (canvas.width - 32);
    const y = Math.random() * (canvas.height - 32);
    obstacles.push(new Obstacle(x, y));
  }
  player = new Player();
  gameState = "playing";
}

function drawUI() {
  ctx.fillStyle = stageColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "34px sans-serif";
  ctx.textAlign = "center";
}

function drawTitle() {
  drawUI();
  ctx.fillText("よこ画面 魚雷をまげよう! スタート", canvas.width / 2, canvas.height / 2);
}

function drawGameOver() {
  drawUI();
  ctx.fillText("GAME OVER　敵艦隊を駆逐せよ!", canvas.width / 2, canvas.height / 2);
}

function drawWin() {
  drawUI();
  ctx.fillText(`大勝利☆ おめでとう! ステージ ${stageLevel}へ`, canvas.width / 2, canvas.height / 2);
}

let stageLevel = 1;
let lastTime = performance.now();
function gameLoop(t) {
  const delta = t - lastTime;
  lastTime = t;
  if (gameState === "title") drawTitle();
  else if (gameState === "gameover") drawGameOver();
  else if (gameState === "win") drawWin();
  else if (gameState === "playing") {
    ctx.fillStyle = stageColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    obstacles.forEach(o => o.draw());

    for (const e of enemies) e.update(delta);
    for (const e of enemies) e.draw();

    balls.forEach(b => b.update());
    balls.forEach(b => b.draw());
    balls = balls.filter(b => b.alive);

    for (const b of balls) {
      if (!b.alive) continue;

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (rectsIntersect(b.getRect(), obs.getRect())) {
          b.alive = false;
          obstacles.splice(i, 1);
          break;
        }
      }

      if (b.isPlayer) {
        for (const e of enemies) {
          if (!e.alive) continue;
          if (rectsIntersect(b.getRect(), e.getRect())) {
            b.alive = false;
            e.alive = false;
          }
        }
      } else {
        if (rectsIntersect(b.getRect(), player.getRect())) {
          gameState = "gameover";
        }
      }
    }

    for (const e of enemies) {
      if (!e.alive) continue;
      if (rectsIntersect(e.getRect(), player.getRect())) {
        gameState = "gameover";
      }
    }

    if (enemies.every(e => !e.alive)) {
      gameState = "win";
      stageLevel++;
    }
  }
  requestAnimationFrame(gameLoop);
}

// Keyboard
window.addEventListener("keydown", e => {
  if ([" ", "Enter", "q"].includes(e.key)) {
    if (["title", "gameover", "win"].includes(gameState)) {
      startStage(stageLevel);
    }
  }
  if (["ArrowUp", "w", "8"].includes(e.key)) buttons.up = true;
  if (["ArrowDown", "s", "5"].includes(e.key)) buttons.down = true;
  if (["ArrowLeft", "a", "4"].includes(e.key)) buttons.left = true;
  if (["ArrowRight", "d", "6"].includes(e.key)) buttons.right = true;
});
window.addEventListener("keyup", e => {
  if (["ArrowUp", "w", "8"].includes(e.key)) buttons.up = false;
  if (["ArrowDown", "s", "5"].includes(e.key)) buttons.down = false;
  if (["ArrowLeft", "a", "4"].includes(e.key)) buttons.left = false;
  if (["ArrowRight", "d", "6"].includes(e.key)) buttons.right = false;
});

canvas.addEventListener("click", () => {
  if (["title", "gameover", "win"].includes(gameState)) {
    startStage(stageLevel);
  }
});

// Touch Controls
function setupTouchControls() {
  const map = [
    ["btnUp", "up"],
    ["btnDown", "down"],
    ["btnLeft", "left"],
    ["btnRight", "right"]
  ];
  map.forEach(([id, dir]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("touchstart", e => {
      e.preventDefault();
      buttons[dir] = true;
    });
    el.addEventListener("touchend", e => {
      e.preventDefault();
      buttons[dir] = false;
    });
  });
}
setupTouchControls();

requestAnimationFrame(gameLoop);
