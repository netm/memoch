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
    { en: 'a',  ja: '1つの' },
    { en: 'able',  ja: 'できる　有能な' },
    { en: 'afternoon',  ja: '午後' },
    { en: 'again',  ja: '再び' },
    { en: 'age',  ja: '年齢　時代' },
    { en: 'ago',  ja: '前' },
    { en: 'all',  ja: 'すべての' },
    { en: 'already',  ja: 'すでに' },
    { en: 'also',  ja: 'もまた' },
    { en: 'always',  ja: 'いつも' },
    { en: 'America',  ja: 'アメリカ合衆国' },
    { en: 'an',  ja: '1つの' },
    { en: 'and',  ja: '～と　そして' },
    { en: 'angry',  ja: '怒った　怒り' },
    { en: 'animal',  ja: '動物' },
    { en: 'apple',  ja: 'りんご' },
    { en: 'April',  ja: '４月' },
    { en: 'arrive',  ja: '到着する' },
    { en: 'at',  ja: '～に' },
    { en: 'August',  ja: '８月' },
    { en: 'aunt',  ja: 'おば' },
    { en: 'Australia',  ja: 'オーストラリア' },
    { en: 'autumn',  ja: '秋' },
    { en: 'bad',  ja: '悪い' },
    { en: 'bag',  ja: 'カバン' },
    { en: 'ball',  ja: 'ボール' },
    { en: 'bank',  ja: '銀行，土手' },
    { en: 'bank (embankment)',  ja: '土手' },
    { en: 'baseball',  ja: '野球' },
    { en: 'basketball',  ja: 'バスケットボール' },
    { en: 'bat',  ja: 'バット' },
    { en: 'beautiful',  ja: '美しい' },
    { en: 'bed',  ja: 'ベッド' },
    { en: 'best',  ja: '一番良い' },
    { en: 'big',  ja: '大きい' },
    { en: 'bike',  ja: '自転車' },
    { en: 'bird',  ja: '鳥' },
    { en: 'birthday',  ja: '誕生日' },
    { en: 'black',  ja: '黒い' },
    { en: 'blue',  ja: '青い' },
    { en: 'boat',  ja: 'ボート' },
    { en: 'book',  ja: '本' },
    { en: 'both',  ja: '両方' },
    { en: 'box',  ja: '箱' },
    { en: 'boy',  ja: '少年' },
    { en: 'bread',  ja: 'パン' },
    { en: 'breakfast',  ja: '朝食' },
    { en: 'brother',  ja: '兄弟' },
    { en: 'bus',  ja: 'バス' },
    { en: 'busy',  ja: '忙しい' },
    { en: 'but',  ja: 'しかし' },
    { en: 'buy',  ja: '買う' },
    { en: 'by',  ja: '～のそばに、～よって' },
    { en: 'cake',  ja: 'ケーキ' },
    { en: 'camera',  ja: 'カメラ' },
    { en: 'can',  ja: '～できる、してもよい' },
    { en: 'Canada',  ja: 'カナダ' },
    { en: 'cap',  ja: '帽子' },
    { en: 'car',  ja: '自動車' },
    { en: 'careful',  ja: '注意深い' },
    { en: 'cat',  ja: '猫' },
    { en: 'catch',  ja: '捕まえる，(列車に)間に合う' },
    { en: 'chair',  ja: 'いす' },
    { en: 'chance',  ja: '機会' },
    { en: 'church',  ja: '教会' },
    { en: 'citizen',  ja: '市民' },
    { en: 'city',  ja: '市，都会' },
    { en: 'class',  ja: '学級　授業' },
    { en: 'clean',  ja: 'きれいな' },
    { en: 'clerk',  ja: '店員' },
    { en: 'cold',  ja: '冷たい　寒い' },
    { en: 'collect',  ja: '集める' },
    { en: 'color',  ja: '色' },
    { en: 'come',  ja: '来る' },
    { en: 'computer',  ja: 'コンピュータ' },
    { en: 'cook',  ja: '料理人' },
    { en: 'cool',  ja: '涼しい' },
    { en: 'country',  ja: '国，いなか，地方' },
    { en: 'cow',  ja: '雌牛' },
    { en: 'cup',  ja: 'カップ' },
    { en: 'dance',  ja: '踊る' },
    { en: 'danger',  ja: '危険' },
    { en: 'dark',  ja: '暗い，黒い' },
    { en: 'date',  ja: '日付' },
    { en: 'daughter',  ja: '娘' },
    { en: 'day',  ja: '日' },
    { en: 'December',  ja: '１２月' },
    { en: 'desk',  ja: '机' },
    { en: 'diary',  ja: '日記' },
    { en: 'did',  ja: 'doの過去形' },
    { en: 'dinner',  ja: '夕食' },
    { en: 'do',  ja: 'する' },
    { en: 'doctor',  ja: '医者' },
    { en: 'does',  ja: 'する（３人称単数）' },
    { en: 'dog',  ja: '犬' },
    { en: 'doll',  ja: '人形' },
    { en: 'door',  ja: '扉、ドア' },
    { en: 'dream',  ja: '夢' },
    { en: 'drink',  ja: '飲む' },
    { en: 'early',  ja: '早い' },
    { en: 'east',  ja: '東' },
    { en: 'easy',  ja: '易しい（やさしい），気楽に' },
    { en: 'eat',  ja: '食べる' },
    { en: 'egg',  ja: '卵' },
    { en: 'eight',  ja: '8' },
    { en: 'eighteen',  ja: '18' },
    { en: 'eighty',  ja: '80' },
    { en: 'eleven',  ja: '11' },
    { en: 'English',  ja: '英語' },
    { en: 'enjoy',  ja: '楽しむ' },
    { en: 'evening',  ja: '晩' },
    { en: 'every',  ja: '毎～' },
    { en: 'everybody',  ja: 'だれでもみな' },
    { en: 'everyone',  ja: 'みんな' },
    { en: 'everything',  ja: 'すべてのもの' },
    { en: 'fall',  ja: '秋' },
    { en: 'family',  ja: '家族' },
    { en: 'famous',  ja: '有名な' },
    { en: 'far',  ja: '遠くに　はるかに' },
    { en: 'fast',  ja: '速い' },
    { en: 'father',  ja: '父' },
    { en: 'favorite',  ja: 'お気に入りの　大好きな' },
    { en: 'February',  ja: '２月' },
    { en: 'field',  ja: '野原　競技場' },
    { en: 'fifteen',  ja: '15' },
    { en: 'fifty',  ja: '50' },
    { en: 'fine',  ja: 'すばらしい　元気な　晴れた' },
    { en: 'first',  ja: '１日' },
    { en: 'fish',  ja: '魚' },
    { en: 'five',  ja: '5' },
    { en: 'floor',  ja: '床　階' },
    { en: 'flower',  ja: '花' },
    { en: 'forty',  ja: '40' },
    { en: 'four',  ja: '4' },
    { en: 'fourteen',  ja: '14' },
    { en: 'free',  ja: '自由な、無料の' },
    { en: 'Friday',  ja: '金曜日' },
    { en: 'friend',  ja: '友人' },
    { en: 'friendly',  ja: '親しみやすい' },
    { en: 'from',  ja: '～から' },
    { en: 'fruit',  ja: '果物' },
    { en: 'full',  ja: '満タンの、いっぱいの' },
    { en: 'fun',  ja: '楽しみ　おもしろいこと' },
    { en: 'funny',  ja: 'おかしい、おもしろい' },
    { en: 'garden',  ja: '庭' },
    { en: 'gate',  ja: '門' },
    { en: 'get',  ja: '得る　着く　乗る' },
    { en: 'girl',  ja: '少女' },
    { en: 'give',  ja: '与える、(会などを)開く' },
    { en: 'glad',  ja: 'うれしい' },
    { en: 'glass',  ja: 'コップ　ガラス' },
    { en: 'go',  ja: '行く' },
    { en: 'good',  ja: '良い' },
    { en: 'green',  ja: '緑の' },
    { en: 'guitar',  ja: 'ギター' },
    { en: 'hair',  ja: '髪の毛' },
    { en: 'half',  ja: '半分' },
    { en: 'hand',  ja: '手' },
    { en: 'happy',  ja: '幸福な　楽しい' },
    { en: 'have',  ja: '持っている　食べる' },
    { en: 'he',  ja: '彼は' },
    { en: 'help',  ja: '助ける' },
    { en: 'her',  ja: '彼女の' },
    { en: 'here',  ja: 'ここに' },
    { en: 'hers',  ja: '彼女のもの' },
    { en: 'herself',  ja: '彼女自身' },
    { en: 'high',  ja: '高い' },
    { en: 'him',  ja: '彼を　彼に' },
    { en: 'himself',  ja: '彼自身' },
    { en: 'his',  ja: '彼の' },
    { en: 'home',  ja: '家　家庭の' },
    { en: 'homework',  ja: '宿題' },
    { en: 'honest',  ja: '正直な' },
    { en: 'hospital',  ja: '病院' },
    { en: 'hot',  ja: '暑い' },
    { en: 'hotel',  ja: 'ホテル' },
    { en: 'hour',  ja: '時間' },
    { en: 'house',  ja: '家' },
    { en: 'how',  ja: 'どのくらい' },
    { en: 'hungry',  ja: '空腹の' },
    { en: 'I',  ja: '私は　私が' },
    { en: 'ill',  ja: '病気の' },
    { en: 'in',  ja: '～に、～で' },
    { en: 'interesting',  ja: '興味深い' },
    { en: 'it',  ja: 'それは' },
    { en: 'its',  ja: 'それの' },
    { en: 'itself',  ja: 'それ自身' },
    { en: 'January',  ja: '１月' },
    { en: 'Japan',  ja: '日本' },
    { en: 'Japanese',  ja: '日本語' },
    { en: 'July',  ja: '７月' },
    { en: 'June',  ja: '６月' },
    { en: 'junior',  ja: '年下の　下級の' },
    { en: 'kind',  ja: '親切な' },
    { en: 'kitchen',  ja: '台所' },
    { en: 'know',  ja: '知る　わかっている' },
    { en: 'large',  ja: '大きい　広い' },
    { en: 'later',  ja: '後で' },
    { en: 'learn',  ja: '学ぶ　覚える' },
    { en: 'leave',  ja: '離れる　去る　残す' },
    { en: 'left',  ja: '左' },
    { en: 'lemon',  ja: 'レモン' },
    { en: 'letter',  ja: '手紙' },
    { en: 'library',  ja: '図書館' },
    { en: 'light',  ja: '明るい' },
    { en: 'like',  ja: '好む' },
    { en: 'line',  ja: '線　列' },
    { en: 'little',  ja: '小さい　幼い　少し' },
    { en: 'live',  ja: '住む　生きる' },
    { en: 'long',  ja: '長い' },
    { en: 'look',  ja: '見る　～に見える' },
    { en: 'lot',  ja: '多く　たくさん' },
    { en: 'low',  ja: '低い' },
    { en: 'lunch',  ja: '昼食' },
    { en: 'mail',  ja: '郵便' },
    { en: 'make',  ja: '作る　～を～にする' },
    { en: 'man',  ja: '男の人' },
    { en: 'many',  ja: 'たくさんの' },
    { en: 'map',  ja: '地図' },
    { en: 'March',  ja: '３月' },
    { en: 'math',  ja: '数学' },
    { en: 'May',  ja: '５月' },
    { en: 'me',  ja: '私を' },
    { en: 'meal',  ja: '食事' },
    { en: 'meet',  ja: '会う' },
    { en: 'meter',  ja: 'メートル' },
    { en: 'milk',  ja: '牛乳' },
    { en: 'mine',  ja: '私のもの' },
    { en: 'minute',  ja: '分　ちょっとの間' },
    { en: 'mitt',  ja: 'ミット' },
    { en: 'Monday',  ja: '月曜日' },
    { en: 'month',  ja: '月' },
    { en: 'morning',  ja: '朝' },
    { en: 'most',  ja: 'ほとんど' },
    { en: 'mother',  ja: '母' },
    { en: 'move',  ja: '動く　感動させる' },
    { en: 'Mr. ～',  ja: '(男性)～さん' },
    { en: 'Ms. ～',  ja: '(女性)～さん' },
    { en: 'much',  ja: '多くの' },
    { en: 'music',  ja: '音楽' },
    { en: 'my',  ja: '私の' },
    { en: 'myself',  ja: '私自身を' },
    { en: 'name',  ja: '名前' },
    { en: 'need',  ja: '必要とする' },
    { en: 'new',  ja: '新しい' },
    { en: 'next',  ja: '次の　隣の' },
    { en: 'nice',  ja: 'よい　すばらしい　すてきな' },
    { en: 'night',  ja: '夜' },
    { en: 'nine',  ja: '9' },
    { en: 'nineteen',  ja: '19' },
    { en: 'ninety',  ja: '90' },
    { en: 'no',  ja: 'いいえ' },
    { en: 'nobody',  ja: 'だれも～ない' },
    { en: 'noisy',  ja: 'うるさい' },
    { en: 'none',  ja: '何も(だれも)～ない' },
    { en: 'noon',  ja: '正午' },
    { en: 'north',  ja: '北' },
    { en: 'not',  ja: '～でない' },
    { en: 'notebook',  ja: 'ノート' },
    { en: 'nothing',  ja: '何も～ない' },
    { en: 'November',  ja: '１１月' },
    { en: 'now',  ja: '今' },
    { en: 'number',  ja: '数' },
    { en: 'nurse',  ja: '看護婦' },
    { en: 'o’clock',  ja: '～時' },
    { en: 'o’clock',  ja: '～時' },
    { en: 'October',  ja: '１０月' },
    { en: 'of',  ja: '～の' },
    { en: 'office',  ja: '事務所' },
    { en: 'often',  ja: 'しばしば' },
    { en: 'old',  ja: '年をとった　古い' },
    { en: 'on',  ja: '～の上に、～に' },
    { en: 'one',  ja: '1' },
    { en: 'open',  ja: '開ける' },
    { en: 'or',  ja: '～または' },
    { en: 'orange',  ja: 'オレンジ' },
    { en: 'our',  ja: '私たちの' },
    { en: 'ours',  ja: '私たちのもの' },
    { en: 'ourselves',  ja: '私たち自身を' },
    { en: 'parent',  ja: '親' },
    { en: 'park',  ja: '公園' },
    { en: 'pen',  ja: 'ペン' },
    { en: 'pencil',  ja: '鉛筆' },
    { en: 'people',  ja: '人々' },
    { en: 'piano',  ja: 'ピアノ' },
    { en: 'picture',  ja: '絵　写真' },
    { en: 'pilot',  ja: 'パイロット' },
    { en: 'place',  ja: '場所' },
    { en: 'plane',  ja: '飛行機' },
    { en: 'play',  ja: '遊ぶ，(スポーツを)をする，演奏する' },
    { en: 'player',  ja: '選手　演奏者' },
    { en: 'poor',  ja: '貧乏な　かわいそうな　不十分な' },
    { en: 'popular',  ja: '人気のある' },
    { en: 'pot',  ja: 'ポット' },
    { en: 'present',  ja: 'プレゼント' },
    { en: 'put',  ja: '置く' },
    { en: 'question',  ja: '質問' },
    { en: 'quiet',  ja: '静かな' },
    { en: 'racket',  ja: 'ラケット' },
    { en: 'rain',  ja: '雨' },
    { en: 'read',  ja: '読む' },
    { en: 'red',  ja: '赤い' },
    { en: 'rich',  ja: '金持ちの，豊かな' },
    { en: 'ride',  ja: '乗る' },
    { en: 'right',  ja: '右、権利' },
    { en: 'room',  ja: '部屋' },
    { en: 'rose',  ja: 'バラ' },
    { en: 'run',  ja: '走る' },
    { en: 'sad',  ja: '悲しい' },
    { en: 'Saturday',  ja: '土曜日' },
    { en: 'school',  ja: '学校' },
    { en: 'science',  ja: '科学' },
    { en: 'season',  ja: '季節' },
    { en: 'second',  ja: '２日' },
    { en: 'sell',  ja: '売る' },
    { en: 'send',  ja: '送る' },
    { en: 'September',  ja: '９月' },
    { en: 'seven',  ja: '7' },
    { en: 'seventeen',  ja: '17' },
    { en: 'seventy',  ja: '70' },
    { en: 'she',  ja: '彼女は' },
    { en: 'sheep',  ja: '羊' },
    { en: 'short',  ja: '短い　背が低い' },
    { en: 'shy',  ja: '恥ずかしがりの' },
    { en: 'sick',  ja: '病気で(の)' },
    { en: 'sing',  ja: '歌う' },
    { en: 'singer',  ja: '歌手' },
    { en: 'sister',  ja: '姉妹' },
    { en: 'six',  ja: '6' },
    { en: 'sixteen',  ja: '16' },
    { en: 'sixty',  ja: '60' },
    { en: 'slow',  ja: '遅い' },
    { en: 'slowly',  ja: 'ゆっくりと' },
    { en: 'small',  ja: '小さな' },
    { en: 'smart',  ja: '賢い' },
    { en: 'snow',  ja: '雪' },
    { en: 'so',  ja: 'そんなに' },
    { en: 'soccer',  ja: 'サッカー' },
    { en: 'some',  ja: 'いくつかの' },
    { en: 'someone',  ja: 'だれか' },
    { en: 'something',  ja: '何か' },
    { en: 'sometimes',  ja: '時々' },
    { en: 'son',  ja: '息子' },
    { en: 'soon',  ja: 'すぐに' },
    { en: 'sorry',  ja: '残念な' },
    { en: 'south',  ja: '南' },
    { en: 'speak',  ja: '話す' },
    { en: 'sport',  ja: 'スポーツ' },
    { en: 'spring',  ja: '春' },
    { en: 'stamp',  ja: '切手' },
    { en: 'stand',  ja: '立つ' },
    { en: 'station',  ja: '駅' },
    { en: 'stay',  ja: '滞在する' },
    { en: 'stop',  ja: '止める　止まる' },
    { en: 'store',  ja: '店' },
    { en: 'strong',  ja: '強い　じょうぶな' },
    { en: 'student',  ja: '学生' },
    { en: 'study',  ja: '勉強する' },
    { en: 'subject',  ja: '科目　題目' },
    { en: 'summer',  ja: '夏' },
    { en: 'Sunday',  ja: '日曜日' },
    { en: 'supper',  ja: '夕食' },
    { en: 'swim',  ja: '泳ぐ' },
    { en: 'table',  ja: 'テーブル' },
    { en: 'tall',  ja: '背の高い' },
    { en: 'tape',  ja: 'テープ' },
    { en: 'teacher',  ja: '先生' },
    { en: 'ten',  ja: '10' },
    { en: 'tennis',  ja: 'テニス' },
    { en: 'that',  ja: 'あの' },
    { en: 'the',  ja: 'その' },
    { en: 'their',  ja: '彼らの　彼女らの' },
    { en: 'theirs',  ja: '彼(彼女)らのもの' },
    { en: 'them',  ja: '彼(彼女)らを(に)' },
    { en: 'themselves',  ja: '彼(彼女)ら自身' },
    { en: 'there',  ja: 'そこに' },
    { en: 'these',  ja: 'これらの' },
    { en: 'they',  ja: 'それらは，彼(彼女)らは' },
    { en: 'thing',  ja: 'こと、物' },
    { en: 'third',  ja: '３日' },
    { en: 'thirteen',  ja: '13' },
    { en: 'thirty',  ja: '30' },
    { en: 'this',  ja: 'この' },
    { en: 'those',  ja: 'あれらの' },
    { en: 'three',  ja: '3' },
    { en: 'Thursday',  ja: '木曜日' },
    { en: 'time',  ja: '時　～回' },
    { en: 'to',  ja: '～へ' },
    { en: 'today',  ja: '今日　現在' },
    { en: 'together',  ja: '一緒に' },
    { en: 'tomorrow',  ja: '明日' },
    { en: 'too',  ja: '～もまた　～すぎる' },
    { en: 'town',  ja: '町' },
    { en: 'train',  ja: '電車、列車' },
    { en: 'tree',  ja: '木' },
    { en: 'try',  ja: '試す' },
    { en: 'Tuesday',  ja: '火曜日' },
    { en: 'TV',  ja: 'テレビ' },
    { en: 'twelve',  ja: '12' },
    { en: 'twenty',  ja: '20' },
    { en: 'two',  ja: '2' },
    { en: 'uncle',  ja: 'おじ' },
    { en: 'under',  ja: '～の下に' },
    { en: 'up',  ja: '上へ' },
    { en: 'us',  ja: '私たちを(に)' },
    { en: 'use',  ja: '使う' },
    { en: 'usually',  ja: 'ふつう' },
    { en: 'very',  ja: 'とても　非常に' },
    { en: 'village',  ja: '村' },
    { en: 'visit',  ja: '訪問する' },
    { en: 'wait',  ja: '待つ' },
    { en: 'walk',  ja: '散歩' },
    { en: 'wall',  ja: '壁' },
    { en: 'want',  ja: '欲しい' },
    { en: 'warm',  ja: '温暖な' },
    { en: 'wash',  ja: '洗う' },
    { en: 'watch',  ja: '腕時計' },
    { en: 'way',  ja: '道　方法' },
    { en: 'we',  ja: '私たちは' },
    { en: 'weather',  ja: '天気' },
    { en: 'Wednesday',  ja: '水曜日' },
    { en: 'week',  ja: '週' },
    { en: 'well',  ja: 'よく　じょうずに' },
    { en: 'west',  ja: '西' },
    { en: 'what',  ja: '何' },
    { en: 'where',  ja: 'どこに' },
    { en: 'which',  ja: 'どちら' },
    { en: 'white',  ja: '白い' },
    { en: 'who',  ja: 'だれ' },
    { en: 'whose',  ja: 'だれの(もの)' },
    { en: 'why',  ja: 'なぜ' },
    { en: 'window',  ja: '窓' },
    { en: 'winter',  ja: '冬' },
    { en: 'with',  ja: '～といっしよに' },
    { en: 'woman',  ja: '女性' },
    { en: 'work',  ja: '仕事　作品' },
    { en: 'write',  ja: '書く　手紙を書く' },
    { en: 'yard',  ja: '庭' },
    { en: 'year',  ja: '年' },
    { en: 'yes',  ja: 'はい' },
    { en: 'yesterday',  ja: '昨日' },
    { en: 'yet',  ja: 'まだ(～でない)' },
    { en: 'you',  ja: 'あなたに(を)，あなたがたを' },
    { en: 'young',  ja: '若い' },
    { en: 'your',  ja: 'あなたの，あなたがたの' },
    { en: 'yours',  ja: 'あなたのもの，あなたがたのもの' },
    { en: 'yourself',  ja: 'あなた自身' },
    { en: 'true',  ja: 'ほんとうの' }
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
        '英語中学生クイズ面白いゲーム 英単語中学一年生',
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
