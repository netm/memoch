// script.js
let data = [];
let printItems = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./datahijou.json")
    .then(res => {
      if (!res.ok) throw new Error("JSON読み込みエラー: " + res.status);
      return res.json();
    })
    .then(json => {
      data = json;
      renderOverallRanking();
      renderCategoryRanking();
    })
    .catch(err => console.error(err));
});

function renderOverallRanking() {
  const sorted = data.slice().sort((a, b) => b.shelfLife - a.shelfLife);
  let html = `<table>
    <thead><tr><th>順位</th><th>商品名</th><th>保存年数</th></tr></thead><tbody>`;
  sorted.slice(0, 10).forEach((item, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>${item.shelfLife}年</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById("overallRanking").innerHTML = html;
}

function renderCategoryRanking() {
  const categories = ["アルファ米", "パン缶", "缶詰", "レトルト食品"];
  let html = "";
  categories.forEach(cat => {
    const list = data
      .filter(i => i.category === cat)
      .sort((a, b) => b.shelfLife - a.shelfLife)
      .slice(0, 5);
    if (list.length) {
      html += `<h3>${cat}トップ5</h3><table>
        <thead><tr><th>順位</th><th>商品名</th><th>保存年数</th></tr></thead><tbody>`;
      list.forEach((item, i) => {
        html += `<tr>
          <td>${i + 1}</td>
          <td>${item.name}</td>
          <td>${item.shelfLife}年</td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }
  });
  document.getElementById("categoryRanking").innerHTML = html;
}

function calcAndSuggest() {
  const people = parseInt(document.getElementById("people").value, 10);
  const days = parseInt(document.getElementById("days").value, 10);
  if (isNaN(people) || people < 1 || isNaN(days) || days < 1) {
    alert("家族人数と備蓄日数は1以上の整数で入力してください。");
    return;
  }

  const waterPerDay = 3;
  const ricePerDay = 3;
  const sidePerDay = 2;

  const totalWater = people * days * waterPerDay;
  const totalRice = people * days * ricePerDay;
  const totalSide = people * days * sidePerDay;

  const waterItems = data.filter(i => i.category.includes("飲料"));
  const riceItems = data.filter(i =>
    ["アルファ米", "パン缶", "パン", "即席ご飯"].includes(i.category)
  );
  const sideItems = data.filter(i =>
    ["缶詰", "レトルト食品", "栄養補助食品"].includes(i.category)
  );

  let html = "<form id='candidateForm'><ul>";
  if (waterItems.length) {
    html += `<li><label><input type="checkbox" value="水 ${totalWater}L（2Lペットボトル 約${Math.ceil(
      totalWater / 2
    )}本）"> 水: ${totalWater}L → 例: ${waterItems[0].name}</label></li>`;
  }
  if (riceItems.length) {
    html += `<li><label><input type="checkbox" value="主食 ${totalRice}食分"> 主食: ${totalRice}食分 → 例: ${riceItems[0].name}</label></li>`;
  }
  if (sideItems.length) {
    html += `<li><label><input type="checkbox" value="副食 約${totalSide}品"> 副食: 約${totalSide}品 → 例: ${sideItems[0].name}</label></li>`;
  }
  html += "</ul><button type='button' onclick='addToPrintList()'>印刷リストに追加</button></form>";
  document.getElementById("suggestList").innerHTML = html;
}

function addToPrintList() {
  const checked = document.querySelectorAll("#candidateForm input[type=checkbox]:checked");
  checked.forEach(cb => printItems.push(cb.value));
  renderPrintList();
}

function renderPrintList() {
  let html = "<ul>";
  printItems.forEach(item => {
    html += `<li>${item}</li>`;
  });
  html += "</ul>";
  document.getElementById("printList").innerHTML = html;
}