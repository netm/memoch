// quiz.js
// 全文JavaScript — 漢字クイズの動作を制御します

(() => {
  // 問題データ: {kanji: '漢字', yomi: 'ひらがな'}
  const QUIZ_DATA = [
    { kanji: "学校", yomi: "がっこう" },
    { kanji: "時間", yomi: "じかん" },
    { kanji: "先生", yomi: "せんせい" },
    { kanji: "友達", yomi: "ともだち" },
    { kanji: "猫", yomi: "ねこ" },
    { kanji: "大人", yomi: "おとな" },
    { kanji: "名前", yomi: "なまえ" },
    { kanji: "水曜日", yomi: "すいようび" },
    { kanji: "花火", yomi: "はなび" },
    { kanji: "日本", yomi: "にほん" },
    { kanji: "電車", yomi: "でんしゃ" },
    { kanji: "新聞", yomi: "しんぶん" },
    { kanji: "公園", yomi: "こうえん" },
    { kanji: "料理", yomi: "りょうり" },
    { kanji: "海", yomi: "うみ" },
    { kanji: "月曜日", yomi: "げつようび" },
    { kanji: "火曜日", yomi: "かようび" },
    { kanji: "木曜日", yomi: "もくようび" },
    { kanji: "金曜日", yomi: "きんようび" },
    { kanji: "土曜日", yomi: "どようび" },
    { kanji: "日曜日", yomi: "にちようび" },
    { kanji: "朝", yomi: "あさ" },
    { kanji: "昼", yomi: "ひる" },
    { kanji: "夜", yomi: "よる" },
    { kanji: "母", yomi: "はは" },
    { kanji: "父", yomi: "ちち" },
    { kanji: "兄", yomi: "あに" },
    { kanji: "弟", yomi: "おとうと" },
    { kanji: "姉", yomi: "あね" },
    { kanji: "妹", yomi: "いもうと" },
    { kanji: "雨", yomi: "あめ" },
    { kanji: "雪", yomi: "ゆき" },
    { kanji: "風", yomi: "かぜ" },
    { kanji: "空", yomi: "そら" },
    { kanji: "山", yomi: "やま" },
    { kanji: "川", yomi: "かわ" },
    { kanji: "森", yomi: "もり" },
    { kanji: "道", yomi: "みち" },
    { kanji: "車", yomi: "くるま" },
    { kanji: "自転車", yomi: "じてんしゃ" },
    { kanji: "歩道", yomi: "ほどう" },
    { kanji: "橋", yomi: "はし" },
    { kanji: "店", yomi: "みせ" },
    { kanji: "学校長", yomi: "こうちょう" },
    { kanji: "図書館", yomi: "としょかん" },
    { kanji: "教室", yomi: "きょうしつ" },
    { kanji: "机", yomi: "つくえ" },
    { kanji: "椅子", yomi: "いす" },
    { kanji: "黒板", yomi: "こくばん" },
    { kanji: "鉛筆", yomi: "えんぴつ" },
    { kanji: "消しゴム", yomi: "け" },
    { kanji: "漢字", yomi: "かんじ" },
    { kanji: "算数", yomi: "さんすう" },
    { kanji: "理科", yomi: "りか" },
    { kanji: "社会", yomi: "しゃかい" },
    { kanji: "音楽", yomi: "おんがく" },
    { kanji: "図工", yomi: "ずこう" },
    { kanji: "体育", yomi: "たいいく" },
    { kanji: "給食", yomi: "きゅうしょく" },
    { kanji: "昼休み", yomi: "ひるやす" },
    { kanji: "運動会", yomi: "うんどうかい" },
    { kanji: "遠足", yomi: "えんそく" },
    { kanji: "宿題", yomi: "しゅくだい" },
    { kanji: "試験", yomi: "しけん" },
    { kanji: "合格", yomi: "ごうかく" },
    { kanji: "不合格", yomi: "ふごうかく" },
    { kanji: "賞", yomi: "しょう" },
    { kanji: "友人", yomi: "ゆうじん" },
    { kanji: "家族", yomi: "かぞく" },
    { kanji: "友", yomi: "とも" },
    { kanji: "名前簿", yomi: "なまえば" },
    { kanji: "歌", yomi: "うた" },
    { kanji: "本", yomi: "ほん" },
    { kanji: "絵本", yomi: "えほん" },
    { kanji: "紙", yomi: "かみ" },
    { kanji: "色", yomi: "いろ" },
    { kanji: "赤", yomi: "あか" },
    { kanji: "青", yomi: "あお" },
    { kanji: "白", yomi: "しろ" },
    { kanji: "黒", yomi: "くろ" },
    { kanji: "黄色", yomi: "きいろ" },
    { kanji: "緑", yomi: "みどり" },
    { kanji: "夏", yomi: "なつ" },
    { kanji: "春", yomi: "はる" },
    { kanji: "秋", yomi: "あき" },
    { kanji: "冬", yomi: "ふゆ" },
    { kanji: "昼食", yomi: "ちゅうしょく" },
    { kanji: "夕食", yomi: "ゆうしょく" },
    { kanji: "朝食", yomi: "ちょうしょく" },
    { kanji: "牛乳", yomi: "ぎゅうにゅう" },
    { kanji: "果物", yomi: "くだもの" },
    { kanji: "野菜", yomi: "やさい" },
    { kanji: "米", yomi: "こめ" },
    { kanji: "魚", yomi: "さかな" },
    { kanji: "鳥", yomi: "とり" },
    { kanji: "犬", yomi: "いぬ" },
    { kanji: "動物", yomi: "どうぶつ" },
    { kanji: "草", yomi: "くさ" },
    { kanji: "花", yomi: "はな" },
    { kanji: "家", yomi: "いえ" },
    { kanji: "部屋", yomi: "へや" },
    { kanji: "窓", yomi: "まど" },
    { kanji: "扉", yomi: "とびら" },
    { kanji: "道具", yomi: "どうぐ" },
    { kanji: "箱", yomi: "はこ" },
    { kanji: "鍵", yomi: "かぎ" },
    { kanji: "服", yomi: "ふく" },
    { kanji: "靴", yomi: "くつ" },
    { kanji: "帽子", yomi: "ぼうし" },
    { kanji: "手紙", yomi: "てがみ" },
    { kanji: "絵", yomi: "え" },
    { kanji: "時間割", yomi: "じかんわり" },
    { kanji: "週", yomi: "しゅう" },
    { kanji: "月", yomi: "つき" },
    { kanji: "年", yomi: "とし" },
    { kanji: "朝礼", yomi: "ちょうれい" },
    { kanji: "留守", yomi: "るす" },
    { kanji: "地図", yomi: "ちず" },
    { kanji: "先生室", yomi: "せんせいしつ" },
    { kanji: "門", yomi: "もん" },
    { kanji: "掃除", yomi: "そうじ" },
    { kanji: "当番", yomi: "とうばん" },
    { kanji: "列", yomi: "れつ" },
    { kanji: "番", yomi: "ばん" },
    { kanji: "景色", yomi: "けしき" },
    { kanji: "地面", yomi: "じめん" },
    { kanji: "影", yomi: "かげ" },
{ kanji: "窓口", yomi: "まどぐち" },
{ kanji: "電気", yomi: "でんき" },
{ kanji: "病院", yomi: "びょういん" },
{ kanji: "薬", yomi: "くすり" },
{ kanji: "海岸", yomi: "かいがん" },
{ kanji: "森田", yomi: "もりた" },
{ kanji: "石", yomi: "いし" },
{ kanji: "池", yomi: "いけ" },
{ kanji: "耳", yomi: "みみ" },
{ kanji: "目", yomi: "め" },
{ kanji: "口", yomi: "くち" },
{ kanji: "手", yomi: "て" },
{ kanji: "足", yomi: "あし" },
{ kanji: "指", yomi: "ゆび" },
{ kanji: "心", yomi: "こころ" },
{ kanji: "町", yomi: "まち" },
{ kanji: "市役所", yomi: "しやくしょ" },
{ kanji: "会社", yomi: "かいしゃ" },
{ kanji: "社長", yomi: "しゃちょう" },
{ kanji: "銀行", yomi: "ぎんこう" },
{ kanji: "郵便局", yomi: "ゆうびんきょく" },
{ kanji: "住所", yomi: "じゅうしょ" },
{ kanji: "電話", yomi: "でんわ" },
{ kanji: "番号", yomi: "ばんごう" },
{ kanji: "切手", yomi: "きって" },
{ kanji: "荷物", yomi: "にもつ" },
{ kanji: "料理人", yomi: "りょうりにん" },
{ kanji: "台所", yomi: "だいどころ" },
{ kanji: "庭", yomi: "にわ" },
{ kanji: "花壇", yomi: "かだん" },
{ kanji: "果樹園", yomi: "かじゅえん" },
{ kanji: "畑", yomi: "はたけ" },
{ kanji: "農家", yomi: "のうか" },
{ kanji: "牛", yomi: "うし" },
{ kanji: "馬", yomi: "うま" },
{ kanji: "羊", yomi: "ひつじ" },
{ kanji: "池田", yomi: "いけだ" },
{ kanji: "島", yomi: "しま" },
{ kanji: "県", yomi: "けん" },
{ kanji: "市", yomi: "し" },
{ kanji: "区", yomi: "く" },
{ kanji: "県庁", yomi: "けんちょう" },
{ kanji: "教会", yomi: "きょうかい" },
{ kanji: "寺", yomi: "てら" },
{ kanji: "神社", yomi: "じんじゃ" },
{ kanji: "階段", yomi: "かいだん" },
{ kanji: "屋根", yomi: "やね" },
{ kanji: "雨戸", yomi: "あまど" },
{ kanji: "傘", yomi: "かさ" },
{ kanji: "毎日", yomi: "まいにち" },
{ kanji: "毎月", yomi: "まいつき" },
{ kanji: "去年", yomi: "きょねん" },
{ kanji: "今年", yomi: "ことし" },
{ kanji: "来年", yomi: "らいねん" },
{ kanji: "早朝", yomi: "そうちょう" },
{ kanji: "午後", yomi: "ごご" },
{ kanji: "今朝", yomi: "けさ" },
{ kanji: "今夜", yomi: "こんや" },
{ kanji: "先週", yomi: "せんしゅう" },
{ kanji: "来週", yomi: "らいしゅう" },
{ kanji: "午前", yomi: "ごぜん" },
{ kanji: "秒", yomi: "びょう" },
{ kanji: "分", yomi: "ふん" },
{ kanji: "時", yomi: "じ" },
{ kanji: "時計", yomi: "とけい" },
{ kanji: "昼間", yomi: "ひるま" },
{ kanji: "夜中", yomi: "よなか" },
{ kanji: "温度", yomi: "おんど" },
{ kanji: "気温", yomi: "きおん" },
{ kanji: "湿度", yomi: "しつど" },
{ kanji: "晴れ", yomi: "はれ" },
{ kanji: "曇り", yomi: "くもり" },
{ kanji: "雷", yomi: "かみなり" },
{ kanji: "台風", yomi: "たいふう" },
{ kanji: "地震", yomi: "じしん" },
{ kanji: "火事", yomi: "かじ" },
{ kanji: "消火", yomi: "しょうか" },
{ kanji: "救急車", yomi: "きゅうきゅうしゃ" },
{ kanji: "消防士", yomi: "しょうぼうし" },
{ kanji: "警察", yomi: "けいさつ" },
{ kanji: "交番", yomi: "こうばん" },
{ kanji: "安全", yomi: "あんぜん" },
{ kanji: "危険", yomi: "きけん" },
{ kanji: "信号", yomi: "しんごう" },
{ kanji: "横断歩道", yomi: "おうだんほどう" },
{ kanji: "停止", yomi: "ていし" },
{ kanji: "注意", yomi: "ちゅうい" },
{ kanji: "案内", yomi: "あんない" },
{ kanji: "場所", yomi: "ばしょ" },
{ kanji: "入口", yomi: "いりぐち" },
{ kanji: "出口", yomi: "でぐち" },
{ kanji: "集合", yomi: "しゅうごう" },
{ kanji: "解散", yomi: "かいさん" },
{ kanji: "連絡", yomi: "れんらく" },
{ kanji: "到着", yomi: "とうちゃく" },
{ kanji: "出発", yomi: "しゅっぱつ" },
{ kanji: "切符", yomi: "きっぷ" },
{ kanji: "料金", yomi: "りょうきん" },
{ kanji: "運賃", yomi: "うんちん" },
{ kanji: "席", yomi: "せき" },
{ kanji: "窓際", yomi: "まどぎわ" },
{ kanji: "中央", yomi: "ちゅうおう" },
{ kanji: "端", yomi: "はし" },
{ kanji: "重い", yomi: "おも" },
{ kanji: "軽い", yomi: "かる" },
{ kanji: "長い", yomi: "なが" },
{ kanji: "短い", yomi: "みじか" },
{ kanji: "高い", yomi: "たか" },
{ kanji: "低い", yomi: "ひく" },
{ kanji: "雲", yomi: "くも" },
{ kanji: "朝", yomi: "あさ" },
{ kanji: "昼", yomi: "ひる" },
{ kanji: "夜", yomi: "よる" },
{ kanji: "台所用品", yomi: "だいどころようひん" },
{ kanji: "砂", yomi: "すな" },
{ kanji: "貝", yomi: "かい" },
{ kanji: "灯", yomi: "ともしび" },
{ kanji: "虫", yomi: "むし" },
{ kanji: "蛍", yomi: "ほたる" },
{ kanji: "葉", yomi: "は" },
{ kanji: "根", yomi: "ね" },
{ kanji: "茎", yomi: "くき" },
{ kanji: "種", yomi: "たね" },
{ kanji: "畳", yomi: "たたみ" },
{ kanji: "座布団", yomi: "ざぶとん" },
{ kanji: "鏡", yomi: "かがみ" },
{ kanji: "歯", yomi: "は" },
{ kanji: "歯", yomi: "は" },
{ kanji: "顔", yomi: "かお" },
{ kanji: "髪", yomi: "かみ" },
{ kanji: "背中", yomi: "せなか" },
{ kanji: "胸", yomi: "むね" },
{ kanji: "台", yomi: "だい" },
{ kanji: "買い物", yomi: "かいもの" },
{ kanji: "値段", yomi: "ねだん" },
{ kanji: "売り場", yomi: "うりば" },
{ kanji: "店員", yomi: "てんいん" },
{ kanji: "商品", yomi: "しょうひん" },
{ kanji: "料理本", yomi: "りょうりぼん" },
{ kanji: "材料", yomi: "ざいりょう" },
{ kanji: "洗濯", yomi: "せんたく" },
{ kanji: "掃除機", yomi: "そうじき" },
{ kanji: "布団", yomi: "ふとん" },
{ kanji: "枕", yomi: "まくら" },
{ kanji: "時計台", yomi: "とけいだい" },
{ kanji: "電池", yomi: "でんち" },
{ kanji: "電源", yomi: "でんげん" },
{ kanji: "画面", yomi: "がめん" },
{ kanji: "映像", yomi: "えいぞう" },
{ kanji: "住所録", yomi: "じゅうしょろく" },
{ kanji: "名刺", yomi: "めいし" },
{ kanji: "写真", yomi: "しゃしん" },
{ kanji: "映画", yomi: "えいが" },
{ kanji: "演劇", yomi: "えんげき" },
{ kanji: "舞台", yomi: "ぶたい" },
{ kanji: "台本", yomi: "だいほん" },
{ kanji: "楽器", yomi: "がっき" },
{ kanji: "太鼓", yomi: "たいこ" },
{ kanji: "弦", yomi: "げん" },
{ kanji: "鍵盤", yomi: "けんばん" },
{ kanji: "本棚", yomi: "ほんだな" },
{ kanji: "辞書", yomi: "じしょ" },
{ kanji: "物語", yomi: "ものがたり" },
{ kanji: "勉強机", yomi: "べんきょうづくえ" },
{ kanji: "成績", yomi: "せいせき" },
{ kanji: "練習", yomi: "れんしゅう" },
{ kanji: "努力", yomi: "どりょく" },
{ kanji: "技術", yomi: "ぎじゅつ" },
{ kanji: "工場", yomi: "こうじょう" },
{ kanji: "材料費", yomi: "ざいりょうひ" },
{ kanji: "種目", yomi: "しゅもく" },
{ kanji: "記録", yomi: "きろく" },
{ kanji: "優勝", yomi: "ゆうしょう" },
{ kanji: "準優勝", yomi: "じゅんゆうしょう" },
{ kanji: "予選", yomi: "よせん" },
{ kanji: "決勝", yomi: "けっしょう" },
{ kanji: "応援", yomi: "おうえん" },
{ kanji: "観客", yomi: "かんきゃく" },
{ kanji: "入場", yomi: "にゅうじょう" },
{ kanji: "退場", yomi: "たいじょう" },
{ kanji: "案", yomi: "あん" },
{ kanji: "計画", yomi: "けいかく" },
{ kanji: "準備", yomi: "じゅんび" },
{ kanji: "整理", yomi: "せいり" },
{ kanji: "分類", yomi: "ぶんるい" },
{ kanji: "保護", yomi: "ほご" },
{ kanji: "養護", yomi: "ようご" },
{ kanji: "義務", yomi: "ぎむ" },
{ kanji: "権利", yomi: "けんり" },
{ kanji: "契約", yomi: "けいやく" },
{ kanji: "手続き", yomi: "てつづ" },
{ kanji: "選挙", yomi: "せんきょ" },
{ kanji: "投票", yomi: "とうひょう" },
{ kanji: "候補", yomi: "こうほ" },
{ kanji: "代表", yomi: "だいひょう" },
{ kanji: "委員", yomi: "いいん" },
{ kanji: "会議", yomi: "かいぎ" },
{ kanji: "議員", yomi: "ぎいん" },
{ kanji: "政党", yomi: "せいとう" },
{ kanji: "歴史", yomi: "れきし" },
{ kanji: "時代", yomi: "じだい" },
{ kanji: "昔話", yomi: "むかしばなし" },
{ kanji: "伝説", yomi: "でんせつ" },
{ kanji: "文化", yomi: "ぶんか" },
{ kanji: "伝統", yomi: "でんとう" },
{ kanji: "礼儀", yomi: "れいぎ" },
{ kanji: "挨拶", yomi: "あいさつ" },
{ kanji: "感謝", yomi: "かんしゃ" },
{ kanji: "礼", yomi: "れい" },
{ kanji: "敬語", yomi: "けいご" },
{ kanji: "約束", yomi: "やくそく" },
{ kanji: "期限", yomi: "きげん" },
{ kanji: "一月", yomi: "いちがつ" },
{ kanji: "二月", yomi: "にがつ" },
{ kanji: "三月", yomi: "さんがつ" },
{ kanji: "四月", yomi: "しがつ" },
{ kanji: "五月", yomi: "ごがつ" },
{ kanji: "六月", yomi: "ろくがつ" },
{ kanji: "七月", yomi: "しちがつ" },
{ kanji: "八月", yomi: "はちがつ" },
{ kanji: "九月", yomi: "くがつ" },
{ kanji: "十月", yomi: "じゅうがつ" },
{ kanji: "十一月", yomi: "じゅういちがつ" },
{ kanji: "十二月", yomi: "じゅうにがつ" },
{ kanji: "数字", yomi: "すうじ" },
{ kanji: "一日", yomi: "ついたち" },
{ kanji: "二日", yomi: "ふつか" },
{ kanji: "三日", yomi: "みっか" },
{ kanji: "四日", yomi: "よっか" },
{ kanji: "五日", yomi: "いつか" },
{ kanji: "六日", yomi: "むいか" },
{ kanji: "七日", yomi: "なのか" },
{ kanji: "八日", yomi: "ようか" },
{ kanji: "九日", yomi: "ここのか" },
{ kanji: "十日", yomi: "とおか" },
{ kanji: "朝日", yomi: "あさひ" },
{ kanji: "夕日", yomi: "ゆうひ" },
{ kanji: "星", yomi: "ほし" },
{ kanji: "月光", yomi: "げっこう" },
{ kanji: "天気", yomi: "てんき" },
{ kanji: "気持ち", yomi: "きも" },
{ kanji: "感情", yomi: "かんじょう" },
{ kanji: "嬉しい", yomi: "うれ" },
{ kanji: "悲しい", yomi: "かな" },
{ kanji: "怒る", yomi: "おこ" },
{ kanji: "笑う", yomi: "わら" },
{ kanji: "運ぶ", yomi: "はこ" },
{ kanji: "拾う", yomi: "ひろ" },
{ kanji: "投げる", yomi: "な" },
{ kanji: "休む", yomi: "やす" },
{ kanji: "遊ぶ", yomi: "あそ" },
{ kanji: "泳ぐ", yomi: "およ" },
{ kanji: "走る", yomi: "はし" },
{ kanji: "跳ぶ", yomi: "と" },
{ kanji: "登る", yomi: "のぼ" },
{ kanji: "降りる", yomi: "お" },
{ kanji: "着る", yomi: "き" },
{ kanji: "脱ぐ", yomi: "ぬ" },
{ kanji: "洗う", yomi: "あら" },
{ kanji: "磨く", yomi: "みが" },
{ kanji: "切る", yomi: "き" },
{ kanji: "折る", yomi: "お" },
{ kanji: "開ける", yomi: "あ" },
{ kanji: "閉める", yomi: "し" },
{ kanji: "押す", yomi: "お" },
{ kanji: "引く", yomi: "ひ" },
{ kanji: "回る", yomi: "まわ" },
{ kanji: "止める", yomi: "と" },
{ kanji: "始める", yomi: "はじ" },
{ kanji: "終わる", yomi: "お" },
{ kanji: "探す", yomi: "さが" },
{ kanji: "見つける", yomi: "み" },
{ kanji: "聞く", yomi: "き" },
{ kanji: "話す", yomi: "はな" },
{ kanji: "読む", yomi: "よ" },
{ kanji: "書く", yomi: "か" },
{ kanji: "描く", yomi: "えが" },
{ kanji: "計る", yomi: "はか" },
{ kanji: "測る", yomi: "はか" },
{ kanji: "分かる", yomi: "わ" },
{ kanji: "学ぶ", yomi: "まな" },
{ kanji: "教える", yomi: "おし" },
{ kanji: "覚える", yomi: "おぼ" },
{ kanji: "忘れる", yomi: "わす" },
{ kanji: "思う", yomi: "おも" },
{ kanji: "考える", yomi: "かんが" },
{ kanji: "約束する", yomi: "やくそく" },
{ kanji: "準備する", yomi: "じゅんび" },
{ kanji: "掃く", yomi: "は" },
{ kanji: "拭く", yomi: "ふ" },
{ kanji: "飾る", yomi: "かざ" },
{ kanji: "育てる", yomi: "そだ" },
{ kanji: "植える", yomi: "う" },
{ kanji: "刈る", yomi: "か" },
{ kanji: "混ぜる", yomi: "ま" },
{ kanji: "煮る", yomi: "に" },
{ kanji: "焼く", yomi: "や" },
{ kanji: "蒸す", yomi: "む" },
{ kanji: "冷やす", yomi: "ひ" },
{ kanji: "温める", yomi: "あたた" },
{ kanji: "磨く歯", yomi: "みがくは" },
{ kanji: "片付ける", yomi: "かたづ" },
{ kanji: "協力", yomi: "きょうりょく" },
{ kanji: "助ける", yomi: "たす" },
{ kanji: "守る", yomi: "まも" },
{ kanji: "譲る", yomi: "ゆず" },
{ kanji: "借りる", yomi: "か" },
{ kanji: "返す", yomi: "かえ" },
{ kanji: "儲ける", yomi: "もう" },
{ kanji: "払う", yomi: "はら" },
{ kanji: "貰う", yomi: "もら" },
{ kanji: "渡す", yomi: "わた" },
{ kanji: "到る", yomi: "いた" },
{ kanji: "交わる", yomi: "まじ" },
{ kanji: "続く", yomi: "つづ" },
{ kanji: "続ける", yomi: "つづ" },
{ kanji: "増える", yomi: "ふ" },
{ kanji: "減る", yomi: "へ" },
{ kanji: "集める", yomi: "あつ" },
{ kanji: "分ける", yomi: "わ" },
{ kanji: "比べる", yomi: "くら" },
{ kanji: "選ぶ", yomi: "えら" },
{ kanji: "決める", yomi: "き" },
{ kanji: "勝つ", yomi: "か" },
{ kanji: "負ける", yomi: "ま" },
{ kanji: "頼む", yomi: "たの" },
{ kanji: "伝える", yomi: "つた" },
{ kanji: "届ける", yomi: "とど" },
{ kanji: "確認する", yomi: "かくにん" },
{ kanji: "記す", yomi: "しる" }
  ];
  // DOM Elements
  const elKanji = document.getElementById("q-kanji");
  const elInput = document.getElementById("q-input");
  const elMessage = document.getElementById("result-message");
  const elNextBtn = document.getElementById("next-btn");
  const elShareContainer = document.getElementById("share-buttons");
  const elProgress = document.getElementById("progress");
  const elCorrectCount = document.getElementById("correct-count");

  // State
  let order = [];
  let index = 0;
  let correctCount = 0;
  let lock = false;

  // Helpers
  function log(...args){ try{ console.log("[quiz]", ...args); }catch(e){} }
  function normalizeKana(s){
    if(!s) return "";
    const kataToHira = s.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
    return kataToHira.replace(/\s+/g, "");
  }
  function simpleCompare(a,b){ return normalizeKana(a) === normalizeKana(b); }
  function shuffle(arr){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  // Render
  function renderQuestion(){
    if(!elKanji || !elInput || !elProgress) { log("renderQuestion: 必須要素がありません"); return; }
    if(order.length === 0){
      order = shuffle(QUIZ_DATA.map((_,i)=>i));
      index = 0;
      correctCount = 0;
      if(elCorrectCount) elCorrectCount.textContent = String(correctCount);
    }
    const qi = order[index % order.length];
    const item = QUIZ_DATA[qi];
    elKanji.textContent = item.kanji;
    elInput.value = "";
    setTimeout(()=> { try{ elInput.focus(); }catch(e){} }, 60);
    elProgress.textContent = `${index + 1} / ${order.length}`;
  }

  // メッセージ表示
  function showTemporaryMessage(text, cls = "info"){
    if(!elMessage) return;
    elMessage.textContent = text;
    elMessage.classList.remove("correct","wrong","info","visible");
    if(cls) elMessage.classList.add(cls, "visible");
    setTimeout(()=> {
      if(!elMessage) return;
      elMessage.classList.remove(cls, "visible");
      elMessage.textContent = "";
    }, 1000);
  }

  // 回答処理
  function answerCurrent(){
    if(lock) return;
    if(!elInput) return;
    lock = true;
    const user = elInput.value.trim();
    const qi = order[index % order.length];
    const correct = QUIZ_DATA[qi].yomi;
    if(simpleCompare(user, correct)){
      correctCount += 1;
      if(elCorrectCount) elCorrectCount.textContent = String(correctCount);
      showTemporaryMessage("正解", "correct");
      setTimeout(()=> { index++; renderQuestion(); lock = false; }, 300);
    } else {
      showTemporaryMessage("ちがいます", "wrong");
      setTimeout(()=> { try{ elInput.focus(); }catch(e){} lock = false; }, 500);
    }
  }

  // 共有機能設定
  function setupShareButtons(){
    if(!elShareContainer){
      log("share container が見つかりません。HTML内に id=\"share-buttons\" を置いてください。");
      return;
    }

    const btnNative = elShareContainer.querySelector('button[data-share="native"]');
    const btnTwitter = elShareContainer.querySelector('button[data-share="twitter"]');
    const btnCopy = elShareContainer.querySelector('button[data-share="copy"]');

    const shareData = {
      title: document.title || "漢字問題 小学生で習うクイズ",
      text: "漢字問題 小学生で習うクイズ — ひらがなを入力して遊ぼう！",
      url: location.href
    };

    if(btnNative){
      btnNative.addEventListener("click", async (e) => {
        e.preventDefault();
        try{
          if(navigator.share){
            await navigator.share(shareData);
            return;
          }
          // フォールバック: クリップボードにコピー
          if(navigator.clipboard && navigator.clipboard.writeText){
            await navigator.clipboard.writeText(shareData.url);
            showTemporaryMessage("URLをコピーしました", "info");
            return;
          }
          showTemporaryMessage("共有非対応の端末です", "wrong");
        }catch(err){
          log("native share error:", err);
          showTemporaryMessage("共有できませんでした", "wrong");
        }
      }, { passive:false });
    }

    if(btnTwitter){
      btnTwitter.addEventListener("click", (e) => {
        e.preventDefault();
        try{
          const text = shareData.text;
          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`;
          const w = window.open(url, "_blank", "noopener,noreferrer");
          if(!w) showTemporaryMessage("ポップアップがブロックされています", "wrong");
        }catch(err){
          log("twitter share error:", err);
          showTemporaryMessage("共有に失敗しました", "wrong");
        }
      }, { passive:false });
    }

    if(btnCopy){
      btnCopy.addEventListener("click", async (e) => {
        e.preventDefault();
        try{
          if(navigator.clipboard && navigator.clipboard.writeText){
            await navigator.clipboard.writeText(shareData.url);
            showTemporaryMessage("URLをコピーしました", "info");
            return;
          }
          // フォールバック
          const ta = document.createElement("textarea");
          ta.value = shareData.url;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand && document.execCommand("copy");
          document.body.removeChild(ta);
          if(ok) showTemporaryMessage("URLをコピーしました", "info");
          else showTemporaryMessage("コピーに失敗しました", "wrong");
        }catch(err){
          log("copy error:", err);
          showTemporaryMessage("コピーに失敗しました", "wrong");
        }
      }, { passive:false });
    }
  }

  // イベント登録
  function initEvents(){
    if(elInput){
      elInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter") { e.preventDefault(); answerCurrent(); }
      });
    }
    if(elNextBtn){
      elNextBtn.addEventListener("click", (e) => { e.preventDefault(); index++; renderQuestion(); });
    }
    window.addEventListener("orientationchange", () => { setTimeout(()=> { try{ elInput && elInput.focus(); }catch(e){} }, 300); });
    window.addEventListener("resize", () => { setTimeout(()=> { try{ elInput && elInput.focus(); }catch(e){} }, 250); });
  }

  // 初期化
  function init(){
    log("init start");
    if(!elKanji || !elInput || !elMessage){
      log("必須要素がありません。q-kanji, q-input, result-message を確認してください。");
      return;
    }
    order = shuffle(QUIZ_DATA.map((_,i)=>i));
    index = 0;
    correctCount = 0;
    if(elCorrectCount) elCorrectCount.textContent = String(correctCount);
    renderQuestion();
    initEvents();
    setupShareButtons();
    log("init complete");
  }

  document.addEventListener("DOMContentLoaded", init);
})();