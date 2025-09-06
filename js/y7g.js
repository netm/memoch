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

  const cardFiles = ['zjump1.png','zjump2.png','zjump3.png','zjump4.png'];
  const cards     = [];

  const bank = [
    { en: 'How are you?',  ja: 'お元気ですか' },
    { en: 'I’m fine.',  ja: 'とても元気です' },
    { en: 'I’m good.',  ja: '私は元気です' },
    { en: 'Are you OK?',  ja: '大丈夫ですか' },
    { en: 'Do you ~?',  ja: 'あなたは～しますか' },
    { en: 'Yes, I do.',  ja: 'はい、します' },
    { en: 'No, I don’t.',  ja: 'いいえ、しません' },
    { en: 'What time',  ja: '何時' },
    { en: 'in the morning',  ja: '午前に' },
    { en: 'in the afternoon',  ja: '午後に' },
    { en: 'at noon',  ja: '正午に' },
    { en: 'in the evening',  ja: '夕方に（夜10時ごろまで）' },
    { en: 'at night',  ja: '夜に' },
    { en: 'get up',  ja: '起きる' },
    { en: 'eat breakfast',  ja: '朝食を食べる' },
    { en: 'go to school',  ja: '学校へ行く' },
    { en: 'go home',  ja: '帰宅する' },
    { en: 'do my homework',  ja: '宿題をする' },
    { en: 'take a bath',  ja: 'おふろにはいる' },
    { en: 'watch TV',  ja: 'テレビを見る' },
    { en: 'go to bed',  ja: 'ねる' },
    { en: 'eat lunch',  ja: '昼食を食べる' },
    { en: 'eat dinner',  ja: '夕食を食べる' },
    { en: 'on Sundays',  ja: '毎週日曜日に' },
    { en: 'on Saturdays',  ja: '毎週土曜日に' },
    { en: 'have',  ja: '食べる' },
    { en: 'always',  ja: 'いつも' },
    { en: 'usually',  ja: 'たいてい' },
    { en: 'sometimes',  ja: 'ときどき' },
    { en: 'What time do you ~?',  ja: 'あなたは何時に～しますか' },
    { en: 'at',  ja: '～時に' },
    { en: 'cap',  ja: 'ぼうし' },
    { en: 'sun',  ja: '太陽' },
    { en: 'fun',  ja: '楽しい' },
    { en: 'map',  ja: '地図' },
    { en: 'mat',  ja: 'マット' },
    { en: 'Australia',  ja: 'オーストラリア' },
    { en: 'Brazil',  ja: 'ブラジル' },
    { en: 'China',  ja: '中国' },
    { en: 'Egypt',  ja: 'エジプト' },
    { en: 'France',  ja: 'フランス' },
    { en: 'Germany',  ja: 'ドイツ' },
    { en: 'Italy',  ja: 'イタリア' },
    { en: 'Switzerland',  ja: 'スイス' },
    { en: 'The U. K.',  ja: 'イギリス' },
    { en: 'the U. S. A.',  ja: 'アメリカ' },
    { en: 'Korea',  ja: '韓国' },
    { en: 'India',  ja: 'インド' },
    { en: 'Kenya',  ja: 'ケニア' },
    { en: 'koalas',  ja: 'コアラ' },
    { en: 'the Great Wall',  ja: '万里の長城' },
    { en: 'want to ~',  ja: '～したい' },
    { en: 'Where do you want to go?',  ja: 'あなたはどこに行きたいですか' },
    { en: 'why',  ja: 'なぜ' },
    { en: 'I’d like to ~',  ja: 'わたしは～したいです' },
    { en: 'eat pizza',  ja: 'ピザを食べる' },
    { en: 'panda',  ja: 'パンダ' },
    { en: 'nature',  ja: '自然' },
    { en: 'mountain',  ja: '山' },
    { en: 'beach(es)',  ja: '浜辺' },
    { en: 'garden',  ja: '庭園' },
    { en: 'firework',  ja: '花火' },
    { en: 'castle',  ja: '城' },
    { en: 'temple',  ja: '寺' },
    { en: 'shrine',  ja: '神社' },
    { en: 'festival',  ja: '祭り' },
    { en: 'event',  ja: '行事' },
    { en: 'food',  ja: '食べ物' },
    { en: 'place',  ja: '場所' },
    { en: 'snow',  ja: '雪' },
    { en: 'island',  ja: '島' },
    { en: 'hot spring',  ja: '温泉' },
    { en: 'Star Festival',  ja: '七夕まつり' },
    { en: 'Snow Festival',  ja: '雪まつり' },
    { en: 'Welcome to ~.',  ja: '～へようこそ' },
    { en: 'try',  ja: 'やってみる' },
    { en: 'climb',  ja: 'のぼる' },
    { en: 'visit',  ja: '訪れる' },
    { en: 'delicious',  ja: 'おいしい' },
    { en: 'famous',  ja: '有名な' },
    { en: 'fresh',  ja: '新鮮な' },
    { en: 'interesting',  ja: 'おもしろい' },
    { en: 'beautiful',  ja: '美しい' },
    { en: 'nice',  ja: 'よい' },
    { en: 'stay',  ja: '滞在する' },
    { en: 'go into ~',  ja: '中に入る' },
    { en: 'learn',  ja: '学ぶ' },
    { en: 'have',  ja: 'がある' },
    { en: 'colorful',  ja: '色とりどりの' },
    { en: 'many',  ja: 'たくさん' },
    { en: 'we',  ja: '私たちは' },
    { en: 'you can',  ja: 'あなたは～できる' },
    { en: 'is famous for ~',  ja: '～　で有名です' },
    { en: 'very',  ja: 'とても' },
    { en: 'high',  ja: '高い' },
    { en: 'please',  ja: '～してください' },
    { en: 'glove',  ja: 'てぶくろ' },
    { en: 'van',  ja: 'バン　小型トラック' },
    { en: 'science',  ja: '理科' },
    { en: 'zebra',  ja: 'しまうま' },
    { en: 'vet',  ja: '獣医' },
    { en: 'sea',  ja: '海' },
    { en: 'zoo',  ja: '動物園' },
    { en: 'camping',  ja: 'キャンプ' },
    { en: 'barbecuing',  ja: 'バーベキュー' },
    { en: 'movie',  ja: '映画' },
    { en: 'star',  ja: '星' },
    { en: 'watermelon',  ja: 'スイカ' },
    { en: 'ice cream',  ja: 'アイスクリーム' },
    { en: 'enjoy',  ja: '楽しむ' },
    { en: 'meet',  ja: '会う' },
    { en: 'they',  ja: '彼らは（彼女らは）' },
    { en: 'the Milky Way',  ja: 'あまのがわ' },
    { en: 'with',  ja: '～と' },
    { en: 'grandfather',  ja: 'おじいちゃん' },
    { en: 'amusement park',  ja: '遊園地' },
    { en: 'swimming pool',  ja: 'プール' },
    { en: 'grandmother',  ja: 'おばあちゃん' },
    { en: 'curry and rice',  ja: 'カレーライス' },
    { en: 'shopping',  ja: '買い物' },
    { en: 'swimming',  ja: '水泳' },
    { en: 'fishing',  ja: 'つり' },
    { en: 'festival',  ja: '祭り' },
    { en: 'grandmother’s house',  ja: 'おばあちゃんの家' },
    { en: 'summer vacation',  ja: '夏休み' },
    { en: 'beetle',  ja: 'カブトムシ' },
    { en: 'cycling',  ja: 'サイクリング' },
    { en: 'parade',  ja: 'パレード' },
    { en: 'cute',  ja: 'かわいい' },
    { en: 'fun',  ja: '楽しみ' },
    { en: 'big',  ja: '大きい' },
    { en: 'small',  ja: '小さい' },
    { en: 'exciting',  ja: 'わくわくするような' },
    { en: 'good',  ja: 'よい' },
    { en: 'How was your summer vacation?',  ja: 'あなたの夏休みはどうでしたか' },
    { en: 'went to ~',  ja: '～へ行きました' },
    { en: 'How about you?',  ja: 'あなたはどうですか' },
    { en: 'I saw ~',  ja: '私は～を見ました' },
    { en: 'It was ~',  ja: 'それは～でした' },
    { en: 'tiger',  ja: 'トラ' },
    { en: 'ate',  ja: '食べた' },
    { en: 'enjoyed',  ja: '楽しんだ' },
    { en: 'miso soup',  ja: 'みそしる' },
    { en: 'yogurt',  ja: 'ヨーグルト' },
    { en: 'sweet',  ja: 'おかし' },
    { en: 'dress(es)',  ja: 'ドレス、服、ワンピース' },
    { en: 'cook',  ja: '料理する' },
    { en: 'wear',  ja: '着ている、身に着ける' },
    { en: 'healthy',  ja: '健康的な' },
    { en: 'traditional',  ja: '伝統的な' },
    { en: 'introduce',  ja: '紹介する' },
    { en: 'tea',  ja: '紅茶' },
    { en: 'a lot of',  ja: 'たくさんの' },
    { en: 'Japanese sweet',  ja: '和菓子' },
    { en: 'culture',  ja: '文化' },
    { en: 'first',  ja: '1番目' },
    { en: 'second',  ja: '2番目' },
    { en: 'third',  ja: '3番目' },
    { en: 'lobster',  ja: 'ロブスター' },
    { en: 'basketball',  ja: 'バスケットボール' },
    { en: 'volleyball',  ja: 'バレーボール' },
    { en: 'badminton',  ja: 'バドミントン' },
    { en: 'skiing',  ja: 'スキー' },
    { en: 'skating',  ja: 'スケート' },
    { en: 'wheelchair',  ja: '車いす' },
    { en: 'wheelchair basketball',  ja: '車いすバスケットボール' },
    { en: 'do judo',  ja: '柔道をする' },
    { en: 'golf',  ja: 'ゴルフ' },
    { en: 'golfer',  ja: 'ゴルフ選手' },
    { en: 'skate',  ja: 'スケートをする' },
    { en: 'skater',  ja: 'スケート選手' },
    { en: 'surf',  ja: 'サーフィンをする' },
    { en: 'surfer',  ja: 'サーファー' },
    { en: 'What sport do you like?',  ja: 'あなたは何のスポーツが好きですか' },
    { en: 'What food do you like?',  ja: 'あなたは何の食べ物が好きですか' },
    { en: 'What sport do you want to play?',  ja: 'あなたは何のスポーツがしたいですか' },
    { en: 'very much',  ja: 'たいへん' },
    { en: 'favorite',  ja: 'お気に入りの' },
    { en: 'My favorite sports player is ~ .',  ja: '私の好きなスポーツ選手は～です' },
    { en: 'who is your favorite sports player ?',  ja: 'あなたの好きなスポーツ選手はだれですか' },
    { en: 'who',  ja: 'だれ' },
    { en: 'very well',  ja: 'とても上手に' },
    { en: 'can ~ well',  ja: '上手に～することができる' },
    { en: 'is good at ~',  ja: '～が上手です' },
    { en: 'entrance ceremony',  ja: '入学式' },
    { en: 'summer camp',  ja: 'サマーキャンプ' },
    { en: 'sports day',  ja: '運動会' },
    { en: 'music festival',  ja: '音楽祭' },
    { en: 'drama festival',  ja: '学芸会' },
    { en: 'hiking',  ja: 'ハイキング' },
    { en: 'school trip',  ja: '修学旅行' },
    { en: 'volunteer day',  ja: 'ボランティア活動の日' },
    { en: 'graduation ceremony',  ja: '卒業式' },
    { en: 'mochi making festival',  ja: 'もちつき大会' },
    { en: 'favorite memory',  ja: 'お気に入りの思い出' },
    { en: 'art',  ja: '芸術' },
    { en: 'dancing',  ja: 'ダンス' },
    { en: 'taking pictures',  ja: '写真をとること' },
    { en: 'doctor',  ja: '医者' },
    { en: 'nurse',  ja: '看護師' },
    { en: 'vet',  ja: '獣医' },
    { en: 'teacher',  ja: '先生' },
    { en: 'pilot',  ja: 'パイロット' },
    { en: 'cook',  ja: '料理人' },
    { en: 'police officer',  ja: '警察官' },
    { en: 'fire fighter',  ja: '消防士' },
    { en: 'bus driver',  ja: 'バスの運転手' },
    { en: 'dentist',  ja: '歯医者' },
    { en: 'flight attendant',  ja: '客室乗務員' },
    { en: 'artist',  ja: '芸術家' },
    { en: 'actor',  ja: 'はいゆう' },
    { en: 'dream',  ja: '夢' },
    { en: 'airplane',  ja: '飛行機' },
    { en: 'help',  ja: '助ける' },
    { en: 'people',  ja: '人々' },
    { en: 'astronaut',  ja: '宇宙飛行士' },
    { en: 'comedian',  ja: 'お笑い芸人' },
    { en: 'singer',  ja: '歌手' },
    { en: 'farmer',  ja: '農業従事者' },
    { en: 'carpenter',  ja: '大工' },
    { en: 'baker',  ja: 'パン屋さん' },
    { en: 'florist',  ja: 'お花屋さん' },
    { en: 'wonderful',  ja: 'すばらしい' },
    { en: 'great',  ja: 'すごい' },
    { en: 'animal',  ja: '動物' },
    { en: 'dream',  ja: '夢' },
    { en: 'baseball team',  ja: '野球部' },
    { en: 'soccer team',  ja: 'サッカー部' },
    { en: 'tennis team',  ja: 'テニス部' },
    { en: 'basketball team',  ja: 'バスケットボール部' },
    { en: 'brass band',  ja: '吹奏楽部' },
    { en: 'chorus',  ja: '合唱部' },
    { en: 'computer club',  ja: 'コンピュータ部' },
    { en: 'track and field team',  ja: '陸上部' },
    { en: 'softball team',  ja: 'ソフトボール部' },
    { en: 'science club',  ja: '科学部' },
    { en: 'calligraphy club',  ja: '書道部' },
    { en: 'junior high school',  ja: '中学校' },
    { en: 'join',  ja: '参加する' },
    { en: 'I want to join ～',  ja: '私は～に入りたい' },
    { en: 'party',  ja: 'パーティー' },
    { en: 'What team do you want to join?',  ja: 'あなたは何の部活動に入りたいですか' },
    { en: 'field trip',  ja: '遠足、社会科見学、野外観察' },
    { en: 'cultural festival',  ja: '文化祭' },
    { en: 'chorus contest',  ja: '合唱コンテスト' },
    { en: 'speech contest',  ja: 'スピーチコンテスト' },
    { en: 'general student meeting',  ja: '生徒総会' },
    { en: 'fine arts',  ja: '美術' },
    { en: 'period for integrated study',  ja: '総合的な学習の時間' },
    { en: 'industrial arts and home economics',  ja: '技術家庭科' },
    { en: 'school lunch',  ja: '給食' },
    { en: 'study',  ja: '勉強する' },
    { en: 'hard',  ja: '一生懸命に' },
    { en: 'gym',  ja: '体育館' },
    { en: 'pig',  ja: 'ブタ' },
    { en: 'vegetable',  ja: '野菜' },
    { en: 'musician',  ja: '音楽家、ミュージシャン' },
    { en: 'scientist',  ja: '科学者' },
    { en: 'pianist',  ja: 'ピアニスト' },
    { en: 'writer',  ja: '作家' },
    { en: 'zookeeper',  ja: '飼育員' },
    { en: 'compasses',  ja: 'コンパス' },
    { en: 'pencil sharpener',  ja: 'えんぴつけずり' },
    { en: 'magnet',  ja: '磁石' },
    { en: 'ink',  ja: 'インク' },
    { en: 'glasses',  ja: 'めがね' },
    { en: 'stapler',  ja: 'ホッチキス' },
    { en: 'racket',  ja: 'ラケット' },
    { en: 'present',  ja: 'プレゼント' },
    { en: 'telephone',  ja: '電話' },
    { en: 'umbrella',  ja: 'かさ' },
    { en: 'gymnastics',  ja: '体操' },
    { en: 'rugby',  ja: 'ラグビー' },
    { en: 'wrestling',  ja: 'レスリング' },
    { en: 'drink',  ja: '飲む' },
    { en: 'dessert',  ja: 'デザート' },
    { en: 'menu',  ja: 'メニュー' },
    { en: 'omelet',  ja: 'オムレツ' },
    { en: 'pumpkin',  ja: 'かぼちゃ' },
    { en: 'broccoli',  ja: 'ブロッコリー' },
    { en: 'nut',  ja: 'ナッツ' },
    { en: 'cookie',  ja: 'クッキー' },
    { en: 'donut',  ja: 'ドーナッツ' },
    { en: 'pudding',  ja: 'プリン' },
    { en: 'jam',  ja: 'ジャム' },
    { en: 'shaved ice',  ja: 'かき氷' },
    { en: 'moon',  ja: '月' },
    { en: 'sun',  ja: '太陽' },
    { en: 'tree',  ja: '木' },
    { en: 'rainbow',  ja: 'にじ' },
    { en: 'goat',  ja: 'ヤギ' },
    { en: 'giraffe',  ja: 'キリン' },
    { en: 'wolf',  ja: 'オオカミ' },
    { en: 'whale',  ja: 'クジラ' },
    { en: 'sea turtle',  ja: 'ウミガメ' },
    { en: 'penguin',  ja: 'ペンギン' },
    { en: 'zebra',  ja: 'しまうま' },
    { en: 'ant',  ja: 'アリ' },
    { en: 'butterfly',  ja: 'ちょうちょ' },
    { en: 'frog',  ja: 'カエル' },
    { en: 'marathon',  ja: 'マラソン' },
    { en: 'Russia',  ja: 'ロシア' },
    { en: 'Spain',  ja: 'スペイン' },
    { en: 'cherry blossom',  ja: '桜の花' },
    { en: 'town',  ja: '町' },
    { en: 'movie theater',  ja: '映画館' },
    { en: 'factory',  ja: '工場' },
    { en: 'bakery',  ja: 'パン屋さん' },
    { en: 'stadium',  ja: 'スタジアム' },
    { en: 'aquarium',  ja: '水族館' },
    { en: 'brave',  ja: 'ゆうかんな' },
    { en: 'scary',  ja: 'こわい' },
    { en: 'pretty',  ja: 'かわいい' },
    { en: 'popular',  ja: '人気のある' },
    { en: 'funny',  ja: 'おかしい' },
    { en: 'thirsty',  ja: 'のどがかわいた' },
    { en: 'tall',  ja: '背が高い' },
    { en: 'spicy',  ja: '香辛料のきいた' },
    { en: 'bitter',  ja: '苦い' },
    { en: 'read',  ja: '読む' },
    { en: 'teach',  ja: '教える' },
    { en: 'draw',  ja: 'えがく' },
    { en: 'run fast',  ja: '速く走る' },
    { en: 'take out the garbage',  ja: 'ごみを出す' },
    { en: 'walk my dog',  ja: 'イヌの散歩をする' },
    { en: 'wash the dishes',  ja: '皿洗いをする' },
    { en: 'clean the bath',  ja: 'ふろそうじをする' },
    { en: 'set the table',  ja: '食卓の準備をする' },
    { en: 'clean my room',  ja: '自分のへやをそうじする' }
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
        '英単語小6クイズゲーム',
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
