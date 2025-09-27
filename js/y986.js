// script.js
let data = [];
let printList = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('datahijou.json')
    .then(res => res.json())
    .then(json => {
      data = json;
      renderShelfLifeRanking();
      renderCategoryRanking();
      setupCalculator();
      renderPrintList();
    });
});

function renderShelfLifeRanking() {
  const container = document.getElementById('shelfLifeRanking');
  const sorted = [...data].sort((a, b) => b.shelfLifeYears - a.shelfLifeYears);
  let html = '<h2>保存年数ランキング</h2><table><thead><tr><th>順位</th><th>製品名</th><th>保存年数</th></tr></thead><tbody>';
  sorted.forEach((item, i) => {
    html += `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.shelfLifeYears}年</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderCategoryRanking() {
  const container = document.getElementById('categoryRanking');
  const categories = [...new Set(data.map(d => d.category))];
  let html = '<h2>カテゴリ別ランキング</h2>';
  categories.forEach(cat => {
    const items = data.filter(d => d.category === cat).sort((a, b) => b.shelfLifeYears - a.shelfLifeYears);
    html += `<h3>${cat}</h3><table><thead><tr><th>順位</th><th>製品名</th><th>保存年数</th></tr></thead><tbody>`;
    items.forEach((item, i) => {
      html += `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.shelfLifeYears}年</td></tr>`;
    });
    html += '</tbody></table>';
  });
  container.innerHTML = html;
}

function setupCalculator() {
  document.getElementById('calcBtn').addEventListener('click', () => {
    const family = parseInt(document.getElementById('familyCount').value) || 1;
    const days = parseInt(document.getElementById('daysCount').value) || 1;
    const req = family * days;
    renderCandidates(req);
  });
}

function renderCandidates(req) {
  const container = document.getElementById('candidateSection');
  let html = `<h2>候補アイテム</h2><p>必要量：${req} パック</p><table><thead><tr><th>製品名</th><th>必要数</th><th>操作</th></tr></thead><tbody>`;
  data.forEach(item => {
    html += `<tr><td>${item.name}</td><td>${req}</td><td><button class="addBtn" data-name="${item.name}" data-req="${req}">追加</button></td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  document.querySelectorAll('.addBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const count = parseInt(btn.dataset.req);
      if (!printList.find(i => i.name === name)) {
        printList.push({ name, count });
        renderPrintList();
      }
    });
  });
}

function renderPrintList() {
  const container = document.getElementById('printListSection');
  let html = '<h2>印刷リスト</h2>';
  if (printList.length === 0) {
    html += '<p>リストは空です。</p>';
  } else {
    html += '<ul>';
    printList.forEach(item => {
      html += `<li>${item.name} × ${item.count}</li>`;
    });
    html += '</ul><button id="printBtn">リストを印刷</button> <button id="copyBtn">リストをコピー</button>';
  }
  container.innerHTML = html;
  const printBtn = document.getElementById('printBtn');
  const copyBtn = document.getElementById('copyBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const text = printList.map(i => `${i.name} × ${i.count}`).join('\n');
    navigator.clipboard.writeText(text).then(() => alert('リストをコピーしました'));
  });
}