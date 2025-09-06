(function() {
  'use strict';

  // 定数
  const PLAYER_SPEED   = 2;
  const BALL_SPEED     = 3;
  const ENEMY_SPEED    = 1;
  const CURVE_RATE     = 0.035;
  const CONTROL_WIDTH  = 60;
  const CONTROL_MARGIN = 5;
  const STAGE_GUTTER   = 10;
  const AXIS_THRESHOLD = 0.5;

  // ゲームパッドボタン定義
  const GP = {
    A:      0,
    X:      2,
    START:  9,
    UP:     12,
    DOWN:   13,
    LEFT:   14,
    RIGHT:  15
  };

  // グローバル変数
  var canvas, ctx, overlay;
  var W, H, leftBound, rightBound;
  var mode        = null;    // 'cpu' or '2p'
  var stage       = 1;
  var gameState   = 'start'; // 'start','playing','overlay'
  var overlayType = 'start';
  var overlayCb   = null;
  var player1, player2;
  var enemies = [], dots = [], balls = [];
  var lastTime = 0;

  // 画像オブジェクト
  var img1, img2, img3;

  // コントロール表示切り替え
  function updateControlsUI() {
    var p1c = document.getElementById('p1-controls');
    var p2c = document.getElementById('p2-controls');
    if (p1c) p1c.style.display = 'flex';
    if (p2c) p2c.style.display = (mode === '2p' ? 'flex' : 'none');
  }

  // 画像をロードして Promise を返す
  function loadImage(src) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image: ' + src));
      img.src     = src;
    });
  }

  // 画像ロード → ゲーム開始
  Promise.all([
    loadImage('zs1.png'),
    loadImage('zs2.png'),
    loadImage('zs3.png')
  ])
  .then(function(results) {
    [img1, img2, img3] = results;
    startGame();
  })
  .catch(function(err) {
    console.warn(err);
    // フォールバック用の１ピクセル画像を作る
    var fallback = document.createElement('canvas');
    fallback.width = fallback.height = 1;
    img1 = img2 = img3 = fallback;
    startGame();
  });

  function startGame() {
    canvas  = document.getElementById('game-canvas');
    ctx     = canvas.getContext('2d');
    overlay = document.getElementById('overlay');

    // ここでキャンバスをフルスクリーンにし、W/H/左右境界を確定
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    leftBound  = CONTROL_MARGIN + CONTROL_WIDTH + STAGE_GUTTER;
    rightBound = W - leftBound;

    // --- イベントリスナ登録 ---
    overlay.addEventListener('pointerdown', function(e) {
      if (overlayType === 'start') {
        // 左右半分のクリック位置でモード選択
        selectMode(e.clientX < W/2 ? 'cpu' : '2p');
      } else {
        overlay.style.visibility = 'hidden';
        gameState = 'playing';
        if (overlayCb) {
          overlayCb();
          overlayCb = null;
        } else {
          resetStage();
        }
      }
    });

    window.addEventListener('keydown', function(e) {
      // スタート画面：←→キーで mode 選択
      if (gameState === 'start' && overlayType === 'start') {
        if (e.key === 'ArrowLeft')  selectMode('cpu');
        if (e.key === 'ArrowRight') selectMode('2p');
      }

      // Enter / Space でスタート or リスタート
      if ((gameState === 'start' || gameState === 'overlay') &&
          (e.key === 'Enter' || e.key === ' ')) {
        if (overlayType === 'start') {
          selectMode('cpu');
        } else {
          overlay.style.visibility = 'hidden';
          gameState = 'playing';
          if (overlayCb) {
            overlayCb();
            overlayCb = null;
          } else {
            resetStage();
          }
        }
        return;
      }
      if (gameState !== 'playing') return;

      // 1P キーボード上下
      switch (e.key) {
        case 'w': case 'ArrowUp':
          player1.kbUp = true; break;
        case 's': case 'ArrowDown':
          player1.kbDown = true; break;
        case '8':
          if (player2) player2.kbUp = true; break;
        case '5':
          if (player2) player2.kbDown = true; break;
      }
    });

    window.addEventListener('keyup', function(e) {
      if (gameState !== 'playing') return;
      switch (e.key) {
        case 'w': case 'ArrowUp':
          player1.kbUp = false; break;
        case 's': case 'ArrowDown':
          player1.kbDown = false; break;
        case '8':
          if (player2) player2.kbUp = false; break;
        case '5':
          if (player2) player2.kbDown = false; break;
      }
    });

    // タッチ／マウス：上下ボタン
    ['p1-up','p1-down','p2-up','p2-down'].forEach(function(id) {
      var btn      = document.getElementById(id);
      var isP1     = id.startsWith('p1');
      var upOrDown = id.endsWith('up') ? 'Up' : 'Down';
      if (!btn) return;

      btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        var p = isP1 ? player1 : player2;
        if (p) p['touch' + upOrDown] = true;
      });
      btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        var p = isP1 ? player1 : player2;
        if (p) p['touch' + upOrDown] = false;
      });
      btn.addEventListener('mousedown', function() {
        var p = isP1 ? player1 : player2;
        if (p) p['touch' + upOrDown] = true;
      });
      btn.addEventListener('mouseup', function() {
        var p = isP1 ? player1 : player2;
        if (p) p['touch' + upOrDown] = false;
      });
    });

    window.addEventListener('resize', function() {
      // 再描画時に画面サイズを更新
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      leftBound  = CONTROL_MARGIN + CONTROL_WIDTH + STAGE_GUTTER;
      rightBound = W - leftBound;
      if (gameState === 'playing') initGame();
    });
    // --- イベントリスナ登録ここまで ---

    showStartOverlay();
    requestAnimationFrame(loop);
  }

  // プレイヤークラス
  class Player {
    constructor(x, img, dirRight) {
      this.x    = x;
      this.y    = H / 2;
      this.img  = img;
      this.dir  = dirRight ? 1 : -1;
      this.w    = 30;
      this.h    = 30;

      this.kbUp = this.kbDown = false;
      this.gpUp = this.gpDown = false;
      this.touchUp = this.touchDown = false;
      this.up = this.down = false;
      this.curveLeft = this.curveRight = false;
      this.ball = null;
    }

    update() {
      this.up   = this.kbUp   || this.gpUp   || this.touchUp;
      this.down = this.kbDown || this.gpDown || this.touchDown;

      if (this.dir > 0) {
        this.curveLeft  = this.up;
        this.curveRight = this.down;
      } else {
        this.curveLeft  = this.down;
        this.curveRight = this.up;
      }

      if (this.up)   this.y = Math.max(this.h/2,    this.y - PLAYER_SPEED);
      if (this.down) this.y = Math.min(H - this.h/2, this.y + PLAYER_SPEED);

      if (!this.ball) this.fireBall();
    }

    draw() {
      if (!this.img.complete) return;
      ctx.drawImage(
        this.img,
        this.x - this.w/2, this.y - this.h/2,
        this.w, this.h
      );
    }

    fireBall() {
      var angle = this.dir > 0 ? 0 : Math.PI;
      var color = this.dir > 0 ? 'grey' : 'green';
      this.ball = new Ball(
        this.x + this.dir * (this.w/2 + 10),
        this.y,
        angle,
        color,
        this.dir
      );
      balls.push(this.ball);
    }
  }

  // 敵クラス
  class Enemy {
    constructor() {
      this.x = rightBound - 20;
      this.y = Math.random() * (H - 60) + 30;
      this.w = 40;
      this.h = 40;
      this.vy           = ENEMY_SPEED;
      this.nextTurn     = performance.now() + this._randInterval();
      this.lastFire     = performance.now();
      this.fireInterval = 1000 + Math.random() * 2000;
    }

    _randInterval() {
      return 1500 + Math.random() * 2500;
    }

    update() {
      var now = performance.now();
      this.y += this.vy;
      if (this.y < this.h/2 || this.y > H - this.h/2 || now > this.nextTurn) {
        this.vy *= -1;
        this.nextTurn = now + this._randInterval();
      }
      if (now - this.lastFire > this.fireInterval) {
        balls.push(new Ball(
          this.x - this.w/2 - 10,
          this.y,
          Math.PI,
          'red',
          -1
        ));
        this.lastFire     = now;
        this.fireInterval = 1000 + Math.random() * 2000;
      }
    }

    draw() {
      if (!img3.complete) return;
      ctx.drawImage(
        img3,
        this.x - this.w/2, this.y - this.h/2,
        this.w, this.h
      );
    }
  }

  // ボールクラス
  class Ball {
    constructor(x, y, angle, color, dir) {
      this.x     = x;
      this.y     = y;
      this.angle = angle;
      this.color = color;
      this.dir   = dir;
      this.speed = BALL_SPEED;
    }

    update() {
      var ctrl = this.dir > 0 ? player1 : player2;
      if (ctrl) {
        if (ctrl.curveLeft)  this.angle -= CURVE_RATE;
        if (ctrl.curveRight) this.angle += CURVE_RATE;
      }
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    destroy() {
      if (this === player1.ball) player1.ball = null;
      if (this === player2?.ball) player2.ball = null;
    }
  }

  // ドットクラス
  class Dot {
    constructor() {
      this.x = Math.random() * (rightBound - leftBound - 100) + (leftBound + 50);
      this.y = Math.random() * (H - 100) + 50;
      this.r = 6;
    }
    draw() {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ゲーム初期化
  function initGame() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    leftBound  = CONTROL_MARGIN + CONTROL_WIDTH + STAGE_GUTTER;
    rightBound = W - leftBound;

    player1 = new Player(leftBound + 20, img1, true);
    if (mode === '2p') {
      player2 = new Player(rightBound - 20, img2, false);
    } else {
      player2 = null;
    }

    updateControlsUI();
    resetStage();
  }

  // ステージリセット
  function resetStage() {
    enemies = [];
    dots    = [];
    balls   = [];

    if (mode === 'cpu') {
      for (var i = 0; i < stage; i++) {
        enemies.push(new Enemy());
      }
    }
    for (var j = 0; j < 10; j++) {
      dots.push(new Dot());
    }

    player1.y    = H / 2;
    player1.ball = null;
    if (player2) {
      player2.y    = H / 2;
      player2.ball = null;
    }

    updateControlsUI();
  }

  // 衝突判定
  function collisionCheck() {
    var survivors = [];
    balls.forEach(function(b) {
      // 画面外
      if (b.x < leftBound || b.x > rightBound || b.y < 0 || b.y > H) {
        b.destroy();
        return;
      }

      // ドットヒット
      for (var di = 0; di < dots.length; di++) {
        var d = dots[di],
            dx = b.x - d.x,
            dy = b.y - d.y;
        if (dx*dx + dy*dy < (d.r + 6)*(d.r + 6)) {
          dots.splice(di, 1);
          b.destroy();
          return;
        }
      }

      // CPUモード：敵ヒット
      if (mode === 'cpu' && b.color === 'grey') {
        for (var ei = 0; ei < enemies.length; ei++) {
          var e = enemies[ei],
              ex = b.x - e.x,
              ey = b.y - e.y;
          if (ex*ex + ey*ey < (e.w/2 + 6)*(e.w/2 + 6)) {
            enemies.splice(ei, 1);
            player1.ball = null;
            if (enemies.length === 0) showStageOverlay();
            return;
          }
        }
      }

      // 1P被弾
      if (b.color === 'red' || b.color === 'green') {
        var dx1 = b.x - player1.x,
            dy1 = b.y - player1.y;
        if (dx1*dx1 + dy1*dy1 < (player1.w/2 + 6)*(player1.w/2 + 6)) {
          b.destroy();
          showResultOverlay(
            b.color === 'red'
              ? 'コンティニュー　再スタート'
              : '2P勝利◆◆再戦する',
            function() {
              if (b.color === 'green') {
                stage = 1;
                initGame();
              } else {
                resetStage();
              }
            }
          );
          return;
        }
      }

      // 2P被弾
      if (mode === '2p' && player2 && b.color === 'grey') {
        var dx2 = b.x - player2.x,
            dy2 = b.y - player2.y;
        if (dx2*dx2 + dy2*dy2 < (player2.w/2 + 6)*(player2.w/2 + 6)) {
          b.destroy();
          showResultOverlay('1P勝利◆再戦する', function() {
            stage = 1;
            initGame();
          });
          return;
        }
      }

      survivors.push(b);
    });
    balls = survivors;
  }

  // オーバーレイ：スタート
  function showStartOverlay() {
    overlay.innerHTML =
      'よこ画面<br>' +
      '左側タップ or ← で vs COM<br>' +
      '右側タップ or → で vs 2P';
    overlay.style.visibility = 'visible';
    gameState   = 'start';
    overlayType = 'start';
  }

  // オーバーレイ：ステージクリア
  function showStageOverlay() {
    stage++;
    overlay.innerHTML = '大勝利☆ 次の海域へ：' + stage + '<br>Press Enter or Space key ';
    overlay.style.visibility = 'visible';
    gameState   = 'overlay';
    overlayType = 'stage';
  }

  // オーバーレイ：リザルト
  function showResultOverlay(text, cb) {
    overlay.innerHTML = text;
    overlay.style.visibility = 'visible';
    gameState   = 'overlay';
    overlayType = 'result';
    overlayCb   = cb;
  }

  // モード選択
  function selectMode(sel) {
    mode = sel;
    overlay.style.visibility = 'hidden';
    gameState = 'playing';
    initGame();
  }

  // メインループ
  function loop(ts) {
    if (!lastTime) lastTime = ts;
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    var gp1  = pads[0];

    // スタート画面：ゲームパッド左右でモード選択
    if (gameState === 'start' && gp1) {
      if (gp1.buttons[GP.LEFT]?.pressed)  selectMode('cpu');
      if (gp1.buttons[GP.RIGHT]?.pressed) selectMode('2p');
    }

    // オーバーレイ画面：A/X/START で再開
    if (gameState === 'overlay' && gp1) {
      if (
        gp1.buttons[GP.A]?.pressed ||
        gp1.buttons[GP.X]?.pressed ||
        gp1.buttons[GP.START]?.pressed
      ) {
        overlay.style.visibility = 'hidden';
        gameState = 'playing';
        if (overlayCb) {
          overlayCb();
          overlayCb = null;
        } else {
          resetStage();
        }
      }
    }

    if (gameState === 'playing') {
      // 1P ゲームパッド入力
      if (gp1) {
        player1.gpUp   = gp1.buttons[GP.UP]?.pressed   || gp1.axes[1] <  -AXIS_THRESHOLD;
        player1.gpDown = gp1.buttons[GP.DOWN]?.pressed || gp1.axes[1] >   AXIS_THRESHOLD;
      } else {
        player1.gpUp = player1.gpDown = false;
      }

      // 2P ゲームパッド入力
      var gp2 = pads[1];
      if (mode === '2p' && gp2 && player2) {
        player2.gpUp   = gp2.buttons[GP.UP]?.pressed   || gp2.axes[1] <  -AXIS_THRESHOLD;
        player2.gpDown = gp2.buttons[GP.DOWN]?.pressed || gp2.axes[1] >   AXIS_THRESHOLD;
      } else if (player2) {
        player2.gpUp = player2.gpDown = false;
      }

      // 更新
      player1.update();
      if (player2) player2.update();
      enemies.forEach(e => e.update());
      balls.forEach(b => b.update());
      collisionCheck();

      // 描画
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => d.draw());
      enemies.forEach(e => e.draw());
      balls.forEach(b => b.draw());
      player1.draw();
      if (player2) player2.draw();
    }

    lastTime = ts;
    requestAnimationFrame(loop);
  }

  // 初回呼び出し
  requestAnimationFrame(loop);
})();