/* /js/y980.js -（面接質問ジェネレーター） */
(() => {
  'use strict';
  const QUESTIONS = [
"御社が今最も注力している事業は何ですか",
"このポジションで最初の6ヶ月に期待される成果は何ですか",
"チームの一日の典型的な流れを教えてください",
"成功している社員に共通する特徴は何ですか",
"直近で乗り越えた大きな課題は何ですか",
"御社の中長期的なビジョンをどう実現する予定ですか",
"この部署の主要なKPIは何ですか",
"入社後のキャリアパスは一般的にどのようになりますか",
"会社が大切にしている価値観は何ですか",
"意思決定のプロセスはどのように設計されていますか",
"チーム内でのフィードバック文化はどのようなものですか",
"この仕事で一番難しいと想定される点は何ですか",
"成功を判断する基準はどのようになっていますか",
"現在のチーム体制と役割分担を教えてください",
"御社の顧客層やターゲットはどのように変化していますか",
"このロールで最初に取り組むべき優先課題は何ですか",
"入社したばかりのメンバーに提供される支援は何がありますか",
"リモートワークと出社のバランスはどのようになっていますか",
"部署間の連携で重視しているポイントは何ですか",
"最近のプロダクト改善で重要だった判断軸は何ですか",
"会社の競合優位性はどのように説明できますか",
"リーダーシップが重視する短期目標とは何ですか",
"この職種で高頻度で出る意思決定の種類は何ですか",
"オンボーディングの目標は採用後どの時点で達成されますか",
"成果を出しやすい人が取り組む習慣は何ですか",
"現在のチームにおける最大の強みと弱みは何ですか",
"業務の中で裁量が大きいポイントはどこですか",
"過去1年で学んだ大きな教訓は何ですか",
"社内でキャリアを変える機会はどのように存在しますか",
"直近の離職理由で改善した点はありますか",
"ユーザーからの典型的なフィードバックはどのようなものですか",
"プロジェクトの優先順位は誰が、どのように決めますか",
"チームに新しいアイデアを持ち込む方法はどのようですか",
"日常的に使われているツールやワークフローを教えてください",
"仕事とプライベートの境界は社内でどう扱われていますか",
"面接ではどのような人物像を求めていますか",
"評価サイクルの頻度と評価基準について教えてください",
"このポジションで成功した過去の事例を教えてください",
"顧客対応で最も大切にしている姿勢は何ですか",
"チームミーティングの頻度と形式を教えてください",
"この役割で発生しがちな障害の例を教えてください",
"部署ごとの成長戦略はどのように共有されていますか",
"リスク管理はチームでどのように行っていますか",
"内定後に期待される手続きや条件は何ですか",
"入社初日に期待される準備や心構えは何ですか",
"プロジェクトで失敗したときの学びや対応はどうしていますか",
"採用後の研修や自己学習支援の制度はありますか",
"上司のマネジメントスタイルを一言で表すと何ですか",
"チームに求められるコミュニケーション頻度はどの程度ですか",
"職場での多様性・包摂性に対する取り組みはありますか",
"現在取り組んでいる技術的負債は何ですか",
"働きやすさ向上のために最近導入した施策はありますか",
"会社が直面している法務や規制面の課題はありますか",
"市場環境の変化にどう対応しているか具体例を教えてください",
"部門間でのナレッジ共有の仕組みはありますか",
"成功しているプロジェクトに共通する開始時の条件は何ですか",
"顧客満足度を測る主な指標は何ですか",
"裁量のある予算管理はどの程度可能ですか",
"チームメンバーの平均的な勤続年数はどのくらいですか",
"問題解決で重視するフレームワークはありますか",
"この会社で働く上で想定される典型的な1日の流れは？",
"社内の学びの文化（勉強会・技術共有）の頻度はどれくらい？",
"業務外での社内交流（イベントなど）はどのように行われていますか",
"プロダクト戦略の立案に現場はどの程度関与できますか",
"現在の採用チームが最も重視する人物像はどのような人か",
"現在募集中のポジションで重視されるスキルセットは何か",
"社内で使われている評価フィードバックの具体例を教えてください",
"従業員の意見が経営に反映される仕組みはありますか",
"新しい技術導入の意思決定はどのように行われますか",
"チームのペースメーカーとなる人物像はどのような人か",
"ロードマップの優先度が変わる要因は何ですか",
"目の前の顧客ニーズと中長期戦略のバランスはどう取っていますか",
"社内で称賛される行動例を教えてください",
"成功例の振り返り（ポストモーテム）はどのように実施していますか",
"上司と期待値を合わせるために推奨される方法は何ですか",
"仕事で裁量を得るために最初に取り組むべきことは何ですか",
"組織文化を言語化するとしたらどのように説明しますか",
"仕事でのストレス軽減施策はどのようなものがありますか",
"社内での昇進基準や手続きはどのようになっていますか",
"プロジェクトのスコープ変更時の調整方法を教えてください",
"顧客の声をプロダクトに反映する仕組みはありますか",
"資料作成やドキュメント文化の整備度合いはどうですか",
"チームに新しく入る人に期待する最初のアウトプットは何ですか",
"外部パートナーや委託先との関係構築の指針はありますか",
"社内での意思疎通で失敗しやすいポイントは何ですか",
"将来的に社外活動（カンファレンス登壇等）は奨励されていますか",
"採用プロセスで重視する課題解決の具体例を教えてください",
"短期的に改善したいと考えている業務プロセスは何ですか",
"配属先のチームによって働き方に差はありますか",
"職務に関連する認定や資格取得の支援はありますか",
"リモートメンバーとのコラボで工夫していることは何ですか",
"新製品やサービスを市場投入する際の典型的なリードタイムはどの程度ですか",
"社内での予算配分はどの程度公開されていますか",
"最近注力している採用チャネルや手法は何ですか",
"社内の安全衛生やメンタルヘルス対策の具体例を教えてください",
"部署異動やジョブローテーションの頻度や方針はどうなっていますか",
"チーム内での知識やスキルの標準化はどのように進めていますか",
"社外ベンチマークやKPI比較はどの頻度で行われていますか",
"重要なステークホルダーとの関係構築で意識していることは何ですか",
"社内での失敗を受けて制度やプロセスを変えた具体例はありますか",
"働き方や福利厚生で競合他社と差別化している点は何ですか",
"期待される週あたりの平均残業時間はどのくらいですか",
"従業員の声を集めるために使っているツールや仕組みは何ですか"
  ];

  const $ = id => document.getElementById(id);
  const OUT_ID = "gen-output";

  function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }

  const PRE_RENDERED = QUESTIONS.slice(0,20);

  function renderStaticPreRendered(){
    const html = PRE_RENDERED.map((q,i)=>`
      <section class="q" role="article" aria-labelledby="pre-q-${i+1}">
        <h2 id="pre-q-${i+1}"><span class="num">${i+1}.</span> ${escapeHtml(q)}</h2>
        <p class="hint">使いどころ：${escapeHtml(simpleHint(q))}</p>
      </section>`).join("");
    return `<div class="pre-rendered"><h2>代表的なテンプレ（例 1〜20）</h2>${html}</div>`;
  }

  function simpleHint(q){
    if(/KPI|成果|評価/.test(q)) return "評価基準や期待値の確認に使う。具体例を求めるフォローを。";
    if(/チーム|連携|メンバー/.test(q)) return "チーム構成や連携体制を確認する際に有効。";
    if(/顧客|ユーザー/.test(q)) return "顧客視点・事例を深掘りするために有効。";
    return "背景や実例を引き出すフォロー質問を用意する。";
  }

  function renderGeneratedBlock(list){
    const html = list.map((q,i)=>`
      <section class="q" role="article" aria-labelledby="g-q-${i+1}">
        <h3 id="g-q-${i+1}"><span class="num">${i+1}.</span> ${escapeHtml(q)}</h3>
        <p class="hint">使いどころと応用例：${escapeHtml(makeHint(q))}</p>
      </section>`).join("");
    return `<div class="generated"><h2>面接の質問　生成結果</h2><div class="list">${html}</div></div>`;
  }

  function makeHint(q){
    if(/KPI|成果|期待|評価/.test(q)) return "期待値や評価基準を確認するための質問です。具体的な事例を求めるフォローを加えてください。";
    if(/チーム|連携|メンバー/.test(q)) return "チーム運営や連携の実態を確認するための質問です。役割や頻度を具体的に聞き出しましょう。";
    if(/顧客|ユーザー|満足度/.test(q)) return "顧客視点を把握するための質問です。数値やケースを確認すると良いです。";
    return "背景や具体例を深掘りするために続けてフォロー質問を用意してください。";
  }

  function generateRandom(n=1){
    const pool = QUESTIONS.slice();
    n = clamp(Math.floor(Number(n) || 1), 1, pool.length);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, n);
  }

  function handleCopy(){
    const out = $(OUT_ID);
    if(!out) return alert("出力エリアが見つかりません");
    const text = out.innerText.trim();
    if(!navigator.clipboard){
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); showToast("コピーしました"); } catch(e){ alert("コピーに失敗しました"); }
      ta.remove();
      return;
    }
    navigator.clipboard.writeText(text).then(()=> showToast("コピーしました")).catch(()=> alert("コピーに失敗しました"));
  }

  function handlePrint(){ window.print(); }

  // Share handler - fixed LINE share URL and robust encoding
  function handleShare(platform){
    const out = $(OUT_ID);
    if(!out) return alert("出力エリアが見つかりません");
    const text = out.innerText.trim().slice(0,300);
    const pageUrl = location.href;
    let url = "";
    if(platform==="x") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
    } else if(platform==="facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    } else if(platform==="line") {
      // LINE official share endpoint: pass url and text; ensures proper encoding
      const u = encodeURIComponent(pageUrl);
      const t = encodeURIComponent(text);
      url = `https://social-plugins.line.me/lineit/share?url=${u}&text=${t}`;
    }
    window.open(url, "_blank", "noopener");
  }

  function showToast(msg){
    const t = document.createElement("div"); t.className="toast"; t.textContent=msg; document.body.appendChild(t);
    requestAnimationFrame(()=> t.classList.add("visible"));
    setTimeout(()=> { t.classList.remove("visible"); setTimeout(()=> t.remove(),300); },1600);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const bGen = $("btn-generate"), bAll = $("btn-all"), bCopy = $("btn-copy"), bPrint = $("btn-print"),
          bX = $("btn-x"), bFb = $("btn-fb"), bLine = $("btn-line"), bAllBottom = $("btn-all-bottom");
    const out = $(OUT_ID);
    if(out) out.innerHTML = renderStaticPreRendered();

    if(bGen) bGen.addEventListener("click", ()=> {
      const n = parseInt($("num").value,10) || 5;
      const generated = generateRandom(n);
      if(out) out.innerHTML = renderGeneratedBlock(generated) + renderStaticPreRendered();
    });

    function renderFullList(list){
      const html = list.map((q,i)=>`
        <section class="q" role="article" aria-labelledby="all-q-${i+1}">
          <h3 id="all-q-${i+1}"><span class="num">${i+1}.</span> ${escapeHtml(q)}</h3>
          <p class="hint">使いどころ：${escapeHtml(simpleHint(q))}</p>
        </section>`).join("");
      if(out) out.innerHTML = `<div class="all-list"><h2>全テンプレ（${list.length}件）</h2><div class="list">${html}</div></div>`;
    }

    if(bAll) bAll.addEventListener("click", ()=> { renderFullList(QUESTIONS); });
    if(bAllBottom) bAllBottom.addEventListener("click", ()=> { renderFullList(QUESTIONS); });

    if(bCopy) bCopy.addEventListener("click", handleCopy);
    if(bPrint) bPrint.addEventListener("click", handlePrint);
    if(bX) bX.addEventListener("click", ()=> handleShare("x"));
    if(bFb) bFb.addEventListener("click", ()=> handleShare("facebook"));
    if(bLine) bLine.addEventListener("click", ()=> handleShare("line"));
  });

  window.QA_GENERATOR = { QUESTIONS, generateRandom };
})();