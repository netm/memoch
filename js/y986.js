// script.js
let data = [];
let printItems = [];

// JSON読み込み
fetch("datahijou.json")
  .then(res => res.json())
  .then(json => { data = json; });

function calcAndSuggest() {
  const people = parseInt(document.getElementById("people").value);
  const days = parseInt(document.getElementById("days").value);

  const waterPerDay = 3; // L
  const ricePerDay = 3; // 食
  const sidePerDay = 2; // 品

  const totalWater = people * days * waterPerDay;
  const totalRice = people * days * ricePerDay;
  const totalSide = people * days * sidePerDay;

  const waterItems = data.filter(i => i.category.includes("飲料"));
  const riceItems = data.filter(i => ["アルファ米","パン缶","パン","即席ご飯"].includes(i.category));
  const sideItems = data.filter(i => ["缶詰","レトルト食品","栄養補助食品"].includes(i.category));

  let html = "<form id='candidateForm'><ul>";
  if (waterItems.length > 0) {
    html += `<li><label><input type="checkbox" value="水 ${totalWater}L（2Lペットボトル 約${Math.ceil(totalWater/2)}本）"> 水: ${totalWater}L → 例: ${waterItems[0].name}</label></li>`;
  }
  if (riceItems.length > 0) {
    html += `<li><label><input type="checkbox" value="主食 ${totalRice}食分"> 主食: ${totalRice}食分 → 例: ${riceItems[0].name}</label></li>`;
  }
  if (sideItems.length > 0) {
    html += `<li><label><input type="checkbox" value="副食 約${totalSide}品"> 副食: 約${totalSide}品 → 例: ${sideItems[0].name}</label></li>`;
  }
  html += "</ul><button type='button' onclick='addToPrintList()'>印刷リストに追加</button></form>";

  document.getElementById("suggestList").innerHTML = html;
}

function addToPrintList() {
  const checkboxes = document.querySelectorAll("#candidateForm input[type=checkbox]:checked");
  checkboxes.forEach(cb => {
    printItems.push(cb.value);
  });
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