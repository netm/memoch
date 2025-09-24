// js/app.js - 統合版
// 前提: html 側にある要素 ID / クラス と整合するよう組み立てています。
// サーバー同期を優先し、失敗時は localStorage をフォールバックとして使用します.

const FRIDGE = 'test-fridge';
const CONTAINER_SELECTOR = '#item-list'; // tbody の ID
const STORAGE_KEY = 'foodStockItems';

// --- Server API helpers ---
async function serverFetchItems() {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`);
  if (!res.ok) throw new Error('server fetch failed: ' + res.status);
  return res.json(); // { ok, items, version }
}

async function serverAddItem(item, expectedVersion = undefined) {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function serverUpdateItem(item, expectedVersion) {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function serverDeleteItem(id, expectedVersion) {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, expectedVersion })
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

// --- Local storage helpers (fallback) ---
function loadItemsLocal() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('load local failed', e);
    return [];
  }
}
function saveItemsLocal(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('save local failed', e);
  }
}

// --- App state ---
let items = []; // array of item objects
let serverVersion = null; // server side version, if available
let currentEditingColorItemId = null;
let confirmActionCallback = null;

// --- Utility ---
function formatDateInput(dateStr) {
  if (!dateStr) return '';
  // ensure YYYY-MM-DD
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toISOString().split('T')[0];
}
function getExpiryStatus(dateString) {
  if (!dateString) return { status: 'ok', days: Infinity };
  const today = new Date(); today.setHours(0,0,0,0);
  const expiryDate = new Date(dateString); expiryDate.setHours(0,0,0,0);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { status: 'expired', days: diffDays };
  if (diffDays <= 3) return { status: 'near', days: diffDays };
  return { status: 'ok', days: diffDays };
}
function uuidLike() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

// --- Rendering ---
function renderItems() {
  const tbody = document.querySelector(CONTAINER_SELECTOR);
  const emptyState = document.getElementById('empty-state');
  if (!tbody) return console.warn('container not found:', CONTAINER_SELECTOR);

  tbody.innerHTML = '';
  if (!items || items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
  }

  items.forEach(item => {
    const tr = document.createElement('tr');

    const expiryInfo = getExpiryStatus(item.expiryDate || item.bestByDate);
    if (expiryInfo.status === 'expired') tr.classList.add('expired');
    else if (expiryInfo.status === 'near') tr.classList.add('near-expired');

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <input type="text" value="${escapeHtml(item.name || '')}" data-id="${item.id}" data-key="name" class="p-1 w-full bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" style="color: ${item.color || '#1f2937'};">
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <input type="text" value="${escapeHtml(String(item.count || '1'))}" data-id="${item.id}" data-key="count" class="p-1 w-20 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
      </td>
      <td class="px-4 py-3 whitespace-nowrap flex items-center gap-2">
        <span class="text-xs text-gray-500">少</span>
        <input type="range" min="0" max="100" value="${Number(item.amount || 50)}" data-id="${item.id}" data-key="amount" class="w-24 cursor-pointer">
        <span class="text-xs text-gray-500">多</span>
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <input type="date" value="${formatDateInput(item.expiryDate)}" data-id="${item.id}" data-key="expiryDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <input type="date" value="${formatDateInput(item.bestByDate)}" data-id="${item.id}" data-key="bestByDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <input type="date" value="${formatDateInput(item.purchaseDate)}" data-id="${item.id}" data-key="purchaseDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <button data-id="${item.id}" class="open-color-picker w-8 h-8 rounded-full" style="background-color: ${item.color || '#1f2937'}; border: 2px solid #e5e7eb;" aria-label="色を選択"></button>
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        <button data-id="${item.id}" class="delete-item text-red-500 hover:text-red-700 text-xl" aria-label="削除"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// minimal escaping for inserted values
function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// --- CRUD operations (UI -> server/local) ---
async function initFromServerOrLocal() {
  try {
    const data = await serverFetchItems();
    if (data && Array.isArray(data.items)) {
      items = data.items;
      serverVersion = data.version;
      saveItemsLocal(items);
    } else {
      items = loadItemsLocal();
    }
  } catch (e) {
    console.warn('server fetch failed, using local', e);
    items = loadItemsLocal();
  }
  renderItems();
}

async function addItemServer(item) {
  try {
    const resp = await serverAddItem(item, serverVersion);
    if (resp.status === 200 && resp.body && resp.body.ok) {
      const fresh = await serverFetchItems();
      items = fresh.items;
      serverVersion = fresh.version;
      saveItemsLocal(items);
      renderItems();
      return true;
    } else if (resp.status === 409) {
      const latest = await serverFetchItems();
      items = latest.items;
      serverVersion = latest.version;
      saveItemsLocal(items);
      renderItems();
      alert('サーバー側に別の変更があります。変更を反映しました。もう一度お試しください。');
      return false;
    } else {
      console.error('add failed', resp);
      return false;
    }
  } catch (e) {
    console.warn('add server failed, fallback to local', e);
    // fallback: local
    items.unshift(item);
    saveItemsLocal(items);
    renderItems();
    return true;
  }
}

async function updateItemServer(item) {
  try {
    const resp = await serverUpdateItem(item, serverVersion);
    if (resp.status === 200 && resp.body && resp.body.ok) {
      const fresh = await serverFetchItems();
      items = fresh.items;
      serverVersion = fresh.version;
      saveItemsLocal(items);
      renderItems();
      return true;
    } else if (resp.status === 409) {
      const latest = await serverFetchItems();
      items = latest.items;
      serverVersion = latest.version;
      saveItemsLocal(items);
      renderItems();
      alert('サーバー側に別の変更があります。最新の状態を読み込みました。');
      return false;
    } else {
      console.error('update failed', resp);
      return false;
    }
  } catch (e) {
    console.warn('update server failed, fallback to local', e);
    const idx = items.findIndex(i => i.id === item.id);
    if (idx > -1) items[idx] = item;
    saveItemsLocal(items);
    renderItems();
    return true;
  }
}

async function deleteItemServer(id) {
  try {
    const resp1 = await serverFetchItems(); // get latest version
    const resp = await serverDeleteItem(id, resp1.version);
    if (resp.status === 200 && resp.body && resp.body.ok) {
      const fresh = await serverFetchItems();
      items = fresh.items;
      serverVersion = fresh.version;
      saveItemsLocal(items);
      renderItems();
      return true;
    } else if (resp.status === 409) {
      const latest = await serverFetchItems();
      items = latest.items;
      serverVersion = latest.version;
      saveItemsLocal(items);
      renderItems();
      alert('サーバー側に別の変更があります。最新の状態を読み込みました。');
      return false;
    } else {
      console.error('delete failed', resp);
      alert('削除に失敗しました');
      return false;
    }
  } catch (e) {
    console.warn('delete server failed, fallback to local', e);
    items = items.filter(i => i.id !== id);
    saveItemsLocal(items);
    renderItems();
    return true;
  }
}

// --- Event handlers ---
function handleAddItem() {
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
  // optimistic UI: add locally, then try server
  items.unshift(newItem);
  saveItemsLocal(items);
  renderItems();
  addItemServer(newItem).catch(e => console.warn(e));
}

function handleSort() {
  items.sort((a, b) => {
    const dateA = a.expiryDate || a.bestByDate || '';
    const dateB = b.expiryDate || b.bestByDate || '';
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return new Date(dateA) - new Date(dateB);
  });
  saveItemsLocal(items);
  renderItems();
}

function handleSavePng() {
  const foodStockList = document.getElementById('food-stock-list');
  if (!foodStockList || typeof html2canvas === 'undefined') return alert('キャプチャ機能が利用できません');

  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.classList.add('no-hover'));

  html2canvas(foodStockList, {
    scale: 2,
    backgroundColor: '#f8fafc',
    onclone: (doc) => {
      const tableContainer = doc.querySelector('.table-container');
      if (tableContainer) tableContainer.style.overflowX = 'visible';
    }
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `reizouko-stock-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    buttons.forEach(btn => btn.classList.remove('no-hover'));
  }).catch(err => {
    console.error('capture failed', err);
    buttons.forEach(btn => btn.classList.remove('no-hover'));
    alert('キャプチャに失敗しました');
  });
}

function handleClearAll() {
  showConfirmation(
    'すべての項目を消去',
    '本当にすべての食品データを消去しますか？この操作は元に戻せません。',
    async () => {
      // try server clear: perform delete for each item on server if possible
      try {
        const toDelete = items.map(i => i.id);
        let ok = true;
        for (const id of toDelete) {
          const r = await deleteItemServer(id);
          ok = ok && r;
        }
        if (!ok) {
          // some deletions failed but local fallback will clear
          items = [];
          saveItemsLocal(items);
          renderItems();
        }
      } catch (e) {
        console.warn('clear all server failed', e);
        items = [];
        saveItemsLocal(items);
        renderItems();
      }
    }
  );
}

function handleItemUpdate(e) {
  const { id, key } = e.target.dataset;
  const value = e.target.value;
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    // coerce types for amount and count
    if (key === 'amount') items[itemIndex][key] = Number(value);
    else items[itemIndex][key] = value;
    saveItemsLocal(items);
    // If dates changed update rendering immediately
    if (key === 'expiryDate' || key === 'bestByDate' || key === 'purchaseDate') {
      renderItems();
    }
    // push update to server (debounced-ish: we call directly here; for heavy edits add debounce)
    updateItemServer(items[itemIndex]).catch(e => console.warn(e));
  }
}

function handleItemDelete(id) {
  showConfirmation(
    '項目を消去',
    'この項目を消去しますか？',
    async () => {
      await deleteItemServer(id).catch(e => console.warn(e));
    }
  );
}

// --- Modal logic ---
function openColorModal(itemId) {
  currentEditingColorItemId = itemId;
  const item = items.find(i => i.id === itemId);
  const colorPicker = document.getElementById('color-picker');
  const colorModal = document.getElementById('color-modal');
  if (item && colorPicker) colorPicker.value = item.color || '#1f2937';
  if (colorModal) colorModal.style.display = 'flex';
}
function closeColorModal() {
  const colorModal = document.getElementById('color-modal');
  if (colorModal) colorModal.style.display = 'none';
  currentEditingColorItemId = null;
}
function confirmColorSelection() {
  const colorPicker = document.getElementById('color-picker');
  if (!currentEditingColorItemId || !colorPicker) return closeColorModal();
  const idx = items.findIndex(i => i.id === currentEditingColorItemId);
  if (idx > -1) {
    items[idx].color = colorPicker.value;
    saveItemsLocal(items);
    renderItems();
    updateItemServer(items[idx]).catch(e => console.warn(e));
  }
  closeColorModal();
}

// Confirmation modal
function showConfirmation(title, message, callback) {
  const confirmModal = document.getElementById('confirm-modal');
  const confirmTitle = document.getElementById('confirm-title');
  const confirmMessage = document.getElementById('confirm-message');
  if (confirmTitle) confirmTitle.textContent = title;
  if (confirmMessage) confirmMessage.textContent = message;
  confirmActionCallback = callback;
  if (confirmModal) confirmModal.style.display = 'flex';
}
function closeConfirmation() {
  const confirmModal = document.getElementById('confirm-modal');
  if (confirmModal) confirmModal.style.display = 'none';
  confirmActionCallback = null;
}

// --- Event wiring and initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const addItemBtn = document.getElementById('add-item-btn');
  const sortBtn = document.getElementById('sort-by-expiry-btn');
  const savePngBtn = document.getElementById('save-png-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const itemList = document.getElementById('item-list');
  const foodStockList = document.getElementById('food-stock-list');
  const emptyState = document.getElementById('empty-state');

  const colorModal = document.getElementById('color-modal');
  const confirmColorBtn = document.getElementById('confirm-color-btn');
  const cancelColorBtn = document.getElementById('cancel-color-btn');
  const colorPicker = document.getElementById('color-picker');

  const confirmModal = document.getElementById('confirm-modal');
  const confirmActionBtn = document.getElementById('confirm-action-btn');
  const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');

  // Event listeners
  if (addItemBtn) addItemBtn.addEventListener('click', handleAddItem);
  if (sortBtn) sortBtn.addEventListener('click', handleSort);
  if (savePngBtn) savePngBtn.addEventListener('click', handleSavePng);
  if (clearAllBtn) clearAllBtn.addEventListener('click', handleClearAll);

  if (itemList) {
    itemList.addEventListener('change', e => {
      if (e.target.matches('input[type="date"], input[type="range"]')) handleItemUpdate(e);
    });
    itemList.addEventListener('input', e => {
      if (e.target.matches('input[type="text"]')) handleItemUpdate(e);
    });
    itemList.addEventListener('click', e => {
      const target = e.target.closest('button');
      if (!target) return;
      if (target.classList.contains('delete-item')) handleItemDelete(target.dataset.id);
      else if (target.classList.contains('open-color-picker')) openColorModal(target.dataset.id);
    });
  }

  // Color modal handlers
  if (confirmColorBtn) confirmColorBtn.addEventListener('click', confirmColorSelection);
  if (cancelColorBtn) cancelColorBtn.addEventListener('click', closeColorModal);
  document.querySelectorAll('.color-box').forEach(box => {
    box.addEventListener('click', () => {
      if (colorPicker) colorPicker.value = box.dataset.color;
    });
  });

  // Confirmation modal handlers
  if (confirmActionBtn) confirmActionBtn.addEventListener('click', () => {
    if (confirmActionCallback) confirmActionCallback();
    closeConfirmation();
  });
  if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', closeConfirmation);

  // Modal outside click to close
  window.addEventListener('click', (e) => {
    if (e.target === colorModal) closeColorModal();
    if (e.target === confirmModal) closeConfirmation();
  });

  // Initialize data
  initFromServerOrLocal();
});