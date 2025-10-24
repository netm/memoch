// script.js - 一週間の献立メーカーと副菜（主婦向け）
// 7日分をランダム生成、メイン・副菜ともに同週内で重複回避、履歴管理、コピー・PNG保存・印刷・共有・カラー変更対応
(() => {
  const categories = {
    お米: [
      "親子丼","麻婆丼","炊き込みご飯","チャーハン","ホイコーロー丼","納豆ご飯","オムライス",
      "牛丼","カツ丼","天丼","鶏そぼろ丼","豚の生姜焼き定食","照り焼きチキン丼",
      "中華丼","海鮮丼","鯖味噌煮定食","豚角煮丼","鶏の照り焼き丼","卵かけご飯アレンジ",
      "タコライス風ご飯","ガパオ風ご飯","鮭フレークご飯","五目あんかけご飯",
      "鶏の唐揚げ定食","豚キムチ丼","牛すき焼き風丼","和風ロコモコ丼","豚の生姜煮丼",
      "炊き込み五目ご飯","高菜ご飯","梅しそご飯","豆ご飯","海苔たっぷりおにぎりセット",
      "鮭の炊き込みご飯","鶏飯（けいはん）風ご飯","ホタテバターご飯","牛しぐれ煮ご飯",
      "とん汁と白ご飯セット","鮭の漬け丼","白ご飯と副菜いろいろ（定食風）","カレーライス",
      "ハヤシライス","ビビンバ風丼","焼き鮭定食","焼き鳥丼","しらすご飯"
    ],
    うどん: [
      "肉うどん","味噌煮込みうどん","つけうどん","わかめうどん","カレーうどん",
      "きつねうどん","釜玉うどん","かま揚げうどん","月見うどん","天ぷらうどん",
      "冷やしぶっかけうどん","ごま坦々うどん","鶏南蛮うどん","納豆ぶっかけうどん","きのこうどん",
      "カレーつけうどん","肉味噌うどん","豚しゃぶうどん","揚げもち入りうどん","えび天うどん",
      "鴨ねぎうどん","冷やし梅おろしうどん","ごぼう天うどん","スタミナにんにくうどん",
      "野菜たっぷりうどん（味噌ベース）","坦々つけうどん","鶏天うどん","海鮮だしのうどん",
      "背脂醤油風うどん","釜揚げしらすうどん","豆乳クリームうどん",
      "トマトチーズうどん（洋風アレンジ）","バター醤油うどん","味噌バターうどん","きつね肉うどん"
    ],
    パスタ: [
      "ミートソースパスタ","和風パスタ","ペペロンチーノ","カルボナーラ","クリームパスタ",
      "ナポリタン","明太子パスタ","ボンゴレビアンコ","ボンゴレロッソ","ジェノベーゼ",
      "アラビアータ","ツナとトマトのパスタ","きのことベーコンのクリームパスタ","海鮮スパゲッティ",
      "なすとベーコンのトマトソース","たらこクリームパスタ","ボロネーゼ（ミートボロネーゼ）",
      "レモンクリームパスタ","きのこペペロンチーノ","豆乳クリームパスタ","サーモンクリーム",
      "ペンネアラビアータ","ミートボールパスタ","ジェノベーゼクリーム","ツナクリームパスタ",
      "ほうれん草とベーコンのパスタ","オイルサーディンパスタ","アマトリチャーナ風パスタ",
      "サーモンとほうれん草のクリーム","なすの和風バター醤油パスタ","ジェノベーゼチキンパスタ",
      "シーフードトマトクリーム","きのこたっぷりの和風パスタ","ほたてのレモンクリームパスタ",
      "カニかまトマトクリーム","ツナとコーンのクリームパスタ","トマトとバジルの冷製パスタ"
    ],
    パン: [
      "サンドイッチ","フレンチトースト","トースト＋目玉焼き","ホットサンド","ピザトースト",
      "エッグサラダサンド","ツナサンド","ハムチーズトースト","あんバタートースト",
      "ベーグルサンド","クロックムッシュ","パンケーキ","バゲットとスープのセット",
      "チキンカツサンド","照り焼きチキンバーガー風サンド","フルーツサンド","ホットドッグ",
      "ピーナツバタートースト","ガーリックトーストとサラダ","バインミー風サンド",
      "カツサンド","ローストビーフサンド","ツナメルトトースト","イングリッシュマフィンの卵サンド",
      "ベーコンエッグベーグル","シナモントースト","あんホイップサンド","クリームチーズと蜂蜜トースト",
      "ホットサンド（野菜たっぷり）","ピタサンド","オープンサンド盛り合わせ","クロワッサンサンド"
    ],
    そば: [
      "ざるそば","かけそば","天ぷらそば","鴨南蛮そば","とろろそば",
      "冷やしごまだれそば","月見そば","山菜そば","おろしそば","たぬきそば",
      "きつねそば","カレーそば","にしんそば","海老天そば","温玉そば",
      "梅おろしそば","きのこそば","牛肉そば（甘辛煮）","かき揚げそば","とりごぼうそば",
      "鶏そぼろそば","鴨ねぎそば","冷やし山かけそば","辛味噌そば","和風だしの煮込みそば",
      "おろし大根そば","たっぷりねぎそば","ちくわ天そば"
    ],
    副菜: [
      "肉じゃが","肉団子","シュウマイ","春巻き","餃子","卵スープ","ソーセージソテー",
      "ひじきの煮物","ちくわときゅうりの和え物","レンコンの煮物","豆サラダ","ポテトサラダ",
      "レタスサラダ","キャベツの漬物","もやしの浅漬け","ほうれん草のお浸し","みそ豆腐",
      "肉豆腐","冷ややっこ（薬味たっぷり）","コールスロー","きんぴらごぼう","春キャベツのサラダ",
      "かぼちゃの煮物","なすの揚げ浸し","さつまいも煮","ブロッコリーの胡麻和え","切干大根の煮物",
      "ほうれん草とベーコンのソテー","ピーマンのきんぴら","大根の甘酢漬け","キャロットラペ","たたきごぼう",
      "厚揚げの煮物","いんげんの胡麻和え","ポテトとコーンのバター炒め","マカロニサラダ",
      "かぶの浅漬け","さば缶とキャベツの和え物","きゅうりの酢の物","焼きなすのポン酢和え",
      "アスパラのベーコン巻き","小松菜のお浸し","里芋の煮っころがし","おろし和え（青菜）",
      "和風コーンバター炒め","豆腐の野菜あんかけ","きのこのバター醤油炒め",
      "ピリ辛こんにゃく炒め","揚げ出し豆腐","白菜の浅漬け","刻み昆布の煮物",
      "ほたてのバター焼き（惣菜風）","切り干し大根のサラダ","さつま揚げと大根の煮物",
      "しめじとほうれん草のナムル","ごぼうサラダ","れんこんチップス（揚げ物）","長芋の短冊漬け",
      "卯の花（おから煮）","桜えびと大根の炒め煮","じゃがいものそぼろ煮","根菜のきんぴら",
      "ピーマンとじゃこの炒め物","豆苗の炒め物","もずく酢","たこの酢の物","トマトときゅうりの和風マリネ",
      "なめたけおろし","長ネギのぬた和え","いんげんのごま和え","エリンギのバター醤油焼き",
      "かぼちゃのサラダ（マヨ和え）","青菜と油揚げの煮びたし","もやしと人参のナムル",
      "切り昆布と人参の煮物","焼きしいたけのポン酢がけ","レンチン蒸し野菜のごまダレ",
      "ちくわ磯辺揚げ","豆腐とわかめの和え物","大葉としらすの和え物","さつまいものきんとん風",
      "トマトのマリネ","ズッキーニとベーコンのソテー","芽キャベツのソテー","ブロッコリーとツナのサラダ",
      "キャベツと人参の浅漬け","揚げなすの生姜醤油がけ","焼きピーマンのおかか和え","小松菜と油揚げの煮浸し",
      "おからの五目煮","こんにゃくと野菜の煮物","もやしのにんにく醤油炒め","きのこの甘辛炒め",
      "夏野菜のラタトゥイユ風","豆のトマト煮","カリフラワーのカレー風味炒め",
      "さばの塩焼きほぐし和え","ほっけのほぐし身と大根おろし","なめこのポン酢和え"
    ]
  };

  const dayConfigs = [
    { label: "1日目", options: ["お米", "うどん"] },
    { label: "2日目", options: ["パスタ", "パン"] },
    { label: "3日目", options: ["うどん", "お米"] },
    { label: "4日目", options: ["パスタ", "そば"] },
    { label: "5日目", options: ["お米", "パン"] },
    { label: "6日目", options: ["うどん", "そば"] },
    { label: "7日目", options: ["パン", "パスタ"] }
  ];

  const btnGenerate = document.getElementById("generateBtn");
  const btnCopy = document.getElementById("copyBtn");
  const btnSavePng = document.getElementById("savePngBtn");
  const btnPrint = document.getElementById("printBtn");
  const colorSelect = document.getElementById("colorSelect");
  const menuContainer = document.getElementById("menuContainer");
  const menuTextArea = document.getElementById("menuText");
  const shareX = document.getElementById("shareX");
  const shareFB = document.getElementById("shareFB");
  const shareLINE = document.getElementById("shareLINE");

  const history = new Set();

  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  function pickOption(arr) {
    return arr[randInt(arr.length)];
  }

  function pickUnique(categoryArray, excludeSet) {
    const candidates = categoryArray.filter(item => !excludeSet.has(item));
    if (candidates.length === 0) {
      // 全て使われている場合は除外セットをリセットして選ぶ
      excludeSet.clear();
      return categoryArray[randInt(categoryArray.length)];
    }
    return candidates[randInt(candidates.length)];
  }

  // generateWeek: 同一週内でメインと副菜ともに重複しないように選ぶ
  function generateWeek() {
    let tries = 0;
    while (tries < 300) {
      const usedThisWeek = new Set();
      const week = dayConfigs.map(d => {
        // カテゴリはその日の options からランダム選択
        const cat = pickOption(d.options);
        // そのカテゴリ内で、今週使われていないメインを選ぶ
        const main = pickUnique(categories[cat], usedThisWeek);
        usedThisWeek.add(main);
        // 副菜も今週使われていないものを選ぶ
        const side = pickUnique(categories["副菜"], usedThisWeek);
        usedThisWeek.add(side);
        return { day: d.label, category: cat, main, side };
      });

      // 履歴キー（メニューの組合せ単位）で重複チェック
      const key = week.map(w => `${w.category}:${w.main}:${w.side}`).join("|");
      if (!history.has(key)) {
        history.add(key);
        // 履歴サイズ上限管理
        if (history.size > 500) {
          const it = history.values();
          it.next();
          history.delete(it.next().value);
        }
        return week;
      }
      tries++;
    }

    // フォールバック: 重複チェックを緩めて返す（通常はここに到達しない）
    return dayConfigs.map(d => {
      const cat = pickOption(d.options);
      return { day: d.label, category: cat, main: pickOption(categories[cat]), side: pickOption(categories["副菜"]) };
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function renderWeek(week) {
    menuContainer.innerHTML = "";
    const ol = document.createElement("ol");
    ol.className = "week-list";
    week.forEach(item => {
      const li = document.createElement("li");
      li.className = "week-item";
      li.innerHTML = `
        <div class="left">
          <strong class="day-label">${escapeHtml(item.day)}</strong>
          <span class="cat-label">【${escapeHtml(item.category)}】</span>
        </div>
        <div class="right">
          <span class="main-dish">${escapeHtml(item.main)}</span>
          <span class="side-dish">副菜: ${escapeHtml(item.side)}</span>
        </div>`;
      ol.appendChild(li);
    });
    menuContainer.appendChild(ol);
    const textLines = week.map(w => `${w.day}：${w.category} - ${w.main} ／ 副菜：${w.side}`);
    menuTextArea.value = textLines.join("\n");
    updateShareLinks();
  }

  function copyText() {
    if (!menuTextArea || !menuTextArea.value) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(menuTextArea.value).then(() => {
          if (btnCopy) btnCopy.textContent = "コピーしました";
          setTimeout(() => { if (btnCopy) btnCopy.textContent = "文章コピー"; }, 1500);
        }).catch(() => fallbackCopy());
      } else {
        fallbackCopy();
      }
    } catch (e) {
      fallbackCopy();
    }

    function fallbackCopy() {
      menuTextArea.select();
      menuTextArea.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
        if (btnCopy) btnCopy.textContent = "コピーしました";
        setTimeout(() => { if (btnCopy) btnCopy.textContent = "文章コピー"; }, 1500);
      } catch (err) {
        if (btnCopy) btnCopy.textContent = "コピー失敗";
        setTimeout(() => { if (btnCopy) btnCopy.textContent = "文章コピー"; }, 1500);
      }
    }
  }

  function saveAsPNG() {
    if (!menuTextArea) return;
    const lines = menuTextArea.value.split("\n");
    const padding = 28;
    const fontSize = 18;
    const lineHeight = Math.round(fontSize * 1.6);
    const width = Math.max(720, Math.min(1200, document.body.clientWidth || 720));
    const height = padding * 2 + lines.length * lineHeight + 80;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = getComputedStyle(document.body).color || "#111";
    ctx.font = `bold ${fontSize + 4}px sans-serif`;
    ctx.fillText("一週間の献立と副菜", padding, padding + fontSize);
    ctx.font = `${fontSize}px sans-serif`;
    lines.forEach((ln, i) => {
      ctx.fillText(ln, padding, padding + (i + 2) * lineHeight);
    });
    const link = document.createElement("a");
    link.download = "weekly_menu_with_sides.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function printMenu() {
    const w = window.open("", "_blank");
    const html = `
      <html><head><meta charset="utf-8"><title>一週間の献立と副菜</title>
      <style>body{font-family:sans-serif;padding:24px;color:#111}h1{font-size:20px}pre{white-space:pre-wrap;font-size:16px}</style>
      </head><body><h1>一週間の献立と副菜</h1><pre>${escapeHtml(menuTextArea.value)}</pre></body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 200);
  }

  function updateShareLinks() {
    if (!menuTextArea) return;
    const text = encodeURIComponent(menuTextArea.value);
    const url = encodeURIComponent(window.location.href);
    if (shareX) shareX.href = `https://twitter.com/intent/tweet?text=${text}%0A${url}`;
    if (shareFB) shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    if (shareLINE) shareLINE.href = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`;
  }

  function changeColor(value) {
    const map = {
      default: "#ffffff",
      gray: "#f2f2f2",
      pink: "#fff0f3",
      lightblue: "#f0fbff",
      lightgreen: "#f2fff0",
      yellow: "#fffbe6",
      orange: "#fff6ee",
      purple: "#fbf3ff"
    };
    document.body.style.backgroundColor = map[value] || map.default;
    updateShareLinks();
  }

  // 初期化とイベント登録
  function init() {
    const week = generateWeek();
    renderWeek(week);

    if (btnGenerate) btnGenerate.addEventListener("click", () => { const w = generateWeek(); renderWeek(w); updateShareLinks(); });
    if (btnCopy) btnCopy.addEventListener("click", copyText);
    if (btnSavePng) btnSavePng.addEventListener("click", saveAsPNG);
    if (btnPrint) btnPrint.addEventListener("click", printMenu);
    if (colorSelect) colorSelect.addEventListener("change", e => changeColor(e.target.value));
    [shareX, shareFB, shareLINE].forEach(a => {
      if (!a) return;
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    const defaultColor = "default";
    if (colorSelect) colorSelect.value = defaultColor;
    changeColor(defaultColor);
    updateShareLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();