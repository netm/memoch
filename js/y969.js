// script.js ）
const RECIPES = [
  { id:1, title:"ほうれん草と卵のヘルシーサラダ", category:"サラダ",
    instructions:"卵を固ゆでにし、ほうれん草とトマトをカット。オリーブオイル・レモン汁・塩で和える。" },
  { id:2, title:"豆腐と卵のやさしいスープ", category:"スープ",
    instructions:"鶏ガラスープを沸かし、絹ごし豆腐と溶き卵を加える。ねぎを散らして完成。" },
  { id:3, title:"アボカド卵サラダ", category:"サラダ",
    instructions:"アボカドを潰し、茹で卵とレモン・塩・胡椒で和える。全粒粉パンにのせてどうぞ。" },
  { id:4, title:"トマトと卵の中華風スープ", category:"スープ",
    instructions:"ごま油でにんにくを炒め、トマト・だしを入れ溶き卵を流し入れる。醤油で味を整える。" },
  { id:5, title:"きのこオムレツ風サラダ", category:"サラダ",
    instructions:"きのこをソテーし、半熟のスクランブルエッグと混ぜてサラダリーフにのせる。" },
  { id:6, title:"中華風卵とワカメのスープ", category:"スープ",
    instructions:"鶏スープにワカメを入れ、溶き卵でとじる。ごま油と白胡椒を少々。" },
  /* 省略せずに既にある全レシピ（合計206件）をここに含めてください */
];

// DOM要素
const btnToday = document.getElementById("btn-today");
const btnSalad = document.getElementById("btn-salad");
const btnSoup = document.getElementById("btn-soup");
const btnOkazu = document.getElementById("btn-okazu");
const container = document.getElementById("recipe-frame");
const titleEl = document.getElementById("recipe-title");
const instrEl = document.getElementById("recipe-instructions");
const copyBtn = document.getElementById("btn-copy");
const pngBtn = document.getElementById("btn-png");
const shareX = document.getElementById("btn-x");
const shareFB = document.getElementById("btn-fb");
const shareLINE = document.getElementById("btn-line");
const shareMail = document.getElementById("btn-mail");
const relatedLinks = document.getElementById("related-links");
const listArea = document.getElementById("recipe-list");
const backTop = document.getElementById("back-top");
const keywordMeta = document.getElementById("meta-keywords");

// 検索向けキーワード（SEO補助）
const SITE_KEYWORDS = [
  "卵レシピ","ヘルシー卵","卵サラダ","卵スープ","おかず卵","簡単レシピ","低カロリー卵料理"
];
if (keywordMeta) keywordMeta.setAttribute("content", SITE_KEYWORDS.join(", "));

// 状態
let currentList = RECIPES;
let lastShown = null;

// ユーティリティ: 指定配列からランダム要素（前回と重複しない）
function pickRandom(list){
  if(!list || list.length===0) return null;
  if(list.length===1) return list[0];
  let pick;
  let attempts = 0;
  do {
    pick = list[Math.floor(Math.random()*list.length)];
    attempts++;
    if(attempts>20) break;
  } while(lastShown && pick.id === lastShown.id && list.length>1);
  lastShown = pick;
  return pick;
}

// レシピ表示
function renderRecipe(recipe){
  if(!recipe) {
    titleEl.textContent = "レシピが見つかりません";
    instrEl.textContent = "";
    relatedLinks.innerHTML = "";
    updateShareLinks();
    return;
  }
  titleEl.textContent = recipe.title;
  instrEl.textContent = recipe.instructions;
  relatedLinks.innerHTML = `
    <a href="https://www.google.com/search?q=${encodeURIComponent(recipe.title + " レシピ")}" target="_blank" rel="noopener">「${recipe.title}」の作り方をもっと見る</a>
  `;
  container.scrollIntoView({behavior:"smooth", block:"center"});
  updateShareLinks();
}

// カテゴリでフィルタリングしてランダム表示
function showCategory(category){
  const filtered = RECIPES.filter(r => r.category === category);
  currentList = filtered.length ? filtered : RECIPES;
  const recipe = pickRandom(currentList);
  renderRecipe(recipe);
  highlightCategoryButton(category);
}

// 今日の卵ヘルシーレシピ（全体からランダム）
function showToday(){
  currentList = RECIPES;
  const recipe = pickRandom(RECIPES);
  renderRecipe(recipe);
  highlightCategoryButton(null);
}

// カテゴリボタンの強調解除/適用
function highlightCategoryButton(category){
  [btnToday, btnSalad, btnSoup, btnOkazu].forEach(b => { if(b) b.classList.remove("active"); });
  if(!category) { if(btnToday) btnToday.classList.add("active"); return; }
  if(category==="サラダ" && btnSalad) btnSalad.classList.add("active");
  if(category==="スープ" && btnSoup) btnSoup.classList.add("active");
  if(category==="おかず" && btnOkazu) btnOkazu.classList.add("active");
}

// 文章コピー
if (copyBtn) {
  copyBtn.addEventListener("click", async ()=>{
    const text = `${titleEl.textContent}\n\n${instrEl.textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      const original = copyBtn.textContent;
      copyBtn.textContent = "コピー済み";
      setTimeout(()=> copyBtn.textContent = original, 1500);
    } catch(e){
      alert("コピーに失敗しました。ブラウザの許可を確認してください。");
    }
  });
}

// PNG保存: レシピ枠をSVGで作ってCanvasに描画してPNGダウンロード
if (pngBtn) {
  pngBtn.addEventListener("click", ()=>{
    const w = 800;
    const h = 600;
    const padding = 40;
    const title = titleEl.textContent || "";
    const instr = instrEl.textContent || "";
    const svgContent = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
        <rect width='100%' height='100%' fill='#fff8f0'/>
        <rect x='10' y='10' width='${w-20}' height='${h-20}' rx='16' ry='16' fill='#fff'/>
        <text x='${padding}' y='70' font-size='36' font-weight='700' fill='#2b3a55' font-family='sans-serif'>${escapeXml(title)}</text>
        <foreignObject x='${padding}' y='110' width='${w-padding*2}' height='${h-140}'>
          <div xmlns='http://www.w3.org/1999/xhtml' style='font-family: sans-serif; color:#333; font-size:18px; line-height:1.5;'>
            ${escapeHtmlForDiv(instr)}
          </div>
        </foreignObject>
      </svg>
    `;
    const svgBlob = new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img,0,0);
      URL.revokeObjectURL(url);
      c.toBlob(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${sanitizeFilename(title)}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, "image/png");
    };
    img.onerror = ()=> alert("画像作成に失敗しました。");
    img.src = url;
  });
}

// サイト内リスト表示（たくさん表示）
function renderList(){
  if(!listArea) return;
  listArea.innerHTML = "";
  RECIPES.forEach(r => {
    const item = document.createElement("article");
    item.className = "list-item card";
    item.innerHTML = `
      <h4 class="list-title">${r.title}</h4>
      <p class="list-cat">カテゴリ: ${r.category}</p>
      <p class="list-instr">${r.instructions}</p>
      <button class="btn-ghost btn-use" data-id="${r.id}">表示</button>
    `;
    listArea.appendChild(item);
  });
  // イベント: 表示ボタン
  document.querySelectorAll(".btn-use").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = Number(e.currentTarget.dataset.id);
      const r = RECIPES.find(x=>x.id===id);
      if(r){ renderRecipe(r); lastShown = r; }
    });
  });
}

// シェアボタンURL構築
function updateShareLinks(){
  if(!shareX || !shareFB || !shareLINE || !shareMail) return;
  const title = titleEl.textContent || "";
  const text = instrEl.textContent || "";
  const pageUrl = location.href;
  const shareText = `${title}\n${text}`;
  shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
  shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
  shareLINE.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
  shareMail.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + pageUrl)}`;
}

// ヘッダーボタンイベント（「おかず」ボタンは何度押してもランダム表示される）
if (btnToday) btnToday.addEventListener("click", ()=>{ showToday(); });
if (btnSalad) btnSalad.addEventListener("click", ()=>{ showCategory("サラダ"); });
if (btnSoup) btnSoup.addEventListener("click", ()=>{ showCategory("スープ"); });
if (btnOkazu) btnOkazu.addEventListener("click", ()=>{ showCategory("おかず"); });

// ページ生成時の初期処理
document.addEventListener("DOMContentLoaded", ()=>{
  renderList();
  showToday();
  // トップリンク
  if(backTop) backTop.addEventListener("click", (e)=>{
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

// ヘルパー: ファイル名用に安全化
function sanitizeFilename(name){
  return String(name || "recipe").replace(/[\/\\:\*\?"<>\|]/g,"_").slice(0,120);
}

// ヘルパー: XMLエスケープ（SVG内テキスト）
function escapeXml(unsafe){
  return String(unsafe || "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&apos;','"':'&quot;'}[c]));
}

// ヘルパー: HTMLとして外部表示用に簡易整形（改行対応）
function escapeHtmlForDiv(text){
  const esc = escapeXml(text);
  const html = esc.replace(/\n/g, "<br/>");
  return `<div style="white-space: pre-wrap;">${html}</div>`;
}