/* app.js
   一人暮らし 1週間献立メーカー（単一ファイル完結データ）
   - DATA: recipes, week_templates, budget_bands を含む（更新不要設計）
   - 主な機能: 予算選択・時短フィルタ・1人分スケール・買い物リスト生成・印刷・JSONダウンロード
*/

const DATA = {
  meta: { version: "1.0", currency: "JPY" },
  recipes: [
  {"id":"r001","title":"鶏そぼろ丼","servings_base":1,"cost_per_serving":220,"time_minutes":20,"tags":["主菜","時短","作り置き"],"preserve_days":3,"ingredients":[{"name":"鶏ひき肉","qty":150,"unit":"g","category":"肉"},{"name":"玉ねぎ","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":15,"unit":"ml","category":"調味料"},{"name":"砂糖","qty":8,"unit":"g","category":"調味料"}],"seo_slug":"torisoboro-don"},
  {"id":"r002","title":"納豆卵かけご飯","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"納豆","qty":1,"unit":"パック","category":"発酵食品"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"natto-tkg"},
  {"id":"r003","title":"ツナとキャベツのパスタ","servings_base":1,"cost_per_serving":260,"time_minutes":25,"tags":["主菜","時短","洋風"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"キャベツ","qty":80,"unit":"g","category":"野菜"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"tuna-cabbage-pasta"},
  {"id":"r004","title":"鮭の塩焼き","servings_base":1,"cost_per_serving":300,"time_minutes":15,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"鮭切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"塩","qty":2,"unit":"g","category":"調味料"}],"seo_slug":"sake-shioyaki"},
  {"id":"r005","title":"ほうれん草のおひたし","servings_base":1,"cost_per_serving":80,"time_minutes":10,"tags":["副菜","和食","時短"],"preserve_days":2,"ingredients":[{"name":"ほうれん草","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"},{"name":"かつお節","qty":1,"unit":"g","category":"乾物"}],"seo_slug":"ohitashi"},
  {"id":"r006","title":"味噌汁（豆腐とわかめ）","servings_base":1,"cost_per_serving":60,"time_minutes":10,"tags":["汁物","和食","時短"],"preserve_days":1,"ingredients":[{"name":"出汁","qty":200,"unit":"ml","category":"調味料"},{"name":"豆腐","qty":50,"unit":"g","category":"豆腐"},{"name":"乾燥わかめ","qty":2,"unit":"g","category":"乾物"},{"name":"味噌","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"miso-soup"},
  {"id":"r007","title":"鶏の照り焼き","servings_base":1,"cost_per_serving":250,"time_minutes":25,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"鶏もも肉","qty":150,"unit":"g","category":"肉"},{"name":"醤油","qty":20,"unit":"ml","category":"調味料"},{"name":"みりん","qty":10,"unit":"ml","category":"調味料"},{"name":"砂糖","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"torinoteriyaki"},
  {"id":"r008","title":"麻婆豆腐（時短）","servings_base":1,"cost_per_serving":250,"time_minutes":20,"tags":["主菜","時短","中華"],"preserve_days":2,"ingredients":[{"name":"木綿豆腐","qty":200,"unit":"g","category":"豆腐"},{"name":"豚ひき肉","qty":80,"unit":"g","category":"肉"},{"name":"麻婆の素","qty":20,"unit":"g","category":"調味料"},{"name":"片栗粉","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"mabo-tofu"},
  {"id":"r009","title":"じゃがいもとベーコンのソテー","servings_base":1,"cost_per_serving":160,"time_minutes":20,"tags":["副菜","洋風","時短"],"preserve_days":2,"ingredients":[{"name":"じゃがいも","qty":150,"unit":"g","category":"野菜"},{"name":"ベーコン","qty":30,"unit":"g","category":"肉"},{"name":"塩","qty":2,"unit":"g","category":"調味料"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"potato-bacon"},
  {"id":"r010","title":"鯖の味噌煮（缶詰活用）","servings_base":1,"cost_per_serving":200,"time_minutes":15,"tags":["主菜","缶詰","時短"],"preserve_days":3,"ingredients":[{"name":"鯖味噌缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"生姜","qty":5,"unit":"g","category":"野菜"}],"seo_slug":"saba-misoni"},
  {"id":"r011","title":"親子丼","servings_base":1,"cost_per_serving":280,"time_minutes":20,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"鶏もも肉","qty":100,"unit":"g","category":"肉"},{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"玉ねぎ","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":15,"unit":"ml","category":"調味料"}],"seo_slug":"oyakodon"},
  {"id":"r012","title":"冷やしトマトとツナのサラダ","servings_base":1,"cost_per_serving":140,"time_minutes":5,"tags":["副菜","時短","洋風"],"preserve_days":1,"ingredients":[{"name":"トマト","qty":100,"unit":"g","category":"野菜"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"塩","qty":1,"unit":"g","category":"調味料"},{"name":"オリーブオイル","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"tomato-tuna-salad"},
  {"id":"r013","title":"オムレツ（野菜入り）","servings_base":1,"cost_per_serving":180,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"玉ねぎ","qty":30,"unit":"g","category":"野菜"},{"name":"ピーマン","qty":20,"unit":"g","category":"野菜"},{"name":"牛乳","qty":10,"unit":"ml","category":"乳製品"}],"seo_slug":"veg-omelette"},
  {"id":"r014","title":"豆腐ステーキ","servings_base":1,"cost_per_serving":150,"time_minutes":15,"tags":["主菜","時短","ヘルシー"],"preserve_days":1,"ingredients":[{"name":"木綿豆腐","qty":200,"unit":"g","category":"豆腐"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"},{"name":"ごま油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"tofu-steak"},
  {"id":"r015","title":"鮭フレークおにぎり","servings_base":1,"cost_per_serving":120,"time_minutes":10,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"鮭フレーク","qty":15,"unit":"g","category":"加工品"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"のり","qty":1,"unit":"枚","category":"乾物"}],"seo_slug":"salmon-onigiri"},
  {"id":"r016","title":"きんぴらごぼう（常備菜）","servings_base":1,"cost_per_serving":90,"time_minutes":20,"tags":["副菜","作り置き","和食"],"preserve_days":5,"ingredients":[{"name":"ごぼう","qty":80,"unit":"g","category":"野菜"},{"name":"人参","qty":40,"unit":"g","category":"野菜"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"},{"name":"みりん","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"kinpira-gobou"},
  {"id":"r017","title":"ツナマヨトースト","servings_base":1,"cost_per_serving":130,"time_minutes":8,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"食パン","qty":1,"unit":"枚","category":"主食"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"マヨネーズ","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"tuna-toast"},
  {"id":"r018","title":"野菜炒め（豚肉入り）","servings_base":1,"cost_per_serving":240,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":2,"ingredients":[{"name":"豚こま切れ","qty":100,"unit":"g","category":"肉"},{"name":"キャベツ","qty":80,"unit":"g","category":"野菜"},{"name":"もやし","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"stirfry-pork-veg"},
  {"id":"r019","title":"カレー（レトルト＋野菜）","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":2,"ingredients":[{"name":"レトルトカレー","qty":1,"unit":"袋","category":"加工品"},{"name":"玉ねぎ","qty":50,"unit":"g","category":"野菜"},{"name":"人参","qty":40,"unit":"g","category":"野菜"}],"seo_slug":"retort-curry"},
  {"id":"r020","title":"冷やし中華風サラダ","servings_base":1,"cost_per_serving":200,"time_minutes":10,"tags":["主菜","時短","中華"],"preserve_days":1,"ingredients":[{"name":"中華麺","qty":100,"unit":"g","category":"主食"},{"name":"きゅうり","qty":50,"unit":"g","category":"野菜"},{"name":"ハム","qty":30,"unit":"g","category":"肉"},{"name":"中華ドレッシング","qty":15,"unit":"ml","category":"調味料"}],"seo_slug":"hiyashi-chuka-salad"},
  {"id":"r021","title":"ツナご飯（炊き込み）","servings_base":1,"cost_per_serving":180,"time_minutes":30,"tags":["主食","作り置き"],"preserve_days":2,"ingredients":[{"name":"米","qty":180,"unit":"g","category":"主食"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"tuna-rice"},
  {"id":"r022","title":"ベーコンエッグ","servings_base":1,"cost_per_serving":150,"time_minutes":10,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"ベーコン","qty":40,"unit":"g","category":"肉"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"塩","qty":1,"unit":"g","category":"調味料"}],"seo_slug":"bacon-egg"},
  {"id":"r023","title":"納豆パスタ（和風）","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"納豆","qty":1,"unit":"パック","category":"発酵食品"},{"name":"刻み海苔","qty":1,"unit":"g","category":"乾物"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"natto-pasta"},
  {"id":"r024","title":"じゃこおろし冷奴","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["副菜","時短","和食"],"preserve_days":1,"ingredients":[{"name":"木綿豆腐","qty":150,"unit":"g","category":"豆腐"},{"name":"大根おろし","qty":50,"unit":"g","category":"野菜"},{"name":"じゃこ","qty":10,"unit":"g","category":"乾物"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"jako-hiyayakko"},
  {"id":"r025","title":"オートミールおじや","servings_base":1,"cost_per_serving":140,"time_minutes":10,"tags":["主食","時短","ヘルシー"],"preserve_days":1,"ingredients":[{"name":"オートミール","qty":40,"unit":"g","category":"穀物"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"出汁","qty":200,"unit":"ml","category":"調味料"}],"seo_slug":"oat-porridge"},
  {"id":"r026","title":"鮭とブロッコリーの蒸し物","servings_base":1,"cost_per_serving":320,"time_minutes":20,"tags":["主菜","ヘルシー"],"preserve_days":2,"ingredients":[{"name":"鮭切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"ブロッコリー","qty":80,"unit":"g","category":"野菜"},{"name":"塩","qty":2,"unit":"g","category":"調味料"}],"seo_slug":"salmon-broccoli-steam"},
  {"id":"r027","title":"豚の生姜焼き","servings_base":1,"cost_per_serving":280,"time_minutes":20,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"豚ロース薄切り","qty":120,"unit":"g","category":"肉"},{"name":"生姜","qty":5,"unit":"g","category":"野菜"},{"name":"醤油","qty":15,"unit":"ml","category":"調味料"}],"seo_slug":"buta-shogayaki"},
  {"id":"r028","title":"揚げ出し豆腐（簡易）","servings_base":1,"cost_per_serving":200,"time_minutes":20,"tags":["副菜","和食"],"preserve_days":1,"ingredients":[{"name":"木綿豆腐","qty":150,"unit":"g","category":"豆腐"},{"name":"片栗粉","qty":10,"unit":"g","category":"調味料"},{"name":"めんつゆ","qty":20,"unit":"ml","category":"調味料"}],"seo_slug":"agedashi-tofu"},
  {"id":"r029","title":"ミニハンバーグ","servings_base":1,"cost_per_serving":320,"time_minutes":30,"tags":["主菜","洋風"],"preserve_days":2,"ingredients":[{"name":"合いびき肉","qty":120,"unit":"g","category":"肉"},{"name":"パン粉","qty":10,"unit":"g","category":"調味料"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"玉ねぎ","qty":30,"unit":"g","category":"野菜"}],"seo_slug":"mini-hamburg"},
  {"id":"r030","title":"トマト卵炒め（中華）","servings_base":1,"cost_per_serving":180,"time_minutes":12,"tags":["主菜","時短","中華"],"preserve_days":1,"ingredients":[{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"トマト","qty":100,"unit":"g","category":"野菜"},{"name":"塩","qty":2,"unit":"g","category":"調味料"},{"name":"砂糖","qty":3,"unit":"g","category":"調味料"}],"seo_slug":"tomato-egg-stir"},
  {"id":"r031","title":"ツナサンドイッチ","servings_base":1,"cost_per_serving":200,"time_minutes":10,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"食パン","qty":2,"unit":"枚","category":"主食"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"マヨネーズ","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"tuna-sandwich"},
  {"id":"r032","title":"きのこピラフ（簡易）","servings_base":1,"cost_per_serving":240,"time_minutes":30,"tags":["主食","洋風","作り置き"],"preserve_days":2,"ingredients":[{"name":"米","qty":180,"unit":"g","category":"主食"},{"name":"きのこミックス","qty":80,"unit":"g","category":"野菜"},{"name":"コンソメ","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"mushroom-pilaf"},
  {"id":"r033","title":"しらす冷奴","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"絹ごし豆腐","qty":150,"unit":"g","category":"豆腐"},{"name":"しらす","qty":15,"unit":"g","category":"乾物"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"shirasu-hiyayakko"},
  {"id":"r034","title":"さば缶と大根の煮物","servings_base":1,"cost_per_serving":180,"time_minutes":20,"tags":["主菜","缶詰","作り置き"],"preserve_days":3,"ingredients":[{"name":"鯖水煮缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"大根","qty":100,"unit":"g","category":"野菜"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"saba-radish-simmer"},
  {"id":"r035","title":"鶏むね肉の塩麹焼き","servings_base":1,"cost_per_serving":220,"time_minutes":25,"tags":["主菜","ヘルシー"],"preserve_days":2,"ingredients":[{"name":"鶏むね肉","qty":150,"unit":"g","category":"肉"},{"name":"塩麹","qty":15,"unit":"g","category":"調味料"},{"name":"塩","qty":1,"unit":"g","category":"調味料"}],"seo_slug":"salt-koji-chicken"},
  {"id":"r036","title":"豆とひじきのサラダ","servings_base":1,"cost_per_serving":160,"time_minutes":10,"tags":["副菜","作り置き","ヘルシー"],"preserve_days":3,"ingredients":[{"name":"ミックスビーンズ","qty":80,"unit":"g","category":"豆類"},{"name":"乾燥ひじき","qty":5,"unit":"g","category":"乾物"},{"name":"酢","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"beans-hijiki-salad"},
  {"id":"r037","title":"ホットサンド（チーズ＆ハム）","servings_base":1,"cost_per_serving":240,"time_minutes":10,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"食パン","qty":2,"unit":"枚","category":"主食"},{"name":"ハム","qty":30,"unit":"g","category":"肉"},{"name":"スライスチーズ","qty":1,"unit":"枚","category":"乳製品"}],"seo_slug":"hot-sandwich"},
  {"id":"r038","title":"中華風卵スープ","servings_base":1,"cost_per_serving":120,"time_minutes":10,"tags":["汁物","時短","中華"],"preserve_days":1,"ingredients":[{"name":"鶏がらスープ","qty":250,"unit":"ml","category":"調味料"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"万能ねぎ","qty":5,"unit":"g","category":"野菜"}],"seo_slug":"chinese-egg-soup"},
  {"id":"r039","title":"鮭チャーハン（簡易）","servings_base":1,"cost_per_serving":260,"time_minutes":15,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"鮭フレーク","qty":15,"unit":"g","category":"加工品"},{"name":"卵","qty":1,"unit":"個","category":"卵"}],"seo_slug":"salmon-fried-rice"},
  {"id":"r040","title":"お好み焼き（簡易）","servings_base":1,"cost_per_serving":300,"time_minutes":30,"tags":["主菜","粉物"],"preserve_days":1,"ingredients":[{"name":"お好み焼き粉","qty":80,"unit":"g","category":"加工品"},{"name":"キャベツ","qty":100,"unit":"g","category":"野菜"},{"name":"豚バラ","qty":50,"unit":"g","category":"肉"},{"name":"ソース","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"okonomiyaki-simple"},
  {"id":"r041","title":"冷製パスタ（オリーブ＆トマト）","servings_base":1,"cost_per_serving":260,"time_minutes":20,"tags":["主菜","洋風","時短"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"ミニトマト","qty":80,"unit":"g","category":"野菜"},{"name":"オリーブ","qty":10,"unit":"g","category":"加工品"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"cold-pasta-tomato"},
  {"id":"r042","title":"鶏つくね（焼き）","servings_base":1,"cost_per_serving":260,"time_minutes":25,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"鶏ひき肉","qty":150,"unit":"g","category":"肉"},{"name":"パン粉","qty":10,"unit":"g","category":"調味料"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"chicken-tsukune"},
  {"id":"r043","title":"焼きそば（簡易）","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"焼きそば麺","qty":1,"unit":"玉","category":"主食"},{"name":"キャベツ","qty":80,"unit":"g","category":"野菜"},{"name":"ソース","qty":15,"unit":"g","category":"調味料"}],"seo_slug":"yakisoba-simple"},
  {"id":"r044","title":"ポテトサラダ（簡易）","servings_base":1,"cost_per_serving":150,"time_minutes":20,"tags":["副菜","作り置き"],"preserve_days":3,"ingredients":[{"name":"じゃがいも","qty":150,"unit":"g","category":"野菜"},{"name":"人参","qty":30,"unit":"g","category":"野菜"},{"name":"マヨネーズ","qty":20,"unit":"g","category":"調味料"}],"seo_slug":"potato-salad"},
  {"id":"r045","title":"きのこのバターソテー","servings_base":1,"cost_per_serving":160,"time_minutes":10,"tags":["副菜","時短","洋風"],"preserve_days":1,"ingredients":[{"name":"きのこミックス","qty":100,"unit":"g","category":"野菜"},{"name":"バター","qty":10,"unit":"g","category":"乳製品"},{"name":"塩","qty":1,"unit":"g","category":"調味料"}],"seo_slug":"mushroom-butter"},
  {"id":"r046","title":"照り焼きサバ丼（缶詰活用）","servings_base":1,"cost_per_serving":200,"time_minutes":10,"tags":["主菜","缶詰","時短"],"preserve_days":2,"ingredients":[{"name":"鯖味噌缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"青ねぎ","qty":5,"unit":"g","category":"野菜"}],"seo_slug":"saba-don"},
  {"id":"r047","title":"ミニサラダ（レタスとコーン）","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"レタス","qty":50,"unit":"g","category":"野菜"},{"name":"コーン缶","qty":30,"unit":"g","category":"缶詰"},{"name":"ドレッシング","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"mini-salad"},
  {"id":"r048","title":"チャーシュー丼（簡易）","servings_base":1,"cost_per_serving":320,"time_minutes":30,"tags":["主菜","作り置き"],"preserve_days":3,"ingredients":[{"name":"チャーシュー既製品","qty":80,"unit":"g","category":"加工品"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"刻みねぎ","qty":5,"unit":"g","category":"野菜"}],"seo_slug":"char-siu-don"},
  {"id":"r049","title":"和風ツナ大根サラダ","servings_base":1,"cost_per_serving":140,"time_minutes":8,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"大根","qty":80,"unit":"g","category":"野菜"},{"name":"ポン酢","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"tuna-daikon-salad"},
  {"id":"r050","title":"目玉焼きのせご飯（シンプル）","servings_base":1,"cost_per_serving":100,"time_minutes":7,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"fried-egg-rice"},
  {"id":"r051","title":"豆腐とツナのサラダ","servings_base":1,"cost_per_serving":150,"time_minutes":8,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"木綿豆腐","qty":150,"unit":"g","category":"豆腐"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"ポン酢","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"tofu-tuna-salad"},
  {"id":"r052","title":"キャベツと卵の中華炒め","servings_base":1,"cost_per_serving":140,"time_minutes":12,"tags":["主菜","時短","中華"],"preserve_days":1,"ingredients":[{"name":"キャベツ","qty":100,"unit":"g","category":"野菜"},{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"塩","qty":1,"unit":"g","category":"調味料"},{"name":"ごま油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"cabbage-egg-stir"},
  {"id":"r053","title":"簡単ガーリックライス","servings_base":1,"cost_per_serving":180,"time_minutes":15,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"にんにく","qty":3,"unit":"g","category":"野菜"},{"name":"バター","qty":10,"unit":"g","category":"乳製品"}],"seo_slug":"garlic-rice"},
  {"id":"r054","title":"トマトスープとパン","servings_base":1,"cost_per_serving":220,"time_minutes":20,"tags":["主菜","洋風"],"preserve_days":2,"ingredients":[{"name":"トマト缶","qty":200,"unit":"g","category":"缶詰"},{"name":"玉ねぎ","qty":50,"unit":"g","category":"野菜"},{"name":"パン","qty":1,"unit":"枚","category":"主食"},{"name":"コンソメ","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"tomato-soup-bread"},
  {"id":"r055","title":"ピーマンの肉詰め（簡易）","servings_base":1,"cost_per_serving":260,"time_minutes":25,"tags":["主菜","和洋折衷"],"preserve_days":2,"ingredients":[{"name":"ピーマン","qty":2,"unit":"個","category":"野菜"},{"name":"合いびき肉","qty":100,"unit":"g","category":"肉"},{"name":"パン粉","qty":10,"unit":"g","category":"調味料"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"stuffed-pepper-simple"},
  {"id":"r056","title":"おろしポン酢の鶏肉ソテー","servings_base":1,"cost_per_serving":240,"time_minutes":20,"tags":["主菜","和風"],"preserve_days":2,"ingredients":[{"name":"鶏むね肉","qty":150,"unit":"g","category":"肉"},{"name":"大根おろし","qty":50,"unit":"g","category":"野菜"},{"name":"ポン酢","qty":15,"unit":"ml","category":"調味料"}],"seo_slug":"grilled-chicken-oroshi"},
  {"id":"r057","title":"簡単ラタトゥイユ","servings_base":1,"cost_per_serving":200,"time_minutes":35,"tags":["副菜","作り置き","洋風"],"preserve_days":3,"ingredients":[{"name":"ナス","qty":80,"unit":"g","category":"野菜"},{"name":"ズッキーニ","qty":80,"unit":"g","category":"野菜"},{"name":"トマト缶","qty":200,"unit":"g","category":"缶詰"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"ratatouille-simple"},
  {"id":"r058","title":"ツナチャーハン","servings_base":1,"cost_per_serving":200,"time_minutes":12,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"tuna-fried-rice"},
  {"id":"r059","title":"簡単カルボナーラ（クリーム少なめ）","servings_base":1,"cost_per_serving":320,"time_minutes":20,"tags":["主菜","洋風"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"ベーコン","qty":40,"unit":"g","category":"肉"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"粉チーズ","qty":10,"unit":"g","category":"乳製品"}],"seo_slug":"simple-carbonara"},
  {"id":"r060","title":"サバ缶のマリネ","servings_base":1,"cost_per_serving":160,"time_minutes":10,"tags":["副菜","缶詰","作り置き"],"preserve_days":3,"ingredients":[{"name":"鯖水煮缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"玉ねぎ","qty":30,"unit":"g","category":"野菜"},{"name":"酢","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"saba-marine"},
  {"id":"r061","title":"コーンスープ（缶＋牛乳）","servings_base":1,"cost_per_serving":140,"time_minutes":8,"tags":["汁物","時短"],"preserve_days":1,"ingredients":[{"name":"コーン缶","qty":100,"unit":"g","category":"缶詰"},{"name":"牛乳","qty":150,"unit":"ml","category":"乳製品"},{"name":"コンソメ","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"corn-soup"},
  {"id":"r062","title":"照り焼きチキン丼","servings_base":1,"cost_per_serving":260,"time_minutes":20,"tags":["主菜","時短"],"preserve_days":2,"ingredients":[{"name":"鶏もも肉","qty":150,"unit":"g","category":"肉"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"醤油","qty":15,"unit":"ml","category":"調味料"},{"name":"みりん","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"teriyaki-chicken-don"},
  {"id":"r063","title":"豚汁（簡易）","servings_base":1,"cost_per_serving":200,"time_minutes":30,"tags":["汁物","作り置き","和食"],"preserve_days":3,"ingredients":[{"name":"豚こま切れ","qty":50,"unit":"g","category":"肉"},{"name":"大根","qty":50,"unit":"g","category":"野菜"},{"name":"人参","qty":30,"unit":"g","category":"野菜"},{"name":"味噌","qty":12,"unit":"g","category":"調味料"}],"seo_slug":"tonjiru-simple"},
  {"id":"r064","title":"焼き魚定食風（塩サバ）","servings_base":1,"cost_per_serving":280,"time_minutes":15,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"塩サバ切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"味噌汁","qty":1,"unit":"椀","category":"汁物"}],"seo_slug":"grilled-mackerel-set"},
  {"id":"r065","title":"ガパオ風鶏そぼろ丼（簡易）","servings_base":1,"cost_per_serving":260,"time_minutes":20,"tags":["主菜","時短","エスニック"],"preserve_days":1,"ingredients":[{"name":"鶏ひき肉","qty":150,"unit":"g","category":"肉"},{"name":"バジル","qty":5,"unit":"g","category":"野菜"},{"name":"ナンプラー","qty":10,"unit":"ml","category":"調味料"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"}],"seo_slug":"gapao-style"},
  {"id":"r066","title":"冷凍餃子とサラダ","servings_base":1,"cost_per_serving":240,"time_minutes":12,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"冷凍餃子","qty":6,"unit":"個","category":"冷凍食品"},{"name":"レタス","qty":50,"unit":"g","category":"野菜"},{"name":"酢","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"frozen-gyoza-salad"},
  {"id":"r067","title":"鶏むね肉のバジルソテー","servings_base":1,"cost_per_serving":240,"time_minutes":20,"tags":["主菜","洋風","ヘルシー"],"preserve_days":2,"ingredients":[{"name":"鶏むね肉","qty":150,"unit":"g","category":"肉"},{"name":"バジル","qty":5,"unit":"g","category":"野菜"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"basil-chicken"},
  {"id":"r068","title":"野菜たっぷりオムライス（簡易）","servings_base":1,"cost_per_serving":300,"time_minutes":25,"tags":["主菜","洋風"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":180,"unit":"g","category":"主食"},{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"玉ねぎ","qty":40,"unit":"g","category":"野菜"},{"name":"ケチャップ","qty":20,"unit":"g","category":"調味料"}],"seo_slug":"veggie-omelette-rice"},
  {"id":"r069","title":"簡単ビビンバ風丼","servings_base":1,"cost_per_serving":280,"time_minutes":20,"tags":["主菜","時短","韓国風"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"牛ひき肉","qty":80,"unit":"g","category":"肉"},{"name":"ほうれん草","qty":50,"unit":"g","category":"野菜"},{"name":"コチュジャン","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"simple-bibimbap"},
  {"id":"r070","title":"和風きのこパスタ","servings_base":1,"cost_per_serving":260,"time_minutes":20,"tags":["主菜","和風","洋風"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"きのこミックス","qty":80,"unit":"g","category":"野菜"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"},{"name":"バター","qty":10,"unit":"g","category":"乳製品"}],"seo_slug":"japanese-mushroom-pasta"},
  {"id":"r071","title":"鮭のホイル焼き（簡易）","servings_base":1,"cost_per_serving":320,"time_minutes":20,"tags":["主菜","洋風","ヘルシー"],"preserve_days":2,"ingredients":[{"name":"鮭切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"玉ねぎ","qty":30,"unit":"g","category":"野菜"},{"name":"バター","qty":5,"unit":"g","category":"乳製品"}],"seo_slug":"salmon-foil"},
  {"id":"r072","title":"ひじき煮（常備菜）","servings_base":1,"cost_per_serving":100,"time_minutes":25,"tags":["副菜","作り置き","和食"],"preserve_days":5,"ingredients":[{"name":"乾燥ひじき","qty":10,"unit":"g","category":"乾物"},{"name":"人参","qty":30,"unit":"g","category":"野菜"},{"name":"油揚げ","qty":20,"unit":"g","category":"加工品"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"hijiki-ni"},
  {"id":"r073","title":"エビとブロッコリーの炒め物","servings_base":1,"cost_per_serving":360,"time_minutes":20,"tags":["主菜","洋中"],"preserve_days":1,"ingredients":[{"name":"冷凍エビ","qty":80,"unit":"g","category":"魚介"},{"name":"ブロッコリー","qty":80,"unit":"g","category":"野菜"},{"name":"塩","qty":1,"unit":"g","category":"調味料"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"shrimp-broccoli-stir"},
  {"id":"r074","title":"卵とじうどん（簡易）","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主食","時短","和食"],"preserve_days":1,"ingredients":[{"name":"冷凍うどん","qty":1,"unit":"玉","category":"主食"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"出汁","qty":300,"unit":"ml","category":"調味料"}],"seo_slug":"egg-udon"},
  {"id":"r075","title":"ナポリタン（簡易）","servings_base":1,"cost_per_serving":300,"time_minutes":25,"tags":["主菜","洋風"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"玉ねぎ","qty":40,"unit":"g","category":"野菜"},{"name":"ウインナー","qty":40,"unit":"g","category":"肉"},{"name":"ケチャップ","qty":30,"unit":"g","category":"調味料"}],"seo_slug":"napolitan-simple"},
  {"id":"r076","title":"かぼちゃの煮物（簡易）","servings_base":1,"cost_per_serving":120,"time_minutes":25,"tags":["副菜","作り置き","和食"],"preserve_days":3,"ingredients":[{"name":"かぼちゃ","qty":150,"unit":"g","category":"野菜"},{"name":"砂糖","qty":10,"unit":"g","category":"調味料"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"pumpkin-simmer"},
  {"id":"r077","title":"豚キムチ炒め","servings_base":1,"cost_per_serving":260,"time_minutes":12,"tags":["主菜","時短","韓国風"],"preserve_days":1,"ingredients":[{"name":"豚こま切れ","qty":100,"unit":"g","category":"肉"},{"name":"キムチ","qty":50,"unit":"g","category":"漬物"},{"name":"ごま油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"pork-kimchi-stir"},
  {"id":"r078","title":"オクラと納豆の和え物","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["副菜","時短","ヘルシー"],"preserve_days":1,"ingredients":[{"name":"オクラ","qty":50,"unit":"g","category":"野菜"},{"name":"納豆","qty":1,"unit":"パック","category":"発酵食品"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"okra-natto"},
  {"id":"r079","title":"サバの塩焼き定食（簡易）","servings_base":1,"cost_per_serving":260,"time_minutes":15,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"鯖切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"味噌汁","qty":1,"unit":"椀","category":"汁物"}],"seo_slug":"saba-set"},
  {"id":"r080","title":"トマトと卵の中華スープ","servings_base":1,"cost_per_serving":140,"time_minutes":10,"tags":["汁物","時短","中華"],"preserve_days":1,"ingredients":[{"name":"トマト","qty":80,"unit":"g","category":"野菜"},{"name":"卵","qty":1,"unit":"個","category":"卵"},{"name":"鶏がらスープ","qty":250,"unit":"ml","category":"調味料"}],"seo_slug":"tomato-egg-soup"},
  {"id":"r081","title":"焼き鮭と大根おろし","servings_base":1,"cost_per_serving":320,"time_minutes":15,"tags":["主菜","和食"],"preserve_days":2,"ingredients":[{"name":"鮭切り身","qty":1,"unit":"切れ","category":"魚"},{"name":"大根おろし","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"grilled-salmon-oroshi"},
  {"id":"r082","title":"簡単チーズリゾット","servings_base":1,"cost_per_serving":260,"time_minutes":25,"tags":["主食","洋風"],"preserve_days":1,"ingredients":[{"name":"米","qty":120,"unit":"g","category":"主食"},{"name":"チーズ","qty":20,"unit":"g","category":"乳製品"},{"name":"コンソメ","qty":5,"unit":"g","category":"調味料"}],"seo_slug":"cheesy-risotto"},
  {"id":"r083","title":"鶏胸肉のカレー風味焼き","servings_base":1,"cost_per_serving":240,"time_minutes":20,"tags":["主菜","時短"],"preserve_days":2,"ingredients":[{"name":"鶏むね肉","qty":150,"unit":"g","category":"肉"},{"name":"カレー粉","qty":5,"unit":"g","category":"調味料"},{"name":"塩","qty":1,"unit":"g","category":"調味料"}],"seo_slug":"curry-chicken"},
  {"id":"r084","title":"サラダチキンと野菜のサラダ","servings_base":1,"cost_per_serving":300,"time_minutes":8,"tags":["副菜","時短","ヘルシー"],"preserve_days":1,"ingredients":[{"name":"サラダチキン","qty":80,"unit":"g","category":"加工品"},{"name":"レタス","qty":50,"unit":"g","category":"野菜"},{"name":"ミニトマト","qty":50,"unit":"g","category":"野菜"},{"name":"ドレッシング","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"salad-chicken"},
  {"id":"r085","title":"牛丼（簡易）","servings_base":1,"cost_per_serving":350,"time_minutes":20,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"牛こま切れ","qty":120,"unit":"g","category":"肉"},{"name":"玉ねぎ","qty":50,"unit":"g","category":"野菜"},{"name":"砂糖","qty":5,"unit":"g","category":"調味料"},{"name":"醤油","qty":20,"unit":"ml","category":"調味料"}],"seo_slug":"gyudon-simple"},
  {"id":"r086","title":"冷やし豆腐サラダ","servings_base":1,"cost_per_serving":120,"time_minutes":5,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"絹ごし豆腐","qty":150,"unit":"g","category":"豆腐"},{"name":"きゅうり","qty":50,"unit":"g","category":"野菜"},{"name":"ごまドレッシング","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"cold-tofu-salad"},
  {"id":"r087","title":"鯖缶カレー（簡易）","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主菜","缶詰","時短"],"preserve_days":2,"ingredients":[{"name":"鯖水煮缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"レトルトカレー","qty":1,"unit":"袋","category":"加工品"},{"name":"ご飯","qty":200,"unit":"g","category":"主食"}],"seo_slug":"saba-curry"},
  {"id":"r088","title":"簡単タコライス風","servings_base":1,"cost_per_serving":300,"time_minutes":20,"tags":["主菜","洋風","時短"],"preserve_days":1,"ingredients":[{"name":"ご飯","qty":200,"unit":"g","category":"主食"},{"name":"牛ひき肉","qty":80,"unit":"g","category":"肉"},{"name":"レタス","qty":30,"unit":"g","category":"野菜"},{"name":"タコスソース","qty":20,"unit":"g","category":"調味料"}],"seo_slug":"taco-rice-simple"},
  {"id":"r089","title":"にら玉（中華風）","servings_base":1,"cost_per_serving":140,"time_minutes":10,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"にら","qty":50,"unit":"g","category":"野菜"},{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"塩","qty":1,"unit":"g","category":"調味料"}],"seo_slug":"nira-tama"},
  {"id":"r090","title":"青椒肉絲風（簡易）","servings_base":1,"cost_per_serving":300,"time_minutes":20,"tags":["主菜","中華"],"preserve_days":1,"ingredients":[{"name":"豚こま切れ","qty":100,"unit":"g","category":"肉"},{"name":"ピーマン","qty":60,"unit":"g","category":"野菜"},{"name":"醤油","qty":10,"unit":"ml","category":"調味料"},{"name":"オイスターソース","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"chinjao-simple"},
  {"id":"r091","title":"ツナとほうれん草の和え物","servings_base":1,"cost_per_serving":150,"time_minutes":8,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"ツナ缶","qty":1,"unit":"缶","category":"缶詰"},{"name":"ほうれん草","qty":50,"unit":"g","category":"野菜"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"tuna-spinach-ae"},
  {"id":"r092","title":"簡単ガパオ（目玉焼きのせ）","servings_base":1,"cost_per_serving":280,"time_minutes":20,"tags":["主菜","時短","エスニック"],"preserve_days":1,"ingredients":[{"name":"鶏ひき肉","qty":120,"unit":"g","category":"肉"},{"name":"バジル","qty":5,"unit":"g","category":"野菜"},{"name":"目玉焼き","qty":1,"unit":"個","category":"卵"},{"name":"ナンプラー","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"gapao-simple"},
  {"id":"r093","title":"簡単しらすパスタ","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"スパゲッティ","qty":100,"unit":"g","category":"主食"},{"name":"しらす","qty":15,"unit":"g","category":"乾物"},{"name":"大葉","qty":3,"unit":"枚","category":"野菜"},{"name":"オリーブオイル","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"shirasu-pasta"},
  {"id":"r094","title":"簡単チキンナゲット（冷凍利用）","servings_base":1,"cost_per_serving":220,"time_minutes":12,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"冷凍ナゲット","qty":6,"unit":"個","category":"冷凍食品"},{"name":"ケチャップ","qty":10,"unit":"g","category":"調味料"},{"name":"サラダ","qty":50,"unit":"g","category":"野菜"}],"seo_slug":"frozen-nuggets"},
  {"id":"r095","title":"鶏肉とキャベツの塩だれ炒め","servings_base":1,"cost_per_serving":240,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"鶏もも肉","qty":120,"unit":"g","category":"肉"},{"name":"キャベツ","qty":100,"unit":"g","category":"野菜"},{"name":"塩だれ","qty":15,"unit":"ml","category":"調味料"}],"seo_slug":"chicken-cabbage-salt"},
  {"id":"r096","title":"エリンギとベーコンのソテー","servings_base":1,"cost_per_serving":160,"time_minutes":10,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"エリンギ","qty":80,"unit":"g","category":"野菜"},{"name":"ベーコン","qty":30,"unit":"g","category":"肉"},{"name":"バター","qty":10,"unit":"g","category":"乳製品"}],"seo_slug":"eringi-bacon"},
  {"id":"r097","title":"冷凍ピザとサラダ","servings_base":1,"cost_per_serving":400,"time_minutes":12,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"冷凍ピザ","qty":1,"unit":"枚","category":"冷凍食品"},{"name":"サラダ","qty":80,"unit":"g","category":"野菜"},{"name":"ドレッシング","qty":10,"unit":"ml","category":"調味料"}],"seo_slug":"frozen-pizza-salad"},
  {"id":"r098","title":"簡単コロッケとキャベツ","servings_base":1,"cost_per_serving":220,"time_minutes":15,"tags":["主菜","時短"],"preserve_days":1,"ingredients":[{"name":"冷凍コロッケ","qty":2,"unit":"個","category":"冷凍食品"},{"name":"キャベツ","qty":50,"unit":"g","category":"野菜"},{"name":"ソース","qty":10,"unit":"g","category":"調味料"}],"seo_slug":"croquette-cabbage"},
  {"id":"r099","title":"ごま和え（ほうれん草）","servings_base":1,"cost_per_serving":110,"time_minutes":10,"tags":["副菜","時短"],"preserve_days":1,"ingredients":[{"name":"ほうれん草","qty":50,"unit":"g","category":"野菜"},{"name":"すりごま","qty":5,"unit":"g","category":"調味料"},{"name":"醤油","qty":5,"unit":"ml","category":"調味料"}],"seo_slug":"goma-ae"},
  {"id":"r100","title":"たまごサンド（簡易）","servings_base":1,"cost_per_serving":180,"time_minutes":10,"tags":["主食","時短"],"preserve_days":1,"ingredients":[{"name":"食パン","qty":2,"unit":"枚","category":"主食"},{"name":"卵","qty":2,"unit":"個","category":"卵"},{"name":"マヨネーズ","qty":15,"unit":"g","category":"調味料"}],"seo_slug":"egg-sandwich"}
  ],
  week_templates: [
    {
      "id":"wt_3000_short",
      "label":"節約時短プラン 〜3000円",
      "budget_max":3000,
      "time_pref":"short",
      "structure":[
        {"day":"Mon","dishes":["r001","r005","r011"]},
        {"day":"Tue","dishes":["r006","r010","r011"]},
        {"day":"Wed","dishes":["r003","r005","r011"]},
        {"day":"Thu","dishes":["r012","r004"]},
        {"day":"Fri","dishes":["r001","r010"]},
        {"day":"Sat","dishes":["r008","r005"]},
        {"day":"Sun","dishes":["r007","r005"]}
      ],
      "estimated_cost":2850,
      "notes":"時短中心で作り置き対応の副菜を多めに配置"
    },
    {
      "id":"wt_5000_balanced",
      "label":"バランス重視プラン 〜5000円",
      "budget_max":5000,
      "time_pref":"normal",
      "structure":[
        {"day":"Mon","dishes":["r002","r005","r011"]},
        {"day":"Tue","dishes":["r001","r010","r011"]},
        {"day":"Wed","dishes":["r009","r004"]},
        {"day":"Thu","dishes":["r003","r005","r011"]},
        {"day":"Fri","dishes":["r007","r005"]},
        {"day":"Sat","dishes":["r008","r012"]},
        {"day":"Sun","dishes":["r001","r004"]}
      ],
      "estimated_cost":4600,
      "notes":"魚と野菜をバランスよく組み合わせ"
    },
    {
      "id":"wt_8000_comfort",
      "label":"ゆったり楽しむプラン 〜8000円",
      "budget_max":8000,
      "time_pref":"any",
      "structure":[
        {"day":"Mon","dishes":["r007","r005"]},
        {"day":"Tue","dishes":["r002","r010"]},
        {"day":"Wed","dishes":["r009","r004"]},
        {"day":"Thu","dishes":["r003","r011"]},
        {"day":"Fri","dishes":["r008","r012"]},
        {"day":"Sat","dishes":["r001","r005","r011"]},
        {"day":"Sun","dishes":["r007","r004"]}
      ],
      "estimated_cost":7200,
      "notes":"作り置きと手間を両立したゆったりプラン"
    }
  ],
  budget_bands:[
    {"id":"b3000","label":"〜3000円","max":3000},
    {"id":"b5000","label":"〜5000円","max":5000},
    {"id":"b8000","label":"〜8000円","max":8000}
  ]
};

/* ---------- ユーティリティ関数 ---------- */

function findTemplateForBudget(budgetId, timePref) {
  const band = DATA.budget_bands.find(b => b.id === budgetId) || DATA.budget_bands[0];
  // 候補は予算内のテンプレ
  let candidates = DATA.week_templates.filter(wt => wt.budget_max <= band.max);
  // timePrefが指定されていれば合致するものを優先
  if (timePref && timePref !== 'any') {
    const matched = candidates.filter(wt => wt.time_pref === timePref);
    if (matched.length) candidates = matched;
  }
  // コストに近い順でソート（estimated_costが近いものを選ぶ）
  candidates.sort((a,b) => Math.abs(a.estimated_cost - band.max) - Math.abs(b.estimated_cost - band.max));
  return candidates[0] || DATA.week_templates[0];
}

function scaleIngredient(ing, people, baseServings) {
  const factor = people / baseServings;
  // 換算は四捨五入（少量は切り上げ）
  const qty = (ing.qty * factor);
  const rounded = qty < 1 ? Math.ceil(qty) : Math.round(qty);
  return { ...ing, qty: rounded };
}

function aggregateShoppingList(mealTemplate, people) {
  const map = new Map();
  mealTemplate.structure.forEach(day => {
    day.dishes.forEach(rid => {
      const recipe = DATA.recipes.find(r => r.id === rid);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const scaled = scaleIngredient(ing, people, recipe.servings_base);
        const key = `${scaled.name}||${scaled.unit}||${scaled.category}`;
        const prev = map.get(key);
        if (prev) prev.qty += scaled.qty;
        else map.set(key, { name: scaled.name, unit: scaled.unit, qty: scaled.qty, category: scaled.category });
      });
    });
  });
  // カテゴリ順で並び替える
  const list = Array.from(map.values()).sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  return list;
}

function estimateWeekCost(mealTemplate, people) {
  // 簡易：各日のレシピの cost_per_serving を合計して人数分を乗算
  let total = 0;
  mealTemplate.structure.forEach(day => {
    day.dishes.forEach(rid => {
      const r = DATA.recipes.find(x => x.id === rid);
      if (r && typeof r.cost_per_serving === 'number') total += r.cost_per_serving;
    });
  });
  return total * people;
}

/* ---------- レンダリング関数 ---------- */

function formatQty(qty, unit) {
  return `${qty}${unit || ''}`;
}

function renderResult(mealTemplate, people) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // reset

  // Header summary
  const header = document.createElement('div');
  header.className = 'summary';
  const costEst = estimateWeekCost(mealTemplate, people);
  header.innerHTML = `<h2>${mealTemplate.label}</h2><p class="meta">推定合計金額: <strong>${costEst}円</strong> ・ 人数: <strong>${people}人</strong> ・ 備考: ${mealTemplate.notes || ''}</p>`;
  resultDiv.appendChild(header);

  // 1週間の献立表示
  const weekEl = document.createElement('section');
  weekEl.className = 'week';
  mealTemplate.structure.forEach(day => {
    const dayEl = document.createElement('article');
    dayEl.className = 'day';
    dayEl.innerHTML = `<h3>${day.day}</h3>`;
    day.dishes.forEach(rid => {
      const r = DATA.recipes.find(x => x.id === rid);
      if (!r) return;
      const scaledIngredients = r.ingredients.map(ing => scaleIngredient(ing, people, r.servings_base));
      const ingText = scaledIngredients.map(si => `${si.name} ${formatQty(si.qty, si.unit)}`).join(' / ');
      const recipeHtml = `<div class="recipe">
        <h4>${r.title}</h4>
        <p class="small">時間 ${r.time_minutes}分 ・ 目安金額 ${r.cost_per_serving}円</p>
        <p class="ingredients">材料: ${ingText}</p>
      </div>`;
      dayEl.innerHTML += recipeHtml;
    });
    weekEl.appendChild(dayEl);
  });
  resultDiv.appendChild(weekEl);

  // 買い物リスト
  const shopping = aggregateShoppingList(mealTemplate, people);
  const shopWrap = document.createElement('section');
  shopWrap.className = 'shopping';
  shopWrap.innerHTML = `<h3>買い物リスト</h3>`;
  const listEl = document.createElement('div');
  listEl.className = 'shopping-list';
  listEl.innerHTML = shopping.map(i => `<div class="item"><span class="iname">${i.name}</span><span class="iqty">${i.qty}${i.unit}</span><span class="icat">${i.category}</span></div>`).join('');
  shopWrap.appendChild(listEl);
  const estEl = document.createElement('p');
  estEl.className = 'estimate';
  estEl.textContent = `推定週合計（目安）: ${costEst}円`;
  shopWrap.appendChild(estEl);

  resultDiv.appendChild(shopWrap);

  // 操作ボタン（印刷・JSONダウンロード・別パターン）
  const actions = document.getElementById('actions');
  actions.innerHTML = '';
  const printBtn = document.createElement('button');
  printBtn.textContent = '印刷する';
  printBtn.addEventListener('click', () => window.print());
  actions.appendChild(printBtn);

  const dlBtn = document.createElement('button');
  dlBtn.textContent = '買い物リストをJSONで保存';
  dlBtn.addEventListener('click', () => {
    const payload = { meta: DATA.meta, template: mealTemplate, people, shopping, estimated_week_cost: costEst };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping_${mealTemplate.id}_p${people}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  actions.appendChild(dlBtn);

  const altBtn = document.createElement('button');
  altBtn.textContent = '別パターンを表示';
  altBtn.addEventListener('click', () => {
    // 同予算帯で別テンプレがあれば切替、なければ最初に戻す
    const budgetSel = document.getElementById('budget').value;
    const timePref = document.getElementById('timePref').value;
    const band = DATA.budget_bands.find(b => b.id === budgetSel) || DATA.budget_bands[0];
    const candidates = DATA.week_templates.filter(wt => wt.budget_max <= band.max);
    if (candidates.length <= 1) return;
    const idx = candidates.findIndex(c => c.id === mealTemplate.id);
    const next = candidates[(idx + 1) % candidates.length];
    renderResult(next, people);
  });
  actions.appendChild(altBtn);

  // スクロール先
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

/* ---------- 初期化とイベントバインド ---------- */

document.addEventListener('DOMContentLoaded', () => {
  // 予算選択肢と説明をUIに反映
  const budgetSelect = document.getElementById('budget');
  DATA.budget_bands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.label;
    budgetSelect.appendChild(opt);
  });
  // デフォルト値
  document.getElementById('people').value = '1';
  document.getElementById('budget').value = 'b3000';
  document.getElementById('timePref').value = 'short';

  document.getElementById('generate').addEventListener('click', () => {
    const people = parseInt(document.getElementById('people').value, 10) || 1;
    const budget = document.getElementById('budget').value;
    const timePref = document.getElementById('timePref').value;
    const template = findTemplateForBudget(budget, timePref);
    renderResult(template, people);
  });

  // クイックサンプルボタン
  document.getElementById('quick3000').addEventListener('click', () => {
    document.getElementById('budget').value = 'b3000';
    document.getElementById('timePref').value = 'short';
    document.getElementById('people').value = '1';
    document.getElementById('generate').click();
  });

  // 初回自動生成を抑えたい場合はコメントアウト可
  // document.getElementById('generate').click();
});