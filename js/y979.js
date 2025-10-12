/* /js/y879.js
   カスタマー対応質問ジェネレーター 完全版（プリレンダ 50件）
   機能:
   - ページ内にプリレンダ済み50件を保持（SEO対応）
   - ボタンで生成（ランダム N 件） / 全表示切替
   - コピー / 印刷 / PNG 保存（SVG foreignObject 経由） / X(FKA Twitter) / Facebook / LINE 共有
   - 下部に読み物用 JSON を表示
*/
(() => {
  'use strict';

  const QUESTIONS = [
"ご利用いただいた際の目的を教えていただけますか",
"問題が発生した具体的な手順を教えてください",
"エラーメッセージや表示されている内容を教えてください",
"どのブラウザ／アプリ／OSをお使いですか",
"ご利用の際に直近で行った操作を順に教えてください",
"同様の問題は以前にも発生していましたか",
"問題発生時のスクリーンショットやログはありますか",
"アカウント情報（登録メール等）を確認してもよろしいですか",
"課金や請求に関するお問い合わせですか、機能の不具合ですか",
"優先度はどの程度ですか（今すぐ／今日中／対応可）",
"この問題で業務や作業にどれくらい影響がありますか",
"ご希望の解決方法や暫定対応案はありますか",
"類似の機能で代替可能な運用はありますか",
"アカウントに二段階認証などの設定はありますか",
"通信環境（Wi-Fi／モバイル）やネットワークの状況はいかがですか",
"ご利用開始時刻と問題発生時刻を教えてください",
"端末の再起動や再ログインはお試しになりましたか",
"キャッシュ・クッキーの削除やアプリの再インストールは試しましたか",
"他のユーザーで同様の報告はございますか（社内・チーム内）",
"関連する注文番号・チケット番号をお持ちですか",
"お支払い方法や請求番号を確認してもよろしいですか",
"返金やキャンセルをご希望ですか、それとも修正をご希望ですか",
"商品のシリアル番号やロット番号は確認できますか",
"配送状況の確認をしてもよろしいですか",
"お届け先の住所や受取人名に誤りはありませんか",
"利用規約や制限に該当する可能性はありますか（例: 制限国）",
"画面のどの部分をタップ／クリックした際に起きましたか",
"試した操作で新たに発生した変化はありますか",
"現在の画面のスクロール位置やフィルタ設定はどうなっていますか",
"社内担当者に確認が必要な情報はありますか",
"過去に行ったトラブル対応履歴があれば教えてください",
"ご希望の連絡手段（電話/メール/チャット）はどれですか",
"営業時間外の場合の対応可否についてご希望はありますか",
"プライバシーや個人情報に関する懸念点はありますか",
"当社の手順で確認が必要な操作をこちらで代行してもよろしいですか",
"アカウント復旧のための本人確認書類の準備は可能ですか",
"お急ぎの場合、優先対応のオプションを説明してもよろしいですか",
"類似ケースでの対応実績（事例）をお伝えしてもよろしいですか",
"問題解決後の再発防止策や代替フローはどのように希望しますか",
"今後同様の状況を防ぐために行っている対策はありますか",
"ご利用満足度を短く評価（1〜5）していただけますか",
"今回の対応で期待する完了条件を簡潔に教えてください",
"追加でこちらが確認すべき関連情報は他にありますか",
"当サポートの対応で優先してほしい事項は何ですか",
"本件に関する社内承認や予算確認は必要ですか",
"最後に、こちらから何か質問させていただいてもよろしいですか"
  ];

  const $ = id => document.getElementById(id);
  const OUT_ID = "gen-output";

  function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }

  // 初回表示はプリレンダ済み HTML に依存するため、動的レンダは追加表示用
  function renderDynamic(list){
    const dynamicHtml = list.map((q,i)=>`
      <section class="q" role="article" aria-labelledby="q-${i+1}">
        <h3 id="q-${i+1}"><span class="num">${i+1}.</span> ${escapeHtml(q)}</h3>
        <p class="hint">使いどころと応用例：${escapeHtml(simpleHint(q))}</p>
      </section>`).join("");
    // ページには既にプリレンダ 50 件があるので、切替で置き換える
    $(OUT_ID).innerHTML = `<div class="list">${dynamicHtml}</div>`;
  }

  function simpleHint(q){
    if(/請求|返金|キャンセル|支払い|請求番号/.test(q)) return "請求や返金に関する確認で使います。";
    if(/配送|住所|受取人/.test(q)) return "配送トラブルや受取確認時に有用です。";
    if(/ブラウザ|アプリ|OS|スクリーンショット/.test(q)) return "環境情報や再現手順を確認するために尋ねます。";
    return "状況把握と優先度決定のための基本確認質問です。";
  }

  // ランダム生成（ユニーク）
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

  // コピー（フォールバック付き）
  function handleCopy(){
    const text = $.call ? $.call(OUT_ID).innerText.trim() : $(OUT_ID).innerText.trim();
    if(!navigator.clipboard){
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); showToast("コピーしました"); } catch(e){ alert("コピーに失敗しました"); }
      ta.remove(); return;
    }
    navigator.clipboard.writeText(text).then(()=> showToast("コピーしました")).catch(()=> alert("コピーに失敗しました"));
  }

  // 印刷
  function handlePrint(){ window.print(); }

  // PNG 保存（SVG foreignObject ベース）
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
        a.href = dataUrl; a.download = "customer-questions.png"; a.click();
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

  // SNS共有
  function handleShare(platform){
    const text = $(OUT_ID).innerText.trim().slice(0,300);
    const page = location.href;
    let url = "";
    if(platform === "x") url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(page)}`;
    if(platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page)}`;
    if(platform === "line") url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(page)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }

  // JSON 表示（読み物向け）
  function setJsonPreview(list){
    const preview = { title:"カスタマー対応で使える質問例（生成結果）", generatedAt:new Date().toISOString(), count:list.length, questions:list };
    const el = $("json-preview");
    if(el) el.textContent = JSON.stringify(preview, null, 2);
  }

  // トースト表示
  function showToast(msg){
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(()=> t.classList.add("visible"));
    setTimeout(()=> { t.classList.remove("visible"); setTimeout(()=> t.remove(),300); },1600);
  }

  // 初期化
  document.addEventListener("DOMContentLoaded", ()=>{
    const gen = $("btn-generate");
    const all = $("btn-all");
    const copyBtn = $("btn-copy");
    const printBtn = $("btn-print");
    const pngBtn = $("btn-png");
    const xBtn = $("btn-x");
    const fbBtn = $("btn-fb");
    const lineBtn = $("btn-line");
    const numInput = $("num");

    if(gen) gen.addEventListener("click", ()=> {
      const n = clamp(parseInt(numInput.value,10) || 5, 1, QUESTIONS.length);
      const list = generateRandom(n);
      renderDynamic(list);
      setJsonPreview(list);
    });

    if(all) all.addEventListener("click", ()=> {
      // 切替: 全プリレンダ（HTML側でプリレンダ済み50件があるので scroll 先頭へ）
      // Restore original pre-render HTML by reloading the page fragment
      // Simpler: render the full QUESTIONS array dynamically (mirrors pre-render)
      renderDynamic(QUESTIONS);
      setJsonPreview(QUESTIONS);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if(copyBtn) copyBtn.addEventListener("click", handleCopy);
    if(printBtn) printBtn.addEventListener("click", handlePrint);
    if(pngBtn) pngBtn.addEventListener("click", handleSavePNG);
    if(xBtn) xBtn.addEventListener("click", ()=> handleShare("x"));
    if(fbBtn) fbBtn.addEventListener("click", ()=> handleShare("facebook"));
    if(lineBtn) lineBtn.addEventListener("click", ()=> handleShare("line"));

    // 初期 JSON プレビュー：最初の 5 件（表示はプリレンダ50件）
    const initial = QUESTIONS.slice(0,5);
    setJsonPreview(initial);
  });

  // デバッグ用エクスポート
  window.CUSTOMER_Q = { QUESTIONS, generateRandom };

})();