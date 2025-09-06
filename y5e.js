const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 設定 ---
// 質問リスト（ここを編集して質問を自由に追加・変更できます）
const questions = [
    "0日婚　アリ？　ナシ？",
    "相性がいいなと思うところは？",
    "相手のいい所　トップ３は？",
    "相手が誕生日を忘れてた　どうする？",
    "愛したい？　愛されたい？",
    "「愛されてるな」と感じる瞬間☆",
    "アイドル　誰がタイプ？",
    "アウトドア派　インドア派",
    "朝　ごはん派？　パン派？",
    "アツい人 クールな人　付き合うなら？",
    "アップデートしてほしい物☆",
    "会っていない日は、どんな一日？",
    "甘えたい派？　甘えられたい派？",
    "言えない秘密　ある？",
    "家にほしい物は？",
    "意外だったことは？",
    "笑ったエピソードは？",
    "一回だけ、どんな仕事してみたい？",
    "今までで一番の大喧嘩の原因は？",
    "一番うれしかったこと☆",
    "一番楽しかったこと☆",
    "一番びっくりしたこと☆",
    "一番大事なことは？",
    "一番思い出に残っているのは☆",
    "一番印象に残っていることは？",
    "一緒にいて、安らぐ時は？",
    "一緒に見てみたい絶景は？",
    "一緒にしたいことは？",
    "犬　猫　どっち好き？",
    "今まで、何回告白された？",
    "色にたとえると、相手は何色？",
    "癒される言葉は？",
    "癒される時は？",
    "言ってほしい事は？",
    "言われてみたい呼び方は？",
    "言われてみたい言葉☆",
    "うどんに、入れたい物☆",
    "浮気現場を見かけた、どうする？",
    "浮気は許せる？",
    "遠距離恋愛できる？",
    "追いかけたい？　追いかけられたい？",
    "お金　自分の時間　どっちを重視？",
    "お酒はよく飲むほう？",
    "お酒につよい？　よわい？",
    "お風呂は一緒に？ 別がいい？",
    "教えてほしいこと☆",
    "驚いたことを教えて☆",
    "お弁当、好きなおかずは☆",
    "おもちゃ　何もってた？",
    "思い立ったらすぐ行動する人？",
    "おそろいの物、持ちたい派？",
    "同じ人に、2回告白された事ある？",
    "同じ人に、2回告白した事ある？",
    "外見がタイプじゃない 付き合える？",
    "外見　どれくらい重視？",
    "蛙化現象になったことある？",
    "家事はする？",
    "学生時代の部活は？",
    "学生時代の恋愛エピソード☆",
    "家族になんでも話すタイプ？",
    "家族の思い出、教えて",
    "家族の誰に似ている？",
    "家族はどんな人？",
    "かわいいのは、特にどんな時？",
    "漢字で相手をあらわすと？",
    "感動したこと、教えて",
    "機嫌が悪い時は、放っておいてほしい？",
    "記念日はお祝いしたい？",
    "キュンとする時は？",
    "クリスマス、何したい？",
    "グッとくるハグの仕方は？",
    "グッとくる仕草は？",
    "芸能人に1日だけなれるなら、誰？",
    "ゲームソフト　面白かったのは？",
    "健康に気をつけている事は？",
    "恋人が海外転勤、どうする？",
    "恋人にされてうれしかった事☆",
    "恋人にされたくないことは？",
    "心掛けていることは？",
    "結婚願望はある？",
    "結婚前に同棲したい？",
    "結婚は何歳までにしたい？",
    "天然ボケの人　用心深い人　付き合うなら？",
    "毎日会いたがる人　月1回の人　付き合うなら？",
    "自分だけに優しい　皆に優しい　付き合うなら？",
    "嫉妬する人　無関心な人　付き合うなら？",
    "つくしたい？　つくされたい？",
    "結婚前、どれくらいの期間が理想？",
    "現実逃避したいとき、何する？",
    "理想の休日の過ごし方は",
    "声、どんなトーンが好き？",
    "恋人がそっけないときどうする？",
    "恋人に依存する？",
    "子どもの頃、憧れたものは？",
    "子どもの頃、どんな事してた？",
    "子どもの頃、好きだったものは？",
    "好みではない服の系統は？",
    "米 パン うどん パスタ 好きな順",
    "お米と一緒に食べるなら？",
    "お化け屋敷は、平気？",
    "お笑い芸人、誰好き？",
    "顔がタイプじゃない性格合う人　付き合う？",
    "自分が、仮装するなら？",
    "相手に仮装してほしいもの☆",
    "キュンとくる仕草☆",
    "クイズは好きなほう？",
    "芸能人　誰がタイプ？",
    "激辛料理いける？",
    "ケーキ　一番好きなのは？",
    "後悔してることある？",
    "香水はアリ？　ナシ？",
    "交際期間　最短記録は？",
    "断った人数は？",
    "コーヒー好き？",
    "ゴーヤ　好き？",
    "寂しくなるタイミング",
    "ぶっちゃけ、寂しがりや？",
    "最近うれしかったこと☆",
    "最近 なくしたものは？",
    "最後の晩餐　何食べたい？",
    "最初にいいなと思った理由は？",
    "自分へのサプライズ計画を知った どうする？",
    "幸せだと思う瞬間は？",
    "時間がたっぷり　何したい？",
    "時間が止まった世界　何する？",
    "実は○○なんです",
    "小学生　どんなキャラだった？",
    "小学校で、得意なものは？",
    "小学校、好きになったの何人？",
    "初日で付き合う　アリ？　ナシ？",
    "実はオタクな趣味がある？",
    "ジブリ作品と言えば？",
    "自分から告白する？",
    "自分自身の幸せとは？",
    "自分自身は、慎重な人？",
    "自分のチャームポイント☆",
    "将来 住みたい場所は？",
    "一度、住みたい都道府県は？",
    "寝室は一緒？　別がいい？",
    "人生の格言☆",
    "人生の目標は？",
    "好きバレしたことある？",
    "束縛する？ されたい？",
    "最長 何年付き合った？",
    "好きなアイドルは？",
    "好きなアイス",
    "好きなアーティストは？",
    "好きなマンガやアニメは？",
    "好きな異性の服装は？",
    "好きなお菓子☆",
    "好きな駄菓子☆",
    "好きな和菓子☆",
    "好きな洋菓子☆",
    "好きな家事は？",
    "好きな髪型☆",
    "好きな季節☆",
    "好きな食べ物は？",
    "好きな手料理は？",
    "好きな果物は？",
    "好きな仕草は？",
    "好きなスポーツは？",
    "好きなテレビ番組は？",
    "好きな服の系統は？",
    "好きな本は？",
    "好きな小動物☆",
    "好きな大型動物☆",
    "好きなところは？",
    "好きなパーツは？",
    "好きな人に恋人がいたらどうする？",
    "好きな人が親友と同じ人　どうする？",
    "好きな飲み物",
    "好きな料理",
    "好きな野菜☆",
    "ストレス解消方法は？",
    "素直に言えないことは？",
    "自分自身は、貯金してるほう？",
    "性格、どれくらい重視？",
    "せめたい、せめられたい？",
    "尊敬しているところは？",
    "男女の友情　アリ？　ナシ？",
    "小さい頃　勘違いしていたこと☆",
    "小さな頃　何が怖かった？",
    "小さい頃　何になりたかった？",
    "第一印象は？",
    "第一印象と違ったところは？",
    "大事にしている物は？",
    "大切にしている価値観は？",
    "タイプの人と初デート　どこまでアリ？",
    "タイムマシンがあったら　何する？",
    "宝くじ1億円当選　どうする？",
    "ダメンズ（ダメな女性）と　付き合える？",
    "小さな願いは？",
    "小さな夢を教えて☆",
    "チャレンジしてみたい事☆",
    "友達の恋人を好きになった　どうする？",
    "友達の恋人から告白された　どうする？",
    "友達の元カレ（元カノ）から告白　どうする？",
    "寝ぼうで遅刻、何分まで許せる？",
    "朝食、何たべた？",
    "中学生　どんなキャラだった？",
    "中学校で、得意なものは？",
    "中学校、好きになったの何人？",
    "挑戦してみたいものは？",
    "付き合う前、どんなアピールする？",
    "付き合った人数は？",
    "付き合った最長年数は？",
    "付き合ってから、新たな一面は？",
    "付き合って、すぐ同棲したい？",
    "伝えたい想いは？",
    "伝えたい言葉は？",
    "作ってあげたい料理は？",
    "作ってほしい料理は？",
    "デザートで一番好きな物は？",
    "デートで、楽しかった場所は？",
    "デートの思い出は？",
    "デート中にされたい行動は？",
    "デート中にされるとイヤな行動は？",
    "透明人間になった　何したい？",
    "ドキドキしない性格合う人　付き合う？",
    "ドキドキしたデートは？",
    "読書、一年に何冊よむ？",
    "読書、記憶に残っている本☆",
    "どこでもドア1回だけ。どこ行く？",
    "年上 年下 と付き合った事ある？",
    "友達と遊ぶ前日、恋人から明日会おう　どうする？",
    "友達とわりとよく遊ぶ？",
    "友達は3人くらい？",
    "とりあえず行動する人？",
    "どんな性格が好き？",
    "相手を動物に例えると？",
    "同棲して許せないと思った　それは何？",
    "童話といえば？",
    "ドキドキするスキンシップは？",
    "得意なことは？",
    "登山した山は？",
    "どんなデートをしてみたい？",
    "どんな人がタイプ？",
    "仲直りしたい、どうする？",
    "仲直りのコツは？",
    "鍋と言えば？",
    "何才から記憶ある？",
    "恋人　何才から何才までOK？",
    "恋人が高い物ばかり買う どうする？",
    "恋人が海外転勤　何年待てる？",
    "今まで、何才差が最大？",
    "今、悩んでいることは？",
    "以前、悩んでいたことは？",
    "習い事、何してた？",
    "金持ちで孤独　貧乏な人気者　なるなら？　",
    "長く付き合う秘訣とは？",
    "何フェチ？",
    "苦手な家事は？",
    "苦手な季節は？",
    "苦手な人のタイプは？",
    "苦手な食べ物は？",
    "苦手な飲みものは？",
    "苦手な動物は？",
    "肉まん系（あんカレーピザ）一番は？",
    "好きになれるか不明　付き合う？",
    "性格合わない顔タイプ　付き合う？",
    "日常生活で苦手なことは？",
    "似てる　と言われた事ある？",
    "なおしてほしい所、しいて言うと？",
    "何されたい？",
    "何してあげたい？",
    "上下、何才差まで付き合える？",
    "パスタの好きなメニューは",
    "初恋の相手は？",
    "初恋の相手との思い出、エピソード",
    "パン、どれが好き？",
    "ひとりの時間はどれくらい必要？",
    "復縁したくなったのは、何才のとき？",
    "復縁した経験　ある？",
    "プレゼントと同じ物もってる 正直に言う？",
    "ペアルックしたい？",
    "方言がある異性は、どう思う？",
    "ジェットコースター好き？",
    "食パン、何をぬる？",
    "サンドイッチ　好きな具材は？",
    "第一印象と違うと言われる？",
    "寝顔を見て　どう思った？",
    "初めて「いいな」と思った時",
    "初めて会った印象は？",
    "初恋はいつ?",
    "初の恋人は何才のとき?",
    "花はプレゼントにほしい？",
    "反抗期はあった？",
    "びっくりされたことは？",
    "びっくりしたこと",
    "一目惚れされたの何回？",
    "一目惚れしたこと、何回？",
    "一人でレストランに行ける？",
    "一人旅行できる？",
    "一人焼き肉できる？",
    "秘密にしている事、何個？",
    "ピーマン嫌いだった？",
    "ビールの味　おいしい？",
    "二人の共通点は何？",
    "部屋は、きれいなほう？",
    "変顔してみよう☆",
    "魔法が使えたら、何する？",
    "自分は、マメだと思う？",
    "漫画　おもしろかったのは☆",
    "漫画といえば？",
    "見たい夢は？",
    "虫は苦手なほう？",
    "二択　無人島生活　山奥で一人生活",
    "自分自身がムッとしたときの対処法は？",
    "猛アプローチされたことある？",
    "モテ期はいつ？",
    "元恋人からたまにメッセージくる？",
    "元恋人と友達　アリ？　ナシ？",
    "物忘れ、よくする？",
    "妄想することある？",
    "やきもち妬く？どんな時に？",
    "やきもきした時、どうする？",
    "野菜　苦手なものは？",
    "優しさを感じない行動は？",
    "優しさを感じる時は",
    "やらないほうがよかった事は",
    "やったほうがいいこと教えて☆",
    "譲れない恋人の条件☆",
    "譲れない結婚条件☆",
    "LINEで告白　アリ？",
    "ラブレター書いたのいつ?",
    "ラブレターもらったことある？",
    "ラーメン、何味が好き？",
    "理想の家族像☆",
    "理想は高いほう？",
    "ルーティン教えて☆",
    "ぶっちゃけ、連絡減らしてほしい？",
    "連絡もっとほしい？",
    "老後、都会と田舎どっちに住む？",
    "わさび　食べれる？",];
const CARD_IMAGES             = ['/images/zjump1.png', '/images/zjump2.png', '/images/zjump3.png', '/images/zjump4.png'];
const STAGE_COLOR             = '#ffefff';
const CARD_ROWS               = 3;
const CARD_COLS               = 4;
const TOTAL_CARDS             = CARD_ROWS * CARD_COLS;
const QUESTION_DISPLAY_TIME   = 6200;  // ms
const TURN_CHANGE_DISPLAY_TIME= 800;  // ms

// --- グローバル変数 ---
let gameState      = 'loading';  // loading, title, game, question, turnChange, gameOver
let gameMode       = 1;          // 1人 or 2人
let currentPlayer  = 1;
let cards          = [];
let cardImages     = [];
let currentQuestion= '';
let timer          = 0;
let cursor         = { row: 0, col: 0, player: 1 };

// --- 初期化 ---
function init() {
  // フルスクリーン化
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.margin  = '0';
  canvas.style.display = 'block';

  // 画像読み込み
  let loadedCount = 0;
  cardImages = [];
  CARD_IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === CARD_IMAGES.length) {
        gameState = 'title';
      }
    };
    cardImages.push(img);
  });

  setupEventListeners();
  gameLoop();
}

// --- ゲームループ ---
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// --- 更新処理 ---
function update() {
  const now = Date.now();
  if ((gameState === 'question' || gameState === 'turnChange') && now < timer) {
    return;
  }

  switch (gameState) {
    case 'question':
      // アクティブなカードだけ残す
      cards = cards.filter(c => c.active);
      if (cards.length === 0) {
        gameState = 'gameOver';
      } else if (gameMode === 2) {
        gameState = 'turnChange';
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        cursor.player = currentPlayer;
        timer = now + TURN_CHANGE_DISPLAY_TIME;
      } else {
        gameState = 'game';
      }
      break;

    case 'turnChange':
      gameState = 'game';
      break;
  }
}

// --- 描画処理 ---
function draw() {
  ctx.fillStyle = STAGE_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  switch (gameState) {
    case 'loading':
      drawText('よこ画面用', canvas.width/2, canvas.height/2, 40);
      break;
    case 'title':
      drawTitleScreen();
      break;
    case 'game':
      drawCards();
      drawCursor();
      break;
    case 'question':
      drawText(currentQuestion, canvas.width/2, canvas.height/2, 50);
      break;
    case 'turnChange':
      drawCards();
      drawText('交代', canvas.width/2, canvas.height/2, 60);
      break;
    case 'gameOver':
      drawText('おしまい\nタップ（クリック）で再スタート', canvas.width/2, canvas.height/2, 60);
      break;
  }
}

// --- 各画面描画 ---
function drawTitleScreen() {
  drawText('カップル盛り上がる質問300ゲーム', canvas.width/2, canvas.height*0.3, 35);
  drawText('1人用 デートの練習', canvas.width*0.25, canvas.height*0.7, 25);
  drawText('2人用',        canvas.width*0.75, canvas.height*0.7, 25);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(canvas.width/2, 0, 2, canvas.height);
}

function drawCards() {
  cards.forEach(card => {
    if (card.active) {
      ctx.drawImage(card.img, card.x, card.y, card.width, card.height);
    }
  });
}

function drawCursor() {
  const card = getCardAtCursor();
  if (!card) return;
  ctx.strokeStyle = currentPlayer === 1 ? 'gold' : 'violet';
  ctx.lineWidth   = 5;
  ctx.strokeRect(card.x, card.y, card.width, card.height);
}

// --- テキスト描画ヘルパー ---
function drawText(text, x, y, size, color = 'black', maxWidthRatio = 0.8) {
  ctx.fillStyle    = color;
  ctx.font         = `bold ${size}px 'MS Gothic', sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  const lines      = text.split('\n');
  const lh         = size * 1.2;
  lines.forEach((line, i) => {
    const oy = y - ((lines.length-1)*lh/2) + i*lh;
    ctx.fillText(line, x, oy, canvas.width * maxWidthRatio);
  });
}

// --- ゲーム開始 ---
function startGame(mode) {
  gameMode      = mode;
  currentPlayer = 1;
  cursor        = { row: 0, col: 0, player: 1 };
  cards         = [];

  // カードデッキ生成＋シャッフル
  const cardDeck = [];
  for (let i = 0; i < TOTAL_CARDS; i++) {
    cardDeck.push(cardImages[i % cardImages.length]);
  }
  for (let i = cardDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
  }

  // 配置計算
  const mX = canvas.width  * 0.05;
  const mY = canvas.height * 0.05;
  const aW = canvas.width  - mX*2;
  const aH = canvas.height - mY*2;
  const cw = aW / CARD_COLS;
  const ch = aH / CARD_ROWS;

  for (let r = 0; r < CARD_ROWS; r++) {
    for (let c = 0; c < CARD_COLS; c++) {
      cards.push({
        x      : mX + c*cw + cw*0.05,
        y      : mY + r*ch + ch*0.05,
        width  : cw * 0.9,
        height : ch * 0.9,
        row    : r,
        col    : c,
        img    : cardDeck.pop(),
        active : true
      });
    }
  }

  gameState = 'game';
}

// --- カード選択 ---
function selectCard(card) {
  if (!card || !card.active) return;
  card.active     = false;
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  gameState       = 'question';
  timer           = Date.now() + QUESTION_DISPLAY_TIME;
}

// --- カード取得ヘルパー ---
function getCardAtCursor() {
  return getCardByPosition(cursor.row, cursor.col);
}
function getCardByPosition(row, col) {
  return cards.find(c => c.row === row && c.col === col && c.active);
}

// --- カーソル移動（空きマスをスキップ） ---
function moveCursorVertical(delta) {
  for (let i = 1; i <= CARD_ROWS; i++) {
    const nr = (cursor.row + delta * i + CARD_ROWS) % CARD_ROWS;
    if (getCardByPosition(nr, cursor.col)) {
      cursor.row = nr;
      break;
    }
  }
}
function moveCursorHorizontal(delta) {
  for (let i = 1; i <= CARD_COLS; i++) {
    const nc = (cursor.col + delta * i + CARD_COLS) % CARD_COLS;
    if (getCardByPosition(cursor.row, nc)) {
      cursor.col = nc;
      break;
    }
  }
}

// --- イベントリスナ設定 ---
function setupEventListeners() {
  window.addEventListener('resize', init);
  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    handleClick(e.touches[0]);
  });
  window.addEventListener('keydown', handleKeyDown);
}

// --- クリック／タップ処理 ---
function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x    = e.clientX - rect.left;
  const y    = e.clientY - rect.top;

  switch (gameState) {
    case 'title':
      startGame(x < canvas.width/2 ? 1 : 2);
      break;
    case 'game':
      const clicked = cards.find(c =>
        c.active &&
        x > c.x && x < c.x + c.width &&
        y > c.y && y < c.y + c.height
      );
      if (clicked) {
        cursor.row = clicked.row;
        cursor.col = clicked.col;
        selectCard(clicked);
      }
      break;
    case 'gameOver':
      gameState = 'title';
      break;
  }
}

// --- キーボード操作処理 ---
function handleKeyDown(e) {
  if (gameState !== 'game' && gameState !== 'gameOver') return;
  e.preventDefault();

  if (gameState === 'gameOver') {
    if (['Enter',' '].includes(e.key)) {
      gameState = 'title';
    }
    return;
  }

  // プレイヤーごとに移動
  if (currentPlayer === 1) {
    if (['w','ArrowUp'].includes(e.key))    moveCursorVertical(-1);
    if (['s','ArrowDown'].includes(e.key))  moveCursorVertical(1);
    if (['a','ArrowLeft'].includes(e.key))  moveCursorHorizontal(-1);
    if (['d','ArrowRight'].includes(e.key)) moveCursorHorizontal(1);
  } else {
    if (e.key === '8') moveCursorVertical(-1);
    if (e.key === '5') moveCursorVertical(1);
    if (e.key === '4') moveCursorHorizontal(-1);
    if (e.key === '6') moveCursorHorizontal(1);
  }

  if (['Enter',' '].includes(e.key)) {
    selectCard(getCardAtCursor());
  }
}

// --- ゲーム起動 ---
init();
