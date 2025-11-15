// データ（指定フォーマット）
const RECIPES = [
  {title: '混ぜるだけのチョコムース', time: '5分', ingredients: 'チョコ, 生クリーム, 牛乳', steps: '1. チョコを溶かす\n2. 混ぜる\n3. 冷やす'},
  {title: 'レンチンカップケーキ', time: '3分', ingredients: '薄力粉, 卵, 砂糖, 牛乳, ベーキングパウダー', steps: '1. 混ぜる\n2. レンジで加熱'},
  {title: 'ヨーグルトアイス', time: '2分＋凍結', ingredients: 'ヨーグルト, はちみつ', steps: '1. 混ぜて冷凍庫へ'},
  {title: '冷凍バナナミルク', time: '2分', ingredients: 'バナナ, 牛乳, はちみつ', steps: '1. ミキサーで撹拌'},
  {title: 'レンジで抹茶プリン', time: '4分＋冷やし', ingredients: '抹茶, 牛乳, 砂糖, ゼラチン', steps: '1. 混ぜる\n2. レンジで加熱\n3. 冷やす'},
  {title: 'フルーツヨーグルトパフェ', time: '5分', ingredients: 'ヨーグルト, 季節の果物, グラノーラ', steps: '1. 盛り付ける\n2. トッピング'},
  {title: 'バター不使用のりんごレンジケーキ', time: '5分', ingredients: 'りんご, 小麦粉, 卵, 砂糖, 牛乳', steps: '1. 刻んだりんごを混ぜる\n2. レンジで加熱'},
  {title: 'さつまいもスイートサラダ', time: '7分', ingredients: 'さつまいも, ヨーグルト, はちみつ', steps: '1. さつまいもを電子レンジで加熱\n2. 混ぜる'},
  {title: '簡単チーズトーストデザート', time: '3分', ingredients: '食パン, クリームチーズ, ジャム', steps: '1. 塗ってトーストする'},
  {title: 'レンチン黒ごまプリン', time: '4分＋冷やし', ingredients: '黒ごまペースト, 牛乳, 砂糖, ゼラチン', steps: '1. 混ぜる\n2. 加熱\n3. 冷やす'},
  {title: 'ホットケーキミックスで簡単マフィン', time: '6分', ingredients: 'ホットケーキミックス, 卵, 牛乳, バター', steps: '1. 混ぜて型に入れる\n2. レンジやトースターで焼く'},
  {title: 'ミルク寒天フルーツ', time: '10分＋冷やし', ingredients: '牛乳, 寒天, 砂糖, フルーツ缶', steps: '1. 溶かして冷やす\n2. トッピング'},
  {title: '豆腐チョコムース', time: '5分＋冷やし', ingredients: '絹ごし豆腐, チョコ, はちみつ', steps: '1. ミキサーで混ぜる\n2. 冷やす'},
  {title: 'バナナオートミールクッキー', time: '12分', ingredients: 'バナナ, オートミール, ナッツ', steps: '1. 混ぜて焼く'},
  {title: 'カップヨーグルトムース', time: '5分＋冷やし', ingredients: 'ヨーグルト, 生クリーム, 砂糖, ゼラチン', steps: '1. 混ぜて冷やす'},
  {title: 'レンジで作るチーズケーキ風', time: '6分＋冷やし', ingredients: 'クリームチーズ, 砂糖, 卵, クラッカー', steps: '1. 混ぜて加熱\n2. 冷やす'},
  {title: '簡単レモンゼリー', time: '8分＋冷やし', ingredients: 'レモン汁, 砂糖, ゼラチン, 水', steps: '1. 溶かして冷やす'},
  {title: 'きなこバナナの簡単デザート', time: '3分', ingredients: 'バナナ, きなこ, はちみつ', steps: '1. かけるだけ'},
  {title: 'レンチンかぼちゃプリン', time: '6分＋冷やし', ingredients: 'かぼちゃ, 牛乳, 卵, 砂糖', steps: '1. かぼちゃを柔らかくする\n2. 混ぜて加熱'},
  {title: 'カップアイスクリーム（混ぜるだけ）', time: '2分＋凍結', ingredients: '生クリーム, 砂糖, バニラ', steps: '1. 泡立てて凍らせる'},
  {title: 'みたらし団子風トースト', time: '5分', ingredients: '食パン, 砂糖, 醤油, 片栗粉', steps: '1. ソースを作り塗る\n2. トースト'},
  {title: 'バニラヨーグルトフローズン', time: '3分＋凍結', ingredients: 'ヨーグルト, バニラエッセンス, はちみつ', steps: '1. 混ぜて凍らせる'},
  {title: '塩キャラメルバナナ', time: '4分', ingredients: 'バナナ, 砂糖, バター, 塩', steps: '1. ソースを作りバナナにかける\n2. 軽く火を通す'},
  {title: 'レンジでラズベリームース', time: '5分＋冷やし', ingredients: 'ラズベリー, 砂糖, ゼラチン, 生クリーム', steps: '1. 混ぜて冷やす'},
  {title: '簡単ココナッツボール', time: '10分', ingredients: 'ココナッツ, 練乳, 砕いたビスケット', steps: '1. 混ぜて丸める'},
  {title: '冷やし抹茶ラテゼリー', time: '8分＋冷やし', ingredients: '抹茶, 牛乳, 砂糖, ゼラチン', steps: '1. 混ぜて冷やす'},
  {title: 'トースターで作るアップルチップス', time: '20分', ingredients: 'りんご, 砂糖', steps: '1. 薄切りにして焼く'},
  {title: 'レンジでチーズフォンデュ風りんご', time: '5分', ingredients: 'りんご, クリームチーズ, はちみつ', steps: '1. かけて加熱'},
  {title: 'コーヒーゼリー簡単', time: '10分＋冷やし', ingredients: 'コーヒー, 砂糖, ゼラチン, ミルク', steps: '1. 溶かして冷やす'},
  {title: '黒糖きなこトースト', time: '4分', ingredients: '食パン, 黒糖, きなこ, バター', steps: '1. 塗って焼く'},
  {title: 'ホットケーキミックスのドーナツ風', time: '10分', ingredients: 'ホットケーキミックス, 卵, 牛乳, 揚げ油', steps: '1. 混ぜて揚げる'},
  {title: 'レンジで簡単プリンアラモード', time: '6分＋冷やし', ingredients: 'プリンミックス, フルーツ缶, 生クリーム', steps: '1. 作って盛り付ける'},
  {title: 'バナナチョコディップ', time: '3分', ingredients: 'バナナ, チョコ, ナッツ', steps: '1. チョコを溶かしてディップ'},
  {title: '簡単オレンジゼリー', time: '8分＋冷やし', ingredients: 'オレンジジュース, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: '小松菜スムージーソルベ', time: '5分＋凍結', ingredients: '小松菜, バナナ, はちみつ', steps: '1. ミキサーで混ぜて凍らせる'},
  {title: 'レンジでチョコバナナケーキ', time: '5分', ingredients: 'バナナ, チョコ, 小麦粉, 卵', steps: '1. 混ぜて加熱'},
  {title: '豆乳みたらしソース', time: '4分', ingredients: '豆乳, 砂糖, 醤油, 片栗粉', steps: '1. とろみをつける\n2. かける'},
  {title: '柚子シャーベット', time: '5分＋凍結', ingredients: '柚子果汁, 砂糖, 水', steps: '1. 混ぜて凍らせる'},
  {title: '黒豆ヨーグルトボウル', time: '3分', ingredients: 'ヨーグルト, 黒豆, はちみつ', steps: '1. 盛り付ける'},
  {title: 'はちみつレモントースト', time: '4分', ingredients: '食パン, はちみつ, レモン皮', steps: '1. 塗って焼く'},
  {title: 'レンジで作るカスタード風', time: '6分＋冷やし', ingredients: '卵黄, 牛乳, 砂糖, バニラ', steps: '1. 混ぜて加熱\n2. 冷やす'},
  {title: 'きなこ豆乳プリン', time: '5分＋冷やし', ingredients: 'きなこ, 豆乳, ゼラチン, はちみつ', steps: '1. 溶かして冷やす'},
  {title: '簡単ブルーベリートースト', time: '5分', ingredients: '食パン, ブルーベリージャム, クリームチーズ', steps: '1. 塗って焼く'},
  {title: 'カフェオレフロート風', time: '3分', ingredients: 'コーヒー, 牛乳, アイス', steps: '1. 注ぐだけ'},
  {title: 'ミニパンケーキ串', time: '12分', ingredients: 'パンケーキミックス, シロップ, フルーツ', steps: '1. 焼いて串に刺す'},
  {title: 'レンジで簡単チョコファッジ', time: '6分', ingredients: 'チョコ, 生クリーム, バター', steps: '1. 溶かして冷やし固める'},
  {title: 'スイートポテトラップ', time: '8分', ingredients: 'さつまいも, 練乳, バター', steps: '1. つぶして成形\n2. 焼く/加熱'},
  {title: 'フローズンヨーグルトバー', time: '5分＋凍結', ingredients: 'ヨーグルト, フルーツピューレ, はちみつ', steps: '1. 型に入れて凍らせる'},
  {title: 'レンジで簡単黒ごまクッキー', time: '10分', ingredients: '黒ごま, バター, 砂糖, 小麦粉', steps: '1. 混ぜて焼く'},
  {title: 'きなこアイスサンド', time: '5分＋凍結', ingredients: 'きなこ, アイス, クッキー', steps: '1. 挟む'},
  {title: 'メープルバタートースト', time: '4分', ingredients: '食パン, メープルシロップ, バター', steps: '1. 塗って焼く'},
  {title: 'レンジで作る栗のペースト', time: '8分', ingredients: '栗, 砂糖, バター', steps: '1. 混ぜてペーストにする'},
  {title: 'バナナマフィン（簡易）', time: '15分', ingredients: 'バナナ, 小麦粉, 砂糖, 卵', steps: '1. 混ぜて焼く'},
  {title: 'ココアバナナスムージー', time: '3分', ingredients: 'バナナ, ココア, 牛乳', steps: '1. ミキサーで混ぜる'},
  {title: 'ヨーグルトチーズディップ', time: '4分', ingredients: 'ヨーグルト, クリームチーズ, はちみつ', steps: '1. 混ぜる'},
  {title: 'レンジで簡単シナモンアップル', time: '6分', ingredients: 'りんご, シナモン, 砂糖', steps: '1. 刻んで加熱'},
  {title: '抹茶ホイップトースト', time: '5分', ingredients: '食パン, 抹茶クリーム, 砂糖', steps: '1. 塗ってトースト'},
  {title: '簡単レアチーズカップ', time: '5分＋冷やし', ingredients: 'クリームチーズ, 生クリーム, 砂糖, ビスケット', steps: '1. 混ぜて冷やす'},
  {title: '豆乳バナナシェイク', time: '2分', ingredients: '豆乳, バナナ, はちみつ', steps: '1. ミキサーで混ぜる'},
  {title: 'オレンジピールトースト', time: '6分', ingredients: '食パン, オレンジピール, バター', steps: '1. 塗って焼く'},
  {title: 'レンジで作る栗きんとん風', time: '8分', ingredients: '栗甘露煮, 砂糖, バター', steps: '1. 混ぜて加熱'},
  {title: '黒蜜きなこヨーグルト', time: '2分', ingredients: 'ヨーグルト, 黒蜜, きなこ', steps: '1. かけるだけ'},
  {title: '簡単チョコタルト風', time: '10分', ingredients: 'チョコ, バター, クラッカー', steps: '1. 溶かして敷き詰める\n2. 冷やす'},
  {title: 'レンジで作るキャラメルソース', time: '5分', ingredients: '砂糖, 生クリーム, バター', steps: '1. 作ってかける'},
  {title: 'りんごのはちみつ蒸し', time: '8分', ingredients: 'りんご, はちみつ, レモン', steps: '1. レンジで蒸す'},
  {title: 'バニラクリームトースト', time: '4分', ingredients: '食パン, カスタードクリーム, バニラ', steps: '1. 塗って焼く'},
  {title: '抹茶白玉あんこ', time: '15分', ingredients: '白玉粉, 抹茶, あんこ', steps: '1. 白玉を作る\n2. 盛る'},
  {title: '簡単ココナッツプリン', time: '6分＋冷やし', ingredients: 'ココナッツミルク, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'レンジで作るバナナケーキスライス', time: '5分', ingredients: 'バナナ, 小麦粉, 卵, 砂糖', steps: '1. 混ぜて加熱'},
  {title: '黒ごまバナナヨーグルト', time: '3分', ingredients: '黒ごま, バナナ, ヨーグルト', steps: '1. 混ぜる'},
  {title: '簡単ラムレーズントースト', time: '5分', ingredients: '食パン, レーズン, ラム酒, バター', steps: '1. のせて焼く'},
  {title: 'レンジで作るチーズブリュレ風', time: '6分＋冷やし', ingredients: 'クリームチーズ, 砂糖, 卵, トッピング砂糖', steps: '1. 加熱して冷やす\n2. 表面を焼く（オプション）'},
  {title: 'フルーツソースかけパンケーキ', time: '10分', ingredients: 'パンケーキミックス, フルーツソース', steps: '1. 焼いてかける'},
  {title: 'はちみつナッツヨーグルト', time: '2分', ingredients: 'ヨーグルト, ナッツ, はちみつ', steps: '1. トッピングする'},
  {title: 'レンジで作るピーチコンポート', time: '6分', ingredients: '桃, 砂糖, レモン', steps: '1. 加熱して冷やす'},
  {title: '抹茶チョコスプレッドトースト', time: '4分', ingredients: '食パン, 抹茶チョコ, バター', steps: '1. 塗って焼く'},
  {title: '簡単チーズ風クッキー', time: '12分', ingredients: 'クリームチーズ, 小麦粉, 砂糖', steps: '1. 混ぜて焼く'},
  {title: 'レンジで作るバニラプリン', time: '6分＋冷やし', ingredients: '牛乳, 卵, 砂糖, バニラ', steps: '1. 混ぜて加熱\n2. 冷やす'},
  {title: 'バナナチャンクアイス', time: '5分＋凍結', ingredients: 'バナナ, チョコチップ, 生クリーム', steps: '1. 混ぜて凍らせる'},
  {title: 'きなこ蜜がけトースト', time: '3分', ingredients: '食パン, きなこ, はちみつ', steps: '1. かけて焼く'},
  {title: 'レンジで作るキャロットケーキ風', time: '8分', ingredients: 'にんじん, 小麦粉, 卵, 砂糖', steps: '1. 混ぜて加熱'},
  {title: '黒糖バターカップ', time: '10分', ingredients: '黒糖, バター, 小麦粉', steps: '1. 混ぜて焼く'},
  {title: 'フローズンミルクティーシャーベット', time: '5分＋凍結', ingredients: '紅茶, 牛乳, 砂糖', steps: '1. 混ぜて凍らせる'},
  {title: '簡単いちごディップ', time: '3分', ingredients: 'いちご, 砂糖, ヨーグルト', steps: '1. 混ぜてディップ'},
  {title: 'レンジで作るチョコレートブラウニー', time: '6分', ingredients: 'チョコ, バター, 砂糖, 卵, 小麦粉', steps: '1. 混ぜて加熱'},
  {title: 'メープルバナナグラタン風', time: '8分', ingredients: 'バナナ, メープル, 牛乳, バター', steps: '1. 混ぜて加熱'},
  {title: '柑橘ハニーヨーグルト', time: '2分', ingredients: 'ヨーグルト, 柑橘類, はちみつ', steps: '1. 和える'},
  {title: 'レンジで作る黒糖プリン', time: '6分＋冷やし', ingredients: '黒糖, 牛乳, 卵, ゼラチン', steps: '1. 混ぜて加熱\n2. 冷やす'},
  {title: 'ココアクランブルトースト', time: '7分', ingredients: '食パン, ココアクランブル, バター', steps: '1. のせて焼く'},
  {title: '簡単苺ヨーグルトグラノーラ', time: '3分', ingredients: 'ヨーグルト, いちご, グラノーラ', steps: '1. 盛るだけ'},
  {title: 'レンジで抹茶ホイップカップ', time: '4分', ingredients: '抹茶, 生クリーム, 砂糖', steps: '1. 混ぜる\n2. 冷やす'},
  {title: 'チョコバナナトースト', time: '3分', ingredients: '食パン, チョコ, バナナ', steps: '1. のせてトースト'},
  {title: 'オートミールバナナバー', time: '12分', ingredients: 'オートミール, バナナ, はちみつ', steps: '1. 混ぜて焼く'},
  {title: 'レンジでかぼちゃチーズ', time: '6分', ingredients: 'かぼちゃ, クリームチーズ, 砂糖', steps: '1. 混ぜて加熱'},
  {title: '簡単マンゴープリン', time: '8分＋冷やし', ingredients: 'マンゴーピューレ, 牛乳, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: '柑橘ヨーグルトグミ', time: '10分＋冷やし', ingredients: '柑橘ジュース, ヨーグルト, ゼラチン', steps: '1. 混ぜて冷やす'},
  {title: '黒蜜抹茶アイス', time: '5分＋凍結', ingredients: '抹茶, 牛乳, 黒蜜', steps: '1. 混ぜて凍らせる'},
  {title: 'レンチンメープルナッツ', time: '5分', ingredients: 'ナッツ, メープルシロップ, バター', steps: '1. 混ぜて加熱'},
  {title: '簡単レモンカードトースト', time: '6分', ingredients: '食パン, レモンカード, バター', steps: '1. 塗って焼く'},
  {title: '冷凍ブルーベリースムージー', time: '2分', ingredients: '冷凍ブルーベリー, ヨーグルト, はちみつ', steps: '1. ミキサーで撹拌'},
  {title: 'レンジで作る白玉パフェ', time: '10分', ingredients: '白玉粉, あんこ, フルーツ', steps: '1. 白玉を茹でる\n2. 盛り付ける'},
  {title: 'きなこバタークッキー', time: '15分', ingredients: 'きなこ, バター, 小麦粉, 砂糖', steps: '1. 混ぜて焼く'},
  {title: 'ヨーグルトと蜂蜜の簡単ムース', time: '4分＋冷やし', ingredients: 'ヨーグルト, はちみつ, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'レンジで黒豆スイーツ', time: '5分', ingredients: '黒豆缶, 砂糖, 牛乳', steps: '1. 混ぜて加熱'},
  {title: '寒天フルーツ寄せ', time: '10分＋冷やし', ingredients: '寒天, フルーツ缶, 砂糖', steps: '1. 混ぜて冷やす'},
  {title: 'バナナメープルトースト', time: '4分', ingredients: '食パン, バナナ, メープル', steps: '1. のせて焼く'},
  {title: 'レンジでヨーグルトチーズケーキ', time: '7分＋冷やし', ingredients: 'クリームチーズ, ヨーグルト, 砂糖', steps: '1. 混ぜて加熱\n2. 冷やす'},
  {title: 'いちごミルクシャーベット', time: '5分＋凍結', ingredients: 'いちご, 砂糖, 牛乳', steps: '1. 混ぜて凍らせる'},
  {title: 'レンジで簡単パンプディング', time: '8分＋冷やし', ingredients: '食パン, 卵, 牛乳, 砂糖', steps: '1. 混ぜて加熱'},
  {title: '黒ごまバニラムース', time: '6分＋冷やし', ingredients: '黒ごま, バニラ, 生クリーム, 砂糖', steps: '1. 混ぜて冷やす'},
  {title: 'レンジで作る洋梨コンポート', time: '6分', ingredients: '洋梨, 砂糖, レモン', steps: '1. 加熱して甘煮にする'},
  {title: '簡単メロンヨーグルト', time: '3分', ingredients: 'メロン, ヨーグルト, はちみつ', steps: '1. 混ぜる'},
  {title: 'レンジで作るプチシュー風', time: '10分', ingredients: 'ホットケーキミックス, 生クリーム, 砂糖', steps: '1. 焼いて詰める'},
  {title: '抹茶バターケーキ風', time: '12分', ingredients: '抹茶, バター, 小麦粉, 卵', steps: '1. 混ぜて焼く'},
  {title: 'レンジで作るラムケーキ', time: '7分', ingredients: 'ラム酒, レーズン, 小麦粉, 卵', steps: '1. 混ぜて加熱'},
  {title: 'ブルーベリーヨーグルトスコーン（簡易）', time: '15分', ingredients: '小麦粉, ヨーグルト, ブルーベリー', steps: '1. 混ぜて焼く'},
  {title: 'レンジで簡単さくらんぼコンポート', time: '6分', ingredients: 'さくらんぼ, 砂糖, レモン', steps: '1. 加熱して冷やす'},
  {title: 'ココアスプレッドサンド', time: '3分', ingredients: '食パン, ココアスプレッド, バター', steps: '1. 塗って挟む'},
  {title: 'バナナグラノーラカップ', time: '2分', ingredients: 'グラノーラ, バナナ, ヨーグルト', steps: '1. 盛り付ける'},
  {title: 'レンジで簡単レアチーズスムージー', time: '3分', ingredients: 'クリームチーズ, ヨーグルト, 牛乳', steps: '1. 混ぜる'},
  {title: '黒糖ミルクトースト', time: '4分', ingredients: '食パン, 黒糖, 牛乳', steps: '1. 浸して焼く'},
  {title: 'レンジで作る洋風おしるこ', time: '6分', ingredients: 'あんこ, 牛乳, マシュマロ', steps: '1. 混ぜて加熱'},
  {title: '簡単コーヒークリームトースト', time: '4分', ingredients: '食パン, コーヒークリーム, 砂糖', steps: '1. 塗って焼く'},
  {title: '柿ヨーグルトボウル', time: '3分', ingredients: '柿, ヨーグルト, ナッツ', steps: '1. 盛り付ける'},
  {title: 'レンジで作る白いチョコムース', time: '5分＋冷やし', ingredients: 'ホワイトチョコ, 生クリーム, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: '簡単アールグレイゼリー', time: '8分＋冷やし', ingredients: '紅茶, 砂糖, ゼラチン', steps: '1. 混ぜて冷やす'},
  {title: 'レンジで作る黒糖バナナパン', time: '7分', ingredients: 'バナナ, 黒糖, 小麦粉, 卵', steps: '1. 混ぜて加熱'},
  {title: '抹茶ホワイトチョコロール', time: '12分', ingredients: '抹茶, ホワイトチョコ, 卵, 小麦粉', steps: '1. 焼いて巻く'},
  {title: '冷凍ベリーのソルベ', time: '5分＋凍結', ingredients: '冷凍ベリー, 砂糖, レモン', steps: '1. ミキサーで撹拌して凍らせる'},
  {title: 'レンジで作るミニチーズタルト', time: '8分＋冷やし', ingredients: 'クリームチーズ, クラッカー, バター', steps: '1. 混ぜて冷やす'},
  {title: '簡単黒ごまプリンカップ', time: '5分＋冷やし', ingredients: '黒ごま, 牛乳, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'バナナハニーヨーグルト', time: '2分', ingredients: 'バナナ, ヨーグルト, はちみつ', steps: '1. 混ぜる'},
  {title: 'レンジで作る杏ジャムトースト', time: '5分', ingredients: '食パン, 杏ジャム, バター', steps: '1. 塗って焼く'},
  {title: '簡単ココナッツヨーグルトボール', time: '10分', ingredients: 'ココナッツ, ヨーグルト, 砕きビスケット', steps: '1. 混ぜて丸める'},
  {title: 'レンジで作る黒糖きなこバー', time: '10分', ingredients: '黒糖, きなこ, バター, クラッカー', steps: '1. 混ぜて固める'},
  {title: 'チョコチップバナナスライス', time: '4分', ingredients: 'バナナ, チョコチップ, はちみつ', steps: '1. のせて軽く加熱'},
  {title: 'フローズンバナナスムージー', time: '2分', ingredients: '冷凍バナナ, 牛乳, ココア', steps: '1. ミキサーで混ぜる'},
  {title: 'レンジで簡単ピーチヨーグルト', time: '3分', ingredients: '缶詰ピーチ, ヨーグルト, 砂糖', steps: '1. 混ぜる'},
  {title: '抹茶黒蜜トースト', time: '4分', ingredients: '食パン, 抹茶ペースト, 黒蜜', steps: '1. 塗って焼く'},
  {title: '簡単レモン豆乳アイス', time: '5分＋凍結', ingredients: 'レモン汁, 豆乳, 砂糖', steps: '1. 混ぜて凍らせる'},
  {title: 'レンジで作るさつまいもクランブル', time: '12分', ingredients: 'さつまいも, 砂糖, バター, 小麦粉', steps: '1. 混ぜて加熱'},
  {title: '黒ごまバターケーキ風', time: '10分', ingredients: '黒ごま, バター, 小麦粉, 卵', steps: '1. 混ぜて焼く'},
  {title: '簡単いちごバターサンド', time: '8分', ingredients: 'いちご, バター, クッキー', steps: '1. 挟む'},
  {title: 'レンジで作るバナナチョコディップ', time: '4分', ingredients: 'バナナ, チョコ, ナッツ', steps: '1. 溶かしてディップ'},
  {title: '蜂蜜りんごのヨーグルト和え', time: '3分', ingredients: 'りんご, ヨーグルト, はちみつ', steps: '1. 混ぜる'},
  {title: '抹茶ホワイトクランブル', time: '12分', ingredients: '抹茶, 小麦粉, バター, 砂糖', steps: '1. 混ぜて焼く'},
  {title: 'レンジで作るレアチーズトースト', time: '5分', ingredients: 'クリームチーズ, 食パン, ジャム', steps: '1. のせて加熱'},
  {title: '簡単オレンジシャーベット', time: '4分＋凍結', ingredients: 'オレンジジュース, 砂糖', steps: '1. 混ぜて凍らせる'},
  {title: 'ココアバタークッキー', time: '14分', ingredients: 'ココア, バター, 小麦粉, 砂糖', steps: '1. 混ぜて焼く'},
  {title: 'レンジで作る苺のコンポート', time: '6分', ingredients: 'いちご, 砂糖, レモン', steps: '1. 加熱して冷やす'},
  {title: '簡単バナナパンケーキ', time: '8分', ingredients: 'パンケーキミックス, バナナ, 卵', steps: '1. 混ぜて焼く'},
  {title: '黒ごまヨーグルトパフェ', time: '3分', ingredients: '黒ごま, ヨーグルト, フルーツ', steps: '1. 盛り付ける'},
  {title: 'レンジで作るミニフレンチトースト', time: '6分', ingredients: '食パン, 卵, 牛乳, 砂糖', steps: '1. 浸して加熱'},
  {title: 'レモンヨーグルトウエハース', time: '5分', ingredients: 'ウエハース, ヨーグルト, レモン', steps: '1. 塗って重ねる'},
  {title: '簡単きなこボウル', time: '2分', ingredients: 'きなこ, ヨーグルト, はちみつ', steps: '1. 混ぜる'},
  {title: 'レンジで作る黒糖スコーン', time: '15分', ingredients: '黒糖, 小麦粉, バター, 牛乳', steps: '1. 混ぜて焼く'},
  {title: '抹茶チョコチップマフィン', time: '14分', ingredients: '抹茶, チョコチップ, 小麦粉, 卵', steps: '1. 混ぜて焼く'},
  {title: '簡単ミルクプリン', time: '6分＋冷やし', ingredients: '牛乳, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'レンジで作る柚子ゼリー', time: '8分＋冷やし', ingredients: '柚子果汁, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'フローズンヨーグルトパフェ', time: '5分＋凍結', ingredients: 'ヨーグルト, フルーツ, グラノーラ', steps: '1. 盛って凍らせる'},
  {title: 'レンジで作るアーモンドクランチ', time: '8分', ingredients: 'アーモンド, 砂糖, バター', steps: '1. 混ぜて加熱'},
  {title: '簡単チョコレートミント', time: '10分＋凍結', ingredients: 'チョコ, ミント, 生クリーム', steps: '1. 混ぜて凍らせる'},
  {title: '黒蜜きなこパンケーキ', time: '8分', ingredients: 'パンケーキミックス, きなこ, 黒蜜', steps: '1. 焼いてかける'},
  {title: 'レンジで作るピーナッツバターカップ', time: '6分＋冷やし', ingredients: 'ピーナッツバター, チョコ, 砂糖', steps: '1. 型に入れて冷やす'},
  {title: '簡単ベイクドアップル', time: '12分', ingredients: 'りんご, シナモン, 砂糖, バター', steps: '1. 刻んで加熱'},
  {title: '抹茶バナナトースト', time: '4分', ingredients: 'バナナ, 抹茶ペースト, 食パン', steps: '1. のせて焼く'},
  {title: 'レンジで作るミニチョコレートタルト', time: '8分＋冷やし', ingredients: 'チョコ, クラッカー, バター', steps: '1. 混ぜて冷やす'},
  {title: '簡単カルピスシャーベット', time: '5分＋凍結', ingredients: 'カルピス, 水, 砂糖', steps: '1. 混ぜて凍らせる'},
  {title: '黒ごまミルクプリン', time: '6分＋冷やし', ingredients: '黒ごま, 牛乳, ゼラチン', steps: '1. 溶かして冷やす'},
  {title: 'レンジで作る洋梨タルト風', time: '10分＋冷やし', ingredients: '洋梨, クラッカー, クリーム', steps: '1. 敷いて冷やす'},
  {title: '簡単バナナトフィー', time: '5分', ingredients: 'バナナ, キャラメルソース, ナッツ', steps: '1. かけるだけ'},
  {title: '抹茶黒糖パウンド', time: '18分', ingredients: '抹茶, 黒糖, 小麦粉, 卵', steps: '1. 混ぜて焼く'},
  {title: 'レンジで作るココナッツフィナンシェ風', time: '10分', ingredients: 'ココナッツ, バター, 卵, 小麦粉', steps: '1. 混ぜて加熱'},
{title: 'ホイップあんバタートースト', time: '3分', ingredients: '食パン, あんこ, 生クリーム', steps: '1. あんこを塗る\n2. 生クリームをのせてトースト'},
{title: 'レモンヨーグルトマフィン風', time: '6分', ingredients: 'ヨーグルト, 小麦粉, 卵, レモン皮', steps: '1. 混ぜて加熱'},
{title: 'バター不使用ココアカップ', time: '4分＋冷やし', ingredients: 'ココア, 牛乳, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
{title: 'はちみつバナナトースト', time: '3分', ingredients: '食パン, バナナ, はちみつ', steps: '1. のせて焼く'},
{title: '即席ホットチョコレート', time: '2分', ingredients: 'ココア, 牛乳, 砂糖', steps: '1. 温めて混ぜる'},
{title: '抹茶ミルクゼリー', time: '6分＋冷やし', ingredients: '抹茶, 牛乳, 砂糖, ゼラチン', steps: '1. 溶かして冷やす'},
{title: 'バナナ豆腐スムージー', time: '2分', ingredients: '絹ごし豆腐, バナナ, はちみつ', steps: '1. ミキサーで撹拌'},
{title: 'カラメルバナナレンジ', time: '5分', ingredients: 'バナナ, 砂糖, バター', steps: '1. 砂糖を溶かしてバナナにかけ加熱'},
{title: 'ヨーグルトベリーソース', time: '4分', ingredients: 'ヨーグルト, 冷凍ベリー, はちみつ', steps: '1. 温めて混ぜトッピング'},
{title: '簡単ココナッツフレークバー', time: '8分', ingredients: 'ココナッツフレーク, 練乳, クラッカー', steps: '1. 混ぜて固める'},
{title: 'きなこホイップバナナ', time: '3分', ingredients: 'バナナ, 生クリーム, きなこ', steps: '1. ホイップをのせきなこをかける'},
{title: 'チョコスプレッドバナナカップ', time: '2分＋凍結', ingredients: 'チョコスプレッド, バナナ, クラッカー', steps: '1. 重ねて凍らせる'},
{title: 'フレンチトースト風レンジ', time: '6分', ingredients: '食パン, 卵, 牛乳, 砂糖', steps: '1. 浸して加熱'},
{title: '黒ごまバナナスムージー', time: '2分', ingredients: 'バナナ, 牛乳, 黒ごま', steps: '1. ミキサーで混ぜる'},
{title: '蜂蜜レモンヨーグルト', time: '2分', ingredients: 'ヨーグルト, レモン汁, はちみつ', steps: '1. 混ぜる'},
{title: '抹茶クラッカーデザート', time: '4分', ingredients: 'クラッカー, 抹茶クリーム, 砂糖', steps: '1. 重ねて冷やす'},
{title: '簡単ココアムース', time: '5分＋冷やし', ingredients: 'ココア, 生クリーム, 砂糖', steps: '1. 混ぜて冷やす'},
{title: '豆乳黒糖スムージー', time: '2分', ingredients: '豆乳, 黒糖, バナナ', steps: '1. ミキサーで撹拌'},
{title: 'レンジでチーズナッツ', time: '5分', ingredients: 'クリームチーズ, ナッツ, はちみつ', steps: '1. のせて加熱'},
{title: 'ココナッツヨーグルトパフェ', time: '3分', ingredients: 'ヨーグルト, ココナッツ, フルーツ', steps: '1. 盛り付ける'},
{title: 'オートミールフルーツカップ', time: '3分', ingredients: 'オートミール, ヨーグルト, フルーツ', steps: '1. 混ぜて盛る'},
{title: '黒糖バナナトースト', time: '3分', ingredients: '食パン, 黒糖, バナナ', steps: '1. のせて焼く'},
{title: 'レンジで白桃ヨーグルト', time: '3分', ingredients: '白桃缶, ヨーグルト, 砂糖', steps: '1. 混ぜる'},
{title: 'ブルーベリーレア風カップ', time: '5分＋冷やし', ingredients: 'クリームチーズ, ブルーベリー, ゼラチン', steps: '1. 混ぜて冷やす'},
{title: 'チョコナッツマシュマロ', time: '4分', ingredients: 'チョコ, マシュマロ, ナッツ', steps: '1. 混ぜて固める'},
{title: 'レモンハニーグラノーラ', time: '3分', ingredients: 'グラノーラ, レモン皮, はちみつ', steps: '1. 混ぜてトッピング'},
{title: 'レンジで簡単バニラブリュレ', time: '6分＋冷やし', ingredients: '生クリーム, 砂糖, 卵黄', steps: '1. 混ぜて加熱し冷やす'},
{title: 'きなこ黒蜜ヨーグルト', time: '2分', ingredients: 'ヨーグルト, きなこ, 黒蜜', steps: '1. かけるだけ'},
{title: '蜂蜜レモンゼリーカップ', time: '8分＋冷やし', ingredients: 'レモン汁, はちみつ, ゼラチン', steps: '1. 溶かして冷やす'},
{title: 'オレンジチョコディップ', time: '3分', ingredients: 'オレンジ, チョコ, ナッツ', steps: '1. ディップして固める'},
{title: '抹茶ミルクスムージー', time: '2分', ingredients: '抹茶, 牛乳, バナナ', steps: '1. ミキサーで混ぜる'},
{title: 'レンジで簡単マンゴーソース', time: '4分', ingredients: 'マンゴー缶, 砂糖, レモン', steps: '1. 加熱してソースにする'},
{title: 'バナナココナッツトースト', time: '4分', ingredients: '食パン, バナナ, ココナッツ', steps: '1. のせて焼く'},
{title: '黒ごまヨーグルトクランチ', time: '5分', ingredients: 'ヨーグルト, 黒ごま, グラノーラ', steps: '1. 盛ってトッピング'},
{title: 'はちみつレーズンバター', time: '3分', ingredients: 'レーズン, バター, はちみつ', steps: '1. 混ぜて塗る'},
{title: 'レンジで簡単チーズエッグカップ', time: '5分', ingredients: '卵, クリームチーズ, 砂糖', steps: '1. 混ぜて加熱'},
{title: 'コーヒークリームカップ', time: '4分＋冷やし', ingredients: 'インスタントコーヒー, 生クリーム, 砂糖', steps: '1. 混ぜて冷やす'},
{title: '黒糖きなこクランブル', time: '8分', ingredients: '黒糖, きなこ, バター, 小麦粉', steps: '1. 混ぜて焼く'},
{title: 'ミルクチョコポップ', time: '5分', ingredients: 'チョコ, 牛乳, パフ', steps: '1. 溶かして混ぜ固める'},
{title: '簡単ヨーグルトソルベ', time: '3分＋凍結', ingredients: 'ヨーグルト, はちみつ, レモン', steps: '1. 混ぜて凍らせる'},
{title: 'レンジで作る栗ヨーグルト', time: '4分', ingredients: '栗甘露煮, ヨーグルト, 砂糖', steps: '1. 混ぜる'},
{title: 'メープルナッツヨーグルト', time: '2分', ingredients: 'ヨーグルト, メープル, ナッツ', steps: '1. トッピングする'},
{title: 'バナナミニクレープ風', time: '6分', ingredients: '薄力粉, 卵, 牛乳, バナナ', steps: '1. 混ぜて薄く焼き包む'},
{title: '黒ごまホイップカップ', time: '4分＋冷やし', ingredients: '黒ごまペースト, 生クリーム, 砂糖', steps: '1. 混ぜて冷やす'},
{title: '簡単あんこカップケーキ', time: '5分', ingredients: 'あんこ, ホットケーキミックス, 卵', steps: '1. 混ぜて加熱'},
{title: '柑橘ヨーグルトシャーベット', time: '5分＋凍結', ingredients: '柑橘ジュース, ヨーグルト, 砂糖', steps: '1. 混ぜて凍らせる'},
{title: 'レンジで黒ごまトリュフ', time: '6分＋冷やし', ingredients: '黒ごま, チョコ, 生クリーム', steps: '1. 混ぜて冷やし丸める'},
{title: 'バナナシナモントースト', time: '3分', ingredients: '食パン, バナナ, シナモン', steps: '1. のせて焼く'},
{title: '抹茶ヨーグルトムース', time: '5分＋冷やし', ingredients: '抹茶, ヨーグルト, ゼラチン', steps: '1. 溶かして冷やす'},
{title: 'チョコバナナパフェ風', time: '4分', ingredients: 'バナナ, チョコソース, アイス', steps: '1. 重ねて盛る'},
{title: '黒蜜バナナグラノーラ', time: '3分', ingredients: 'グラノーラ, バナナ, 黒蜜', steps: '1. 混ぜる'},
{title: 'レンジで簡単さつまいもムース', time: '7分＋冷やし', ingredients: 'さつまいも, 生クリーム, 砂糖', steps: '1. 加熱して混ぜ冷やす'},
{title: 'レモンポップコーンスイーツ', time: '5分', ingredients: 'ポップコーン, レモン砂糖, バター', steps: '1. コーティングして固める'},
{title: '黒ごまバナナトースト', time: '3分', ingredients: '食パン, 黒ごまペースト, バナナ', steps: '1. のせて焼く'},
{title: '簡単ココアビスケットサンド', time: '4分', ingredients: 'ビスケット, ココアクリーム, 牛乳', steps: '1. 挟む'},
{title: 'レンジで作る柑橘コンポート', time: '6分', ingredients: '柑橘類, 砂糖, レモン', steps: '1. 加熱して甘煮にする'},
{title: 'きなこミルクカップ', time: '3分', ingredients: 'きなこ, 牛乳, はちみつ', steps: '1. 混ぜて温める'},
{title: '黒糖バタークッキー風', time: '12分', ingredients: '黒糖, バター, 小麦粉', steps: '1. 混ぜて焼く'},
{title: 'レンジで簡単チーズフロスティング', time: '4分', ingredients: 'クリームチーズ, 砂糖, バニラ', steps: '1. 混ぜて冷やす'},
{title: 'バナナココアパン', time: '6分', ingredients: 'バナナ, ココア, 小麦粉, 卵', steps: '1. 混ぜて加熱'},
{title: 'フルーツミントヨーグルト', time: '3分', ingredients: 'ヨーグルト, フルーツ, ミント', steps: '1. 和える'},
{title: 'レンジで黒みつバターナッツ', time: '5分', ingredients: 'バターナッツ, 黒蜜, バター', steps: '1. 加熱してかける'},
{title: '簡単チョコバナナクレープ', time: '6分', ingredients: '薄力粉, 卵, 牛乳, バナナ, チョコ', steps: '1. 生地焼き包む'},
{title: '抹茶白玉フルーツ', time: '8分', ingredients: '白玉粉, 抹茶, フルーツ', steps: '1. 白玉を茹で盛る'},
{title: 'レンジで作るバナナメレンゲカップ', time: '6分＋冷やし', ingredients: '卵白, バナナ, 砂糖', steps: '1. 泡立て加熱して冷やす'},
{title: '黒ごまメープルトースト', time: '3分', ingredients: '食パン, 黒ごま, メープル', steps: '1. のせて焼く'},
{title: '簡単フルーツゼリー串', time: '10分＋冷やし', ingredients: 'ゼラチン, フルーツ缶, 砂糖', steps: '1. 混ぜて冷やす'},
{title: 'レンジで作るチョコバナナパイ', time: '8分＋冷やし', ingredients: 'バナナ, チョコ, クラッカー', steps: '1. 敷いて冷やす'},
{title: 'バターミルク風ヨーグルトパンケーキ', time: '8分', ingredients: 'パンケーキミックス, ヨーグルト, 卵', steps: '1. 混ぜて焼く'},
{title: '黒ごまプチクランチ', time: '7分', ingredients: '黒ごま, 砂糖, ナッツ', steps: '1. 炒めて固める'},
{title: 'レンジで作る苺ホイップトースト', time: '4分', ingredients: '食パン, いちご, 生クリーム', steps: '1. のせて加熱'},
{title: '簡単キャラメルナッツ', time: '5分', ingredients: 'ナッツ, 砂糖, バター', steps: '1. コーティングして冷ます'},
{title: '抹茶クリームディップ', time: '3分', ingredients: '抹茶, クリームチーズ, 砂糖', steps: '1. 混ぜる'},
{title: 'レンジで作る洋梨ジャム', time: '6分', ingredients: '洋梨, 砂糖, レモン', steps: '1. 加熱して煮詰める'},
{title: 'バナナチップスメープル', time: '10分', ingredients: 'バナナ, メープル, シナモン', steps: '1. スライスして焼く'},
{title: '黒ごまアイススプーン', time: '5分＋凍結', ingredients: '黒ごま, 生クリーム, 砂糖', steps: '1. 混ぜて型で凍らせる'},
{title: '簡単ココアパフェ', time: '4分', ingredients: 'ココア, 生クリーム, ビスケット', steps: '1. 重ねて盛る'},
{title: 'レンジで抹茶ミニケーキ', time: '7分', ingredients: '抹茶, 小麦粉, 卵, 砂糖', steps: '1. 混ぜて加熱'},
{title: '柚子ハニーシャーベット', time: '5分＋凍結', ingredients: '柚子果汁, はちみつ, 水', steps: '1. 混ぜて凍らせる'},
{title: 'きなこホイップクラッカー', time: '3分', ingredients: 'クラッカー, 生クリーム, きなこ', steps: '1. ホイップをのせる'},
{title: 'レンジで簡単ナッツバー', time: '8分', ingredients: 'ナッツ, はちみつ, バター', steps: '1. 混ぜて固める'},
{title: 'チョコバナナフレンチ風', time: '6分', ingredients: '食パン, バナナ, チョコ', steps: '1. のせて加熱'},
{title: '簡単フルーツヨーグルトアイス', time: '4分＋凍結', ingredients: 'ヨーグルト, フルーツ, はちみつ', steps: '1. 混ぜて凍らせる'},
{title: '抹茶ホワイトチョコカップ', time: '5分＋冷やし', ingredients: '抹茶, ホワイトチョコ, 生クリーム', steps: '1. 溶かして冷やす'},
{title: 'レンジで作る黒豆クリーム', time: '5分', ingredients: '黒豆, 生クリーム, 砂糖', steps: '1. 混ぜて温める'},
{title: 'バナナココアボウル', time: '3分', ingredients: 'バナナ, ココア, 牛乳', steps: '1. 混ぜる'},
{title: '黒糖きなこシャーベット', time: '5分＋凍結', ingredients: '黒糖, きなこ, 水', steps: '1. 混ぜて凍らせる'},
{title: 'レンジで簡単アップルクランブル', time: '10分', ingredients: 'りんご, 小麦粉, バター, 砂糖', steps: '1. 刻んで加熱し上にクランブル'},
{title: '簡単ベリークリームトースト', time: '4分', ingredients: '食パン, ベリー, クリーム', steps: '1. のせて焼く'},
{title: '抹茶アーモンドクッキー', time: '12分', ingredients: '抹茶, アーモンド, 小麦粉, 砂糖', steps: '1. 混ぜて焼く'},
{title: 'レンジで作るマンゴー冷やしプリン', time: '6分＋冷やし', ingredients: 'マンゴーピューレ, 牛乳, ゼラチン', steps: '1. 溶かして冷やす'},
{title: '黒ごまレアチーズ風', time: '6分＋冷やし', ingredients: 'クリームチーズ, 黒ごま, 砂糖, ゼラチン', steps: '1. 混ぜて冷やす'},
{title: '簡単キャラメルラテゼリー', time: '8分＋冷やし', ingredients: 'コーヒー, キャラメルソース, ゼラチン', steps: '1. 混ぜて冷やす'},
{title: 'レンジで作る柿ジャムトースト', time: '4分', ingredients: '食パン, 柿, 砂糖', steps: '1. のせて加熱'}

];

// 要素取得
const todayBtn = document.getElementById('btn-today');
const copyBtn = document.getElementById('btn-copy');
const pngBtn = document.getElementById('btn-png');
const shareX = document.getElementById('share-x');
const shareFb = document.getElementById('share-fb');
const shareLine = document.getElementById('share-line');
const shareMail = document.getElementById('share-mail');
const autoBox = document.getElementById('auto-recipe-box');
const searchInput = document.getElementById('search');
const saveBtn = document.getElementById('btn-save');
const loadBtn = document.getElementById('btn-load');

let currentRecipe = null;

// HTMLエスケープ
function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

// レシピ→テキスト/HTML変換
function recipeToText(r){
  if(!r) return '';
  return `タイトル: ${r.title}\n調理時間: ${r.time}\n材料: ${r.ingredients}\n手順:\n${r.steps}`;
}
function recipeToHtml(r){
  if(!r) return '<p>レシピが選択されていません。</p>';
  return `
    <h2 class="recipe-title">${escapeHtml(r.title)}</h2>
    <p class="meta"><strong>所要時間:</strong> ${escapeHtml(r.time)}</p>
    <p><strong>材料:</strong> ${escapeHtml(r.ingredients)}</p>
    <pre class="steps">${escapeHtml(r.steps)}</pre>
  `;
}

// 初期化：ローカル保存があれば読み込み、なければ非表示状態
function init(){
  const saved = localStorage.getItem('ts-shortbakes-current');
  if(saved){
    try { currentRecipe = JSON.parse(saved); }
    catch(e){ currentRecipe = null; }
  } else {
    currentRecipe = null;
  }
  renderCurrent();
}
function renderCurrent(){
  // ページ上には必ず1件だけ（あるいは空）を表示。一覧は挿入しない。
  autoBox.innerHTML = recipeToHtml(currentRecipe);
}

// 今日のレシピ（ランダム1件表示）
todayBtn.addEventListener('click', ()=>{
  if(!RECIPES.length) return;
  const idx = Math.floor(Math.random() * RECIPES.length);
  currentRecipe = RECIPES[idx];
  saveToLocalStorage();
  renderCurrent();
  flash(autoBox);
});

// コピー
copyBtn.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText(recipeToText(currentRecipe));
    copyBtn.textContent = 'コピー済み!';
    setTimeout(()=> copyBtn.textContent = 'レシピをコピー', 1500);
  } catch(e){
    alert('クリップボードにコピーできませんでした。');
  }
});

// PNG 保存（シンプル実装）
pngBtn.addEventListener('click', ()=>{
  if(!currentRecipe){ alert('保存するレシピがありません。'); return; }
  const text = recipeToText(currentRecipe);
  const lines = text.split('\n');
  const padding = 24;
  const lineHeight = 22;
  // 横幅は画面幅に合わせて制限
  const width = Math.min(window.innerWidth - 40, 1200);
  const height = Math.min(lines.length * lineHeight + padding*2 + 60, 2000);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(400, width);
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fffae6';
  ctx.fillRect(0,0,canvas.width,60);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(currentRecipe.title, 16, 36);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#222';
  let y = 80;
  lines.forEach(line=>{
    ctx.fillText(line, 16, y);
    y += lineHeight;
  });
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = currentRecipe.title + '.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// シェア（X/Facebook/LINE/Email）
function encodedShareText(){ return encodeURIComponent(recipeToText(currentRecipe) + '\n\n時短お菓子レシピ'); }
shareX.addEventListener('click', ()=> {
  if(!currentRecipe) { alert('共有するレシピがありません。'); return; }
  window.open(`https://twitter.com/intent/tweet?text=${encodedShareText()}`, '_blank');
});
shareFb.addEventListener('click', ()=> {
  const shareUrl = encodeURIComponent(location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
});
shareLine.addEventListener('click', ()=> {
  if(!currentRecipe) { alert('共有するレシピがありません。'); return; }
  const text = encodeURIComponent(recipeToText(currentRecipe));
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
});
shareMail.addEventListener('click', ()=> {
  if(!currentRecipe) { alert('共有するレシピがありません。'); return; }
  const body = encodeURIComponent(recipeToText(currentRecipe) + '\n\n' + location.href);
  window.location.href = `mailto:?subject=${encodeURIComponent('時短お菓子のレシピ')}&body=${body}`;
});

// 検索：最初にマッチした1件だけを表示（HTMLに一覧を作らない）
searchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    doSearch();
  }
});
function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ currentRecipe = null; renderCurrent(); return; }
  const found = RECIPES.find(r => (r.title + ' ' + r.ingredients + ' ' + r.steps).toLowerCase().includes(q));
  if(found){
    currentRecipe = found;
    saveToLocalStorage();
    renderCurrent();
    flash(autoBox);
  } else {
    currentRecipe = null;
    autoBox.innerHTML = `<p>検索条件に合うレシピが見つかりませんでした。</p>`;
  }
}

// ローカル保存/読み込み
function saveToLocalStorage(){
  try { if(currentRecipe) localStorage.setItem('ts-shortbakes-current', JSON.stringify(currentRecipe)); }
  catch(e){}
}
saveBtn.addEventListener('click', ()=>{
  saveToLocalStorage();
  saveBtn.textContent = '保存しました';
  setTimeout(()=> saveBtn.textContent = 'ブラウザに保存', 1500);
});
loadBtn.addEventListener('click', ()=>{
  const saved = localStorage.getItem('ts-shortbakes-current');
  if(saved){
    try { currentRecipe = JSON.parse(saved); renderCurrent(); loadBtn.textContent = '読み込み完了'; setTimeout(()=> loadBtn.textContent = 'ローカルから読み込み',1500); }
    catch(e){ alert('読み込みに失敗しました。'); }
  } else {
    alert('保存されたレシピが見つかりません。');
  }
});

// 表示補助
function flash(el){
  el.classList.add('flash');
  setTimeout(()=> el.classList.remove('flash'), 800);
}

// 初期化
document.addEventListener('DOMContentLoaded', init);