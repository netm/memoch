// 全文: 中学一年生の漢字問題ブラウザゲーム - js
// - 漢字をランダム出題
// - よみがな(ひらがな)を入力してEnterまたは「回答」ボタンで判定
// - 正解なら「正解」を1秒表示して次の問題
(() => {
  'use strict';

  // 漢字データ: {kanji: '漢字', yomigana: 'ひらがな'} の配列
  // 中学1年程度でよく出る漢字・読みをサンプル収録
  const ITEMS = [
  { kanji: '雨', yomigana: 'あめ' },
  { kanji: '王', yomigana: 'おう' },
  { kanji: '音', yomigana: 'おと' },
  { kanji: '花', yomigana: 'はな' },
  { kanji: '貝', yomigana: 'かい' },
  { kanji: '学', yomigana: 'がく' },
  { kanji: '気', yomigana: 'き' },
  { kanji: '休', yomigana: 'きゅう' },
  { kanji: '玉', yomigana: 'たま' },
  { kanji: '金', yomigana: 'きん' },
  { kanji: '空', yomigana: 'そら' },
  { kanji: '校', yomigana: 'こう' },
  { kanji: '糸', yomigana: 'いと' },
  { kanji: '字', yomigana: 'じ' },
  { kanji: '耳', yomigana: 'みみ' },
  { kanji: '車', yomigana: 'くるま' },
  { kanji: '手', yomigana: 'て' },
  { kanji: '森', yomigana: 'もり' },
  { kanji: '正', yomigana: 'ただ' },
  { kanji: '青', yomigana: 'あお' },
  { kanji: '先', yomigana: 'さき' },
  { kanji: '花', yomigana: 'はな' },
  { kanji: '林', yomigana: 'はやし' },
  { kanji: '話', yomigana: 'はなし' },
  { kanji: '向', yomigana: 'む' },
  { kanji: '道', yomigana: 'みち' },
  { kanji: '気', yomigana: 'き' },
  { kanji: '英', yomigana: 'えい' },
  { kanji: '歌', yomigana: 'うた' },
  { kanji: '図', yomigana: 'ず' },
  { kanji: '画', yomigana: 'が' },
  { kanji: '考', yomigana: 'こう' },
  { kanji: '場', yomigana: 'ば' },
  { kanji: '通', yomigana: 'とお' },
  { kanji: '館', yomigana: 'かん' },
  { kanji: '疲', yomigana: 'ひ' },
  { kanji: '疑', yomigana: 'うたが' },
  { kanji: '英', yomigana: 'えい' },
  { kanji: '院', yomigana: 'いん' },
  { kanji: '歌', yomigana: 'うた' },
  { kanji: '員', yomigana: 'いん' },
  { kanji: '夏', yomigana: 'なつ' },
  { kanji: '画', yomigana: 'が' },
  { kanji: '寒', yomigana: 'かん' },
  { kanji: '銀', yomigana: 'ぎん' },
  { kanji: '黒', yomigana: 'くろ' },
  { kanji: '周', yomigana: 'しゅう' },
  { kanji: '組', yomigana: 'くみ' },
  { kanji: '集', yomigana: 'あつ' },
  { kanji: '辞', yomigana: 'じ' },
  { kanji: '落', yomigana: 'お' },
  { kanji: '試', yomigana: 'し' },
  { kanji: '験', yomigana: 'けん' },
  { kanji: '業', yomigana: 'ぎょう' },
  { kanji: '教', yomigana: 'きょう' },
  { kanji: '室', yomigana: 'しつ' },
  { kanji: '働', yomigana: 'どう' },
  { kanji: '朝', yomigana: 'あさ' },
  { kanji: '終', yomigana: 'お' },
  { kanji: '始', yomigana: 'はじ' },
  { kanji: '楽', yomigana: 'がく' },
  { kanji: '音', yomigana: 'おと' },
  { kanji: '歌', yomigana: 'うた' },
  { kanji: '家', yomigana: 'いえ' },
  { kanji: '族', yomigana: 'ぞく' },
  { kanji: '旅', yomigana: 'たび' },
  { kanji: '遠', yomigana: 'とお' },
  { kanji: '近', yomigana: 'ちか' },
  { kanji: '強', yomigana: 'つよ' },
  { kanji: '弱', yomigana: 'よわ' },
  { kanji: '速', yomigana: 'はや' },
  { kanji: '遅', yomigana: 'おく' },
  { kanji: '安', yomigana: 'やす' },
  { kanji: '暗', yomigana: 'くら' },
  { kanji: '明', yomigana: 'あか' },
  { kanji: '暗', yomigana: 'くら' },
  { kanji: '帰', yomigana: 'き' },
  { kanji: '着', yomigana: 'き' },
  { kanji: '買', yomigana: 'か' },
  { kanji: '売', yomigana: 'う' },
  { kanji: '使', yomigana: 'つか' },
  { kanji: '写', yomigana: 'うつ' },
  { kanji: '真', yomigana: 'しん' },
  { kanji: '且', yomigana: 'かつ' },
  { kanji: '以', yomigana: 'い' },
  { kanji: '位', yomigana: 'くらい' },
  { kanji: '委', yomigana: 'い' },
  { kanji: '威', yomigana: 'い' },
  { kanji: '為', yomigana: 'ため' },
  { kanji: '胃', yomigana: 'い' },
  { kanji: '尉', yomigana: 'い' },
  { kanji: '異', yomigana: 'こと' },
  { kanji: '移', yomigana: 'うつ' },
  { kanji: '因', yomigana: 'いん' },
  { kanji: '永', yomigana: 'えい' },
  { kanji: '泳', yomigana: 'およ' },
  { kanji: '影', yomigana: 'かげ' },
  { kanji: '英', yomigana: 'えい' },
  { kanji: '栄', yomigana: 'さか' },
  { kanji: '塩', yomigana: 'しお' },
  { kanji: '於', yomigana: 'お' },
  { kanji: '億', yomigana: 'おく' },
  { kanji: '屋', yomigana: 'や' },
  { kanji: '温', yomigana: 'おん' },
  { kanji: '穏', yomigana: 'おだ' },
  { kanji: '恩', yomigana: 'おん' },
  { kanji: '可', yomigana: 'か' },
  { kanji: '果', yomigana: 'は' },
  { kanji: '歌', yomigana: 'うた' },
  { kanji: '課', yomigana: 'か' },
  { kanji: '芽', yomigana: 'め' },
  { kanji: '賀', yomigana: 'が' },
  { kanji: '改', yomigana: 'あらた' },
  { kanji: '害', yomigana: 'がい' },
  { kanji: '街', yomigana: 'まち' },
  { kanji: '害', yomigana: 'がい' },
  { kanji: '各', yomigana: 'かく' },
  { kanji: '覚', yomigana: 'おぼ' },
  { kanji: '角', yomigana: 'かど' },
  { kanji: '割', yomigana: 'わ' },
  { kanji: '株', yomigana: 'かぶ' },
  { kanji: '乾', yomigana: 'かん' },
  { kanji: '缶', yomigana: 'かん' },
  { kanji: '管', yomigana: 'かん' },
  { kanji: '簡', yomigana: 'かん' },
  { kanji: '議', yomigana: 'ぎ' },
  { kanji: '疑', yomigana: 'うたが' },
  { kanji: '久', yomigana: 'ひさ' },
  { kanji: '旧', yomigana: 'ふる' },
  { kanji: '牛', yomigana: 'うし' },
  { kanji: '去', yomigana: 'さ' },
  { kanji: '橋', yomigana: 'はし' },
  { kanji: '業', yomigana: 'ぎょう' },
  { kanji: '曲', yomigana: 'きょく' },
  { kanji: '局', yomigana: 'きょく' },
  { kanji: '銀', yomigana: 'ぎん' },
  { kanji: '均', yomigana: 'きん' },
  { kanji: '禁', yomigana: 'きん' },
  { kanji: '近', yomigana: 'ちか' },
  { kanji: '巾', yomigana: 'きん' },
  { kanji: '琴', yomigana: 'こと' },
  { kanji: '号', yomigana: 'ごう' },
  { kanji: '合', yomigana: 'ごう' },
  { kanji: '航', yomigana: 'こう' },
  { kanji: '幸', yomigana: 'さち' },
  { kanji: '洪', yomigana: 'こう' },
  { kanji: '孝', yomigana: 'こう' },
  { kanji: '校', yomigana: 'こう' },
  { kanji: '光', yomigana: 'ひかり' },
  { kanji: '頃', yomigana: 'ころ' },
  { kanji: '乞', yomigana: 'こ' },
  { kanji: '刻', yomigana: 'こく' },
  { kanji: '込', yomigana: 'こ' },
  { kanji: '護', yomigana: 'ご' },
  { kanji: '困', yomigana: 'こま' },
  { kanji: '札', yomigana: 'さつ' },
  { kanji: '刷', yomigana: 'す' },
  { kanji: '察', yomigana: 'さつ' },
  { kanji: '察', yomigana: 'さつ' },
  { kanji: '参', yomigana: 'さん' },
  { kanji: '産', yomigana: 'さん' },
  { kanji: '酸', yomigana: 'さん' },
  { kanji: '散', yomigana: 'ち' },
  { kanji: '残', yomigana: 'のこ' },
  { kanji: '士', yomigana: 'し' },
  { kanji: '氏', yomigana: 'し' },
  { kanji: '死', yomigana: 'し' },
  { kanji: '視', yomigana: 'し' },
  { kanji: '詞', yomigana: 'し' },
  { kanji: '試', yomigana: 'し' },
  { kanji: '治', yomigana: 'じ' },
  { kanji: '辞', yomigana: 'じ' },
  { kanji: '失', yomigana: 'しつ' },
  { kanji: '質', yomigana: 'しつ' },
  { kanji: '若', yomigana: 'わか' },
  { kanji: '弱', yomigana: 'よわ' },
  { kanji: '砂', yomigana: 'すな' },
  { kanji: '座', yomigana: 'ざ' },
  { kanji: '済', yomigana: 'す' },
  { kanji: '祭', yomigana: 'まつ' },
  { kanji: '再', yomigana: 'さい' },
  { kanji: '在', yomigana: 'ざい' },
  { kanji: '妻', yomigana: 'つま' },
  { kanji: '亜', yomigana: 'あ' },
  { kanji: '唖', yomigana: 'あ' },
  { kanji: '挨', yomigana: 'あい' },
  { kanji: '愛', yomigana: 'あい' },
  { kanji: '挨', yomigana: 'あい' },
  { kanji: '暗', yomigana: 'くら' },
  { kanji: '案', yomigana: 'あん' },
  { kanji: '以', yomigana: 'い' },
  { kanji: '衣', yomigana: 'ころも' },
  { kanji: '位', yomigana: 'くらい' },
  { kanji: '囲', yomigana: 'かこ' },
  { kanji: '医', yomigana: 'い' },
  { kanji: '尉', yomigana: 'い' },
  { kanji: '異', yomigana: 'こと' },
  { kanji: '移', yomigana: 'うつ' },
  { kanji: '維', yomigana: 'い' },
  { kanji: '胃', yomigana: 'い' },
  { kanji: '依', yomigana: 'い' },
  { kanji: '域', yomigana: 'いき' },
  { kanji: '育', yomigana: 'いく' },
  { kanji: '員', yomigana: 'いん' },
  { kanji: '胤', yomigana: 'たね' },
  { kanji: '員', yomigana: 'いん' },
  { kanji: '陰', yomigana: 'かげ' },
  { kanji: '飲', yomigana: 'の' },
  { kanji: '隠', yomigana: 'かく' },
  { kanji: '雅', yomigana: 'みやび' },
  { kanji: '羽', yomigana: 'は' },
  { kanji: '運', yomigana: 'うん' },
  { kanji: '雲', yomigana: 'くも' },
  { kanji: '栄', yomigana: 'さか' },
  { kanji: '営', yomigana: 'いとな' },
  { kanji: '延', yomigana: 'の' },
  { kanji: '沿', yomigana: 'そ' },
  { kanji: '焉', yomigana: 'えん' },
  { kanji: '恩', yomigana: 'おん' },
  { kanji: '屋', yomigana: 'や' },
  { kanji: '岡', yomigana: 'おか' },
  { kanji: '億', yomigana: 'おく' },
  { kanji: '屋', yomigana: 'や' },
  { kanji: '乙', yomigana: 'おつ' },
  { kanji: '俺', yomigana: 'おれ' },
  { kanji: '卸', yomigana: 'おろ' },
  { kanji: '臆', yomigana: 'おく' },
  { kanji: '音', yomigana: 'おと' },
  { kanji: '化', yomigana: 'ば' },
  { kanji: '貨', yomigana: 'か' },
  { kanji: '過', yomigana: 'す' },
  { kanji: '果', yomigana: 'は' },
  { kanji: '架', yomigana: 'か' },
  { kanji: '河', yomigana: 'かわ' },
  { kanji: '可', yomigana: 'か' },
  { kanji: '賀', yomigana: 'が' },
  { kanji: '佳', yomigana: 'け' },
  { kanji: '夏', yomigana: 'なつ' },
  { kanji: '家', yomigana: 'いえ' },
  { kanji: '華', yomigana: 'はな' },
  { kanji: '荷', yomigana: 'に' },
  { kanji: '介', yomigana: 'かい' },
  { kanji: '回', yomigana: 'まわ' },
  { kanji: '改', yomigana: 'かい' },
  { kanji: '械', yomigana: 'かい' },
  { kanji: '階', yomigana: 'かい' },
  { kanji: '碍', yomigana: 'がい' },
  { kanji: '界', yomigana: 'かい' },
  { kanji: '皆', yomigana: 'みな' },
  { kanji: '絵', yomigana: 'え' },
  { kanji: '械', yomigana: 'かい' },
  { kanji: '開', yomigana: 'かい' },
  { kanji: '塊', yomigana: 'かい' },
  { kanji: '怪', yomigana: 'かい' },
  { kanji: '解', yomigana: 'と' },
  { kanji: '格', yomigana: 'かく' },
  { kanji: '額', yomigana: 'がく' },
  { kanji: '各', yomigana: 'かく' },
  { kanji: '較', yomigana: 'かく' },
  { kanji: '隔', yomigana: 'かく' },
  { kanji: '革', yomigana: 'かわ' },
  { kanji: '割', yomigana: 'わ' },
  { kanji: '歓', yomigana: 'よろこ' },
  { kanji: '環', yomigana: 'わ' },
  { kanji: '簡', yomigana: 'かん' },
  { kanji: '観', yomigana: 'み' },
  { kanji: '眼', yomigana: 'まなこ' },
  { kanji: '願', yomigana: 'がん' },
  { kanji: '希', yomigana: 'き' },
  { kanji: '姫', yomigana: 'ひめ' },
  { kanji: '飢', yomigana: 'う' },
  { kanji: '義', yomigana: 'ぎ' },
  { kanji: '疑', yomigana: 'うたが' },
  { kanji: '逆', yomigana: 'さか' },
  { kanji: '久', yomigana: 'ひさ' },
  { kanji: '旧', yomigana: 'ふる' },
  { kanji: '丘', yomigana: 'おか' },
  { kanji: '救', yomigana: 'すく' },
  { kanji: '握', yomigana: 'にぎ' },
  { kanji: '依', yomigana: 'い' },
  { kanji: '為', yomigana: 'ため' },
  { kanji: '違', yomigana: 'ちが' },
  { kanji: '維', yomigana: 'い' },
  { kanji: '壱', yomigana: 'いち' },
  { kanji: '隠', yomigana: 'かく' },
  { kanji: '芋', yomigana: 'いも' },
  { kanji: '鋭', yomigana: 'するど' },
  { kanji: '援', yomigana: 'えん' },
  { kanji: '煙', yomigana: 'けむ' },
  { kanji: '縁', yomigana: 'えん' },
  { kanji: '押', yomigana: 'お' },
  { kanji: '奥', yomigana: 'おく' },
  { kanji: '憶', yomigana: 'おく' },
  { kanji: '菓', yomigana: 'か' },
  { kanji: '暇', yomigana: 'ひま' },
  { kanji: '箇', yomigana: 'か' },
  { kanji: '雅', yomigana: 'みやび' },
  { kanji: '介', yomigana: 'かい' },
  { kanji: '戒', yomigana: 'いまし' },
  { kanji: '皆', yomigana: 'みな' },
  { kanji: '壊', yomigana: 'こわ' },
  { kanji: '較', yomigana: 'くら' },
  { kanji: '獲', yomigana: 'え' },
  { kanji: '割', yomigana: 'わ' },
  { kanji: '株', yomigana: 'かぶ' },
  { kanji: '乾', yomigana: 'かん' },
  { kanji: '勧', yomigana: 'すすめ' },
  { kanji: '喚', yomigana: 'わめ' },
  { kanji: '喚', yomigana: 'わめ' },
  { kanji: '換', yomigana: 'か' },
  { kanji: '漢', yomigana: 'かん' },
  { kanji: '緩', yomigana: 'ゆる' },
  { kanji: '缶', yomigana: 'かん' },
  { kanji: '肝', yomigana: 'きも' },
  { kanji: '陥', yomigana: 'かん' },
  { kanji: '紀', yomigana: 'き' },
  { kanji: '軌', yomigana: 'き' },
  { kanji: '揮', yomigana: 'き' },
  { kanji: '棄', yomigana: 'き' },
  { kanji: '幾', yomigana: 'き' },
  { kanji: '忌', yomigana: 'き' },
  { kanji: '既', yomigana: 'すで' },
  { kanji: '祈', yomigana: 'き' },
  { kanji: '鬼', yomigana: 'おに' },
  { kanji: '偽', yomigana: 'にせ' },
  { kanji: '儀', yomigana: 'ぎ' },
  { kanji: '宜', yomigana: 'ぎ' },
  { kanji: '戯', yomigana: 'ぎ' },
  { kanji: '吸', yomigana: 'す' },
  { kanji: '宮', yomigana: 'みや' },
  { kanji: '丘', yomigana: 'おか' },
  { kanji: '窮', yomigana: 'きゅう' },
  { kanji: '糾', yomigana: 'きゅう' },
  { kanji: '拒', yomigana: 'きょ' },
  { kanji: '拠', yomigana: 'きょ' },
  { kanji: '虚', yomigana: 'きょ' },
  { kanji: '享', yomigana: 'きょう' },
  { kanji: '興', yomigana: 'おこ' },
  { kanji: '挟', yomigana: 'はさ' },
  { kanji: '凶', yomigana: 'きょう' },
  { kanji: '叫', yomigana: 'さけ' },
  { kanji: '狂', yomigana: 'きょう' },
  { kanji: '況', yomigana: 'きょう' },
  { kanji: '暁', yomigana: 'あかつき' },
  { kanji: '矯', yomigana: 'きょう' },
  { kanji: '協', yomigana: 'きょう' },
  { kanji: '凝', yomigana: 'ぎょう' },
  { kanji: '斤', yomigana: 'きん' },
  { kanji: '菌', yomigana: 'きん' },
  { kanji: '緊', yomigana: 'きん' },
  { kanji: '愚', yomigana: 'ぐ' },
  { kanji: '偶', yomigana: 'ぐう' },
  { kanji: '遇', yomigana: 'ぐう' },
  { kanji: '継', yomigana: 'けい' },
  { kanji: '穴', yomigana: 'あな' },
  { kanji: '兼', yomigana: 'けん' },
  { kanji: '剣', yomigana: 'けん' },
  { kanji: '圏', yomigana: 'けん' },
  { kanji: '堅', yomigana: 'けん' },
  { kanji: '嫌', yomigana: 'いや' },
  { kanji: '献', yomigana: 'けん' },
  { kanji: '県', yomigana: 'けん' },
  { kanji: '謙', yomigana: 'けん' },
  { kanji: '賢', yomigana: 'けん' },
  { kanji: '軒', yomigana: 'けん' }
  ];

  // 教科書で代表的に扱われる音読み・訓読みのマップ
  // ここに載せた読みを候補として組合せ生成します（主要文字のみ）
  const KANJI_READINGS = {
  "雨": ["う", "あめ"],
  "王": ["おう", "おう"],
  "音": ["おん", "おと"],
  "花": ["か", "はな"],
  "貝": ["ばい", "かい"],
  "学": ["がく", "まな"],
  "気": ["き", "いき"],
  "休": ["きゅう", "やす"],
  "玉": ["ぎょく", "たま"],
  "金": ["きん", "かね"],
  "空": ["くう", "そら"],
  "校": ["こう", "こう"],
  "糸": ["し", "いと"],
  "字": ["じ", "あざ"],
  "耳": ["じ", "みみ"],
  "車": ["しゃ", "くるま"],
  "手": ["しゅ", "て"],
  "森": ["しん", "もり"],
  "正": ["せい", "ただ"],
  "青": ["せい", "あお"],
  "先": ["せん", "さき"],
  "林": ["りん", "はやし"],
  "話": ["わ", "はなし"],
  "向": ["こう", "む"],
  "道": ["どう", "みち"],
  "英": ["えい", "はなぶさ"],
  "歌": ["か", "うた"],
  "図": ["ず", "はか"],
  "画": ["が", "かく"],
  "考": ["こう", "かんが"],
  "場": ["じょう", "ば"],
  "通": ["つう", "とお"],
  "館": ["かん", "やかた"],
  "疲": ["ひ", "つか"],
  "疑": ["ぎ", "うたが"],
  "院": ["いん", "いん"],
  "員": ["いん", "かず"],
  "夏": ["か", "なつ"],
  "寒": ["かん", "さむ"],
  "銀": ["ぎん", "しろがね"],
  "黒": ["こく", "くろ"],
  "周": ["しゅう", "まわ"],
  "組": ["そ", "くみ"],
  "集": ["しゅう", "あつ"],
  "辞": ["じ", "やめ"],
  "落": ["らく", "お"],
  "試": ["し", "ため"],
  "験": ["けん", "ため"],
  "業": ["ぎょう", "わざ"],
  "教": ["きょう", "おし"],
  "室": ["しつ", "むろ"],
  "働": ["どう", "はたら"],
  "朝": ["ちょう", "あさ"],
  "終": ["しゅう", "お"],
  "始": ["し", "はじ"],
  "楽": ["がく", "たの"],
  "家": ["か", "いえ"],
  "族": ["ぞく", "やから"],
  "旅": ["りょ", "たび"],
  "遠": ["えん", "とお"],
  "近": ["きん", "ちか"],
  "強": ["きょう", "つよ"],
  "弱": ["じゃく", "よわ"],
  "速": ["そく", "はや"],
  "遅": ["ち", "おく"],
  "安": ["あん", "やす"],
  "暗": ["あん", "くら"],
  "帰": ["き", "かえ"],
  "着": ["ちゃく", "き"],
  "買": ["ばい", "か"],
  "売": ["ばい", "う"],
  "使": ["し", "つか"],
  "写": ["しゃ", "うつ"],
  "真": ["しん", "ま"],
  "且": ["しょ", "かつ"],
  "以": ["い", "もっ"],
  "位": ["い", "くらい"],
  "委": ["い", "ゆだ"],
  "威": ["い", "おど"],
  "為": ["い", "ため"],
  "胃": ["い", "い"],
  "尉": ["い", "い"],
  "異": ["い", "こと"],
  "移": ["い", "うつ"],
  "因": ["いん", "よ"],
  "永": ["えい", "なが"],
  "泳": ["えい", "およ"],
  "影": ["えい", "かげ"],
  "栄": ["えい", "さか"],
  "塩": ["えん", "しお"],
  "於": ["お", "お"],
  "億": ["おく", "おく"],
  "屋": ["おく", "や"],
  "温": ["おん", "あたた"],
  "穏": ["おん", "おだ"],
  "恩": ["おん", "おん"],
  "可": ["か", "べ"],
  "果": ["か", "は"],
  "課": ["か", "か"],
  "芽": ["が", "め"],
  "賀": ["が", "が"],
  "改": ["かい", "あらた"],
  "害": ["がい", "がい"],
  "街": ["がい", "まち"],
  "各": ["かく", "おのおの"],
  "覚": ["かく", "おぼ"],
  "角": ["かく", "かど"],
  "割": ["かつ", "わ"],
  "株": ["しゅ", "かぶ"],
  "乾": ["かん", "かわ"],
  "缶": ["かん", "かん"],
  "管": ["かん", "くだ"],
  "簡": ["かん", "えら"],
  "議": ["ぎ", "はか"],
  "久": ["きゅう", "ひさ"],
  "旧": ["きゅう", "ふる"],
  "牛": ["ぎゅう", "うし"],
  "去": ["きょ", "さ"],
  "橋": ["きょう", "はし"],
  "曲": ["きょく", "ま"],
  "局": ["きょく", "つぼね"],
  "均": ["きん", "なら"],
  "禁": ["きん", "きん"],
  "巾": ["きん", "きれ"],
  "琴": ["きん", "こと"],
  "号": ["ごう", "ごう"],
  "合": ["ごう", "あ"],
  "航": ["こう", "わた"],
  "幸": ["こう", "さち"],
  "洪": ["こう", "ひろ"],
  "孝": ["こう", "たつ"],
  "光": ["こう", "ひかり"],
  "頃": ["けい", "ころ"],
  "乞": ["こつ", "こ"],
  "刻": ["こく", "きざ"],
  "込": ["こ", "こ"],
  "護": ["ご", "まも"],
  "困": ["こん", "こま"],
  "札": ["さつ", "ふだ"],
  "刷": ["さつ", "す"],
  "察": ["さつ", "さつ"],
  "参": ["さん", "まい"],
  "産": ["さん", "う"],
  "酸": ["さん", "す"],
  "散": ["さん", "ち"],
  "残": ["ざん", "のこ"],
  "士": ["し", "さむらい"],
  "氏": ["し", "うじ"],
  "死": ["し", "し"],
  "視": ["し", "み"],
  "詞": ["し", "ことば"],
  "治": ["じ", "おさ"],
  "失": ["しつ", "うしな"],
  "質": ["しつ", "たち"],
  "若": ["じゃく", "わか"],
  "砂": ["さ", "すな"],
  "座": ["ざ", "すわ"],
  "済": ["さい", "す"],
  "祭": ["さい", "まつ"],
  "再": ["さい", "ふた"],
  "在": ["ざい", "あ"],
  "妻": ["さい", "つま"],
  "亜": ["あ", "つ"],
  "唖": ["あ", "おし"],
  "挨": ["あい", "ひら"],
  "愛": ["あい", "いと"],
  "案": ["あん", "つくえ"],
  "衣": ["い", "ころも"],
  "囲": ["い", "かこ"],
  "医": ["い", "い"],
  "維": ["い", "まも"],
  "依": ["い", "よ"],
  "域": ["いき", "いき"],
  "育": ["いく", "そだ"],
  "胤": ["いん", "たね"],
  "陰": ["いん", "かげ"],
  "飲": ["いん", "の"],
  "隠": ["いん", "かく"],
  "雅": ["が", "みやび"],
  "羽": ["う", "は"],
  "運": ["うん", "はこ"],
  "雲": ["うん", "くも"],
  "営": ["えい", "いとな"],
  "延": ["えん", "の"],
  "沿": ["えん", "そ"],
  "焉": ["えん", "えん"],
  "岡": ["こう", "おか"],
  "乙": ["おつ", "おつ"],
  "俺": ["えん", "おれ"],
  "卸": ["かい", "おろ"],
  "臆": ["おく", "おく"],
  "化": ["か", "ば"],
  "貨": ["か", "か"],
  "過": ["か", "す"],
  "架": ["か", "か"],
  "河": ["か", "かわ"],
  "佳": ["か", "け"],
  "華": ["か", "はな"],
  "荷": ["か", "に"],
  "介": ["かい", "すけ"],
  "回": ["かい", "まわ"],
  "械": ["かい", "うし"],
  "階": ["かい", "きざはし"],
  "碍": ["がい", "さまた"],
  "界": ["かい", "さかい"],
  "皆": ["かい", "みな"],
  "絵": ["かい", "え"],
  "開": ["かい", "ひら"],
  "塊": ["かい", "かたまり"],
  "怪": ["かい", "あや"],
  "解": ["かい", "と"],
  "格": ["かく", "かく"],
  "額": ["がく", "ぬか"],
  "較": ["かく", "くらべ"],
  "隔": ["かく", "へだ"],
  "革": ["かく", "かわ"],
  "歓": ["かん", "よろこ"],
  "環": ["かん", "わ"],
  "観": ["かん", "み"],
  "眼": ["がん", "まなこ"],
  "願": ["がん", "ねが"],
  "希": ["き", "まれ"],
  "姫": ["き", "ひめ"],
  "飢": ["き", "う"],
  "義": ["ぎ", "よし"],
  "逆": ["ぎゃく", "さか"],
  "丘": ["きゅう", "おか"],
  "救": ["きゅう", "すく"],
  "握": ["あく", "にぎ"],
  "違": ["い", "ちが"],
  "壱": ["いち", "いち"],
  "芋": ["う", "いも"],
  "鋭": ["えい", "するど"],
  "援": ["えん", "たす"],
  "煙": ["えん", "けむ"],
  "縁": ["えん", "ふち"],
  "押": ["おう", "お"],
  "奥": ["おう", "おく"],
  "憶": ["おく", "おく"],
  "菓": ["か", "か"],
  "暇": ["か", "ひま"],
  "箇": ["か", "か"],
  "戒": ["かい", "いまし"],
  "壊": ["かい", "こわ"],
  "獲": ["かく", "え"],
  "勧": ["かん", "すすめ"],
  "喚": ["かん", "わめ"],
  "換": ["かん", "か"],
  "漢": ["かん", "あや"],
  "緩": ["かん", "ゆる"],
  "肝": ["かん", "きも"],
  "陥": ["かん", "おちい"],
  "紀": ["き", "しるべ"],
  "軌": ["き", "き"],
  "揮": ["き", "ふる"],
  "棄": ["き", "す"],
  "幾": ["き", "いく"],
  "忌": ["き", "い"],
  "既": ["き", "すで"],
  "祈": ["き", "いの"],
  "鬼": ["き", "おに"],
  "偽": ["ぎ", "にせ"],
  "儀": ["ぎ", "ぎ"],
  "宜": ["ぎ", "よろ"],
  "戯": ["ぎ", "たわむ"],
  "吸": ["きゅう", "す"],
  "宮": ["きゅう", "みや"],
  "窮": ["きゅう", "きわ"],
  "糾": ["きゅう", "ただ"],
  "拒": ["きょ", "こば"],
  "拠": ["きょ", "よ"],
  "虚": ["きょ", "むな"],
  "享": ["きょう", "う"],
  "興": ["こう", "おこ"],
  "挟": ["きょう", "はさ"],
  "凶": ["きょう", "ま"],
  "叫": ["きょう", "さけ"],
  "狂": ["きょう", "くる"],
  "況": ["きょう", "いわ"],
  "暁": ["ぎょう", "あかつき"],
  "矯": ["きょう", "た"],
  "協": ["きょう", "とも"],
  "凝": ["ぎょう", "こご"],
  "斤": ["きん", "おの"],
  "菌": ["きん", "きん"],
  "緊": ["きん", "し"],
  "愚": ["ぐ", "おろ"],
  "偶": ["ぐう", "たま"],
  "遇": ["ぐう", "あ"],
  "継": ["けい", "つ"],
  "穴": ["けつ", "あな"],
  "兼": ["けん", "かね"],
  "剣": ["けん", "つるぎ"],
  "圏": ["けん", "かこ"],
  "堅": ["けん", "かた"],
  "嫌": ["けん", "いや"],
  "献": ["けん", "たてまつ"],
  "県": ["けん", "あがた"],
  "謙": ["けん", "へりくだ"],
  "賢": ["けん", "かしこ"],
  "軒": ["けん", "のき"]
  };

  // DOM 要素取得
  const $kanji = document.getElementById('kanji');
  const $input = document.getElementById('yomi');
  const $btn = document.getElementById('submitBtn');
  const $msg = document.getElementById('message');
  const $count = document.getElementById('counter');
  const $correctTotal = document.getElementById('correctTotal');

  // 状態
  let currentIndex = -1;
  let correctCount = 0;
  let usedIndices = [];

  // ランダム整数生成
  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  // 全角カタカナをひらがなへ、NFKC 正規化、空白除去
  function toHiragana(s) {
    if (!s) return '';
    s = String(s).normalize('NFKC').replace(/\s+/g, '');
    // カタカナをひらがなに
    s = s.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
    return s;
  }

  // 文字列を簡易正規化（長音除去など）
  function normalizeKana(s) {
    if (!s) return '';
    let t = toHiragana(s);
    // 長音記号を削除（簡易）
    t = t.replace(/ー/g, '');
    // 小書き仮名はそのままにする
    return t;
  }

  // Levenshtein 距離（編集距離）
  function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;
    const v0 = new Array(bl + 1);
    const v1 = new Array(bl + 1);
    for (let j = 0; j <= bl; j++) v0[j] = j;
    for (let i = 0; i < al; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < bl; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= bl; j++) v0[j] = v1[j];
    }
    return v1[bl];
  }

  // 指定された漢字文字列から読み候補を生成する
  // 戻り値: Set(ひらがな候補)
  function generateReadingCandidates(kanjiStr, baseYomi) {
    const candidates = new Set();
    if (baseYomi) candidates.add(normalizeKana(baseYomi));

    // 各文字ごとの候補配列を作る
    const chars = Array.from(kanjiStr);
    const perChar = chars.map(ch => {
      const arr = [];
      if (KANJI_READINGS[ch]) {
        KANJI_READINGS[ch].forEach(r => { if (r) arr.push(normalizeKana(r)); });
      }
      // fallback: その文字の読みが無ければ空文字を入れて結合時に柔軟にする
      if (arr.length === 0) arr.push('');
      return arr;
    });

    // 組み合わせ生成（文字数が長いと爆発するので上限を設ける）
    const MAX_COMBINE = 4; // ここは調整可
    const limit = Math.min(perChar.length, MAX_COMBINE);
    let combos = [[]];
    for (let i = 0; i < limit; i++) {
      const next = [];
      for (const c of combos) {
        for (const r of perChar[i]) {
          next.push(c.concat(r));
        }
      }
      combos = next;
    }

    for (const combo of combos) {
      const joined = combo.join('');
      const norm = normalizeKana(joined);
      if (norm) candidates.add(norm);
    }

    // 単漢字それぞれの読みも候補に追加
    for (const ch of chars) {
      if (KANJI_READINGS[ch]) {
        KANJI_READINGS[ch].forEach(r => { if (r) candidates.add(normalizeKana(r)); });
      }
    }

    return candidates;
  }

  // 判定ルール: 完全一致 / prefix（入力が候補の先頭） / 候補が入力の先頭 /
  // 短い入力（1-2文字）は候補の先頭一致で許容 / 編集距離による緩和
  function isAcceptable(userRaw, correctYomi, kanjiStr) {
    const user = normalizeKana(userRaw);
    if (!user) return false;
    const base = normalizeKana(correctYomi || '');

    // 候補群
    const candidates = new Set();
    if (base) candidates.add(base);
    const gen = generateReadingCandidates(kanjiStr || '', correctYomi || '');
    gen.forEach(x => candidates.add(x));

    // まず完全一致
    for (const cand of candidates) {
      if (!cand) continue;
      if (user === cand) return true;
    }

    // prefix/suffix/短い入力許容
    for (const cand of candidates) {
      if (!cand) continue;
      if (cand.startsWith(user)) return true; // 入力が候補の先頭（途中入力・省略）
      if (user.startsWith(cand)) return true; // 入力が候補を包含（たとえば "かい" vs "かいもの" 等）
      if (user.length <= 2 && cand.startsWith(user)) return true; // 1〜2文字の先頭一致は許容
    }

    // 編集距離でゆるく許容
    for (const cand of candidates) {
      if (!cand) continue;
      const dist = levenshtein(user, cand);
      const maxDist = Math.max(1, Math.floor(cand.length * 0.34));
      if (dist <= maxDist) return true;
    }

    return false;
  }

  // 次の問題を出題
  function nextQuestion() {
    if (usedIndices.length >= ITEMS.length) {
      usedIndices = [];
    }
    let idx;
    do {
      idx = randInt(ITEMS.length);
    } while (usedIndices.includes(idx) && usedIndices.length < ITEMS.length);
    usedIndices.push(idx);
    currentIndex = idx;
    const item = ITEMS[idx];
    if ($kanji) $kanji.textContent = item.kanji;
    if ($input) { $input.value = ''; try{ $input.focus(); }catch(e){} }
    updateCounter();
  }

  // カウンター更新
  function updateCounter() {
    if ($count) $count.textContent = `${usedIndices.length}/${ITEMS.length}`;
    if ($correctTotal) $correctTotal.textContent = `${correctCount}`;
  }

  // メッセージ表示
  function showMessage(text, ok) {
    if (!$msg) return;
    $msg.textContent = text;
    $msg.classList.remove('show', 'ok', 'ng');
    void $msg.offsetWidth;
    $msg.classList.add('show', ok ? 'ok' : 'ng');
    const timeout = ok ? 1000 : 900;
    setTimeout(() => { $msg.classList.remove('show'); }, timeout);
  }

  // 回答判定
  async function checkAnswer() {
    if (currentIndex < 0) return;
    const userRaw = $input ? $input.value : '';
    if (!userRaw || !userRaw.trim()) return;
    const item = ITEMS[currentIndex];
    const ok = isAcceptable(userRaw, item.yomigana, item.kanji);
    if (ok) {
      correctCount++;
      showMessage('正解', true);
      updateCounter();
      setTimeout(nextQuestion, 1000);
    } else {
      // 間違い時は元の挙動のまま（再挑戦可能）
      showMessage('ちがいます', false);
      // フォーカスを戻す
      try{ $input && $input.focus(); }catch(e){}
    }
  }

  // イベント登録
  function setupEvents() {
    if ($btn) $btn.addEventListener('click', (e) => { e.preventDefault(); checkAnswer(); });
    if ($input) {
      $input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
      });
    }

    // シェアボタン（既存実装に準拠）
    const shareButtons = document.querySelectorAll('[data-share]');
    shareButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const shareData = {
          title: document.title,
          text: `${$kanji ? $kanji.textContent : ''} の読みを当てよう！`,
          url: location.href
        };
        if (navigator.share) {
          try { await navigator.share(shareData); } catch (_) {}
        } else {
          try {
            await navigator.clipboard.writeText(location.href);
            showMessage('リンクをコピーしました', true);
          } catch (_) {
            showMessage('共有できません', false);
          }
        }
      });
    });
  }

  // 初期化
  function init() {
    setupEvents();
    nextQuestion();
    updateCounter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // デバッグ用参照
  window._kanjiGame = { ITEMS, nextQuestion, checkAnswer, generateReadingCandidates, isAcceptable };
})();