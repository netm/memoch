(() => {
  // DOM
  const moods = ["明日","未来","成功","目標","計画","次","活","前","昨日","過去","やる気","気持ち","心","本当","本気","うれしい","感謝","声","普通","休","体","時間","孤独","失敗","不安","怒","忘"];
  const btnToday = document.getElementById("btn-today");
  const moodButtons = document.getElementById("mood-buttons");
  const inputFeel = document.getElementById("feel-input");
  const btnCopyText = document.getElementById("copy-text");
  const btnCopyHash = document.getElementById("copy-hash");
  const btnClear = document.getElementById("clear-all");
  const btnSavePng = document.getElementById("save-png");
  const shareX = document.getElementById("share-x");
  const shareFB = document.getElementById("share-fb");
  const shareLine = document.getElementById("share-line");
  const quoteFrame = document.getElementById("quote-frame");
  const savedStatus = document.getElementById("saved-status");
  const articles = Array.from(document.querySelectorAll("#quote-collection article"));
  const siteLinkA = document.querySelectorAll(".back-site");

  // utilities
  const getAllQuotes = () => articles.map(a => {
    const text = a.querySelector('[itemprop="text"]').textContent.trim();
    const headline = a.querySelector('[itemprop="headline"]').textContent.trim();
    const author = a.querySelector('[itemprop="author"]').textContent.trim();
    return {text, headline, author};
  });

  const quotes = getAllQuotes();

  function normalize(s){ return s.normalize().toLowerCase(); }
  function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  // render
  function renderQuote(obj){
    quoteFrame.innerHTML = "";
    const box = document.createElement("div");
    box.className = "quote-box";
    const h = document.createElement("h2");
    h.className = "quote-headline";
    h.textContent = obj.headline || obj.text;
    const block = document.createElement("blockquote");
    block.className = "quote-text";
    block.textContent = obj.text;
    const cite = document.createElement("cite");
    cite.className = "quote-author";
    cite.textContent = obj.author || "不明";
    box.appendChild(h);
    box.appendChild(block);
    box.appendChild(cite);
    quoteFrame.appendChild(box);
    // save visible state
    saveState();
  }

  // filtering by mood word
  function filterByWord(word){
    const w = normalize(word);
    const matched = quotes.filter(q => normalize(q.text).includes(w) || normalize(q.headline).includes(w));
    if(matched.length) renderQuote(pickRandom(matched));
    else renderQuote({headline:"該当する名言は見つかりませんでした。", text:word + " を含む名言がありません。", author:""});
  }

  // search by input words
  function filterByInput(text){
    const words = text.split(/\s+/).map(s => s.trim()).filter(Boolean).map(normalize);
    if(words.length===0){
      savedStatus.textContent = "";
      return;
    }
    const matched = quotes.filter(q => words.some(w => normalize(q.text).includes(w) || normalize(q.headline).includes(w)));
    if(matched.length) renderQuote(pickRandom(matched));
    else renderQuote({headline:"見つかりません", text:"入力した語に一致する名言がありません。", author:""});
  }

  // copy helpers
  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      savedStatus.textContent = "コピーしました";
      setTimeout(()=> savedStatus.textContent="", 1500);
    }catch(e){
      savedStatus.textContent = "コピーに失敗しました";
      setTimeout(()=> savedStatus.textContent="", 1500);
    }
  }

  // URL hash state: mood or random or input
  function buildHash(state){
    const parts = [];
    if(state.type) parts.push("t="+encodeURIComponent(state.type));
    if(state.v) parts.push("v="+encodeURIComponent(state.v));
    return "#"+parts.join("&");
  }
  function parseHash(){
    const h = location.hash.replace(/^#/,'');
    if(!h) return null;
    const obj = {};
    h.split("&").forEach(p=>{
      const [k,v]=p.split("=");
      if(k && v) obj[k]=decodeURIComponent(v);
    });
    return obj;
  }
  function applyHash(){
    const obj = parseHash();
    if(!obj) return;
    if(obj.t==="mood" && obj.v) filterByWord(obj.v);
    else if(obj.t==="input" && obj.v) {
      inputFeel.value = obj.v;
      filterByInput(obj.v);
    } else if(obj.t==="random") {
      renderQuote(pickRandom(quotes));
    }
  }

  // save to localStorage
  function saveState(){
    const q = quoteFrame.querySelector(".quote-box");
    if(!q) return;
    const state = {
      html: q.innerHTML,
      timestamp: Date.now(),
      hash: location.hash
    };
    localStorage.setItem("quoteAppState", JSON.stringify(state));
    savedStatus.textContent = "ブラウザに保存済み";
    setTimeout(()=> savedStatus.textContent="", 1200);
  }
  function restoreState(){
    const raw = localStorage.getItem("quoteAppState");
    if(!raw) return;
    try{
      const s = JSON.parse(raw);
      if(s && s.html){
        quoteFrame.innerHTML = '<div class="quote-box">'+s.html+'</div>';
      }
    }catch(e){}
  }

  // export PNG from quoteFrame by rendering SVG then canvas
  function downloadPNG(filename="quote.png"){
    const box = quoteFrame.querySelector(".quote-box");
    if(!box) return;
    const style = getComputedStyle(box);
    const width = Math.max(box.offsetWidth, 600);
    const height = Math.max(box.offsetHeight, 200);

    // prepare text/html safely for foreignObject
    // preserve line breaks by converting them to <br> and ensure pre-wrap
    const rawHtml = box.querySelector(".quote-text").textContent || "";
    const escaped = rawHtml.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const htmlWithBreaks = escaped.replace(/\r\n|\r|\n/g,"<br/>");
    const headlineRaw = box.querySelector(".quote-headline").textContent || "";
    const headlineEsc = headlineRaw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const authorRaw = box.querySelector(".quote-author").textContent || "";
    const authorEsc = authorRaw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const bg = window.getComputedStyle(box).backgroundColor || "#fff";
    const color = style.color || "#000";
    const fontFamily = (style.fontFamily || "sans-serif").replace(/"/g,"'");

    // include explicit white-space:pre-wrap so <br/> and long text wrap properly
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${bg}"/>
        <foreignObject x="0" y="0" width="${width}" height="${height}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;padding:30px;box-sizing:border-box;">
            <div style="font-family:${fontFamily};color:${color};max-width:100%;width:100%;">
              <div style="font-size:28px;font-weight:700;margin-bottom:14px;line-height:1.2;word-break:break-word;">${headlineEsc}</div>
              <div style="font-size:22px;line-height:1.5;margin-bottom:14px;white-space:pre-wrap;word-break:break-word;">${htmlWithBreaks}</div>
              <div style="font-size:18px;text-align:right;color:rgba(0,0,0,0.6);">— ${authorEsc}</div>
            </div>
          </div>
        </foreignObject>
      </svg>
    `;
    const img = new Image();
    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try{
        const dpr = window.devicePixelRatio || 1;
        const c = document.createElement("canvas");
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
        const ctx = c.getContext("2d");
        ctx.scale(dpr, dpr);
        // fill with bg in case of transparent parts
        ctx.fillStyle = bg;
        ctx.fillRect(0,0,width,height);
        ctx.drawImage(img,0,0);
        URL.revokeObjectURL(url);
        c.toBlob(blob=>{
          if(!blob){
            savedStatus.textContent = "PNG生成に失敗しました";
            setTimeout(()=> savedStatus.textContent="",1500);
            return;
          }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, "image/png");
      }catch(e){
        URL.revokeObjectURL(url);
        savedStatus.textContent = "PNG変換に失敗しました";
        setTimeout(()=> savedStatus.textContent="",1500);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      savedStatus.textContent = "PNG変換に失敗しました";
      setTimeout(()=> savedStatus.textContent="",1500);
    };
    // use blob URL (same-origin) to avoid CORS taint; set src last to start loading
    img.src = url;
  }

  // social share links
  function setupShareLinks(){
    const box = quoteFrame.querySelector(".quote-box");
    if(!box) return;
    const text = box.querySelector(".quote-text").textContent;
    const author = box.querySelector(".quote-author").textContent;
    const shareText = encodeURIComponent(`"${text}" — ${author}`);
    const pageUrl = encodeURIComponent(location.href);
    shareX.href = `https://x.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
    shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareText}`;
    shareLine.href = `https://social-plugins.line.me/lineit/share?url=${pageUrl}&text=${shareText}`;
  }

  // init mood buttons
  moods.forEach(m=>{
    const b = document.createElement("button");
    b.type="button";
    b.className="mood-btn";
    b.textContent = m;
    b.addEventListener("click", ()=> {
      filterByWord(m);
      location.hash = buildHash({type:"mood", v:m});
      setupShareLinks();
    });
    moodButtons.appendChild(b);
  });

  // Today button
  btnToday.addEventListener("click", () => {
    renderQuote(pickRandom(quotes));
    location.hash = buildHash({type:"random", v:"1"});
    setupShareLinks();
  });

  // input handler with debounce
  let debounceTimer = null;
  inputFeel.addEventListener("input", ()=> {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=>{
      const v = inputFeel.value.trim();
      if(v===""){ savedStatus.textContent=""; return; }
      filterByInput(v);
      location.hash = buildHash({type:"input", v:v});
      setupShareLinks();
    }, 300);
  });

  // copy text
  btnCopyText.addEventListener("click", ()=>{
    const box = quoteFrame.querySelector(".quote-box");
    if(!box) return;
    const text = box.querySelector(".quote-headline").textContent + "\n" + box.querySelector(".quote-text").textContent + "\n— " + box.querySelector(".quote-author").textContent;
    copyToClipboard(text);
  });

  // copy URL hash
  btnCopyHash && btnCopyHash.addEventListener && btnCopyHash.addEventListener("click", ()=>{
    copyToClipboard(location.href);
  });

  // clear all
  btnClear && btnClear.addEventListener && btnClear.addEventListener("click", ()=>{
    inputFeel.value="";
    quoteFrame.innerHTML="";
    history.replaceState(null,"",location.pathname+location.search);
    localStorage.removeItem("quoteAppState");
    savedStatus.textContent = "消去しました";
    setTimeout(()=> savedStatus.textContent="",1000);
  });

  // save PNG
  btnSavePng.addEventListener("click", ()=> {
    downloadPNG("meigen.png");
  });

  // social buttons: open in new window
  [shareX, shareFB, shareLine].forEach(a=>{
    a.addEventListener("click", (e)=>{
      e.preventDefault();
      const href = a.href;
      window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
    });
  });

  // clicking a collection article fills the frame
  articles.forEach(a=>{
    a.addEventListener("click", ()=> {
      const obj = {
        headline: a.querySelector('[itemprop="headline"]').textContent,
        text: a.querySelector('[itemprop="text"]').textContent,
        author: a.querySelector('[itemprop="author"]').textContent
      };
      renderQuote(obj);
      setupShareLinks();
    });
  });

  // restore and apply hash on load
  window.addEventListener("load", ()=>{
    restoreState();
    applyHash();
    if(!quoteFrame.querySelector(".quote-box")){
      renderQuote(pickRandom(quotes));
    }
    setupShareLinks();
  });

  // save on unload
  window.addEventListener("beforeunload", saveState);

  // allow clicking back site links to go home (simulate)
  siteLinkA.forEach(a=>{
    a.addEventListener("click", (e)=>{
      // default behavior: just navigate to href
    });
  });

})();