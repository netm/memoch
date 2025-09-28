// script.js

let data = [];
let currentView = null;

document.addEventListener('DOMContentLoaded', () => {
  fetch('datahijou.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      loadPrintList();
      bindNav();
      showShelfLifeRanking();
    });
});

function bindNav() {
  document.getElementById('btnShelfLife').onclick = showShelfLifeRanking;
  document.getElementById('btnCategory').onclick = showCategoryRanking;
  document.getElementById('btnCalc').onclick = showCalcTool;
  document.getElementById('btnPrintView').onclick = showPrintListView;

  document.getElementById('btnAddSelected').onclick = addSelectedToPrintList;
  document.getElementById('btnPrint').onclick = () => window.print();
  document.getElementById('btnCopy').onclick = copyPrintList;
  document.getElementById('btnClear').onclick = clearPrintList;
  document.getElementById('btnSavePng').onclick = savePrintListAsPng;
  document.getElementById('shareX').onclick = () => share('twitter');
  document.getElementById('shareFB').onclick = () => share('facebook');
  document.getElementById('shareLINE').onclick = () => share('line');
}

function showShelfLifeRanking() {
  currentView = 'ranking';
  const main = document.getElementById('main');
  let sorted = [...data].sort((a,b) => b.shelfLifeYears - a.shelfLifeYears);
  let html = `<h2>保存年数ランキング</h2>
    <table><tr><th></th><th>商品名</th><th>メーカー</th><th>保存年数</th></tr>`;
  sorted.forEach((item,i) => {
    html += `<tr>
      <td><input type="checkbox" data-name="${item.name}"></td>
      <td>${item.name}</td>
      <td>${item.maker}</td>
      <td>${item.shelfLifeYears}年</td>
    </tr>`;
  });
  html += `</table>`;
  main.innerHTML = html;
}

function showCategoryRanking() {
  currentView = 'category';
  const main = document.getElementById('main');
  const byCat = data.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
  let html = `<h2>カテゴリ別ランキング</h2>`;
  for (let cat in byCat) {
    let sorted = byCat[cat].sort((a,b) => b.shelfLifeYears - a.shelfLifeYears);
    html += `<h3>${cat}</h3><table><tr><th></th><th>商品名</th><th>保存年数</th></tr>`;
    sorted.forEach(item => {
      html += `<tr>
        <td><input type="checkbox" data-name="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.shelfLifeYears}年</td>
      </tr>`;
    });
    html += `</table>`;
  }
  main.innerHTML = html;
}

function showCalcTool() {
  currentView = 'calc';
  const main = document.getElementById('main');
  main.innerHTML = `
    <h2>必要量計算ツール</h2>
    <label>家族人数<input id="inpPersons" type="number" min="1" value="1"></label>
    <label>備蓄日数<input id="inpDays" type="number" min="1" value="1"></label>
    <button id="btnDoCalc">計算</button>
    <div id="calcResult"></div>`;
  document.getElementById('btnDoCalc').onclick = doCalculation;
}

function doCalculation() {
  const p = +document.getElementById('inpPersons').value;
  const d = +document.getElementById('inpDays').value;
  const water = 2 * p * d;
  const staples = data.filter(i => i.category === 'アルファ米')
                     .sort((a,b)=>b.shelfLifeYears-a.shelfLifeYears)
                     .slice(0, p*d);
  const sides = data.filter(i => i.category==='缶詰' || i.category==='レトルト食品')
                   .sort((a,b)=>b.shelfLifeYears-a.shelfLifeYears)
                   .slice(0, p*d);
  let html = `<h3>結果</h3>
    <label><input type="checkbox" data-name="水 ${water}L">水 ${water}L</label>
    <h4>主食候補</h4>`;
  staples.forEach(i=> html += `<label><input type="checkbox" data-name="${i.name}">${i.name}</label>`);
  html += `<h4>副食候補</h4>`;
  sides.forEach(i=> html += `<label><input type="checkbox" data-name="${i.name}">${i.name}</label>`);
  document.getElementById('calcResult').innerHTML = html;
}

function addSelectedToPrintList() {
  const checkboxes = document.querySelectorAll('#main input[type=checkbox]:checked');
  const printList = document.getElementById('printList');
  const saved = JSON.parse(localStorage.getItem('printList')||'[]');
  checkboxes.forEach(cb => {
    const name = cb.dataset.name;
    if (!saved.includes(name)) {
      saved.push(name);
      let div = document.createElement('div');
      div.textContent = name;
      printList.appendChild(div);
    }
    cb.checked = false;
  });
  localStorage.setItem('printList', JSON.stringify(saved));
}

function loadPrintList() {
  const saved = JSON.parse(localStorage.getItem('printList')||'[]');
  const printList = document.getElementById('printList');
  saved.forEach(name => {
    let div = document.createElement('div');
    div.textContent = name;
    printList.appendChild(div);
  });
}

function showPrintListView() {
  currentView = 'print';
  document.getElementById('main').innerHTML = `<h2>印刷リスト</h2><div id="printList"></div>`;
  loadPrintList();
}

function copyPrintList() {
  const text = Array.from(document.getElementById('printList').children)
    .map(div => div.textContent).join('\n');
  navigator.clipboard.writeText(text);
}

function clearPrintList() {
  localStorage.removeItem('printList');
  document.getElementById('printList').innerHTML = '';
}

function savePrintListAsPng() {
  html2canvas(document.getElementById('printList')).then(canvas => {
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
  if (platform==='twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  if (platform==='facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if (platform==='line') shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
  window.open(shareUrl,'_blank');
}