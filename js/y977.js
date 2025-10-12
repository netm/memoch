// y977.js - シンプル単一ページ四字熟語ジェネレーター + 検索 + あいうえお一覧
// データはここに直接書く（外部ファイルを使わない要望に合わせる）
const YOJI = [
{word:"安穏無事", yomi:"あんのんぶじ", mean:"落ち着いて平穏無事であること", tags:["安心"], kanaHead:"あ"},
{word:"暗中模索", yomi:"あんちゅうもさく", mean:"手掛かりがない中であれこれ試みること", tags:["困惑"], kanaHead:"あ"},
{word:"安寧秩序", yomi:"あんねいちつじょ", mean:"平和で秩序が保たれている状態", tags:["安心"], kanaHead:"あ"},
{word:"意気衝天", yomi:"いきしょうてん", mean:"気力や勢いが非常に盛んであること", tags:["喜"], kanaHead:"い"},
{word:"意気投合", yomi:"いきとうごう", mean:"考えや気持ちがぴったり合うこと", tags:["喜"], kanaHead:"い"},
{word:"一意専心", yomi:"いちいせんしん", mean:"一つのことに心を集中すること", tags:["喜"], kanaHead:"い"},
{word:"一期一会", yomi:"いちごいちえ", mean:"一生に一度の出会いを大切にする心", tags:["感動"], kanaHead:"い"},
{word:"一心不乱", yomi:"いっしんふらん", mean:"ひとつのことに心を乱さず打ち込むこと", tags:["喜"], kanaHead:"い"},
{word:"一朝一夕", yomi:"いっちょういっせき", mean:"短い時間ですぐには成し得ないこと", tags:["困惑"], kanaHead:"い"},
{word:"因果応報", yomi:"いんがおうほう", mean:"行いの善悪に応じて報いがあること", tags:["情"], kanaHead:"い"},
{word:"有名無実", yomi:"ゆうめいむじつ", mean:"名ばかりで実態が伴わないこと", tags:["不満"], kanaHead:"ゆ"},
{word:"有頂天外", yomi:"うちょうてんがい", mean:"非常に喜んで浮かれているさま", tags:["喜"], kanaHead:"う"},
{word:"雨過晴光", yomi:"うかせいこう", mean:"苦難の後に平穏や好転が訪れること", tags:["安心"], kanaHead:"う"},
{word:"運否天賦", yomi:"うんぷてんぷ", mean:"運の良し悪しは天に任せること", tags:["不安"], kanaHead:"う"},
{word:"得意満面", yomi:"とくいまんめん", mean:"得意そうな顔つきで満足しているさま", tags:["満足"], kanaHead:"と"},
{word:"永劫回帰", yomi:"えいごうかいき", mean:"事象が永遠に繰り返されるという考え", tags:["情"], kanaHead:"え"},
{word:"栄枯盛衰", yomi:"えいこせいすい", mean:"栄えることと衰えることの交替を表す", tags:["哀"], kanaHead:"え"},
{word:"揚眉吐氣", yomi:"ようびとき", mean:"喜びのあまり顔を上げて息をつくこと", tags:["喜"], kanaHead:"よ"},
{word:"恩讐分明", yomi:"おんしゅうぶんめい", mean:"恩義と恨みをはっきり区別すること", tags:["不満"], kanaHead:"お"},
{word:"温厚篤実", yomi:"おんこうとくじつ", mean:"性格が温かく誠実であること", tags:["安心"], kanaHead:"お"},
{word:"王道楽土", yomi:"おうどうらくど", mean:"理想の統治と安らかな土地を指す", tags:["安心"], kanaHead:"お"},
{word:"応答迅速", yomi:"おうとうじんそく", mean:"返事や対応が非常に速いこと", tags:["満足"], kanaHead:"お"},
{word:"往生際悪", yomi:"おうじょうぎわわる", mean:"諦めが悪く最後まで抵抗する態度", tags:["不満"], kanaHead:"お"},
{word:"温故知新", yomi:"おんこちしん", mean:"古い事を学んで新しい知識を得ること", tags:["喜"], kanaHead:"お"},
{word:"恩慈厚労", yomi:"おんじこうろう", mean:"人に対して慈しみ深く労わること", tags:["情"], kanaHead:"お"},
{word:"快刀乱麻", yomi:"かいとうらんま", mean:"複雑な問題を手際よく解決すること", tags:["満足"], kanaHead:"か"},
{word:"海千山千", yomi:"うみせんやません", mean:"経験豊かでずる賢いこと", tags:["不満"], kanaHead:"う"},
{word:"臥薪嘗胆", yomi:"がしんしょうたん", mean:"復讐や成功のため苦労を重ねること", tags:["不満"], kanaHead:"が"},
{word:"華々盛大", yomi:"かががかくさいだい", mean:"大げさで華やかなさま", tags:["喜"], kanaHead:"か"},
{word:"機略瑣末", yomi:"きりゃくさまつ", mean:"小さな策略や細かい点にこだわること", tags:["不満"], kanaHead:"き"},
{word:"起死回生", yomi:"きしかいせい", mean:"絶望的な状況から立ち直らせること", tags:["喜"], kanaHead:"き"},
{word:"危機一髪", yomi:"ききいっぱつ", mean:"きわめて危険な瞬間", tags:["不安"], kanaHead:"き"},
{word:"金科玉条", yomi:"きんかぎょくじょう", mean:"絶対的に守るべき規則や教え", tags:["安心"], kanaHead:"き"},
{word:"気宇壮大", yomi:"きうそうだい", mean:"気持ちや志が大きく立派なこと", tags:["喜"], kanaHead:"き"},
{word:"九死一生", yomi:"きゅうしいっしょう", mean:"ほとんど死にかけて助かること", tags:["不安"], kanaHead:"き"},
{word:"苦心惨憺", yomi:"くしんさんたん", mean:"非常に苦労し悩むこと", tags:["困惑"], kanaHead:"く"},
{word:"空前絶後", yomi:"くうぜんぜつご", mean:"これまでになくこれからもあり得ないほど稀なこと", tags:["感動"], kanaHead:"く"},
{word:"九鉄一毛", yomi:"くてついちもう", mean:"わずかなものの中に重要なものが含まれるたとえ", tags:["感動"], kanaHead:"く"},
{word:"公明正大", yomi:"こうめいせいだい", mean:"公平で立派であること", tags:["安心"], kanaHead:"こ"},
{word:"功成名遂", yomi:"こうせいめいすい", mean:"功績を上げ名声を得ること", tags:["満足"], kanaHead:"こ"},
{word:"克己奉公", yomi:"こっきほうこう", mean:"自分を律して公のために尽くすこと", tags:["情"], kanaHead:"こ"},
{word:"孤軍奮闘", yomi:"こぐんふんとう", mean:"単独で懸命に戦うこと", tags:["喜"], kanaHead:"こ"},
{word:"故郷懐古", yomi:"こきょうかいこ", mean:"故郷を懐かしく思い出すこと", tags:["哀"], kanaHead:"こ"},
{word:"公私混同", yomi:"こうしこんどう", mean:"公的なことと私的なことを区別しないこと", tags:["不満"], kanaHead:"こ"},
{word:"郊外閑静", yomi:"こうがいかんせい", mean:"郊外で静かで落ち着いていること", tags:["安心"], kanaHead:"こ"},
{word:"高論卓説", yomi:"こうろんたくせつ", mean:"優れた議論や立派な説明", tags:["感動"], kanaHead:"こ"},
{word:"孤立無援", yomi:"こりつむえん", mean:"助けがなく孤立していること", tags:["哀","不安"], kanaHead:"こ"},
{word:"功利主義", yomi:"こうりしゅぎ", mean:"利益や効用を重視する考え方", tags:["情"], kanaHead:"こ"},
{word:"刻苦勉励", yomi:"こっくべんれい", mean:"苦労しながら熱心に励むこと", tags:["喜"], kanaHead:"こ"},
{word:"根源深遠", yomi:"こんげんしんえん", mean:"物事の根本が深く奥が深いこと", tags:["感動"], kanaHead:"こ"},
{word:"作戦行動", yomi:"さくせんこうどう", mean:"計画に基づいて行う具体的な行動", tags:["喜"], kanaHead:"さ"},
{word:"災害復旧", yomi:"さいがいふっきゅう", mean:"災害を被った場所や機能を元に戻すこと", tags:["不安"], kanaHead:"さ"},
{word:"左右対称", yomi:"さゆうたいしょう", mean:"左右が同じ形で均衡していること", tags:["安心"], kanaHead:"さ"},
{word:"四面楚歌", yomi:"しめんそか", mean:"周囲が敵ばかりで孤立無援であること", tags:["不安"], kanaHead:"し"},
{word:"至誠一貫", yomi:"しせいいっかん", mean:"誠意を最後まで貫くこと", tags:["安心"], kanaHead:"し"},
{word:"至言至理", yomi:"しげんしり", mean:"非常に正しく奥深い言葉や道理", tags:["感動"], kanaHead:"し"},
{word:"至難至急", yomi:"しなんしきゅう", mean:"非常に困難でなおかつ急を要すること", tags:["不安"], kanaHead:"し"},
{word:"質実剛健", yomi:"しつじつごうけん", mean:"飾り気がなく堅実で強健なこと", tags:["安心"], kanaHead:"し"},
{word:"順風満帆", yomi:"じゅんぷうまんぱん", mean:"物事が順調で何の障害もないこと", tags:["満足"], kanaHead:"じ"},
{word:"透明無垢", yomi:"とうめいむく", mean:"清らかで汚れがないこと", tags:["感動"], kanaHead:"と"},
{word:"刷新革新", yomi:"さっしんかくしん", mean:"古いものを改め新しくすること", tags:["情"], kanaHead:"さ"},
{word:"才色兼備", yomi:"さいしょくけんび", mean:"才能と美しさを兼ね備えていること", tags:["感動"], kanaHead:"さ"},
{word:"三日天下", yomi:"みっかてんか", mean:"短期間で終わる栄華や地位", tags:["哀"], kanaHead:"み"},
{word:"四苦八苦", yomi:"しくはっく", mean:"非常に苦労して困ること", tags:["困惑"], kanaHead:"し"},
{word:"切磋琢磨", yomi:"せっさたくま", mean:"互いに励まし合って学問や技芸を磨くこと", tags:["喜"], kanaHead:"せ"},
{word:"正真正銘", yomi:"しょうしんしょうめい", mean:"本物で偽りがないこと", tags:["安心"], kanaHead:"し"},
{word:"双璧双璧", yomi:"そうへきそうへき", mean:"同等に優れた二者を重ねて称える語", tags:["感動"], kanaHead:"そ"},
{word:"曽祖父母", yomi:"そうそふぼ", mean:"曾おじいさんや曾おばあさんを指す語", tags:["情"], kanaHead:"そ"},
{word:"率先垂範", yomi:"そっせんすいはん", mean:"人の先に立って模範を示すこと", tags:["喜"], kanaHead:"そ"},
{word:"創意工夫", yomi:"そういくふう", mean:"独自の考えで新しい方法を考え出すこと", tags:["喜"], kanaHead:"そ"},
{word:"袖中之珠", yomi:"しゅちゅうのたま", mean:"人が持っている大切な才能や宝物のたとえ", tags:["感動"], kanaHead:"し"},
{word:"素志雄心", yomi:"そしゆうしん", mean:"純粋な志と勇ましい心を持つこと", tags:["喜"], kanaHead:"そ"},
{word:"姿勢正明", yomi:"しせいせいめい", mean:"態度や姿勢がはっきりしていること", tags:["安心"], kanaHead:"し"},
{word:"十人十色", yomi:"じゅうにんといろ", mean:"人の好みや考えはそれぞれ違うこと", tags:["感動"], kanaHead:"じ"},
{word:"自業自得", yomi:"じごうじとく", mean:"自分の行いの報いを受けること", tags:["不満"], kanaHead:"じ"},
{word:"心機一転", yomi:"しんきいってん", mean:"気持ちや態度を一新すること", tags:["喜"], kanaHead:"し"},
{word:"深謀遠慮", yomi:"しんぼうえんりょ", mean:"深く先を見越した計画や考え", tags:["情"], kanaHead:"し"},
{word:"笑止千万", yomi:"しょうしせんばん", mean:"大いに笑うべきであること（皮肉）", tags:["不満"], kanaHead:"し"},
{word:"蒼天已死", yomi:"そうてんいし", mean:"物事の終わりを表す古い言い回し", tags:["哀"], kanaHead:"そ"},
{word:"塞翁失馬", yomi:"さいおうしつば", mean:"不幸が幸福になることもあるたとえ", tags:["幸"], kanaHead:"さ"},
{word:"千差万別", yomi:"せんさばんべつ", mean:"非常に多くの違いがあること", tags:["感動"], kanaHead:"せ"},
{word:"前人未踏", yomi:"ぜんじんみとう", mean:"誰も踏み入れたことのない領域", tags:["感動"], kanaHead:"ぜ"},
{word:"大器晩成", yomi:"たいきばんせい", mean:"大人物は成熟するのに時間がかかること", tags:["喜"], kanaHead:"た"},
{word:"泰然自若", yomi:"たいぜんじじゃく", mean:"落ち着いていて動じないさま", tags:["安心"], kanaHead:"た"},
{word:"対症療法", yomi:"たいしょうりょうほう", mean:"表面的な症状に応じた処置をすること", tags:["安心"], kanaHead:"た"},
{word:"大同小異", yomi:"だいどうしょうい", mean:"細かい違いはあるが大筋は同じであること", tags:["安心"], kanaHead:"だ"},
{word:"短長所本", yomi:"たんちょうしょほん", mean:"長所と短所を含めて評価すること", tags:["情"], kanaHead:"た"},
{word:"忠言逆耳", yomi:"ちゅうげんぎゃくじ", mean:"正しい忠告は聞きにくいことがあるということ", tags:["不満"], kanaHead:"ち"},
{word:"千載一遇", yomi:"せんざいいちぐう", mean:"非常にめったにない良い機会", tags:["幸"], kanaHead:"せ"},
{word:"地道努力", yomi:"じみちどりょく", mean:"派手さはないが着実な努力を続けること", tags:["喜"], kanaHead:"じ"},
{word:"知行合一", yomi:"ちこうごういつ", mean:"知識と行動は一体であるという考え", tags:["情"], kanaHead:"ち"},
{word:"致命傷的", yomi:"ちめいしょうてき", mean:"致命的な打撃や損害を与えるさま", tags:["怖"], kanaHead:"ち"},
{word:"痛痒痒々", yomi:"つうようようよう", mean:"痛みやかゆみに悩まされるさま（比喩的）", tags:["困惑"], kanaHead:"つ"},
{word:"通暁精通", yomi:"つうぎょうせいつう", mean:"よく知り、熟知していること", tags:["感動"], kanaHead:"つ"},
{word:"追風満帆", yomi:"ついふうまんぱん", mean:"順調に事が進むたとえ", tags:["満足"], kanaHead:"つ"},
{word:"積小為大", yomi:"せきしょういだい", mean:"小さなことを積み重ねて大きな成果を成すこと", tags:["喜"], kanaHead:"せ"},
{word:"川流不息", yomi:"せんりゅうふそく", mean:"物事が途切れずに続くことのたとえ", tags:["感動"], kanaHead:"せ"},
{word:"天真爛漫", yomi:"てんしんらんまん", mean:"飾り気がなく純粋で明るいさま", tags:["喜"], kanaHead:"て"},
{word:"天衣無縫", yomi:"てんいむほう", mean:"自然で飾り気のないこと、または欠点がないこと", tags:["感動"], kanaHead:"て"},
{word:"転禍為福", yomi:"てんかいふく", mean:"災いを転じて福とすること", tags:["幸"], kanaHead:"て"},
{word:"電光石火", yomi:"でんこうせっか", mean:"行動や反応が非常に素早いこと", tags:["喜"], kanaHead:"で"},
{word:"東奔西走", yomi:"とうほんせいそう", mean:"あちこち忙しく走り回ること", tags:["不安"], kanaHead:"と"},
{word:"度胸天下", yomi:"どきょうてんか", mean:"大胆で物怖じしない度胸のあるさま", tags:["満足"], kanaHead:"ど"},
{word:"多岐亡羊", yomi:"たきぼうよう", mean:"道が多くて迷うこと", tags:["困惑"], kanaHead:"た"},
{word:"南船北馬", yomi:"なんせんほくば", mean:"各地を旅して回ること（特に政務や視察など）", tags:["情"], kanaHead:"な"},
{word:"南柯一夢", yomi:"なんかいちむ", mean:"はかない夢や栄華のこと（栄華が一度の夢のようである意）", tags:["哀"], kanaHead:"な"},
{word:"南郭北里", yomi:"なんかくほくり", mean:"各地に広く友人や門弟を持つことのたとえ", tags:["喜"], kanaHead:"な"},
{word:"難攻不落", yomi:"なんこうふらく", mean:"攻めにくく落としにくいこと、非常に堅固なさま", tags:["安心"], kanaHead:"な"},
{word:"難解難読", yomi:"なんかいなんどく", mean:"理解や読解が非常に困難であるさま", tags:["困惑"], kanaHead:"な"},
{word:"二者択一", yomi:"にしゃたくいつ", mean:"二つのうちから一つを選ばなければならないこと", tags:["困惑"], kanaHead:"に"},
{word:"二束三文", yomi:"にそくさんもん", mean:"非常に安い値段のたとえ", tags:["不満"], kanaHead:"に"},
{word:"二律背反", yomi:"にりつはいはん", mean:"二つの原理や命題が互いに矛盾すること", tags:["困惑"], kanaHead:"に"},
{word:"入木三分", yomi:"にゅうぼくさんぶ", mean:"文章や彫刻などが鋭く深く迫ることのたとえ", tags:["感動"], kanaHead:"に"},
{word:"忍耐強固", yomi:"にんたいきょうこ", mean:"我慢強く耐える性質が非常に堅固であること", tags:["満足"], kanaHead:"に"},
{word:"抜本改革", yomi:"ばっぽんかいかく", mean:"根本から改めることによる大規模な改革", tags:["情"], kanaHead:"ば"},
{word:"熱烈歓迎", yomi:"ねつれつかんげい", mean:"非常に熱心に歓迎すること", tags:["喜"], kanaHead:"ね"},
{word:"能者多助", yomi:"のうしゃたじょ", mean:"能力ある者の周りには助ける者が多いということ", tags:["喜"], kanaHead:"の"},
{word:"那辺之論", yomi:"なへんのろん", mean:"論点がはっきりしないことのたとえ", tags:["困惑"], kanaHead:"な"},
{word:"七転八起", yomi:"しちてんはっき", mean:"何度失敗しても何度でも立ち上がること", tags:["感動"], kanaHead:"し"},
{word:"人心一新", yomi:"じんしんいっしん", mean:"人々の心がすっかり改まること", tags:["喜"], kanaHead:"じ"},
{word:"忍俊不禁", yomi:"にんしゅんふきん", mean:"思わず笑いを抑えられないこと", tags:["喜"], kanaHead:"に"},
{word:"温厚篤実", yomi:"ぬくもりとくじつ", mean:"親切で誠実な人柄を表す語（意訳）", tags:["安心"], kanaHead:"ぬ"},
{word:"年功序列", yomi:"ねんこうじょれつ", mean:"年齢や勤続年数を基準に序列を決めること", tags:["情"], kanaHead:"ね"},
{word:"野戦病院", yomi:"やせんびょういん", mean:"戦場付近に設けられる臨時の病院", tags:["不安"], kanaHead:"や"},
{word:"野狐禅師", yomi:"やこぜんし", mean:"教えが本質を外れている人を揶揄する語", tags:["不満"], kanaHead:"や"},
{word:"能率向上", yomi:"のうりつこうじょう", mean:"作業や仕事の効率を高めること", tags:["満足"], kanaHead:"の"},
{word:"破顔一笑", yomi:"はがんいっしょう", mean:"顔をほころばせてにっこり笑うこと", tags:["喜"], kanaHead:"は"},
{word:"八方美人", yomi:"はっぽうびじん", mean:"誰に対しても愛想よく振る舞う人のこと", tags:["不満"], kanaHead:"は"},
{word:"波瀾万丈", yomi:"はらんばんじょう", mean:"波乱に富んで変化が多いこと", tags:["感動"], kanaHead:"は"},
{word:"半信半疑", yomi:"はんしんはんぎ", mean:"半分信じて半分疑うこと", tags:["不安"], kanaHead:"は"},
{word:"博愛博識", yomi:"はくあいはくしき", mean:"人を広く愛し知識が豊富であること", tags:["感動"], kanaHead:"は"},
{word:"百発百中", yomi:"ひゃっぱつひゃくちゅう", mean:"試みることが全て成功することのたとえ", tags:["満足"], kanaHead:"ひ"},
{word:"悲喜交々", yomi:"ひきこもごも", mean:"喜びと悲しみが入り混じること", tags:["情"], kanaHead:"ひ"},
{word:"悲壮激烈", yomi:"ひそうげきれつ", mean:"悲しく激しく感情が高まるさま", tags:["哀"], kanaHead:"ひ"},
{word:"不屈不撓", yomi:"ふくつふとう", mean:"困難にくじけず屈しないこと", tags:["喜"], kanaHead:"ふ"},
{word:"不言実行", yomi:"ふげんじっこう", mean:"口に出さず行動で示すこと", tags:["喜"], kanaHead:"ふ"},
{word:"不偏不党", yomi:"ふへんふとう", mean:"どちらにも偏らず公平であること", tags:["安心"], kanaHead:"ふ"},
{word:"風光明媚", yomi:"ふうこうめいび", mean:"自然の景色が美しく風光に富んでいること", tags:["感動"], kanaHead:"ふ"},
{word:"平穏無事", yomi:"へいおんぶじ", mean:"落ち着いて平穏で何事もないこと", tags:["安心"], kanaHead:"へ"},
{word:"平明洒脱", yomi:"へいめいしゃだつ", mean:"明快で飾り気がなく気さくなこと", tags:["感動"], kanaHead:"へ"},
{word:"本末転倒", yomi:"ほんまつてんとう", mean:"重要なことと些細なことが逆になっていること", tags:["不満"], kanaHead:"ほ"},
{word:"放言高論", yomi:"ほうげんこうろん", mean:"気軽に意見を言い立てることや立派な論を述べること", tags:["情"], kanaHead:"ほ"},
{word:"鳳凰来儀", yomi:"ほうおうらいぎ", mean:"非常にめでたいことが起こるたとえ", tags:["幸"], kanaHead:"ほ"},
{word:"馬耳東風", yomi:"ばじとうふう", mean:"人の意見や忠告を全く気にしないことのたとえ", tags:["不満"], kanaHead:"ば"},
{word:"満身創痍", yomi:"まんしんそうい", mean:"全身に傷や損傷を負うこと、苦労が多いこと", tags:["哀"], kanaHead:"ま"},
{word:"万物流転", yomi:"ばんぶつるてん", mean:"この世のすべてのものは移り変わること", tags:["情"], kanaHead:"ば"},
{word:"満場一致", yomi:"まんじょういっち", mean:"集まった人々の意見が全員一致すること", tags:["満足"], kanaHead:"ま"},
{word:"麻姑掻痒", yomi:"まこそうよう", mean:"物事がつい気になって落ち着かないことのたとえ", tags:["不安"], kanaHead:"ま"},
{word:"魔浪忽来", yomi:"まろうこつらい", mean:"思いがけない災いが起こることのたとえ", tags:["怖"], kanaHead:"ま"},
{word:"末梢神経", yomi:"まっしょうしんけい", mean:"中心から外れた細かな部分や感覚のたとえ", tags:["感動"], kanaHead:"ま"},
{word:"磨斧作針", yomi:"まふさくしん", mean:"大きな努力で不可能を可能にすることのたとえ", tags:["喜"], kanaHead:"ま"},
{word:"万古不易", yomi:"ばんこふえき", mean:"いつまでも変わらず普遍であること", tags:["感動"], kanaHead:"ば"},
{word:"万象更新", yomi:"ばんしょうこうしん", mean:"すべての事物が新たに生まれ変わること", tags:["感動"], kanaHead:"ば"},
{word:"満悦至極", yomi:"まんえつしごく", mean:"この上なく満足していること", tags:["満足"], kanaHead:"ま"},
{word:"万般工夫", yomi:"まんぱんくふう", mean:"あらゆる方法を工夫して試みること", tags:["喜"], kanaHead:"ま"},
{word:"夜郎自大", yomi:"やろうじだい", mean:"自分の力量を過大に評価して驕ること", tags:["不満"], kanaHead:"や"},
{word:"野心勃勃", yomi:"やしんぼつぼつ", mean:"大きな野望や企てを強く抱いているさま", tags:["喜"], kanaHead:"や"},
{word:"悠々自適", yomi:"ゆうゆうじてき", mean:"気ままにゆったりと生活すること", tags:["満足"], kanaHead:"ゆ"},
{word:"勇猛果敢", yomi:"ゆうもうかかん", mean:"勇ましく猛々しく、決断や行動が大胆であること", tags:["喜"], kanaHead:"ゆ"},
{word:"有為転変", yomi:"ういてんぺん", mean:"世の中のすべての事象が移り変わること", tags:["情"], kanaHead:"う"},
{word:"用意周到", yomi:"よういしゅうとう", mean:"準備が細部にわたって整っていること", tags:["安心"], kanaHead:"よ"},
{word:"羊頭狗肉", yomi:"ようとうくにく", mean:"看板と中身が一致しないことのたとえ", tags:["不満"], kanaHead:"よ"},
{word:"陽光普照", yomi:"ようこうふしょう", mean:"太陽の光が広く照らすことから、恩恵や幸福が行き渡る意", tags:["幸"], kanaHead:"よ"},
{word:"優勝劣敗", yomi:"ゆうしょうれっぱい", mean:"優れた者が勝ち、劣った者が負けること", tags:["不満"], kanaHead:"ゆ"},
{word:"和光同塵", yomi:"わこうどうじん", mean:"清らかな光を出しつつ世俗に同じ振る舞いをすること", tags:["情"], kanaHead:"わ"},
{word:"和魂洋才", yomi:"わこんようさい", mean:"日本の精神を保ちつつ西洋の学問や技術を取り入れること", tags:["感動"], kanaHead:"わ"},
{word:"倭寇不羈", yomi:"わこうふき", mean:"束縛されず自由奔放に振る舞うたとえ", tags:["喜"], kanaHead:"わ"},
{word:"和而不同", yomi:"わじふどう", mean:"和を重んじつつも同一化はしないこと", tags:["情"], kanaHead:"わ"},
{word:"輪廻転生", yomi:"りんねてんしょう", mean:"生と死を繰り返すという考え", tags:["情"], kanaHead:"り"},
{word:"忘恩負義", yomi:"ぼうおんふぎ", mean:"恩を忘れ礼を失すること", tags:["不満"], kanaHead:"ぼ"},
{word:"和顔愛語", yomi:"わがんあいご", mean:"穏やかな顔つきと優しい言葉で接すること", tags:["安心"], kanaHead:"わ"},
{word:"和衷協同", yomi:"わちゅうきょうどう", mean:"心を一つにして協力すること", tags:["喜"], kanaHead:"わ"},
{word:"和敬清寂", yomi:"わけいせいじゃく", mean:"茶道の精神で和み、敬い、清め、静まることを重んじる意", tags:["安心"], kanaHead:"わ"},
{word:"笑裏藏刀", yomi:"しょうりぞうとう", mean:"笑顔の裏に悪意や策を隠すことのたとえ", tags:["不満"], kanaHead:"し"},
{word:"唯我独尊", yomi:"ゆいがどくそん", mean:"自分だけが優れていると誇るさま", tags:["不満"], kanaHead:"ゆ"},
{word:"百発百中", yomi:"ひゃっぱつひゃくちゅう", mean:"すべて成功すること", tags:["満足"], kanaHead:"ひゃ"},
{word:"風林火山", yomi:"ふうりんかざん", mean:"戦術や態度の譬え（迅速さ・静穏さ等）", tags:["感動"], kanaHead:"ふ"},
{word:"臨機応変", yomi:"りんきおうへん", mean:"状況に応じて適切に対処すること", tags:["情"], kanaHead:"り"},
{word:"流言飛語", yomi:"りゅうげんひご", mean:"根拠のないうわさが飛び交うこと", tags:["不安"], kanaHead:"り"},
{word:"竜頭蛇尾", yomi:"りゅうとうだび", mean:"始めは勢いがあるが終わりが伴わないこと", tags:["不満"], kanaHead:"り"},
{word:"臨死覚醒", yomi:"りんしかくせい", mean:"危機的体験で目覚めること", tags:["感動"], kanaHead:"り"},
{word:"和洋折衷", yomi:"わようせっちゅう", mean:"日本風と西洋風を取り合わせること", tags:["感動"], kanaHead:"わ"},
{word:"緩急自在", yomi:"かんきゅうじざい", mean:"物事の強弱を自在に調整できること", tags:["満足"], kanaHead:"か"},
{word:"確固不抜", yomi:"かっこふばつ", mean:"しっかりしていて動じないこと", tags:["安心"], kanaHead:"か"},
{word:"恩讐暗鬼", yomi:"おんしゅうあんき", mean:"恨みや復讐にかられる心", tags:["不安"], kanaHead:"お"},
{word:"竜馬精神", yomi:"りょうませんしん", mean:"独立心と行動力に富む精神", tags:["感動"], kanaHead:"り"},
{word:"意味深長", yomi:"いみしんちょう", mean:"表面以上の深い意味を含んでいること", tags:["感動"], kanaHead:"い"},
{word:"優柔不断", yomi:"ゆうじゅうふだん", mean:"決断が鈍く迷いやすい性質", tags:["不安"], kanaHead:"ゆ"},
{word:"一網打尽", yomi:"いちもうだじん", mean:"一度に全て捕らえることのたとえ", tags:["満足"], kanaHead:"い"},
{word:"起承転結", yomi:"きしょうてんけつ", mean:"物事や文章の構成上の四段階", tags:["感動"], kanaHead:"き"},
{word:"自暴自棄", yomi:"じぼうじき", mean:"失望して投げやりになること", tags:["哀"], kanaHead:"じ"},
{word:"以心伝心", yomi:"いしんでんしん", mean:"言葉にせずとも心が通じること", tags:["情"], kanaHead:"い"},
{word:"三顧之礼", yomi:"さんこのれい", mean:"相手を厚くもてなすために何度も訪れる礼", tags:["感動"], kanaHead:"さ"},
{word:"千客万来", yomi:"せんきゃくばんらい", mean:"多くの客が次々とやってくること", tags:["喜"], kanaHead:"せ"},
{word:"百花繚乱", yomi:"ひゃっかりょうらん", mean:"さまざまな優れたものが一斉に現れるさま", tags:["感動"], kanaHead:"ひ"},
{word:"矛盾撞着", yomi:"むじゅんどうちゃく", mean:"論理や言動が互いに矛盾していること", tags:["困惑"], kanaHead:"む"},
{word:"疑心暗鬼", yomi:"ぎしんあんき", mean:"疑いの心から根拠のない恐れや不安が生じること", tags:["不安"], kanaHead:"ぎ"},
{word:"晴耕雨読", yomi:"せいこううどく", mean:"天候に応じて田を耕し読書して過ごす悠々自適な生活", tags:["満足"], kanaHead:"せ"},
{word:"曲学阿世", yomi:"きょくがくあせ", mean:"真理を曲げ権力や世間に迎合すること", tags:["不満"], kanaHead:"き"},
{word:"因循姑息", yomi:"いんじゅんこそく", mean:"古いやり方に固執し、場当たり的に誤魔化す態度", tags:["不満"], kanaHead:"い"},
{word:"雲散霧消", yomi:"うんさんむしょう", mean:"雲や霧が消え去るように跡形もなく消えること", tags:["感動"], kanaHead:"う"},
{word:"興味津々", yomi:"きょうみしんしん", mean:"非常に興味を引かれているさま", tags:["喜"], kanaHead:"き"},
{word:"脱兎之勢", yomi:"だったつのいきおい", mean:"脱兎の如く走り去るほどの素早い勢い", tags:["喜"], kanaHead:"だ"},
{word:"一石二鳥", yomi:"いっせきにちょう", mean:"一つの行為で二つの利益を得ること", tags:["満足"], kanaHead:"い"},
{word:"千変万化", yomi:"せんぺんばんか", mean:"変化が非常に多く様々に変わること", tags:["感動"], kanaHead:"せ"}
];

// DOM 要素取得
const listEl = document.getElementById('list');
const qEl = document.getElementById('q');
const statsEl = document.getElementById('stats');
const genBtn = document.getElementById('genButton');
const emotionEl = document.getElementById('emotion');
const generatedEl = document.getElementById('generated');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const kanaBtns = document.querySelectorAll('.kana-btn');

// 初期レンダリング：あいうえお順（yomiの先頭ひらがなでソート）
function kanaKey(item){
  // 先頭ひらがな（ひらがなで始まらない場合は yomi[0] を使う）
  return (item.yomi || item.word).charAt(0);
}
YOJI.sort((a,b)=>{
  const A = kanaOrderString(a.yomi||a.word);
  const B = kanaOrderString(b.yomi||b.word);
  return A.localeCompare(B,'ja');
});

// 五十音のカテゴリを作る（先頭1文字のかなを簡易判定）
function groupByKana(list){
  const map = {};
  list.forEach(it=>{
    const k = (it.yomi||it.word).charAt(0);
    const head = normalizeKanaHead(k);
    if(!map[head]) map[head]=[];
    map[head].push(it);
  });
  return map;
}
const grouped = groupByKana(YOJI);

// HTMLカードを作る
function cardHTML(item){
  const id = 'word-' + encodeURIComponent(item.word);
  const tags = (item.tags || []).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join(' ');
  return `<article id="${id}" class="card" tabindex="0" aria-labelledby="${id}-h">
    <h3 id="${id}-h">${escapeHtml(item.word)}</h3>
    <div class="yomi">${escapeHtml(item.yomi || '')}</div>
    <p>${escapeHtml(item.mean || '')}</p>
    <div class="tags">${tags}</div>
  </article>`;
}

// 全リストをレンダー（あいうえお順でセクション化）
function renderAll(){
  listEl.innerHTML = '';
  const order = ['あ','か','さ','た','な','は','ま','や','ら','わ'];
  order.forEach(sectionKey=>{
    const arr = grouped[sectionKey] || [];
    if(arr.length === 0) return;
    const sec = document.createElement('section');
    sec.className = 'section-block';
    sec.innerHTML = `<h2 class="sr-only">頭文字 ${sectionKey}</h2>`;
    const frag = document.createElement('div');
    frag.className = 'section-grid';
    frag.innerHTML = arr.map(cardHTML).join('');
    sec.appendChild(frag);
    listEl.appendChild(sec);
  });
}
renderAll();

// 検索ロジック
function normalizeQuery(s){ return (s||'').trim().toLowerCase(); }
function matches(item, q){
  if(!q) return true;
  const qn = q.replace(/\s+/g,'');
  // 漢字/読み/意味/タグ をすべて小文字化して部分一致
  const hay = (item.word + ' ' + item.yomi + ' ' + (item.mean||'') + ' ' + (item.tags||[]).join(' ')).toLowerCase();
  if(hay.indexOf(qn) !== -1) return true;
  // ひらがなでの一致（ユーザーがかなで入れた場合）
  const hira = toHiragana(qn);
  if(hay.indexOf(hira) !== -1) return true;
  return false;
}

// インクリメンタル検索（簡易デバウンス）
let debounceTimer = null;
qEl.addEventListener('input', ()=>{
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applySearch, 160);
});

function applySearch(){
  const q = normalizeQuery(qEl.value);
  if(!q){
    statsEl.textContent = '';
    renderAll();
    return;
  }
  const results = YOJI.filter(it=>matches(it,q));
  statsEl.textContent = `${results.length} 件ヒット`;
  listEl.innerHTML = results.map(it=>{
    // ハイライト処理（クエリを含む部分を <span class="highlight"> で囲む）
    let mean = escapeHtml(it.mean||'');
    const qraw = qEl.value.trim();
    if(qraw){
      const esc = escapeRegExp(qraw);
      const re = new RegExp(esc,'ig');
      mean = mean.replace(re, m => `<span class="highlight">${m}</span>`);
    }
    const id = 'word-' + encodeURIComponent(it.word);
    const tags = (it.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join(' ');
    return `<article id="${id}" class="card" tabindex="0" aria-labelledby="${id}-h">
      <h3 id="${id}-h">${escapeHtml(it.word)}</h3>
      <div class="yomi">${escapeHtml(it.yomi || '')}</div>
      <p>${mean}</p>
      <div class="tags">${tags}</div>
    </article>`;
  }).join('');
  // フラグメント付きリンクが必要な場合はここで更新可能
}

// ジェネレーター
genBtn.addEventListener('click', ()=>{
  const emotion = emotionEl.value;
  const candidates = emotion ? YOJI.filter(it=>(it.tags||[]).includes(emotion)) : YOJI;
  const pick = candidates[Math.floor(Math.random()*candidates.length)];
  if(!pick) return;
  generatedEl.innerHTML = `${pick.word} <span class="yomi">${pick.yomi}</span> — ${pick.mean}`;
  // ハッシュを更新して共有しやすくする（クエリ文字列にする）
  history.replaceState(null,'', '?word=' + encodeURIComponent(pick.word));
});

// コピー
copyBtn.addEventListener('click', async ()=>{
  const txt = generatedEl.textContent || '';
  try{
    await navigator.clipboard.writeText(txt);
    copyBtn.textContent = 'コピー済み';
    setTimeout(()=>copyBtn.textContent='コピー',1200);
  }catch(e){ copyBtn.textContent='コピー失敗'; setTimeout(()=>copyBtn.textContent='コピー',1200); }
});

// 共有ボタン（簡易）
shareBtn.addEventListener('click', ()=>{
  const cur = new URL(location.href);
  if(location.search) cur.search = location.search;
  const u = cur.toString();
  if(navigator.share){
    navigator.share({title:document.title, text: generatedEl.textContent || '', url:u}).catch(()=>{ prompt('共有リンク', u); });
  }else{
    prompt('共有リンク（コピーして貼る）', u);
  }
});

// 五十音ボタンでフィルタ
kanaBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const k = btn.dataset.kana;
    if(!k){ renderAll(); return; }
    const arr = grouped[k] || [];
    listEl.innerHTML = arr.map(cardHTML).join('') || `<p class="muted">該当する熟語はありません。</p>`;
    statsEl.textContent = `${arr.length} 件（頭文字 ${k}）`;
  });
});

// ページ読み込み時に ?word=漢字 の場合はそのカードを表示してスクロール
function openFromQuery(){
  const params = new URLSearchParams(location.search);
  const w = params.get('word');
  if(!w) return;
  // 検索ワードを表示してリストをフィルタ
  qEl.value = w;
  applySearch();
  // 少し待ってからスクロール
  setTimeout(()=>{
    const el = document.getElementById('word-' + encodeURIComponent(w));
    if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
  },200);
}
openFromQuery();

// ヘルパー関数
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

// かな変換（簡易）: ローマ字は不要。ここでは英数字混入時にひらがな化を試みる（限定的）
function toHiragana(s){
  // 主要なカタカナをひらがなに変換する簡易処理
  return s.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

// kana 規格化（先頭一文字→あいうえおグループ）
function normalizeKanaHead(ch){
  if(!ch) return '';
  const h = ch.charAt(0);
  // カタカナをひらがなへ
  const hira = (h >= 'ァ' && h <= 'ン') ? String.fromCharCode(h.charCodeAt(0)-0x60) : h;
  const map = {
    'あ':'あ','い':'あ','う':'あ','え':'あ','お':'あ',
    'か':'か','き':'か','く':'か','け':'か','こ':'か',
    'が':'か','ぎ':'か','ぐ':'か','げ':'か','ご':'か',
    'さ':'さ','し':'さ','す':'さ','せ':'さ','そ':'さ',
    'た':'た','ち':'た','つ':'た','て':'た','と':'た',
    'な':'な','に':'な','ぬ':'な','ね':'な','の':'な',
    'は':'は','ひ':'は','ふ':'は','へ':'は','ほ':'は',
    'ま':'ま','み':'ま','む':'ま','め':'ま','も':'ま',
    'や':'や','ゆ':'や','よ':'や',
    'ら':'ら','り':'ら','る':'ら','れ':'ら','ろ':'ら',
    'わ':'わ','を':'わ','ん':'わ'
  };
  return map[hira] || 'あ';
}

// カナ順ソート補助（厳密ではないが localeCompare で日本語順に寄せる）
function kanaOrderString(s){ return (s||'').replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\w]/g,''); }

// 初回小ヒントを生成
generatedEl.textContent = '「生成」ボタンで四字熟語を提案します';

// サイトの操作性向上のため、エンターで検索実行
qEl.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){ e.preventDefault(); applySearch(); }
});

// 初期アクセシビリティフォーカス
document.addEventListener('DOMContentLoaded', ()=>{ qEl.focus(); });