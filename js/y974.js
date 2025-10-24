// script.js - 一人暮らしの1週間献立メーカー (JS全文)
(() => {
  // カテゴリごとの料理リスト（日本語）
const categories = {
  お米: [
    "親子丼","炊き込みご飯","チャーハン","おにぎり","納豆ご飯","オムライス",
    "牛丼","カレーライス","麻婆丼","天丼","カツ丼","鶏そぼろ丼",
    "豚角煮丼","生姜焼き定食","照り焼きチキン丼","鮭の塩焼き定食",
    "高菜ご飯","梅しそご飯","鮭フレークご飯","豆ご飯","炊き込み五目ご飯",
    "海鮮丼","チキンソテーご飯セット","キムチチャーハン","ガパオライス風ご飯",
    "タコライス風ご飯","豚キムチ丼","照り焼きハンバーグ丼","とん汁と白ご飯セット",
    "卵かけご飯アレンジ（薬味たっぷり）","鶏の唐揚げ定食","玄米ご飯と納豆定食",
    "ホタテバターご飯","鮭ときのこの炊き込みご飯","牛しぐれ煮ご飯",
    "豚生姜煮丼","和風ロコモコ丼","五目あんかけご飯","中華丼","サバ味噌煮定食"
  ],
  うどん: [
    "肉うどん","味噌煮込みうどん","つけうどん","わかめうどん","カレーうどん",
    "きつねうどん","釜玉うどん","かま揚げうどん","月見うどん","天ぷらうどん",
    "冷やしぶっかけうどん","かすうどん","鶏南蛮うどん","ごま坦々うどん","きのこ肉うどん",
    "梅しそぶっかけうどん","カレーつけうどん","納豆ぶっかけうどん","野菜たっぷりうどん（味噌ベース）",
    "坦々つけうどん","ニラうどん","えび天うどん","コシ強め冷やしうどん","味噌バターうどん",
    "肉味噌うどん","豚しゃぶうどん","冷やし梅おろしうどん","鴨汁うどん","豆乳クリームうどん",
    "ねぎ塩だれうどん","スタミナにんにくうどん","ごぼう天うどん","棒々鶏風うどん","トマトチーズうどん",
    "ごまみそ温玉うどん","和風きのこつけうどん","バター醤油うどん","チーズカレーうどん"
  ],
  パスタ: [
    "ミートソースパスタ","和風パスタ","ペペロンチーノ","カルボナーラ","クリームパスタ",
    "ナポリタン","明太子パスタ","ボンゴレビアンコ","ボンゴレロッソ","ジェノベーゼ",
    "アラビアータ","ツナとトマトのパスタ","きのことベーコンのクリームパスタ","海鮮スパゲッティ",
    "なすとベーコンのトマトソース","サーモンのクリームパスタ","レモンクリームパスタ","たらこクリームパスタ",
    "バジルチキンパスタ","ほうれん草とベーコンのパスタ","オイルサーディンパスタ","豆乳クリームパスタ",
    "きのこペペロンチーノ","ミートボールパスタ","カルツォーネ風パスタ","きのこ和風バター醤油パスタ",
    "ホワイトソースとシーフードのパスタ","ズッキーニとベーコンのパスタ","ピリ辛エビチリ風パスタ",
    "ゴルゴンゾーラのクリームパスタ","鶏のトマト煮込みパスタ","パンチェッタとほうれん草のパスタ",
    "オイルベースの魚介パスタ","トマトクリームパスタ","ペンネアラビアータ","シーフードトマトクリーム",
    "バジルペーストとじゃがいものパスタ","レモンとクリームのさっぱりパスタ","ボロネーゼ"
  ],
  パン: [
    "サンドイッチ","フレンチトースト","トースト＋目玉焼き","ホットサンド","パン屋の惣菜パン",
    "ピザトースト","エッグサラダサンド","ツナサンド","ハムチーズトースト","あんバタートースト",
    "ベーグルサンド","クロックムッシュ","パンケーキ","バゲットとスープのセット","ソーセージロール",
    "カレーパン","サラダパン（具沢山オープンサンド）","チキンカツサンド","照り焼きチキンバーガー風サンド",
    "ハニーバタートースト","ガーリックトーストとサラダ","クリームチーズとハチミツのトースト","フルーツサンド",
    "ピーナツバタートースト","イングリッシュマフィンの卵サンド","ベーコンエッグベーグル","メロンパンとコーヒーの軽食",
    "カプレーゼオープンサンド","ガーリックシュリンプトースト","野菜たっぷりオープンサンド","ローストビーフサンド",
    "クロワッサンサンド（チキン/卵）","ホットドッグ","シナモントースト","チョコバナナトースト","レバーパテ風ペーストトースト",
    "カナッペ風トースト盛り合わせ","ツナメルトトースト","タルタルチキンサンド"
  ],
  そば: [
    "ざるそば","かけそば","天ぷらそば","鴨南蛮そば","とろろそば",
    "冷やしごまだれそば","月見そば","鶏そぼろそば","山菜そば","おろしそば",
    "たぬきそば","きつねそば（油揚げ）","カレーそば","にしんそば（缶詰）","海老天そば",
    "温玉そば","キムチそば","納豆そば（健康志向）","和風だしの煮込みそば","椎茸たっぷりそば",
    "ネギたっぷり鶏そば","辛味噌そば","そばサラダ（冷製）","きのこそば（ヘルシー）",
    "鶏天そば","豚バラそば","胡麻だれ冷やしそば","柚子香るそば（さっぱり）","とりごぼうそば",
    "牛肉そば（甘辛煮）","揚げ餅そば","和風ミートそば","かき揚げそば","海鮮あんかけそば",
    "ほうれん草と温玉のそば","梅おろしそば","山かけそば","とまとそば（洋風アレンジ）"
  ]
};

  // 日ごとのカテゴリ選択ルール（順番と2択）
  // 1日目 お米orうどん、2日目 パスタorパン、3日目 うどんorお米, ...
  const dayConfigs = [
    { label: "1日目", options: ["お米", "パスタ"] },
    { label: "2日目", options: ["パン", "うどん"] },
    { label: "3日目", options: ["お米", "そば"] },
    { label: "4日目", options: ["パン", "パスタ"] },
    { label: "5日目", options: ["うどん", "そば"] },
    { label: "6日目", options: ["お米", "パスタ"] },
    { label: "7日目", options: ["パン", "うどん"] }
  ];

  // DOM
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

  // 生成履歴（週のパターン重複回避）
  const history = new Set();

  // ランダム選択
  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  function pickCategory(options) {
    return options[randInt(options.length)];
  }

  function pickDishFromCategory(cat) {
    const list = categories[cat] || [];
    return list[randInt(list.length)] || cat;
  }

  // 7日分生成（同一週パターンの重複を避ける）
  function generateMenu() {
    let tries = 0;
    while (tries < 200) {
      const week = dayConfigs.map(d => {
        const cat = pickCategory(d.options);
        const dish = pickDishFromCategory(cat);
        return { day: d.label, category: cat, dish };
      });
      const patternKey = week.map(w => w.dish).join("|");
      if (!history.has(patternKey)) {
        history.add(patternKey);
        if (history.size > 300) {
          // 古い履歴を削る
          const it = history.values();
          it.next();
          history.delete(it.next().value);
        }
        return week;
      }
      tries++;
    }
    // フォールバック
    return dayConfigs.map(d => {
      const cat = pickCategory(d.options);
      return { day: d.label, category: cat, dish: pickDishFromCategory(cat) };
    });
  }

  // 表示更新
  function renderMenu(week) {
    menuContainer.innerHTML = "";
    const list = document.createElement("ol");
    list.className = "week-list";
    week.forEach(item => {
      const li = document.createElement("li");
      li.className = "week-item";
      li.innerHTML = `<strong class="day-label">${item.day}</strong><span class="cat-label">【${item.category}】</span> <span class="dish-name">${item.dish}</span>`;
      list.appendChild(li);
    });
    menuContainer.appendChild(list);

    const textLines = week.map(item => `${item.day}：${item.category} - ${item.dish}`);
    menuTextArea.value = textLines.join("\n");
  }

  // クリップボードコピー
  function copyToClipboard() {
    menuTextArea.select();
    menuTextArea.setSelectionRange(0, 99999);
    try {
      document.execCommand("copy");
      btnCopy.textContent = "コピーしました";
      setTimeout(() => (btnCopy.textContent = "文章コピー"), 1500);
    } catch (e) {
      btnCopy.textContent = "コピー失敗";
      setTimeout(() => (btnCopy.textContent = "文章コピー"), 1500);
    }
  }

  // PNG出力
  function saveAsPNG() {
    const padding = 24;
    const lines = menuTextArea.value.split("\n");
    const fontSize = 20;
    const lineHeight = Math.round(fontSize * 1.5);
    const width = Math.max(640, Math.min(1200, document.body.clientWidth));
    const height = padding * 2 + lines.length * lineHeight + 40;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#111";
    ctx.font = `bold ${fontSize + 6}px sans-serif`;
    ctx.fillText("1週間の献立", padding, padding + fontSize);

    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = "#222";
    lines.forEach((ln, i) => {
      ctx.fillText(ln, padding, padding + (i + 2) * lineHeight);
    });

    const link = document.createElement("a");
    link.download = "1week_menu.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // 印刷
  function printMenu() {
    const w = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>1週間の献立</title>
          <meta charset="utf-8">
          <style>body{font-family:sans-serif;padding:24px;color:#111}h1{font-size:20px}pre{font-size:16px;white-space:pre-wrap}</style>
        </head>
        <body>
          <h1>1週間の献立</h1>
          <pre>${escapeHtml(menuTextArea.value)}</pre>
        </body>
      </html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  // 共有リンク更新
  function updateShareLinks() {
    const text = encodeURIComponent(menuTextArea.value);
    const url = encodeURIComponent(window.location.href);
    shareX.href = `https://twitter.com/intent/tweet?text=${text}%0A${url}`;
    shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    shareLINE.href = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`;
  }

  // 背景色変更
  function changeColor(value) {
    const mapping = {
      default: "#ffffff",
      gray: "#f2f2f2",
      pink: "#fff0f3",
      lightblue: "#f0fbff",
      lightgreen: "#f2fff0",
      yellow: "#fffbe6",
      orange: "#fff6ee",
      purple: "#fbf3ff"
    };
    document.body.style.backgroundColor = mapping[value] || mapping.default;
  }

  // HTMLエスケープ
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  // 初期化
  function init() {
    const week = generateMenu();
    renderMenu(week);
    updateShareLinks();

    btnGenerate.addEventListener("click", () => {
      const newWeek = generateMenu();
      renderMenu(newWeek);
      updateShareLinks();
    });

    btnCopy.addEventListener("click", copyToClipboard);
    btnSavePng.addEventListener("click", saveAsPNG);
    btnPrint.addEventListener("click", printMenu);

    colorSelect.addEventListener("change", (e) => {
      changeColor(e.target.value);
    });

    [shareX, shareFB, shareLINE].forEach(a => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    changeColor("default");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();