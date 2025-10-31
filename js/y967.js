document.addEventListener("DOMContentLoaded", function () {
  if (document.body.dataset.toggleInit === "done") return;
  document.body.dataset.toggleInit = "done";

  const LABEL_WORKING = "作業中";
  const LABEL_DONE = "終了！";
  const LABEL_ALL_COMPLETE = "祝☆完了しました！";

  const checklist = document.querySelector(".task-list");
  const badge = document.getElementById("complete-badge");

  // 全完了判定と表示更新（ここを確実に呼ぶ）
  function refreshAllStates() {
    const btns = Array.from(document.querySelectorAll(".toggle-btn"));
    if (btns.length === 0) {
      if (badge) badge.classList.add("hidden");
      return;
    }

    const allDone = btns.every(b => b.getAttribute("aria-pressed") === "true");

    if (allDone) {
      // 全て完了なら全ボタン内表示を祝☆完了に統一し、バッジ表示
      btns.forEach(b => {
        const st = b.querySelector(".state-text");
        const sr = b.querySelector(".visually-hidden");
        if (st) st.textContent = LABEL_ALL_COMPLETE;
        if (sr) sr.textContent = LABEL_ALL_COMPLETE;
      });
      if (badge) {
        badge.classList.remove("hidden");
        badge.innerHTML = "<strong>" + LABEL_ALL_COMPLETE + "</strong>";
      }
    } else {
      // そうでなければ各ボタンの aria-pressed に従って通常ラベルを戻す
      btns.forEach(b => {
        const st = b.querySelector(".state-text");
        const sr = b.querySelector(".visually-hidden");
        const active = b.getAttribute("aria-pressed") === "true";
        const label = active ? LABEL_DONE : LABEL_WORKING;
        if (st) st.textContent = label;
        if (sr) sr.textContent = label;
      });
      if (badge) {
        badge.classList.add("hidden");
        badge.textContent = "";
      }
    }
  }

  // 各トグルボタン初期化
  document.querySelectorAll(".toggle-btn").forEach(function (btn) {
    // 不要な tabindex を除去
    if (btn.hasAttribute("tabindex")) btn.removeAttribute("tabindex");

    // state-text / visually-hidden が無ければ作る
    if (!btn.querySelector(".state-text")) {
      const stateText = document.createElement("span");
      stateText.className = "state-text";
      stateText.setAttribute("aria-hidden", "true");
      stateText.textContent = btn.getAttribute("aria-pressed") === "true" ? LABEL_DONE : LABEL_WORKING;

      const sr = document.createElement("span");
      sr.className = "visually-hidden";
      sr.textContent = stateText.textContent;

      // 既存の生テキストをクリアして差し替え
      btn.textContent = "";
      btn.appendChild(stateText);
      btn.appendChild(sr);
    }

    // 左寄せ表示（画面左方向）を意図する場合の最小スタイル設定（CSS 側でも推奨）
    const stateText = btn.querySelector(".state-text");
    if (stateText) {
      btn.style.position = btn.style.position || "relative";
      btn.style.textAlign = "left";
      stateText.style.position = "absolute";
      stateText.style.left = "8px";
      stateText.style.top = "50%";
      stateText.style.transform = "translateY(-50%)";
      stateText.style.pointerEvents = "none";
      stateText.style.whiteSpace = "nowrap";
      stateText.style.fontWeight = "700";
    }
    const srText = btn.querySelector(".visually-hidden");

    // aria-label の簡易整形（任意）
    const currentLabel = btn.getAttribute("aria-label") || "";
    const simplifiedLabel = currentLabel.replace(/の状態切替$/u, "").trim();
    if (simplifiedLabel) btn.setAttribute("aria-label", simplifiedLabel);

    // 状態更新（個別ボタンが押されたときに呼ぶ）
    function setState(isActive) {
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      // 通常は個別ラベルを更新（全体完了は refreshAllStates が上書きする）
      const label = isActive ? LABEL_DONE : LABEL_WORKING;
      if (srText) srText.textContent = label;
      if (stateText) stateText.textContent = label;
      // 全体判定を行い、必要なら表示を上書きする
      refreshAllStates();
    }

    btn.addEventListener("click", function () {
      const isActive = btn.getAttribute("aria-pressed") === "true" ? false : true;
      setState(isActive);
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        btn.click();
      }
    });

    // 初期状態を反映
    const initialPressed = btn.getAttribute("aria-pressed") === "true";
    setState(initialPressed);
  });

  // シェア・PNG機能（既存のまま）
  function openPopup(url, w = 600, h = 480) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, "_blank", `toolbar=0,status=0,width=${w},height=${h},top=${top},left=${left}`);
  }
  const pageTitle = document.title || "チェックリスト";
  const pageUrl = location.href;

  async function saveChecklistAsPNG() {
    if (!checklist) return;
    const rect = checklist.getBoundingClientRect();
    const clone = checklist.cloneNode(true);
    clone.querySelectorAll("button").forEach(b => b.style.outline = "none");

    const wrapper = document.createElement("div");
    wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    wrapper.style.boxSizing = "border-box";
    wrapper.style.width = `${Math.ceil(rect.width)}px`;
    wrapper.style.height = `${Math.ceil(rect.height)}px`;
    wrapper.style.background = getComputedStyle(document.body).background || "#ffffff";
    wrapper.appendChild(clone);

    const serialized = new XMLSerializer().serializeToString(wrapper);
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${Math.ceil(rect.width)}' height='${Math.ceil(rect.height)}'>
        <foreignObject width='100%' height='100%'>${serialized}</foreignObject>
      </svg>
    `.trim();

    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        if (!blob) {
          alert("画像の生成に失敗しました。");
          return;
        }
        const a = document.createElement("a");
        a.download = "checklist.png";
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }, "image/png");
    };

    img.onerror = function () {
      URL.revokeObjectURL(url);
      alert("画像として保存できませんでした。ブラウザの対応状況をご確認ください。");
    };

    img.src = url;
  }

  const btnPng = document.querySelector(".share-png");
  const btnX = document.querySelector(".share-x");
  const btnFb = document.querySelector(".share-fb");
  const btnLine = document.querySelector(".share-line");
  const btnMail = document.querySelector(".share-mail");

  if (btnPng) btnPng.addEventListener("click", function () { saveChecklistAsPNG(); });
  if (btnX) btnX.addEventListener("click", function () {
    const text = encodeURIComponent(`${pageTitle} ${pageUrl}`);
    openPopup(`https://twitter.com/intent/tweet?text=${text}`);
  });
  if (btnFb) btnFb.addEventListener("click", function () {
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
  });
  if (btnLine) btnLine.addEventListener("click", function () {
    const text = encodeURIComponent(`${pageTitle} ${pageUrl}`);
    openPopup(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${text}`);
  });
  if (btnMail) btnMail.addEventListener("click", function () {
    const subject = encodeURIComponent(pageTitle);
    const body = encodeURIComponent(`${pageTitle}\n${pageUrl}\n\nチェックリストを共有します。`);
    location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  // 初回判定（すべての初期状態に応じて表示を整える）
  refreshAllStates();
});