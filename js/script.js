const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fuelDisplay = document.getElementById('fuel');
const durabilityDisplay = document.getElementById('durability');
const distanceDisplay = document.getElementById('distance');
const startButton = document.getElementById('startButton');

// --- 画像の定義とロード ---
const images = {};
const imagePaths = {
    playerCar: 'zcar1.jpg',
    enemyCar: 'zcar2.jpg',
    fuelItem: 'zcar3.jpg',
    repairItem: 'zcar4.jpg'
};
let imagesLoadedCount = 0;
const totalImages = Object.keys(imagePaths).length;

function loadImages() {
    for (const key in imagePaths) {
        images[key] = new Image();
        images[key].src = imagePaths[key];
        images[key].onload = () => {
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImages) {
                console.log('All images loaded!');
                // 全ての画像がロードされたらゲームを開始可能にするなどの処理
                // ここでは特に何もしませんが、必要であればstartButtonを有効にするなど
            }
        };
        images[key].onerror = () => {
            console.error(`Failed to load image: ${imagePaths[key]}`);
            // 画像のロード失敗時のエラーハンドリング
        };
    }
}
// --- 画像の定義とロード終了 ---


// ゲームの状態
let gameRunning = false;
let animationFrameId;

// プレイヤーの車
const playerCar = {
    x: canvas.width / 2, // 中心に配置
    y: canvas.height - 100,
    width: 40, // 少し小さく調整
    height: 70, // 少し小さく調整
    speed: 0,
    maxSpeed: 8, // 最大速度
    acceleration: 0.2, // 加速量
    deceleration: 0.1, // 減速量
    turnSpeed: 0.05, // ハンドル操作の速度 (ラジアン)
    angle: -Math.PI / 2, // 初期角度 (上向き)
    maxFuel: 100,
    fuel: 100,
    fuelConsumptionRate: 0.05, // 1フレームあたりの燃料消費量
    maxDurability: 100,
    durability: 100,
    collisionDamage: 25, // 衝突時のダメージを少し上げる
    // color: 'blue' // 画像を使うためコメントアウトまたは削除
};

// 敵の車
const enemyCars = [];
const maxEnemyCars = 7; // 同時に存在する敵の数を増やす
const enemyBaseSpeed = 2;
const enemySpawnInterval = 90; // フレーム数 (少し頻度を上げる)
let enemySpawnCounter = 0;

// アイテム (燃料、修理キット)
const items = [];
const itemSpawnInterval = 250; // フレーム数 (少し頻度を上げる)
let itemSpawnCounter = 0;
const itemSize = 25; // アイテムサイズを少し小さく

// ゲームデータ
let distance = 0;
// 距離の計算はプレイヤーの速度に依存するように変更

// キー入力の状態
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// イベントリスナー
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

startButton.addEventListener('click', startGame);

// ゲームの初期化
function initializeGame() {
    playerCar.x = canvas.width / 2;
    playerCar.y = canvas.height - 100;
    playerCar.speed = 0;
    playerCar.angle = -Math.PI / 2;
    playerCar.fuel = playerCar.maxFuel;
    playerCar.durability = playerCar.maxDurability;
    distance = 0;
    enemyCars.length = 0;
    items.length = 0;
    enemySpawnCounter = 0;
    itemSpawnCounter = 0;
    updateStatus();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameRunning = false;
    startButton.textContent = 'スタート';
}

// ゲーム開始
function startGame() {
    if (gameRunning) {
        initializeGame(); // ゲーム中にスタートボタンを押したらリスタート
    } else {
        // 全ての画像がロードされているか確認
        if (imagesLoadedCount !== totalImages) {
            alert('画像をロード中です。しばらくお待ちください...');
            return;
        }
        gameRunning = true;
        startButton.textContent = 'リスタート';
        gameLoop();
    }
}

// ステータス表示の更新
function updateStatus() {
    fuelDisplay.textContent = playerCar.fuel.toFixed(0);
    durabilityDisplay.textContent = playerCar.durability.toFixed(0);
    distanceDisplay.textContent = distance.toFixed(0);
}

// 描画処理
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア

    // プレイヤーの車を描画 (回転を考慮)
    ctx.save(); // 現在の描画状態を保存
    ctx.translate(playerCar.x, playerCar.y); // 車の中心に原点を移動
    ctx.rotate(playerCar.angle + Math.PI / 2); // 車の向きに合わせて回転 (初期角度が-PI/2なので+PI/2して0にする)
    // ctx.fillStyle = playerCar.color; // 画像を使うためコメントアウト
    // ctx.fillRect(-playerCar.width / 2, -playerCar.height / 2, playerCar.width, playerCar.height); // 画像を使うためコメントアウト
    ctx.drawImage(images.playerCar, -playerCar.width / 2, -playerCar.height / 2, playerCar.width, playerCar.height);
    ctx.restore(); // 描画状態を元に戻す

    // 敵の車を描画
    // ctx.fillStyle = 'red'; // 画像を使うためコメントアウト
    enemyCars.forEach(car => {
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(car.angle + Math.PI / 2); // 敵車も回転させる
        // ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height); // 画像を使うためコメントアウト
        ctx.drawImage(images.enemyCar, -car.width / 2, -car.height / 2, car.width, car.height);
        ctx.restore();
    });

    // アイテムを描画
    items.forEach(item => {
        // ctx.fillStyle = item.type === 'fuel' ? 'lime' : 'orange'; // 画像を使うためコメントアウト
        // ctx.fillRect(item.x - item.size / 2, item.y - item.size / 2, item.size, item.size); // 画像を使うためコメントアウト
        const itemImage = item.type === 'fuel' ? images.fuelItem : images.repairItem;
        ctx.drawImage(itemImage, item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
    });
}

// プレイヤーの車の更新
function updatePlayerCar() {
    // ハンドル操作 (角度変更)
    if (keys.ArrowLeft) {
        playerCar.angle -= playerCar.turnSpeed;
    }
    if (keys.ArrowRight) {
        playerCar.angle += playerCar.turnSpeed;
    }

    // 加速・減速
    if (keys.ArrowUp) {
        playerCar.speed += playerCar.acceleration;
        if (playerCar.speed > playerCar.maxSpeed) playerCar.speed = playerCar.maxSpeed;
    } else if (keys.ArrowDown) {
        playerCar.speed -= playerCar.deceleration * 1.5; // バックは少し遅く
        if (playerCar.speed < -playerCar.maxSpeed / 2) playerCar.speed = -playerCar.maxSpeed / 2; // 後退の最大速度
    } else {
        // キーが押されていなければ自然に減速
        if (playerCar.speed > 0) {
            playerCar.speed -= playerCar.deceleration;
            if (playerCar.speed < 0) playerCar.speed = 0;
        } else if (playerCar.speed < 0) {
            playerCar.speed += playerCar.deceleration;
            if (playerCar.speed > 0) playerCar.speed = 0;
        }
    }

    // プレイヤーの移動 (角度と速度に基づいて)
    playerCar.x += playerCar.speed * Math.cos(playerCar.angle);
    playerCar.y += playerCar.speed * Math.sin(playerCar.angle);

    // 画面端での境界チェック
    if (playerCar.x - playerCar.width / 2 < 0) playerCar.x = playerCar.width / 2;
    if (playerCar.x + playerCar.width / 2 > canvas.width) playerCar.x = canvas.width - playerCar.width / 2;
    if (playerCar.y - playerCar.height / 2 < 0) playerCar.y = playerCar.height / 2;
    if (playerCar.y + playerCar.height / 2 > canvas.height) playerCar.y = canvas.height - playerCar.height / 2;

    // 燃料消費 (速度に応じて消費量を調整)
    playerCar.fuel -= playerCar.fuelConsumptionRate * (Math.abs(playerCar.speed) / playerCar.maxSpeed + 0.5); // 停車時も少し消費
    if (playerCar.fuel < 0) playerCar.fuel = 0;
}

// 敵の車の生成と更新
function updateEnemyCars() {
    enemySpawnCounter++;
    if (enemySpawnCounter >= enemySpawnInterval && enemyCars.length < maxEnemyCars) {
        let newEnemy = {};
        const spawnEdge = Math.floor(Math.random() * 3); // 0:上, 1:左, 2:右

        newEnemy.width = 50;
        newEnemy.height = 80;
        newEnemy.speed = enemyBaseSpeed + Math.random() * 2; // 速度にばらつき

        switch (spawnEdge) {
            case 0: // 上から出現
                newEnemy.x = Math.random() * (canvas.width - newEnemy.width) + newEnemy.width / 2;
                newEnemy.y = -newEnemy.height / 2;
                newEnemy.angle = Math.PI / 2; // 下向き
                break;
            case 1: // 左から出現
                newEnemy.x = -newEnemy.width / 2;
                newEnemy.y = Math.random() * (canvas.height - newEnemy.height) + newEnemy.height / 2;
                newEnemy.angle = 0; // 右向き
                break;
            case 2: // 右から出現
                newEnemy.x = canvas.width + newEnemy.width / 2;
                newEnemy.y = Math.random() * (canvas.height - newEnemy.height) + newEnemy.height / 2;
                newEnemy.angle = Math.PI; // 左向き
                break;
        }
        enemyCars.push(newEnemy);
        enemySpawnCounter = 0;
    }

    enemyCars.forEach((car, index) => {
        car.x += car.speed * Math.cos(car.angle);
        car.y += car.speed * Math.sin(car.angle);

        // 画面外に出たら削除 (どの方向から来ても対応できるように)
        if (car.x < -car.width * 2 || car.x > canvas.width + car.width * 2 ||
            car.y < -car.height * 2 || car.y > canvas.height + car.height * 2) {
            enemyCars.splice(index, 1);
        }
    });
}

// アイテムの生成と更新
function updateItems() {
    itemSpawnCounter++;
    if (itemSpawnCounter >= itemSpawnInterval) {
        const x = Math.random() * (canvas.width - itemSize * 2) + itemSize;
        const y = -itemSize; // 上から出現
        const type = Math.random() < 0.7 ? 'fuel' : 'repair'; // 70%の確率で燃料、30%で修理キット
        items.push({
            x: x,
            y: y,
            size: itemSize,
            speed: enemyBaseSpeed, // アイテムも落ちてくる
            type: type
        });
        itemSpawnCounter = 0;
    }

    items.forEach((item, index) => {
        item.y += item.speed;

        // 画面外に出たら削除
        if (item.y > canvas.height + item.size) {
            items.splice(index, 1);
        }
    });
}

// 衝突判定 (より正確な AABB: Axis-Aligned Bounding Box)
// 回転しているオブジェクトの正確な衝突判定は複雑になるため、
// 今回は中心座標と幅・高さから矩形を仮想的に作り判定します。
// 厳密な判定にはSeparating Axis Theorem (SAT)などが必要ですが、
// シミュレーションゲームとして動かすにはこれで十分でしょう。
function checkCollision(obj1, obj2) {
    // プレイヤーと敵の車の中心座標と幅・高さから仮想的な矩形を作成
    const r1x = obj1.x - obj1.width / 2;
    const r1y = obj1.y - obj1.height / 2;
    const r1w = obj1.width;
    const r1h = obj1.height;

    const r2x = obj2.x - obj2.width / 2;
    const r2y = obj2.y - obj2.height / 2;
    const r2w = obj2.width;
    const r2h = obj2.height;

    return r1x < r2x + r2w &&
           r1x + r1w > r2x &&
           r1y < r2y + r2h &&
           r1y + r1h > r2y;
}

// ゲームロジックの更新
function updateGameLogic() {
    updatePlayerCar();
    updateEnemyCars();
    updateItems();

    // 走行距離はプレイヤーの車の速度に比例させる
    distance += Math.abs(playerCar.speed) * 0.1; // 速度が速いほど距離が進む

    // プレイヤーと敵の車の衝突判定
    enemyCars.forEach((enemy, index) => {
        if (checkCollision(playerCar, enemy)) {
            playerCar.durability -= playerCar.collisionDamage;
            if (playerCar.durability < 0) playerCar.durability = 0;
            // 衝突後は敵も少し跳ね返るような動きを追加しても良い (今回は削除)
            enemyCars.splice(index, 1); // 衝突した敵は消す
        }
    });

    // プレイヤーとアイテムの衝突判定
    items.forEach((item, index) => {
        // アイテムは回転しないので、そのままのサイズで判定
        const itemRect = {x: item.x, y: item.y, width: item.size, height: item.size};
        // プレイヤーは中心座標で扱っているので、判定用の矩形を再計算
        const playerRect = {
            x: playerCar.x - playerCar.width / 2,
            y: playerCar.y - playerCar.height / 2,
            width: playerCar.width,
            height: playerCar.height
        };

        if (checkCollision(playerRect, itemRect)) {
            if (item.type === 'fuel') {
                playerCar.fuel = Math.min(playerCar.maxFuel, playerCar.fuel + 30); // 燃料回復
            } else { // 'repair'
                playerCar.durability = Math.min(playerCar.maxDurability, playerCar.durability + 25); // 耐久度回復
            }
            items.splice(index, 1); // 拾ったアイテムは消す
        }
    });

    updateStatus();

    // ゲームオーバー判定
    if (playerCar.fuel <= 0 || playerCar.durability <= 0) {
        endGame();
    }
}

// ゲーム終了
function endGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    alert(`ゲームオーバー！\n走行距離: ${distance.toFixed(0)} m`);
    startButton.textContent = 'リスタート'; // ボタンのテキストをリスタートに戻す
}

// ゲームループ
function gameLoop() {
    if (!gameRunning) return;

    updateGameLogic();
    draw();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// 最初の初期化
initializeGame();
// 画像のロードを開始
loadImages();
