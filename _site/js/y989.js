// indez989.js (修正版)
// PNGキャプチャの安定化とエラーハンドリング強化を含む統合版JS
(function () {
  'use strict';

  /* -------------------------
     ユーティリティ
  ------------------------- */
  function parseYears(text) {
    if (!text) return null;
    const yearMatch = text.match(/(\d+)\s*(?:〜\s*(\d+))?\s*年/);
    if (yearMatch) return parseInt(yearMatch[1], 10);
    const monthMatch = text.match(/(\d+)\s*(?:〜\s*(\d+))?\s*ヶ月/);
    if (monthMatch) {
      const months = parseInt(monthMatch[1], 10);
      return Math.floor(months / 12);
    }
    return null;
  }

  function addYearsToDate(ymd, years) {
    if (!ymd || years == null) return '';
    const d = new Date(ymd);
    if (isNaN(d.getTime())) return '';
    d.setFullYear(d.getFullYear() + years);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function addMonthsToDate(ymd, months) {
    if (!ymd || months == null) return '';
    const d = new Date(ymd);
    if (isNaN(d.getTime())) return '';
    d.setMonth(d.getMonth() + months);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function categoryOfTable(tbl) {
    let prev = tbl.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'H2') return prev.textContent.trim();
      prev = prev.previousElementSibling;
    }
    return '';
  }

  function storageKeyForRow(category, item) {
    return 'nextbuy:' + encodeURIComponent(category || '') + '|' + encodeURIComponent(item || '');
  }

  /* -------------------------
     テーブル拡張
  ------------------------- */
  function ensureHeaderColumns(tbl) {
    let headerRow = null;
    const thead = tbl.querySelector('thead');
    if (thead) headerRow = thead.querySelector('tr');
    if (!headerRow) {
      const firstTr = tbl.querySelector('tr');
      if (firstTr && firstTr.querySelector('th')) headerRow = firstTr;
    }
    if (!headerRow) return;
    if (headerRow.querySelector('.th-purchase')) return;

    const thPurchase = document.createElement('th');
    thPurchase.className = 'th-purchase';
    thPurchase.textContent = '購入年月日';

    const thNext = document.createElement('th');
    thNext.className = 'th-next';
    thNext.textContent = '次回購入日';

    const children = headerRow.children;
    if (children.length >= 2) {
      headerRow.insertBefore(thPurchase, children[1]);
      const insertBeforeNode = headerRow.children[3] || null;
      headerRow.insertBefore(thNext, insertBeforeNode);
    } else {
      headerRow.appendChild(thPurchase);
      headerRow.appendChild(thNext);
    }
  }

  function enhanceRow(row, tblCategory) {
    if (row.querySelector('th')) return;
    if (row.querySelector('.purchase-date')) return;

    const cells = Array.from(row.children);
    if (cells[0]) cells[0].classList.add('item-cell');

    const purchaseTd = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'date';
    input.className = 'purchase-date';
    input.setAttribute('aria-label', '購入年月日');
    purchaseTd.appendChild(input);

    if (cells[1]) row.insertBefore(purchaseTd, cells[1]);
    else row.appendChild(purchaseTd);

    let lifeCell = null;
    if (row.children[2]) {
      lifeCell = row.children[2];
      lifeCell.classList.add('life-cell');
    } else if (cells[1]) {
      lifeCell = cells[1];
      lifeCell.classList.add('life-cell');
    }

    const nextTd = document.createElement('td');
    nextTd.className = 'next-cell';
    nextTd.textContent = '';
    if (lifeCell && lifeCell.nextSibling) row.insertBefore(nextTd, lifeCell.nextSibling);
    else row.appendChild(nextTd);

    // ローカルストレージ復元
    const itemCell = row.querySelector('.item-cell');
    const itemText = itemCell ? itemCell.textContent.trim() : '';
    const storageKey = storageKeyForRow(tblCategory, itemText);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) input.value = saved;
    } catch (e) {
      // localStorage不可環境は無視
    }

    updateRowNextDate(row);

    input.addEventListener('change', function () {
      updateRowNextDate(row);
      try {
        if (input.value) localStorage.setItem(storageKey, input.value);
        else localStorage.removeItem(storageKey);
      } catch (e) {}
    });
  }

  function enhanceTables() {
    document.querySelectorAll('table').forEach(tbl => {
      const category = categoryOfTable(tbl);
      ensureHeaderColumns(tbl);
      tbl.querySelectorAll('tr').forEach(tr => enhanceRow(tr, category));
    });
  }

  /* -------------------------
     次回購入日計算
  ------------------------- */
  function updateRowNextDate(row) {
    const input = row.querySelector('.purchase-date');
    const lifeCell = row.querySelector('.life-cell');
    const nextCell = row.querySelector('.next-cell');
    if (!nextCell) return;
    const purchaseVal = input && input.value ? input.value.trim() : '';
    const lifeText = lifeCell ? lifeCell.textContent.trim() : '';
    let nextVal = '';

    const years = parseYears(lifeText);
    if (purchaseVal && years != null && years > 0) {
      nextVal = addYearsToDate(purchaseVal, years);
    } else if (purchaseVal) {
      const monthMatch = lifeText.match(/(\d+)\s*(?:〜\s*(\d+))?\s*ヶ月/);
      if (monthMatch) {
        const months = parseInt(monthMatch[1], 10);
        nextVal = addMonthsToDate(purchaseVal, months);
      } else if (years === 0 && purchaseVal) {
        nextVal = addYearsToDate(purchaseVal, 0);
      }
    }

    if (nextVal) {
      nextCell.textContent = nextVal;
      row.setAttribute('data-next', nextVal);
    } else {
      nextCell.textContent = '';
      row.removeAttribute('data-next');
    }
  }

  function updateAllNextDates() {
    document.querySelectorAll('table').forEach(tbl => {
      tbl.querySelectorAll('tr').forEach(row => {
        if (row.querySelector('th')) return;
        updateRowNextDate(row);
      });
    });
  }

  /* -------------------------
     次回購入順表示
  ------------------------- */
  function showSortedByNext() {
    const rows = [];
    document.querySelectorAll('table').forEach(tbl => {
      const category = categoryOfTable(tbl);
      tbl.querySelectorAll('tr').forEach(row => {
        if (row.querySelector('th')) return;
        const next = row.getAttribute('data-next');
        const input = row.querySelector('.purchase-date');
        const purchaseVal = input && input.value ? input.value.trim() : '';
        if (next && purchaseVal) {
          rows.push({
            category: category,
            item: row.querySelector('.item-cell') ? row.querySelector('.item-cell').textContent.trim() : '',
            purchase: purchaseVal,
            life: row.querySelector('.life-cell') ? row.querySelector('.life-cell').textContent.trim() : '',
            next: next
          });
        }
      });
    });

    rows.sort((a, b) => new Date(a.next) - new Date(b.next));

    let container = document.getElementById('sortedContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sortedContainer';
      container.className = 'sorted-container';
      const controls = document.querySelector('.controls');
      if (controls && controls.parentNode) controls.parentNode.insertBefore(container, controls.nextSibling);
      else {
        const main = document.querySelector('main') || document.body;
        main.insertBefore(container, main.firstChild);
      }
    }

    const rowsHtml = rows.map(r => {
      return `<tr>
        <td>${escapeHtml(r.category)}</td>
        <td>${escapeHtml(r.item)}</td>
        <td>${escapeHtml(r.purchase)}</td>
        <td>${escapeHtml(r.life)}</td>
        <td>${escapeHtml(r.next)}</td>
      </tr>`;
    }).join('');

    container.innerHTML = `
      <h2>次回購入予定（近い順）</h2>
      <table class="result">
        <thead><tr><th>カテゴリ</th><th>品目</th><th>購入年月日</th><th>平均寿命</th><th>次回購入日</th></tr></thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="5">購入年月日を入力した項目がありません</td></tr>'}
        </tbody>
      </table>
    `;
    container.scrollIntoView({ behavior: 'smooth' });
  }

  /* -------------------------
     検索
  ------------------------- */
  function initSearch() {
    const searchBox = document.getElementById('searchBox');
    if (!searchBox) return;
    searchBox.addEventListener('input', function () {
      const keyword = this.value.trim().toLowerCase();
      document.querySelectorAll('table').forEach(tbl => {
        tbl.querySelectorAll('tr').forEach(row => {
          if (row.querySelector('th')) return;
          const text = row.innerText.toLowerCase();
          row.style.display = keyword === '' || text.includes(keyword) ? '' : 'none';
        });
      });
    });
  }

  /* -------------------------
     PNG キャプチャ保存（安定化版）
     - captureElementAsPng: 対象要素だけをクローンしてスタイルをインライン化
     - foreignObject に入れる HTML は <div xmlns="http://www.w3.org/1999/xhtml"> でラップ
     - エラー時に詳細を console.error へ出力
  ------------------------- */
  function captureElementAsPng(el, options) {
    options = options || {};
    const scale = options.scale || Math.max(1, (window.devicePixelRatio || 1));
    const rect = el.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    if (width === 0 || height === 0) return Promise.reject(new Error('capture: empty element or zero size'));

    try {
      // クローン（対象要素のみ）
      const cloned = el.cloneNode(true);

      // フォーム要素の値を保持
      (function syncInputValues(originalRoot, cloneRoot) {
        const origInputs = originalRoot.querySelectorAll('input, textarea, select');
        const cloneInputs = cloneRoot.querySelectorAll('input, textarea, select');
        for (let i = 0; i < origInputs.length && i < cloneInputs.length; i++) {
          const o = origInputs[i], c = cloneInputs[i];
          if (!c) continue;
          if (o.tagName === 'SELECT') {
            c.value = o.value;
          } else if (o.type === 'checkbox' || o.type === 'radio') {
            if (o.checked) c.setAttribute('checked', 'checked'); else c.removeAttribute('checked');
          } else {
            c.setAttribute('value', o.value || '');
            if (c.tagName === 'TEXTAREA') c.textContent = o.value || '';
          }
        }
      })(el, cloned);

      // 対象要素ツリーに対してのみ computed style をインライン化する（document 全体は対象外）
      inlineComputedStyles(el, cloned);

      // シリアライズする際、foreignObject 内は xhtml 名前空間でラップする
      const serialized = new XMLSerializer().serializeToString(cloned);
      const xhtml = '<div xmlns="http://www.w3.org/1999/xhtml">' + serialized + '</div>';

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject x="0" y="0" width="${width}" height="${height}">
            ${xhtml}
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            const ctx = canvas.getContext('2d');
            if (!ctx) { URL.revokeObjectURL(url); return reject(new Error('cannot get canvas context')); }
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            // 背景色（body の背景を参照して白にフォールバック）
            const bg = window.getComputedStyle(document.body).backgroundColor || '#ffffff';
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          } catch (err) {
            URL.revokeObjectURL(url);
            reject(err);
          }
        };
        img.onerror = function (e) {
          URL.revokeObjectURL(url);
          reject(new Error('image load error for svg: ' + (e && e.message ? e.message : 'unknown')));
        };
        // Blob URL avoids cross-origin issues
        img.src = url;
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // el（元） と clone（コピー）のツリーをトラバースして、各要素に computedStyle を inline style として設定する
  function inlineComputedStyles(sourceRoot, cloneRoot) {
    // Depth-first traversal, pairing nodes by tree order within the subtree
    const sourceNodes = [];
    const cloneNodes = [];
    (function traverse(s, c) {
      sourceNodes.push(s);
      cloneNodes.push(c);
      const sChildren = Array.from(s.children || []);
      const cChildren = Array.from(c.children || []);
      for (let i = 0; i < sChildren.length && i < cChildren.length; i++) {
        traverse(sChildren[i], cChildren[i]);
      }
    })(sourceRoot, cloneRoot);

    for (let i = 0; i < sourceNodes.length; i++) {
      const s = sourceNodes[i];
      const c = cloneNodes[i];
      if (!s || !c) continue;
      try {
        const cs = window.getComputedStyle(s);
        let styleText = '';
        for (let j = 0; j < cs.length; j++) {
          const prop = cs[j];
          // Exclude certain properties that may break rendering inside foreignObject
          if (/^--/.test(prop)) continue; // custom properties skipped
          // Skip user-agent and expensive properties? keep most properties for fidelity
          styleText += prop + ':' + cs.getPropertyValue(prop) + ';';
        }
        // Merge with existing inline style if present
        const prev = c.getAttribute('style') || '';
        c.setAttribute('style', prev + styleText);
      } catch (e) {
        // ignore elements we cannot compute
      }
    }
  }

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'capture.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function onSavePngClick() {
    // 優先順位: ソート結果表示領域(sortedContainer)があればそれをキャプチャ、なければ main をキャプチャ
    const sorted = document.getElementById('sortedContainer');
    const target = sorted || document.querySelector('main') || document.body;
    if (!target) {
      alert('キャプチャ対象が見つかりません');
      return;
    }
    // 一時的なスタイル調整（overflow など）
    const originalOverflow = target.style.overflow;
    target.style.overflow = 'visible';
    captureElementAsPng(target, { scale: Math.max(1, Math.floor(window.devicePixelRatio || 1)) })
      .then(function (dataUrl) {
        downloadDataUrl(dataUrl, 'site_capture.png');
        target.style.overflow = originalOverflow;
      })
      .catch(function (err) {
        target.style.overflow = originalOverflow;
        console.error('PNG capture error', err);
        alert('画像保存に失敗しました。コンソールを確認してください。');
      });
  }

  /* -------------------------
     初期化
  ------------------------- */
  function init() {
    try {
      enhanceTables();
      updateAllNextDates();
      initSearch();

      const sortBtn = document.getElementById('sortNextBtn');
      if (sortBtn) sortBtn.addEventListener('click', showSortedByNext);

      const printBtn = document.getElementById('printBtn');
      if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

      const savePngBtn = document.getElementById('savePngBtn');
      if (savePngBtn) savePngBtn.addEventListener('click', onSavePngClick);

      document.body.addEventListener('change', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('purchase-date')) {
          const row = e.target.closest('tr');
          if (row) updateRowNextDate(row);
        }
      });
    } catch (err) {
      console.error('initialization error', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();