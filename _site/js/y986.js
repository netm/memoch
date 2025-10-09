// script.js
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(document.getElementById('data-json').textContent);
  const main = document.getElementById('main');
  const cache = document.getElementById('cache');
  const nav = document.getElementById('nav');
  const categories = Array.from(new Set(data.map(i => i.category)));

  // ナビボタン生成
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

  // リスト作成関数
  function makeList(id, items) {
    const ul = document.createElement('ul');
    ul.id = id;
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>名称:</strong> ${item.name}<br>
        <strong>メーカー:</strong> ${item.maker}<br>
        <strong>カテゴリ:</strong> ${item.category}<br>
        <strong>保存期間:</strong> ${item.shelfLifeYears}年<br>
        <strong>重さ:</strong> ${item.weight}<br>
        <strong>アレルゲン:</strong> ${item.allergy}<br>
        <strong>目安価格:</strong> ${item.price}
      `;
      ul.appendChild(li);
    });
    return ul;
  }

  // 全アイテムリスト
  const allList = makeList('allList', data.sort((a, b) => b.shelfLifeYears - a.shelfLifeYears));
  cache.appendChild(allList);

  // カテゴリ別リスト
  categories.forEach((cat, i) => {
    const items = data.filter(x => x.category === cat)
                      .sort((a, b) => b.shelfLifeYears - a.shelfLifeYears);
    cache.appendChild(makeList(`cat-${i}`, items));
  });

  // ボタンクリック処理
  nav.querySelectorAll('button').forEach((btn, i, arr) => {
    const hue = Math.round(i * 360 / arr.length);
    btn.style.background = `linear-gradient(135deg, hsl(${hue},80%,60%), hsl(${hue},60%,70%))`;
    btn.addEventListener('click', () => {
      const tgt = btn.dataset.target;
      const list = cache.querySelector(`#${tgt}`);
      main.innerHTML = '';
      main.appendChild(list.cloneNode(true));
    });
  });

  // コントロール
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
    const u = encodeURIComponent(location.href);
    window.open(`https://twitter.com/intent/tweet?url=${u}`, '_blank');
  };
  document.getElementById('shareFB').onclick = () => {
    const u = encodeURIComponent(location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank');
  };
  document.getElementById('shareLINE').onclick = () => {
    const u = encodeURIComponent(location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${u}`, '_blank');
  };

  // 初期表示
  nav.querySelector('button').click();
});