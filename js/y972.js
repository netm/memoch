// app.js — 栄養バランス献立メーカー（ページ内JSONを利用）
let DATA = null;

function loadDataFromHtml(){
  const el = document.getElementById('recipes-data');
  if(!el) throw new Error('recipes-data が見つかりません');
  return JSON.parse(el.textContent);
}

function getUserPrefs(){
  return {
    people: parseInt(document.getElementById('people').value,10)||1,
    timePref: document.getElementById('timePref').value,
    allergies: (document.getElementById('allergy').value||'').split(',').map(s=>s.trim()).filter(Boolean)
  };
}

function filterByAllergy(recipe, allergies){
  if(!allergies.length) return true;
  const ingNames = recipe.ingredients.map(i=>i.name.toLowerCase());
  return !allergies.some(a => ingNames.some(n => n.includes(a.toLowerCase())));
}

function pickTemplate(timePref){
  const candidates = DATA.week_templates.filter(w=> timePref==='any' ? true : w.time_pref===timePref);
  return candidates.length ? candidates[0] : DATA.week_templates[0];
}

function scoreDayNutrients(dishes){
  const totals = {protein:0,veg:0,carb:0,fat:0};
  dishes.forEach(r => {
    if(r.nutrients){
      totals.protein += r.nutrients.protein || 0;
      totals.veg += r.nutrients.veg || 0;
      totals.carb += r.nutrients.carb || 0;
      totals.fat += r.nutrients.fat || 0;
    }
  });
  return totals;
}

function scoreWeek(template, people){
  const guidelines = DATA.nutrition_guidelines.per_day;
  const week = {days:[], totals:{protein:0,veg:0,carb:0,fat:0}};
  template.structure.forEach(day => {
    const dishes = day.dishes.map(id => DATA.recipes.find(r=>r.id===id)).filter(Boolean);
    const dayTotals = scoreDayNutrients(dishes);
    // scale by people roughly for carb/protein quantity display but scoring uses per-person guideline
    week.days.push({day:day.day, dishes, totals:dayTotals});
    week.totals.protein += dayTotals.protein;
    week.totals.veg += dayTotals.veg;
    week.totals.carb += dayTotals.carb;
    week.totals.fat += dayTotals.fat;
  });
  // simple scoring: count days meeting per_day targets (per person)
  return week;
}

function nutritionStatusForDay(dayTotals){
  const g = DATA.nutrition_guidelines.per_day;
  return {
    protein_ok: dayTotals.protein >= g.protein,
    veg_ok: dayTotals.veg >= g.veg,
    carb_ok: dayTotals.carb >= g.carb * 0.4, // dinner carb target heuristic
    fat_ok: dayTotals.fat <= g.fat * 1.5 // allow some tolerance
  };
}

function aggregateShopping(template, people){
  const map = new Map();
  template.structure.forEach(day=>{
    day.dishes.forEach(id=>{
      const r = DATA.recipes.find(x=>x.id===id);
      if(!r) return;
      r.ingredients.forEach(ing=>{
        const key = `${ing.name}||${ing.unit}||${ing.category}`;
        const qty = Math.round((ing.qty || 1) * people);
        if(map.has(key)) map.get(key).qty += qty;
        else map.set(key, {name:ing.name, unit:ing.unit||'', qty, category:ing.category||''});
      });
    });
  });
  return Array.from(map.values()).sort((a,b)=> a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function renderSummary(weekData, people){
  const el = document.getElementById('nutrition-summary');
  const perDayGuideline = DATA.nutrition_guidelines.per_day;
  // compute simple metrics: days where protein and veg OK per person
  let proteinDays=0, vegDays=0;
  weekData.days.forEach(d=>{
    const status = nutritionStatusForDay(d.totals);
    if(status.protein_ok) proteinDays++;
    if(status.veg_ok) vegDays++;
  });
  el.innerHTML = `
    <h3>栄養サマリー（人数: ${people}人）</h3>
    <div class="summary-grid">
      <div class="summary-cell"><strong>目安（1日）</strong><div class="muted">たんぱく質 ${perDayGuideline.protein}g / 野菜 ${perDayGuideline.veg}皿</div></div>
      <div class="summary-cell"><strong>たんぱく質日数</strong><div>${proteinDays}/7 日</div></div>
      <div class="summary-cell"><strong>野菜日数</strong><div>${vegDays}/7 日</div></div>
      <div class="summary-cell"><strong>週合計（概算）</strong><div class="muted">蛋白 ${weekData.totals.protein}g / 野菜 ${weekData.totals.veg}皿</div></div>
    </div>
    <p class="small">注: この判定は簡易モデルです。詳細な栄養算定は栄養士の基準を参照してください。</p>
  `;
}

function renderWeek(weekData, people, startDay){
  const el = document.getElementById('week');
  el.innerHTML = '<div class="week"></div>';
  const weekEl = el.querySelector('.week');
  // rotate if startDay is Sun
  const days = weekData.days.slice();
  if(startDay==='Sun'){
    while(days[0] && days[0].day!=='Sun'){
      days.push(days.shift());
      if(days.length>8) break;
    }
  }
  days.forEach(d=>{
    const dayEl = document.createElement('article');
    dayEl.className='day';
    const status = nutritionStatusForDay(d.totals);
    const statusText = `たんぱく質:${status.protein_ok?'良':'△'} 野菜:${status.veg_ok?'良':'△'}`;
    dayEl.innerHTML = `<h3>${d.day} <span class="small">(${statusText})</span></h3>`;
    d.dishes.forEach(r=>{
      const scaledIngredients = r.ingredients.map(i=>{
        const qty = Math.round((i.qty||1) * people / (r.servings_base||1));
        return `${i.name} ${qty}${i.unit||''}`;
      }).join(' / ');
      dayEl.innerHTML += `<div class="recipe"><h4>${r.title}</h4><p class="small">時間 ${r.time_minutes}分 ・ 栄養: P${r.nutrients?.protein||0}g V${r.nutrients?.veg||0}</p><p class="small">材料: ${scaledIngredients}</p></div>`;
    });
    weekEl.appendChild(dayEl);
  });
}

function renderShoppingList(list){
  const el = document.getElementById('shopping-list');
  el.innerHTML = list.map(i=>`<div class="item"><span class="iname">${i.name}</span><span class="iqty">${i.qty}${i.unit}</span><span class="small muted">${i.category}</span></div>`).join('');
}

function generate(options){
  // pick template by timePref (simple)
  const template = pickTemplate(options.timePref);
  // filter out recipes with allergies
  const allergies = options.allergies || [];
  const filteredTemplate = JSON.parse(JSON.stringify(template));
  // remove dishes that match allergy; if dish removed, try to fill with nearest safe recipe
  filteredTemplate.structure.forEach(day=>{
    day.dishes = day.dishes.filter(id=>{
      const r = DATA.recipes.find(rr=>rr.id===id);
      return r && filterByAllergy(r, allergies);
    });
    // if no dish left, pick any safe quick recipe
    if(day.dishes.length===0){
      const safe = DATA.recipes.find(r=> filterByAllergy(r, allergies) && (options.timePref==='any' || options.timePref==='short' ? r.time_minutes<=30 : true));
      if(safe) day.dishes.push(safe.id);
    }
  });

  const weekData = scoreWeek(filteredTemplate, options.people);
  const shopping = aggregateShopping(filteredTemplate, options.people);
  return { template: filteredTemplate, weekData, shopping };
}

function init(){
  try{
    DATA = loadDataFromHtml();
  }catch(e){
    console.error(e);
    document.getElementById('week').textContent = 'データ読み込みエラー';
    return;
  }

  const prefs = getUserPrefs();
  const state = { last: null };

  function doGenerate(startDay='Mon'){
    const opts = getUserPrefs();
    opts.startDay = startDay;
    const out = generate(opts);
    state.last = out;
    renderSummary(out.weekData, opts.people);
    renderWeek(out.weekData, opts.people, opts.startDay);
    renderShoppingList(out.shopping);
  }

  document.getElementById('generate').addEventListener('click', ()=> doGenerate());
  document.getElementById('randomize').addEventListener('click', ()=>{
    // simple random swap: shuffle template picks for each day from recipes that match allergies/time
    const opts = getUserPrefs();
    const tpl = pickTemplate(opts.timePref);
    const newTpl = JSON.parse(JSON.stringify(tpl));
    newTpl.structure.forEach(day=>{
      const pool = DATA.recipes.filter(r=> filterByAllergy(r, opts.allergies) && (opts.timePref==='short' ? r.time_minutes<=25 : true));
      if(pool.length) {
        // pick 1-2 dishes randomly
        const count = Math.random() < 0.5 ? 1 : 2;
        day.dishes = [];
        for(let i=0;i<count;i++){
          const pick = pool[Math.floor(Math.random()*pool.length)];
          if(pick) day.dishes.push(pick.id);
        }
      }
    });
    const out = generate(opts);
    // override template with newTpl for display (generate used pickTemplate; we want to use newTpl)
    out.template = newTpl;
    out.weekData = scoreWeek(newTpl, opts.people);
    out.shopping = aggregateShopping(newTpl, opts.people);
    state.last = out;
    renderSummary(out.weekData, opts.people);
    renderWeek(out.weekData, opts.people, opts.startDay||'Mon');
    renderShoppingList(out.shopping);
  });

  document.getElementById('download').addEventListener('click', ()=>{
    if(!state.last) return alert('まず生成してください');
    const blob = new Blob([JSON.stringify({shopping: state.last.shopping},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // initial generate
  doGenerate();
}

document.addEventListener('DOMContentLoaded', init);