// script.js ）
const RECIPES = [
  { id:1, title:"ほうれん草と卵のヘルシーサラダ", category:"サラダ",
    instructions:"卵を固ゆでにし、ほうれん草とトマトをカット。オリーブオイル・レモン汁・塩で和える。" },
  { id:2, title:"豆腐と卵のやさしいスープ", category:"スープ",
    instructions:"鶏ガラスープを沸かし、絹ごし豆腐と溶き卵を加える。ねぎを散らして完成。" },
  { id:3, title:"アボカド卵サラダ", category:"サラダ",
    instructions:"アボカドを潰し、茹で卵とレモン・塩・胡椒で和える。全粒粉パンにのせてどうぞ。" },
  { id:4, title:"トマトと卵の中華風スープ", category:"スープ",
    instructions:"ごま油でにんにくを炒め、トマト・だしを入れ溶き卵を流し入れる。醤油で味を整える。" },
  { id:5, title:"きのこオムレツ風サラダ", category:"サラダ",
    instructions:"きのこをソテーし、半熟のスクランブルエッグと混ぜてサラダリーフにのせる。" },
  { id:6, title:"中華風卵とワカメのスープ", category:"スープ",
    instructions:"鶏スープにワカメを入れ、溶き卵でとじる。ごま油と白胡椒を少々。" },
  { id:7, title:"豆苗と卵の簡単サラダ", category:"サラダ",
    instructions:"豆苗を短く切り、茹で卵とオリーブオイル・酢で和える。" },
  { id:8, title:"キャベツと卵のコンソメスープ", category:"スープ",
    instructions:"コンソメでキャベツを煮て、溶き卵を回し入れてとじる。" },
  { id:9, title:"鶏ささみと卵のおかずサラダ", category:"サラダ",
    instructions:"蒸し鶏と茹で卵を裂き、ヨーグルトドレッシングで和える。" },
  { id:10, title:"大根と卵の和風スープ", category:"スープ",
    instructions:"だしで大根を煮て、溶き卵でとじる。刻み柚子を添える。" },
  { id:11, title:"ズッキーニと卵のグリルおかず", category:"おかず",
    instructions:"輪切りズッキーニに溶き卵をのせ、オーブンで焼く。パルメザン少々。" },
  { id:12, title:"ほうれん草と卵の和え物", category:"おかず",
    instructions:"茹でたほうれん草に半熟卵と醤油少々で和える。" },
  { id:13, title:"ブロッコリーと卵のレモンサラダ", category:"サラダ",
    instructions:"茹でブロッコリーと刻み卵をレモンドレッシングで和える。" },
  { id:14, title:"玉ねぎと卵のミネストローネ風スープ", category:"スープ",
    instructions:"野菜とトマトで煮込み、仕上げに溶き卵でとじる。" },
  { id:15, title:"鮭と卵のヘルシーおかず", category:"おかず",
    instructions:"焼き鮭と温泉卵を添え、刻みネギとポン酢で仕上げる。" },
  { id:16, title:"豆と卵のプロテインサラダ", category:"サラダ",
    instructions:"ミックスビーンズと刻み卵をオリーブオイル・塩で和える。" },
  { id:17, title:"青菜と卵の中華スープ", category:"スープ",
    instructions:"鶏ガラスープで青菜を煮て、溶き卵でとじる。胡麻油少々。" },
  { id:18, title:"ナスと卵のトマト煮おかず", category:"おかず",
    instructions:"ナスを炒めトマトソースで煮て、最後に溶き卵でとじる。" },
  { id:19, title:"きゅうりと卵のさっぱりサラダ", category:"サラダ",
    instructions:"薄切りきゅうりと刻み卵を酢・砂糖・塩で和える。" },
  { id:20, title:"白菜と卵のポタージュ風スープ", category:"スープ",
    instructions:"白菜と玉ねぎを煮てミキサーし、温めて溶き卵を加える。" },
  { id:21, title:"さつまいもと卵のヘルシーおかず", category:"おかず",
    instructions:"蒸したさつまいもにマッシュ卵と少量のヨーグルトを和える。" },
  { id:22, title:"ビーツと卵の彩りサラダ", category:"サラダ",
    instructions:"茹でビーツとゆで卵をスライスし、オリーブオイルで和える。" },
  { id:23, title:"春菊と卵の和風スープ", category:"スープ",
    instructions:"だしで春菊を煮て、溶き卵でとじる。醤油少々で調味。" },
  { id:24, title:"豆腐ステーキに乗せる卵おかず", category:"おかず",
    instructions:"焼いた豆腐に温泉卵をのせ、ねぎと醤油をかける。" },
  { id:25, title:"トマトと卵のさっぱりサラダ", category:"サラダ",
    instructions:"トマトとゆで卵を塩・オリーブオイルで和える。" },
  { id:26, title:"ほうれん草と卵のクリームスープ", category:"スープ",
    instructions:"ほうれん草を煮て裏ごしし、牛乳と合わせ溶き卵を加える。" },
  { id:27, title:"鶏そぼろと卵のおかず", category:"おかず",
    instructions:"低脂肪鶏ひき肉をそぼろにし、スクランブルエッグと合わせる。" },
  { id:28, title:"オレンジと卵のフルーツサラダ", category:"サラダ",
    instructions:"オレンジと刻み卵をヨーグルトで和える。" },
  { id:29, title:"わかめと卵の味噌スープ", category:"スープ",
    instructions:"だしでわかめを戻し、味噌を溶き溶き卵を加えて火を止める。" },
  { id:30, title:"ズッキーニと卵の中華おかず", category:"おかず",
    instructions:"ズッキーニを炒めて溶き卵と合わせ、醤油で軽く味付け。" },
  { id:31, title:"シャキシャキ大根と卵のサラダ", category:"サラダ",
    instructions:"千切り大根と刻み卵を胡麻ドレッシングで和える。" },
  { id:32, title:"玄米と卵のスープリゾット風", category:"スープ",
    instructions:"鶏スープで玄米を煮て、とろみが出たら溶き卵を加える。" },
  { id:33, title:"しらすと卵の和風おかず", category:"おかず",
    instructions:"しらすを温め卵と合わせて茶碗蒸し風に蒸す。" },
  { id:34, title:"春キャベツと卵のシンプルサラダ", category:"サラダ",
    instructions:"千切り春キャベツとゆで卵を塩・レモンで和える。" },
  { id:35, title:"人参と卵のポタージュ", category:"スープ",
    instructions:"人参を煮てミキサーし、温めて卵でとじ滑らかにする。" },
  { id:36, title:"鳥胸肉と卵のさっぱりおかず", category:"おかず",
    instructions:"蒸し鶏と茹で卵を薄口醤油と生姜で和える。" },
  { id:37, title:"カブと卵のハーブサラダ", category:"サラダ",
    instructions:"薄切りカブと刻み卵をディルとオリーブオイルで和える。" },
  { id:38, title:"白菜と卵のホットスープ", category:"スープ",
    instructions:"だしで白菜を煮て溶き卵を入れ、胡椒で調える。" },
  { id:39, title:"レンコンと卵のヘルシーきんぴら風", category:"おかず",
    instructions:"薄切りレンコンを炒め、溶き卵で軽くとじる。" },
  { id:40, title:"水菜と卵の梅サラダ", category:"サラダ",
    instructions:"水菜と刻み卵を梅ドレッシングで和える。" },
  { id:41, title:"きのこと卵の和風コンソメスープ", category:"スープ",
    instructions:"きのこ類を煮てコンソメで味付けし溶き卵でとじる。" },
  { id:42, title:"カリフラワーと卵のオーブン焼きおかず", category:"おかず",
    instructions:"茹でカリフラワーに溶き卵をかけてオーブンで焼く。" },
  { id:43, title:"セロリと卵のさっぱりサラダ", category:"サラダ",
    instructions:"薄切りセロリとゆで卵をオリーブオイルと酢で和える。" },
  { id:44, title:"雑穀入り卵のとろみスープ", category:"スープ",
    instructions:"雑穀を煮てスープにし溶き卵を加えてとろみを付ける。" },
  { id:45, title:"白インゲン豆と卵のおかず", category:"おかず",
    instructions:"白インゲンとゆで卵をトマトソースで和える。" },
  { id:46, title:"ビーフンと卵のサラダ風", category:"サラダ",
    instructions:"茹でビーフンと刻み卵をナンプラーレモンで和える。" },
  { id:47, title:"長芋と卵の和風ポタージュ", category:"スープ",
    instructions:"長芋を煮てミキサーし、温めて溶き卵を加える。" },
  { id:48, title:"玉ねぎステーキに卵を添えたおかず", category:"おかず",
    instructions:"厚切り玉ねぎを焼き、半熟卵をのせてポン酢で食べる。" },
  { id:49, title:"蒸し鶏と卵のサラダ仕立て", category:"サラダ",
    instructions:"蒸し鶏と刻み卵をレタスと和えて和風ドレッシングで。" },
  { id:50, title:"にらと卵の中華スープ", category:"スープ",
    instructions:"鶏ガラでにらを煮て溶き卵を散らす。ごま油を一滴。" },
  { id:51, title:"焼きトマトと卵のシンプルおかず", category:"おかず",
    instructions:"トマトを焼き、崩したゆで卵とバジルで和える。" },
  { id:52, title:"ラディッシュと卵のピリ辛サラダ", category:"サラダ",
    instructions:"薄切りラディッシュと刻み卵を豆板醤少々で和える。" },
  { id:53, title:"さやいんげんと卵の和スープ", category:"スープ",
    instructions:"だしでいんげんを煮て溶き卵でとじる。醤油で調味。" },
  { id:54, title:"ひじきと卵の栄養おかず", category:"おかず",
    instructions:"戻したひじきと炒り卵を醤油・みりんで炒め合わせる。" },
  { id:55, title:"芽キャベツと卵のサラダ", category:"サラダ",
    instructions:"茹で芽キャベツとゆで卵を粒マスタードで和える。" },
  { id:56, title:"ミニトマトと卵のブロススープ", category:"スープ",
    instructions:"野菜ブロスでミニトマトを煮て溶き卵を加える。" },
  { id:57, title:"白身魚と卵の蒸しおかず", category:"おかず",
    instructions:"白身魚に卵液をかけ蒸し器で蒸す。ポン酢でさっぱりと。" },
  { id:58, title:"グリーンピースと卵のサラダ", category:"サラダ",
    instructions:"茹でグリーンピースと刻み卵をマヨ軽めで和える。" },
  { id:59, title:"玉ねぎと卵のスープオニオン風", category:"スープ",
    instructions:"玉ねぎをじっくり煮てスープにし溶き卵でとじる。" },
  { id:60, title:"ほたてと卵の軽いおかず", category:"おかず",
    instructions:"ソテーしたほたてにポーチドエッグを添えレモンで。" },
  { id:61, title:"コールスローに卵を加えたサラダ", category:"サラダ",
    instructions:"千切りキャベツに刻み卵を加えヨーグルトで和える。" },
  { id:62, title:"かぼちゃと卵のポタージュ", category:"スープ",
    instructions:"かぼちゃを煮てミキサーし牛乳と混ぜ溶き卵を加える。" },
  { id:63, title:"もやしと卵のピリ辛おかず", category:"おかず",
    instructions:"もやしを炒め溶き卵でとじ、豆板醤で味を調える。" },
  { id:64, title:"リンゴと卵のフレッシュサラダ", category:"サラダ",
    instructions:"薄切りリンゴと刻み卵をレモンヨーグルトで和える。" },
  { id:65, title:"えのきと卵の和風スープ", category:"スープ",
    instructions:"だしでえのきを煮て溶き卵でとじる。ネギを散らす。" },
  { id:66, title:"小松菜と卵のさっぱりおかず", category:"おかず",
    instructions:"茹でた小松菜と刻み卵を醤油とごま油で和える。" },
  { id:67, title:"かいわれ大根と卵のさっぱりサラダ", category:"サラダ",
    instructions:"かいわれとゆで卵をポン酢で和える。刻み海苔を添えて。" },
  { id:68, title:"豆と卵のトマトスープ", category:"スープ",
    instructions:"トマトブロスで豆を煮て溶き卵を加える。バジルで香り付け。" },
  { id:69, title:"トマト缶と卵のヘルシーおかず", category:"おかず",
    instructions:"トマト缶で野菜を煮て卵を割り入れ半熟で仕上げる。" },
  { id:70, title:"ほうれん草と苺の変わりサラダ", category:"サラダ",
    instructions:"ほうれん草とスライス苺、刻み卵をバルサミコで和える。" },
  { id:71, title:"にんじんと卵のコンソメスープ", category:"スープ",
    instructions:"にんじんを煮てコンソメで味付け、溶き卵を加える。" },
  { id:72, title:"舞茸と卵のソテーおかず", category:"おかず",
    instructions:"舞茸を炒め溶き卵を絡めて醤油で仕上げる。" },
  { id:73, title:"トウモロコシと卵のサラダ", category:"サラダ",
    instructions:"茹でコーンと刻み卵をマヨネーズ少々で和える。" },
  { id:74, title:"にら玉あっさりスープ", category:"スープ",
    instructions:"鶏ガラスープでにらを煮て卵を回し入れ味を整える。" },
  { id:75, title:"ポーチドエッグとほうれん草のおかず", category:"おかず",
    instructions:"ソテーほうれん草にポーチドエッグをのせオリーブオイルで。" },
  { id:76, title:"ビーツと卵のマリネサラダ", category:"サラダ",
    instructions:"茹でビーツと卵を酢とオリーブオイルでマリネする。" },
  { id:77, title:"ズッキーニと卵のクリアスープ", category:"スープ",
    instructions:"薄切りズッキーニをだしで煮て溶き卵でとじる。" },
  { id:78, title:"かぶの葉と卵の炒めおかず", category:"おかず",
    instructions:"かぶの葉を炒めて溶き卵でさっと絡める。塩で調味。" },
  { id:79, title:"パプリカと卵の色どりサラダ", category:"サラダ",
    instructions:"スライスパプリカとゆで卵をオリーブオイルで和える。" },
  { id:80, title:"豆苗と卵の中華スープ", category:"スープ",
    instructions:"鶏スープで豆苗を煮て溶き卵を回し入れる。" },
  { id:81, title:"レンティルと卵のタンパクおかず", category:"おかず",
    instructions:"茹でレンズ豆と刻み卵をハーブと和える。" },
  { id:82, title:"ルッコラと卵のビネグレットサラダ", category:"サラダ",
    instructions:"ルッコラと半熟卵をビネグレットで和える。" },
  { id:83, title:"春雨と卵のあっさりスープ", category:"スープ",
    instructions:"鶏スープに春雨を入れ溶き卵でとじる。醤油で調整。" },
  { id:84, title:"ごぼうと卵の和風きんぴらおかず", category:"おかず",
    instructions:"ささがきごぼうを炒め、炒り卵と合わせ醤油で味付け。" },
  { id:85, title:"イタリアンハーブ卵の冷製サラダ", category:"サラダ",
    instructions:"ミックスリーフに刻み卵とハーブ、オリーブオイルで和える。" },
  { id:86, title:"豆腐と卵の生姜スープ", category:"スープ",
    instructions:"だしに豆腐を入れ溶き卵を加え仕上げに生姜を効かせる。" },
  { id:87, title:"焼きナスと卵の冷やしおかず", category:"おかず",
    instructions:"焼きナスに冷たい刻み卵をのせ生姜醤油で食べる。" },
  { id:88, title:"ほうれん草とベリーと卵のサラダ", category:"サラダ",
    instructions:"ほうれん草、ベリー、刻み卵をバルサミコで和える。" },
  { id:89, title:"にんにくと卵のスタミナスープ", category:"スープ",
    instructions:"にんにくを香り出しし鶏スープで溶き卵をとじる。" },
  { id:90, title:"鯖缶と卵の和風おかず", category:"おかず",
    instructions:"鯖缶と刻み卵をねぎと醤油で和える。ご飯にも合う。" },
  { id:91, title:"トレビスと卵のほろ苦サラダ", category:"サラダ",
    instructions:"トレビスとゆで卵をオリーブオイルと塩で和える。" },
  { id:92, title:"さつま揚げと卵のあっさりスープ", category:"スープ",
    instructions:"だしにさつま揚げを入れ溶き卵でとじて刻みネギを散らす。" },
  { id:93, title:"シャケフレークと卵の和え物おかず", category:"おかず",
    instructions:"シャケフレークと刻み卵を和えて海苔を振る。" },
  { id:94, title:"芽ネギと卵のさっぱりサラダ", category:"サラダ",
    instructions:"刻み芽ネギとゆで卵をポン酢で和える。ごまを散らす。" },
  { id:95, title:"トウフと卵のふんわりスープ", category:"スープ",
    instructions:"豆腐を優しく温め溶き卵を加え生姜を効かせる。" },
  { id:96, title:"もずくと卵の海藻おかず", category:"おかず",
    instructions:"もずく酢にもずくと刻み卵を合わせてよく混ぜる。" },
  { id:97, title:"グレープフルーツと卵の爽やかサラダ", category:"サラダ",
    instructions:"グレープフルーツと刻み卵をミントと合わせる。" },
  { id:98, title:"根菜と卵の和風スープ", category:"スープ",
    instructions:"根菜をだしで煮込み溶き卵でとじて味を整える。" },
  { id:99, title:"ほうれん草と卵のカレー風おかず", category:"おかず",
    instructions:"ほうれん草を炒めカレー粉で風味付けし卵を絡める。" },
  { id:100, title:"キウイと卵のフルーツサラダ", category:"サラダ",
    instructions:"スライスキウイと刻み卵をヨーグルトで和える。" },
  { id:101, title:"揚げ茄子と卵のしょうがスープ", category:"スープ",
    instructions:"揚げ茄子をだしに入れ溶き卵でとじる。生姜を添える。" },
  { id:102, title:"アスパラガスと卵のソテーおかず", category:"おかず",
    instructions:"アスパラをソテーし半熟卵を絡める。塩で味付け。" },
  { id:103, title:"カリフラワーライスと卵のサラダ", category:"サラダ",
    instructions:"カリフラワーライスと刻み卵をレモンドレッシングで和える。" },
  { id:104, title:"キャベツと卵のトマトベーススープ", category:"スープ",
    instructions:"トマトスープでキャベツを煮て溶き卵でとじる。" },
  { id:105, title:"きのこと卵の和風ソテーおかず", category:"おかず",
    instructions:"お好みのきのこを炒め溶き卵で絡め醤油で味を調える。" },
  { id:106, title:"山芋と卵のとろろサラダ", category:"サラダ",
    instructions:"すりおろした山芋に刻み卵と醤油を少々混ぜて冷やす。" },
  { id:107, title:"芽キャベツとポーチドエッグの温サラダ", category:"サラダ",
    instructions:"芽キャベツを蒸してポーチドエッグをのせ、オリーブオイルと粒マスタードで和える。" },
  { id:108, title:"玄米と卵のヘルシースープ", category:"スープ",
    instructions:"玄米を柔らかく煮て鶏ブロスで伸ばし溶き卵を加える。" },
  { id:109, title:"ゆで卵とキムチのピリ辛おかず", category:"おかず",
    instructions:"刻みゆで卵とキムチを和えてゴマ油を少々たらす。" },
  { id:110, title:"焼きかぶと卵のサラダ", category:"サラダ",
    instructions:"薄切りかぶをグリルし刻み卵とハーブを和える。" },
  { id:111, title:"豆腐と卵の根菜スープ", category:"スープ",
    instructions:"根菜をだしで煮て豆腐と溶き卵を加え生姜を効かせる。" },
  { id:112, title:"ソラマメと卵のレモンおかず", category:"おかず",
    instructions:"茹でソラマメと刻み卵をレモンとオリーブオイルで和える。" },
  { id:113, title:"イタリアントマトと卵の冷製サラダ", category:"サラダ",
    instructions:"完熟トマトとゆで卵をバジルドレッシングで和える。" },
  { id:114, title:"根菜と卵の味噌クリアスープ", category:"スープ",
    instructions:"根菜を煮て味噌で調味し溶き卵でとじる。" },
  { id:115, title:"舞茸と卵のだし炒めおかず", category:"おかず",
    instructions:"舞茸を炒めて溶き卵で絡め醤油で軽く味付け。" },
  { id:116, title:"カリフラワーと卵のターメリックサラダ", category:"サラダ",
    instructions:"ローストカリフラワーとゆで卵をターメリックドレッシングで和える。" },
  { id:117, title:"トマトコンソメと卵のシンプルスープ", category:"スープ",
    instructions:"コンソメベースに角切りトマトを入れ溶き卵でとじる。" },
  { id:118, title:"蒸しさばと卵の胡麻おかず", category:"おかず",
    instructions:"蒸し鯖をほぐし刻み卵とねぎ、胡麻を合わせる。" },
  { id:119, title:"コールラビと卵のさっぱりサラダ", category:"サラダ",
    instructions:"薄切りコールラビとゆで卵をビネグレットで和える。" },
  { id:120, title:"鶏団子と卵の生姜スープ", category:"スープ",
    instructions:"鶏だねで団子を作り煮て溶き卵でとじ生姜を加える。" },
  { id:121, title:"焼きカブと卵の味噌おかず", category:"おかず",
    instructions:"焼きかぶに崩したゆで卵をのせ味噌ダレで食べる。" },
  { id:122, title:"ルッコラと温泉卵のビネガーサラダ", category:"サラダ",
    instructions:"ルッコラに温泉卵をのせバルサミコで和える。" },
  { id:123, title:"セロリと卵の中華スープ", category:"スープ",
    instructions:"鶏スープでセロリを煮て溶き卵を加え胡椒で味を調える。" },
  { id:124, title:"ズッキーニの卵とじグラタン風おかず", category:"おかず",
    instructions:"ズッキーニと卵を耐熱で焼きチーズ少々で仕上げる（チーズ控えめ）。" },
  { id:125, title:"カプレーゼ風卵サラダ", category:"サラダ",
    instructions:"モッツァレラ少量、トマト、ゆで卵をバジルとオリーブオイルで和える。" },
  { id:126, title:"里芋と卵のとろみスープ", category:"スープ",
    instructions:"里芋を煮てミキサーし温めて溶き卵でとじる。" },
  { id:127, title:"鮭ほぐしと卵の混ぜおかず", category:"おかず",
    instructions:"鮭ほぐしと刻み卵を和えてご飯や野菜にのせる。" },
  { id:128, title:"ロメインレタスと卵のシーザーテイストサラダ", category:"サラダ",
    instructions:"ロメインレタスに刻み卵を加えヨーグルトベースで和える。" },
  { id:129, title:"大豆ミートと卵のヘルシースープ", category:"スープ",
    instructions:"大豆ミートと野菜を煮て溶き卵を加え風味を調える。" },
  { id:130, title:"秋刀魚と卵の和風おかず", category:"おかず",
    instructions:"焼き秋刀魚をほぐして刻み卵とねぎ醤油で和える。" },
  { id:131, title:"芽ねぎと卵の韓国風サラダ", category:"サラダ",
    instructions:"芽ねぎとゆで卵をコチュジャン少量と酢で和える。" },
  { id:132, title:"カボチャと卵のスパイススープ", category:"スープ",
    instructions:"かぼちゃを煮てカレー風味にし溶き卵でとじる。" },
  { id:133, title:"ほうれん草と卵のチーズ風味おかず", category:"おかず",
    instructions:"ほうれん草と卵をソテーし粉チーズ少々で風味付け。" },
  { id:134, title:"グリーンサラダと半熟卵のシンプル盛り", category:"サラダ",
    instructions:"ミックスグリーンに半熟卵をのせオリーブオイルと塩で。" },
  { id:135, title:"コーンと卵のミルクスープ", category:"スープ",
    instructions:"コーンと玉ねぎを煮て牛乳で伸ばし溶き卵を加える。" },
  { id:136, title:"茹で卵の梅ひじき和えおかず", category:"おかず",
    instructions:"刻みゆで卵と梅干し、戻したひじきを和える。" },
  { id:137, title:"柿と卵の変わりサラダ", category:"サラダ",
    instructions:"薄切り柿と刻み卵をレモンと蜂蜜少々で和える。" },
  { id:138, title:"キャベツと卵の中華風酸辣スープ", category:"スープ",
    instructions:"キャベツを煮て黒酢と胡椒で酸辣風にし溶き卵でとじる。" },
  { id:139, title:"カニかまと卵のヘルシーおかず", category:"おかず",
    instructions:"カニかまと刻み卵をマヨ少量で和えレモンを絞る。" },
  { id:140, title:"ベビーリーフと卵のナッツサラダ", category:"サラダ",
    instructions:"ベビーリーフとゆで卵に刻みナッツとオリーブオイルで和える。" },
  { id:141, title:"ほうれん草と卵の中華あんかけスープ", category:"スープ",
    instructions:"鶏スープでほうれん草を煮て片栗でとろみを付け溶き卵を加える。" },
  { id:142, title:"蒸し野菜と卵のごまダレおかず", category:"おかず",
    instructions:"蒸し野菜に刻み卵をのせごまだれでいただく。" },
  { id:143, title:"ラディッシュとゆで卵のハーブ和えサラダ", category:"サラダ",
    instructions:"ラディッシュと刻み卵をハーブとオリーブオイルで和える。" },
  { id:144, title:"じゃがいもと卵のポタージュ", category:"スープ",
    instructions:"じゃがいもと玉ねぎを煮てミキサーし溶き卵で滑らかにする。" },
  { id:145, title:"いんげんと卵のカレー風味おかず", category:"おかず",
    instructions:"茹でたいんげんと炒り卵をカレー粉で和える。" },
  { id:146, title:"トマトと卵とモロッコ豆のサラダ", category:"サラダ",
    instructions:"ミニトマト、ゆで卵、モロッコインゲンをビネグレットで和える。" },
  { id:147, title:"鶏むねと卵の冷製スープ", category:"スープ",
    instructions:"鶏むねを煮出したスープを冷やし卵でとじて冷製にする（卵は固め）。" },
  { id:148, title:"里芋と卵の煮物風おかず", category:"おかず",
    instructions:"里芋を薄味で煮て刻み卵を加えさっと煮る。" },
  { id:149, title:"アスパラと卵のさっと和えサラダ", category:"サラダ",
    instructions:"茹でアスパラとゆで卵をオリーブオイルとレモンで和える。" },
  { id:150, title:"うどん出汁と卵の和風スープ", category:"スープ",
    instructions:"うどんだしを温め溶き卵を加えねぎを散らす。" },
  { id:151, title:"蒸しブロッコリーと卵のディップおかず", category:"おかず",
    instructions:"刻み卵とヨーグルトで軽いディップを作り蒸しブロッコリーに付ける。" },
  { id:152, title:"ビーツと温泉卵のサラダボウル", category:"サラダ",
    instructions:"薄切りビーツと温泉卵をのせオリーブオイルで和える。" },
  { id:153, title:"ココナッツ風味卵スープ（アジアン）", category:"スープ",
    instructions:"チキンブロスとココナッツミルクで煮て卵を流し入れる。レモングラスで香り付け。" },
  { id:154, title:"揚げ出し豆腐に卵あんをかけたおかず", category:"おかず",
    instructions:"揚げ出し豆腐に溶き卵入りのあんをかけて仕上げる。" },
  { id:155, title:"水菜と卵の辛子和えサラダ", category:"サラダ",
    instructions:"水菜と刻み卵を和辛子とポン酢で和える。" },
  { id:156, title:"鰹だしと卵の和風コンソメ", category:"スープ",
    instructions:"鰹だしをベースに野菜を入れ溶き卵でとじる。" },
  { id:157, title:"こんにゃくと卵のヘルシー炒めおかず", category:"おかず",
    instructions:"こんにゃくと刻み卵を炒めて醤油で味を調える。" },
  { id:158, title:"洋梨と卵のデリサラダ", category:"サラダ",
    instructions:"薄切り洋梨と刻み卵をクルミとヨーグルトで和える。" },
  { id:159, title:"春キャベツと卵の豆乳スープ", category:"スープ",
    instructions:"春キャベツを煮て豆乳で伸ばし溶き卵を加える。" },
  { id:160, title:"青梗菜と卵の中華炒めおかず", category:"おかず",
    instructions:"青梗菜を炒め溶き卵を絡めてオイスターソースで風味付け。" },
  { id:161, title:"コリアンダーと卵のサラダ", category:"サラダ",
    instructions:"刻みコリアンダーとゆで卵をライムドレッシングで和える。" },
  { id:162, title:"カリフラワーステムと卵のスープ", category:"スープ",
    instructions:"茎部分を使ったスープに溶き卵を入れてとじる。" },
  { id:163, title:"舞茸と卵のバルサミコ炒めおかず", category:"おかず",
    instructions:"舞茸を炒め卵を絡めてバルサミコ酢で風味を付ける。" },
  { id:164, title:"枝豆と卵のプロテインサラダ", category:"サラダ",
    instructions:"茹で枝豆と刻み卵をオリーブオイルと塩で和える。" },
  { id:165, title:"にんにくチップと卵のスープ", category:"スープ",
    instructions:"にんにくチップを浮かべた鶏スープに溶き卵を加える。" },
  { id:166, title:"茄子と卵の味噌マリネおかず", category:"おかず",
    instructions:"焼き茄子に崩し卵をのせ味噌だれで和える。" },
  { id:167, title:"フェンネルと卵の地中海サラダ", category:"サラダ",
    instructions:"薄切りフェンネルとゆで卵をオレンジドレッシングで和える。" },
  { id:168, title:"豆乳と卵のクリーミースープ", category:"スープ",
    instructions:"豆乳ベースで野菜を煮溶き卵でとじる。塩で調える。" },
  { id:169, title:"いかと卵のさっぱりおかず", category:"おかず",
    instructions:"茹でいかと刻み卵をポン酢で和えてネギを散らす。" },
  { id:170, title:"春菊とゆで卵のごま和えサラダ", category:"サラダ",
    instructions:"茹で春菊と刻み卵をすりごまで和える。" },
  { id:171, title:"蕪の葉と卵のだしスープ", category:"スープ",
    instructions:"蕪の葉をだしで煮て溶き卵を加え塩で調整。" },
  { id:172, title:"豆腐と卵の豆板醤和えおかず", category:"おかず",
    instructions:"絹豆腐に刻み卵をのせ豆板醤と醤油で味を調える。" },
  { id:173, title:"クレソンと卵のピリッとサラダ", category:"サラダ",
    instructions:"クレソンとゆで卵を辛味ドレッシングで和える。" },
  { id:174, title:"トマトと卵のスパニッシュスープ", category:"スープ",
    instructions:"トマトベースのスープに溶き卵を落としパプリカで香り付け。" },
  { id:175, title:"ごぼうと卵の和風サラダおかず", category:"おかず",
    instructions:"ささがきごぼうと刻み卵を柚子胡椒ドレッシングで和える。" },
  { id:176, title:"サツマイモと卵のシナモンサラダ", category:"サラダ",
    instructions:"蒸しサツマイモと刻み卵をシナモンとヨーグルトで和える。" },
  { id:177, title:"魚介と卵のブイヤベース風スープ", category:"スープ",
    instructions:"魚介出汁で煮て溶き卵を加えサフラン風味で仕上げる（控えめ）." },
  { id:178, title:"アボカドと卵の生姜醤油おかず", category:"おかず",
    instructions:"潰したアボカドに刻み卵を載せ生姜醤油で味付け。" },
  { id:179, title:"コスレタスと卵のクランチーサラダ", category:"サラダ",
    instructions:"コスレタスとゆで卵にローストした種実を散らす。" },
  { id:180, title:"白菜と卵のレモンスープ", category:"スープ",
    instructions:"白菜を煮てレモンで香り付けし溶き卵でとじる。" },
  { id:181, title:"焼きしいたけと卵の柚子胡椒おかず", category:"おかず",
    instructions:"焼きしいたけに刻み卵をのせ柚子胡椒で風味を付ける。" },
  { id:182, title:"セロリとリンゴと卵のシャキサラダ", category:"サラダ",
    instructions:"セロリ、リンゴ、刻み卵をレモンヨーグルトで和える。" },
  { id:183, title:"おくらと卵の和風スープ", category:"スープ",
    instructions:"おくらをさっと煮て溶き卵でとじ、だし醤油で調える。" },
  { id:184, title:"ツナと卵の和風アレンジおかず", category:"おかず",
    instructions:"ツナ缶と刻み卵をねぎ醤油で和える。" },
  { id:185, title:"カブとりんごと卵の爽やかサラダ", category:"サラダ",
    instructions:"薄切りカブとリンゴ、刻み卵をビネガーで和える。" },
  { id:186, title:"大根おろしと卵のさっぱりスープ", category:"スープ",
    instructions:"大根おろしを入れた温かいだしに溶き卵を加える。" },
  { id:187, title:"茹で卵とこんにゃくのピリ辛炒めおかず", category:"おかず",
    instructions:"こんにゃくと刻み卵をピリ辛だれで炒める。" },
  { id:188, title:"芽キャベツとりんごの卵サラダ", category:"サラダ",
    instructions:"蒸し芽キャベツと薄切りリンゴ、刻み卵を和える。" },
  { id:189, title:"豆と卵のプロヴァンス風スープ", category:"スープ",
    instructions:"白豆と野菜を煮てハーブを加え溶き卵でとじる。" },
  { id:190, title:"豚しゃぶと卵のさっぱりおかず", category:"おかず",
    instructions:"冷やし豚しゃぶに刻み卵を載せポン酢でいただく。" },
  { id:191, title:"ラディッキオと卵の苦みサラダ", category:"サラダ",
    instructions:"ラディッキオとゆで卵をオリーブオイルで和える。" },
  { id:192, title:"洋風ミネストローネに卵を落とすスープ", category:"スープ",
    instructions:"野菜たっぷりのミネストローネを作り卵を落として半熟にする。" },
  { id:193, title:"厚揚げと卵の照り煮おかず", category:"おかず",
    instructions:"厚揚げを煮て刻み卵を加え照りよく仕上げる。" },
  { id:194, title:"春キャベツと卵のピリ辛マリネサラダ", category:"サラダ",
    instructions:"春キャベツと刻み卵をラー油と酢で和える。" },
  { id:195, title:"さつまいもと卵の生姜スープ", category:"スープ",
    instructions:"さつまいもを煮て生姜を加え溶き卵でとじる。" },
  { id:196, title:"鮭缶と卵のバジル和えおかず", category:"おかず",
    instructions:"鮭缶と刻み卵をバジルとオリーブオイルで和える。" },
  { id:197, title:"ビーツとフェタと卵の地中海サラダ", category:"サラダ",
    instructions:"ビーツ、フェタ少量、ゆで卵をオリーブオイルで和える。" },
  { id:198, title:"トウモロコシと卵の中華スープ", category:"スープ",
    instructions:"鶏スープでコーンを煮て溶き卵でとじる。胡椒で調味。" },
  { id:199, title:"きのこミックスと卵の和風ソテーおかず", category:"おかず",
    instructions:"きのこを炒め卵を絡めて薄口醤油で仕上げる。" },
  { id:200, title:"クレソンと柑橘と卵のサラダ", category:"サラダ",
    instructions:"クレソン、柑橘スライス、刻み卵をオリーブオイルで和える。" },
  { id:201, title:"蕪と卵のポタージュ", category:"スープ",
    instructions:"蕪を煮てミキサーし温めて溶き卵で滑らかにする。" },
  { id:202, title:"ほたるいかと卵のさっぱり和えおかず", category:"おかず",
    instructions:"茹でほたるいかと刻み卵をポン酢で和える。" },
  { id:203, title:"赤キャベツと卵の彩りサラダ", category:"サラダ",
    instructions:"薄切り赤キャベツとゆで卵をリンゴ酢で和える。" },
  { id:204, title:"ココナッツと卵の温スープ（エスニック）", category:"スープ",
    instructions:"ココナッツミルクとチキンブロスで煮て卵を落としナンプラーで調味。" },
  { id:205, title:"きのこと卵のハーブオイルおかず", category:"おかず",
    instructions:"きのこをハーブオイルで炒め卵を加えさっと絡める。" },
  { id:206, title:"長ねぎと卵の甘酢サラダ", category:"サラダ",
    instructions:"斜め切り長ねぎと刻み卵を甘酢で和え胡麻を振る。" },  { id:207, title:"蒸し鶏と温泉卵の胡麻だれおかず", category:"おかず",
    instructions:"蒸し鶏に温泉卵をのせ、すりごま・醤油・酢で作った胡麻だれをかける。" },
  { id:208, title:"鯖味噌と卵の和え物おかず", category:"おかず",
    instructions:"鯖の味噌煮をほぐして刻み卵と和え、ねぎを散らす。" },
  { id:209, title:"豆腐と卵のとろみ炒めおかず", category:"おかず",
    instructions:"木綿豆腐を崩して卵と炒め、薄口醤油で調える。" },
  { id:210, title:"鶏ひき肉と卵の和風そぼろおかず", category:"おかず",
    instructions:"低脂肪鶏ひき肉を甘辛く炒り、炒り卵と混ぜる。" },
  { id:211, title:"レンコンと卵の甘辛炒めおかず", category:"おかず",
    instructions:"薄切りレンコンを炒めて溶き卵を絡め、みりんと醤油で味付け。" },
  { id:212, title:"さば缶と卵の生姜醤油おかず", category:"おかず",
    instructions:"さば缶を汁ごと使い刻み卵と生姜醤油で和える。" },
  { id:213, title:"アスパラと卵の柚子胡椒ソテーおかず", category:"おかず",
    instructions:"アスパラを炒め半熟卵を絡め柚子胡椒で風味付けする。" },
  { id:214, title:"厚揚げと卵のあっさり煮おかず", category:"おかず",
    instructions:"厚揚げをだしで煮て崩した卵を加え軽く煮含める。" },
  { id:215, title:"ほうれん草と卵の白和え風おかず", category:"おかず",
    instructions:"茹でほうれん草に豆腐と卵を混ぜた白和えを和える。" },
  { id:216, title:"しめじと卵のぽん酢炒めおかず", category:"おかず",
    instructions:"しめじを炒め卵を加え、仕上げにぽん酢をひと回し。" },
  { id:217, title:"山芋と卵のふんわり焼きおかず", category:"おかず",
    instructions:"すりおろした山芋に卵を混ぜフライパンで焼く。薄く塩で調味。" },
  { id:218, title:"キノコと卵の豆乳クリームおかず", category:"おかず",
    instructions:"きのこをソテーし豆乳と卵で軽く煮てクリーミーに仕上げる。" },
  { id:219, title:"ブロッコリーと卵のにんにくオイルおかず", category:"おかず",
    instructions:"蒸しブロッコリーに炒り卵を加えにんにくオイルで和える。" },
  { id:220, title:"厚切り玉葱と卵のバルサミコおかず", category:"おかず",
    instructions:"厚切り玉葱を焼いて卵を絡めバルサミコで風味付けする。" },
  { id:221, title:"鶏レバーと卵のヘルシー炒めおかず", category:"おかず",
    instructions:"鶏レバーを下処理して炒め卵でとじる。しょうがで臭みを抑える。" },
  { id:222, title:"ゴーヤと卵のさっぱり和えおかず", category:"おかず",
    instructions:"薄切りゴーヤを湯がき刻み卵と醤油少々で和える。" },
  { id:223, title:"パプリカと卵のハーブソテーおかず", category:"おかず",
    instructions:"パプリカをソテーし卵を加えタイムやオレガノで香り付けする。" },
  { id:224, title:"小松菜と卵の生姜炒めおかず", category:"おかず",
    instructions:"小松菜を炒め卵を加え生姜醤油で味を整える。" },
  { id:225, title:"茄子の卵とじピリ辛おかず", category:"おかず",
    instructions:"焼き茄子をほぐし卵でとじて豆板醤少々でアクセントをつける。" },
  { id:226, title:"ホタテ缶と卵のバター風味おかず", category:"おかず",
    instructions:"ホタテ缶を炒め卵で絡めバター風味を少量加える（控えめ）。" },
  { id:227, title:"えのきと卵のシャキシャキおかず", category:"おかず",
    instructions:"えのきをさっと炒め卵で合わせて塩胡椒で仕上げる。" },
  { id:228, title:"牛蒡と卵の和風そぼろおかず", category:"おかず",
    instructions:"細切り牛蒡を炒めて刻み卵と甘辛で煮絡める。" },
  { id:229, title:"白身魚と卵のさっぱり蒸しおかず", category:"おかず",
    instructions:"白身魚に卵液をかけ蒸し器で蒸す。薬味とポン酢でどうぞ。" },
  { id:230, title:"長芋と刻み卵の梅風味おかず", category:"おかず",
    instructions:"短冊切り長芋に刻み卵と梅肉を混ぜ和える。" },
  { id:231, title:"ズッキーニと卵のトマト炒めおかず", category:"おかず",
    instructions:"ズッキーニを炒めて卵を絡めトマトでさっぱり仕上げる。" },
  { id:232, title:"カリフラワーと卵のカレーソテーおかず", category:"おかず",
    instructions:"ローストカリフラワーに卵を加えカレー粉で風味付け。" },
  { id:233, title:"いんげんと卵のごま味噌おかず", category:"おかず",
    instructions:"茹でたいんげんと炒り卵をごま味噌で和える。" },
  { id:234, title:"豆苗と卵のナンプラー和えおかず", category:"おかず",
    instructions:"湯通し豆苗と刻み卵をナンプラーとレモンで和える。" },
  { id:235, title:"筍と卵の香味炒めおかず", category:"おかず",
    instructions:"下茹でした筍を炒め卵でとじてねぎ油で香りづけする。" },
  { id:236, title:"サバ缶トマトと卵のイタリアンおかず", category:"おかず",
    instructions:"サバ缶とトマトで煮て卵を割り入れ半熟に仕上げる。" },
  { id:237, title:"カブと卵の柑橘醤油和えおかず", category:"おかず",
    instructions:"蒸しカブに刻み卵と柑橘醤油でさっぱり和える。" },
  { id:238, title:"里芋と卵の味噌ガーリックおかず", category:"おかず",
    instructions:"里芋を焼いて卵を絡め味噌ガーリックで風味付けする。" },
  { id:239, title:"帆立と卵の和風マリネおかず", category:"おかず",
    instructions:"軽く火を通した帆立と刻み卵を和風マリネ液で和える。" },
  { id:240, title:"ピーマンと卵の中華甘酢おかず", category:"おかず",
    instructions:"ピーマンと卵を炒め甘酢で味を整える。" },
  { id:241, title:"小松菜と厚揚げと卵の煮浸しおかず", category:"おかず",
    instructions:"小松菜と厚揚げをだしで煮て卵を加えさっと煮る。" },
  { id:242, title:"豚バラと卵のしょうが焼き風おかず", category:"おかず",
    instructions:"薄切り豚バラを軽く炒め卵でとじしょうがだれで味付け（肉は控えめ量）。" },
  { id:243, title:"ホウレン草と卵のカシューナッツ和えおかず", category:"おかず",
    instructions:"茹でほうれん草と刻み卵に砕いたカシューナッツを散らす。" },
  { id:244, title:"れんこんもちと卵の和風おかず", category:"おかず",
    instructions:"すりおろしレンコンに卵を加えて焼き、醤油少々で仕上げる。" },
  { id:245, title:"蒸し鯛と卵のポン酢和えおかず", category:"おかず",
    instructions:"蒸した鯛に刻み卵を添えポン酢でさっぱりと和える。" },
  { id:246, title:"カブの葉と卵の柚子和えおかず", category:"おかず",
    instructions:"カブの葉を茹で刻み卵と柚子皮、薄口醤油で和える。" },
  { id:247, title:"エリンギと卵の胡麻オイル炒めおかず", category:"おかず",
    instructions:"エリンギを炒め卵を加えごま油で香り付けする。" },
  { id:248, title:"豆腐ステーキと卵のねぎだれおかず", category:"おかず",
    instructions:"豆腐ステーキに崩した卵をのせ刻みねぎと醤油だれをかける。" },
  { id:249, title:"ヤングコーンと卵のアジアン炒めおかず", category:"おかず",
    instructions:"ヤングコーンを炒め卵を加えナンプラーで味付けする。" },
  { id:250, title:"ささみと卵のゆず胡椒マヨおかず", category:"おかず",
    instructions:"蒸しささみと刻み卵をゆず胡椒マヨで和える（マヨは控えめ）。" },
  { id:251, title:"かぼちゃと卵のハーブローストおかず", category:"おかず",
    instructions:"かぼちゃをローストし卵を加えローズマリーで香り付けする。" },
  { id:252, title:"ごぼうと卵のカリカリ炒めおかず", category:"おかず",
    instructions:"細切りごぼうをカリッと炒め卵で合わせて薄口で味付け。" },
  { id:253, title:"焼きトマトと卵のオリーブ和えおかず", category:"おかず",
    instructions:"焼きトマトに崩した卵を混ぜ刻んだオリーブで風味を足す。" },
  { id:254, title:"しらすと卵の大根おろし和えおかず", category:"おかず",
    instructions:"しらすと刻み卵を大根おろしと和えポン酢で味を整える。" },
  { id:255, title:"れんこんと卵の梅しそ炒めおかず", category:"おかず",
    instructions:"薄切りれんこんを炒め卵を加え梅干しとしそでさっぱり仕上げる。" },
  { id:256, title:"和風きのこと卵のバター醤油おかず", category:"おかず",
    instructions:"きのこをバター少量で炒め卵で絡め醤油で味を整える。" }
];

// DOM要素
const btnToday = document.getElementById("btn-today");
const btnSalad = document.getElementById("btn-salad");
const btnSoup = document.getElementById("btn-soup");
const btnOkazu = document.getElementById("btn-okazu");
const container = document.getElementById("recipe-frame");
const titleEl = document.getElementById("recipe-title");
const instrEl = document.getElementById("recipe-instructions");
const copyBtn = document.getElementById("btn-copy");
const pngBtn = document.getElementById("btn-png");
const shareX = document.getElementById("btn-x");
const shareFB = document.getElementById("btn-fb");
const shareLINE = document.getElementById("btn-line");
const shareMail = document.getElementById("btn-mail");
const relatedLinks = document.getElementById("related-links");
const listArea = document.getElementById("recipe-list");
const backTop = document.getElementById("back-top");
const keywordMeta = document.getElementById("meta-keywords");

// 検索向けキーワード（SEO補助）
const SITE_KEYWORDS = [
  "卵レシピ","ヘルシー卵","卵サラダ","卵スープ","おかず卵","簡単レシピ","低カロリー卵料理"
];
if (keywordMeta) keywordMeta.setAttribute("content", SITE_KEYWORDS.join(", "));

// 状態
let currentList = RECIPES;
let lastShown = null;

// ユーティリティ: 指定配列からランダム要素（前回と重複しない）
function pickRandom(list){
  if(!list || list.length===0) return null;
  if(list.length===1) return list[0];
  let pick;
  let attempts = 0;
  do {
    pick = list[Math.floor(Math.random()*list.length)];
    attempts++;
    if(attempts>20) break;
  } while(lastShown && pick.id === lastShown.id && list.length>1);
  lastShown = pick;
  return pick;
}

// レシピ表示
function renderRecipe(recipe){
  if(!recipe) {
    titleEl.textContent = "レシピが見つかりません";
    instrEl.textContent = "";
    relatedLinks.innerHTML = "";
    updateShareLinks();
    return;
  }
  titleEl.textContent = recipe.title;
  instrEl.textContent = recipe.instructions;
  relatedLinks.innerHTML = `
    <a href="https://www.google.com/search?q=${encodeURIComponent(recipe.title + " レシピ")}" target="_blank" rel="noopener">「${recipe.title}」の作り方をもっと見る</a>
  `;
  container.scrollIntoView({behavior:"smooth", block:"center"});
  updateShareLinks();
}

// カテゴリでフィルタリングしてランダム表示
function showCategory(category){
  const filtered = RECIPES.filter(r => r.category === category);
  currentList = filtered.length ? filtered : RECIPES;
  const recipe = pickRandom(currentList);
  renderRecipe(recipe);
  highlightCategoryButton(category);
}

// 今日の卵ヘルシーレシピ（全体からランダム）
function showToday(){
  currentList = RECIPES;
  const recipe = pickRandom(RECIPES);
  renderRecipe(recipe);
  highlightCategoryButton(null);
}

// カテゴリボタンの強調解除/適用
function highlightCategoryButton(category){
  [btnToday, btnSalad, btnSoup, btnOkazu].forEach(b => { if(b) b.classList.remove("active"); });
  if(!category) { if(btnToday) btnToday.classList.add("active"); return; }
  if(category==="サラダ" && btnSalad) btnSalad.classList.add("active");
  if(category==="スープ" && btnSoup) btnSoup.classList.add("active");
  if(category==="おかず" && btnOkazu) btnOkazu.classList.add("active");
}

// 文章コピー
if (copyBtn) {
  copyBtn.addEventListener("click", async ()=>{
    const text = `${titleEl.textContent}\n\n${instrEl.textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      const original = copyBtn.textContent;
      copyBtn.textContent = "コピー済み";
      setTimeout(()=> copyBtn.textContent = original, 1500);
    } catch(e){
      alert("コピーに失敗しました。ブラウザの許可を確認してください。");
    }
  });
}

// PNG保存: レシピ枠をSVGで作ってCanvasに描画してPNGダウンロード
if (pngBtn) {
  pngBtn.addEventListener("click", ()=>{
    const w = 800;
    const h = 600;
    const padding = 40;
    const title = titleEl.textContent || "";
    const instr = instrEl.textContent || "";
    const svgContent = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
        <rect width='100%' height='100%' fill='#fff8f0'/>
        <rect x='10' y='10' width='${w-20}' height='${h-20}' rx='16' ry='16' fill='#fff'/>
        <text x='${padding}' y='70' font-size='36' font-weight='700' fill='#2b3a55' font-family='sans-serif'>${escapeXml(title)}</text>
        <foreignObject x='${padding}' y='110' width='${w-padding*2}' height='${h-140}'>
          <div xmlns='http://www.w3.org/1999/xhtml' style='font-family: sans-serif; color:#333; font-size:18px; line-height:1.5;'>
            ${escapeHtmlForDiv(instr)}
          </div>
        </foreignObject>
      </svg>
    `;
    const svgBlob = new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img,0,0);
      URL.revokeObjectURL(url);
      c.toBlob(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${sanitizeFilename(title)}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, "image/png");
    };
    img.onerror = ()=> alert("画像作成に失敗しました。");
    img.src = url;
  });
}

// サイト内リスト表示（たくさん表示）
function renderList(){
  if(!listArea) return;
  listArea.innerHTML = "";
  RECIPES.forEach(r => {
    const item = document.createElement("article");
    item.className = "list-item card";
    item.innerHTML = `
      <h4 class="list-title">${r.title}</h4>
      <p class="list-cat">カテゴリ: ${r.category}</p>
      <p class="list-instr">${r.instructions}</p>
      <button class="btn-ghost btn-use" data-id="${r.id}">表示</button>
    `;
    listArea.appendChild(item);
  });
  // イベント: 表示ボタン
  document.querySelectorAll(".btn-use").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = Number(e.currentTarget.dataset.id);
      const r = RECIPES.find(x=>x.id===id);
      if(r){ renderRecipe(r); lastShown = r; }
    });
  });
}

// シェアボタンURL構築
function updateShareLinks(){
  if(!shareX || !shareFB || !shareLINE || !shareMail) return;
  const title = titleEl.textContent || "";
  const text = instrEl.textContent || "";
  const pageUrl = location.href;
  const shareText = `${title}\n${text}`;
  shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
  shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
  shareLINE.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
  shareMail.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + pageUrl)}`;
}

// ヘッダーボタンイベント（「おかず」ボタンは何度押してもランダム表示される）
if (btnToday) btnToday.addEventListener("click", ()=>{ showToday(); });
if (btnSalad) btnSalad.addEventListener("click", ()=>{ showCategory("サラダ"); });
if (btnSoup) btnSoup.addEventListener("click", ()=>{ showCategory("スープ"); });
if (btnOkazu) btnOkazu.addEventListener("click", ()=>{ showCategory("おかず"); });

// ページ生成時の初期処理
document.addEventListener("DOMContentLoaded", ()=>{
  renderList();
  showToday();
  // トップリンク
  if(backTop) backTop.addEventListener("click", (e)=>{
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

// ヘルパー: ファイル名用に安全化
function sanitizeFilename(name){
  return String(name || "recipe").replace(/[\/\\:\*\?"<>\|]/g,"_").slice(0,120);
}

// ヘルパー: XMLエスケープ（SVG内テキスト）
function escapeXml(unsafe){
  return String(unsafe || "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&apos;','"':'&quot;'}[c]));
}

// ヘルパー: HTMLとして外部表示用に簡易整形（改行対応）
function escapeHtmlForDiv(text){
  const esc = escapeXml(text);
  const html = esc.replace(/\n/g, "<br/>");
  return `<div style="white-space: pre-wrap;">${html}</div>`;
}