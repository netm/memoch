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
    { en: 'abroad',  ja: '外国で' },
    { en: 'absent',  ja: '欠席の' },
    { en: 'accident',  ja: '事故、偶然' },
    { en: 'add',  ja: '加える' },
    { en: 'advertise',  ja: '宣伝する' },
    { en: 'advice',  ja: '忠告' },
    { en: 'advise',  ja: '忠告する，助言する' },
    { en: 'afraid',  ja: '恐れて' },
    { en: 'again',  ja: '再び, また' },
    { en: 'against',  ja: '反対して' },
    { en: 'ago',  ja: '～前に' },
    { en: 'agree',  ja: '賛成する' },
    { en: 'air',  ja: '空気' },
    { en: 'airport',  ja: '空港' },
    { en: 'album',  ja: 'アルバム' },
    { en: 'alien',  ja: '異星人' },
    { en: 'almost',  ja: 'ほとんど' },
    { en: 'alone',  ja: 'ただひとりの' },
    { en: 'also',  ja: '…もまた' },
    { en: 'always',  ja: 'いつも' },
    { en: 'America',  ja: 'アメリカ' },
    { en: 'American',  ja: 'アメリカの' },
    { en: 'angry',  ja: '怒って' },
    { en: 'animal',  ja: '動物' },
    { en: 'another',  ja: 'もう1つの' },
    { en: 'answer',  ja: '答える' },
    { en: 'anyone',  ja: 'だれか' },
    { en: 'anything',  ja: '何でも' },
    { en: 'anywhere',  ja: 'どこへでも' },
    { en: 'arm',  ja: '腕' },
    { en: 'art',  ja: '美術，芸術' },
    { en: 'as',  ja: '…として' },
    { en: 'Asia',  ja: 'アジア' },
    { en: 'ask',  ja: 'たずねる，頼む' },
    { en: 'baby',  ja: '赤ん坊' },
    { en: 'bad',  ja: '悪い' },
    { en: 'ball',  ja: 'ボール' },
    { en: 'ballpark',  ja: '野球場' },
    { en: 'band',  ja: 'バンド' },
    { en: 'bar',  ja: '棒，横木' },
    { en: 'bar ※not nightclub',  ja: '棒，横木' },
    { en: 'bath',  ja: '風呂' },
    { en: 'beach',  ja: '浜' },
    { en: 'bear',  ja: 'クマ' },
    { en: 'became',  ja: '…になった' },
    { en: 'because',  ja: 'なぜならば…だから' },
    { en: 'become',  ja: '～になる' },
    { en: 'beef',  ja: '牛肉' },
    { en: 'beer',  ja: 'ビール' },
    { en: 'began',  ja: '始めた、始まった' },
    { en: 'begin',  ja: '始まる(める)' },
    { en: 'believe',  ja: '信じる' },
    { en: 'bell',  ja: 'ベル' },
    { en: 'belt',  ja: 'ベルト' },
    { en: 'bench',  ja: 'ベンチ' },
    { en: 'best wishes',  ja: '手紙などの結びことば' },
    { en: 'better',  ja: 'よりよい' },
    { en: 'bicycle',  ja: '自転車' },
    { en: 'birthday',  ja: '誕生日' },
    { en: 'black',  ja: '黒い' },
    { en: 'blue',  ja: '青い' },
    { en: 'body',  ja: '身体' },
    { en: 'book',  ja: '本' },
    { en: 'boring',  ja: '退屈な' },
    { en: 'borrow',  ja: '借りる' },
    { en: 'bought',  ja: '買った' },
    { en: 'boy',  ja: '男の子' },
    { en: 'break',  ja: '折る' },
    { en: 'bridge',  ja: '橋' },
    { en: 'bright',  ja: '明るい' },
    { en: 'bring',  ja: '持って来る' },
    { en: 'broke',  ja: '折た' },
    { en: 'brought',  ja: '持ってきた' },
    { en: 'brown',  ja: '茶色の' },
    { en: 'build',  ja: '建てる' },
    { en: 'building',  ja: '建物' },
    { en: 'business',  ja: '商売' },
    { en: 'butter',  ja: 'バター' },
    { en: 'buy',  ja: '買う' },
    { en: 'call',  ja: '電話をかける' },
    { en: 'camp',  ja: 'キャンプ' },
    { en: 'candle',  ja: 'ろうそく' },
    { en: 'candy',  ja: 'キャンディー' },
    { en: 'capital',  ja: '首都' },
    { en: 'card',  ja: 'カード' },
    { en: 'care',  ja: '気にする' },
    { en: 'carpet',  ja: 'じゅうたん' },
    { en: 'carry',  ja: '運ぶ' },
    { en: 'catch',  ja: 'つかまえる' },
    { en: 'caught',  ja: 'つかまえた' },
    { en: 'center',  ja: '中央' },
    { en: 'chain',  ja: 'くさり' },
    { en: 'chalk',  ja: 'チョーク' },
    { en: 'change',  ja: '変わる' },
    { en: 'character',  ja: '登場人物' },
    { en: 'chicken',  ja: 'ニワトリ' },
    { en: 'child',  ja: '子供' },
    { en: 'children',  ja: '子供たち' },
    { en: 'choose',  ja: '選ぶ' },
    { en: 'Christmas',  ja: 'クリスマス' },
    { en: 'church',  ja: '教会' },
    { en: 'circle',  ja: '円' },
    { en: 'classroom',  ja: '教室' },
    { en: 'clean',  ja: '掃除する' },
    { en: 'clever',  ja: '利口な' },
    { en: 'climb',  ja: '登る' },
    { en: 'clock',  ja: '置き時計' },
    { en: 'close',  ja: '閉じる' },
    { en: 'cloth',  ja: '布' },
    { en: 'clothes',  ja: '服' },
    { en: 'cloud',  ja: '雲' },
    { en: 'cloudy',  ja: '曇った' },
    { en: 'club',  ja: 'クラブ' },
    { en: 'coat',  ja: 'コート' },
    { en: 'coffee',  ja: 'コーヒー' },
    { en: 'coin',  ja: '硬貨' },
    { en: 'college',  ja: '大学' },
    { en: 'color',  ja: '色' },
    { en: 'comic',  ja: 'マンガ' },
    { en: 'communication',  ja: 'コミュニケーション' },
    { en: 'compare',  ja: '比べる' },
    { en: 'complain',  ja: '不満を言う' },
    { en: 'computer',  ja: 'コンピュータ' },
    { en: 'contest',  ja: 'コンテスト' },
    { en: 'cool',  ja: 'かっこいい' },
    { en: 'corner',  ja: 'かど' },
    { en: 'could',  ja: '…してくださいませんか' },
    { en: 'cried',  ja: '泣いた' },
    { en: 'cry',  ja: '泣く' },
    { en: 'culture',  ja: '文化' },
    { en: 'cut',  ja: '切る' },
    { en: 'cute',  ja: 'かわいい' },
    { en: 'dark',  ja: '暗い' },
    { en: 'date',  ja: '日付' },
    { en: 'dear',  ja: '親愛なる' },
    { en: 'decide',  ja: '決心する' },
    { en: 'deep',  ja: '深い' },
    { en: 'dictionary',  ja: '辞書' },
    { en: 'die',  ja: '死ぬ' },
    { en: 'different',  ja: '違った' },
    { en: 'difficult',  ja: 'むずかしい' },
    { en: 'disagree',  ja: '意見が合わない' },
    { en: 'discover',  ja: '発見する' },
    { en: 'dish',  ja: '皿，料理' },
    { en: 'dislike',  ja: '嫌う' },
    { en: 'dollar',  ja: 'ドル' },
    { en: 'down',  ja: 'を通って' },
    { en: 'draw',  ja: '描く，引く' },
    { en: 'dream',  ja: '夢' },
    { en: 'dress',  ja: '着る' },
    { en: 'drink',  ja: '飲む' },
    { en: 'drive',  ja: '運転する' },
    { en: 'dry',  ja: '乾く' },
    { en: 'duck',  ja: 'あひる' },
    { en: 'dump',  ja: 'ごみ捨て場' },
    { en: 'during',  ja: '～の間、～の中' },
    { en: 'each',  ja: 'おのおのの' },
    { en: 'ear',  ja: '耳' },
    { en: 'earth',  ja: '地球，大地' },
    { en: 'eat',  ja: '食べる' },
    { en: 'echo',  ja: 'こだま' },
    { en: 'elevator',  ja: 'エレベーター' },
    { en: 'else',  ja: 'ほかに' },
    { en: 'email',  ja: 'Eメール' },
    { en: 'end',  ja: '終わる' },
    { en: 'English',  ja: '英語' },
    { en: 'enough',  ja: '十分な' },
    { en: 'enter',  ja: '入る' },
    { en: 'e-pal',  ja: 'Eメル友達' },
    { en: 'eraser',  ja: '消しゴム' },
    { en: 'everything',  ja: 'あらゆること' },
    { en: 'example',  ja: '例' },
    { en: 'exchange',  ja: '交換する、両替する' },
    { en: 'exciting',  ja: '興奮させる' },
    { en: 'excuse',  ja: '許す' },
    { en: 'eye',  ja: '目' },
    { en: 'face',  ja: '顔' },
    { en: 'factory',  ja: '工場' },
    { en: 'fail',  ja: '失敗する' },
    { en: 'fall',  ja: '落ちる' },
    { en: 'famous',  ja: '有名な' },
    { en: 'fan',  ja: 'ファン' },
    { en: 'far',  ja: '遠く' },
    { en: 'farm',  ja: '農場' },
    { en: 'farmer',  ja: '農場主' },
    { en: 'favor',  ja: '親切な行為' },
    { en: 'feel',  ja: '感じる' },
    { en: 'feeling',  ja: '感覚' },
    { en: 'fell',  ja: '落ちた' },
    { en: 'festival',  ja: '祭典' },
    { en: 'few',  ja: '(aをつけ)少数の' },
    { en: 'fiction',  ja: '小説' },
    { en: 'fill',  ja: 'いっぱいにする' },
    { en: 'find',  ja: '見つける，～とわかる' },
    { en: 'fine',  ja: '元気な' },
    { en: 'finger',  ja: '指' },
    { en: 'finish',  ja: '終える' },
    { en: 'fire',  ja: '火' },
    { en: 'fish',  ja: '魚' },
    { en: 'flew',  ja: '飛んだ' },
    { en: 'fly',  ja: '飛行機で行く，飛ぶ' },
    { en: 'food',  ja: '食べ物' },
    { en: 'fool',  ja: '馬鹿' },
    { en: 'foolish',  ja: '愚かな' },
    { en: 'foot',  ja: '足' },
    { en: 'football',  ja: 'フットボール' },
    { en: 'foreign',  ja: '外国の' },
    { en: 'forever',  ja: '永久に' },
    { en: 'forget',  ja: '忘れる' },
    { en: 'fork',  ja: 'フォーク' },
    { en: 'found',  ja: '見つけた' },
    { en: 'free',  ja: '自由な，ひまな' },
    { en: 'front',  ja: '前' },
    { en: 'full',  ja: 'いっぱいの' },
    { en: 'fun',  ja: '楽しみ' },
    { en: 'future',  ja: '未来' },
    { en: 'game',  ja: '試合' },
    { en: 'garbage',  ja: 'ごみ、生ごみ' },
    { en: 'gave',  ja: 'give の過去形' },
    { en: 'gentleman',  ja: '紳士' },
    { en: 'gift',  ja: '贈り物' },
    { en: 'girl',  ja: '女の子' },
    { en: 'give',  ja: '与える' },
    { en: 'glove',  ja: 'グローブ' },
    { en: 'god',  ja: '神' },
    { en: 'gold',  ja: '金' },
    { en: 'grade',  ja: '学年' },
    { en: 'grandfather',  ja: '祖父' },
    { en: 'grandmother',  ja: '祖母' },
    { en: 'grass',  ja: '草' },
    { en: 'great',  ja: 'すばらしい，広大な' },
    { en: 'green',  ja: '緑' },
    { en: 'ground',  ja: '地面' },
    { en: 'group',  ja: 'グループ' },
    { en: 'grow',  ja: '成長する，になる，増加する，育てる' },
    { en: 'guest',  ja: '客' },
    { en: 'guitar',  ja: 'ギター' },
    { en: 'gun',  ja: '鉄砲' },
    { en: 'habit',  ja: '習慣' },
    { en: 'hair',  ja: '髪' },
    { en: 'happen',  ja: '起こる' },
    { en: 'happiness',  ja: '幸福' },
    { en: 'hat',  ja: '帽子' },
    { en: 'hate',  ja: '憎む' },
    { en: 'head',  ja: '頭，先頭' },
    { en: 'headache',  ja: '頭痛' },
    { en: 'health',  ja: '健康' },
    { en: 'hear',  ja: '聞く' },
    { en: 'hear from',  ja: '…から便りをもらう' },
    { en: 'heard',  ja: '聞いた' },
    { en: 'heart',  ja: '心' },
    { en: 'hill',  ja: '丘' },
    { en: 'history',  ja: '歴史' },
    { en: 'hit',  ja: '当たる' },
    { en: 'hobby',  ja: '趣味' },
    { en: 'hold',  ja: '握る，開催する，差し出す' },
    { en: 'hole',  ja: '穴' },
    { en: 'holiday',  ja: '休日' },
    { en: 'home',  ja: '故郷，家' },
    { en: 'homeroom',  ja: 'ホームルーム' },
    { en: 'homestay',  ja: 'ホームステイ' },
    { en: 'hope',  ja: '希望' },
    { en: 'horse',  ja: '馬' },
    { en: 'host',  ja: '主催する' },
    { en: 'hour',  ja: '１時間, 時間' },
    { en: 'housework',  ja: '家事' },
    { en: 'human',  ja: '人間の' },
    { en: 'hundred',  ja: '百' },
    { en: 'hunt',  ja: '狩りをする' },
    { en: 'hurry',  ja: '急ぐ' },
    { en: 'ice',  ja: '氷' },
    { en: 'idea',  ja: '考え' },
    { en: 'if',  ja: 'もし…ならば' },
    { en: 'imagine',  ja: '想像する' },
    { en: 'important',  ja: '重要な' },
    { en: 'industrial',  ja: '工業の、産業の' },
    { en: 'inside',  ja: '内側' },
    { en: 'interested',  ja: '興味をもった' },
    { en: 'interesting',  ja: 'おもしろい' },
    { en: 'Internet',  ja: 'インターネット' },
    { en: 'into',  ja: '…の中へ[に]' },
    { en: 'invite',  ja: '招待する' },
    { en: 'island',  ja: '島' },
    { en: 'job',  ja: '仕事' },
    { en: 'join',  ja: '参加する' },
    { en: 'jump',  ja: '跳ぶ' },
    { en: 'keep',  ja: '保つ，～を(持ち)続ける' },
    { en: 'key',  ja: '鍵' },
    { en: 'key chain',  ja: 'キーホルダー' },
    { en: 'kill',  ja: '殺す' },
    { en: 'kind',  ja: '種類' },
    { en: 'king',  ja: '王様' },
    { en: 'knife',  ja: 'ナイフ' },
    { en: 'lady',  ja: '婦人' },
    { en: 'lake',  ja: '湖' },
    { en: 'land',  ja: '陸地，土地' },
    { en: 'language',  ja: '言語' },
    { en: 'last',  ja: '最後' },
    { en: 'later',  ja: 'のちに' },
    { en: 'laugh',  ja: '笑う' },
    { en: 'law',  ja: '法律' },
    { en: 'leaf',  ja: '葉' },
    { en: 'learn',  ja: '学ぶ、習う' },
    { en: 'left',  ja: '出た' },
    { en: 'leg',  ja: '脚' },
    { en: 'lend',  ja: '貸す' },
    { en: 'lesson',  ja: '授業，課' },
    { en: 'letter',  ja: '手紙' },
    { en: 'library',  ja: '図書館' },
    { en: 'lie',  ja: '嘘' },
    { en: 'life',  ja: '生活，生命，人生' },
    { en: 'light',  ja: '光，明かり，信号' },
    { en: 'lion',  ja: 'ライオン' },
    { en: 'listen',  ja: '聴く' },
    { en: 'little',  ja: '小さい' },
    { en: 'locker',  ja: 'ロッカー' },
    { en: 'lose',  ja: '失う，負ける' },
    { en: 'loud',  ja: '(声の)大きい' },
    { en: 'love',  ja: '愛，愛する人' },
    { en: 'low',  ja: '低い' },
    { en: 'lucky',  ja: '好運な' },
    { en: 'machine',  ja: '機械' },
    { en: 'made',  ja: '作った' },
    { en: 'magazine',  ja: '雑誌' },
    { en: 'magic',  ja: '魔法の' },
    { en: 'main',  ja: '主な' },
    { en: 'make',  ja: '作る' },
    { en: 'market',  ja: '市場' },
    { en: 'math',  ja: '数学' },
    { en: 'may',  ja: '…してもよいですか' },
    { en: 'mean',  ja: '意味する' },
    { en: 'meat',  ja: '肉' },
    { en: 'medal',  ja: 'メダル' },
    { en: 'medicine',  ja: '薬' },
    { en: 'member',  ja: '会員' },
    { en: 'message',  ja: '伝言' },
    { en: 'met',  ja: '会った' },
    { en: 'meter',  ja: 'メートル' },
    { en: 'mile',  ja: 'マイル' },
    { en: 'million',  ja: '１００万' },
    { en: 'mind',  ja: '心' },
    { en: 'mirror',  ja: '鏡' },
    { en: 'mistake',  ja: '誤り' },
    { en: 'money',  ja: 'お金' },
    { en: 'monkey',  ja: 'サル' },
    { en: 'monster',  ja: '怪物' },
    { en: 'moon',  ja: '月' },
    { en: 'more',  ja: '(..より)もっと' },
    { en: 'most',  ja: '最も' },
    { en: 'motto',  ja: 'モットー' },
    { en: 'mountain',  ja: '山' },
    { en: 'mouse',  ja: 'はつかねずみ' },
    { en: 'mouth',  ja: '口' },
    { en: 'movie',  ja: '映画' },
    { en: 'moving',  ja: '感動的な' },
    { en: 'museum',  ja: '博物館' },
    { en: 'music',  ja: '音楽' },
    { en: 'must',  ja: '…しなければならない' },
    { en: 'name',  ja: '名づける' },
    { en: 'nature',  ja: '自然' },
    { en: 'near',  ja: 'の近くに' },
    { en: 'neck',  ja: '首' },
    { en: 'need',  ja: '必要である' },
    { en: 'nest',  ja: '巣' },
    { en: 'news',  ja: 'ニュース' },
    { en: 'newspaper',  ja: '新聞' },
    { en: 'next',  ja: '次に' },
    { en: 'noise',  ja: '物音' },
    { en: 'nose',  ja: '鼻' },
    { en: 'notice',  ja: '気がつく' },
    { en: 'nuclear',  ja: '核の' },
    { en: 'of course',  ja: 'もちろん' },
    { en: 'oil',  ja: '油' },
    { en: 'once',  ja: '以前は' },
    { en: 'opinion',  ja: '意見' },
    { en: 'organ',  ja: 'オルガン' },
    { en: 'other',  ja: 'ほかの' },
    { en: 'overcoat',  ja: 'オーバー' },
    { en: 'own',  ja: '自分の' },
    { en: 'paint',  ja: '描く，(～に)ペンキを塗る' },
    { en: 'pants',  ja: 'ズボン' },
    { en: 'paper',  ja: '紙，レポート' },
    { en: 'parent',  ja: '親' },
    { en: 'part',  ja: '部分' },
    { en: 'party',  ja: 'パーティー' },
    { en: 'pass',  ja: '過ぎる，合格する，手渡す' },
    { en: 'passport',  ja: 'パスポート' },
    { en: 'past',  ja: '過去の' },
    { en: 'pay',  ja: '支払う' },
    { en: 'peace',  ja: '平和' },
    { en: 'peanut',  ja: 'ピーナッツ' },
    { en: 'pencil',  ja: 'えんぴつ' },
    { en: 'penguin',  ja: 'ペンギン' },
    { en: 'people',  ja: '人々' },
    { en: 'perfect',  ja: '完璧な' },
    { en: 'person',  ja: '人' },
    { en: 'pet',  ja: 'ペット' },
    { en: 'phone',  ja: '電話' },
    { en: 'photo',  ja: '写真' },
    { en: 'pick',  ja: '選ぶ，摘む' },
    { en: 'picnic',  ja: 'ピクニック' },
    { en: 'pie',  ja: 'パイ' },
    { en: 'piece',  ja: '断片' },
    { en: 'pig',  ja: 'ブタ' },
    { en: 'place',  ja: '場所' },
    { en: 'plan',  ja: '計画' },
    { en: 'plane',  ja: '飛行機' },
    { en: 'planet',  ja: '惑星' },
    { en: 'pocket',  ja: 'ポケット' },
    { en: 'poem',  ja: '詩' },
    { en: 'point',  ja: '指さす' },
    { en: 'police',  ja: '警察' },
    { en: 'pond',  ja: '池' },
    { en: 'poor',  ja: 'かわいそうな' },
    { en: 'popular',  ja: '人気のある' },
    { en: 'pork',  ja: 'ブタ肉' },
    { en: 'port',  ja: '港' },
    { en: 'post',  ja: '郵便' },
    { en: 'post office',  ja: '郵便局' },
    { en: 'potato',  ja: 'じゃがいも' },
    { en: 'practice',  ja: '練習する' },
    { en: 'present',  ja: 'プレゼント' },
    { en: 'pretty',  ja: 'きれいな' },
    { en: 'problem',  ja: '問題' },
    { en: 'program',  ja: '番組' },
    { en: 'purpose',  ja: '目的' },
    { en: 'push',  ja: '押す' },
    { en: 'question',  ja: '質問' },
    { en: 'quiet',  ja: '静かな' },
    { en: 'rabbit',  ja: 'ウサギ' },
    { en: 'radio',  ja: 'ラジオ' },
    { en: 'rain',  ja: '雨' },
    { en: 'rainy',  ja: '雨降りの' },
    { en: 'rat',  ja: 'ネズミ' },
    { en: 'read',  ja: '読む' },
    { en: 'ready',  ja: '用意できている' },
    { en: 'record',  ja: 'レコード' },
    { en: 'remember',  ja: '思い出す，覚えている' },
    { en: 'rest',  ja: '休息する' },
    { en: 'return',  ja: 'お返し' },
    { en: 'rice',  ja: 'ご飯' },
    { en: 'right',  ja: '正しい，右に' },
    { en: 'ring',  ja: '指輪' },
    { en: 'rise',  ja: '起き上がる，のぼる' },
    { en: 'river',  ja: '川' },
    { en: 'road',  ja: '道' },
    { en: 'rock',  ja: 'ロック' },
    { en: 'roof',  ja: '屋根' },
    { en: 'room',  ja: '部屋' },
    { en: 'sad',  ja: '悲しい' },
    { en: 'said',  ja: '言った' },
    { en: 'sail',  ja: '(船を)走らせる' },
    { en: 'sailor',  ja: '船員' },
    { en: 'sale',  ja: '特売' },
    { en: 'salt',  ja: '塩' },
    { en: 'same',  ja: '同じ' },
    { en: 'sang',  ja: '歌った' },
    { en: 'say',  ja: '言う' },
    { en: 'sea',  ja: '海' },
    { en: 'seat',  ja: '座席' },
    { en: 'see',  ja: '見る，わかる，調査する' },
    { en: 'seem',  ja: '～のように思われる' },
    { en: 'send',  ja: '送る' },
    { en: 'sent',  ja: '送った' },
    { en: 'set',  ja: '置く' },
    { en: 'shall',  ja: '…しましょうか。' },
    { en: 'shine',  ja: '光る，輝く' },
    { en: 'ship',  ja: '船' },
    { en: 'shirt',  ja: 'シャツ' },
    { en: 'shoe',  ja: '靴' },
    { en: 'shop',  ja: '店' },
    { en: 'shopping',  ja: '買い物' },
    { en: 'should',  ja: '…すべきである' },
    { en: 'shoulder',  ja: '肩' },
    { en: 'shout',  ja: '叫ぶ' },
    { en: 'show',  ja: 'ショー' },
    { en: 'sick',  ja: '病気の' },
    { en: 'side',  ja: '側面' },
    { en: 'sightseeing',  ja: '観光' },
    { en: 'simple',  ja: '簡単な' },
    { en: 'sing',  ja: '歌う' },
    { en: 'singer',  ja: '歌手' },
    { en: 'sit',  ja: '座る' },
    { en: 'skate',  ja: 'スケートをする' },
    { en: 'ski',  ja: 'スキーをする' },
    { en: 'skirt',  ja: 'スカート' },
    { en: 'sky',  ja: '空' },
    { en: 'sleep',  ja: '眠る' },
    { en: 'smile',  ja: 'ほお笑み' },
    { en: 'snow',  ja: '雪' },
    { en: 'soccer',  ja: 'サッカー' },
    { en: 'softball',  ja: 'ソフトボール' },
    { en: 'someone',  ja: 'だれか' },
    { en: 'something',  ja: '何かあるもの' },
    { en: 'song',  ja: '歌' },
    { en: 'sound',  ja: '音' },
    { en: 'space',  ja: '宇宙' },
    { en: 'spaceship',  ja: '宇宙船' },
    { en: 'special',  ja: '特別の' },
    { en: 'speech',  ja: '演説' },
    { en: 'spend',  ja: '費やす，過ごす' },
    { en: 'sport',  ja: 'スポーツ' },
    { en: 'stand',  ja: '立っている' },
    { en: 'star',  ja: '星，スター' },
    { en: 'start',  ja: '出発する，～を始める' },
    { en: 'station',  ja: '駅' },
    { en: 'stay',  ja: '滞在(する)' },
    { en: 'still',  ja: 'まだ' },
    { en: 'stone',  ja: '石' },
    { en: 'stop',  ja: '止める' },
    { en: 'store',  ja: '店' },
    { en: 'storm',  ja: '嵐' },
    { en: 'story',  ja: '話' },
    { en: 'strange',  ja: '奇妙な' },
    { en: 'street',  ja: '通り' },
    { en: 'strike',  ja: '打つ' },
    { en: 'strong',  ja: '強い' },
    { en: 'success',  ja: '成功' },
    { en: 'such',  ja: 'そのような' },
    { en: 'sugar',  ja: '砂糖' },
    { en: 'sun',  ja: '太陽' },
    { en: 'sure',  ja: '確信して' },
    { en: 'surf',  ja: 'ネットサーフィンする' },
    { en: 'surprised',  ja: '驚いた' },
    { en: 'sweater',  ja: 'セーター' },
    { en: 'table',  ja: 'テーブル' },
    { en: 'take',  ja: '連れて行く，持っていく，取る' },
    { en: 'take care',  ja: 'おだいじに' },
    { en: 'talk',  ja: '話す' },
    { en: 'taught',  ja: '教えた' },
    { en: 'tea',  ja: 'お茶' },
    { en: 'teach',  ja: '教える' },
    { en: 'team',  ja: 'チーム' },
    { en: 'tell',  ja: '教える，語る' },
    { en: 'test',  ja: '試験' },
    { en: 'test paper',  ja: '試験の答案用紙' },
    { en: 'textbook',  ja: '教科書' },
    { en: 'than',  ja: '…よりも' },
    { en: 'thank',  ja: '感謝する' },
    { en: 'thing',  ja: 'もの、こと' },
    { en: 'think',  ja: '考える' },
    { en: 'thirsty',  ja: 'のどが渇いた' },
    { en: 'thought',  ja: '考えた、思った' },
    { en: 'thousand',  ja: '千' },
    { en: 'threw',  ja: '投げた' },
    { en: 'through',  ja: '…を通じて' },
    { en: 'throw',  ja: '投げる' },
    { en: 'tired',  ja: '疲れて' },
    { en: 'together',  ja: 'いっしょに' },
    { en: 'told',  ja: '教えた' },
    { en: 'tomorrow',  ja: '明日' },
    { en: 'ton',  ja: 'トン' },
    { en: 'took',  ja: '取った' },
    { en: 'tooth',  ja: '歯' },
    { en: 'top',  ja: '頂上' },
    { en: 'town',  ja: '町' },
    { en: 'traffic light',  ja: '交通信号' },
    { en: 'train',  ja: '列車' },
    { en: 'travel',  ja: '旅行' },
    { en: 'trip',  ja: '旅行' },
    { en: 'truck',  ja: 'トラック' },
    { en: 'try',  ja: '努める' },
    { en: 'T-shirt',  ja: 'ティーシャツ' },
    { en: 'turn',  ja: '曲がる，回る，変化する' },
    { en: 'TV',  ja: 'テレビ' },
    { en: 'uh-huh',  ja: 'うんうん' },
    { en: 'understand',  ja: '理解する' },
    { en: 'United States',  ja: 'アメリカ合衆国' },
    { en: 'useful',  ja: '役に立つ' },
    { en: 'usual',  ja: '通常の' },
    { en: 'usual ～',  ja: '通常の' },
    { en: 'vacation',  ja: '休暇' },
    { en: 'vegetable',  ja: '野菜' },
    { en: 'video',  ja: 'ビデオ' },
    { en: 'video game',  ja: 'ビデオゲーム' },
    { en: 'village',  ja: '村' },
    { en: 'visit',  ja: '訪れる' },
    { en: 'voice',  ja: '声' },
    { en: 'wake',  ja: '目が覚める' },
    { en: 'war',  ja: '戦争' },
    { en: 'warm',  ja: 'あたたかい' },
    { en: 'was',  ja: '[is, am]…であった' },
    { en: 'wash',  ja: '押し流す' },
    { en: 'waste',  ja: '廃棄物' },
    { en: 'watch',  ja: '見る' },
    { en: 'water',  ja: '水' },
    { en: 'way',  ja: '道、方法、やりかた' },
    { en: 'weak',  ja: '弱い' },
    { en: 'wear',  ja: '着る' },
    { en: 'weekend',  ja: '週末' },
    { en: 'weigh',  ja: '重さがある' },
    { en: 'welcome',  ja: 'ようこそ' },
    { en: 'well',  ja: '健康な' },
    { en: 'were',  ja: '[are]…であった' },
    { en: 'west',  ja: '西' },
    { en: 'white',  ja: '白い' },
    { en: 'why',  ja: 'なぜ' },
    { en: 'wide',  ja: '幅が広い' },
    { en: 'wife',  ja: '妻' },
    { en: 'will',  ja: '…するつもりである' },
    { en: 'win',  ja: '勝つ' },
    { en: 'wind',  ja: '風' },
    { en: 'wish',  ja: '望む' },
    { en: 'without',  ja: '…なしで[に]' },
    { en: 'wonderful',  ja: 'すばらしい' },
    { en: 'wood',  ja: '木材' },
    { en: 'word',  ja: '言葉' },
    { en: 'work',  ja: '働く' },
    { en: 'world',  ja: '世界' },
    { en: 'worry',  ja: '悩ませる' },
    { en: 'wrong',  ja: '調子が悪い' },
    { en: 'yellow',  ja: '黄色の' },
    { en: 'young',  ja: '若い' },
    { en: 'zoo',  ja: '動物園' }
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
        '英単語の暗記サイト中学二年生の英単語クイズゲーム',
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
