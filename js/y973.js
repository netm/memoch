// app.js
// Method B: ページ内に埋め込んだ JSON を読み込んで動く一週間献立メーカー

let DATA = null;

function loadDataFromHtml() {
  const el = document.getElementById('recipes-data');
  if (!el) throw new Error('recipes-data が見つかりません');
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    console.error('JSON parse error', e);
    return null;
  }
}

function findTemplate(budgetId, timePref) {
  const band = DATA.budget_bands.find(b => b.id === budgetId) || DATA.budget_bands[0];
  let candidates = DATA.week_templates.filter(wt => wt.budget_max <= band.max);
  if (timePref && timePref !== 'any') {
    const matched = candidates.filter(wt => wt.time_pref === timePref);
    if (matched.length) candidates = matched;
  }
  candidates.sort((a,b) => Math.abs(a.estimated_cost - band.max) - Math.abs(b.estimated_cost - band.max));
  return candidates[0] || DATA.week_templates[0];
}

function scaleIngredient(ing, people, base) {
  const factor = people / (base || 1);
  const qty = ing.qty * factor;
  const rounded = qty < 1 ? Math.ceil(qty) : Math.round(qty);
  return { ...ing, qty: rounded };
}

function aggregateShoppingList(template, people) {
  const map = new Map();
  template.structure.forEach(day => {
    day.dishes.forEach(id => {
      const r = DATA.recipes.find(x => x.id === id);
      if (!r) return;
      r.ingredients.forEach(ing => {
        const s = scaleIngredient(ing, people, r.servings_base);
        const key = `${s.name}||${s.unit}||${s.category}`;
        const prev = map.get(key);
        if (prev) prev.qty += s.qty;
        else map.set(key, { name: s.name, unit: s.unit, qty: s.qty, category: s.category });
      });
    });
  });
  return Array.from(map.values()).sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function estimateWeekCost(template, people) {
  let total = 0;
  template.structure.forEach(day => {
    day.dishes.forEach(id => {
      const r = DATA.recipes.find(x => x.id === id);
      if (r && typeof r.cost_per_serving === 'number') total += r.cost_per_serving;
    });
  });
  return Math.round(total * people);
}

function render(template, people, startDay) {
  const summary = document.getElementById('summary');
  const result = document.getElementById('result');
  const shoppingListEl = document.getElementById('shopping-list');
  const estimatedCostEl = document.getElementById('estimated-cost');
  const bottomActions = document.getElementById('bottom-actions');

  const cost = estimateWeekCost(template, people);
  summary.innerHTML = `<h2>${template.label}</h2><p class="small">推定週合計: <strong>${cost}円</strong> ・ 人数: <strong>${people}人</strong></p><p class="small">${template.notes || ''}</p>`;

  // 日配列を開始曜日に合わせる
  const days = template.structure.slice();
  if (startDay === 'Sun') {
    while (days[0].day !== 'Sun') {
      days.push(days.shift());
      if (days.length > 8) break;
    }
  }

  result.innerHTML = '<div class="week"></div>';
  const weekEl = result.querySelector('.week');
  days.forEach(day => {
    const dayEl = document.createElement('article');
    dayEl.className = 'day';
    dayEl.innerHTML = `<h3>${day.day}</h3>`;
    day.dishes.forEach(id => {
      const r = DATA.recipes.find(x => x.id === id);
      if (!r) return;
      const scaled = r.ingredients.map(ing => scaleIngredient(ing, people, r.servings_base));
      const ingText = scaled.map(s => `${s.name} ${s.qty}${s.unit || ''}`).join(' / ');
      dayEl.innerHTML += `<div class="recipe"><h4>${r.title}</h4><p class="small">時間 ${r.time_minutes}分 ・ 目安 ${r.cost_per_serving}円</p><p class="ingredients">材料: ${ingText}</p></div>`;
    });
    weekEl.appendChild(dayEl);
  });

  const shopping = aggregateShoppingList(template, people);
  shoppingListEl.innerHTML = shopping.map(i => `<div class="item"><span class="iname">${i.name}</span><span class="iqty">${i.qty}${i.unit}</span><span class="icat">${i.category}</span></div>`).join('');
  estimatedCostEl.textContent = `推定週合計（目安）: ${cost}円`;

  bottomActions.innerHTML = '';
  const printBtn = document.createElement('button');
  printBtn.textContent = '印刷する';
  printBtn.addEventListener('click', () => window.print());
  bottomActions.appendChild(printBtn);

  const dlBtn = document.createElement('button');
  dlBtn.textContent = '買い物リストをJSONで保存';
  dlBtn.addEventListener('click', () => {
    const payload = { templateId: template.id, people, shopping, estimated_week_cost: cost };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping_${template.id}_p${people}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  bottomActions.appendChild(dlBtn);

  const altBtn = document.createElement('button');
  altBtn.textContent = '同予算帯の別パターン';
  altBtn.addEventListener('click', () => {
    const bandId = document.getElementById('budget').value;
    const band = DATA.budget_bands.find(b => b.id === bandId) || DATA.budget_bands[0];
    const candidates = DATA.week_templates.filter(wt => wt.budget_max <= band.max);
    if (!candidates.length) return;
    const idx = candidates.findIndex(c => c.id === template.id);
    const next = candidates[(idx + 1) % candidates.length];
    render(next, people, startDay);
  });
  bottomActions.appendChild(altBtn);
}

function populateBudgetSelect() {
  const sel = document.getElementById('budget');
  sel.innerHTML = '';
  DATA.budget_bands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.label;
    sel.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    DATA = loadDataFromHtml();
    if (!DATA) throw new Error('DATA が読み込めませんでした');
    populateBudgetSelect();

    document.getElementById('generate').addEventListener('click', () => {
      const people = parseInt(document.getElementById('people').value, 10) || 1;
      const budget = document.getElementById('budget').value;
      const timePref = document.getElementById('timePref').value;
      const startDay = document.getElementById('startDay').value;
      const template = findTemplate(budget, timePref);
      render(template, people, startDay);
    });

    document.getElementById('sample3000').addEventListener('click', () => {
      document.getElementById('people').value = '1';
      document.getElementById('budget').value = 'b3000';
      document.getElementById('timePref').value = 'short';
      document.getElementById('generate').click();
    });

    document.getElementById('download-recipes').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recipes.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    // optional: auto generate initial sample
    // document.getElementById('sample3000').click();
  } catch (err) {
    console.error(err);
    document.getElementById('result').textContent = 'データの読み込みに失敗しました。ページ内の JSON を確認してください。';
  }
});