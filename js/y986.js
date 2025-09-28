// script.js

let data = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('datahijou.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      bindNav();
      showShelfLife();
    })
    .catch(console.error);
});

function bindNav() {
  document.getElementById('btnShelfLife').addEventListener('click', showShelfLife);
  document.getElementById('btnCategory').addEventListener('click', showCategory);
  document.getElementById('btnCalc').addEventListener('click', showCalc);
  document.getElementById('btnPrintView').addEventListener('click', showPrintList);

  document.getElementById('btnAddSelected').addEventListener('click', addToPrintList);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
  document.getElementById('btnCopy').addEventListener('click', copyPrintList);
  document.getElementById('btnClear').addEventListener('click', clearPrintList);
  document.getElementById('btnSavePng').addEventListener('click', savePrintListAsPng);

  document.getElementById('shareX').addEventListener('click', () => share('twitter'));
  document.getElementById('shareFB').addEventListener('click', () => share('facebook'));
  document.getElementById('shareLINE').addEventListener('click', () => share('line'));
}

function showShelfLife() {
  const main = document.getElementById('main');
  const sorted = [...data].sort((a, b) => b.shelfLifeYears - a.shelfLifeYears);
  let html = `<h2>保存年数ランキング</h2>
    <table>
      <tr><th></th><th>商品名</th><th>メーカー</th><th>保存年数</th></tr>`;
  sorted.forEach(item => {
    html += `
      <tr>
        <td><input type="checkbox" data-name="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.maker}</td>
        <td>${item.shelfLifeYears}年</td>
      </tr>`;
  });
  html += `</table>`;
  main.innerHTML = html;
}

function showCategory() {
  const main = document.getElementById('main');
  const byCat = data.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  let html = `<h2>カテゴリ別ランキング</h2>`;
  for (const cat in byCat) {
    const sorted = byCat[cat].sort((a, b) => b.shelfLifeYears - a.shelfLifeYears);
    html += `<h3>${cat}</h3>
      <table>
        <tr><th></th><th>商品名</th><th>保存年数</th></tr>`;
    sorted.forEach(item => {
      html += `
        <tr>
          <td><input type="checkbox" data-name="${item.name}"></td>
          <td>${item.name}</td>
          <td>${item.shelfLifeYears}年</td>
        </tr>`;
    });
    html += `</table>`;
  }
  main.innerHTML = html;
}

function showCalc() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <h2>必要量計算ツール</h2>
    <label>家族人数 <input id="inpPersons" type="number" min="1" value="1"></label>
    <label>備蓄日数 <input id="inpDays" type="number" min="1" value="1"></label>
    <button id="btnDoCalc">計算</button>
    <div id="calcResult"></div>
  `;
  document.getElementById('btnDoCalc').addEventListener('click', doCalculation);
}

function doCalculation() {
  const p = +document.getElementById('inpPersons').value;
  const d = +document.getElementById('inpDays').value;
  const waterL = 2 * p * d;

  // 主食：アルファ米から上位p*d件、副食：缶詰＋レトルトから上位p*d件
  const staples = data
    .filter(i => i.category === 'アルファ米')
    .sort((a, b) => b.shelfLifeYears - a.shelfLifeYears)
    .slice(0, p * d);

  const sides = data
    .filter(i => ['缶詰', 'レトルト食品'].includes(i.category))
    .sort((a, b) => b.shelfLifeYears - a.shelfLifeYears)
    .slice(0, p * d);

  let html = `<h3>結果</h3>
    <label><input type="checkbox" data-name="水 ${waterL}L">水 ${waterL}L</label>
    <h4>主食候補</h4>`;
  staples.forEach(i => {
    html += `<label><input type="checkbox" data-name="${i.name}">${i.name}</label>`;
  });
  html += `<h4>副食候補</h4>`;
  sides.forEach(i => {
    html += `<label><input type="checkbox" data-name="${i.name}">${i.name}</label>`;
  });

  document.getElementById('calcResult').innerHTML = html;
}

function showPrintList() {
  const main = document.getElementById('main');
  main.innerHTML = `<h2>印刷リスト</h2><div id="printList"></div>`;
  loadPrintList();
}

function addToPrintList() {
  const printEl = document.getElementById('printList');
  if (!printEl) {
    alert('「印刷リスト」ビューを先に開いてください。');
    return;
  }

  const checked = document.querySelectorAll('#main input[type="checkbox"]:checked');
  const saved = JSON.parse(localStorage.getItem('printList') || '[]');

  checked.forEach(cb => {
    const name = cb.dataset.name;
    if (!saved.includes(name)) {
      saved.push(name);
      const div = document.createElement('div');
      div.textContent = name;
      printEl.appendChild(div);
    }
    cb.checked = false;
  });

  localStorage.setItem('printList', JSON.stringify(saved));
}

function loadPrintList() {
  const printEl = document.getElementById('printList');
  printEl.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('printList') || '[]');
  saved.forEach(name => {
    const div = document.createElement('div');
    div.textContent = name;
    printEl.appendChild(div);
  });
}

function copyPrintList() {
  const printEl = document.getElementById('printList');
  const text = Array.from(printEl.children)
    .map(div => div.textContent)
    .join('\n');
  navigator.clipboard.writeText(text);
}

function clearPrintList() {
  localStorage.removeItem('printList');
  const printEl = document.getElementById('printList');
  if (printEl) printEl.innerHTML = '';
}

function savePrintListAsPng() {
  const printEl = document.getElementById('printList');
  html2canvas(printEl).then(canvas => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'print_list.png';
    a.click();
  });
}

function share(platform) {
  const url = encodeURIComponent(location.href);
  const text = encodeURIComponent('非常食データベースと保存年数ランキング');
  let shareUrl = '';
  if (platform === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  } else if (platform === 'facebook') {
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  } else if (platform === 'line') {
    shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
  }
  window.open(shareUrl, '_blank');
}