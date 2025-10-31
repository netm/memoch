// ===== js全文 =====
(() => {
  // DOM references
  const roomSelect = document.getElementById('room-count');
  const niceColorInput = document.getElementById('nice-color');
  const applyColorBtn = document.getElementById('apply-color');
  const checklistEl = document.getElementById('checklist');
  const copyTextBtn = document.getElementById('copy-text');
  const savePngBtn = document.getElementById('save-png');
  const shareX = document.getElementById('share-x');
  const shareFB = document.getElementById('share-fb');
  const shareLINE = document.getElementById('share-line');
  const shareMail = document.getElementById('share-mail');
  const linkHome = document.getElementById('link-home');
  const footerHome = document.getElementById('footer-home');

  // default data templates per room-count mapping
  const templates = {
    1: ['部屋','台所','風呂','トイレ','玄関'],
    2: ['部屋1','部屋2','台所','風呂','トイレ','玄関'],
    3: ['部屋1','部屋2','部屋3','台所','風呂','トイレ','玄関'],
    4: ['部屋1','部屋2','部屋3','部屋4','台所','風呂','トイレ','玄関'],
    5: ['部屋1','部屋2','部屋3','部屋4','部屋5','台所','風呂','トイレ','玄関'],
    6: ['部屋1','部屋2','部屋3','部屋4','部屋5','部屋6','台所','風呂','トイレ','玄関'],
    7: ['部屋1','部屋2','部屋3','部屋4','部屋5','部屋6','部屋7','台所','風呂','トイレ','玄関'],
    8: ['部屋1','部屋2','部屋3','部屋4','部屋5','部屋6','部屋7','部屋8','台所','風呂','トイレ','玄関'],
    9: ['部屋1','部屋2','部屋3','部屋4','部屋5','部屋6','部屋7','部屋8','部屋9','台所','風呂','トイレ','玄関'],
    10: ['部屋1','部屋2','部屋3','部屋4','部屋5','部屋6','部屋7','部屋8','部屋9','部屋10','台所','風呂','トイレ','玄関']
  };

  // sample cleaning details to fill location entries (reused cyclically)
  const detailPool = [
    {place:'床', part:'掃除機掛け・拭き掃除', method:'ほこりを取ってから拭く', time:'15分'},
    {place:'窓', part:'ガラス拭き', method:'拭きムラを防ぐ', time:'15分'},
    {place:'棚', part:'整理と拭き掃除', method:'中身を出して拭く', time:'15分'},
    {place:'照明', part:'ホコリ取り', method:'柔らかい布で拭く', time:'15分'},
    {place:'家具', part:'裏側清掃', method:'移動して掃除機', time:'15分'}
  ];

  // ui state and localStorage keys
  const LS_KEYS = {rooms:'ls_rooms', color:'ls_nice_color', items:'ls_items_state'};

  // initialize room select options
  function initRoomSelect() {
    for (let i=1;i<=10;i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      roomSelect.appendChild(opt);
    }
    const saved = localStorage.getItem(LS_KEYS.rooms);
    roomSelect.value = saved ? saved : '1';
  }

  // build items based on roomCount
  function buildItems(roomCount) {
    const names = templates[roomCount] || templates[1];
    const items = [];
    let idx = 0;
    for (let i=0;i<names.length;i++) {
      const d = detailPool[idx % detailPool.length];
      items.push({
        id: `item-${i+1}`,
        number: i+1,
        location: names[i],
        place: d.place,
        part: d.part,
        method: d.method,
        time: d.time,
        done: false
      });
      idx++;
    }
    return items;
  }

  // render items
  function render(items, niceColor) {
    checklistEl.innerHTML = '';
    items.forEach((it, i) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.dataset.bg = (i % 6).toString();

      const num = document.createElement('div');
      num.className = 'number';
      num.textContent = it.number;

      const ok = document.createElement('button');
      ok.className = 'ok';
      ok.setAttribute('aria-pressed', it.done ? 'true' : 'false');
      ok.textContent = it.done ? 'OK' : 'OK';
      if (it.done) ok.classList.add('done');

      const titleWrap = document.createElement('div');
      titleWrap.className = 'title';

      const label = document.createElement('div');
      label.className = 'item-info';
      const t1 = document.createElement('p');
      t1.innerHTML = `<strong>${it.location}</strong> — <span class="small-desc">きれいにしたいところ</span>`;
      const t2 = document.createElement('p');
      t2.className = 'meta';
      t2.textContent = `${it.place} ・ ${it.part} ・ ${it.method} ・ 目安 ${it.time}`;

      label.appendChild(t1);
      label.appendChild(t2);

      const status = document.createElement('div');
      status.className = 'status';
      status.innerHTML = it.done ? `<span style="color:${niceColor}; font-weight:800;">きれいになりました！</span>` : '';

      // ok button action
      ok.addEventListener('click', () => {
        it.done = !it.done;
        saveItemsState(items);
        updateAll(items, niceColor);
      });

      // structure
      div.appendChild(num);
      div.appendChild(ok);
      div.appendChild(titleWrap);
      titleWrap.appendChild(label);
      div.appendChild(status);

      checklistEl.appendChild(div);
    });

    updateAll(items, niceColor);
  }

  // update summary / messages and apply color for messages
  function updateAll(items, niceColor) {
    // update status messages and ok button classes
    const allDone = items.length > 0 && items.every(it => it.done);
    const itemDivs = checklistEl.querySelectorAll('.item');
    itemDivs.forEach((div, idx) => {
      const status = div.querySelector('.status');
      const okBtn = div.querySelector('.ok');
      const it = items[idx];
      if (it.done) {
        okBtn.classList.add('done');
        okBtn.style.backgroundColor = niceColor;
        okBtn.style.color = '#fff';
        status.innerHTML = `<span style="color:${niceColor}; font-weight:800;">きれいになりました！</span>`;
      } else {
        okBtn.classList.remove('done');
        okBtn.style.backgroundColor = '';
        okBtn.style.color = '';
        status.innerHTML = '';
      }
    });

    // If all done, change each status to celebration text
    if (allDone) {
      itemDivs.forEach(div => {
        const status = div.querySelector('.status');
        status.innerHTML = `<span style="color:${niceColor}; font-weight:900;">大掃除完了！！おめでとう☆☆☆</span>`;
      });
    }

    // persist
    saveItemsState(items);
    // apply color to headings that reflect "きれいカラー"
    applyColorToHeadings(niceColor);
  }

  function applyColorToHeadings(color) {
    document.querySelectorAll('h1,h2,h3').forEach((el, idx) => {
      // cycle some colors but ensure headings remain colorful
      if (el.tagName.toLowerCase() === 'h1') el.style.color = color;
      if (el.tagName.toLowerCase() === 'h2') el.style.color = shadeColor(color, -10);
      if (el.tagName.toLowerCase() === 'h3') el.style.color = shadeColor(color, 20);
    });
  }

  // small helper to shade color (hex)
  function shadeColor(hex, percent) {
    try {
      let R = parseInt(hex.substring(1,3),16);
      let G = parseInt(hex.substring(3,5),16);
      let B = parseInt(hex.substring(5,7),16);
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
      R = (R<255)?R:255; G=(G<255)?G:255; B=(B<255)?B:255;
      const rr = (R.toString(16).length===1)?'0'+R.toString(16):R.toString(16);
      const gg = (G.toString(16).length===1)?'0'+G.toString(16):G.toString(16);
      const bb = (B.toString(16).length===1)?'0'+B.toString(16):B.toString(16);
      return `#${rr}${gg}${bb}`;
    } catch (e) {
      return hex;
    }
  }

  // persistence
  function saveItemsState(items) {
    localStorage.setItem(LS_KEYS.items, JSON.stringify(items));
  }

  function loadItemsState() {
    try {
      const s = localStorage.getItem(LS_KEYS.items);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  // assemble textual representation for copying
  function compileText(items) {
    const lines = [];
    lines.push('大掃除チェックリスト');
    lines.push(`部屋数: ${roomSelect.value}`);
    lines.push('-------------------------');
    items.forEach(it => {
      lines.push(`${it.number}. ${it.location} - ${it.place} / ${it.part} / ${it.method} / 目安 ${it.time} - ${it.done ? '済' : '未'}`);
    });
    const allDone = items.every(it => it.done);
    lines.push('-------------------------');
    lines.push(allDone ? '大掃除完了！！おめでとう☆☆☆' : 'まだ完了していない項目があります');
    return lines.join('\n');
  }

  // copy to clipboard
  copyTextBtn.addEventListener('click', async () => {
    const items = loadItemsState() ?? buildItems(roomSelect.value);
    const text = compileText(items);
    try {
      await navigator.clipboard.writeText(text);
      copyTextBtn.textContent = 'コピーしました';
      setTimeout(()=>copyTextBtn.textContent='文章コピーボタン',1200);
    } catch (e) {
      alert('クリップボードにコピーできませんでした。ブラウザの権限を確認してください。');
    }
  });

  // PNG export using SVG foreignObject
  savePngBtn.addEventListener('click', async () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.fontFamily = getComputedStyle(document.body).fontFamily;
    wrapper.style.background = getComputedStyle(document.body).backgroundColor || '#ffffff';
    // clone the checklist area for clean image
    const clone = document.getElementById('checklist').cloneNode(true);
    clone.style.maxWidth = '1200px';
    // inline styles for colors (so image preserves)
    document.querySelectorAll('h1,h2,h3').forEach(h => {
      h.style.color = getComputedStyle(h).color;
    });
    wrapper.appendChild(document.getElementById('site-title').cloneNode(true));
    wrapper.appendChild(clone);
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'>
        <foreignObject width='100%' height='100%'>
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;">
            ${escapeHtml(wrapper.innerHTML)}
          </div>
        </foreignObject>
      </svg>`;
    const svgBlob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'oosouji_checklist.png';
        a.click();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    };
    img.onerror = () => {
      alert('画像生成に失敗しました。ブラウザがSVG foreignObjectをサポートしていることを確認してください。');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

  // simple HTML escaper
  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // social shares
  function getShareUrl(platform) {
    const pageUrl = location.href;
    const text = encodeURIComponent('大掃除チェックリストを使ってみよう！');
    if (platform === 'x') return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(pageUrl)}`;
    if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    if (platform === 'line') return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;
    if (platform === 'mail') return `mailto:?subject=${encodeURIComponent('大掃除チェックリスト')}&body=${encodeURIComponent(pageUrl)}`;
    return '#';
  }
  shareX.addEventListener('click', ()=> window.open(getShareUrl('x'),'_blank'));
  shareFB.addEventListener('click', ()=> window.open(getShareUrl('facebook'),'_blank'));
  shareLINE.addEventListener('click', ()=> window.open(getShareUrl('line'),'_blank'));
  shareMail.addEventListener('click', ()=> window.location.href = getShareUrl('mail'));

  // apply color button
  applyColorBtn.addEventListener('click', () => {
    const color = niceColorInput.value;
    localStorage.setItem(LS_KEYS.color, color);
    const items = loadItemsState() ?? buildItems(roomSelect.value);
    render(items, color);
  });

  // room select change
  roomSelect.addEventListener('change', () => {
    const selected = parseInt(roomSelect.value,10);
    localStorage.setItem(LS_KEYS.rooms, selected);
    const items = buildItems(selected);
    saveItemsState(items);
    const color = localStorage.getItem(LS_KEYS.color) || niceColorInput.value;
    render(items, color);
  });

  // load saved state or initialize
  function boot() {
    initRoomSelect();
    const savedColor = localStorage.getItem(LS_KEYS.color);
    if (savedColor) niceColorInput.value = savedColor;
    const savedItems = loadItemsState();
    let items;
    if (savedItems && Array.isArray(savedItems) && savedItems.length>0) {
      // if saved items length matches the current template length, reuse; otherwise rebuild
      const expected = templates[roomSelect.value].length;
      if (savedItems.length === expected) {
        items = savedItems;
      } else {
        items = buildItems(roomSelect.value);
        // attempt to preserve any done flags for matching positions
        for (let i=0;i<Math.min(savedItems.length, items.length); i++) {
          items[i].done = savedItems[i].done || false;
        }
      }
    } else {
      items = buildItems(roomSelect.value);
    }
    const color = savedColor || niceColorInput.value;
    render(items, color);
  }

  // initial boot
  boot();

  // helper: set home links to document origin or sample
  const origin = location.origin || '#';
  linkHome.href = origin;
  footerHome.href = origin;

  // utility: handle beforeunload saving (already saved on actions, but ensure color & room)
  window.addEventListener('beforeunload', () => {
    localStorage.setItem(LS_KEYS.rooms, roomSelect.value);
    localStorage.setItem(LS_KEYS.color, niceColorInput.value);
  });
})();