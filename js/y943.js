// シンプルな顔合成ミニゲーム用スクリプト
// 想定: index.html から読み込む (同ディレクトリに script.js と style.css を置く)

const fileInput = document.getElementById('photoInput');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const templateSelect = document.getElementById('templateSelect');
const themeLabel = document.getElementById('themeLabel');
const shareBtn = document.getElementById('shareBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const textInput = document.getElementById('textInput');
const applyTextBtn = document.getElementById('applyTextBtn');
const preview = document.getElementById('preview');

let img = new Image();
let currentImageLoaded = false;
let canvasW = 720;
let canvasH = 960;

// 日替わりテーマ（簡易）
const themes = [
  { name: 'レトロフィルム', overlay: 'film' },
  { name: '動物チャレンジ', overlay: 'animal' },
  { name: '王冠プリンス', overlay: 'crown' },
  { name: 'コミックポップ', overlay: 'comic' },
  { name: '未来サイバー', overlay: 'cyber' },
  { name: 'モノクロ名作', overlay: 'mono' },
  { name: '夏祭り', overlay: 'festival' }
];

function getDailyTheme() {
  const d = new Date();
  return themes[d.getDate() % themes.length];
}

function setThemeLabel() {
  const t = getDailyTheme();
  themeLabel.textContent = `今日のテーマ: ${t.name}`;
  // デフォルトテンプレを日替わりに合わせる
  const idx = Math.max(0, templateSelect.querySelectorAll('option').length - 1);
  // try to select matching overlay if exists
  for (let i = 0; i < templateSelect.options.length; i++) {
    if (templateSelect.options[i].value === t.overlay) {
      templateSelect.selectedIndex = i;
      break;
    }
  }
}

function resetCanvas() {
  canvas.width = canvasW;
  canvas.height = canvasH;
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  currentImageLoaded = false;
  preview.src = '';
}

function fitImageToCanvas(image) {
  const cw = canvas.width, ch = canvas.height;
  const iw = image.width, ih = image.height;
  const scale = Math.max(cw / iw, ch / ih);
  const nw = iw * scale, nh = ih * scale;
  const dx = (cw - nw) / 2, dy = (ch - nh) / 2;
  return { dx, dy, nw, nh };
}

function drawBaseImage() {
  if (!currentImageLoaded) {
    // placeholder
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    ctx.font = '20px sans-serif';
    ctx.fillText('写真をアップロードして合成しよう', 20, 40);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const f = fitImageToCanvas(img);
  ctx.drawImage(img, f.dx, f.dy, f.nw, f.nh);
}

function applyTemplate(name) {
  drawBaseImage();
  const f = fitImageToCanvas(img);
  // テンプレごとの合成処理
  switch (name) {
    case 'animal':
      drawAnimalEars(f);
      drawWhiskers(f);
      applyFilter('saturate(1.1) contrast(1.05)');
      break;
    case 'crown':
      drawCrown(f);
      applyFilter('brightness(1.05) sepia(0.15)');
      break;
    case 'film':
      drawFilmFrame();
      applyFilmGrain();
      break;
    case 'comic':
      drawComicHalftone(f);
      drawSpeechBubble('Wow!');
      break;
    case 'cyber':
      drawCyberGlitch();
      applyFilter('hue-rotate(200deg) contrast(1.2)');
      break;
    case 'mono':
      applyFilter('grayscale(1) contrast(1.1)');
      drawVintageBorder();
      break;
    default:
      break;
  }
  // もしテキストが入力されていれば描画
  const txt = textInput.value.trim();
  if (txt) drawBottomText(txt);
  updatePreview();
}

function applyFilter(filterStr) {
  // 簡易: canvasを一時保存してフィルタをかける方法
  const tmp = document.createElement('canvas');
  tmp.width = canvas.width; tmp.height = canvas.height;
  const tctx = tmp.getContext('2d');
  tctx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = filterStr;
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = 'none';
}

function drawAnimalEars(f) {
  // 耳を左右に描く（シンプルな三角）
  ctx.save();
  ctx.translate(0, 0);
  ctx.fillStyle = '#ffcc99';
  const earW = f.nw * 0.25, earH = f.nh * 0.22;
  // 左
  ctx.beginPath();
  ctx.ellipse(f.dx + f.nw * 0.18, f.dy + f.nh * 0.08, earW, earH, -0.6, 0, Math.PI * 2);
  ctx.fill();
  // 右
  ctx.beginPath();
  ctx.ellipse(f.dx + f.nw * 0.82, f.dy + f.nh * 0.08, earW, earH, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWhiskers(f) {
  ctx.save();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  const cx = f.dx + f.nw / 2, cy = f.dy + f.nh * 0.6;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + i * 10);
    ctx.quadraticCurveTo(cx - 120, cy + i * 12, cx - 200, cy + i * 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy + i * 10);
    ctx.quadraticCurveTo(cx + 120, cy + i * 12, cx + 200, cy + i * 10);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCrown(f) {
  ctx.save();
  const crownW = f.nw * 0.6;
  const x = (canvas.width - crownW) / 2;
  const y = f.dy - f.nh * 0.12;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.lineTo(x + crownW * 0.15, y);
  ctx.lineTo(x + crownW * 0.3, y + 40);
  ctx.lineTo(x + crownW * 0.45, y);
  ctx.lineTo(x + crownW * 0.6, y + 40);
  ctx.lineTo(x + crownW * 0.75, y);
  ctx.lineTo(x + crownW, y + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff8c00';
  ctx.fillRect(x, y + 40, crownW, 20);
  ctx.restore();
}

function drawFilmFrame() {
  ctx.save();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  // パンチ穴
  ctx.fillStyle = '#000';
  const holeSize = 12;
  for (let y = 40; y < canvas.height - 40; y += 40) {
    ctx.fillRect(30, y, holeSize, holeSize);
    ctx.fillRect(canvas.width - 30 - holeSize, y, holeSize, holeSize);
  }
  ctx.restore();
}

function applyFilmGrain() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() - 0.5) * 30;
    d[i] = d[i] + v;
    d[i + 1] = d[i + 1] + v;
    d[i + 2] = d[i + 2] + v;
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawComicHalftone(f) {
  // 簡易ハーフトーン: 半透明のドットをグリッドで描く
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = '#fff';
  const step = 12;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const size = Math.random() * (step / 2);
      ctx.beginPath();
      ctx.arc(x + step / 2, y + step / 2, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawSpeechBubble(text) {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  const w = 220, h = 80;
  const x = canvas.width - w - 30, y = 30;
  roundRect(ctx, x, y, w, h, 16, true, true);
  ctx.fillStyle = '#000';
  ctx.font = '24px sans-serif';
  ctx.fillText(text, x + 20, y + 48);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (r === undefined) r = 5;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function drawCyberGlitch() {
  // 簡易グリッチ: 横スライスをずらす
  const slices = 8;
  const h = canvas.height / slices;
  const tmp = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < slices; i++) {
    const sx = 0, sy = i * h, sw = canvas.width, sh = h;
    const dx = (Math.random() - 0.5) * 40;
    ctx.putImageData(tmp, dx, 0, sx, sy, sw, sh);
  }
}

function drawVintageBorder() {
  ctx.save();
  ctx.strokeStyle = '#b08b57';
  ctx.lineWidth = 18;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.restore();
}

function drawBottomText(text) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
  ctx.fillStyle = '#fff';
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height - 36);
  ctx.restore();
}

function updatePreview() {
  preview.src = canvas.toDataURL('image/png');
}

fileInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  img = new Image();
  img.onload = () => {
    currentImageLoaded = true;
    // canvasサイズは固定比率だが必要なら調整
    resetCanvas();
    drawBaseImage();
    applyTemplate(templateSelect.value);
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

templateSelect.addEventListener('change', () => {
  if (!currentImageLoaded) {
    // still show theme change
    setThemeLabel();
    return;
  }
  applyTemplate(templateSelect.value);
});

applyTextBtn.addEventListener('click', () => {
  if (!currentImageLoaded) return;
  applyTemplate(templateSelect.value);
});

resetBtn.addEventListener('click', () => {
  resetCanvas();
  setThemeLabel();
});

downloadBtn.addEventListener('click', async () => {
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mashup_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

shareBtn.addEventListener('click', async () => {
  if (navigator.share && currentImageLoaded) {
    canvas.toBlob(async (blob) => {
      const filesArray = [new File([blob], 'mashup.png', { type: 'image/png' })];
      try {
        await navigator.share({
          files: filesArray,
          title: '合成写真',
          text: '作ったよ！'
        });
      } catch (err) {
        console.log('share canceled or failed', err);
      }
    }, 'image/png');
  } else {
    // フォールバック: プレビューを開く
    updatePreview();
    preview.scrollIntoView({ behavior: 'smooth' });
  }
});

// 初期化
resetCanvas();
setThemeLabel();
applyTemplate(templateSelect.value);