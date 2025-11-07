/* script.js - 全文 */
document.addEventListener('DOMContentLoaded', function () {
  const todayBtn = document.getElementById('today-btn');
  const copyBtn = document.getElementById('copy-btn');
  const pngBtn = document.getElementById('png-btn');
  const xBtn = document.getElementById('x-btn');
  const fbBtn = document.getElementById('fb-btn');
  const lineBtn = document.getElementById('line-btn');
  const mailBtn = document.getElementById('mail-btn');
  const tipFrame = document.getElementById('today-tip');
  const tipsList = Array.from(document.querySelectorAll('#tips li'));
  const siteTitle = document.title;
  const pageUrl = location.href;

  function showRandomTip() {
    const idx = Math.floor(Math.random() * tipsList.length);
    const item = tipsList[idx];
    tipFrame.textContent = item.textContent;
    tipFrame.setAttribute('data-tip-index', idx);
    tipFrame.setAttribute('aria-label', '今日の節約方法 ' + (idx + 1));
    tipFrameFocusable();
  }

  function tipFrameFocusable() {
    tipFrame.setAttribute('tabindex', '0');
    tipFrame.focus();
  }

  copyBtn.addEventListener('click', function () {
    const text = tipFrame.textContent || '';
    if (!navigator.clipboard) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      return;
    }
    navigator.clipboard.writeText(text).catch(()=>{});
  });

  function openWindow(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  xBtn.addEventListener('click', function () {
    const text = encodeURIComponent(tipFrame.textContent || siteTitle);
    openWindow(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(pageUrl)}`);
  });

  fbBtn.addEventListener('click', function () {
    openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
  });

  lineBtn.addEventListener('click', function () {
    const text = encodeURIComponent((tipFrame.textContent || siteTitle) + ' ' + pageUrl);
    openWindow(`https://line.me/R/msg/text/?${text}`);
  });

  mailBtn.addEventListener('click', function () {
    const subject = encodeURIComponent('今日の節約方法');
    const body = encodeURIComponent((tipFrame.textContent || siteTitle) + '\n' + pageUrl);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  pngBtn.addEventListener('click', function () {
    if (typeof html2canvas === 'undefined') {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      s.onload = () => capturePNG();
      document.body.appendChild(s);
    } else {
      capturePNG();
    }
  });

  function capturePNG() {
    const target = document.getElementById('share-area');
    html2canvas(target, {scale: 2, useCORS: true}).then(canvas => {
      canvas.toBlob(function(blob) {
        const a = document.createElement('a');
        a.download = '節約メモ.png';
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }).catch(()=>{});
  }

  showRandomTip();

  todayBtn.addEventListener('click', showRandomTip);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      showRandomTip();
    }
  });

  const searchInput = document.getElementById('site-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const all = document.querySelectorAll('.content-paragraph, #tips li');
      all.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (q && text.indexOf(q) === -1) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      });
    });
  }

  function adjustForLandscape() {
    if (window.matchMedia && window.matchMedia('(orientation: landscape) and (max-width: 900px)').matches) {
      document.documentElement.classList.add('landscape-mobile');
    } else {
      document.documentElement.classList.remove('landscape-mobile');
    }
  }
  window.addEventListener('resize', adjustForLandscape);
  adjustForLandscape();

  document.querySelectorAll('a.external').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
});