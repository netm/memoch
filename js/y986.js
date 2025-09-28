// script.js
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(document.getElementById('data-json').textContent);
  const main = document.getElementById('main');
  const cache = document.getElementById('cache');
  const nav = document.getElementById('nav');
  const categories = Array.from(new Set(data.map(item => item.category)));

  // nav ボタン生成
  const allBtn = document.createElement('button');
  allBtn.textContent = '保存年数ランキング';
  allBtn.dataset.target = 'allList';
  nav.appendChild(allBtn);
  categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.dataset.target = `cat-${i}`;
    nav.appendChild(btn);
  });

  // キャッシュ用リスト生成
  const allList = document.createElement('ul');
  allList.id = 'allList';
  data.sort((a,b) => b.shelfLifeYears - a.shelfLifeYears)
      .forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} — 保存年数: ${item.shelfLifeYears}年`;
        allList.appendChild(li);
      });
  cache.appendChild(allList);

  categories.forEach((cat, i) => {
    const ul = document.createElement('ul');
    ul.id = `cat-${i}`;
    data.filter(x => x.category === cat)
        .sort((a,b) => b.shelfLifeYears - a.shelfLifeYears)
        .forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.name} — 保存年数: ${item.shelfLifeYears}年`;
          ul.appendChild(li);
        });
    cache.appendChild(ul);
  });

  // navボタンカラーセット＆クリック処理
  nav.querySelectorAll('button').forEach((btn, i, arr) => {
    const hue = Math.round(i * 360 / arr.length);
    btn.style.setProperty('--hue', hue);
    btn.style.background = `linear-gradient(135deg, hsl(${hue},80%,60%), hsl(${hue},60%,70%))`;
    btn.addEventListener('click', () => {
      const tgt = btn.dataset.target;
      const list = cache.querySelector(`#${tgt}`);
      main.innerHTML = '';
      main.appendChild(list.cloneNode(true));
    });
  });

  // コントロールボタン
  document.getElementById('btnPrint').onclick = () => window.print();
  document.getElementById('btnCopy').onclick = () => {
    const txt = Array.from(main.querySelectorAll('li')).map(li => li.textContent).join('\n');
    navigator.clipboard.writeText(txt);
  };
  document.getElementById('btnReset').onclick = () => nav.querySelector('button').click();
  document.getElementById('btnSavePng').onclick = () => {
    html2canvas(main).then(canvas => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL();
      a.download = 'list.png';
      a.click();
    });
  };
  document.getElementById('shareX').onclick = () => {
    const url = encodeURIComponent(location.href);
    window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
  };
  document.getElementById('shareFB').onclick = () => {
    const url = encodeURIComponent(location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };
  document.getElementById('shareLINE').onclick = () => {
    const url = encodeURIComponent(location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank');
  };

  // 初期表示
  nav.querySelector('button').click();
});