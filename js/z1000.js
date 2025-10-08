/* /js/z1000.js
   ブラウザ保存（localStorage）付きメモ機能
   - textarea#memo1 を自動保存・復元
   - 保存ステータス表示と最終保存時刻
   - 手動保存、クリア、エクスポート（テキストコピー）機能
*/

(() => {
  'use strict';

  const STORAGE_KEY = 'memoc_memo1_v1';
  const DEBOUNCE_MS = 600;
  const textarea = document.getElementById('memo1');
  const statusId = 'memo-save-status';

  function $(id) { return document.getElementById(id); }

  function createStatusNode() {
    let node = document.getElementById(statusId);
    if (node) return node;

    node = document.createElement('div');
    node.id = statusId;
    node.setAttribute('aria-live', 'polite');
    node.style.fontSize = '0.9rem';
    node.style.color = '#444';
    node.style.marginTop = '6px';

    // Buttons container
    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '8px';
    btnWrap.style.marginTop = '8px';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.textContent = '保存';
    saveBtn.className = 'memo-btn';
    saveBtn.addEventListener('click', () => saveNow(true));

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'クリア';
    clearBtn.className = 'memo-btn';
    clearBtn.addEventListener('click', () => {
      if (!confirm('メモをクリアしますか？元に戻せません。')) return;
      textarea.value = '';
      saveNow(true);
    });

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.textContent = 'コピー';
    exportBtn.className = 'memo-btn';
    exportBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(textarea.value || '')
        .then(() => showStatus('クリップボードにコピーしました'))
        .catch(() => {
          // フォールバック：選択してコピーを促す
          textarea.select();
          try {
            document.execCommand('copy');
            showStatus('クリップボードにコピーしました');
          } catch (e) {
            showStatus('コピーに失敗しました。手動で選択してコピーしてください');
          } finally {
            window.getSelection().removeAllRanges();
          }
        });
    });

    btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(clearBtn);
    btnWrap.appendChild(exportBtn);

    node.appendChild(btnWrap);
    textarea.insertAdjacentElement('afterend', node);
    return node;
  }

  function showStatus(message) {
    const node = createStatusNode();
    // Clear previous text nodes except buttons container
    Array.from(node.childNodes).forEach((n, i) => {
      if (i === 0) return;
      node.removeChild(n);
    });
    const p = document.createElement('div');
    p.textContent = message;
    p.style.marginTop = '6px';
    node.appendChild(p);
  }

  let debounceTimer = null;
  let isSaving = false;

  function saveNow(manual = false) {
    if (!textarea) return;
    const value = textarea.value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
      isSaving = false;
      const ts = new Date();
      const timeStr = ts.toLocaleString();
      showStatus(manual ? `手動で保存しました：${timeStr}` : `自動保存しました：${timeStr}`);
    } catch (e) {
      showStatus('ローカル保存に失敗しました。ストレージの使用制限を確認してください');
    }
  }

  function scheduleSave() {
    if (debounceTimer) clearTimeout(debounceTimer);
    isSaving = true;
    showStatus('保存中…');
    debounceTimer = setTimeout(() => saveNow(false), DEBOUNCE_MS);
  }

  function loadSaved() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v !== null && v !== undefined) {
        textarea.value = v;
        const node = createStatusNode();
        const ts = new Date();
        showStatus(`保存データを復元しました（最終編集から：${ts.toLocaleString()}）`);
        return;
      }
    } catch (e) {
      // ignore
    }
    createStatusNode();
    showStatus('メモ欄を利用できます。自動保存は有効です。');
  }

  // Accessibility: allow Ctrl/Cmd+S to save
  function handleKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveNow(true);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    if (!textarea) return;
    loadSaved();

    // autosave on input with debounce
    textarea.addEventListener('input', scheduleSave);

    // save when page is hidden/unloaded
    window.addEventListener('pagehide', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      saveNow();
    }, { passive: true });

    window.addEventListener('beforeunload', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      saveNow();
    });

    document.addEventListener('keydown', handleKeydown);

    // small style for buttons (kept here so external CSS not required)
    const style = document.createElement('style');
    style.textContent = `
      .memo-btn{background:#0366d6;color:#fff;border:0;padding:6px 10px;border-radius:4px;cursor:pointer;font-size:0.95rem}
      .memo-btn:active{opacity:0.85}
      .memo-btn:not(:first-child){margin-left:6px}
    `;
    document.head.appendChild(style);
  });
})();