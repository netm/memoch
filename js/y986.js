// script.js
document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main');
  const cache = document.getElementById('cache');
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const list = cache.querySelector(`#${targetId}`);
      if (!list) return;
      main.innerHTML = '';
      const clone = list.cloneNode(true);
      clone.style.display = 'block';
      main.appendChild(clone);
    });
  });
  // 初期表示
  document.querySelector('button[data-target="allList"]').click();
});