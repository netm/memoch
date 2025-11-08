// 全文: 中学一年生の漢字問題ブラウザゲーム - js
// 動作:
// - 漢字をランダム出題
// - よみがな(ひらがな)を入力してEnterまたは「回答」ボタンで判定
// - 正解なら「正解」を1秒表示して次の問題
// - スマホ横向き表示を想定したレスポンシブ対応
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

    // 要素取得
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

    // ユーティリティ: ランダム整数生成
    function randInt(max) {
      return Math.floor(Math.random() * max);
    }

    // カタカナをひらがなに変換、全角スペース削除、トリム、長音や小文字の正規化
    function toHiragana(s) {
      if (!s) return '';
      s = s.replace(/\s+/g, '');
      // 全角カタカナをひらがなに
      const kataToHira = s.replace(/[\u30A1-\u30F6]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0x60);
      });
      // 全角英数字を半角に（必要なら）
      const normalized = kataToHira.normalize('NFKC');
      // 小書き文字の扱い（「ゃ」など）はそのまま
      return normalized;
    }

    // 問題出題
    function nextQuestion() {
      if (usedIndices.length >= ITEMS.length) {
        // 全問終了したらリセットして再チャレンジ
        usedIndices = [];
      }
      // ランダムに未使用のインデックスを選ぶ
      let idx;
      do {
        idx = randInt(ITEMS.length);
      } while (usedIndices.includes(idx) && usedIndices.length < ITEMS.length);
      usedIndices.push(idx);
      currentIndex = idx;
      const item = ITEMS[idx];
      $kanji.textContent = item.kanji;
      $input.value = '';
      $input.focus();
      updateCounter();
    }

    // カウンター表示更新
    function updateCounter() {
      $count.textContent = `${usedIndices.length}/${ITEMS.length}`;
      $correctTotal.textContent = `${correctCount}`;
    }

    // 正誤判定
    function checkAnswer() {
      if (currentIndex < 0) return;
      const userRaw = $input.value;
      const user = toHiragana(userRaw).trim();
      const correct = ITEMS[currentIndex].yomigana;
      if (!user) return;
      if (user === correct) {
        correctCount += 1;
        showMessage('正解', true);
        updateCounter();
        setTimeout(nextQuestion, 1000);
      } else {
        showMessage('ちがいます', false);
        // 不正解時は次の問題には行かない（ユーザーが続けて挑戦可能）
        // ここで部分一致や読みの別形を許容するなら拡張可能
      }
    }

    // メッセージ表示: 成功なら緑、失敗なら赤
    function showMessage(text, ok) {
      // 大きな表示を行うので aria-live を通じてスクリーンリーダーにも伝える
      $msg.textContent = text;
      $msg.classList.remove('show', 'ok', 'ng');
      void $msg.offsetWidth; // reflow for restart animation
      $msg.classList.add('show', ok ? 'ok' : 'ng');

      // 成功時は1秒で自動で消える。失敗時は短めに表示して消す（ユーザーが再入力しやすいように）
      if (ok) {
        setTimeout(() => {
          $msg.classList.remove('show');
        }, 1000);
      } else {
        setTimeout(() => {
          $msg.classList.remove('show');
        }, 900);
      }
    }

    // イベントバインド
    function setupEvents() {
      $btn.addEventListener('click', checkAnswer);
      $input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer();
        }
      });

      // シェアボタン（Web Share API を使う。未対応ブラウザにはフォールバックで選択）
      const shareButtons = document.querySelectorAll('[data-share]');
      shareButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
          const shareData = {
            title: document.title,
            text: `${$kanji.textContent} の読みを当てよう！`,
            url: location.href
          };
          if (navigator.share) {
            try {
              await navigator.share(shareData);
            } catch (err) {
              // ユーザーがキャンセルした等は静かに無視
            }
          } else {
            // フォールバック: URLをコピーしてユーザーに通知
            try {
              await navigator.clipboard.writeText(location.href);
              showMessage('リンクをコピーしました', true);
            } catch (err) {
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

    // DOMContentLoaded 待ち
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // デバッグ用: windowから参照できるようにしておく（必要なら）
    window._kanjiGame = {
      ITEMS,
      nextQuestion,
      checkAnswer
    };
  })();