// js/app.js - 統合版（共有機能 + サーバ同期 + localStorage フォールバック）
// 機能：項目追加・編集・削除・ソート・全消去・PNG保存・カラー選択・共有URL生成
// 前提：/api/items エンドポイントが Cloudflare Workers (KV / D1) 側で動作すること
// 起動時に URL パラメータ `fridge` があればそれを使い、なければ UUID を生成して URL を更新します。

const STORAGE_KEY = 'foodStockItems';
let FRIDGE = null; // fridge id（UUID like）
let items = [];
let serverVersion = null;

// --- util ---
function uuidLike() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function formatDateInput(dateStr){
  if(!dateStr) return '';
  const d = new Date(dateStr);
  if(isNaN(d)) return '';
  return d.toISOString().split('T')[0];
}
function escapeHtml(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }
function qs(k){ return new URL(location.href).searchParams.get(k); }
function pushFridgeToUrl(id){
  const url = new URL(location.href);
  url.searchParams.set('fridge', id);
  history.replaceState(null,'',url.toString());
}
function copyToClipboard(text){ navigator.clipboard?.writeText(text).catch(()=>{}); }

// --- Server helpers (assume REST API at /api/items) ---
async function apiFetchItems(fridge){
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(fridge)}`);
  if(!res.ok) throw new Error('fetch failed ' + res.status);
  return res.json();
}
async function apiAddItem(fridge, item, expectedVersion){
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(fridge)}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ item, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(()=>null) };
}
async function apiUpdateItem(fridge, item, expectedVersion){
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(fridge)}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ item, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(()=>null) };
}
async function apiDeleteItem(fridge, id, expectedVersion){
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(fridge)}`, {
    method: 'DELETE',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ id, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(()=>null) };
}

// --- localStorage fallback ---
function loadLocal(){
  try{
    const s = localStorage.getItem(STORAGE_KEY + ':' + FRIDGE);
    return s ? JSON.parse(s) : [];
  }catch(e){ return []; }
}
function saveLocal(){
  try{ localStorage.setItem(STORAGE_KEY + ':' + FRIDGE, JSON.stringify(items)); }catch(e){}
}

// --- expiry status ---
function getExpiryStatus(dateString){
  if(!dateString) return { status:'ok', days: Infinity };
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateString); d.setHours(0,0,0,0);
  const diffDays = Math.ceil((d - today)/(1000*60*60*24));
  if(diffDays < 0) return { status:'expired', days: diffDays };
  if(diffDays <= 3) return { status:'near', days: diffDays };
  return { status:'ok', days: diffDays };
}

// --- render ---
function renderItems(){
  const tbody = document.getElementById('item-list');
  const emptyState = document.getElementById('empty-state');
  if(!tbody) return;
  tbody.innerHTML = '';
  if(!items || items.length === 0){ emptyState.style.display = 'block'; return; }
  emptyState.style.display = 'none';

  items.forEach(item=>{
    const tr = document.createElement('tr');
    const expiryInfo = getExpiryStatus(item.expiryDate || item.bestByDate);
    if(expiryInfo.status === 'expired') tr.classList.add('expired');
    else if(expiryInfo.status === 'near') tr.classList.add('near-expired');

    tr.innerHTML = `
      <td><input type="text" value="${escapeHtml(item.name||'')}" data-id="${item.id}" data-key="name" class="name-input" style="color:${item.color||'#1f2937'}"></td>
      <td><input type="text" value="${escapeHtml(String(item.count||'1'))}" data-id="${item.id}" data-key="count" class="count-input"></td>
      <td class="amount-cell"><span class="text-xs text-gray-500">少</span>
        <input type="range" min="0" max="100" value="${Number(item.amount||50)}" data-id="${item.id}" data-key="amount" class="amount-range">
        <span class="text-xs text-gray-500">多</span></td>
      <td><input type="date" value="${formatDateInput(item.expiryDate)}" data-id="${item.id}" data-key="expiryDate" class="date-input"></td>
      <td><input type="date" value="${formatDateInput(item.bestByDate)}" data-id="${item.id}" data-key="bestByDate" class="date-input"></td>
      <td><input type="date" value="${formatDateInput(item.purchaseDate)}" data-id="${item.id}" data-key="purchaseDate" class="date-input purchase-date"></td>
      <td><button data-id="${item.id}" class="open-color-picker" style="background:${item.color||'#1f2937'}" aria-label="色を選択"></button></td>
      <td><button data-id="${item.id}" class="delete-item" aria-label="削除"><i class="fas fa-trash-alt"></i></button></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- CRUD orchestration (server first, fallback local) ---
async function initData(){
  // FRIDGE must be set
  try{
    const data = await apiFetchItems(FRIDGE);
    items = Array.isArray(data.items)? data.items : [];
    serverVersion = data.version || null;
    saveLocal();
  }catch(e){
    items = loadLocal();
  }
  renderItems();
}

async function addItem(item){
  // optimistic local add
  items.unshift(item);
  saveLocal();
  renderItems();
  try{
    const resp = await apiAddItem(FRIDGE, item, serverVersion);
    if(resp.status === 200 && resp.body && resp.body.ok){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
    }else if(resp.status === 409){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
      alert('別の変更があります。最新データを反映しました。');
    }
  }catch(e){
    // keep local
  }
}

async function updateItem(item){
  const idx = items.findIndex(i=>i.id===item.id);
  if(idx>-1){ items[idx]=item; saveLocal(); renderItems(); }
  try{
    const resp = await apiUpdateItem(FRIDGE, item, serverVersion);
    if(resp.status===200 && resp.body && resp.body.ok){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
    }else if(resp.status===409){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
      alert('競合が発生しました。最新データに更新しました。');
    }
  }catch(e){}
}

async function deleteItem(id){
  // optimistic local remove
  items = items.filter(i=>i.id!==id); saveLocal(); renderItems();
  try{
    const latest = await apiFetchItems(FRIDGE);
    const resp = await apiDeleteItem(FRIDGE, id, latest.version);
    if(resp.status===200 && resp.body && resp.body.ok){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
    }else if(resp.status===409){
      const fresh = await apiFetchItems(FRIDGE);
      items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
      alert('競合が発生しました。最新データに更新しました。');
    }else{
      // if failed, local already removed; could re-fetch
    }
  }catch(e){}
}

// --- UI handlers ---
function handleAddItem(){
  const newItem = {
    id: uuidLike(),
    name: '',
    count: '1',
    amount: 50,
    expiryDate: '',
    bestByDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    color: '#1f2937'
  };
  addItem(newItem);
}

function handleSort(){
  items.sort((a,b)=>{
    const da = a.expiryDate||a.bestByDate||'';
    const db = b.expiryDate||b.bestByDate||'';
    if(!da && !db) return 0;
    if(!da) return 1;
    if(!db) return -1;
    return new Date(da) - new Date(db);
  });
  saveLocal(); renderItems();
}

function handleSavePng(){
  const container = document.getElementById('food-stock-list');
  if(!container || typeof html2canvas==='undefined') return alert('キャプチャ機能が利用できません');
  const buttons = document.querySelectorAll('button');
  buttons.forEach(b=>b.classList.add('no-hover'));
  html2canvas(container, { scale:2, backgroundColor:'#f8fafc' }).then(canvas=>{
    const a = document.createElement('a');
    a.download = `reizouko-${new Date().toISOString().split('T')[0]}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    buttons.forEach(b=>b.classList.remove('no-hover'));
  }).catch(err=>{
    buttons.forEach(b=>b.classList.remove('no-hover'));
    console.error(err);
    alert('キャプチャに失敗しました');
  });
}

function handleClearAll(){
  if(!confirm('本当にすべての項目を消去しますか？この操作は元に戻せません。')) return;
  // attempt server clear by deleting each
  (async ()=>{
    const toDelete = items.map(i=>i.id);
    items = []; saveLocal(); renderItems();
    try{
      for(const id of toDelete){
        await apiDeleteItem(FRIDGE, id, serverVersion).catch(()=>{});
      }
      const fresh = await apiFetchItems(FRIDGE); items = fresh.items; serverVersion = fresh.version; saveLocal(); renderItems();
    }catch(e){}
  })();
}

// share
function handleShare(){
  const shareUrl = new URL(location.href);
  shareUrl.searchParams.set('fridge', FRIDGE);
  copyToClipboard(shareUrl.toString());
  alert('共有リンクをコピーしました（クリップボード）');
}

// color modal
let colorModalOpenFor = null;
function openColorModal(id){
  colorModalOpenFor = id;
  const item = items.find(i=>i.id===id);
  const picker = document.getElementById('color-picker');
  if(picker && item) picker.value = item.color || '#1f2937';
  document.getElementById('color-modal').style.display = 'flex';
}
function closeColorModal(){ document.getElementById('color-modal').style.display = 'none'; colorModalOpenFor = null; }
function confirmColorSelection(){
  const picker = document.getElementById('color-picker');
  if(!colorModalOpenFor || !picker) return closeColorModal();
  const idx = items.findIndex(i=>i.id===colorModalOpenFor);
  if(idx>-1){ items[idx].color = picker.value; saveLocal(); renderItems(); updateItem(items[idx]); }
  closeColorModal();
}

// event delegation for table interactions
function wireTableEvents(){
  const tbody = document.getElementById('item-list');
  if(!tbody) return;
  tbody.addEventListener('input', e=>{
    const tgt = e.target;
    if(!tgt.dataset) return;
    const id = tgt.dataset.id; const key = tgt.dataset.key;
    if(!id || !key) return;
    const idx = items.findIndex(i=>i.id===id);
    if(idx === -1) return;
    if(key === 'amount') items[idx][key] = Number(tgt.value);
    else items[idx][key] = tgt.value;
    saveLocal(); renderItems();
    // auto-set purchaseDate when user fills name and purchaseDate empty
    if(key === 'name' && (!items[idx].purchaseDate || items[idx].purchaseDate==='')){
      items[idx].purchaseDate = new Date().toISOString().split('T')[0];
    }
    updateItem(items[idx]);
  });

  tbody.addEventListener('change', e=>{
    const tgt = e.target;
    if(tgt.classList.contains('date-input')){
      const id = tgt.dataset.id; const key = tgt.dataset.key;
      const idx = items.findIndex(i=>i.id===id); if(idx>-1){
        items[idx][key] = tgt.value;
        saveLocal(); renderItems(); updateItem(items[idx]);
      }
    }
  });

  tbody.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    if(btn.classList.contains('delete-item')){ const id = btn.dataset.id; deleteItem(id); }
    else if(btn.classList.contains('open-color-picker')) openColorModal(btn.dataset.id);
  });

  // make text inputs editable on click/tap (already native), ensure purchaseDate auto-set on click if needed
  tbody.addEventListener('focusin', e=>{
    const tgt = e.target;
    if(tgt.classList.contains('purchase-date')){
      const id = tgt.dataset.id;
      const idx = items.findIndex(i=>i.id===id);
      if(idx>-1 && (!items[idx].purchaseDate || items[idx].purchaseDate==='')){
        items[idx].purchaseDate = new Date().toISOString().split('T')[0];
        saveLocal(); renderItems();
      }
    }
  });
}

// init UI wiring
document.addEventListener('DOMContentLoaded', ()=>{
  // determine FRIDGE id
  const fromUrl = qs('fridge');
  if(fromUrl){ FRIDGE = fromUrl; }
  else {
    FRIDGE = uuidLike();
    pushFridgeToUrl(FRIDGE);
  }

  // wire top controls
  document.getElementById('add-item-btn')?.addEventListener('click', handleAddItem);
  document.getElementById('sort-by-expiry-btn')?.addEventListener('click', handleSort);
  document.getElementById('save-png-btn')?.addEventListener('click', handleSavePng);
  document.getElementById('clear-all-btn')?.addEventListener('click', handleClearAll);
  document.getElementById('share-button')?.addEventListener('click', handleShare);

  // color modal
  document.getElementById('confirm-color-btn')?.addEventListener('click', confirmColorSelection);
  document.getElementById('cancel-color-btn')?.addEventListener('click', closeColorModal);
  document.querySelectorAll('.color-box').forEach(box=>box.addEventListener('click', ()=> document.getElementById('color-picker').value = box.dataset.color));
  window.addEventListener('click', e=>{
    if(e.target === document.getElementById('color-modal')) closeColorModal();
    if(e.target === document.getElementById('confirm-modal')) document.getElementById('confirm-modal').style.display='none';
  });

  // share button visibility (show when FRIDGE present)
  const shareContainer = document.getElementById('share-container');
  if(shareContainer) shareContainer.classList.remove('hidden');

  wireTableEvents();
  initData();
});