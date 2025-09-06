// game.js
(() => {
  // ─── グローバル宣言 ───────────────────────────────────────────────
  let canvas, ctx, dpi;
  let state        = 'start';   // 'start' | 'running' | 'feedback' | 'complete'
  let players      = 1;         // 1 or 2
  let words        = [];
  let targets      = [];
  let solvedCount  = 0;
  let roundTotal   = 0;         // 今ラウンドの問題数
  let feedbackText = '';
  let feedbackTime = 0;
  let currentCard  = null;
  let score        = 0;

  const cardFiles = ['/images/zjump1.png','/images/zjump2.png','/images/zjump3.png','/images/zjump4.png'];
  const cards     = [];

  const bank = [
    { en: 'wine',  ja: 'ワイン' },
    { en: 'arrow',  ja: '矢' },
    { en: 'branch',  ja: '枝' },
    { en: 'taxi',  ja: 'タクシー' },
    { en: 'grape',  ja: 'ブドウ' },
    { en: 'snake',  ja: '蛇' },
    { en: 'statue',  ja: '像' },
    { en: 'brush',  ja: '筆' },
    { en: 'palace',  ja: '宮殿' },
    { en: 'London',  ja: 'ロンドン' },
    { en: 'zoo',  ja: '動物園' },
    { en: 'entrance',  ja: '入り口　入学' },
    { en: 'gym',  ja: '体育館' },
    { en: 'tower',  ja: '塔' },
    { en: 'Europe',  ja: 'ヨーロッパ' },
    { en: 'host',  ja: '主人' },
    { en: 'dad',  ja: 'お父ちゃん' },
    { en: 'elephant',  ja: '象' },
    { en: 'soup',  ja: 'スープ' },
    { en: 'tie',  ja: 'ネクタイ' },
    { en: 'fox',  ja: 'キツネ' },
    { en: 'jeans',  ja: 'ジーンズ' },
    { en: 'jam',  ja: '混雑　ジャム' },
    { en: 'suit',  ja: 'スーツ' },
    { en: 'ticket',  ja: '切符' },
    { en: 'Canada',  ja: 'カナダ' },
    { en: 'fence',  ja: '塀' },
    { en: 'England',  ja: 'イングランド' },
    { en: 'Asia',  ja: 'アジア' },
    { en: 'hall',  ja: '玄関の広間　廊下'},
    { en: 'forest',  ja: '森林' },
    { en: 'mom',  ja: 'おかあちゃん' },
    { en: 'engineer',  ja: 'エンジニア' },
    { en: 'policeman',  ja: '警官' },
    { en: 'toy',  ja: 'おもちゃ' },
    { en: 'umbrella',  ja: 'かさ' },
    { en: 'frog',  ja: 'カエル' },
    { en: 'bottle',  ja: 'びん' },
    { en: 'ink',  ja: 'インク' },
    { en: 'sofa',  ja: 'ソファー' },
    { en: 'bomb',  ja: '爆弾' },
    { en: 'China',  ja: '中国' },
    { en: 'desert',  ja: '砂漠' },
    { en: 'Australia',  ja: 'オーストラリア'},
    { en: 'beach',  ja: '砂浜' },
    { en: 'theater',  ja: '劇場' },
    { en: 'tent',  ja: 'テント' },
    { en: 'restaurant',  ja: 'レストラン' },
    { en: 'stranger',  ja: '見知らぬ人' },
    { en: 'driver',  ja: '運転手' },
    { en: 'enemy',  ja: '敵' },
    { en: 'husband',  ja: '夫' },
    { en: 'scientist',  ja: '科学者' },
    { en: 'bathroom',  ja: '浴室' },
    { en: 'runner',  ja: 'ランナー' },
    { en: 'artist',  ja: '芸術家' },
    { en: 'visitor',  ja: '訪問者' },
    { en: 'cousin',  ja: 'いとこ' },
    { en: 'sunset',  ja: '日没' },
    { en: 'trade',  ja: '貿易' },
    { en: 'match',  ja: '試合' },
    { en: 'death',  ja: '死' },
    { en: 'habit',  ja: '習慣' },
    { en: 'joy',  ja: '喜び' },
    { en: 'blood',  ja: '血' },
    { en: 'luck',  ja: '運' },
    { en: 'fishing',  ja: '魚釣り' },
    { en: 'president',  ja: '大統領' },
    { en: 'merchant',  ja: '商人' },
    { en: 'barber',  ja: '床屋' },
    { en: 'army',  ja: '陸軍' },
    { en: 'painter',  ja: '画家' },
    { en: 'reporter',  ja: 'レポーター'},
    { en: 'God',  ja: '神' },
    { en: 'century',  ja: '世紀' },
    { en: 'goal',  ja: '得点　ゴール' },
    { en: 'training',  ja: 'トレーニング'},
    { en: 'disease',  ja: '病気' },
    { en: 'tour',  ja: '小旅行' },
    { en: 'exam',  ja: '試験' },
    { en: 'flight',  ja: '飛行' },
    { en: 'film',  ja: '映画' },
    { en: 'mind',  ja: '精神' },
    { en: 'pain',  ja: '痛み' },
    { en: 'crowd',  ja: '群衆' },
    { en: 'guide',  ja: '案内人' },
    { en: 'queen',  ja: '女王' },
    { en: 'pal',  ja: '友だち' },
    { en: 'captain',  ja: '船長' },
    { en: 'neighbor',  ja: '隣人' },
    { en: 'prince',  ja: '王子' },
    { en: 'midnight',  ja: '真夜中' },
    { en: 'play',  ja: '劇' },
    { en: 'tear',  ja: '涙' },
    { en: 'concert',  ja: 'コンサート' },
    { en: 'action',  ja: '行動' },
    { en: 'festival',  ja: '祭り' },
    { en: 'pop',  ja: 'ポピュラー音楽' },
    { en: 'thought',  ja: '考え' },
    { en: 'promise',  ja: '約束' },
    { en: 'accident',  ja: '事故' },
    { en: 'custom',  ja: '習慣' },
    { en: 'waste',  ja: '浪費' },
    { en: 'use',  ja: '使用' },
    { en: 'reply',  ja: '返事' },
    { en: 'race',  ja: '競走　人種' },
    { en: 'stay',  ja: '滞在' },
    { en: 'valley',  ja: '谷' },
    { en: 'silver',  ja: '銀' },
    { en: 'heaven',  ja: '天' },
    { en: 'ocean',  ja: '大洋' },
    { en: 'soil',  ja: '土' },
    { en: 'billion',  ja: '10億' },
    { en: 'couple',  ja: '一対' },
    { en: 'area',  ja: '地域' },
    { en: 'calendar',  ja: 'カレンダー' },
    { en: 'signal',  ja: '信号' },
    { en: 'discussion',  ja: '討論' },
    { en: 'sign',  ja: '合図　標識' },
    { en: 'volleyball',  ja: 'バレーボール'},
    { en: 'answer',  ja: '答え' },
    { en: 'stop',  ja: '停留所' },
    { en: 'courage',  ja: '勇気' },
    { en: 'iron',  ja: '鉄' },
    { en: 'universe',  ja: '宇宙' },
    { en: 'silk',  ja: '絹' },
    { en: 'wave',  ja: '波' },
    { en: 'root',  ja: '根' },
    { en: 'smoke',  ja: '煙' },
    { en: 'course',  ja: '進路' },
    { en: 'shade',  ja: '陰' },
    { en: 'prize',  ja: '賞' },
    { en: 'list',  ja: 'リスト' },
    { en: 'page',  ja: 'ページ' },
    { en: 'report',  ja: '報告' },
    { en: 'step',  ja: '足元　階段' },
    { en: 'secret',  ja: '秘密' },
    { en: 'quiz',  ja: 'クイズ' },
    { en: 'care',  ja: '世話　管理' },
    { en: 'rush',  ja: '殺到' },
    { en: 'plant',  ja: '植物' },
    { en: 'gas',  ja: 'ガス' },
    { en: 'climate',  ja: '気候' },
    { en: 'jewel',  ja: '宝石' },
    { en: 'rainbow',  ja: '虹' },
    { en: 'weather',  ja: '天気' },
    { en: 'model',  ja: '模型' },
    { en: 'point',  ja: '点' },
    { en: 'railway',  ja: '鉄道' },
    { en: 'mark',  ja: '印' },
    { en: 'bowl',  ja: '鉢' },
    { en: 'lip',  ja: 'くちびる' },
    { en: 'net',  ja: '網' },
    { en: 'melon',  ja: 'メロン' },
    { en: 'poem',  ja: '詩' },
    { en: 'menu',  ja: 'メニュー' },
    { en: 'gram',  ja: 'グラム' },
    { en: 'cent',  ja: 'セント' },
    { en: 'address',  ja: '住所' },
    { en: 'damage',  ja: '被害' },
    { en: 'sort of',  ja: '種類' },
    { en: 'reason',  ja: '理由、原因' },
    { en: 'kilometer',  ja: 'キロメートル'},
    { en: 'middle',  ja: '中央' },
    { en: 'shock',  ja: 'ショック' },
    { en: 'centimeter',  ja: 'センチメートル'},
    { en: 'zone',  ja: '地帯' },
    { en: 'toast',  ja: 'トースト' },
    { en: 'curtain',  ja: 'カーテン' },
    { en: 'juice',  ja: 'ジュース' },
    { en: 'honey',  ja: '蜂蜜' },
    { en: 'goods',  ja: '商品' },
    { en: 'sense',  ja: '感じ' },
    { en: 'type',  ja: '型' },
    { en: 'symbol',  ja: '象徴' },
    { en: 'energy',  ja: 'エネルギー' },
    { en: 'position',  ja: '位置　地位' },
    { en: 'gray',  ja: '灰色' },
    { en: 'bit',  ja: '少し' },
    { en: 'matter',  ja: '問題　困ったこと'},
    { en: 'power',  ja: '力' },
    { en: 'sentence',  ja: '文' },
    { en: 'yen',  ja: '円' },
    { en: 'grade',  ja: '評点、等級' },
    { en: 'plate',  ja: '皿' },
    { en: 'cheese',  ja: 'チーズ' },
    { en: 'can',  ja: 'カン' },
    { en: 'treasure',  ja: '宝物' },
    { en: 'hole',  ja: '穴' },
    { en: 'price',  ja: '価格' },
    { en: 'problem',  ja: '問題' },
    { en: 'fact',  ja: '事実' },
    { en: 'beauty',  ja: '美' },
    { en: 'pair',  ja: '一組' },
    { en: 'percent',  ja: 'パーセント' },
    { en: 'case',  ja: '場合、容器' },
    { en: 'spelling',  ja: '綴り' },
    { en: 'meaning',  ja: '意味' },
    { en: 'square',  ja: '正方形' },
    { en: 'youth',  ja: '若さ' },
    { en: 'order',  ja: '注文する' },
    { en: 'wonder',  ja: '不思議に思う' },
    { en: 'smell',  ja: 'においがする' },
    { en: 'kiss',  ja: 'キスをする' },
    { en: 'cross',  ja: '横切る' },
    { en: 'select',  ja: '選ぶ' },
    { en: 'awake',  ja: '目が覚める' },
    { en: 'fill',  ja: 'いっぱいにする' },
    { en: 'print',  ja: '印刷する' },
    { en: 'succeed',  ja: '成功する' },
    { en: 'receive',  ja: '受け取る' },
    { en: 'date',  ja: 'デートする' },
    { en: 'raise',  ja: '持ち上げる　育てる'},
    { en: 'exercise',  ja: '練習する' },
    { en: 'return',  ja: '帰る' },
    { en: 'destroy',  ja: '破壊する' },
    { en: 'belong',  ja: 'ものである' },
    { en: 'realize',  ja: '理解する　実現する' },
    { en: 'sound',  ja: 'ように聞こえる' },
    { en: 'invent',  ja: '発明する' },
    { en: 'solve',  ja: '解決する' },
    { en: 'hurt',  ja: '傷つける' },
    { en: 'knock',  ja: 'ノックする' },
    { en: 'touch',  ja: '触れる、感動する' },
    { en: 'miss',  ja: '間違う　さみしく思う'},
    { en: 'reach',  ja: '着く　届く' },
    { en: 'hand',  ja: '手渡す' },
    { en: 'choose',  ja: '選ぶ' },
    { en: 'share',  ja: '分け合う' },
    { en: 'copy',  ja: '模写する' },
    { en: 'boil',  ja: 'ゆでる　煮る' },
    { en: 'train',  ja: '訓練する' },
    { en: 'cover',  ja: 'おおう' },
    { en: 'break',  ja: '壊れる　破る' },
    { en: 'please',  ja: '喜ばせる　気に入る'},
    { en: 'explain',  ja: '説明する' },
    { en: 'bake',  ja: 'オーブンで焼く' },
    { en: 'discuss',  ja: '話し合う' },
    { en: 'lie',  ja: '横たわる　～にある' },
    { en: 'shake',  ja: '震える' },
    { en: 'save',  ja: '救う　節約する　とっておく'},
    { en: 'hit',  ja: '打つ' },
    { en: 'mix',  ja: '混ぜる' },
    { en: 'blow',  ja: '吹く' },
    { en: 'shoot',  ja: '撃つ' },
    { en: 'fight',  ja: '戦う' },
    { en: 'introduce',  ja: '紹介する　初めて伝える'},
    { en: 'row',  ja: 'こぐ' },
    { en: 'drop',  ja: '落とす' },
    { en: 'marry',  ja: '結婚する' },
    { en: 'interested',  ja: '興味のある' },
    { en: 'ashamed',  ja: '恥じて' },
    { en: 'blind',  ja: '目の見えない' },
    { en: 'gentle',  ja: 'やさしい' },
    { en: 'pleased',  ja: '喜んで' },
    { en: 'monthly',  ja: '月刊' },
    { en: 'open',  ja: '開いている' },
    { en: 'flat',  ja: '平らな' },
    { en: 'musical',  ja: '音楽の～' },
    { en: 'noisy',  ja: '騒がしい' },
    { en: 'holy',  ja: '神聖な' },
    { en: 'lonely',  ja: '淋しい　ひとりの' },
    { en: 'merry',  ja: '陽気な' },
    { en: 'living',  ja: '生きている' },
    { en: 'personal',  ja: '個人の' },
    { en: 'necessary',  ja: '必要な' },
    { en: 'wild',  ja: '野生の～　荒々しい' },
    { en: 'outside',  ja: '外側の～' },
    { en: 'fresh',  ja: '新鮮な' },
    { en: 'healthy',  ja: '健康な' },
    { en: 'lovely',  ja: '美しい、素敵な、いいね' },
    { en: 'dumb',  ja: '口のきけない' },
    { en: 'modern',  ja: '現代的な' },
    { en: 'peaceful',  ja: '平和な' },
    { en: 'raw',  ja: '生の～' },
    { en: 'international',  ja: '国際的な' },
    { en: 'back',  ja: '後ろの～　裏の～' },
    { en: 'natural',  ja: '自然の～' },
    { en: 'lost',  ja: '道に迷った' },
    { en: 'quick',  ja: '速い' },
    { en: 'first',  ja: '1番目の' },
    { en: 'second',  ja: '2番目の' },
    { en: 'third',  ja: '3番目の' },
    { en: 'forth',  ja: '4番目の' },
    { en: 'fifth',  ja: '5番目の' },
    { en: 'sixth',  ja: '6番目の' },
    { en: 'seventh',  ja: '7番目の' },
    { en: 'eighth',  ja: '8番目の' },
    { en: 'ninth',  ja: '9番目の' },
    { en: 'tenth',  ja: '10番目の' },
    { en: 'eleventh',  ja: '11番目の' },
    { en: 'twelfth',  ja: '12番目の' },
    { en: 'thirteenth',  ja: '13番目の' },
    { en: 'fourteenth',  ja: '14番目の' },
    { en: 'fifteenth',  ja: '15番目の' },
    { en: 'sixteenth',  ja: '16番目の' },
    { en: 'seventeenth',  ja: '17番目の' },
    { en: 'eighteenth',  ja: '18番目の' },
    { en: 'nineteenth',  ja: '19番目の' },
    { en: 'twentieth',  ja: '20番目の' },
    { en: 'thirtieth',  ja: '30番目の' },
    { en: 'unhappy',  ja: '不幸な' },
    { en: 'lazy',  ja: '怠け者の' },
    { en: 'brave',  ja: '勇敢な' },
    { en: 'pale',  ja: '青ざめた' },
    { en: 'simple',  ja: '簡単な　質素な' },
    { en: 'daily',  ja: '毎日の' },
    { en: 'exciting',  ja: '興奮させる' },
    { en: 'senior',  ja: '年上の　上級の' },
    { en: 'safe',  ja: '安全な' },
    { en: 'national',  ja: '国家の　国民の' },
    { en: 'Chinese',  ja: '中国の　中国人の' },
    { en: 'another',  ja: 'ほかの　もうひとつの'},
    { en: 'than',  ja: 'よりも' },
    { en: 'while',  ja: '～する間' },
    { en: 'but',  ja: 'しかし' },
    { en: 'when',  ja: '～するとき' },
    { en: 'during',  ja: '～の間　～を通じて' },
    { en: 'excited',  ja: '興奮した' },
    { en: 'fat',  ja: '太った' },
    { en: 'funny',  ja: 'おかしな' },
    { en: 'cute',  ja: '可愛い' },
    { en: 'sleepy',  ja: '眠い' },
    { en: 'delicious',  ja: 'おいしい' },
    { en: 'calm',  ja: '落ちついた' },
    { en: 'tiny',  ja: '小さな' },
    { en: 'final',  ja: '最後の' },
    { en: 'central',  ja: '中心の' },
    { en: 'wet',  ja: '濡れている' },
    { en: 'common',  ja: '共通の' },
    { en: 'because',  ja: 'なぜなら' },
    { en: 'and',  ja: '～と' },
    { en: 'however',  ja: 'しかし' },
    { en: 'hello',  ja: 'こんにちは' },
    { en: 'after',  ja: '～の後で' },
    { en: 'crazy',  ja: '気の狂った' },
    { en: 'fond',  ja: '好きな、優しい' },
    { en: 'friendly',  ja: '好意的な' },
    { en: 'silent',  ja: '静かな' },
    { en: 'close',  ja: '接近した' },
    { en: 'real',  ja: 'ほんとうの' },
    { en: 'certain',  ja: 'ある' },
    { en: 'wrong',  ja: '間違った　ぐあいが悪い'},
    { en: 'weekly',  ja: '週刊' },
    { en: 'snowy',  ja: '雪の降る' },
    { en: 'whole',  ja: 'すべての' },
    { en: 'if',  ja: 'もし' },
    { en: 'although',  ja: 'であるけれど' },
    { en: 'though',  ja: 'だけれども' },
    { en: 'or',  ja: 'それとも' },
    { en: 'between',  ja: '～と～の間' },
    { en: 'tonight',  ja: '今夜' },
    { en: 'ever',  ja: '今まで' },
    { en: 'once',  ja: 'かつて　１度' },
    { en: 'finally',  ja: 'ついに' },
    { en: 'straight',  ja: 'まっすぐに' },
    { en: 'everywhere',  ja: 'どこでも' },
    { en: 'down',  ja: '下に' },
    { en: 'pretty',  ja: 'かなり' },
    { en: 'besides',  ja: 'その上' },
    { en: 'maybe',  ja: 'おそらく' },
    { en: 'surely',  ja: '確かに' },
    { en: 'certainly',  ja: '確かに' },
    { en: 'easily',  ja: 'かんたんに' },
    { en: 'neither',  ja: '～も～もない' },
    { en: 'alone',  ja: 'ひとりきりで' },
    { en: 'hard',  ja: 'いっしょうけんめい'},
    { en: 'forever',  ja: '永久に' },
    { en: 'suddenly',  ja: '突然' },
    { en: 'especially',  ja: '特に' },
    { en: 'quickly',  ja: 'すばやく' },
    { en: 'long',  ja: '長く' },
    { en: 'away',  ja: '離れて' },
    { en: 'abroad',  ja: '外国へ' },
    { en: 'ahead',  ja: '前方に' },
    { en: 'all',  ja: 'まったく' },
    { en: 'almost',  ja: 'ほとんど' },
    { en: 'indeed',  ja: '実に' },
    { en: 'else',  ja: 'そのほかに' },
    { en: 'anyway',  ja: 'ともかく' },
    { en: 'either',  ja: '～でない'},
    { en: 'gently',  ja: 'やさしく' },
    { en: 'probably',  ja: '多分' },
    { en: 'happily',  ja: '幸せに　楽しく' },
    { en: 'then',  ja: 'それから　そのとき　それでは'},
    { en: 'twice',  ja: '２回' },
    { en: 'still',  ja: 'まだ' },
    { en: 'recently',  ja: '最近' },
    { en: 'off',  ja: '離れて' },
    { en: 'across',  ja: '横切って' },
    { en: 'round',  ja: 'まわりに　まわりを' },
    { en: 'just',  ja: 'ちょうど　ただ単に' },
    { en: 'quite',  ja: 'まったく' },
    { en: 'perhaps',  ja: '多分' },
    { en: 'even',  ja: '～さえ' },
    { en: 'quietly',  ja: '静かに' },
    { en: 'fine',  ja: 'うまく' },
    { en: 'carefully',  ja: '注意深く' },
    { en: 'never',  ja: '１度も～ない' },
    { en: 'really',  ja: '本当に' }
  ];

  // 出題済みを除外するためのプール
  let remainingBank = bank.slice();

  // ─── 環境チェック ─────────────────────────────────────────────────
  const hasSpeech = typeof window.speechSynthesis !== 'undefined';
  let loadedVoices = [];
  if (hasSpeech) {
    speechSynthesis.addEventListener('voiceschanged', () => {
      loadedVoices = speechSynthesis.getVoices();
    });
  }

  // ─── ヘルパー ─────────────────────────────────────────────────────
  const randInt = n => Math.floor(Math.random() * n);
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    dpi = window.devicePixelRatio || 1;
    canvas.style.width  = `${vw}px`;
    canvas.style.height = `${vh}px`;
    canvas.width  = vw * dpi;
    canvas.height = vh * dpi;
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  }

  function isPortrait() {
    return window.innerWidth < window.innerHeight;
  }

  // ─── 音声合成 ─────────────────────────────────────────────────────
  function speakGirl(text) {
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    const vs = speechSynthesis.getVoices().length
              ? speechSynthesis.getVoices()
              : loadedVoices;
    let voice = vs.find(v => v.lang.startsWith('en') && /female/i.test(v.name));
    if (!voice) {
      const names = ['Zira','Samantha','Victoria','Tessa','Amelie','Alice'];
      voice = vs.find(v => v.lang.startsWith('en') &&
                           names.some(n => v.name.includes(n)));
    }
    if (!voice) voice = vs.find(v => v.lang === 'en-US');
    if (!voice) voice = vs.find(v => v.lang.startsWith('en'));
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = 'en-US';
    if (voice) utt.voice = voice;
    utt.pitch = 1.4;
    speechSynthesis.speak(utt);
  }

  // ─── Draggable クラス ─────────────────────────────────────────────
  class Draggable {
    constructor(text, x, y) {
      this.text      = text;
      this.homeX     = x; this.homeY = y;
      this.x         = x; this.y    = y;
      this.dragging  = false;
      this.offsetX   = 0; this.offsetY = 0;
      this.returning = false;
      this.RETURN_DURATION = 300;
      this.returnStart = 0;
      this.startX      = x; this.startY = y;

      ctx.font = '24px sans-serif';
      const tw  = ctx.measureText(text).width;
      this.w = tw + 30;
      this.h = 36;

      this.badgeW = 0; this.badgeH = this.h;
      this.badgeX = 0; this.badgeY = 0;
    }

    draw() {
      ctx.font         = '24px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'center';
      ctx.fillStyle    = '#fff';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle  = '#000';
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle    = '#000';
      ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);

      const badge = '(^o^)';
      ctx.font      = '20px sans-serif';
      ctx.textAlign = 'start';
      const bw      = ctx.measureText(badge).width;
      this.badgeX   = this.x + this.w + 10;
      this.badgeY   = this.y;
      this.badgeW   = bw;
      ctx.fillStyle = '#800080';
      ctx.fillText(badge, this.badgeX, this.badgeY + this.h / 2);
    }

    update() {
      if (!this.returning) return;
      const t = (performance.now() - this.returnStart) / this.RETURN_DURATION;
      const ease = 1 - Math.pow(1 - t, 2);
      if (t >= 1) {
        this.x = this.homeX;
        this.y = this.homeY;
        this.returning = false;
      } else {
        this.x = this.startX + (this.homeX - this.startX) * ease;
        this.y = this.startY + (this.homeY - this.startY) * ease;
      }
    }

    startReturn() {
      this.returning   = true;
      this.returnStart = performance.now();
      this.startX      = this.x;
      this.startY      = this.y;
    }
  }

  // ─── Target クラス ─────────────────────────────────────────────────
  class Target {
    constructor(text, x, y) {
      this.text = text;
      this.x    = x;
      this.y    = y;
      ctx.font = '24px sans-serif';
      const w  = ctx.measureText(text).width;
      this.w = w + 30;
      this.h = 36;
      this.highlight = false;
    }

    draw() {
      ctx.font         = '24px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'center';
      ctx.strokeStyle  = this.highlight ? '#f00' : '#000';
      ctx.lineWidth    = this.highlight ? 3 : 1;
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle    = '#000';
      ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
      ctx.lineWidth    = 1;
      this.highlight = false;
    }

    isHover(px, py) {
      return px >= this.x && px <= this.x + this.w &&
             py >= this.y && py <= this.y + this.h;
    }
  }

  // ─── 新ラウンド準備 ───────────────────────────────────────────────
  function setupRound() {
    solvedCount = 0;
    words   = [];
    targets = [];
    state   = 'running';

    shuffle(remainingBank);
    const pickCount = Math.min(remainingBank.length, 5);
    const picks = remainingBank.slice(0, pickCount);
    roundTotal = picks.length;
    remainingBank = remainingBank.filter(o => !picks.includes(o));

    const gapY  = window.innerHeight / (pickCount + 1);
    picks.forEach((o, i) => {
      const y = gapY * (i + 1) - 18;
      words.push(new Draggable(o.en, 20, y));
    });

    const answers = picks.map(o => o.ja);
    shuffle(answers);
    answers.forEach((txt, i) => {
      const y = gapY * (i + 1) - 18;
      ctx.font = '24px sans-serif';
      const tw = ctx.measureText(txt).width + 30;
      const x  = window.innerWidth - tw - 20;
      targets.push(new Target(txt, x, y));
    });
  }

  // ─── ゲーム開始 ───────────────────────────────────────────────────
  function tryStart(x) {
    players = x < window.innerWidth / 2 ? 1 : 2;
    if (state === 'start') {
      score = 0;
      remainingBank = bank.slice();
    }
    setupRound();
  }

  // ─── 入力ハンドラ ─────────────────────────────────────────────────
  let activePointer = null;

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state === 'start' || state === 'complete') {
      tryStart(x);
      return;
    }
    if (state !== 'running' || isPortrait()) return;

    // 発音バッジ
    for (const d of words) {
      if (
        x >= d.badgeX && x <= d.badgeX + d.badgeW &&
        y >= d.badgeY && y <= d.badgeY + d.h
      ) {
        speakGirl(d.text);
        return;
      }
    }

    // ドラッグ開始
    for (const d of words) {
      if (
        x >= d.x && x <= d.x + d.w &&
        y >= d.y && y <= d.y + d.h
      ) {
        canvas.setPointerCapture(e.pointerId);
        activePointer = e.pointerId;
        d.dragging    = true;
        d.offsetX     = x - d.x;
        d.offsetY     = y - d.y;
        break;
      }
    }
  }

  function onPointerMove(e) {
    if (e.pointerId !== activePointer || state !== 'running') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    words.forEach(d => {
      if (d.dragging) {
        d.x = x - d.offsetX;
        d.y = y - d.offsetY;
        targets.forEach(t => {
          if (t.isHover(x, y)) t.highlight = true;
        });
      }
    });
  }

  function onPointerUp(e) {
    if (e.pointerId !== activePointer || state !== 'running') return;
    canvas.releasePointerCapture(e.pointerId);

    for (const d of words) {
      if (!d.dragging) continue;
      d.dragging = false;

      let hit = null;
      for (const t of targets) {
        if (
          d.x + d.w / 2 >= t.x &&
          d.x + d.w / 2 <= t.x + t.w &&
          d.y + d.h / 2 >= t.y &&
          d.y + d.h / 2 <= t.y + t.h
        ) {
          hit = t;
          break;
        }
      }

      if (hit) {
        const correct = bank.find(o => o.en === d.text).ja;
        if (hit.text === correct) {
          score += 10;
          feedbackText = players === 1 ? '正解' : '正解　交代';
          currentCard  = cards[randInt(cards.length)];
          feedbackTime = performance.now();
          state        = 'feedback';

          words   = words.filter(w => w !== d);
          targets = targets.filter(t => t !== hit);
          solvedCount++;
          activePointer = null;
          return;
        }
      }

      d.startReturn();
      activePointer = null;
    }
  }

  function onPointerCancel(e) {
    if (e.pointerId !== activePointer) return;
    for (const d of words) {
      if (d.dragging) {
        d.dragging = false;
        d.startReturn();
      }
    }
    activePointer = null;
  }

  // ─── 描画ループ ────────────────────────────────────────────────────
  function loop(now = 0) {
    if (isPortrait()) {
      ctx.fillStyle    = '#ccf';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle    = '#000';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = '28px sans-serif';
      ctx.fillText('横向きにしてください',
                   window.innerWidth / 2,
                   window.innerHeight / 2);
      requestAnimationFrame(loop);
      return;
    }

    ctx.fillStyle    = '#ccf';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle    = '#000';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';
    ctx.font         = '20px sans-serif';
    ctx.fillText(`Score: ${score}`, 20, 20);

    if (state === 'start') {
      ctx.fillStyle    = '#000';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = '28px sans-serif';
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      [
        '英単語中学三年生のクイズ面白いゲーム',
        '正解にかさねてね',
        '左タップ：1人用　右タップ：2人協力'
      ].forEach((txt, i) => {
        ctx.fillText(txt, cx, cy + i * 36 - 36);
      });
    } else if (state === 'running') {
      words.forEach(d => { d.update(); d.draw(); });
      targets.forEach(t => t.draw());
      if (solvedCount === roundTotal) {
        state        = 'complete';
        feedbackText = 'おめでとう☆　タップで次へ';
        currentCard  = cards[randInt(cards.length)];
      }
    } else { // 'feedback' or 'complete'
      words.forEach(d => { d.update(); d.draw(); });
      targets.forEach(t => t.draw());

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cw = 180, ch = 180;
      if (currentCard) {
        ctx.drawImage(
          currentCard,
          (window.innerWidth  - cw) / 2,
          (window.innerHeight - ch) / 2,
          cw, ch
        );
      }

      ctx.fillStyle    = '#fff';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      ctx.font         = state === 'feedback' ? '36px sans-serif'
                                              : '28px sans-serif';
      ctx.fillText(
        feedbackText,
        window.innerWidth  / 2,
        window.innerHeight / 2 + ch / 2 + 20
      );

      if (state === 'feedback' && now - feedbackTime > 1000) {
        state = 'running';
      }
    }

    requestAnimationFrame(loop);
  }

  // ─── 初期化 ────────────────────────────────────────────────────────
  function init() {
    canvas = document.createElement('canvas');
    ctx    = canvas.getContext('2d');
    document.documentElement.style.margin  = '0';
    document.documentElement.style.padding = '0';
    document.body.style.margin   = '0';
    document.body.style.padding  = '0';
    canvas.style.display     = 'block';
    canvas.style.touchAction = 'none';
    document.body.appendChild(canvas);

    // カード画像プリロード
    cardFiles.forEach(src => {
      const img = new Image();
      img.src   = src;
      img.onload  = () => cards.push(img);
      img.onerror = () => console.error('画像読み込み失敗:', src);
    });

    // リサイズ＆リスナー
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(loop);

    canvas.addEventListener('pointerdown',   onPointerDown);
    canvas.addEventListener('pointermove',   onPointerMove);
    canvas.addEventListener('pointerup',     onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);

    // タッチ → ポインター フォールバック
    if (typeof PointerEvent === 'function') {
      ['start','move','end'].forEach(type => {
        canvas.addEventListener(
          'touch' + type,
          e => {
            const t = e.changedTouches[0];
            let pe;
            try {
              pe = new PointerEvent('pointer' + type, {
                pointerId:   t.identifier,
                clientX:     t.clientX,
                clientY:     t.clientY,
                pointerType: 'touch',
                isPrimary:   true
              });
            } catch {
              return;
            }
            canvas.dispatchEvent(pe);
            e.preventDefault();
          },
          { passive: false }
        );
      });
    }

    window.addEventListener('keydown', e => {
      if ((state === 'start' || state === 'complete') &&
          (e.key === ' ' || e.key === 'Enter')) {
        tryStart(window.innerWidth / 2);
      }
    });
  }

  window.addEventListener('load', init);
})();
