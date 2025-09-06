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
    { en: 'answer',  ja: '答える' },
    { en: 'arrive',  ja: '到着する' },
    { en: 'ask',  ja: 'たずねる' },
    { en: 'become',  ja: 'なる' },
    { en: 'begin',  ja: '始まる、始める' },
    { en: 'brush',  ja: 'みがく' },
    { en: 'buy',  ja: '買う' },
    { en: 'call',  ja: '呼ぶ' },
    { en: 'check',  ja: 'チェックする' },
    { en: 'clean',  ja: 'きれいにする' },
    { en: 'close',  ja: '閉める、閉まる' },
    { en: 'come',  ja: '来る' },
    { en: 'cook',  ja: '料理する' },
    { en: 'cross',  ja: '横切る' },
    { en: 'cut',  ja: '切る' },
    { en: 'dance',  ja: 'ダンスする' },
    { en: 'do',  ja: 'する' },
    { en: 'draw',  ja: '描く' },
    { en: 'drink',  ja: '飲む' },
    { en: 'drive',  ja: '運転する' },
    { en: 'eat',  ja: 'たべる' },
    { en: 'enjoy',  ja: '楽しむ' },
    { en: 'find',  ja: '見つける' },
    { en: 'finish',  ja: '終える' },
    { en: 'forget',  ja: '忘れる' },
    { en: 'get',  ja: '手に入れる' },
    { en: 'give',  ja: '与える' },
    { en: 'go',  ja: '行く' },
    { en: 'have',  ja: '持っている' },
    { en: 'hear',  ja: '聞こえる' },
    { en: 'help',  ja: '助ける' },
    { en: 'hike',  ja: 'ハイキングをする' },
    { en: 'join',  ja: '加わる' },
    { en: 'jump',  ja: 'ジャンプする' },
    { en: 'know',  ja: '知っている' },
    { en: 'learn',  ja: '学ぶ' },
    { en: 'leave',  ja: '出発する' },
    { en: 'like',  ja: '好む' },
    { en: 'listen',  ja: '聞く' },
    { en: 'look',  ja: '見る' },
    { en: 'live',  ja: '住む' },
    { en: 'love',  ja: '愛する' },
    { en: 'make',  ja: '作る' },
    { en: 'move',  ja: '動く' },
    { en: 'meet',  ja: '会う' },
    { en: 'need',  ja: '必要とする' },
    { en: 'open',  ja: '開く' },
    { en: 'paint',  ja: '塗る' },
    { en: 'play',  ja: 'する' },
    { en: 'practice',  ja: '練習する' },
    { en: 'put',  ja: 'おく' },
    { en: 'read',  ja: '読む' },
    { en: 'remember',  ja: '思い出す' },
    { en: 'ride',  ja: '乗る' },
    { en: 'run',  ja: '走る' },
    { en: 'see',  ja: '見る' },
    { en: 'sell',  ja: '売る' },
    { en: 'say',  ja: '言う' },
    { en: 'send',  ja: '送る' },
    { en: 'set',  ja: 'セットする' },
    { en: 'show',  ja: '見せる' },
    { en: 'sing',  ja: '歌う' },
    { en: 'sit',  ja: '座る' },
    { en: 'skate',  ja: 'スケートをする' },
    { en: 'ski',  ja: 'スキーをする' },
    { en: 'sleep',  ja: 'ねむる' },
    { en: 'smile',  ja: 'ほほえむ' },
    { en: 'speak',  ja: '話す' },
    { en: 'spell',  ja: 'つづる' },
    { en: 'stand',  ja: '立つ' },
    { en: 'start',  ja: '始まる' },
    { en: 'stay',  ja: 'とどまる' },
    { en: 'stop',  ja: '止まる' },
    { en: 'study',  ja: '勉強する' },
    { en: 'swim',  ja: '泳ぐ' },
    { en: 'take',  ja: '連れていく' },
    { en: 'talk',  ja: '話す' },
    { en: 'teach',  ja: '教える' },
    { en: 'tell',  ja: '伝える' },
    { en: 'thank',  ja: '感謝する' },
    { en: 'think',  ja: '考える' },
    { en: 'touch',  ja: '触れる' },
    { en: 'travel',  ja: '旅行する' },
    { en: 'try',  ja: '試す' },
    { en: 'turn',  ja: '回す' },
    { en: 'understand',  ja: '理解する' },
    { en: 'use',  ja: '使う' },
    { en: 'visit',  ja: '訪れる' },
    { en: 'wait',  ja: '待つ' },
    { en: 'wake',  ja: '目が覚める' },
    { en: 'walk',  ja: '歩く' },
    { en: 'want',  ja: '欲しい' },
    { en: 'wash',  ja: '洗う' },
    { en: 'watch',  ja: '（動くものを）見る' },
    { en: 'wear',  ja: '着る' },
    { en: 'welcome',  ja: '歓迎する' },
    { en: 'work',  ja: '働く' },
    { en: 'write',  ja: '書く' },
    { en: 'am',  ja: 'です' },
    { en: 'is',  ja: 'です' },
    { en: 'are',  ja: 'です' },
    { en: 'good',  ja: 'よい' },
    { en: 'bad',  ja: '悪い' },
    { en: 'best',  ja: '最もいい' },
    { en: 'nice',  ja: 'ステキな' },
    { en: 'great',  ja: 'すばらしい' },
    { en: 'wonderful',  ja: 'すばらしい' },
    { en: 'fantastic',  ja: 'すばらしい' },
    { en: 'special',  ja: '特別な' },
    { en: 'delicious',  ja: 'おいしい' },
    { en: 'bitter',  ja: 'にがい' },
    { en: 'sweet',  ja: 'あまい' },
    { en: 'salty',  ja: 'しょっぱい' },
    { en: 'sour',  ja: 'すっぱい' },
    { en: 'happy',  ja: 'しあわせな' },
    { en: 'sad',  ja: '悲しい' },
    { en: 'angry',  ja: '怒った' },
    { en: 'sorry',  ja: 'すまなく思う' },
    { en: 'hot',  ja: 'あつい' },
    { en: 'warm',  ja: '暖かい' },
    { en: 'cold',  ja: '寒い' },
    { en: 'cool',  ja: 'すずしい' },
    { en: 'right',  ja: '右の' },
    { en: 'left',  ja: '左の' },
    { en: 'new',  ja: '新しい' },
    { en: 'old',  ja: '古い' },
    { en: 'traditional',  ja: '伝統的な' },
    { en: 'young',  ja: '若い' },
    { en: 'junior',  ja: '年下の' },
    { en: 'strong',  ja: '強い' },
    { en: 'slow',  ja: 'ゆっくりな' },
    { en: 'last',  ja: 'この前の' },
    { en: 'large',  ja: '大きい' },
    { en: 'big',  ja: '大きい' },
    { en: 'small',  ja: '小さい' },
    { en: 'little',  ja: '小さい' },
    { en: 'cheerful',  ja: '元気の良い' },
    { en: 'fine',  ja: '元気で' },
    { en: 'sick',  ja: '病気の' },
    { en: 'hungry',  ja: '空腹の' },
    { en: 'sleepy',  ja: '眠い' },
    { en: 'tired',  ja: '疲れた' },
    { en: 'beautiful',  ja: '美しい' },
    { en: 'cute',  ja: 'かわいい' },
    { en: 'lovely',  ja: 'かわいらしい' },
    { en: 'clean',  ja: 'きれいな' },
    { en: 'pretty',  ja: 'かわいい' },
    { en: 'long',  ja: '長い' },
    { en: 'short',  ja: '短い' },
    { en: 'tall',  ja: '高い' },
    { en: 'high',  ja: '高い' },
    { en: 'difficult',  ja: '難しい' },
    { en: 'easy',  ja: 'かんたんな' },
    { en: 'fun',  ja: '楽しみ' },
    { en: 'funny',  ja: 'おかしな' },
    { en: 'interesting',  ja: 'おもしろい' },
    { en: 'brave',  ja: 'ゆうかんな' },
    { en: 'excited',  ja: 'こうふんした' },
    { en: 'exciting',  ja: 'こうふんさせる' },
    { en: 'kind',  ja: '親切な' },
    { en: 'active',  ja: '活動的な' },
    { en: 'gentle',  ja: '優しい' },
    { en: 'friendly',  ja: '友好的な' },
    { en: 'busy',  ja: '忙しい' },
    { en: 'free',  ja: 'ひまな' },
    { en: 'famous',  ja: '有名な' },
    { en: 'favorite',  ja: 'お気に入りの' },
    { en: 'popular',  ja: '人気のある' },
    { en: 'expensive',  ja: '高価な' },
    { en: 'different',  ja: '異なった' },
    { en: 'fresh',  ja: '新鮮な' },
    { en: 'heavy',  ja: '重い' },
    { en: 'soft',  ja: 'やわらかい' },
    { en: 'quiet',  ja: '静かな' },
    { en: 'scary',  ja: '恐ろしい' },
    { en: 'shiny',  ja: '光る' },
    { en: 'final',  ja: '最後の' },
    { en: 'closed',  ja: '閉じた' },
    { en: 'furry',  ja: '毛皮でおおわれた' },
    { en: 'main',  ja: '主な' },
    { en: 'ready',  ja: '用意ができた' },
    { en: 'all',  ja: '全部の' },
    { en: 'many',  ja: 'たくさんの' },
    { en: 'much',  ja: 'たくさんの' },
    { en: 'lot',  ja: 'たくさん' },
    { en: 'more',  ja: 'もっと' },
    { en: 'some',  ja: 'いくつかの' },
    { en: 'any',  ja: '何か' },
    { en: 'every',  ja: '全ての' },
    { en: 'all',  ja: '全部の' },
    { en: 'people',  ja: '人々' },
    { en: 'man',  ja: '男性' },
    { en: 'woman',  ja: '女性' },
    { en: 'boy',  ja: '男の子' },
    { en: 'girl',  ja: '女の子' },
    { en: 'children',  ja: '子ども達' },
    { en: 'husband',  ja: '夫' },
    { en: 'wife',  ja: '妻' },
    { en: 'king',  ja: '王' },
    { en: 'queen',  ja: '女王' },
    { en: 'hero',  ja: '英雄' },
    { en: 'head',  ja: '頭' },
    { en: 'face',  ja: '顔' },
    { en: 'eye',  ja: '目' },
    { en: 'nose',  ja: '鼻' },
    { en: 'mouth',  ja: '口' },
    { en: 'teeth',  ja: '歯' },
    { en: 'ear',  ja: '耳' },
    { en: 'hair',  ja: '髪の毛' },
    { en: 'heart',  ja: '心臓、心' },
    { en: 'shoulder',  ja: '肩' },
    { en: 'hand',  ja: '手' },
    { en: 'finger',  ja: '指' },
    { en: 'leg',  ja: '脚' },
    { en: 'knee',  ja: 'ひざ' },
    { en: 'foot',  ja: '足' },
    { en: 'toe',  ja: 'つま先' },
    { en: 'house',  ja: '家' },
    { en: 'living room',  ja: '居間' },
    { en: 'table',  ja: 'テーブル' },
    { en: 'sofa',  ja: 'ソファ' },
    { en: 'window',  ja: '窓' },
    { en: 'kitchen',  ja: 'キッチン' },
    { en: 'room',  ja: '部屋' },
    { en: 'door',  ja: 'ドア' },
    { en: 'desk',  ja: '机' },
    { en: 'chair',  ja: 'いす' },
    { en: 'bath',  ja: '風呂' },
    { en: 'bathroom',  ja: '浴室/トイレ' },
    { en: 'bedroom',  ja: '寝室' },
    { en: 'bed',  ja: 'ベッド' },
    { en: 'garden',  ja: '庭' },
    { en: 'doghouse',  ja: '犬小屋' },
    { en: 'goodbye',  ja: 'さよなら' },
    { en: 'hello',  ja: 'やあ。' },
    { en: 'hi',  ja: 'やあ。' },
    { en: 'luck',  ja: '幸運' },
    { en: 'cap',  ja: '帽子、キャップ' },
    { en: 'hat',  ja: '帽子' },
    { en: 'coat',  ja: 'コート' },
    { en: 'jacket',  ja: 'ジャケット' },
    { en: 'sweater',  ja: 'セーター' },
    { en: 'shirt',  ja: 'シャツ' },
    { en: 'T-shirt',  ja: 'Tシャツ' },
    { en: 'pants',  ja: 'ズボン' },
    { en: 'shorts',  ja: '半ズボン' },
    { en: 'skirt',  ja: 'スカート' },
    { en: 'shoes',  ja: 'シューズ' },
    { en: 'sneakers',  ja: 'スニーカー' },
    { en: 'boots',  ja: 'ブーツ' },
    { en: 'socks',  ja: 'ソックス' },
    { en: 'umbrella',  ja: '傘' },
    { en: 'raincoat',  ja: '雨具' },
    { en: 'rain boots',  ja: '長靴' },
    { en: 'bag',  ja: 'バッグ' },
    { en: 'backpack',  ja: 'リュックサック' },
    { en: 'box',  ja: '箱' },
    { en: 'case',  ja: 'ケース' },
    { en: 'basket',  ja: 'かご' },
    { en: 'package',  ja: '小包' },
    { en: 'calendar',  ja: 'カレンダー' },
    { en: 'diary',  ja: '日記' },
    { en: 'album',  ja: 'アルバム' },
    { en: 'picture',  ja: '写真' },
    { en: 'camera',  ja: 'カメラ' },
    { en: 'computer',  ja: 'コンピュータ' },
    { en: 'e-mail',  ja: 'eメール' },
    { en: 'letter',  ja: '手紙' },
    { en: 'clock',  ja: '時計' },
    { en: 'watch',  ja: '腕時計' },
    { en: 'culture',  ja: '文化' },
    { en: 'life',  ja: '生活' },
    { en: 'information',  ja: '情報' },
    { en: 'idea',  ja: '考え' },
    { en: 'story',  ja: '話' },
    { en: 'name',  ja: '名前' },
    { en: 'nickname',  ja: 'あだ名' },
    { en: 'TV',  ja: 'テレビ' },
    { en: 'radio',  ja: 'ラジオ' },
    { en: 'news',  ja: 'ニュース' },
    { en: 'newspaper',  ja: '新聞' },
    { en: 'magazine',  ja: '雑誌' },
    { en: 'phone',  ja: '電話' },
    { en: 'smartphone',  ja: 'スマホ' },
    { en: 'map',  ja: '地図' },
    { en: 'hint',  ja: 'ヒント' },
    { en: 'cooking',  ja: '料理' },
    { en: 'menu',  ja: 'メニュー' },
    { en: 'party',  ja: 'パーティ' },
    { en: 'chopsticks',  ja: 'はし' },
    { en: 'knife',  ja: 'ナイフ' },
    { en: 'cup',  ja: 'カップ' },
    { en: 'glass',  ja: 'コップ' },
    { en: 'dish',  ja: '皿' },
    { en: 'plate',  ja: '皿' },
    { en: 'lunch box',  ja: '弁当箱' },
    { en: 'garbage',  ja: 'ゴミ' },
    { en: 'shower',  ja: 'シャワー' },
    { en: 'soap',  ja: '石鹸' },
    { en: 'towel',  ja: 'タオル' },
    { en: 'shopping',  ja: '買い物' },
    { en: 'sale',  ja: 'セール' },
    { en: 'ticket',  ja: 'チケット' },
    { en: 'card',  ja: 'カード' },
    { en: 'present',  ja: 'プレゼント' },
    { en: 'treasure',  ja: '宝物' },
    { en: 'pet',  ja: 'ペット' },
    { en: 'toy',  ja: 'おもちゃ' },
    { en: 'marble',  ja: 'ビー玉' },
    { en: 'cleaning',  ja: 'そうじ' },
    { en: 'centimeter',  ja: 'センチメートル' },
    { en: 'meter',  ja: 'メートル' },
    { en: 'kilogram',  ja: 'キログラム' },
    { en: 'money',  ja: 'お金' },
    { en: 'price',  ja: '値段' },
    { en: 'coin',  ja: '硬貨' },
    { en: 'yen',  ja: '円' },
    { en: 'dollar',  ja: 'ドル' },
    { en: 'cent',  ja: 'セント' },
    { en: 'breakfast',  ja: '朝食' },
    { en: 'lunch',  ja: '昼食' },
    { en: 'dinner',  ja: '夕食' },
    { en: 'food',  ja: '食べ物' },
    { en: 'meat',  ja: '肉' },
    { en: 'beef',  ja: '牛肉' },
    { en: 'pork',  ja: '豚肉' },
    { en: 'chicken',  ja: '鶏肉' },
    { en: 'fish',  ja: '魚' },
    { en: 'rice',  ja: '米' },
    { en: 'egg',  ja: '卵' },
    { en: 'sugar',  ja: '砂糖' },
    { en: 'salt',  ja: '塩' },
    { en: 'bread',  ja: 'パン' },
    { en: 'toast',  ja: 'トースト' },
    { en: 'jam',  ja: 'ジャム' },
    { en: 'sandwich',  ja: 'サンドイッチ' },
    { en: 'hamburger',  ja: 'ハンバーガー' },
    { en: 'pie',  ja: 'パイ' },
    { en: 'pizza',  ja: 'ピザ' },
    { en: 'noodle',  ja: '麺' },
    { en: 'spaghetti',  ja: 'スパゲッティ' },
    { en: 'macaroni',  ja: 'マカロニ' },
    { en: 'rice ball',  ja: 'おにぎり' },
    { en: 'curry and rice',  ja: 'カレーライス' },
    { en: 'sushi',  ja: 'すし' },
    { en: 'grilled fish',  ja: '焼き魚' },
    { en: 'omelet',  ja: 'オムレツ' },
    { en: 'French fries',  ja: 'フライドポテト' },
    { en: 'fried chicken',  ja: 'フライドチキン' },
    { en: 'steak',  ja: 'ステーキ' },
    { en: 'sausage',  ja: 'ソーセージ' },
    { en: 'ham',  ja: 'ハム' },
    { en: 'bacon',  ja: 'ベーコン' },
    { en: 'salad',  ja: 'サラダ' },
    { en: 'soup',  ja: 'スープ' },
    { en: 'yogurt',  ja: 'ヨーグルト' },
    { en: 'butter',  ja: 'バター' },
    { en: 'cream',  ja: 'クリーム' },
    { en: 'stew',  ja: 'シチュー' },
    { en: 'drink',  ja: 'ドリンク' },
    { en: 'juice',  ja: 'ジュース' },
    { en: 'coffee',  ja: 'コーヒー' },
    { en: 'tea',  ja: '茶' },
    { en: 'Japanese tea',  ja: '日本茶' },
    { en: 'milk',  ja: '牛乳' },
    { en: 'mineral water',  ja: 'ミネラルウォーター' },
    { en: 'soda',  ja: 'ソーダ水' },
    { en: 'snack',  ja: 'スナック' },
    { en: 'cookie',  ja: 'クッキー' },
    { en: 'nut',  ja: 'ナッツ' },
    { en: 'popcorn',  ja: 'ポップコーン' },
    { en: 'dessert',  ja: 'デザート' },
    { en: 'cake',  ja: 'ケーキ' },
    { en: 'chocolate',  ja: 'チョコレート' },
    { en: 'donut',  ja: 'ドーナッツ' },
    { en: 'ice cream',  ja: 'アイスクリーム' },
    { en: 'pudding',  ja: 'プリン' },
    { en: 'cabbage',  ja: 'キャベツ' },
    { en: 'carrot',  ja: '人参' },
    { en: 'corn',  ja: 'とうもろこし' },
    { en: 'cucumber',  ja: 'きゅうり' },
    { en: 'green pepper',  ja: 'ピーマン' },
    { en: 'lettuce',  ja: 'レタス' },
    { en: 'mushroom',  ja: 'きのこ' },
    { en: 'onion',  ja: '玉ねぎ' },
    { en: 'potato',  ja: 'じゃがいも' },
    { en: 'pumpkin',  ja: 'かぼちゃ' },
    { en: 'tomato',  ja: 'トマト' },
    { en: 'fruit',  ja: 'フルーツ' },
    { en: 'apple',  ja: 'りんご' },
    { en: 'banana',  ja: 'バナナ' },
    { en: 'cherry',  ja: 'さくらんぼ' },
    { en: 'grape',  ja: 'ぶどう' },
    { en: 'lemon',  ja: 'レモン' },
    { en: 'melon',  ja: 'メロン' },
    { en: 'orange',  ja: 'オレンジ' },
    { en: 'peach',  ja: '桃' },
    { en: 'pineapple',  ja: 'パイナップル' },
    { en: 'strawberry',  ja: 'いちご' },
    { en: 'watermelon',  ja: 'すいか' },
    { en: 'color',  ja: '色' },
    { en: 'white',  ja: '白' },
    { en: 'black',  ja: '黒' },
    { en: 'red',  ja: '赤' },
    { en: 'blue',  ja: '青' },
    { en: 'yellow',  ja: '黄色' },
    { en: 'green',  ja: '緑' },
    { en: 'brown',  ja: '茶色' },
    { en: 'orange',  ja: 'オレンジ' },
    { en: 'pink',  ja: 'ピンク' },
    { en: 'purple',  ja: '紫' },
    { en: 'circle',  ja: '円' },
    { en: 'round',  ja: '丸い' },
    { en: 'triangle',  ja: '三角形' },
    { en: 'square',  ja: '四角形' },
    { en: 'rectangle',  ja: '長方形' },
    { en: 'diamond',  ja: 'ひし形' },
    { en: 'number',  ja: '数' },
    { en: 'zero',  ja: 'ゼロ' },
    { en: 'one',  ja: '1' },
    { en: 'two',  ja: '2' },
    { en: 'three',  ja: '3' },
    { en: 'four',  ja: '4' },
    { en: 'five',  ja: '5' },
    { en: 'six',  ja: '6' },
    { en: 'seven',  ja: '7' },
    { en: 'eight',  ja: '8' },
    { en: 'nine',  ja: '9' },
    { en: 'ten',  ja: '10' },
    { en: 'eleven',  ja: '11' },
    { en: 'twelve',  ja: '12' },
    { en: 'thirteen',  ja: '13' },
    { en: 'fourteen',  ja: '14' },
    { en: 'fifteen',  ja: '15' },
    { en: 'sixteen',  ja: '16' },
    { en: 'seventeen',  ja: '17' },
    { en: 'eighteen',  ja: '18' },
    { en: 'nineteen',  ja: '19' },
    { en: 'twenty',  ja: '20' },
    { en: 'thirty',  ja: '30' },
    { en: 'forty',  ja: '40' },
    { en: 'fifty',  ja: '50' },
    { en: 'sixty',  ja: '60' },
    { en: 'seventy',  ja: '70' },
    { en: 'eighty',  ja: '80' },
    { en: 'ninety',  ja: '90' },
    { en: 'hundred',  ja: '100' },
    { en: 'thousand',  ja: '1000' },
    { en: 'first',  ja: '1番目' },
    { en: 'second',  ja: '2番目' },
    { en: 'third',  ja: '3番目' },
    { en: 'fourth',  ja: '4番目' },
    { en: 'fifth',  ja: '5番目' },
    { en: 'sixth',  ja: '6番目' },
    { en: 'seventh',  ja: '7番目' },
    { en: 'eighth',  ja: '8番目' },
    { en: 'ninth',  ja: '9番目' },
    { en: 'tenth',  ja: '10番目' },
    { en: 'eleventh',  ja: '11番目' },
    { en: 'twelfth',  ja: '12番目' },
    { en: 'thirteenth',  ja: '13番目' },
    { en: 'fourteenth',  ja: '14番目' },
    { en: 'fifteenth',  ja: '15番目' },
    { en: 'sixteenth',  ja: '16番目' },
    { en: 'seventeenth',  ja: '17番目' },
    { en: 'eighteenth',  ja: '18番目' },
    { en: 'nineteenth',  ja: '19番目' },
    { en: 'twentieth',  ja: '20番目' },
    { en: 'classroom',  ja: '教室' },
    { en: 'blackboard',  ja: '黒板' },
    { en: 'gym',  ja: '体育館' },
    { en: 'playground',  ja: '校庭' },
    { en: 'computer room',  ja: 'コンピュータ室' },
    { en: 'cafeteria',  ja: 'カフェテリア' },
    { en: 'boy’s room',  ja: '男子トイレ' },
    { en: 'girl’s room',  ja: '女子トイレ' },
    { en: 'principal',  ja: '校長' },
    { en: 'school nurse',  ja: '保健室の先生' },
    { en: 'student',  ja: '学生、生徒' },
    { en: 'classmate',  ja: 'クラスメート' },
    { en: 'uniform',  ja: '制服' },
    { en: 'club',  ja: 'クラブ' },
    { en: 'band',  ja: 'バンド' },
    { en: 'drama',  ja: '劇' },
    { en: 'entrance ceremony',  ja: '入学式' },
    { en: 'field trip',  ja: '野外見学' },
    { en: 'volunteer day',  ja: 'ボランティア活動の日' },
    { en: 'drama festival',  ja: '学芸会' },
    { en: 'sports festival',  ja: '運動会' },
    { en: 'music festival',  ja: '音楽会' },
    { en: 'school trip',  ja: '遠足、修学旅行' },
    { en: 'graduation ceremony',  ja: '卒業式' },
    { en: 'alphabet',  ja: 'アルファベット' },
    { en: 'grade',  ja: '学年' },
    { en: 'recess',  ja: '休み時間' },
    { en: 'homework',  ja: '宿題' },
    { en: 'report',  ja: 'レポート' },
    { en: 'question',  ja: '質問' },
    { en: 'memory',  ja: '思い出' },
    { en: 'college',  ja: '大学' },
    { en: 'class',  ja: '授業、クラス' },
    { en: 'lesson',  ja: '授業' },
    { en: 'exam',  ja: '試験' },
    { en: 'test',  ja: 'テスト' },
    { en: 'subject',  ja: '科目' },
    { en: 'English',  ja: '英語' },
    { en: 'math',  ja: '算数' },
    { en: 'science',  ja: '理科' },
    { en: 'social studies',  ja: '社会' },
    { en: 'history',  ja: '歴史' },
    { en: 'P.E.',  ja: '体育' },
    { en: 'athletics',  ja: '運動競技' },
    { en: 'gymnastics',  ja: '体操' },
    { en: 'art',  ja: '美術' },
    { en: 'arts and crafts',  ja: '図工' },
    { en: 'calligraphy',  ja: '書道' },
    { en: 'home economics',  ja: '家庭科' },
    { en: 'moral education',  ja: '道徳' },
    { en: 'music',  ja: '音楽' },
    { en: 'book',  ja: '本' },
    { en: 'textbook',  ja: '教科書' },
    { en: 'dictionary',  ja: '辞書' },
    { en: 'notebook',  ja: 'ノート' },
    { en: 'page',  ja: 'ページ' },
    { en: 'pencil case',  ja: 'ふでばこ' },
    { en: 'pen',  ja: 'ペン' },
    { en: 'pencil',  ja: 'えんぴつ' },
    { en: 'pencil sharpener',  ja: 'えんぴつ削り' },
    { en: 'marker',  ja: 'マーカー' },
    { en: 'crayon',  ja: 'クレヨン' },
    { en: 'chalk',  ja: 'チョーク' },
    { en: 'eraser',  ja: '消しゴム' },
    { en: 'ink',  ja: 'インク' },
    { en: 'ruler',  ja: '定規' },
    { en: 'scissors',  ja: 'はさみ' },
    { en: 'stapler',  ja: 'ホッチキス' },
    { en: 'glue stick',  ja: 'スティックのり' },
    { en: 'magnet',  ja: '磁石' },
    { en: 'postcard',  ja: '絵はがき' },
    { en: 'poster',  ja: 'ポスター' },
    { en: 'place',  ja: '場所' },
    { en: 'city',  ja: '都市' },
    { en: 'town',  ja: '町' },
    { en: 'bank',  ja: '銀行' },
    { en: 'police station',  ja: '警察署' },
    { en: 'fire station',  ja: '消防署' },
    { en: 'gas station',  ja: 'ガソリンスタンド' },
    { en: 'hospital',  ja: '病院' },
    { en: 'library',  ja: '図書館' },
    { en: 'museum',  ja: '美術館、博物館' },
    { en: 'office',  ja: '会社' },
    { en: 'post',  ja: 'ポスト' },
    { en: 'post office',  ja: '郵便局' },
    { en: 'school',  ja: '学校' },
    { en: 'shrine',  ja: '神社' },
    { en: 'temple',  ja: 'お寺' },
    { en: 'station',  ja: '駅' },
    { en: 'airport',  ja: '空港' },
    { en: 'park',  ja: '公園' },
    { en: 'amusement park',  ja: '遊園地' },
    { en: 'zoo',  ja: '動物園' },
    { en: 'aquarium',  ja: '水族館' },
    { en: 'pool',  ja: 'プール' },
    { en: 'theater',  ja: '劇場、映画館' },
    { en: 'restaurant',  ja: 'レストラン' },
    { en: 'store',  ja: '店' },
    { en: 'department store',  ja: 'デパート' },
    { en: 'supermarket',  ja: 'スーパーマーケット' },
    { en: 'bookstore',  ja: '本屋' },
    { en: 'convenience store',  ja: 'コンビニエンスストア' },
    { en: 'flower shop',  ja: '花屋' },
    { en: 'entrance',  ja: '入口' },
    { en: 'exit',  ja: '出口' },
    { en: 'bench',  ja: 'ベンチ' },
    { en: 'wall',  ja: '壁' },
    { en: 'bridge',  ja: '橋' },
    { en: 'tower',  ja: 'タワー' },
    { en: 'street',  ja: '通り' },
    { en: 'block',  ja: '区画' },
    { en: 'corner',  ja: 'かど' },
    { en: 'car',  ja: '車' },
    { en: 'taxi',  ja: 'タクシー' },
    { en: 'bus',  ja: 'バス' },
    { en: 'jet',  ja: 'ジェット機' },
    { en: 'plane',  ja: '飛行機' },
    { en: 'ship',  ja: '船' },
    { en: 'train',  ja: '電車' },
    { en: 'wheelchair',  ja: '車椅子' },
    { en: 'job',  ja: '仕事' },
    { en: 'worker',  ja: '働く人' },
    { en: 'dream',  ja: '夢' },
    { en: 'doctor',  ja: '医者' },
    { en: 'dentist',  ja: '歯医者' },
    { en: 'vet',  ja: '獣医' },
    { en: 'nurse',  ja: '看護師' },
    { en: 'artist',  ja: '画家' },
    { en: 'musician',  ja: '音楽家' },
    { en: 'pianist',  ja: 'ピアニスト' },
    { en: 'singer',  ja: '歌手' },
    { en: 'dancer',  ja: 'ダンサー' },
    { en: 'comedian',  ja: '芸人' },
    { en: 'player',  ja: '選手' },
    { en: 'baseball player',  ja: '野球選手' },
    { en: 'soccer player',  ja: 'サッカー選手' },
    { en: 'scientist',  ja: '科学者' },
    { en: 'astronaut',  ja: '宇宙飛行士' },
    { en: 'pilot',  ja: 'パイロット' },
    { en: 'flight attendant',  ja: '客室乗務員' },
    { en: 'driver',  ja: '運転手' },
    { en: 'bus driver',  ja: 'バスの運転手' },
    { en: 'officer',  ja: '役人' },
    { en: 'police officer',  ja: '警察官' },
    { en: 'teacher',  ja: '教師' },
    { en: 'cook',  ja: '料理人' },
    { en: 'baker',  ja: 'パン屋' },
    { en: 'waiter',  ja: 'ウェイター' },
    { en: 'florist',  ja: '花屋' },
    { en: 'farmer',  ja: '農業者' },
    { en: 'volunteer',  ja: 'ボランティア' },
    { en: 'zoo keeper',  ja: '動物園の飼育員' },
    { en: 'sports',  ja: 'スポーツ' },
    { en: 'team',  ja: 'チーム' },
    { en: 'game',  ja: 'ゲーム' },
    { en: 'soccer',  ja: 'サッカー' },
    { en: 'baseball',  ja: '野球' },
    { en: 'softball',  ja: 'ソフトボール' },
    { en: 'ball',  ja: 'ボール' },
    { en: 'bat',  ja: 'バット' },
    { en: 'glove',  ja: 'グローブ' },
    { en: 'stroke',  ja: '打つこと' },
    { en: 'tennis',  ja: 'テニス' },
    { en: 'racket',  ja: 'ラケット' },
    { en: 'basketball',  ja: 'バスケットボール' },
    { en: 'volleyball',  ja: 'バレーボール' },
    { en: 'dodgeball',  ja: 'ドッジボール' },
    { en: 'badminton',  ja: 'バドミントン' },
    { en: 'table tennis',  ja: '卓球' },
    { en: 'football',  ja: 'サッカー' },
    { en: 'hockey',  ja: 'ホッケー' },
    { en: 'rugby',  ja: 'ラグビー' },
    { en: 'swimming',  ja: '水泳' },
    { en: 'swimming meet',  ja: '水泳大会' },
    { en: 'surfing',  ja: 'サーフィン' },
    { en: 'ice skating',  ja: 'アイススケート' },
    { en: 'track and field',  ja: '陸上競技' },
    { en: 'marathon',  ja: 'マラソン' },
    { en: 'jump rope',  ja: '縄とび' },
    { en: 'archery',  ja: 'アーチェリー' },
    { en: 'weightlifting',  ja: '重量挙げ' },
    { en: 'wrestling',  ja: 'レスリング' },
    { en: 'hobby',  ja: '趣味' },
    { en: 'climbing',  ja: '登山' },
    { en: 'camping',  ja: 'キャンプ' },
    { en: 'hiking',  ja: 'ハイキング' },
    { en: 'picnic',  ja: 'ピクニック' },
    { en: 'tent',  ja: 'テント' },
    { en: 'fishing',  ja: '釣り' },
    { en: 'cycling',  ja: 'サイクリング' },
    { en: 'bicycle',  ja: '自転車' },
    { en: 'bike',  ja: '自転車' },
    { en: 'painting',  ja: '絵を描くこと' },
    { en: 'reading',  ja: '読書' },
    { en: 'canoe',  ja: 'カヌー' },
    { en: 'yacht',  ja: 'ヨット' },
    { en: 'song',  ja: '歌' },
    { en: 'piano',  ja: 'ピアノ' },
    { en: 'guitar',  ja: 'ギター' },
    { en: 'violin',  ja: 'バイオリン' },
    { en: 'flute',  ja: 'フルート' },
    { en: 'drum',  ja: 'ドラム' },
    { en: 'recorder',  ja: 'リコーダー' },
    { en: 'trumpet',  ja: 'トランペット' },
    { en: 'concert',  ja: 'コンサート' },
    { en: 'movie',  ja: '映画' },
    { en: 'playing',  ja: '遊ぶこと' },
    { en: 'comic',  ja: 'マンガ' },
    { en: 'firework',  ja: '花火' },
    { en: 'tag',  ja: 'おにごっこ' },
    { en: 'unicycle',  ja: '一輪車' },
    { en: 'animal',  ja: '動物' },
    { en: 'cat',  ja: '猫' },
    { en: 'dog',  ja: '犬' },
    { en: 'mouse',  ja: 'ねずみ' },
    { en: 'rabbit',  ja: 'ウサギ' },
    { en: 'lion',  ja: 'ライオン' },
    { en: 'tiger',  ja: 'トラ' },
    { en: 'cow',  ja: '牛' },
    { en: 'horse',  ja: '馬' },
    { en: 'sheep',  ja: '羊' },
    { en: 'elephant',  ja: 'ぞう' },
    { en: 'gorilla',  ja: 'ゴリラ' },
    { en: 'panda',  ja: 'パンダ' },
    { en: 'monkey',  ja: 'サル' },
    { en: 'pig',  ja: '豚' },
    { en: 'wild boar',  ja: 'イノシシ' },
    { en: 'bear',  ja: '熊' },
    { en: 'raccoon dog',  ja: 'タヌキ' },
    { en: 'snake',  ja: 'ヘビ' },
    { en: 'dragon',  ja: '竜' },
    { en: 'whale',  ja: 'くじら' },
    { en: 'bird',  ja: '鳥' },
    { en: 'owl',  ja: 'ふくろう' },
    { en: 'butterfly',  ja: '蝶' },
    { en: 'dragonfly',  ja: 'トンボ' },
    { en: 'grasshopper',  ja: 'バッタ' },
    { en: 'moth',  ja: 'ガ' },
    { en: 'spider',  ja: 'くも' },
    { en: 'nest',  ja: '巣' },
    { en: 'plant',  ja: '植物' },
    { en: 'flower',  ja: '花' },
    { en: 'rose',  ja: 'バラ' },
    { en: 'year',  ja: '年' },
    { en: 'month',  ja: '月' },
    { en: 'January',  ja: '一月' },
    { en: 'February',  ja: '二月' },
    { en: 'March',  ja: '三月' },
    { en: 'April',  ja: '四月' },
    { en: 'May',  ja: '五月' },
    { en: 'June',  ja: '六月' },
    { en: 'July',  ja: '七月' },
    { en: 'August',  ja: '八月' },
    { en: 'September',  ja: '九月' },
    { en: 'October',  ja: '十月' },
    { en: 'November',  ja: '十一月' },
    { en: 'December',  ja: '十二月' },
    { en: 'week',  ja: '週' },
    { en: 'Sunday',  ja: '日曜日' },
    { en: 'Monday',  ja: '月曜日' },
    { en: 'Tuesday',  ja: '火曜日' },
    { en: 'Wednesday',  ja: '水曜日' },
    { en: 'Thursday',  ja: '木曜日' },
    { en: 'Friday',  ja: '金曜日' },
    { en: 'Saturday',  ja: '土曜日' },
    { en: 'date',  ja: '日付' },
    { en: 'today',  ja: '今日' },
    { en: 'tomorrow',  ja: '明日' },
    { en: 'weekend',  ja: '週末' },
    { en: 'future',  ja: '未来' },
    { en: 'day',  ja: '日' },
    { en: 'morning',  ja: '朝' },
    { en: 'noon',  ja: '正午' },
    { en: 'afternoon',  ja: '午後' },
    { en: 'evening',  ja: '夕方' },
    { en: 'night',  ja: '夜' },
    { en: 'a.m.',  ja: '午前' },
    { en: 'p.m.',  ja: '午後' },
    { en: 'time',  ja: '時間' },
    { en: 'hour',  ja: '時間' },
    { en: 'moment',  ja: '瞬間' },
    { en: 'minute',  ja: '分' },
    { en: 'spring',  ja: '春' },
    { en: 'summer',  ja: '夏' },
    { en: 'fall',  ja: '秋' },
    { en: 'winter',  ja: '冬' },
    { en: 'vacation',  ja: '休暇' },
    { en: 'festival',  ja: '祭り' },
    { en: 'Star Festival',  ja: '七夕　' },
    { en: 'Snow Festival',  ja: '雪まつり' },
    { en: 'birthday',  ja: '誕生日' },
    { en: 'nature',  ja: '自然' },
    { en: 'sky',  ja: '空　' },
    { en: 'sun',  ja: '太陽' },
    { en: 'moon',  ja: '月　' },
    { en: 'star',  ja: '星　' },
    { en: 'mountain',  ja: '山　' },
    { en: 'sea',  ja: '海　' },
    { en: 'beach',  ja: '海岸' },
    { en: 'lake',  ja: '湖　' },
    { en: 'pond',  ja: '池　' },
    { en: 'river',  ja: '川　' },
    { en: 'rock',  ja: '岩　' },
    { en: 'tree',  ja: '木　' },
    { en: 'water',  ja: '水　' },
    { en: 'ice',  ja: '氷　' },
    { en: 'weather',  ja: '天候' },
    { en: 'sunny',  ja: '晴れの' },
    { en: 'cloudy',  ja: 'くもりの' },
    { en: 'rain',  ja: '雨' },
    { en: 'rainy',  ja: '雨の' },
    { en: 'snow',  ja: '雪　' },
    { en: 'snowy',  ja: '雪の' },
    { en: 'windy',  ja: '風の強い' },
    { en: 'rainbow',  ja: '虹　' },
    { en: 'world',  ja: '世界' },
    { en: 'country',  ja: '国　' },
    { en: 'thing',  ja: 'こと、もの' },
    { en: 'family',  ja: '家族' },
    { en: 'parent',  ja: '親　' },
    { en: 'father',  ja: '父　' },
    { en: 'mother',  ja: '母　' },
    { en: 'son',  ja: '息子' },
    { en: 'daughter',  ja: '娘　' },
    { en: 'sibling',  ja: '兄弟' },
    { en: 'brother',  ja: '兄、弟' },
    { en: 'sister',  ja: '姉、妹' },
    { en: 'grandparents',  ja: '祖父母' },
    { en: 'grandfather',  ja: '祖父　' },
    { en: 'grandmother',  ja: '祖母　' },
    { en: 'uncle',  ja: 'おじ' },
    { en: 'aunt',  ja: 'おば' },
    { en: 'cousin',  ja: 'いとこ' },
    { en: 'friend',  ja: '友達　' },
    { en: 'who',  ja: 'だれが' },
    { en: 'which',  ja: 'どちらが' },
    { en: 'whose',  ja: 'だれの' },
    { en: 'when',  ja: 'いつ' },
    { en: 'where',  ja: 'どこで' },
    { en: 'why　',  ja: 'なぜ　' },
    { en: 'how　',  ja: 'どうやって' },
    { en: 'always',  ja: 'いつも' },
    { en: 'often',  ja: 'しばしば' },
    { en: 'usually',  ja: 'たいてい' },
    { en: 'sometimes',  ja: 'ときどき' },
    { en: 'never',  ja: '一度もない。' },
    { en: 'very',  ja: 'とても' },
    { en: 'really',  ja: '本当に' },
    { en: 'so　',  ja: 'とても' },
    { en: 'too',  ja: 'も、また' },
    { en: 'yes',  ja: 'はい' },
    { en: 'no　',  ja: 'いいえ' },
    { en: 'not',  ja: '〜ない' },
    { en: 'again',  ja: 'ふたたび' },
    { en: 'also',  ja: 'も、また' },
    { en: 'next',  ja: '次に' },
    { en: 'easily',  ja: '簡単に' },
    { en: 'fast',  ja: '早く' },
    { en: 'early',  ja: '早く' },
    { en: 'well',  ja: '上手に' },
    { en: 'hard',  ja: '一生懸命' },
    { en: 'now',  ja: '今　' },
    { en: 'then',  ja: 'その時' },
    { en: 'home',  ja: '家　' },
    { en: 'straight',  ja: 'まっすぐに' },
    { en: 'here',  ja: 'ここに' },
    { en: 'there',  ja: 'そこに' },
    { en: 'up',  ja: '上へ' },
    { en: 'down',  ja: '下へ' },
    { en: 'maybe',  ja: 'たぶん' },
    { en: 'please',  ja: 'どうぞ' },
    { en: 'this',  ja: 'これは' },
    { en: 'that',  ja: 'あれは' },
    { en: 'these',  ja: 'これらは' },
    { en: 'those',  ja: 'それらは' },
    { en: 'everything',  ja: '全て　' },
    { en: 'something',  ja: 'なにか' },
    { en: 'anything',  ja: '何でも' },
    { en: 'everyone',  ja: 'みんな' },
    { en: 'I　',  ja: 'わたしは' },
    { en: 'my　',  ja: 'わたしの' },
    { en: 'me',  ja: '私を' },
    { en: 'mine',  ja: '私のもの' },
    { en: 'you',  ja: 'あなたは' },
    { en: 'your',  ja: 'あなたの' },
    { en: 'yours　',  ja: 'あなたのもの' },
    { en: 'he',  ja: '彼は' },
    { en: 'his　　',  ja: '彼の、彼のもの' },
    { en: 'him',  ja: '彼を' },
    { en: 'she',  ja: '彼女は' },
    { en: 'her',  ja: '彼女の' },
    { en: 'hers　',  ja: '彼女のもの' },
    { en: 'it',  ja: 'それは' },
    { en: 'its',  ja: 'それの' },
    { en: 'we　',  ja: '私たちは' },
    { en: 'our　',  ja: '私たちの' },
    { en: 'us　',  ja: '私たちを' },
    { en: 'ours　',  ja: '私たちのもの' },
    { en: 'they',  ja: '彼らは' },
    { en: 'their',  ja: '彼らの' },
    { en: 'them',  ja: '彼らを' },
    { en: 'theirs',  ja: '彼らのもの' },
    { en: 'what',  ja: '何の' },
    { en: 'and　',  ja: 'そして、と' },
    { en: 'because',  ja: 'なぜなら' },
    { en: 'before',  ja: '前に　' },
    { en: 'after',  ja: '後に　' },
    { en: 'outside',  ja: '外側　' }
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
      ctx.fillText('よこむきにしてね',
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
        '英語クイズ小学生向けゲーム',
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

      const cw = 170, ch = 170;
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

