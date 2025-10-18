// Conversion reference (base: milliliter for volume, gram approximations for common ingredients)
const VOLUMES = {
  "pinch": 0.36,       // ひとつまみ ≒ 0.36 ml (目安)
  "smidge": 0.9,       // ひとつまみ大め（おまけ）
  "teaspoon": 5,       // 小さじ 5 ml
  "tablespoon": 15,    // 大さじ 15 ml
  "fluid_ounce": 29.5735,
  "cup_us": 240,       // US cup (料理用途で一般的)
  "pint_us": 473.176,
  "quart_us": 946.353,
  "liter": 1000,
  "ml": 1
};

// Typical density approximations (g per ml) for conversion weight <-> volume
const DENSITIES = {
  "water": 1.0,
  "granulated_sugar": 0.85,
  "brown_sugar_packed": 0.95,
  "all_purpose_flour": 0.53,   // 1 cup ≒ 125 g => 125/240 ≒ 0.52
  "butter": 0.911,             // 1 tbsp butter ≒ 14.2 g => 14.2/15 ≒ 0.947 (varies) -> using 0.911 as mild avg
  "olive_oil": 0.91
};

// Simple helper: format number with up to 2 decimals but trim trailing zeros
function fmt(n) {
  if (Math.abs(n) < 0.005) return "0";
  return Number.parseFloat(n.toFixed(2)).toString().replace(/\.00$/, "").replace(/\.0$/, "");
}

// Convert volume unit to ml
function toMl(value, fromUnit) {
  if (!(fromUnit in VOLUMES)) throw new Error("Unknown volume unit: " + fromUnit);
  return value * VOLUMES[fromUnit];
}

// Convert ml to target volume unit
function fromMl(ml, toUnit) {
  if (!(toUnit in VOLUMES)) throw new Error("Unknown volume unit: " + toUnit);
  return ml / VOLUMES[toUnit];
}

// Convert volume (any supported) to another volume
function convertVolume(value, fromUnit, toUnit) {
  const ml = toMl(value, fromUnit);
  return fromMl(ml, toUnit);
}

// Convert volume to weight using density (g)
function volumeToGrams(value, fromUnit, ingredientKey) {
  const ml = toMl(value, fromUnit);
  const density = DENSITIES[ingredientKey] || DENSITIES.water;
  return ml * density;
}

// Convert grams to volume unit using density
function gramsToVolume(grams, toUnit, ingredientKey) {
  const density = DENSITIES[ingredientKey] || DENSITIES.water;
  const ml = grams / density;
  return fromMl(ml, toUnit);
}

// Prebuilt chart data (rows): label, ml, examples (grams for water)
const CHART = [
  { label: "ひとつまみ (pinch)", ml: VOLUMES.pinch },
  { label: "ひとつまみ大め (smidge)", ml: VOLUMES.smidge },
  { label: "小さじ 1 (teaspoon)", ml: VOLUMES.teaspoon },
  { label: "大さじ 1 (tablespoon)", ml: VOLUMES.tablespoon },
  { label: "液量オンス 1 (fl oz)", ml: VOLUMES.fluid_ounce },
  { label: "カップ 1 (US cup)", ml: VOLUMES.cup_us },
  { label: "パイント 1 (US pint)", ml: VOLUMES.pint_us },
  { label: "クォート 1 (US quart)", ml: VOLUMES.quart_us },
  { label: "キログラム換算例 (約)", ml: VOLUMES.liter }
];

// Build chart DOM
function buildChart() {
  const tbody = document.getElementById("chart-body");
  tbody.innerHTML = "";
  CHART.forEach(row => {
    const tr = document.createElement("tr");
    const labelTd = document.createElement("td");
    labelTd.textContent = row.label;
    const mlTd = document.createElement("td");
    mlTd.textContent = fmt(row.ml) + " ml";
    const gramsWaterTd = document.createElement("td");
    gramsWaterTd.textContent = fmt(row.ml * DENSITIES.water) + " g (水)";
    const sugarTd = document.createElement("td");
    sugarTd.textContent = fmt(row.ml * DENSITIES.granulated_sugar) + " g (砂糖)";
    const flourTd = document.createElement("td");
    flourTd.textContent = fmt(row.ml * DENSITIES.all_purpose_flour) + " g (薄力粉換算)";
    tr.appendChild(labelTd);
    tr.appendChild(mlTd);
    tr.appendChild(gramsWaterTd);
    tr.appendChild(sugarTd);
    tr.appendChild(flourTd);
    tbody.appendChild(tr);
  });
}

// Simple conversion widget handler
function handleConvertForm(e) {
  e && e.preventDefault();
  const value = parseFloat(document.getElementById("conv-value").value) || 0;
  const from = document.getElementById("conv-from").value;
  const to = document.getElementById("conv-to").value;
  const ingredient = document.getElementById("conv-ingredient").value;
  let resultText = "";
  try {
    if (document.getElementById("mode-volume").checked) {
      const out = convertVolume(value, from, to);
      resultText = `${fmt(value)} ${from} = ${fmt(out)} ${to}`;
    } else {
      // volume <-> weight via ingredient density
      if (document.getElementById("direction-vol2g").checked) {
        const grams = volumeToGrams(value, from, ingredient);
        resultText = `${fmt(value)} ${from} of ${ingredient.replace(/_/g, " ")} ≒ ${fmt(grams)} g`;
      } else {
        const gramsInput = value;
        const vols = gramsToVolume(gramsInput, to, ingredient);
        resultText = `${fmt(gramsInput)} g of ${ingredient.replace(/_/g, " ")} ≒ ${fmt(vols)} ${to}`;
      }
    }
  } catch (err) {
    resultText = err.message;
  }
  document.getElementById("conv-result").textContent = resultText;
}

// Page-internal search to jump to headings
function doSearch(e) {
  e && e.preventDefault();
  const q = document.getElementById("anchor-search").value.trim();
  if (!q) return;
  // find header elements containing the query (case insensitive)
  const headers = Array.from(document.querySelectorAll("h2, h3"));
  const found = headers.find(h => h.textContent.toLowerCase().includes(q.toLowerCase()));
  if (found) {
    found.scrollIntoView({ behavior: "smooth", block: "start" });
    // highlight briefly
    found.classList.add("flash");
    setTimeout(() => found.classList.remove("flash"), 1600);
  } else {
    // no direct header: try anchors by id
    const id = q.replace(/\s+/g, "-").toLowerCase();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Print-friendly helper: hide interactive elements
function setupPrintButton() {
  const btn = document.getElementById("print-btn");
  btn.addEventListener("click", () => window.print());
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  buildChart();
  document.getElementById("convert-form").addEventListener("submit", handleConvertForm);
  document.getElementById("anchor-form").addEventListener("submit", doSearch);
  document.getElementById("mode-volume").addEventListener("change", () => {
    document.getElementById("vol-mode-controls").hidden = false;
    document.getElementById("wt-mode-controls").hidden = true;
  });
  document.getElementById("mode-weight").addEventListener("change", () => {
    document.getElementById("vol-mode-controls").hidden = true;
    document.getElementById("wt-mode-controls").hidden = false;
  });
  document.getElementById("direction-vol2g").addEventListener("change", handleConvertForm);
  document.getElementById("direction-g2vol").addEventListener("change", handleConvertForm);
  setupPrintButton();
  handleConvertForm();
});