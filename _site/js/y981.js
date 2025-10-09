/* 即日換算ツール フル実装 JavaScript
   - ハッシュ/クエリ対応で共有
   - 営業日（土日＋祝日）対応（簡易祝日データ内蔵、追加可能）
   - 日付加減算、営業日変換、年齢計算、期間分解、時間換算
   - UI制御、アクセシビリティ補助
*/

/* ====== 設定と祝日データ（簡易） ====== */
const Holiday = {
  // 年ごとに yyyy-mm-dd 形式で列挙する簡易祝日データ（実運用では外部CSVまたはAPIで更新推奨）
  2025: ["2025-01-01","2025-01-13","2025-02-11","2025-02-23","2025-03-21","2025-04-29","2025-05-03","2025-05-04","2025-05-05","2025-07-21","2025-09-15","2025-09-23","2025-10-13","2025-11-03","2025-11-23","2025-12-23"],
  2026: ["2026-01-01","2026-01-12","2026-02-11","2026-02-23","2026-03-20","2026-04-29","2026-05-03","2026-05-04","2026-05-05","2026-07-20","2026-09-21","2026-09-22","2026-10-12","2026-11-03","2026-11-23"]
};

/* ====== ユーティリティ ====== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseISO = s => { const d = new Date(s); return isNaN(d) ? null : d; };
const daysBetween = (a,b) => Math.round((b - a) / 86400000);

/* 祝日判定 */
function isHoliday(date){
  const y = date.getFullYear();
  const key = iso(date);
  if(Holiday[y] && Holiday[y].includes(key)) return true;
  // 振替休日やハッピーマンデーなどの複雑判定は未実装（必要なら拡張）
  return false;
}

/* 営業日判定 */
function isBusinessDay(date){
  const wd = date.getDay();
  if(wd === 0 || wd === 6) return false;
  if(isHoliday(date)) return false;
  return true;
}

/* 指定日から営業日だけ進める（offset は正負の整数） */
function addBusinessDays(startDate, offset){
  if(!Number.isInteger(offset)) offset = Math.floor(offset);
  const dir = offset >= 0 ? 1 : -1;
  let remaining = Math.abs(offset);
  let cur = new Date(startDate);
  while(remaining > 0){
    cur.setDate(cur.getDate() + dir);
    if(isBusinessDay(cur)) remaining--;
  }
  return cur;
}

/* 期間を年/月/日/総日数に分解 */
function decomposePeriod(start, end){
  if(!(start instanceof Date) || !(end instanceof Date)) return null;
  if(start > end) [start, end] = [end, start];
  const totalDays = daysBetween(start, end);
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  let d = end.getDate() - start.getDate();
  if(d < 0){
    m -= 1;
    const tmp = new Date(end.getFullYear(), end.getMonth(), 0);
    d += tmp.getDate();
  }
  if(m < 0){
    y -= 1;
    m += 12;
  }
  return { years: y, months: m, days: d, totalDays };
}

/* 年齢計算（満年齢） */
function calcAge(birthDate, refDate = new Date()){
  if(!(birthDate instanceof Date)) return null;
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if(m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) age--;
  return age;
}

/* 時間単位変換（基準は秒） */
const TimeUnits = {
  "秒": 1,
  "分": 60,
  "時間": 3600,
  "日": 86400
};
function convertTime(value, fromUnit, toUnit){
  const base = value * (TimeUnits[fromUnit] || 1);
  return base / (TimeUnits[toUnit] || 1);
}

/* ハッシュとクエリの読み書き */
function buildHash(params){
  return Object.entries(params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");
}
function parseHash(hash){
  if(!hash) return {};
  const s = hash.replace(/^#/, "");
  const sp = new URLSearchParams(s);
  const out = {};
  for(const [k,v] of sp.entries()) out[k] = v;
  return out;
}

/* フォーカス補助 */
function focusFirstInput(containerSel){
  const c = document.querySelector(containerSel);
  if(!c) return;
  const f = c.querySelector("input,select,button,textarea");
  if(f) f.focus();
}

/* ====== UI 更新ロジック ====== */

/* 結果表示ユーティリティ */
function showResult(sel, text){
  const el = $(sel);
  if(!el) return;
  el.textContent = text;
  el.setAttribute("aria-live", "polite");
}

/* 日付加減算 */
function handleDateCalc(){
  const s = $("#date-start").value;
  const add = parseInt($("#date-offset").value || "0", 10);
  const start = parseISO(s);
  if(!start){ showResult("#res-date", "開始日を正しく入力してください"); return; }
  const result = new Date(start);
  result.setDate(result.getDate() + add);
  showResult("#res-date", `計算結果: ${iso(result)} (${result.toLocaleDateString()})`);
  const hash = buildHash({tool:"date", start: s, offset: add});
  updateShare(hash);
}

/* 営業日変換（開始日 + 営業日数） */
function handleBusinessCalc(){
  const s = $("#business-start").value;
  const add = parseInt($("#business-offset").value || "0", 10);
  const start = parseISO(s);
  if(!start){ showResult("#res-business", "開始日を正しく入力してください"); return; }
  const result = addBusinessDays(start, add);
  showResult("#res-business", `営業日換算結果: ${iso(result)} (${result.toLocaleDateString()})`);
  const hash = buildHash({tool:"business", start: s, offset: add});
  updateShare(hash);
}

/* 期間分解 */
function handleRangeDecompose(){
  const a = parseISO($("#range-start").value);
  const b = parseISO($("#range-end").value);
  if(!a || !b){ showResult("#res-range", "開始日と終了日を正しく入力してください"); return; }
  const r = decomposePeriod(a,b);
  showResult("#res-range", `${r.years}年 ${r.months}ヶ月 ${r.days}日（総日数 ${r.totalDays}日）`);
  const hash = buildHash({tool:"range", s: iso(a), e: iso(b)});
  updateShare(hash);
}

/* 年齢計算 */
function handleAgeCalc(){
  const b = parseISO($("#birth").value);
  if(!b){ showResult("#res-age", "生年月日を正しく入力してください"); return; }
  const age = calcAge(b, new Date());
  const wareki = `${b.getFullYear()}年${b.getMonth()+1}月${b.getDate()}日`;
  showResult("#res-age", `満年齢: ${age}歳（${wareki}）`);
  const hash = buildHash({tool:"age", birth: iso(b)});
  updateShare(hash);
}

/* 時間単位変換 */
function handleTimeConvert(){
  const v = parseFloat($("#time-value").value || "0");
  const from = $("#time-from").value;
  const to = $("#time-to").value;
  if(isNaN(v)){ showResult("#res-time", "正しい数値を入力してください"); return; }
  const out = convertTime(v, from, to);
  showResult("#res-time", `${v} ${from} = ${Number(out.toFixed(6))} ${to}`);
  const hash = buildHash({tool:"time", v, f:from, t:to});
  updateShare(hash);
}

/* ハッシュ更新とリンク表示 */
function updateShare(hash){
  location.hash = hash;
  const url = location.origin + location.pathname + "#" + hash;
  $("#share-url").value = url;
  $("#share-copy").removeAttribute("disabled");
}

/* コピー */
function copyShare(){
  const v = $("#share-url").value;
  navigator.clipboard?.writeText(v).then(() => {
    $("#share-copy").textContent = "コピーしました";
    setTimeout(()=> $("#share-copy").textContent = "コピー", 1500);
  }, () => {
    $("#share-copy").textContent = "コピー失敗";
    setTimeout(()=> $("#share-copy").textContent = "コピー", 1500);
  });
}

/* ハッシュからフォームに復元（自動計算はユーザー操作に任せる） */
function restoreFromHash(){
  const p = parseHash(location.hash);
  if(!p.tool) return;
  if(p.tool === "date"){
    if(p.start) $("#date-start").value = p.start;
    if(p.offset) $("#date-offset").value = p.offset;
  } else if(p.tool === "business"){
    if(p.start) $("#business-start").value = p.start;
    if(p.offset) $("#business-offset").value = p.offset;
  } else if(p.tool === "range"){
    if(p.s) $("#range-start").value = p.s;
    if(p.e) $("#range-end").value = p.e;
  } else if(p.tool === "age"){
    if(p.birth) $("#birth").value = p.birth;
  } else if(p.tool === "time"){
    if(p.v) $("#time-value").value = p.v;
    if(p.f) $("#time-from").value = p.f;
    if(p.t) $("#time-to").value = p.t;
  }
  // 共有URL表示
  $("#share-url").value = location.origin + location.pathname + location.hash;
}

/* シンプルな入力確定でEnter押したら計算 */
function attachEnterHandlers(){
  const map = [
    {sel: "#date-start, #date-offset", fn: handleDateCalc},
    {sel: "#business-start, #business-offset", fn: handleBusinessCalc},
    {sel: "#range-start, #range-end", fn: handleRangeDecompose},
    {sel: "#birth", fn: handleAgeCalc},
    {sel: "#time-value, #time-from, #time-to", fn: handleTimeConvert}
  ];
  map.forEach(m => {
    $$(m.sel).forEach(el => {
      el.addEventListener("keydown", e => {
        if(e.key === "Enter") { e.preventDefault(); m.fn(); }
      });
    });
  });
}

/* 初期化 */
function init(){
  // イベントバインド
  $("#btn-date-calc").addEventListener("click", handleDateCalc);
  $("#btn-business-calc").addEventListener("click", handleBusinessCalc);
  $("#btn-range-calc").addEventListener("click", handleRangeDecompose);
  $("#btn-age-calc").addEventListener("click", handleAgeCalc);
  $("#btn-time-calc").addEventListener("click", handleTimeConvert);
  $("#share-copy").addEventListener("click", copyShare);

  attachEnterHandlers();
  restoreFromHash();
  // フォーカス
  focusFirstInput("#app");
  // ハッシュ変更対応
  window.addEventListener("hashchange", restoreFromHash);
}

document.addEventListener("DOMContentLoaded", init);