document.addEventListener('DOMContentLoaded', function () {
  if (document.body.dataset.toggleInit === 'done') return;
  document.body.dataset.toggleInit = 'done';

  const LABEL_WORKING = '作業中';
  const LABEL_DONE = '済み！';
  const LABEL_ALL_COMPLETE = '祝☆完了';

  const badge = document.getElementById('complete-badge');
  const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn'));

  // 初期 aria-label をタスク名から生成（既存 aria-label があるなら上書きしない）
  toggleButtons.forEach(btn => {
    const existing = btn.getAttribute('aria-label');
    if (!existing) {
      const name = btn.closest('.task-item')?.querySelector('.task-name')?.textContent?.trim();
      if (name) btn.setAttribute('aria-label', name);
    }

    // ボタン内部に .state-text と .visually-hidden を確実に配置（既にある場合は再利用）
    let st = btn.querySelector('.state-text');
    if (!st) {
      st = document.createElement('span');
      st.className = 'state-text';
      // 元のボタンテキスト（例: HTML内の "作業中"）を state-text に移す
      const raw = btn.textContent?.trim() || '';
      st.textContent = raw || LABEL_WORKING;
      // ボタンの先頭に表示させるため prepend
      btn.textContent = '';
      btn.appendChild(st);
    }
    let sr = btn.querySelector('.visually-hidden');
    if (!sr) {
      sr = document.createElement('span');
      sr.className = 'visually-hidden';
      sr.setAttribute('aria-hidden', 'false');
      sr.textContent = st.textContent || LABEL_WORKING;
      btn.appendChild(sr);
    }
  });

  // 画面読み上げ用の .visually-hidden と表示用 .state-text を同期しつつ右側の state-label は非表示化
  function refreshAllStates() {
    if (toggleButtons.length === 0) {
      if (badge) badge.classList.add('hidden');
      return;
    }

    const allDone = toggleButtons.every(b => b.dataset.logicalState === 'all-complete' || b.dataset.logicalState === 'done');

    // 全体が「全完了」になったらボタン表示を祝☆完了にする
    if (allDone) {
      toggleButtons.forEach(b => {
        b.dataset.logicalState = 'all-complete';
        const st = b.querySelector('.state-text');
        const sr = b.querySelector('.visually-hidden');
        if (st) st.textContent = LABEL_ALL_COMPLETE;
        if (sr) sr.textContent = LABEL_ALL_COMPLETE;
        b.classList.add('all-complete');
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'true');
      });
      if (badge) {
        badge.classList.remove('hidden');
        badge.textContent = LABEL_ALL_COMPLETE;
      }
      return;
    }

    // 通常は individual の状態にあわせて表示
    toggleButtons.forEach(b => {
      const st = b.querySelector('.state-text');
      const sr = b.querySelector('.visually-hidden');
      const isActive = b.getAttribute('aria-pressed') === 'true' || b.dataset.logicalState === 'done';
      const label = isActive ? LABEL_DONE : LABEL_WORKING;
      if (st) st.textContent = label;
      if (sr) sr.textContent = label;
      b.classList.toggle('active', isActive);
      b.classList.remove('all-complete');
      b.dataset.logicalState = isActive ? 'done' : 'working';
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (badge) {
      badge.classList.add('hidden');
      badge.textContent = '';
    }
  }

  // setState を統一（個別切替）
  function setState(btn, isActive) {
    // 全完了状態になっているときは個別切替を無効にする（全完了は一時的に全ボタンに "祝☆完了" を表示する仕様のため）
    if (btn.dataset.logicalState === 'all-complete') return;

    btn.dataset.logicalState = isActive ? 'done' : 'working';
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    const sr = btn.querySelector('.visually-hidden');
    const st = btn.querySelector('.state-text');
    const label = isActive ? LABEL_DONE : LABEL_WORKING;
    if (sr) sr.textContent = label;
    if (st) st.textContent = label;

    // 個別切替後に全体状態をチェック
    const allDone = toggleButtons.every(b => b.dataset.logicalState === 'done');
    if (allDone) {
      // 全てが done になったら all-complete フローへ
      refreshAllStates();
    } else {
      // 通常は更新を反映
      refreshAllStates();
    }
  }

  // 初期化: イベント登録と初期表示
  toggleButtons.forEach(function (btn) {
    // remove tabindex if present (native button doesn't need it)
    if (btn.hasAttribute('tabindex')) btn.removeAttribute('tabindex');

    // 初期 dataset.logicalState を aria-pressed から決定
    const initial = btn.getAttribute('aria-pressed') === 'true';
    btn.dataset.logicalState = initial ? 'done' : 'working';
    btn.setAttribute('aria-pressed', initial ? 'true' : 'false');

    // click でトグル
    btn.addEventListener('click', function () {
      // もし既に全完了表示なら click は個別に戻さない（ボタンを押し直して戻す挙動は不要）
      if (btn.dataset.logicalState === 'all-complete') return;
      const current = btn.dataset.logicalState === 'done';
      setState(btn, !current);
    });

    // キーボード操作: Enter / Space
    btn.addEventListener('keydown', function (e) {
      const k = e.key;
      if (k === 'Enter' || k === ' ' || e.code === 'Space') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // 共有ボタン動作（ポップアップ）
  function openPopup(url, w = 600, h = 480) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, '_blank', `toolbar=0,status=0,width=${w},height=${h},top=${top},left=${left}`);
  }

  const pageTitle = document.title || 'チェックリスト';
  const pageUrl = location.href;

  const btnX = document.getElementById('share-x');
  const btnFb = document.getElementById('share-fb');
  const btnLine = document.getElementById('share-line');
  const btnMail = document.getElementById('share-mail');

  if (btnX) btnX.addEventListener('click', function () {
    const text = encodeURIComponent(`${pageTitle} ${pageUrl}`);
    openPopup(`https://twitter.com/intent/tweet?text=${text}`);
  });
  if (btnFb) btnFb.addEventListener('click', function () {
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
  });
  if (btnLine) btnLine.addEventListener('click', function () {
    const text = encodeURIComponent(`${pageTitle} ${pageUrl}`);
    openPopup(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${text}`);
  });
  if (btnMail) btnMail.addEventListener('click', function () {
    const subject = encodeURIComponent(pageTitle);
    const body = encodeURIComponent(`${pageTitle}\n${pageUrl}\n\nチェックリストを共有します。`);
    location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  // PNG 保存（外部リソース対策については注意）
  async function saveChecklistAsPNG() {
    const checklist = document.querySelector('.task-list');
    if (!checklist) return;

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) { /* ignore */ }
    }

    const rect = checklist.getBoundingClientRect();
    const clone = checklist.cloneNode(true);
    clone.querySelectorAll('button').forEach(b => b.style.outline = 'none');

    const wrapper = document.createElement('div');
    wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.width = `${Math.ceil(rect.width)}px`;
    wrapper.style.height = `${Math.ceil(rect.height)}px`;
    wrapper.style.background = getComputedStyle(document.body).background || '#ffffff';
    wrapper.appendChild(clone);

    const serialized = new XMLSerializer().serializeToString(wrapper);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${Math.ceil(rect.width)}' height='${Math.ceil(rect.height)}'><foreignObject width='100%' height='100%'>${serialized}</foreignObject></svg>`;

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function () {
      const ratio = window.devicePixelRatio || 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        if (!blob) {
          alert('画像の生成に失敗しました。');
          return;
        }
        const a = document.createElement('a');
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0,19);
        a.download = `checklist-${ts}.png`;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }, 'image/png');
    };

    img.onerror = function () {
      URL.revokeObjectURL(url);
      alert('画像を生成できませんでした。外部リソースやブラウザの制限が原因の可能性があります。');
    };

    img.src = url;
  }

  // 初回状態反映
  refreshAllStates();
});