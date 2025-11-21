/* scripts.js - 全文 */
document.addEventListener('DOMContentLoaded', () => {
  // シェアボタン動作
  const share = async (type, url, title) => {
    const shareUrl = url || window.location.href;
    if (navigator.share && type === 'native') {
      try { await navigator.share({ title, url: shareUrl }); } catch (e) {}
      return;
    }
    let href = '#';
    if (type === 'x') href = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
    if (type === 'facebook') href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    if (type === 'line') href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    if (type === 'email') href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`;
    window.open(href, '_blank', 'noopener');
  };

  document.getElementById('btn-x').addEventListener('click', () => share('x', null, document.title));
  document.getElementById('btn-facebook').addEventListener('click', () => share('facebook', null, document.title));
  document.getElementById('btn-line').addEventListener('click', () => share('line', null, document.title));
  document.getElementById('btn-email').addEventListener('click', () => share('email', null, document.title));
  document.getElementById('btn-native-share').addEventListener('click', () => share('native', null, document.title));

  // ローカル保存機能: ページのメモを保存/復元
  const saveKey = 'lightgames_page_memo_v1';
  const memoEl = document.getElementById('page-memo');
  const saveBtn = document.getElementById('save-memo');
  const clearBtn = document.getElementById('clear-memo');

  const loadMemo = () => {
    const v = localStorage.getItem(saveKey);
    if (v) memoEl.value = v;
  };
  saveBtn.addEventListener('click', () => {
    localStorage.setItem(saveKey, memoEl.value);
    saveBtn.textContent = '保存しました';
    setTimeout(() => (saveBtn.textContent = '保存'), 1200);
  });
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(saveKey);
    memoEl.value = '';
  });
  loadMemo();

  // モバイル横向き時にコンテナーを左右いっぱいにする調整（リサイズ時）
  const container = document.querySelector('.wrap');
  const adjustForLandscape = () => {
    if (window.matchMedia && window.matchMedia('(orientation: landscape)').matches) {
      container.classList.add('landscape-fullwidth');
    } else {
      container.classList.remove('landscape-fullwidth');
    }
  };
  window.addEventListener('resize', adjustForLandscape);
  adjustForLandscape();

  // サイト内の外部リンクに対して安全属性を付与（targetは既に付いているため念のため）
  document.querySelectorAll('a').forEach(a => {
    if (!a.target) a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
});