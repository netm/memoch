document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');
  const messageOverlay = document.getElementById('message-overlay');

  // --- ゲーム設定 ---
  const TILE_SIZE        = 28;
  const PLAYER_SPEED     = 2;
  const ENEMY_BASE_SPEED = 0.5;
  const BALL_SPEED       = 6;
  const FIRE_RATE        = 1000; // ミリ秒

  // 画面サイズに合わせて（横画面想定）
  let cw = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
  let ch = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if (cw < ch) [cw, ch] = [ch, cw];
  // 幅を少しせまく（-3タイル）、高さを縦に2キャラ分せまく（-2タイル）
  canvas.width  = Math.floor(cw / TILE_SIZE) * TILE_SIZE - TILE_SIZE * 3;
  canvas.height = Math.floor(ch / TILE_SIZE) * TILE_SIZE - TILE_SIZE * 2;

  // 画像読み込み
  const images = {};
  const imageSources = {
    player: 'zombie1.png',
    enemy:  'zombie2.png',
    itemA:  'zombie3.png',
    itemB:  'zombie4.png'
  };
  let loaded = 0;
  const total = Object.keys(imageSources).length;
  for (let key in imageSources) {
    images[key] = new Image();
    images[key].src = imageSources[key];
    images[key].onload  = () => (++loaded === total) && init();
    images[key].onerror = () => { 
      console.error(`Failed to load ${imageSources[key]}`); 
      (++loaded === total) && init();
    };
  }

  // --- ゲーム状態 ---
  let state = {
    status:   'start',  // 'start','playing','clear','over'
    stage:     0,
    player:  null,
    enemies: [],
    items:   [],
    door:    null,
    balls:   [],
    bars:    [],
    keys:    {},
    lastFire: 0,
    frozen:   false,
  };

  // --- 基底クラス ---
  class Entity {
    constructor(x, y, w, h, img = null) {
      this.x = x; this.y = y;
      this.width  = w; this.height = h;
      this.image  = img;
    }
    draw() {
      if (this.image && this.image.complete) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }

  // プレイヤー
  class Player extends Entity {
    constructor(x, y) {
      super(x, y, TILE_SIZE, TILE_SIZE, images.player);
      this.direction = 'right';
      this.vision    = TILE_SIZE * 2.5;
    }
  }

  // 敵
  class Enemy extends Entity {
    constructor(x, y) {
      super(x, y, TILE_SIZE, TILE_SIZE, images.enemy);
      this.speed = ENEMY_BASE_SPEED + Math.random() * 0.5;
      this.resetMove();
    }
    resetMove() {
      this.moveTimer = (2 + Math.floor(Math.random() * 3)) * 1000;
      const ang = Math.random() * Math.PI * 2;
      this.dx = Math.cos(ang) * this.speed;
      this.dy = Math.sin(ang) * this.speed;
    }
    update(dt) {
      if (state.frozen) return;
      const prevX = this.x, prevY = this.y;
      this.moveTimer -= dt;
      if (this.moveTimer <= 0) this.resetMove();
      this.x += this.dx; this.y += this.dy;

      // 画面端反射
      if (this.x < 0 || this.x + this.width > canvas.width)   this.dx *= -1;
      if (this.y < 0 || this.y + this.height > canvas.height) this.dy *= -1;
      this.x = Math.max(0, Math.min(canvas.width - this.width,   this.x));
      this.y = Math.max(0, Math.min(canvas.height- this.height,  this.y));

      // 棒とのバウンド
      for (const bar of state.bars) {
        for (const c of bar.cells) {
          if (checkCollision(this, c)) {
            this.x = prevX; this.y = prevY;
            this.dx *= -1;  this.dy *= -1;
          }
        }
      }

      // 敵同士の反発（押し合い）
      for (const other of state.enemies) {
        if (other === this) continue;
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dist = Math.hypot(dx, dy) || 1;
        const overlap = (this.width - dist);
        if (overlap > 0) {
          const ux    = dx / dist, uy = dy / dist;
          const shift = overlap / 2;
          this.x  += ux * shift;
          this.y  += uy * shift;
          other.x -= ux * shift;
          other.y -= uy * shift;
        }
      }
    }
  }

  // アイテム
  class Item extends Entity {
    constructor(x, y, type) {
      super(x, y, TILE_SIZE, TILE_SIZE,
            type === 'a' ? images.itemA : images.itemB);
      this.type = type;
    }
  }

  // ボール
  class Ball extends Entity {
    constructor(x, y, dir) {
      super(x, y, TILE_SIZE / 3, TILE_SIZE / 3, null);
      this.color = '#ffdd00';
      switch (dir) {
        case 'up':    this.dx = 0;           this.dy = -BALL_SPEED; break;
        case 'down':  this.dx = 0;           this.dy =  BALL_SPEED; break;
        case 'left':  this.dx = -BALL_SPEED; this.dy = 0;           break;
        case 'right': this.dx =  BALL_SPEED; this.dy = 0;           break;
      }
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        this.x + this.width  / 2,
        this.y + this.height / 2,
        this.width, 0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  // 灰色の棒（角丸）
  class Bar {
    constructor(cells) {
      this.cells = cells; // {x,y,width,height}
    }
    draw() {
      ctx.fillStyle = 'grey';
      this.cells.forEach(c => roundRect(c.x, c.y, c.width, c.height, 5));
    }
  }

  // --- 初期化 ---
  function init() {
    state.status = 'start';
    state.stage  = 0;
    showMessage('よこ画面<br>ゾンビ迷宮脱出ゲーム<br>スタート!');
  }

  // ステージ再設定
  function resetStage() {
    state.stage++;
    state.frozen = false;

    // プレイヤー中央
    state.player = new Player(
      (canvas.width  - TILE_SIZE) / 2,
      (canvas.height - TILE_SIZE) / 2
    );

    // アイテム配置
    state.items = [
      new Item(randX(), randY(), 'a'),
      new Item(randX(), randY(), 'b')
    ];

    // 敵配置
    state.enemies = [];
    const cnt = 6 + state.stage - 1;
    for (let i = 0; i < cnt; i++) {
      let e, ok;
      do {
        const p = randEdgeStrict();
        e = new Enemy(p.x, p.y);
        ok = !state.enemies.some(o => checkCollision(o, e));
      } while (!ok);
      state.enemies.push(e);
    }

    // ドア配置
    state.door = randEdge(3 * TILE_SIZE);
    state.door.width  = TILE_SIZE;
    state.door.height = TILE_SIZE;

    // 灰色の棒 ４本
    state.bars = [];
    const cols = canvas.width  / TILE_SIZE;
    const rows = canvas.height / TILE_SIZE;
    for (let n = 0; n < 4; n++) {
      let cells, tries = 0;
      do {
        const horiz = Math.random() < 0.5;
        cells = [];
        if (horiz) {
          const x0 = Math.floor(Math.random() * (cols - 4)) * TILE_SIZE;
          const y0 = Math.floor(Math.random() * rows)       * TILE_SIZE;
          for (let j = 0; j < 4; j++) {
            cells.push({ x: x0 + j * TILE_SIZE,
                         y: y0,
                         width: TILE_SIZE,
                         height: TILE_SIZE });
          }
        } else {
          const x0 = Math.floor(Math.random() * cols)       * TILE_SIZE;
          const y0 = Math.floor(Math.random() * (rows - 4)) * TILE_SIZE;
          for (let j = 0; j < 4; j++) {
            cells.push({ x: x0,
                         y: y0 + j * TILE_SIZE,
                         width: TILE_SIZE,
                         height: TILE_SIZE });
          }
        }
        tries++;
      } while (
        tries < 100 &&
        cells.some(c =>
          checkCollision(c, state.player) ||
          checkCollision(c, state.door)  ||
          state.items.some(it => checkCollision(c, it)) ||
          state.enemies.some(e => checkCollision(c, e)) ||
          state.bars.some(b => b.cells.some(c2 => checkCollision(c, c2)))
        )
      );
      state.bars.push(new Bar(cells));
    }

    // ボールリセット
    state.balls    = [];
    state.lastFire = 0;
    state.status   = 'playing';
    messageOverlay.style.visibility = 'hidden';
  }

  // --- メインループ ---
  let lastTS = 0;
  function gameLoop(ts) {
    const dt = ts - lastTS;
    lastTS = ts;
    if (state.status === 'playing') {
      update(dt);
      draw();
    }
    requestAnimationFrame(gameLoop);
  }

  // --- 更新処理 ---
  function update(dt) {
    const p = state.player;
    const px = p.x, py = p.y;

    if (state.keys['w'] || state.keys['arrowup'])    { p.y -= PLAYER_SPEED; p.direction = 'up';    }
    if (state.keys['s'] || state.keys['arrowdown'])  { p.y += PLAYER_SPEED; p.direction = 'down';  }
    if (state.keys['a'] || state.keys['arrowleft'])  { p.x -= PLAYER_SPEED; p.direction = 'left';  }
    if (state.keys['d'] || state.keys['arrowright']) { p.x += PLAYER_SPEED; p.direction = 'right'; }

    // 画面内＋棒と衝突
    p.x = Math.max(0, Math.min(canvas.width  - p.width,  p.x));
    p.y = Math.max(0, Math.min(canvas.height - p.height, p.y));
    for (const bar of state.bars) {
      for (const c of bar.cells) {
        if (checkCollision(p, c)) {
          p.x = px; p.y = py;
        }
      }
    }

    // 自動発射
    if (Date.now() - state.lastFire > FIRE_RATE) {
      state.balls.push(new Ball(p.x, p.y, p.direction));
      state.lastFire = Date.now();
    }

    // 各オブジェクト更新
    state.enemies.forEach(e => e.update(dt));
    state.balls.forEach(b    => b.update());

    // 画面外ボール削除
    state.balls = state.balls.filter(b =>
      b.x > 0 && b.x < canvas.width &&
      b.y > 0 && b.y < canvas.height
    );

    handleCollisions();
  }

  // --- 衝突処理 ---
  function handleCollisions() {
    // ボール vs 敵／棒セル
    for (let i = state.balls.length - 1; i >= 0; i--) {
      const b = state.balls[i];
      let removed = false;

      // 敵
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        if (checkCollision(b, state.enemies[j])) {
          state.balls.splice(i,1);
          state.enemies.splice(j,1);
          removed = true;
          break;
        }
      }
      if (removed) continue;

      // 棒
      for (let bi = 0; bi < state.bars.length; bi++) {
        const bar = state.bars[bi];
        for (let ci = bar.cells.length - 1; ci >= 0; ci--) {
          if (checkCollision(b, bar.cells[ci])) {
            state.balls.splice(i,1);
            bar.cells.splice(ci,1);
            if (!bar.cells.length) state.bars.splice(bi,1);
            removed = true;
            break;
          }
        }
        if (removed) break;
      }
    }

    // プレイヤー vs 敵
    for (const e of state.enemies) {
      if (checkCollision(state.player, e)) {
        state.status = 'over';
        showMessage('GAME OVER<br>コンティニュー');
        return;
      }
    }

    // プレイヤー vs アイテム
    for (let i = state.items.length - 1; i >= 0; i--) {
      if (checkCollision(state.player, state.items[i])) {
        const it = state.items[i];
        if (it.type === 'a') state.frozen = true;
        else                 state.player.vision = TILE_SIZE * 3.5;
        state.items.splice(i,1);
      }
    }

    // プレイヤー vs ドア
    if (checkCollision(state.player, state.door)) {
      state.status = 'clear';
      showMessage(`脱出成功☆<br>${state.stage + 1}階へ`);
    }
  }

  // --- 描画処理 ---
  function draw() {
    // 背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // ドア
    ctx.fillStyle = '#8a5a2e';
    ctx.fillRect(
      state.door.x, state.door.y,
      state.door.width, state.door.height
    );

    // 棒
    state.bars.forEach(bar => bar.draw());

    // アイテム
    state.items.forEach(it => it.draw());

    // 敵
    state.enemies.forEach(e => e.draw());

    // ボール
    state.balls.forEach(b => b.draw());

    // プレイヤー
    state.player.draw();

    // 視界マスク
    ctx.globalCompositeOperation = 'destination-in';
    const cx = state.player.x + state.player.width/2;
    const cy = state.player.y + state.player.height/2;
    const grad = ctx.createRadialGradient(
      cx, cy, state.player.vision*0.7,
      cx, cy, state.player.vision
    );
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  // --- ヘルパー関数 ---
  // 角丸長方形
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  // オブジェクトごとの当たり判定矩形取得（Player/Enemy は0.8倍）
  function getCollisionRect(o) {
    let x = o.x, y = o.y, w = o.width, h = o.height;
    if (o instanceof Player || o instanceof Enemy) {
      const factor = 0.8;
      const nw = w * factor;
      const nh = h * factor;
      x += (w - nw) / 2;
      y += (h - nh) / 2;
      w = nw; h = nh;
    }
    return { x, y, width: w, height: h };
  }

  // 衝突判定
  function checkCollision(a, b) {
    const r1 = getCollisionRect(a);
    const r2 = getCollisionRect(b);
    return r1.x < r2.x + r2.width &&
           r1.x + r1.width > r2.x &&
           r1.y < r2.y + r2.height &&
           r1.y + r1.height > r2.y;
  }

  // ランダム座標取得
  function randX() {
    return Math.floor(Math.random() * (canvas.width - TILE_SIZE));
  }
  function randY() {
    return Math.floor(Math.random() * (canvas.height - TILE_SIZE));
  }
  function randEdgeStrict() {
    const e = Math.floor(Math.random() * 4);
    let x, y;
    switch(e) {
      case 0: x = randX();                   y = 0;                         break;
      case 1: x = canvas.width - TILE_SIZE; y = randY();                   break;
      case 2: x = randX();                   y = canvas.height - TILE_SIZE; break;
      case 3: x = 0;                         y = randY();                   break;
    }
    return { x, y };
  }
  function randEdge(margin) {
    const e = Math.floor(Math.random() * 4);
    let x, y;
    switch(e) {
      case 0: x = randX();                   y = Math.random() * margin;              break;
      case 1: x = canvas.width - margin + Math.random() * margin; y = randY(); break;
      case 2: x = randX();                   y = canvas.height - margin + Math.random() * margin; break;
      case 3: x = Math.random() * margin;    y = randY();                             break;
    }
    x = Math.max(0, Math.min(canvas.width  - TILE_SIZE, x));
    y = Math.max(0, Math.min(canvas.height - TILE_SIZE, y));
    return { x, y };
  }

  // メッセージ表示
  function showMessage(txt) {
    messageOverlay.innerHTML      = txt;
    messageOverlay.style.visibility = 'visible';
  }

  // --- 入力 ---
  window.addEventListener('keydown', e => {
    state.keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', e => {
    state.keys[e.key.toLowerCase()] = false;
  });
  function handleClick() {
    if (state.status === 'start' || state.status === 'clear') resetStage();
    else if (state.status === 'over') {
      state.stage--;
      resetStage();
    }
  }
  messageOverlay.addEventListener('click', handleClick);
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (state.status !== 'playing' && ['enter',' ','p'].includes(k)) {
      handleClick();
    }
  });

  // モバイル操作
  function setupMobile() {
    const ctrls = [
      { id: 'btn-up',    key: 'w' },
      { id: 'btn-down',  key: 's' },
      { id: 'btn-left',  key: 'a' },
      { id: 'btn-right', key: 'd' }
    ];
    ctrls.forEach(c => {
      const btn = document.getElementById(c.id);
      btn.addEventListener('touchstart', e => {
        e.preventDefault();
        state.keys[c.key] = true;
      }, { passive: false });
      btn.addEventListener('touchend', e => {
        e.preventDefault();
        state.keys[c.key] = false;
      }, { passive: false });
    });
  }
  setupMobile();

  requestAnimationFrame(gameLoop);
});