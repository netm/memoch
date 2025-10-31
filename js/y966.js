// 全機能 JS（ページ内に直接読み込む想定）
// ボタン操作、ランダム表示、コピー、PNG保存、SNSシェア、100項目をDOMに出力

const methods = [
  /* 乾燥系 (25) */
  {cat:'乾燥', text:'マイクロファイバークロスで乾拭きする'},
  {cat:'乾燥', text:'柔らかい刷毛で払い落とす'},
  {cat:'乾燥', text:'静電気防止スプレーを布に吹きかけて拭く'},
  {cat:'乾燥', text:'粘着ロールでソファや服の埃を取る'},
  {cat:'乾燥', text:'掃除機の先端ノズルで表面を吸引する'},
  {cat:'乾燥', text:'使い捨てウェットシートで乾拭き後に乾拭きする'},
  {cat:'乾燥', text:'換気して埃を外に出す'},
  {cat:'乾燥', text:'古いTシャツを布にして拭く'},
  {cat:'乾燥', text:'メラミンスポンジで優しく擦る'},
  {cat:'乾燥', text:'柔らかいゴム製ブロックで埃を集める'},
  {cat:'乾燥', text:'化繊のブラシで繊維の間の埃を掻き出す'},
  {cat:'乾燥', text:'家具の上を定期的に乾拭きする習慣を付ける'},
  {cat:'乾燥', text:'ブラインドは下から上へ乾拭きする'},
  {cat:'乾燥', text:'本棚は本を取り出して乾拭きする'},
  {cat:'乾燥', text:'植物の葉は乾いた布で優しく払う'},
  {cat:'乾燥', text:'絵画や額縁は柔らかい布で軽く払う'},
  {cat:'乾燥', text:'蛍光灯や照明器具は電源オフで乾拭き'},
  {cat:'乾燥', text:'エアコン外装は乾いた布で拭き取る'},
  {cat:'乾燥', text:'押し入れの開閉時に埃が舞わないよう注意'},
  {cat:'乾燥', text:'ラグやカーペットは立てて叩かず掃除機で吸う'},
  {cat:'乾燥', text:'ファンや換気扇の羽はブラシで乾拭き'},
  {cat:'乾燥', text:'電子機器はブロワー（空気）で吹き飛ばす'},
  {cat:'乾燥', text:'ぬいぐるみはブラッシングで埃を落とす'},
  {cat:'乾燥', text:'衣類は衣類ブラシで埃を払う'},
  {cat:'乾燥', text:'窓枠の溝は綿棒や細い刷毛で乾拭きする'},
  {cat:'乾燥', text:'柔らかい革張り用ブラシで家具表面を払う'},
  {cat:'乾燥', text:'静電気を帯びにくい布で家電を軽く拭く'},
  {cat:'乾燥', text:'歯ブラシで細かい溝の埃を掻き出す'},
  {cat:'乾燥', text:'羽根付きモップで天井や高所の埃を取る'},
  {cat:'乾燥', text:'ふきんを使って家電の通気口を軽くなぞる'},
  {cat:'乾燥', text:'スエード調の布で家具表面を滑らせて埃を集める'},
  {cat:'乾燥', text:'ブラシ付きラップでランプやシェードを払う'},
  {cat:'乾燥', text:'トイレットペーパー芯に布を巻いて裂け目の埃を取る'},
  {cat:'乾燥', text:'伸縮式のハンドルにブラシを付け高所を払う'},
  {cat:'乾燥', text:'合成繊維のブラシでソファの溝を掃き出す'},
  {cat:'乾燥', text:'乾いたスポンジで窓枠の埃を吸着させる'},
  {cat:'乾燥', text:'カメラ用のソフトブラシで精密機器を払う'},
  {cat:'乾燥', text:'毛先の柔らかい塗装用ブラシで額縁を掃う'},
  {cat:'乾燥', text:'フローリングワイパーで家具の裏側を軽く払う'},
  {cat:'乾燥', text:'ペット用ブラシで布製ソファをブラッシングする'},
  {cat:'乾燥', text:'手袋型の埃取りで細かい部分を拭く'},
  {cat:'乾燥', text:'古い歯ブラシで空調の格子をこする'},
  {cat:'乾燥', text:'紙製の粘着乾式ローラーで小物の埃を取る'},
  {cat:'乾燥', text:'新聞紙で軽く包み叩いて埃を落とす'},
  {cat:'乾燥', text:'天然毛のブラシで家具の凹凸部を払う'},
  {cat:'乾燥', text:'乾いたコットンで電気スイッチ周りを拭く'},
  {cat:'乾燥', text:'カーペットブラシで表面の埃を浮かせる'},
  {cat:'乾燥', text:'薄手の綿布で家具の足元を丁寧に拭く'},
  {cat:'乾燥', text:'マジックテープ式の埃取りパッドで細部を掃う'},
  {cat:'乾燥', text:'漆器用の柔らかい布で和家具の埃を払う'},
  {cat:'乾燥', text:'紙やすりのような素材は使わず柔らかい素材で拭く'},
  {cat:'乾燥', text:'乾いた綿棒でスイッチの隙間を掃除する'},
  {cat:'乾燥', text:'エアフローを使って窓下の埃を外へ運ぶようにする'},
  {cat:'乾燥', text:'長柄のモップで棚の上面を乾拭きする'},
  {cat:'乾燥', text:'衣類の毛玉取り機で布表面の埃を絡め取る'},

  /* 水分系 (25) */
  {cat:'水分', text:'ぬれたマイクロファイバーで拭き取る'},
  {cat:'水分', text:'水に中性洗剤を薄め布で拭く'},
  {cat:'水分', text:'アルコールを薄めたもので消毒兼拭き掃除する'},
  {cat:'水分', text:'スプレーボトルで少量の水を吹きかけて拭く'},
  {cat:'水分', text:'蒸しタオルで固着した埃を柔らかくする'},
  {cat:'水分', text:'ガラス面は水のみで拭いてから乾拭きする'},
  {cat:'水分', text:'木製家具は専用クリーナーを布に付け拭く'},
  {cat:'水分', text:'革製品は専用クリーナーと布で優しく拭く'},
  {cat:'水分', text:'キッチンの油汚れはぬるま湯で溶かして拭く'},
  {cat:'水分', text:'窓サッシの溝はブラシと水で洗い流す'},
  {cat:'水分', text:'造花は霧吹きで埃を落として乾かす'},
  {cat:'水分', text:'絨毯の表面は水拭きしてから乾燥させる'},
  {cat:'水分', text:'シャワー室の棚は水で洗ってから拭く'},
  {cat:'水分', text:'家具の目地は濡れ布で丁寧に拭く'},
  {cat:'水分', text:'家電の外装は少量の水で湿らせた布で拭く（電源オフ）'},
  {cat:'水分', text:'窓の網戸は外して水洗いする'},
  {cat:'水分', text:'浴室の換気扇周りは水拭きでカビ予防も兼ねる'},
  {cat:'水分', text:'ランプシェードはぬるま湯で拭いて乾かす'},
  {cat:'水分', text:'食器棚の中は柔らかい濡れ布で拭く'},
  {cat:'水分', text:'犬猫の毛は濡れた布で集めるとまとまりやすい'},
  {cat:'水分', text:'キーボードは濡れ布で表面を拭き、乾燥させる'},
  {cat:'水分', text:'窓ガラスは水と酢で拭くと曇りにくい'},
  {cat:'水分', text:'ベッドのヘッドボードは濡れ布で拭いて乾かす'},
  {cat:'水分', text:'ランニングシューズの表面は濡れ布で拭く'},
  {cat:'水分', text:'換気経路周りは水拭きで付着埃を除去する'},
  {cat:'水分', text:'薄めた酢水で拭いて除菌と埃除去を同時に行う'},
  {cat:'水分', text:'重曹を溶かしたぬるま湯でしつこい埃汚れを落とす'},
  {cat:'水分', text:'お湯で湿らせたタオルを絞って家具を拭く'},
  {cat:'水分', text:'専用のガラスクリーナーで窓を水拭きする'},
  {cat:'水分', text:'布を水で湿らせ、最後に乾いた布で水分を取る'},
  {cat:'水分', text:'エタノール薄め液で家電外装を軽く拭く（電源オフ）'},
  {cat:'水分', text:'ミクロファイバーを水で濡らし固く絞って拭く'},
  {cat:'水分', text:'中性洗剤で希釈したスプレーで拭き取り洗浄する'},
  {cat:'水分', text:'ぬるま湯に少量の洗剤で布を湿らせて拭く'},
  {cat:'水分', text:'蒸気クリーナーで布製品やカーペットの埃を浮かせる'},
  {cat:'水分', text:'布を少し湿らせて本棚の棚板を拭く'},
  {cat:'水分', text:'スポンジで窓枠の汚れを落とし最後に拭き取る'},
  {cat:'水分', text:'濡れ布で照明カバーを拭いてから陰干しする'},
  {cat:'水分', text:'濡れティッシュで手軽に小物の埃を拭く'},
  {cat:'水分', text:'水で薄めた漂白剤は使用上の注意を守って使う'},
  {cat:'水分', text:'ぬるま湯で洗えるクッションは水洗いして乾燥させる'},
  {cat:'水分', text:'濡れた歯ブラシで細かい溝を洗い流す'},
  {cat:'水分', text:'網戸は水で流しながらブラシでこすり洗いする'},
  {cat:'水分', text:'布製ランプシェードは部分洗いして陰干しする'},
  {cat:'水分', text:'キッチンのタイル目地はブラシと水で擦る'},
  {cat:'水分', text:'ぬれた布で植物の葉を拭き光合成を助ける'},
  {cat:'水分', text:'木製家具は濡れ布で拭いた後すぐ乾拭きする'},
  {cat:'水分', text:'革製品は専用の湿らせた布で汚れを落とす'},
  {cat:'水分', text:'スプレー＋拭き取りの二段階で汚れを残さない'},
  {cat:'水分', text:'濡れた綿棒で精密機器の外周を優しく拭く'},
  {cat:'水分', text:'濡れタオルでカーテンの表面の埃を押し出す'},
  {cat:'水分', text:'重曹ペーストで頑固な汚れをスポンジで落とす'},
  {cat:'水分', text:'ぬるま湯に浸して固く絞った布で窓枠を拭く'},
  {cat:'水分', text:'専用クリーナーを布に含ませて拭き取り仕上げる'},
  {cat:'水分', text:'掃除後は換気をして湿気を素早く飛ばす'},

  /* 家電系 (25) */
  {cat:'家電', text:'掃除機でHEPAフィルターを使い吸引する'},
  {cat:'家電', text:'ロボット掃除機を毎日稼働させる'},
  {cat:'家電', text:'空気清浄機で浮遊粉塵を減らす'},
  {cat:'家電', text:'衣類用スチーマーで繊維の埃を吹き飛ばす'},
  {cat:'家電', text:'ハンドヘルド掃除機で家具の隙間を吸う'},
  {cat:'家電', text:'エアブロワーで電子機器の埃を吹き飛ばす'},
  {cat:'家電', text:'加湿器のフィルター清掃で雑菌の埃を抑制する'},
  {cat:'家電', text:'窓用バキュームクリーナーでガラスの埃を取り除く'},
  {cat:'家電', text:'サイクロン掃除機で目に見えない埃も吸引'},
  {cat:'家電', text:'衣類乾燥機のフィルター掃除を習慣化する'},
  {cat:'家電', text:'エアコンのフィルターを定期的に掃除する'},
  {cat:'家電', text:'掃除機のブラシロールを清掃する'},
  {cat:'家電', text:'UV照射機能付き空気清浄機で除菌も行う'},
  {cat:'家電', text:'電子レンジやトースターの外側は布で拭く'},
  {cat:'家電', text:'PCモニターは乾いた布、必要なら微量の水で拭く'},
  {cat:'家電', text:'掃除機アタッチメントを用途別に使い分ける'},
  {cat:'家電', text:'換気扇は取り外して分解洗浄する'},
  {cat:'家電', text:'エアダスターを短時間だけ使用する'},
  {cat:'家電', text:'加湿器は清掃してカルキや埃を防ぐ'},
  {cat:'家電', text:'冷蔵庫の上は定期的に掃除機で吸い取る'},
  {cat:'家電', text:'プリンターの給紙部は埃が詰まらないよう清掃'},
  {cat:'家電', text:'テレビ背面は低速ファンで埃を排出する工夫を'},
  {cat:'家電', text:'スピーカーのグリルは外して清掃する'},
  {cat:'家電', text:'循環ファン搭載の空気清浄機を部屋中央に置く'},

  /* 予防系 (25) */
  {cat:'予防', text:'定期的に掃除するスケジュールを作る'},
  {cat:'予防', text:'床に物を置かず拭き掃除しやすくする'},
  {cat:'予防', text:'玄関で靴を脱ぐ習慣をつける'},
  {cat:'予防', text:'布製品はカバーを付けて汚れを防ぐ'},
  {cat:'予防', text:'窓をこまめに開けて換気をする'},
  {cat:'予防', text:'空気清浄機を運転して浮遊粉塵を減らす'},
  {cat:'予防', text:'ペットの抜け毛はこまめにブラッシングする'},
  {cat:'予防', text:'洗濯物は室内にため込まない'},
  {cat:'予防', text:'収納は蓋付きボックスを使う'},
  {cat:'予防', text:'フィルター類は交換時期を守る'},
  {cat:'予防', text:'カーテンはこまめに洗濯または掃除する'},
  {cat:'予防', text:'ホコリが付きやすい場所に布を敷く'},
  {cat:'予防', text:'クローゼットは通気を良くする'},
  {cat:'予防', text:'雑誌や紙類は立てて収納する'},
  {cat:'予防', text:'空気の流れを遮らない家具配置にする'},
  {cat:'予防', text:'定期的に換気扇の運転時間を増やす'},
  {cat:'予防', text:'玄関にマットを置き砂埃を減らす'},
  {cat:'予防', text:'ベッド下は物を置かず掃除しやすく'},
  {cat:'予防', text:'作業スペースは使い終わったらすぐ片付ける'},
  {cat:'予防', text:'窓の隙間を塞いで外埃の侵入を防ぐ'},
  {cat:'予防', text:'掃除用具を手近に収納してすぐ使えるようにする'},
  {cat:'予防', text:'季節ごとに大掃除リストを作る'},
  {cat:'予防', text:'空気の入口にフィルターを追加する'},
  {cat:'予防', text:'室内植物は埃を落とす効果のある種類を選ぶ'}
];

const categories = ['全て','乾燥','水分','家電','予防'];

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('autoText');
  const btnToday = document.getElementById('btnToday');
  const btnDry = document.getElementById('btnDry');
  const btnWet = document.getElementById('btnWet');
  const btnAppliance = document.getElementById('btnAppliance');
  const btnPrevent = document.getElementById('btnPrevent');
  const btnCopy = document.getElementById('btnCopy');
  const btnPNG = document.getElementById('btnPNG');
  const shareX = document.getElementById('shareX');
  const shareFB = document.getElementById('shareFB');
  const shareLINE = document.getElementById('shareLINE');
  const shareMail = document.getElementById('shareMail');
  const categoryList = document.getElementById('categoryList');
  const methodsList = document.getElementById('methodsList');

  function randomFromCategory(cat){
    const pool = (cat === '全て') ? methods : methods.filter(m=>m.cat===cat);
    if(pool.length===0) return '該当する方法が見つかりません';
    return pool[Math.floor(Math.random()*pool.length)].text;
  }

  btnToday.addEventListener('click', ()=> { output.textContent = randomFromCategory('全て'); });
  btnDry.addEventListener('click', ()=> { output.textContent = randomFromCategory('乾燥'); });
  btnWet.addEventListener('click', ()=> { output.textContent = randomFromCategory('水分'); });
  btnAppliance.addEventListener('click', ()=> { output.textContent = randomFromCategory('家電'); });
  btnPrevent.addEventListener('click', ()=> { output.textContent = randomFromCategory('予防'); });

  btnCopy.addEventListener('click', ()=> {
    const text = output.textContent.trim();
    if(!text) { alert('まずは方法を表示してください'); return; }
    navigator.clipboard.writeText(text).then(()=> { alert('文章をコピーしました'); })
      .catch(()=> { alert('コピーに失敗しました'); });
  });

  btnPNG.addEventListener('click', ()=> {
    const text = output.textContent.trim();
    if(!text) { alert('まずは方法を表示してください'); return; }
    const pad = 24;
    const fontSize = 28;
    const maxChars = 36;
    const lines = wrapText(text, maxChars);
    const width = 1000;
    const lineHeight = Math.floor(fontSize * 1.2);
    const height = pad*2 + 48 + lines.length * lineHeight;

    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,width,height);

    ctx.fillStyle = '#222';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('今日の埃を除去', pad, pad + 20);

    ctx.fillStyle = '#000';
    ctx.font = `bold ${fontSize}px sans-serif`;
    lines.forEach((ln,i)=> ctx.fillText(ln, pad, pad + 56 + i*lineHeight));

    const data = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = data;
    a.download = 'dust-method.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  function wrapText(text, maxChars){
    const arr = [];
    for(let i=0;i<text.length;i+=maxChars) arr.push(text.slice(i,i+maxChars));
    return arr;
  }

  function openWindow(url){ window.open(url,'_blank','noopener,noreferrer,width=600,height=400'); }
  shareX.addEventListener('click', ()=> {
    const text = encodeURIComponent(output.textContent || '埃を除去する方法をシェアします');
    const url = encodeURIComponent(location.href);
    openWindow(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  });
  shareFB.addEventListener('click', ()=> {
    const url = encodeURIComponent(location.href);
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  });
  shareLINE.addEventListener('click', ()=> {
    const text = encodeURIComponent(output.textContent || '埃を除去する方法');
    const url = encodeURIComponent(location.href);
    openWindow(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`);
  });
  shareMail.addEventListener('click', ()=> {
    const subject = encodeURIComponent('埃を除去する方法');
    const body = encodeURIComponent(output.textContent + '\n\n' + location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  // カテゴリボタン生成
  categories.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'catButton';
    b.textContent = cat;
    b.addEventListener('click', ()=> { output.textContent = randomFromCategory(cat); });
    categoryList.appendChild(b);
  });

  // 100項目を一覧に出力（ページ内にそのまま。ページはスクロール可能）
  methods.forEach((m, idx) => {
    const li = document.createElement('li');
    li.className = 'methodItem';
    li.innerHTML = `<strong>${m.cat}</strong> — ${m.text}`;
    methodsList.appendChild(li);
  });

  // JSON-LD 構造化データ（SEO）
  (function addJsonLd(){
    const data = {
      "@context":"https://schema.org",
      "@type":"WebSite",
      "name":"埃を除去する方法100",
      "url":location.href,
      "description":"乾燥・水分・家電・予防のカテゴリでまとめた100の埃除去と予防方法"
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  })();

});