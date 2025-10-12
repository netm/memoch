/* /js/y978.js
   営業トーク 発見質問ジェネレーター（プリレンダ30問）
   - ソースにプリレンダ済み30問を保持（SEO対応）
   - ランダムN件生成 / 全表示切替
   - コピー / 印刷 / PNG保存（SVG foreignObject） / X / Facebook / LINE共有
   - 下部に読み物向けJSON表示
*/
(() => {
  'use strict';

  const QUESTIONS = [
    "現在最も解決したい課題は何ですか",
    "その課題が発生したきっかけはいつですか",
    "現状の対応で一番時間やコストがかかっている部分はどこですか",
    "理想的な解決後、どのような成果を期待しますか",
    "現状の解決策で満足していない点を具体的に教えてください",
    "課題が解決されない場合、どのような影響がありますか",
    "導入にあたって最も重視する判断基準は何ですか",
    "これまで検討した代替案はありますか、あれば理由も教えてください",
    "意思決定者はどなたですか、決裁フローはどうなっていますか",
    "導入予算やコストレンジの目安はありますか",
    "現行システム／運用で手放せない必須要件は何ですか",
    "導入のタイムラインや優先度はどのように考えていますか",
    "試験導入やPoCを行うとしたら、評価基準は何ですか",
    "社内で成功とされるKPIや成果指標は何ですか",
    "その課題はどの頻度で発生しますか（例：毎日／週1回）",
    "現在どのようなツールや担当で運用していますか",
    "外部パートナーやベンダーとの関係で懸念はありますか",
    "導入後の運用サポートに期待することは何ですか",
    "セキュリティやコンプライアンスで重要な要件はありますか",
    "類似サービスや競合を比較したことはありますか、結果はどうでしたか",
    "現状データやログで示せる指標はありますか",
    "導入で社内にどのような変化（負荷・利便性）が出ると想定しますか",
    "導入決定の最短と最長のタイミングはいつですか",
    "関係部署間でコンセンサスは取れていますか、否なら障壁は何ですか",
    "導入に伴うトレーニングやマニュアル整備にどれだけのリソースを割けますか",
    "成功事例があるとしたら、どのような条件で効果が出ていましたか",
    "御社の優先業務（コア業務）は何で、そこにどう貢献できると良いですか",
    "導入を阻む最大の不安要素は何ですか",
    "長期的に期待する価値（1年後、3年後）はどのようなものですか",
    "最後に、私たちに期待する一番の役割は何ですか"
  ];

  const $ = id => document.getElementById(id);
  const OUT_ID = "gen-output";

  function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }

  function renderDynamic(list){
    const html = list.map((q,i)=>`
      <section class="q" role="article" aria-labelledby="dyn-q-${i+1}">
        <h3 id="dyn-q-${i+1}"><span class="num">${i+1}.</span> ${escapeHtml(q)}</h3>
        <p class="hint">使いどころ：${escapeHtml(makeHint(q))}</p>
      </section>`).join("");
    $(OUT_ID).innerHTML = `<div class="list">${html}</div>`;
  }

  function makeHint(q){
    if(/KPI|指標|成果/.test(q)) return "導入効果の可視化に使う質問です。具体的な数値を引き出しましょう。";
    if(/予算|コスト/.test(q)) return "投資判断に関する前提条件を確認するための質問です。";
    if(/セキュリティ|コンプライアンス/.test(q)) return "法規制や内部基準の確認に有効です。";
    if(/担当|部署|意思決定/.test(q)) return "決裁フローやSLA設計のために重要です。";
    return "課題の深掘りと優先度把握のために使える質問です。";
  }

  function generateRandom(n=1){
    const pool = QUESTIONS.slice();
    const out = [];
    n = clamp(n,1,pool.length);
    while(out.length < n){
      const idx = Math.floor(Math.random()*pool.length);
      out.push(pool.splice(idx,1)[0]);
    }
    return out;
  }

  function handleCopy(){
    const text = $(OUT_ID).innerText.trim();
    if(!navigator.clipboard){
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); showToast("コピーしました"); } catch(e){ alert("コピーに失敗しました"); }
      ta.remove(); return;
    }
    navigator.clipboard.writeText(text).then(()=> showToast("コピーしました")).catch(()=> alert("コピーに失敗しました"));
  }

  function handlePrint(){ window.print(); }

  async function handleSavePNG(){
    const node = document.getElementById(OUT_ID);
    if(!node) return alert("出力エリアが見つかりません");
    const clone = node.cloneNode(true);
    clone.style.boxSizing = "border-box";
    clone.style.padding = "20px";
    clone.style.background = window.getComputedStyle(node).backgroundColor || "#fff";
    const serialized = new XMLSerializer().serializeToString(clone);
    const width = Math.min(document.documentElement.clientWidth, 1200);
    const height = clone.scrollHeight + 40;
    const svg = `<?xml version="1.0" encoding="utf-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><foreignObject width='100%' height='100%'><div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, 'Noto Sans JP';">${serialized}</div></foreignObject></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try{
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl; a.download = "sales-discovery.png"; a.click();
        URL.revokeObjectURL(url);
        showToast("PNGを保存しました");
      };
      img.onerror = ()=> { URL.revokeObjectURL(url); alert("画像化に失敗しました（外部リソースが原因のことがあります）"); };
      img.src = url;
    } catch(e){
      URL.revokeObjectURL(url);
      alert("PNG生成に失敗しました");
      console.error(e);
    }
  }

  function handleShare(platform){
    const text = $(OUT_ID).innerText.trim().slice(0,280);
    const page = location.href;
    let url = "";
    if(platform === "x") url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(page)}`;
    if(platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page)}`;
    if(platform === "line") url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(page)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }

  function setJsonPreview(list){
    const preview = { title: "営業 発見質問30（生成結果）", generatedAt: new Date().toISOString(), count: list.length, questions: list };
    const el = $("json-preview");
    if(el) el.textContent = JSON.stringify(preview, null, 2);
  }

  function showToast(msg){
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(()=> t.classList.add("visible"));
    setTimeout(()=> { t.classList.remove("visible"); setTimeout(()=> t.remove(),300); },1600);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const btnGen = $("btn-generate"), btnAll = $("btn-all"), btnCopy = $("btn-copy"), btnPrint = $("btn-print");
    const btnPng = $("btn-png"), btnX = $("btn-x"), btnFb = $("btn-fb"), btnLine = $("btn-line");
    const num = $("num");

    if(btnGen) btnGen.addEventListener("click", ()=> {
      const n = clamp(parseInt(num.value,10) || 5, 1, QUESTIONS.length);
      const list = generateRandom(n);
      renderDynamic(list);
      setJsonPreview(list);
    });
    if(btnAll) btnAll.addEventListener("click", ()=> { renderDynamic(QUESTIONS); setJsonPreview(QUESTIONS); window.scrollTo({top:0,behavior:"smooth"}); });
    if(btnCopy) btnCopy.addEventListener("click", handleCopy);
    if(btnPrint) btnPrint.addEventListener("click", handlePrint);
    if(btnPng) btnPng.addEventListener("click", handleSavePNG);
    if(btnX) btnX.addEventListener("click", ()=> handleShare("x"));
    if(btnFb) btnFb.addEventListener("click", ()=> handleShare("facebook"));
    if(btnLine) btnLine.addEventListener("click", ()=> handleShare("line"));

    setJsonPreview(QUESTIONS.slice(0,5));
  });

  window.SALES_DISCOVERY = { QUESTIONS, generateRandom };

})();