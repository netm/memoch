/* 全文JS: 献立データ・ランダム生成・ボタン機能・PNG生成（SVG foreignObject） */
(() => {
  // 年表示
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // カテゴリごとの料理リスト
  const dishes = {
    "お米": [
      "親子丼","麻婆丼","炊き込みご飯","チャーハン","ホイコーロー丼","納豆ご飯","オムライス",
      "牛丼","カレーライス","鮭の塩焼きご飯","鯖の味噌煮ご飯","鶏照り焼き丼","生姜焼き丼",
      "五目ご飯（玄米）","雑穀ご飯と焼き魚","野菜たっぷり丼","豆ご飯","そぼろご飯",
      "和風リゾット（雑穀）","鰻の蒲焼","たらこご飯","チキンライス",
      "玄米おにぎりと具だくさん味噌汁","豚しょうが焼き丼","きのこご飯","菜飯",
      "鶏むね肉の和風照り焼き丼","鮭と野菜の炊き込み玄米","ひじきと大豆のご飯","野菜ビビンバ",
      "さつまいもご飯","高野豆腐と根菜の丼","おからと野菜の丼","鯛の炊き込みご飯",
      "玉子丼","だし巻き卵のせご飯","卵かけご飯","ほうれん草とベーコンのチャーハン",
      "ブロッコリーとツナの混ぜご飯","しらすと大葉のご飯","鮭フレークおにぎり","焼き魚定食風ご飯",
      "明太子と大根おろしご飯","豆苗としらすの炊き込みご飯","焼き鯖のほぐし身ご飯","たまご雑炊",
      "麻婆豆腐ご飯","豚丼（和風ソース）","豆腐そぼろご飯","豆腐とキムチのビビンバ"
    ],
    "うどん": [
      "肉うどん","月見うどん","味噌煮込みうどん","つけうどん","わかめうどん","カレーうどん",
      "ぶっかけうどん","きつねうどん","野菜たっぷりうどん","とろろうどん","鴨ねぎうどん",
      "冷やしぶっかけうどん","豆乳クリームうどん","きのこうどん","昆布だしうどん",
      "鶏と根菜のうどん","納豆うどん","しらすと青菜のうどん","梅おろしうどん","味噌野菜うどん",
      "根菜と鶏の温かいうどん","ごまダレうどん（野菜添え）","青菜と揚げのうどん","豆腐入りうどん",
      "オートミールうどん風（低GI）","雑穀うどんのヘルシー汁","海藻と野菜のさっぱりうどん","蒸し鶏とほうれん草のうどん",
      "卵とじうどん","温泉卵のせぶっかけうどん","ブロッコリーとえびのうどん","白身魚のつけ汁うどん",
      "魚介だしのかき玉うどん","焼き鯖うどん（ほぐし身）","揚げ出し豆腐のうどん","豆腐と揚げのきつね風うどん",
      "豆腐キムチうどん"
    ],
    "パスタ": [
      "ナポリタン","カルボナーラ","ペペロンチーノ","ボロネーゼ","和風きのこパスタ","ミートソース",
      "トマトとバジルのパスタ","明太子パスタ","ツナとほうれん草のパスタ",
      "シーフードパスタ","アーリオオーリオ（野菜多め）","ペンネアラビアータ",
      "きのことブロッコリーの和風パスタ","サーモンとほうれん草の豆乳クリーム","ジェノベーゼ",
      "海藻と野菜のパスタ","豆乳とトマトのパスタ","レモン風味の鶏肉パスタ","玄米パスタの豆乳カルボナーラ",
      "ズッキーニとエビのパスタ","和風ツナキャベツパスタ","ラタトゥイユパスタ","ペンネの野菜焼き",
      "全粒粉スパゲッティのボンゴレ","カッペリーニの冷製トマトとバジル","キヌアと野菜のパスタサラダ","きのこと豆のヘルシーパスタ",
      "卵とトマトの簡単パスタ","サバ缶とブロッコリーの和風パスタ","しらすと大葉の冷製パスタ","いくらと卵の和風豆乳クリームパスタ",
      "豆乳クリームパスタ","絹ごし豆腐の冷製和風パスタ","厚揚げと野菜の和風パスタ"
    ],
    "パン": [
      "サンドイッチ","玉子トースト","ハムチーズトースト","カレーパン風","フレンチトースト",
      "アボカドとサーモンのオープンサンド","グリルチキンサンド","野菜たっぷりフォカッチャサンド",
      "全粒粉トーストとポーチドエッグ","ツナとレタスのサンド","ベジタブルピタサンド","豆腐ハンバーグサンド",
      "バナナとナッツのトースト","きのことほうれん草のキッシュ風トースト","ハーブチキンのサンド",
      "ホットサンド（野菜とチーズ）","ベーグルサンド（スモークサーモン）","ライ麦パンのオープンサンド",
      "玄米パンと納豆オープン","サワードウトースト（オリーブオイル少量）","全粒粉ピタのヘルシーラップ","豆と野菜のオープンサンド",
      "低糖質ブレッドのサンドイッチ","サツマイモペーストトースト","ひよこ豆のファラフェルサンド",
      "エッグベネディクト風トースト","ブロッコリーとチキンのクロワッサンサンド","焼き魚のバインミー風サンド",
      "玉子サンド","鮭フレークトースト","だし巻きサンド（和風）",
      "豆腐スクランブルのサンド","絹ごし豆腐と野菜のオープンサンド","厚揚げマリネのサンド"
    ],
    "そば": [
      "もりそば","かけそば","月見そば","天ぷらそば","山かけそば","鴨南蛮そば",
      "とろろそば","納豆そば","野菜たっぷりそば","冷やしぶっかけそば","きのこそば",
      "胡麻だれそば（野菜添え）","鶏そぼろそば","そばサラダ","海藻そば",
      "揚げ出し豆腐そば","おろしそば","きつねそば",
      "葱と生姜の温そば","鯖水煮のせそば","十割そばの野菜添え","玄そばと蒸し野菜の温そば","豆腐入りそば",
      "野菜たっぷり肉なしそば","山菜そば","トマトそば（冷製）","卵とじそば",
      "ブロッコリーとしらすのそば","焼き魚ほぐし身のせそば","いくらおろしそば","豆腐と揚げの温そば"
    ],
    "副菜": [
      "肉じゃが","肉団子","シュウマイ","サーモンとアボカド","餃子","卵スープ","ソーセージとキャベツ","ひじきの煮物","ささかまレタス",
      "ちくわとキュウリ","ひき肉レンコンとニンジンの煮物","チキン豆サラダ","じゃこサラダ","チキンレタスサラダ","キャベツの漬物",
      "モヤシの浅漬け","ほうれん草のお浸し","みそ豆腐","肉豆腐","きんぴらごぼう","ほたてときのこのソテー","薄切り豚肉とにんじんの煮物",
      "揚げなすの煮浸し","ブロッコリーのごま和え","ラタトゥイユ","鶏肉とさつまいもの甘煮","ちくわみりん煮","カボチャの煮物",
      "ひと口湯豆腐","青菜としめじの胡麻和え","きゅうりとわかめの酢の物","枝豆とコーンとカニカマ","枝豆とチキン","チキンとコーン",
      "焼き野菜のマリネ","蒸し鶏のネギソース","大根とツナのサラダ","豆腐とアボカドのサラダ","野菜スティックと味噌ディップ",
      "豚肉なめたけおろし","レンチンキャベツとツナ","鶏肉と小松菜の煮びたし","きのことほうれん草のソテー",
      "こんにゃくのピリ辛炒め","蒸し豚肉と枝豆","トマトとモッツァレラのカプレーゼ","さば缶サラダ（骨ごと）",
      "焼き豆腐のネギポン酢","切り干し大根の煮物","オクラと長芋の和え物","ほうれん草と人参のナムル","小松菜と人参の煮びたし煮びたし",
      "きのこのマリネ","ひき肉と豆雑穀のサラダ","ズッキーニとチキングリル","チキンと彩りピクルス","ソラマメとにんじんの鰹節のせ",
      "照り焼きチキンとブロッコリー","グリル根菜のハーブ和え","白身魚の南蛮漬け","じゃがいものローズマリーロースト",
      "ゆで卵とマスタードチキンのサラダ","ブロッコリーと豚肉の温サラダ","焼きしめじと小松菜の和え物","魚の骨せんべい",
      "だし巻き卵の小鉢","ブロッコリーの塩昆布和え","焼き魚のほぐし身小鉢","焼き鮭とほんのりマヨネーズ","豚しゃぶサラダ",
      "冷ややっこ（薬味）","バジル豆腐","豆腐の生姜醤油がけ","豆腐田楽（味噌だれ）","豆腐と玉子ミックスめんつゆ",
      "湯豆腐とポン酢","豆腐ハンバーグ（和風おろし）","豆腐サラダ（胡麻ドレ）","絹ごし豆腐のカプレーゼ風","だし巻き卵（甘さ控えめ）",
      "だし巻き卵のねぎ添え","だし巻き卵の梅おろし添え","だし巻き卵と明太子の小鉢","だし巻き卵のきのこあんかけ",
      "卵の中華風炒め（青菜）","卵とじ（野菜たっぷり）","卵焼きサラダ（刻み野菜）","半熟卵のポン酢がけ",
      "温泉卵の和風サラダ","温泉卵のだし醤油がけ","温泉卵とベーコンの和え物","ゆで卵のピリ辛マヨ和え","ゆで卵のカレーマヨサラダ",
      "ゆで卵の醤油マヨネーズ和え","明太子入りだし巻き卵","かにかま入りだし巻き卵","卵豆腐の冷製おかず（出汁と薬味）",
      "卵豆腐のあんかけ","卵と玉ねぎのさっぱりマリネ","卵とアボカドの和え物","卵とツナの和風サラダ",
      "卵とほうれん草の胡麻和え","卵としらすの小鉢","卵ときのこのバターソテー","ゆで卵の味噌漬け","ゆで卵の甘酢漬け",
      "ほうれん草の卵炒め（中華風）","にんじんと卵のしりしり風","豚肉と卵の煮物","じゃがいもと卵の和風サラダ",
      "なすと卵の煮びたし","卵入りポテトのローズマリー焼き","卵の中華風辛子和え","豆腐と卵の煮物","豆腐とにんじんの煮物",
      "ミニオムレツの和風だれ","ミニオムレツのバジルソース","スパニッシュオムレツ（野菜入り）",
      "茶碗蒸しの小鉢","茶碗蒸しのきのこ入り","茶碗蒸しの海鮮入り","スクランブルエッグと枝豆の和え物",
      "スクランブルエッグの出汁浸し","半熟卵ときのこの醤油バター","卵と白菜のさっと煮","卵と春菊の和え物",
      "卵のピリ辛味噌和え","卵と大根のなます風","卵入りカプレーゼ風（半熟卵）","卵の青じそ和え"
    ]
  };

  // 曜日カテゴリパターン
  const patterns = [
    ["お米","うどん"],
    ["パスタ","パン"],
    ["うどん","お米"],
    ["パスタ","そば"],
    ["お米","パン"],
    ["うどん","そば"],
    ["パン","パスタ"]
  ];

  const dayNames = ["1日目","2日目","3日目","4日目","5日目","6日目","7日目"];
  const menuContainer = document.getElementById('menuContainer');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const savePngBtn = document.getElementById('savePngBtn');
  const printBtn = document.getElementById('printBtn');
  const colorBtn = document.getElementById('colorBtn');
  const xBtn = document.getElementById('xBtn');
  const fbBtn = document.getElementById('fbBtn');
  const lineBtn = document.getElementById('lineBtn');

  const themes = ["lightgray","lightpink","lightblue","lightgreen","lightyellow","lightorange","lightpurple"];
  let themeIndex = 0;

  // utility: pick random element from array
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  // Fisher-Yates shuffle
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  // Generate 7-day menu ensuring no duplicate dish names and two distinct non-repeating sides per week
  function generateMenu(){
    const chosen = new Set(); // 全体で重複を避ける（主菜・副菜をまとめて管理）
    const result = [];

    // Prepare a shuffled pool for sides to make selection consistent
    let globalSidePool = dishes["副菜"].slice();
    shuffle(globalSidePool);
    // We'll pop from this pool when possible to ensure no duplicates across week
    for(let i=0;i<7;i++){
      const options = patterns[i];
      const cat = rand(options);

      // 主菜選択（カテゴリ内で未使用のものを優先）
      let candidateList = (dishes[cat] || []).slice();
      shuffle(candidateList);
      let picked = candidateList.find(d => !chosen.has(d));
      if(!picked){
        picked = rand(dishes[cat] || ["料理"]);
      }
      chosen.add(picked);

      // 副菜を2つ選ぶ（同一日の間で被らない・7日間で被らない）
      let side1 = null;
      let side2 = null;

      // side1: try to get from globalSidePool (unused overall)
      while(globalSidePool.length && !side1){
        const cand = globalSidePool.shift();
        if(!chosen.has(cand)) side1 = cand;
      }
      // fallback: pick any not yet chosen
      if(!side1){
        const sideCandidates = dishes["副菜"].slice();
        shuffle(sideCandidates);
        side1 = sideCandidates.find(s => !chosen.has(s)) || rand(dishes["副菜"]);
      }
      chosen.add(side1);

      // side2: try to get next unused from globalSidePool that's not equal to side1
      while(globalSidePool.length && !side2){
        const cand = globalSidePool.shift();
        if(cand !== side1 && !chosen.has(cand)) side2 = cand;
      }
      // fallback: find any different one (prefer unused, but allow if necessary)
      if(!side2){
        const sideCandidates2 = dishes["副菜"].slice();
        shuffle(sideCandidates2);
        side2 = sideCandidates2.find(s => s !== side1 && !chosen.has(s)) ||
                sideCandidates2.find(s => s !== side1) ||
                rand(dishes["副菜"]);
      }
      chosen.add(side2);

      result.push({ day: dayNames[i], category: cat, dish: picked, side1: side1, side2: side2 });
    }
    return result;
  }

  // render to DOM
  function renderMenu(menu){
    if(!menuContainer) return;
    menuContainer.innerHTML = '';
    menu.forEach(m=>{
      const el = document.createElement('article');
      el.className = 'day';
      el.innerHTML = `
        <h3>${escapeHtml(m.day)}</h3>
        <div class="cat">${escapeHtml(m.category)}</div>
        <p class="dish">${escapeHtml(m.dish)}</p>
        <p class="side">副菜1: ${escapeHtml(m.side1)}</p>
        <p class="side">副菜2: ${escapeHtml(m.side2)}</p>
      `;
      menuContainer.appendChild(el);
    });
  }

  // create textual representation for copy/share
  function menuToText(menu){
    let lines = ["1週間の献立（自動生成）"];
    menu.forEach(m=>{
      lines.push(`${m.day} - ${m.category}：${m.dish}（副菜：${m.side1}、${m.side2}）`);
    });
    return lines.join("\n");
  }

  // simple HTML escape to avoid injecting unexpected markup when serializing/cloning
  function escapeHtml(str){
    if(typeof str !== 'string') return String(str);
    return str.replace(/[&<>"']/g, function(s){
      switch(s){
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return s;
      }
    });
  }

  // Event handlers
  if(generateBtn){
    generateBtn.addEventListener('click',()=>{
      currentMenu = generateMenu();
      renderMenu(currentMenu);
    });
  }

  let currentMenu = generateMenu();
  renderMenu(currentMenu);

  if(copyBtn){
    copyBtn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(menuToText(currentMenu));
        const prev = copyBtn.textContent;
        copyBtn.textContent = "コピー完了";
        setTimeout(()=>{ copyBtn.textContent = prev; }, 1200);
      }catch(e){
        alert("コピーできませんでした。ブラウザの設定を確認してください。");
      }
    });
  }

  if(printBtn){
    printBtn.addEventListener('click', ()=>{
      window.print();
    });
  }

  // Color change cycles themes
  if(colorBtn){
    colorBtn.addEventListener('click', ()=>{
      themeIndex = (themeIndex + 1) % themes.length;
      document.body.setAttribute('data-theme', themes[themeIndex]);
    });
  }

  // Simple share URLs
  function openShare(url){
    window.open(url,'_blank','noopener,noreferrer,width=600,height=480');
  }

  if(xBtn){
    xBtn.addEventListener('click', ()=>{
      const text = encodeURIComponent(menuToText(currentMenu));
      openShare(`https://twitter.com/intent/tweet?text=${text}`);
    });
  }
  if(fbBtn){
    fbBtn.addEventListener('click', ()=>{
      const url = encodeURIComponent(location.href);
      const quote = encodeURIComponent(menuToText(currentMenu));
      openShare(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`);
    });
  }
  if(lineBtn){
    lineBtn.addEventListener('click', ()=>{
      const text = encodeURIComponent(menuToText(currentMenu) + "\n" + location.href);
      openShare(`https://social-plugins.line.me/lineit/share?text=${text}`);
    });
  }

  // Save PNG of menuContainer using SVG foreignObject (no外部ライブラリ)
  if(savePngBtn){
    savePngBtn.addEventListener('click', async ()=>{
      try{
        const node = document.getElementById('menuContainer');
        if(!node){
          alert('メニュー要素が見つかりません。');
          return;
        }
        // compute size
        // Ensure layout complete
        await new Promise(r => requestAnimationFrame(r));
        const width = Math.ceil(node.scrollWidth);
        const height = Math.ceil(node.scrollHeight);

        // clone node and inline computed styles for better fidelity
        const cloned = node.cloneNode(true);
        inlineStyles(node, cloned);

        // Serialize cloned node safely
        const serialized = new XMLSerializer().serializeToString(cloned);

        const svg = `
          <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
            <foreignObject x='0' y='0' width='100%' height='100%'>
              <div xmlns='http://www.w3.org/1999/xhtml' style='font-family: -apple-system, "Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",system-ui;'>
                ${serialized}
              </div>
            </foreignObject>
          </svg>`;

        const blob = new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          try{
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#fff';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);
            URL.revokeObjectURL(url);
            canvas.toBlob((b)=>{
              if(!b){
                alert('画像変換に失敗しました。');
                return;
              }
              const a = document.createElement('a');
              a.download = `weekly-menu.png`;
              a.href = URL.createObjectURL(b);
              // programmatic click
              a.click();
              URL.revokeObjectURL(a.href);
            },'image/png');
          }catch(e){
            alert('画像生成中にエラーが発生しました。');
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = ()=>{
          URL.revokeObjectURL(url);
          alert('画像生成に失敗しました。ブラウザを最新にしてください。');
        };
        img.src = url;
      }catch(e){
        alert('画像保存中にエラーが発生しました。');
      }
    });
  }

  // Inline computed styles from source to cloned element recursively
  function inlineStyles(source, target){
    const sNodes = source.querySelectorAll('*');
    const tNodes = target.querySelectorAll('*');

    // inline root styles (menuContainer)
    const rootStyle = getComputedStyle(source);
    target.style.width = rootStyle.width;
    target.style.height = rootStyle.height;
    target.style.boxSizing = rootStyle.boxSizing;
    target.style.background = rootStyle.background || rootStyle.backgroundColor || 'transparent';

    for(let i=0;i<sNodes.length;i++){
      const s = sNodes[i];
      const t = tNodes[i];
      if(!t) continue;
      const cs = getComputedStyle(s);
      const styleProps = [
        'box-sizing','width','height','padding','margin','display','flex-direction','justify-content',
        'align-items','color','background','background-color','border','border-radius','font-size','font-weight',
        'line-height','text-align','white-space','overflow','gap'
      ];
      const styleString = styleProps.map(p => {
        const v = cs.getPropertyValue(p);
        return `${p}:${v}`;
      }).join(';');
      t.setAttribute('style', styleString);
    }
  }

  // initialize theme
  document.body.setAttribute('data-theme', themes[themeIndex]);

})();