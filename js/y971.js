/* ====== 味付けデータ ======
 各レシピは { name, ingredientsText, categories:[] } の形式
 分量は任意の単位（比率）で表記しています。必要に応じて調整してください。
================================*/
const RECIPES = [
  { name: "照り焼きソース味", ingredientsText: "しょうゆ2・料理酒2・みりん2・砂糖1", categories:["こってり","甘辛"] },
  { name: "ガーリック醤油味", ingredientsText: "しょうゆ2・にんにく(すりおろし)1・オリーブ油1・黒胡椒", categories:["こってり","スパイシー"] },
  { name: "中華風オイスター味", ingredientsText: "オイスターソース2・しょうゆ1・ごま油0.3・砂糖0.5", categories:["こってり"] },
  { name: "塩だれシンプル味", ingredientsText: "塩小さじ1・料理酒1・ごま油1・にんにく少々", categories:["あっさり","さっぱり"] },
  { name: "レモン醤油さっぱり味", ingredientsText: "しょうゆ1・レモン汁1・みりん0.5・ごま油0.3", categories:["さっぱり","あっさり"] },
  { name: "和風だし塩味", ingredientsText: "だし顆粒1・みりん0.5・塩小さじ0.5", categories:["あっさり"] },
  { name: "海苔めんつゆ", ingredientsText: "めんつゆ1・みりん0.5・海苔0.3", categories:["さっぱり"] },
  { name: "めんつゆ昆布の佃煮", ingredientsText: "めんつゆ1・昆布の佃煮0.5", categories:["さっぱり"] },
  { name: "ピリ辛豆板醤味", ingredientsText: "豆板醤小さじ1・しょうゆ1・砂糖0.5・ごま油0.3", categories:["辛い","スパイシー"] },
  { name: "カレー風味", ingredientsText: "カレーパウダー1・めんつゆ0.5・塩0.5・オリーブ油0.3", categories:["スパイシー"] },
  { name: "中華甘酢あん", ingredientsText: "酢2・砂糖2・めんつゆ1・しょうゆ1・料理酒0.3", categories:["甘辛","さっぱり"] },
  { name: "みそごま油", ingredientsText: "味噌1・みりん0.5・だし顆粒0.3・ごま油少々", categories:["こってり"] },
  { name: "豆鼓風味", ingredientsText: "豆鼓醤1・しょうゆ1・ごま油0.5・砂糖0.5", categories:["こってり","スパイシー"] },
  { name: "バター醤油味", ingredientsText: "バター10g・しょうゆ1・砂糖0.2・黒胡椒少々", categories:["こってり"] },
  { name: "生姜醤油あっさり味", ingredientsText: "しょうゆ1・生姜(すりおろし)1・酒1・みりん0.5", categories:["あっさり"] },
  { name: "梅しそさっぱり味", ingredientsText: "梅干し1・しょうゆ0.5・ごま油0.2・しそ適量", categories:["さっぱり"] },
  { name: "オーロラソース味", ingredientsText: "ケチャップ1・マヨネーズ1・レモン少々", categories:["甘辛"] },
  { name: "キムチ風味", ingredientsText: "キムチ適量・めんつゆ0.5・ごま油0.1・ごま少々", categories:["辛い","スパイシー"] },
  { name: "甜麺醤甘辛味", ingredientsText: "甜麺醤1・砂糖0.5・しょうゆ0.5・ごま油0.3", categories:["こってり","甘辛"] },
  { name: "柚子胡椒ピリ辛味", ingredientsText: "柚子胡椒小さじ0.5・しょうゆ1・みりん0.5・ごま油0.3", categories:["辛い","さっぱり"] },
  { name: "ナンプラー香るエスニック味", ingredientsText: "ナンプラー1・レモン1・砂糖0.5・チリフレーク少々", categories:["スパイシー"] },
  { name: "黒酢のコク味", ingredientsText: "黒酢2・しょうゆ1・砂糖1・ごま油0.5", categories:["こってり","さっぱり"] },
  { name: "にんにくバター醤油味", ingredientsText: "にんにく1・バター10g・しょうゆ1・黒胡椒少々", categories:["こってり"] },
  { name: "和風ポン酢ゆず", ingredientsText: "ポン酢2・みりん0.5・顆粒だし0.5・柚子皮少々", categories:["さっぱり","あっさり"] },
  { name: "蜂蜜醤油甘辛味", ingredientsText: "しょうゆ1・はちみつ1・料理酒0.5・ごま油0.2", categories:["甘辛"] },
  { name: "チリソーススパイシー味", ingredientsText: "チリソース1・ケチャップ0.5・砂糖0.5・酢0.5", categories:["スパイシー"] },
  { name: "香味ネギ塩あっさり味", ingredientsText: "塩小さじ0.8・ネギみじん1・ごま油0.5・レモン少々", categories:["あっさり"] },
  { name: "エスニックピーナッツ味", ingredientsText: "ピーナッツバター1・ナンプラー0.5・レモン0.5・砂糖0.5", categories:["スパイシー"] },
  { name: "甘酢しょうが風味", ingredientsText: "酢1.5・砂糖1・しょうがすりおろし1・しょうゆ0.3", categories:["さっぱり"] },
  { name: "バジルガーリック味", ingredientsText: "バジルみじん1・にんにく1・オリーブオイル1・塩少々", categories:["あっさり"] },
  { name: "にんにく味噌こってり味", ingredientsText: "味噌1・みりん1・にんにく0.5・ごま油0.3", categories:["こってり"] },
  { name: "ホイコーロー風甜麺醤", ingredientsText: "甜麺醤1・豆板醤0.3・しょうゆ0.8・砂糖0.3", categories:["こってり","甘辛"] },
  { name: "ガーリックレモンさっぱり味", ingredientsText: "にんにく0.5・レモン1・オリーブオイル0.8・塩少々", categories:["さっぱり"] },
  { name: "サルサメキシカン味", ingredientsText: "トマト角切り1・玉ねぎみじん0.5・チリパウダー0.3・塩", categories:["スパイシー"] },
  { name: "バルサミコ甘酸っぱい味", ingredientsText: "バルサミコ酢1・はちみつ0.5・しょうゆ0.3・バター少々", categories:["甘辛","さっぱり"] },
  { name: "赤味噌にんにく甘辛味", ingredientsText: "赤味噌1・みりん1・にんにく0.3・砂糖0.5", categories:["こってり","甘辛"] },
  { name: "梅マヨあっさり味", ingredientsText: "梅干し1・マヨ0.8・酢少々・しょうゆ少々", categories:["あっさり"] },
  { name: "ねぎ塩レモンさっぱり味", ingredientsText: "塩0.8・ねぎみじん1・レモン0.8・ごま油0.3", categories:["さっぱり","あっさり"] },
  { name: "黒胡椒ガーリックしょうゆ", ingredientsText: "黒胡椒適量・にんにく0.5・しょうゆ0.8・オリーブ油0.5", categories:["スパイシー"] },
  { name: "豆板醤ごま味", ingredientsText: "豆板醤0.8・ごま油0.5・しょうゆ0.8・砂糖0.3", categories:["辛い"] },
  { name: "コチュジャン甘辛味", ingredientsText: "コチュジャン1・砂糖0.5・しょうゆ0.5・ごま油0.3", categories:["甘辛","辛い"] },
  { name: "香草レモングラス風味", ingredientsText: "レモングラス少々・ナンプラー0.5・砂糖0.3・レモン0.5", categories:["さっぱり","スパイシー"] },
  { name: "味ぽん和風ごま", ingredientsText: "味ぽん2・ごま油0.2・ごま少々・柚子皮少々", categories:["さっぱり","あっさり"] },
  { name: "ガーリックチリ油スパイシー", ingredientsText: "ラー油0.8・にんにく0.5・しょうゆ0.5・砂糖少々", categories:["スパイシー","辛い"] },
  { name: "カレー甘口風", ingredientsText: "みりん1・カレーパウダー0.5・コンソメ少々", categories:["こってり","甘辛"] },
  { name: "わさび醤油マヨ", ingredientsText: "しょうゆ1・マヨネーズ1・みりん0.3・わさび少々", categories:["こってり","辛い"] },
  { name: "ハーブ豆乳こってり味", ingredientsText: "豆乳1・バター0.5・めんつゆ0.5・ハーブ少々", categories:["こってり"] },
  { name: "豆乳バジル味", ingredientsText: "豆乳1・バジルみじん0.5・めんつゆ0.5", categories:["さっぱり","あっさり"] },
  { name: "ソースうま味", ingredientsText: "ソース1・料理酒0.5・みりん0.5", categories:["こってり"] },
  { name: "黒胡椒塩だれ味", ingredientsText: "塩1・黒胡椒多め・酒0.5・ごま油0.3", categories:["あっさり"] },
  { name: "中華香味油", ingredientsText: "香味油1・にんにく0.5・しょうゆ0.5・砂糖少々", categories:["こってり"] },
  { name: "レモングレーズさっぱり味", ingredientsText: "レモン汁1・はちみつ0.5・バター0.2", categories:["さっぱり"] },
  { name: "生姜黒酢あっさり味", ingredientsText: "生姜0.8・黒酢1・しょうゆ0.5・砂糖0.3", categories:["あっさり","さっぱり"] },
  { name: "豆乳クリーミー味", ingredientsText: "豆乳1・味噌0.5・ごま油0.3・塩少々", categories:["こってり"] },
  { name: "にんにく醤油ナッツ", ingredientsText: "にんにく0.5・しょうゆ1・砕きナッツ0.5・ごま油0.2", categories:["こってり"] },
  { name: "香味おろしポン酢味", ingredientsText: "おろし大根1・ポン酢1・ねぎ少々", categories:["さっぱり"] },
  { name: "タンドリースパイス味", ingredientsText: "ヨーグルト1・タンドリースパイス1・レモン0.5・塩", categories:["スパイシー"] },
  { name: "サテ風ピリ辛ナッツ", ingredientsText: "ピーナッツソース1・チリ0.3・ナンプラー0.3", categories:["スパイシー"] },
  { name: "瀬戸内レモン塩味", ingredientsText: "レモン1・塩0.8・オリーブ油0.3", categories:["さっぱり"] },
  { name: "にんにく味噌だれ味", ingredientsText: "味噌1・にんにく0.5・みりん0.5・砂糖0.2", categories:["こってり","甘辛"] },
  { name: "カボスぽん酢", ingredientsText: "カボス汁1・ぽん酢1・だし顆粒0.5・ごま油少々", categories:["さっぱり"] },
  { name: "ジンジャーハニー甘辛味", ingredientsText: "生姜0.8・はちみつ1・しょうゆ0.5", categories:["甘辛"] },
  { name: "柑橘ソルトオリーブ", ingredientsText: "オレンジ汁1・塩0.5・オリーブ油0.3", categories:["さっぱり"] },
  { name: "アジアンめんつゆ風味", ingredientsText: "めんつゆ1・ナンプラー0.5・砂糖0.3・レモン少々", categories:["スパイシー"] },
  { name: "豆腐チリあっさり味", ingredientsText: "絹ごし豆腐1・チリソース0.5・しょうゆ0.3", categories:["あっさり","辛い"] },
  { name: "XO醤贅沢こってり味", ingredientsText: "XO醤1・しょうゆ0.5・ごま油0.3・砂糖少々", categories:["こってり"] },
  { name: "レモングラスナンプラー", ingredientsText: "レモングラス少々・ナンプラー0.8・砂糖0.3", categories:["さっぱり","スパイシー"] },
  { name: "黒糖甘辛コク味", ingredientsText: "黒糖1・しょうゆ0.8・みりん0.5・ごま油0.2", categories:["甘辛"] },
  { name: "オイスターにんにく", ingredientsText: "オイスター1・にんにく0.5・しょうゆ0.5・砂糖0.2", categories:["こってり"] },
  { name: "さっぱり梅じゃこ味", ingredientsText: "梅干し1・じゃこ0.5・しょうゆ0.3・ごま油少々", categories:["さっぱり"] },
  { name: "赤味噌の回鍋肉風", ingredientsText: "赤味噌1・みりん1・砂糖0.6・料理酒0.3・しょうゆ0.3", categories:["こってり","甘辛"] },
  { name: "ホットチリレモン味", ingredientsText: "チリパウダー0.5・レモン1・塩少々", categories:["辛い","さっぱり"] },
  { name: "黒ゴマ味噌クリーミー味", ingredientsText: "黒ごまペースト0.8・味噌0.8・みりん0.3", categories:["こってり"] },
  { name: "和風柚子塩あっさり味", ingredientsText: "塩0.8・柚子皮少々・だし少々", categories:["あっさり"] },
  { name: "梅昆布茶", ingredientsText: "梅肉0.8・昆布茶少々・ごま油0.2", categories:["さっぱり"] },
  { name: "スイートチリ甘辛味", ingredientsText: "スイートチリ1・レモン0.3・ナンプラー少々", categories:["甘辛"] },
  { name: "コクねぎ味噌", ingredientsText: "ねぎみじん1・味噌1・みりん0.5・ごま油0.3", categories:["こってり"] },
  { name: "香るカレーしょうゆ味", ingredientsText: "カレーパウダー0.8・しょうゆ0.8・バター少々", categories:["スパイシー"] },
  { name: "コンソメカレー味", ingredientsText: "カレーパウダー0.8・コンソメ0.3", categories:["スパイシー"] },
  { name: "梅おかか", ingredientsText: "梅干1・かつお節0.5・しょうゆ0.2", categories:["さっぱり"] },
  { name: "バルサミコ味噌甘辛味", ingredientsText: "バルサミコ0.8・味噌0.5・はちみつ0.3", categories:["甘辛"] },
  { name: "香味オリーブ塩味", ingredientsText: "オリーブ油1・にんにく0.3・塩0.8", categories:["あっさり"] },
  { name: "ピーナッツチリ甘辛味", ingredientsText: "ピーナッツ0.8・チリソース0.5・砂糖0.3", categories:["甘辛","スパイシー"] },
  { name: "中華ごま酢だれ味", ingredientsText: "酢1.5・ごま油0.5・砂糖0.5・しょうゆ0.3", categories:["さっぱり"] },
  { name: "黒酢生姜コク味", ingredientsText: "黒酢1.5・生姜0.8・砂糖0.5・ごま油0.3", categories:["こってり","さっぱり"] },
  { name: "にんにくラー油辛味", ingredientsText: "ラー油0.8・にんにく0.5・しょうゆ0.5", categories:["辛い"] },
  { name: "煮物風わさび醤油", ingredientsText: "本わさび少々・しょうゆ0.3・麵つゆ0.3・みりん0.3", categories:["あっさり"] },
  { name: "にんにく醤油バルサミコ味", ingredientsText: "にんにく0.5・しょうゆ0.8・バルサミコ0.3", categories:["こってり"] },
  { name: "トムヤム風エスニック味", ingredientsText: "トムヤムペースト0.8・ナンプラー0.5・レモン0.5", categories:["スパイシー"] },
  { name: "トムヤム風だし味", ingredientsText: "トムヤムペースト0.8・めんつゆ0.5・みりん0.3", categories:["スパイシー"] },
  { name: "黒胡麻だれ甘辛味", ingredientsText: "黒ごまペースト0.8・しょうゆ0.5・砂糖0.5", categories:["甘辛"] },
  { name: "グリーンカレー風味", ingredientsText: "グリーンカレーペースト1・ココナッツミルク1・ナンプラー0.3", categories:["スパイシー"] },
  { name: "柚子胡椒マヨ辛味", ingredientsText: "柚子胡椒0.4・マヨ0.8・レモン少々", categories:["辛い"] },
  { name: "レモン醤油バター味", ingredientsText: "レモン1・しょうゆ0.8・バター0.8", categories:["こってり","さっぱり"] },
  { name: "ごまポン酢", ingredientsText: "ポン酢1.2・すりごま0.5・ごま油0.2", categories:["あっさり"] },
  { name: "ラー油香るピリ辛味", ingredientsText: "ラー油0.8・しょうゆ0.5・酢0.3", categories:["辛い","スパイシー"] },
  { name: "梅おろしポン酢", ingredientsText: "梅肉1・大根おろし1・ポン酢0.5", categories:["さっぱり"] },
  { name: "赤味噌の甘辛", ingredientsText: "赤味噌1・みりん1・だし顆粒0.5・はちみつ少々", categories:["甘辛","こってり"] },
  { name: "四川風花椒ピリ辛味", ingredientsText: "花椒少々・豆板醤0.5・しょうゆ0.5", categories:["辛い","スパイシー"] },
  { name: "レモングラスココナッツ味", ingredientsText: "レモングラス0.5・ココナッツミルク0.8・ナンプラー0.3", categories:["さっぱり","スパイシー"] },
  { name: "ダブル味噌", ingredientsText: "赤味噌0.5・白味噌0.5・みりん1・砂糖0.3・料理酒0.3", categories:["甘辛","こってり"] },
  { name: "和風にんにく黒酢", ingredientsText: "黒酢1・にんにく0.4・しょうゆ0.4", categories:["さっぱり"] },
  { name: "柚子味噌甘辛味", ingredientsText: "柚子味噌1・砂糖0.3・みりん0.3", categories:["甘辛"] },
  { name: "バターガーリック醤油", ingredientsText: "バター10g・にんにく0.5・しょうゆ0.8", categories:["こってり"] },
  { name: "ハニーマスタード甘辛味", ingredientsText: "はちみつ1・マスタード0.5・酢0.3", categories:["甘辛"] },
  { name: "ピリ辛ニラ風味", ingredientsText: "ニラ1・豆板醤0.5・ごま油0.3・しょうゆ0.3", categories:["辛い","スパイシー"] },
  { name: "わさびレモン味", ingredientsText: "だし顆粒1・レモン0.3・わさび少々・塩少々", categories:["あっさり"] },
  { name: "にんにく醤油ポン酢味", ingredientsText: "にんにく0.5・醤油0.8・ポン酢0.5", categories:["さっぱり"] },
  { name: "ピーナッツ甘辛エスニック", ingredientsText: "ピーナッツバター0.8・ナンプラー0.4・砂糖0.3", categories:["甘辛","スパイシー"] },
  { name: "バター醤油ガーリック味", ingredientsText: "バター10g・にんにく0.5・しょうゆ0.8", categories:["こってり"] },
  { name: "柑橘胡椒", ingredientsText: "オレンジ汁0.8・胡椒少々・塩0.3", categories:["さっぱり"] },
  { name: "味噌バターうま味", ingredientsText: "味噌1・みりん1・バター0.5", categories:["甘辛","こってり"] },
  { name: "梅ラー油ピリ辛味", ingredientsText: "梅肉0.8・ラー油0.4・醤油0.2", categories:["辛い","さっぱり"] },
  { name: "味噌マスタード", ingredientsText: "味噌1・マスタード0.5・はちみつ0.3", categories:["こってり"] },
  { name: "アジアンハーブ", ingredientsText: "コリアンダー少々・ミント少々・ナンプラー0.4", categories:["さっぱり","スパイシー"] },
  { name: "マスタードクリーミー味", ingredientsText: "マヨネーズ1・マスタード0.6・レモン少々", categories:["こってり"] },
  { name: "レモンバルサミコ甘酸っぱい味", ingredientsText: "レモン0.8・バルサミコ0.5・はちみつ0.2", categories:["さっぱり"] },
  { name: "ココナッツカレー風味", ingredientsText: "ココナッツミルク1・カレーペースト0.8・ナンプラー0.3", categories:["スパイシー"] },
  { name: "柚子塩こんぶ", ingredientsText: "柚子塩0.6・こんぶだし少々・ごま油0.2", categories:["あっさり"] },
  { name: "バジルチーズ", ingredientsText: "バジル0.6・粉チーズ0.8・オリーブ油0.3", categories:["こってり"] },
  { name: "醤油にんにくピリ辛", ingredientsText: "しょうゆ1・にんにく0.5・唐辛子少々", categories:["辛い"] },
  { name: "マヨぽん酢レモン", ingredientsText: "マヨ0.6・ぽん酢0.8・レモン少々", categories:["さっぱり"] },
  { name: "味噌にんにくバター", ingredientsText: "味噌1・にんにく0.5・バター0.8", categories:["こってり"] },
  { name: "ジンジャーレモン風味", ingredientsText: "生姜0.6・レモン0.8・しょうゆ0.3", categories:["あっさり"] },
  { name: "チリライム味", ingredientsText: "チリパウダー0.6・ライム1・塩少々", categories:["スパイシー"] },
  { name: "にんにく唐辛子香味味", ingredientsText: "にんにく0.5・唐辛子0.5・しょうゆ0.5", categories:["辛い","スパイシー"] },
  { name: "梅胡麻しょうゆ", ingredientsText: "梅干0.8・すりごま0.5・しょうゆ0.2", categories:["さっぱり"] },
  { name: "黒酢蜂蜜コク味", ingredientsText: "黒酢1・はちみつ0.8・しょうゆ0.3", categories:["甘辛","こってり"] },
  { name: "にんにく醤油カレー風味", ingredientsText: "にんにく0.4・しょうゆ0.6・カレー0.5", categories:["スパイシー"] },
  { name: "甘酢しょうゆ", ingredientsText: "酢1.5・砂糖1・しょうゆ0.5", categories:["さっぱり"] },
  { name: "ねぎ味ポン酢", ingredientsText: "ねぎみじん1・ポン酢1・ごま油少々", categories:["あっさり"] },
  { name: "味噌黒胡椒", ingredientsText: "味噌1・黒胡椒0.4・みりん0.3", categories:["こってり"] },
  { name: "ピリ辛ガラムマサラ味", ingredientsText: "ガラムマサラ0.5・チリ0.4・塩少々", categories:["スパイシー"] },
  { name: "レモンバター醤油味", ingredientsText: "レモン1・バター0.8・しょうゆ0.5", categories:["こってり","さっぱり"] },
  { name: "ナッツバター甘辛味", ingredientsText: "ナッツバター0.8・しょうゆ0.4・砂糖0.3", categories:["こってり","甘辛"] },
  { name: "にんにく味噌マヨ", ingredientsText: "にんにく0.4・味噌0.8・マヨ0.8", categories:["こってり"] },
  { name: "塩レモン地中海風", ingredientsText: "塩0.8・レモン1・オリーブ油0.3", categories:["さっぱり"] },
  { name: "甘辛味噌ガーリック味", ingredientsText: "味噌1・みりん1・にんにく0.5・唐辛子0.3", categories:["スパイシー"] },
  { name: "醤油みりん照り甘味", ingredientsText: "しょうゆ1・みりん1・砂糖0.5", categories:["甘辛","こってり"] },
  { name: "ごま唐辛子塩だれ味", ingredientsText: "すりごま0.6・塩0.8・唐辛子少々", categories:["辛い"] },
  { name: "和風甘酢おろし味", ingredientsText: "酢1・砂糖0.5・おろし生姜0.5", categories:["さっぱり"] },
  { name: "柚子胡椒醤油", ingredientsText: "柚子胡椒0.4・しょうゆ0.8・みりん0.2", categories:["さっぱり","辛い"] },
  { name: "オレンジマーマレード", ingredientsText: "マーマレード1・しょうゆ0.5・レモン少々", categories:["甘辛"] },
  { name: "黒糖みりん醤油", ingredientsText: "黒糖1・しょうゆ1・みりん0.5", categories:["こってり"] },
  { name: "ピリ辛豆鼓味", ingredientsText: "豆鼓醤0.8・豆板醤0.3・ごま油0.3", categories:["スパイシー"] }
];

/* ====== DOM参照 ====== */
const titleEl = document.getElementById('flavor-title');
const ingEl = document.getElementById('flavor-ingredients');
const copyBtn = document.getElementById('copy-btn');
const saveBtn = document.getElementById('save-btn');
const shareX = document.getElementById('share-x');
const shareFB = document.getElementById('share-fb');
const shareLINE = document.getElementById('share-line');
const recipesGrid = document.getElementById('recipes-grid');

/* ====== 初期一覧表示 ====== */
function renderAllList(){
  recipesGrid.innerHTML = '';
  RECIPES.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<strong>${escapeHtml(r.name)}</strong><span>${escapeHtml(r.ingredientsText)}</span>`;
    div.addEventListener('click', ()=> displayRecipe(r));
    recipesGrid.appendChild(div);
  });
}
renderAllList();

function randFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }

function displayRecipe(recipe){
  titleEl.textContent = recipe.name;
  ingEl.textContent = "材料 " + recipe.ingredientsText;
  updateShareLinks(recipe);
}

function pickRandomAny(){
  return randFrom(RECIPES);
}
function pickRandomByCategory(cat){
  const candidates = RECIPES.filter(r=> r.categories && r.categories.includes(cat));
  return candidates.length ? randFrom(candidates) : null;
}

document.querySelectorAll('[data-action]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const action = btn.dataset.action;
    if(action === 'today'){
      const r = pickRandomAny();
      displayRecipe(r);
    } else if(action === 'category'){
      const cat = btn.dataset.cat;
      const r = pickRandomByCategory(cat);
      if(r){
        displayRecipe(r);
      } else {
        titleEl.textContent = `${cat} の候補がありません`;
        ingEl.textContent = "新しい味付けを追加してください";
      }
    }
  });
});

copyBtn.addEventListener('click', async ()=>{
  const txt = `${titleEl.textContent}\n${ingEl.textContent}`;
  try{
    await navigator.clipboard.writeText(txt);
    copyBtn.textContent = 'コピー済み';
    setTimeout(()=> copyBtn.textContent = 'コピー', 1400);
  }catch(e){
    const ta = document.createElement('textarea');
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); copyBtn.textContent='コピー済み'; setTimeout(()=> copyBtn.textContent='コピー',1400); }catch(e){}
    document.body.removeChild(ta);
  }
});

function downloadDataURL(dataURL, filename){
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

saveBtn.addEventListener('click', ()=>{
  const title = titleEl.textContent || '';
  const body = ingEl.textContent || '';
  const padding = 28;
  const width = Math.min(1200, Math.max(600, window.innerWidth * 0.9));
  const lineHeight = 28;
  const titleFont = "700 28px 'Noto Sans JP', sans-serif";
  const bodyFont = "400 20px 'Noto Sans JP', sans-serif";
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = titleFont;
  const maxTextWidth = width - padding*2;
  const titleLines = wrapTextLines(ctx, title, maxTextWidth);
  ctx.font = bodyFont;
  const bodyLines = wrapTextLines(ctx, body, maxTextWidth);
  const height = padding*2 + titleLines.length * lineHeight + bodyLines.length * lineHeight + 40;
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#111827';
  ctx.fillRect(0,0,canvas.width,56);
  ctx.fillStyle = '#fff';
  ctx.font = "700 18px 'Noto Sans JP', sans-serif";
  ctx.fillText('野菜炒め味付けジェネレーター', 16, 36);
  let y = 56 + 24;
  ctx.fillStyle = '#111827';
  ctx.font = titleFont;
  titleLines.forEach(line=>{
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });
  y += 6;
  ctx.font = bodyFont;
  ctx.fillStyle = '#333';
  bodyLines.forEach(line=>{
    ctx.fillText(line, padding, y);
    y += lineHeight;
  });
  const dataURL = canvas.toDataURL('image/png');
  downloadDataURL(dataURL, (title || 'recipe') + '.png');
});

function wrapTextLines(ctx, text, maxWidth){
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for(let i=0;i<words.length;i++){
    const test = line ? (line + ' ' + words[i]) : words[i];
    if(ctx.measureText(test).width > maxWidth && line){
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if(line) lines.push(line);
  for(let i=0;i<lines.length;i++){
    if(ctx.measureText(lines[i]).width > maxWidth){
      lines.splice(i,1, ...splitByChar(ctx, lines[i], maxWidth));
    }
  }
  return lines;
}
function splitByChar(ctx, text, maxWidth){
  let cur = '';
  const out = [];
  for(const ch of text){
    const test = cur + ch;
    if(ctx.measureText(test).width > maxWidth && cur){
      out.push(cur);
      cur = ch;
    } else cur = test;
  }
  if(cur) out.push(cur);
  return out;
}

function updateShareLinks(recipe){
  const pageUrl = location.href.split('#')[0];
  const text = `${recipe.name} - ${recipe.ingredientsText} （野菜炒めの味付け）`;
  const encText = encodeURIComponent(text);
  const encUrl = encodeURIComponent(pageUrl);
  shareX.href = `https://x.com/intent/tweet?text=${encText}&url=${encUrl}`;
  shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}&quote=${encText}`;
  shareLINE.href = `https://social-plugins.line.me/lineit/share?text=${encText}%20${encUrl}`;
  [shareX, shareFB, shareLINE].forEach(a=>{ a.target='_blank'; a.rel='noopener noreferrer'; });
}

(function init(){
  const r = pickRandomAny();
  displayRecipe({ name: "上記の「ボタン」を押して下さい", ingredientsText: "比率が表示されます" });
})();