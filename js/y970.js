/* app.js - 野菜の作り置きレシピジェネレーター
   全ての動作をこのファイルで完結します */
const recipes = [
  { id:1, veg:['ニンジン'], title:'にんじんのマリネ', days:7, desc:'千切りにして塩もみ→酢・砂糖・オリーブ油で和えて完成。' },
  { id:2, veg:['玉ねぎ'], title:'玉ねぎの甘酢漬け', days:10, desc:'薄切り玉ねぎを熱湯に通す→甘酢に漬ければ完成。' },
  { id:3, veg:['きのこ'], title:'きのこのバター醤油ソテー', days:5, desc:'きのこをバターで炒め醤油で調味、冷まして保存。' },
  { id:4, veg:['キャベツ'], title:'キャベツの浅漬け', days:7, desc:'ざく切りに塩をまぶし、水が出たら調味料で和えて冷蔵。' },
  { id:5, veg:['白菜'], title:'白菜の中華風漬け', days:10, desc:'ざく切り白菜に塩→水切り→ごま油・醤油で和えて漬ける。' },
  { id:6, veg:['大根'], title:'大根の甘辛煮', days:5, desc:'大根を下茹で→だしと醤油・砂糖で煮含める。' },
  { id:7, veg:['もやし'], title:'もやしナムル', days:3, desc:'さっと茹でて水切り→ごま油・塩・にんにくで和える。' },
  { id:8, veg:['きゅうり'], title:'きゅうりのピリ辛漬け', days:6, desc:'乱切りきゅうりに塩→醤油・酢・ラー油で和えて漬ける。' },
  { id:9, veg:['ナス'], title:'揚げナスの煮浸し', days:4, desc:'ナスを揚げる→だし醤油に浸して冷ます。' },
  { id:10, veg:['ネギ'], title:'万能ねぎの醤油漬け', days:8, desc:'小口切りにして醤油とみりんに漬けるだけ。' },
  { id:11, veg:['ニラ'], title:'ニラだれ保存', days:6, desc:'刻んだニラを醤油・ごま油・酢で和えて保存。' },
  { id:12, veg:['ニンジン','大根'], title:'にんじん大根のなます', days:7, desc:'千切り→塩でなじませてから酢と砂糖で和える。' },
  { id:13, veg:['キャベツ','玉ねぎ'], title:'コールスロー', days:4, desc:'細切りを塩でしんなり→ドレッシングで和える。' },
  { id:14, veg:['きのこ','ネギ'], title:'きのこネギのおかか和え', days:5, desc:'茹でたきのこネギを醤油・おかかで和える。' },
  { id:15, veg:['白菜','大根'], title:'冬野菜の煮物', days:6, desc:'大きめに切ってだしで柔らかく煮る。' },
  { id:16, veg:['ニンジン'], title:'にんじんの酢漬け', days:10, desc:'千切りに塩→熱い酢を注ぎ冷ますだけ。' },
  { id:17, veg:['玉ねぎ'], title:'玉ねぎのオーブンロースト', days:4, desc:'くし切りをオリーブ油で焼き、冷まして保存。' },
  { id:18, veg:['きのこ'], title:'きのこの佃煮風', days:14, desc:'醤油・みりんで煮詰めて甘辛く仕上げる。' },
  { id:19, veg:['キャベツ'], title:'キャベツの塩麹漬け', days:9, desc:'刻んで塩麹と和え、常温で軽く置いて冷蔵。' },
  { id:20, veg:['白菜'], title:'白菜の浅漬け（昆布）', days:8, desc:'白菜に塩を振る→昆布と一緒に漬ける。' },
  { id:21, veg:['大根'], title:'大根の即席漬け', days:5, desc:'薄切りにして塩でしんなり→酢・砂糖で和える。' },
  { id:22, veg:['もやし'], title:'もやしのピリ辛和え', days:3, desc:'茹でて水切り→ごま油・豆板醤で和える。' },
  { id:23, veg:['きゅうり'], title:'きゅうりの梅和え', days:5, desc:'薄切りきゅうりを刻んだ梅肉で和えるだけ。' },
  { id:24, veg:['ナス'], title:'ナスの胡麻和え', days:4, desc:'蒸しナスを絞り胡麻だれで和えて保存。' },
  { id:25, veg:['ネギ'], title:'長ネギの醤油漬け', days:7, desc:'輪切りにして醤油と酢で漬ける。' },
  { id:26, veg:['ニラ'], title:'ニラ玉の保存おかず', days:4, desc:'炒めたニラ玉を冷まして小分け保存。' },
  { id:27, veg:['ニンジン','キャベツ'], title:'にんじんキャベツのコールスロー', days:5, desc:'細切りに塩→ドレッシングで和える。' },
  { id:28, veg:['玉ねぎ','きのこ'], title:'玉ねぎきのこのマリネ', days:6, desc:'炒めて酢・オリーブ油でマリネする。' },
  { id:29, veg:['きのこ','キャベツ'], title:'きのことキャベツの蒸し煮', days:5, desc:'鍋で蒸し煮→味を調えて冷ます。' },
  { id:30, veg:['白菜','にんじん'], title:'白菜とにんじんの漬物', days:10, desc:'塩→甘酢で漬けてしっかり馴染ませる。' },
  { id:31, veg:['大根','きゅうり'], title:'大根ときゅうりの浅漬け', days:6, desc:'薄切りに塩→酢で和えて漬ける。' },
  { id:32, veg:['もやし','ネギ'], title:'もやしとねぎの簡単和え', days:3, desc:'茹でてすりごまと醤油で和える。' },
  { id:33, veg:['ナス','玉ねぎ'], title:'ナスと玉ねぎの南蛮漬け', days:7, desc:'揚げナスを南蛮だれで漬け込む。' },
  { id:34, veg:['ニラ','きのこ'], title:'ニラときのこのピリ辛炒め', days:4, desc:'強火で炒めて豆板醤で味付け。' },
  { id:35, veg:['きゅうり','ネギ'], title:'きゅうりとねぎの和風サラダ', days:4, desc:'薄切りにして出汁醤油で和える。' },
  { id:36, veg:['キャベツ','大根'], title:'キャベツと大根のマリネ', days:7, desc:'薄切りをオイルと酢で和えて冷蔵。' },
  { id:37, veg:['白菜','もやし'], title:'白菜ともやしのナムル', days:4, desc:'茹でてごま油と塩で和えるだけ。' },
  { id:38, veg:['ニンジン','きゅうり'], title:'にんじんきゅうりのピクルス', days:14, desc:'熱いピクルス液に漬けて冷ます。' },
  { id:39, veg:['玉ねぎ','ネギ'], title:'玉ねぎネギのソテー', days:3, desc:'薄切りを炒めて塩胡椒で調える。' },
  { id:40, veg:['ナス','ニラ'], title:'ナスとニラの味噌炒め', days:5, desc:'味噌ダレで炒め煮にし冷ます。' },
  { id:41, veg:['きのこ','きゅうり'], title:'きのこきゅうりの和え物', days:4, desc:'茹でたきのこときゅうりを酢醤油で和える。' },
  { id:42, veg:['キャベツ','もやし'], title:'キャベツともやしの即席漬け', days:6, desc:'塩で馴染ませた後、酢で仕上げる。' },
  { id:43, veg:['大根','ネギ'], title:'大根おろしの保存活用', days:2, desc:'大根おろしを小分け冷蔵し消費する。' },
  { id:44, veg:['ニンジン','ナス'], title:'にんじんとナスの炒め煮', days:4, desc:'一緒に炒めてだしで煮含める。' },
  { id:45, veg:['白菜','きのこ'], title:'白菜ときのこの重ね煮', days:6, desc:'重ねて蒸し煮→調味して冷ます。' },
  { id:46, veg:['きゅうり','ニラ'], title:'きゅうりとニラの和え物', days:3, desc:'刻んでごま油と醤油で和えるだけ。' },
  { id:47, veg:['ネギ','もやし'], title:'ねぎもやしのナムル風', days:3, desc:'茹でて塩・ごま油・ごまで和える。' },
  { id:48, veg:['玉ねぎ','大根'], title:'玉ねぎと大根の煮物', days:5, desc:'だしでじっくり煮て冷蔵保存。' },
  { id:49, veg:['ニラ','キャベツ'], title:'ニラキャベツのお浸し', days:4, desc:'さっと茹でて出汁で浸して冷ます。' },
  { id:50, veg:['ナス','きゅうり'], title:'ナスときゅうりの酢の物', days:5, desc:'薄切りを酢醤油で和えて冷やす。' },
  { id:51, veg:['ニンジン'], title:'にんじんとツナの常備菜', days:5, desc:'千切りにツナと醤油で和えるだけ。' },
  { id:52, veg:['玉ねぎ'], title:'玉ねぎのピクルス', days:14, desc:'スライスを熱いピクルス液で漬ける。' },
  { id:53, veg:['きのこ'], title:'きのこのオイル漬け', days:14, desc:'ソテーしたきのこをオリーブ油で漬ける。' },
  { id:54, veg:['キャベツ'], title:'キャベツステーキ保存用', days:3, desc:'焼いたキャベツを冷ましてラップで保存。' },
  { id:55, veg:['白菜'], title:'白菜の浅漬け（柚子風味）', days:9, desc:'塩漬け後に柚子皮を加えて漬ける。' },
  { id:56, veg:['大根'], title:'大根ステーキの保存おかず', days:4, desc:'焼いて出汁をかけて冷ますだけ。' },
  { id:57, veg:['もやし'], title:'もやしのごまドレ和え', days:3, desc:'茹でて市販ドレッシングで和える。' },
  { id:58, veg:['きゅうり'], title:'きゅうりの韓国風和え物', days:5, desc:'薄切りをコチュジャンと酢で和える。' },
  { id:59, veg:['ナス'], title:'ナスの甘酢あんかけ', days:4, desc:'揚げナスに甘酢あんをかけて冷ます。' },
  { id:60, veg:['ネギ'], title:'ねぎ塩だれ保存', days:7, desc:'刻みねぎを塩だれで和えて保存する。' },
  { id:61, veg:['ニラ'], title:'ニラの塩漬け', days:10, desc:'塩で漬けて汁が出たら絞って保存。' },
  { id:62, veg:['ニンジン','玉ねぎ'], title:'にんじんと玉ねぎのソテー', days:4, desc:'薄切りを炒めて塩胡椒で味を整える。' },
  { id:63, veg:['キャベツ','きのこ'], title:'キャベツときのこのマリネ', days:7, desc:'炒めてビネガーでマリネするだけ。' },
  { id:64, veg:['白菜','ネギ'], title:'白菜とねぎの和え物', days:5, desc:'茹でてポン酢で和えるだけ。' },
  { id:65, veg:['大根','もやし'], title:'大根ともやしの即席和え', days:3, desc:'千切りをさっと和えて即席のおかずに。' },
  { id:66, veg:['きゅうり','玉ねぎ'], title:'きゅうり玉ねぎのマリネ', days:6, desc:'薄切りをオイルと酢で和える。' },
  { id:67, veg:['ナス','キャベツ'], title:'ナスとキャベツのトマト煮', days:5, desc:'トマト缶で煮込み冷まして保存。' },
  { id:68, veg:['ニラ','大根'], title:'ニラ大根の甘辛だれ', days:4, desc:'薄切りを炒めて甘辛だれで味付け。' },
  { id:69, veg:['きのこ','もやし'], title:'きのこもやしのナムル', days:3, desc:'茹でてごま油・塩で和えるだけ。' },
  { id:70, veg:['ネギ','きゅうり'], title:'ねぎきゅうりの和風ドレッシング', days:4, desc:'刻んで和風ドレで和えるだけ。' },
  { id:71, veg:['ニンジン','ネギ'], title:'にんじんとねぎの甘辛和え', days:5, desc:'炒めて醤油と砂糖で甘辛く和える。' },
  { id:72, veg:['玉ねぎ','きゅうり'], title:'玉ねぎときゅうりのサラダ', days:3, desc:'薄切りを塩でなじませドレで和える。' },
  { id:73, veg:['きのこ','ナス'], title:'きのこナスの和風炒め', days:4, desc:'炒めて醤油ベースで味を整える。' },
  { id:74, veg:['キャベツ','ニラ'], title:'キャベツとニラのゆかり和え', days:5, desc:'茹でてゆかりと和えて保存。' },
  { id:75, veg:['白菜','もやし'], title:'白菜もやしの即席漬け', days:4, desc:'塩でしばらく置き酢で整える。' },
  { id:76, veg:['大根','ナス'], title:'大根とナスのそぼろ煮', days:5, desc:'そぼろと一緒に煮込み味を含ませる。' },
  { id:77, veg:['もやし','きゅうり'], title:'もやしときゅうりの中華和え', days:3, desc:'茹でて中華だれで和えるだけ。' },
  { id:78, veg:['きゅうり','ナス'], title:'きゅうりナスの浅漬けセット', days:6, desc:'薄切りを塩と出汁で浅漬けにする。' },
  { id:79, veg:['ネギ','玉ねぎ'], title:'ネギと玉ねぎのコンフィ', days:7, desc:'低温でオリーブ油煮→冷まして保存。' },
  { id:80, veg:['ニラ','ニンジン'], title:'ニラにんじんの胡麻和え', days:4, desc:'茹でて胡麻ダレで和えるだけ。' },
  { id:81, veg:['きのこ','玉ねぎ'], title:'きのこと玉ねぎのマヨ和え', days:4, desc:'炒めてマヨと混ぜるだけで完成。' },
  { id:82, veg:['キャベツ','きゅうり'], title:'キャベツきゅうりのコールスロー風', days:4, desc:'細切りをドレッシングで和える。' },
  { id:83, veg:['白菜','ナス'], title:'白菜とナスの味噌煮', days:6, desc:'味噌でじっくり煮込んで保存。' },
  { id:84, veg:['大根','きのこ'], title:'大根ときのこの煮物', days:5, desc:'だしで煮て味を染み込ませる。' },
  { id:85, veg:['もやし','ニラ'], title:'もやしニラのピリ辛和え', days:3, desc:'茹でてピリ辛タレで和える。' },
  { id:86, veg:['きゅうり','ニンジン'], title:'きゅうりにんじんのナムル', days:5, desc:'千切りをごま油と酢で和える。' },
  { id:87, veg:['ナス','玉ねぎ'], title:'ナス玉の甘酢和え', days:4, desc:'揚げナスと玉ねぎを甘酢で和える。' },
  { id:88, veg:['ネギ','白菜'], title:'ねぎ白菜の和え物', days:5, desc:'さっと火を通して出汁で和える。' },
  { id:89, veg:['ニラ','きゅうり'], title:'ニラきゅうりのピリ辛漬け', days:6, desc:'刻んでピリ辛だれで漬ける。' },
  { id:90, veg:['ニンジン','もやし'], title:'にんじんもやしの即席ナムル', days:3, desc:'茹でてごま油と塩で和えるだけ。' },
  { id:91, veg:['玉ねぎ','白菜'], title:'玉ねぎ白菜の中華和え', days:5, desc:'炒めて中華だれで和える。' },
  { id:92, veg:['きのこ','大根'], title:'きのこと大根の煮浸し', days:5, desc:'だしで煮て冷やして味を馴染ませる。' },
  { id:93, veg:['キャベツ','ナス'], title:'キャベツとナスの炒め煮', days:4, desc:'炒めてだしで煮含める。' },
  { id:94, veg:['白菜','きゅうり'], title:'白菜ときゅうりの甘酢和え', days:6, desc:'甘酢で和えて冷蔵保存。' },
  { id:95, veg:['大根','ニラ'], title:'大根ニラのピリ辛煮', days:4, desc:'炒めてからピリ辛だれで煮る。' },
  { id:96, veg:['もやし','ナス'], title:'もやしナスの中華炒め', days:3, desc:'強火で炒め中華調味で味付け。' },
  { id:97, veg:['きゅうり','玉ねぎ'], title:'きゅうり玉ねぎのピクルス', days:14, desc:'熱いピクルス液で漬けて冷ます。' },
  { id:98, veg:['ナス','ネギ'], title:'ナスネギのにんにく醤油漬け', days:7, desc:'焼きナスをにんにく醤油に漬ける。' },
  { id:99, veg:['ネギ','にんじん'], title:'ねぎにんじんのしょうゆ漬け', days:6, desc:'千切りを醤油ベースで漬け込む。' },
  { id:100, veg:['ニラ','玉ねぎ'], title:'ニラ玉風保存おかず', days:4, desc:'炒めて小分けして冷蔵保存。' },
  { id:101, veg:['きのこ','ニンジン'], title:'きのことにんじんのきんぴら風', days:5, desc:'細切りを炒めて甘辛く仕上げる。' },
  { id:102, veg:['キャベツ','大根'], title:'キャベツ大根の梅和え', days:6, desc:'細切りと梅肉で和えてさっぱり保存。' },
  { id:103, veg:['白菜','もやし'], title:'白菜もやしの味噌和え', days:4, desc:'茹でて味噌だれで和えるだけ。' },
  { id:104, veg:['大根','きゅうり'], title:'大根きゅうりの甘酢漬け', days:7, desc:'薄切りを甘酢で漬けるだけで完成。' },
  { id:105, veg:['もやし','ネギ'], title:'もやしねぎのしょうゆ和え', days:3, desc:'茹でて醤油とごま油で和える。' },
  { id:106, veg:['きゅうり','ナス'], title:'きゅうりナスのごま酢和え', days:5, desc:'蒸しナスときゅうりをごま酢で和える。' },
  { id:107, veg:['ネギ','キャベツ'], title:'ねぎキャベツのオイル漬け', days:10, desc:'刻んでオリーブ油と塩で漬ける。' },
  { id:108, veg:['ニラ','白菜'], title:'ニラ白菜の中華漬け', days:6, desc:'刻んで中華調味料で和え漬ける。' },
  { id:109, veg:['ニンジン','もやし'], title:'にんじんもやしのピリ辛ナムル', days:3, desc:'茹でてピリ辛ダレで和える。' },
  { id:110, veg:['玉ねぎ','ナス'], title:'玉ねぎナスのトマトマリネ', days:7, desc:'炒めてトマトで煮込みマリネする。' },
  { id:111, veg:['きのこ','ネギ'], title:'きのこネギのごまポン和え', days:5, desc:'茹でてごまポン酢で和えるだけ。' },
  { id:112, veg:['キャベツ','ニンジン'], title:'キャベツにんじんのゆかりマリネ', days:6, desc:'茹でてゆかりと和え保存。' },
  { id:113, veg:['白菜','玉ねぎ'], title:'白菜玉ねぎの甘酢炒め', days:5, desc:'炒めて甘酢で仕上げるだけ。' },
  { id:114, veg:['大根','ナス'], title:'大根ナスのしょうゆ煮', days:5, desc:'だしと醤油でじっくり煮る。' },
  { id:115, veg:['もやし','きゅうり'], title:'もやしきゅうりのさっぱり和え', days:3, desc:'茹でて酢醤油で和えるだけ。' },
  { id:116, veg:['ニンジン'], title:'にんじんのハニーマリネ', days:7, desc:'千切りに蜂蜜と酢で和えて漬ける。' },
  { id:117, veg:['玉ねぎ'], title:'玉ねぎのバルサミコマリネ', days:8, desc:'スライスをバルサミコでマリネする。' },
  { id:118, veg:['きのこ'], title:'きのこのガーリックオイル漬け', days:14, desc:'炒めてにんにくとオイルで瓶詰めにする。' },
  { id:119, veg:['キャベツ'], title:'キャベツのハーブマリネ', days:7, desc:'茹でてハーブとオイルで漬ける。' },
  { id:120, veg:['白菜'], title:'白菜のごまポン酢和え', days:5, desc:'茹でてごまポンで和えるだけ。' },
  { id:121, veg:['大根'], title:'大根の胡麻だれ漬け', days:6, desc:'千切りを胡麻だれで和えて保存。' },
  { id:122, veg:['もやし'], title:'もやしとコーンの和え物', days:3, desc:'茹でてコーンとマヨで和える。' },
  { id:123, veg:['きゅうり'], title:'きゅうりのしょうが漬け', days:6, desc:'薄切りを生姜と醤油で漬ける。' },
  { id:124, veg:['ナス'], title:'ナスのにんにく味噌和え', days:5, desc:'蒸しナスを味噌にんにくダレで和える。' },
  { id:125, veg:['ネギ'], title:'白ねぎのマリネ', days:6, desc:'火を通してオイルと塩で保存。' },
  { id:126, veg:['ニラ'], title:'ニラのピリ辛油漬け', days:7, desc:'刻んで辣油と醤油で漬ける。' },
  { id:127, veg:['ニンジン','きのこ'], title:'にんじんきのこの和風きんぴら', days:6, desc:'細切りを炒めて醤油で味付け。' },
  { id:128, veg:['玉ねぎ','きゅうり'], title:'玉ねぎきゅうりのさっぱり漬け', days:5, desc:'薄切りを塩と酢で和えて漬ける。' },
  { id:129, veg:['きのこ','ナス'], title:'きのこナスのオイスター炒め', days:4, desc:'強火で炒めオイスターで味付けする。' },
  { id:130, veg:['キャベツ','ニンジン'], title:'キャベツにんじんのオレンジマリネ', days:7, desc:'細切りをオレンジ果汁と油で和える。' },
  { id:131, veg:['白菜','ネギ'], title:'白菜ねぎのじゃこ和え', days:5, desc:'茹でてじゃこと醤油で和える。' },
  { id:132, veg:['大根','もやし'], title:'大根もやしの柚子胡椒和え', days:3, desc:'茹でて柚子胡椒で和えるだけ。' },
  { id:133, veg:['もやし','きのこ'], title:'もやしきのこの薄味炒め', days:3, desc:'軽く炒め塩胡椒で調える。' },
  { id:134, veg:['きゅうり','ニラ'], title:'きゅうりのニラだれ和え', days:4, desc:'刻んでニラだれで和えて保存。' },
  { id:135, veg:['ナス','玉ねぎ'], title:'ナス玉ネギの南蛮漬け', days:6, desc:'揚げて南蛮酢に漬け込む。' },
  { id:136, veg:['ネギ','にんじん'], title:'ねぎにんじんのにんにく和え', days:5, desc:'刻んでにんにく醤油で和えるだけ。' },
  { id:137, veg:['ニラ','キャベツ'], title:'ニラキャベツのおろしポン酢和え', days:4, desc:'茹でて大根おろしとポン酢で和える。' },
  { id:138, veg:['ニンジン','大根'], title:'にんじん大根の甘酢胡麻和え', days:7, desc:'千切りを甘酢と胡麻で和えるだけ。' },
  { id:139, veg:['玉ねぎ','きのこ'], title:'玉ねぎきのこのトマト煮', days:5, desc:'炒めてトマト缶で煮込み保存。' },
  { id:140, veg:['きのこ','ネギ'], title:'きのこネギのポン酢炒め', days:4, desc:'炒めてポン酢でさっと味付け。' },
  { id:141, veg:['キャベツ','きゅうり'], title:'キャベツきゅうりの梅しそ和え', days:5, desc:'茹でて梅しそで和えるだけ。' },
  { id:142, veg:['白菜','ナス'], title:'白菜とナスのピリ辛煮', days:5, desc:'ピリ辛タレで煮込み冷ます。' },
  { id:143, veg:['大根','ネギ'], title:'大根ねぎの生姜醤油漬け', days:6, desc:'薄切りを生姜醤油で漬け込む。' },
  { id:144, veg:['もやし','ニンジン'], title:'もやしにんじんのツナ和え', days:3, desc:'茹でてツナとマヨで和えるだけ。' },
  { id:145, veg:['きゅうり','玉ねぎ'], title:'きゅうり玉ねぎの塩レモン和え', days:6, desc:'薄切りを塩レモンで和えて冷やす。' },
  { id:146, veg:['ナス','きのこ'], title:'ナスきのこのバルサミコ炒め', days:5, desc:'炒めてバルサミコで味付けする。' },
  { id:147, veg:['ネギ','白菜'], title:'ねぎ白菜の胡麻だれ煮', days:5, desc:'煮て胡麻だれで味を整える。' },
  { id:148, veg:['ニラ','大根'], title:'ニラ大根のナムル風', days:4, desc:'茹でてごま油・塩で和える。' },
  { id:149, veg:['ニンジン','きゅうり'], title:'にんじんきゅうりの香味和え', days:5, desc:'千切りを香味だれで和えるだけ。' },
  { id:150, veg:['玉ねぎ','もやし'], title:'玉ねぎもやしのピリ辛ナムル', days:3, desc:'茹でてピリ辛ダレで和える。' },
  { id:151, veg:['きのこ','キャベツ'], title:'きのこキャベツのアンチョビ風味', days:6, desc:'炒めてアンチョビ風調味で和える。' },
  { id:152, veg:['キャベツ','大根'], title:'キャベツ大根のサワー漬け', days:10, desc:'塩と酢でしっかり漬けて長持ち。' },
  { id:153, veg:['白菜','きゅうり'], title:'白菜きゅうりの塩昆布和え', days:6, desc:'茹でて塩昆布で和えるだけ。' },
  { id:154, veg:['大根','ナス'], title:'大根ナスのバター醤油煮', days:4, desc:'バターで風味付けし醤油で煮る。' },
  { id:155, veg:['もやし','ネギ'], title:'もやしねぎのごま塩和え', days:3, desc:'茹でてごま塩で和える簡単副菜。' },
  { id:156, veg:['きゅうり','ニラ'], title:'きゅうりニラのごま酢和え', days:5, desc:'刻んでごま酢で和えるだけ。' },
  { id:157, veg:['ナス','ネギ'], title:'ナスねぎの味噌マリネ', days:6, desc:'焼きナスに味噌ダレをかけ漬ける。' },
  { id:158, veg:['ネギ','ニンジン'], title:'ねぎにんじんのピリ辛和え', days:5, desc:'炒めてピリ辛ダレで和える。' },
  { id:159, veg:['ニラ','きのこ'], title:'ニラきのこのオイル和え', days:10, desc:'炒めてオイルで漬け込み保存。' },
  { id:160, veg:['ニンジン','玉ねぎ'], title:'にんじん玉ねぎのスイートビネガー漬け', days:7, desc:'薄切りを甘酢で和えて漬けるだけ。' },
  { id:161, veg:['玉ねぎ','キャベツ'], title:'玉ねぎキャベツのチリソース和え', days:4, desc:'炒めてチリソースで和えるだけ。' },
  { id:162, veg:['きのこ','白菜'], title:'きのこ白菜のにんにく醤油炒め', days:5, desc:'強火で炒めてにんにく醤油で仕上げる。' },
  { id:163, veg:['キャベツ','きゅうり'], title:'キャベツきゅうりのマスタードマリネ', days:6, desc:'茹でてマスタード入りドレで和える。' },
  { id:164, veg:['白菜','大根'], title:'白菜大根のさっぱり煮', days:5, desc:'薄味で煮て冷まして味をなじませる。' },
  { id:165, veg:['大根','もやし'], title:'大根もやしの塩昆布ナムル', days:3, desc:'千切りを塩昆布と和えて簡単保存。' },
  { id:166, veg:['もやし','きゅうり'], title:'もやしきゅうりの胡麻ダレ和え', days:3, desc:'茹でて胡麻ダレで和えるだけ。' },
  { id:167, veg:['きゅうり','ナス'], title:'きゅうりナスのピクルスマリネ', days:14, desc:'ピクルス液で漬け込み長期保存可能。' },
  { id:168, veg:['ナス','玉ねぎ'], title:'ナス玉ねぎのしょうが煮', days:5, desc:'しょうがと醤油で煮て冷まして保存。' },
  { id:169, veg:['ネギ','キャベツ'], title:'ねぎキャベツの生姜醤油和え', days:4, desc:'茹でて生姜醤油で和えるだけ。' },
  { id:170, veg:['ニラ','白菜'], title:'ニラ白菜の味噌マリネ', days:6, desc:'茹でて味噌ダレで和え冷蔵保存。' },
  { id:171, veg:['ニンジン','大根'], title:'にんじん大根のピリ辛甘酢', days:7, desc:'千切りを甘酢と唐辛子で和える。' },
  { id:172, veg:['玉ねぎ','もやし'], title:'玉ねぎもやしのオイスター和え', days:3, desc:'茹でてオイスターソースで和えるだけ。' },
  { id:173, veg:['きのこ','きゅうり'], title:'きのこきゅうりのゆず胡椒和え', days:5, desc:'茹でてゆず胡椒で和えるだけ。' },
  { id:174, veg:['キャベツ','ナス'], title:'キャベツナスのスパイシー炒め', days:4, desc:'スパイスで炒めて冷まして保存。' },
  { id:175, veg:['白菜','ねぎ'], title:'白菜とねぎのさっと煮', days:4, desc:'軽く煮て味を含ませて冷ます。' },
  { id:176, veg:['大根','きのこ'], title:'大根きのこの香味和え', days:5, desc:'茹でて香味だれで和えるだけ。' },
  { id:177, veg:['もやし','ニンジン'], title:'もやしにんじんの甘辛炒め', days:3, desc:'炒めて甘辛味で仕上げる。' },
  { id:178, veg:['きゅうり','玉ねぎ'], title:'きゅうり玉ねぎのハーブ和え', days:5, desc:'薄切りをハーブとオイルで和える。' },
  { id:179, veg:['ナス','ニラ'], title:'ナスニラの甜麺醤炒め', days:5, desc:'甜麺醤で炒めて味をつける。' },
  { id:180, veg:['ネギ','きのこ'], title:'ねぎきのこのオリーブ和え', days:10, desc:'炒めてオリーブ油で漬けて保存。' },
  { id:181, veg:['ニラ','きゅうり'], title:'ニラきゅうりのピリ辛ナムル', days:5, desc:'刻んでピリ辛ダレで和えるだけ。' },
  { id:182, veg:['ニンジン','ネギ'], title:'にんじんねぎの生姜和え', days:6, desc:'千切りを生姜醤油で和えて保存。' },
  { id:183, veg:['玉ねぎ','白菜'], title:'玉ねぎ白菜のカレー風味マリネ', days:6, desc:'炒めてカレー風味のドレで和える。' },
  { id:184, veg:['きのこ','大根'], title:'きのこ大根の甘辛炒め', days:5, desc:'炒めて甘辛タレでからめる。' },
  { id:185, veg:['キャベツ','もやし'], title:'キャベツもやしの香味ナムル', days:3, desc:'茹でて香味油で和えるだけ。' },
  { id:186, veg:['白菜','きゅうり'], title:'白菜きゅうりのピリ辛和え', days:5, desc:'刻んでピリ辛ダレで和える。' },
  { id:187, veg:['大根','ナス'], title:'大根ナスの酢味噌和え', days:5, desc:'蒸し煮して酢味噌で和える。' },
  { id:188, veg:['もやし','ネギ'], title:'もやしねぎのラー油和え', days:3, desc:'茹でてラー油と醤油で和える。' },
  { id:189, veg:['きゅうり','ニンジン'], title:'きゅうりにんじんのハニーマスタード和え', days:6, desc:'千切りを蜂蜜マスタードで和える。' },
  { id:190, veg:['ナス','玉ねぎ'], title:'ナス玉ねぎのさっぱり煮浸し', days:4, desc:'焼いてだしにつけて冷ます。' },
  { id:191, veg:['ネギ','キャベツ'], title:'ねぎキャベツの味噌マリネ', days:6, desc:'茹でて味噌ダレで和えて保存。' },
  { id:192, veg:['ニラ','大根'], title:'ニラ大根のごまポン和え', days:4, desc:'茹でてごまポン酢で和えるだけ。' },
  { id:193, veg:['ニンジン','もやし'], title:'にんじんもやしのピーナッツ和え', days:3, desc:'茹でて砕いたピーナッツで和える。' },
  { id:194, veg:['玉ねぎ','きゅうり'], title:'玉ねぎきゅうりの醤油マリネ', days:5, desc:'薄切りを醤油ベースで和えて漬ける。' },
  { id:195, veg:['きのこ','ナス'], title:'きのこナスのにんにく醤油煮', days:6, desc:'にんにく醤油でじっくり煮る。' },
  { id:196, veg:['キャベツ','ネギ'], title:'キャベツねぎのバター醤油和え', days:4, desc:'炒めてバター醤油で和えるだけ。' },
  { id:197, veg:['白菜','ニラ'], title:'白菜ニラのごま油漬け', days:6, desc:'刻んでごま油と塩で漬ける。' },
  { id:198, veg:['大根','きゅうり'], title:'大根きゅうりの胡麻酢和え', days:6, desc:'千切りを胡麻酢で和えるだけ。' },
  { id:199, veg:['もやし','ナス'], title:'もやしナスの香味ダレ和え', days:3, desc:'蒸しナスともやしを香味ダレで和える。' },
  { id:200, veg:['きゅうり','ネギ'], title:'きゅうりねぎの塩だれ和え', days:4, desc:'刻んで塩だれで和えるだけ。' },
  { id:201, veg:['ナス','ニラ'], title:'ナスニラの生姜炒め', days:4, desc:'生姜と一緒に炒めて冷ます。' },
  { id:202, veg:['ネギ','玉ねぎ'], title:'ねぎ玉ねぎの甘辛コンフィ', days:7, desc:'低温で甘辛く煮て保存する。' },
  { id:203, veg:['ニラ','ニンジン'], title:'ニラにんじんの香味ソース和え', days:5, desc:'刻んで香味ソースで和えるだけ。' },
  { id:204, veg:['ニンジン','大根'], title:'にんじん大根のスイートチリ和え', days:6, desc:'千切りをスイートチリで和える。' },
  { id:205, veg:['玉ねぎ','キャベツ'], title:'玉ねぎキャベツの柚子マリネ', days:7, desc:'薄切りを柚子果汁と油で和える。' },
  { id:206, veg:['きのこ','白菜'], title:'きのこ白菜のしょうが煮', days:5, desc:'しょうがとだしで煮て冷ます。' },
  { id:207, veg:['キャベツ','きゅうり'], title:'キャベツきゅうりのマヨ胡麻和え', days:4, desc:'茹でてマヨと胡麻で和える。' },
  { id:208, veg:['白菜','大根'], title:'白菜大根のピクルス風', days:10, desc:'酢でしっかり漬けて長持ち。' },
  { id:209, veg:['大根','もやし'], title:'大根もやしのそぼろ和え', days:4, desc:'そぼろと和えて冷蔵保存。' },
  { id:210, veg:['もやし','きゅうり'], title:'もやしきゅうりの酢味噌和え', days:3, desc:'茹でて酢味噌で和えるだけ。' },
  { id:211, veg:['きゅうり','ナス'], title:'きゅうりナスのラタトゥイユ風', days:5, desc:'トマトで煮込んで保存する。' },
  { id:212, veg:['ナス','玉ねぎ'], title:'ナス玉ねぎの和風あんかけ', days:4, desc:'焼きナスにあんをかけて冷ます。' },
  { id:213, veg:['ネギ','ニラ'], title:'ねぎニラのにんにく醤油和え', days:6, desc:'刻んでにんにく醤油で和えるだけ。' },
  { id:214, veg:['ニラ','キャベツ'], title:'ニラキャベツの梅おかか和え', days:6, desc:'茹でて梅とおかかで和える。' },
  { id:215, veg:['ニンジン','きゅうり'], title:'にんじんきゅうりの塩レモンピクルス', days:14, desc:'千切りを塩レモンと酢で漬けるだけ。' }
];

const vegButtons = ['今日の作り置き','ニンジン','玉ねぎ','きのこ','キャベツ','白菜','大根','もやし','きゅうり','ナス','ネギ','ニラ'];

document.addEventListener('DOMContentLoaded', () => {
  renderVegButtons();
  renderRecipeList(recipes);
  attachControls();
  // default: show "今日の作り置き"
  showTodayPick();
});

function renderVegButtons(){
  const container = document.getElementById('veg-buttons');
  container.innerHTML = '';
  vegButtons.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.className = 'veg-btn';
    btn.textContent = v;
    btn.dataset.veg = v;
    // color variety by index
    btn.style.background = `var(--btn-color-${(i % 8) + 1})`;
    container.appendChild(btn);
  });
}

function attachControls(){
  document.getElementById('veg-buttons').addEventListener('click', (e)=>{
    if(!e.target.matches('.veg-btn')) return;
    const veg = e.target.dataset.veg;
    if(veg === '今日の作り置き'){ showTodayPick(); return; }
    filterByVeg(veg);
  });

  document.getElementById('search-input').addEventListener('input', (e)=>{
    searchAndRender(e.target.value.trim());
  });

  document.getElementById('copy-btn').addEventListener('click', copyRecipesToClipboard);
  document.getElementById('png-btn').addEventListener('click', saveAsPng);
  document.getElementById('share-x').addEventListener('click', ()=> shareTo('x'));
  document.getElementById('share-fb').addEventListener('click', ()=> shareTo('facebook'));
  document.getElementById('share-line').addEventListener('click', ()=> shareTo('line'));
  document.getElementById('share-mail').addEventListener('click', ()=> shareTo('mail'));
  document.getElementById('to-top').addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
}

function showTodayPick(){
  const shuffled = recipes.slice().sort(()=>0.5 - Math.random());
  const pick = shuffled.slice(0,4);
  renderRecipeList(pick, '今日の作り置き — 今日作って冷蔵保存できるおすすめ');
}

function filterByVeg(veg){
  const filtered = recipes.filter(r => r.veg.includes(veg));
  const title = `${veg}の作り置きレシピ (${filtered.length}件)`;
  renderRecipeList(filtered, title);
}

function searchAndRender(q){
  if(!q){ renderRecipeList(recipes); return; }
  const ql = q.toLowerCase();
  const filtered = recipes.filter(r => {
    return r.title.toLowerCase().includes(ql) || r.desc.toLowerCase().includes(ql) || r.veg.join(' ').toLowerCase().includes(ql);
  });
  renderRecipeList(filtered, `検索結果: 「${q}」 (${filtered.length}件)`);
}

function renderRecipeList(list, headerText){
  const box = document.getElementById('recipe-area');
  box.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'area-header';
  header.innerHTML = `<h2 class="area-title">${headerText ? escapeHtml(headerText) : 'すべての野菜の作り置きレシピ'}</h2>
                      <div class="search-wrap"><input id="search-input" placeholder="レシピ名・材料で検索" aria-label="検索入力"></div>`;
  box.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'recipe-grid';
  if(list.length === 0){
    grid.innerHTML = '<p class="no-results">該当するレシピがありません</p>';
  } else {
    list.forEach(r => {
      const card = document.createElement('article');
      card.className = 'recipe-card';
      card.innerHTML = `<h3 class="recipe-title"><strong>${escapeHtml(r.title)}</strong></h3>
                        <p class="recipe-desc">${escapeHtml(r.desc)}</p>
                        <p class="meta">保存目安: <strong>${escapeHtml(String(r.days))}日</strong> ・ 材料: ${escapeHtml(r.veg.join('、'))}</p>`;
      grid.appendChild(card);
    });
  }
  box.appendChild(grid);

  // re-bind input (because we recreated it)
  const searchInput = document.getElementById('search-input');
  if(searchInput){
    searchInput.addEventListener('input', (e)=> searchAndRender(e.target.value.trim()));
  }
}

function copyRecipesToClipboard(){
  const area = document.getElementById('recipe-area');
  const text = area.innerText || area.textContent;
  navigator.clipboard.writeText(text).then(()=> {
    flashNotice('レシピをコピーしました');
  }).catch(()=> {
    flashNotice('コピーに失敗しました');
  });
}

function saveAsPng(){
  // render the recipe-area into a canvas and save PNG
  const area = document.getElementById('recipe-area');
  const clone = area.cloneNode(true);
  clone.style.width = getComputedStyle(area).width;
  // Create a new window-styled canvas using SVG foreignObject technique
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
  <foreignObject width='100%' height='100%'>
    <div xmlns='http://www.w3.org/1999/xhtml' style='font-family:system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Segoe UI", Roboto;'>
      ${escapeHtmlForSvg(clone.outerHTML)}
    </div>
  </foreignObject>
  </svg>`;
  const svgBlob = new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = function(){
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);
    canvas.toBlob((blob)=>{
      if(!blob){ flashNotice('保存に失敗しました'); URL.revokeObjectURL(url); return; }
      const a = document.createElement('a');
      a.download = 'vegetable_recipes.png';
      a.href = URL.createObjectURL(blob);
      a.click();
      URL.revokeObjectURL(a.href);
      URL.revokeObjectURL(url);
      flashNotice('PNGを保存しました');
    }, 'image/png');
  };
  img.onerror = ()=> {
    URL.revokeObjectURL(url);
    flashNotice('画像生成に失敗しました');
  };
  img.src = url;
}

function shareTo(platform){
  const pageUrl = encodeURIComponent(location.href);
  const areaText = encodeURIComponent(document.getElementById('recipe-area').innerText.trim().slice(0,600));
  let shareUrl = '';
  if(platform === 'x'){
    shareUrl = `https://twitter.com/intent/tweet?text=${areaText}&url=${pageUrl}`;
  } else if(platform === 'facebook'){
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  } else if(platform === 'line'){
    shareUrl = `https://social-plugins.line.me/lineit/share?url=${pageUrl}`;
  } else if(platform === 'mail'){
    shareUrl = `mailto:?subject=${encodeURIComponent('野菜の作り置きレシピ')}&body=${areaText}%0A%0A${pageUrl}`;
  }
  window.open(shareUrl, '_blank', 'noopener');
}

function flashNotice(msg){
  const n = document.getElementById('flash');
  n.textContent = msg;
  n.classList.add('visible');
  setTimeout(()=> n.classList.remove('visible'), 2000);
}

/* helpers */
function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function escapeHtmlForSvg(str){
  // keep basic tags but escape <script>
  return escapeHtml(str).replace(/&lt;(\/?)(script|iframe|img)(.*?)&gt;/gi, '&lt;$1$2$3&gt;');
}