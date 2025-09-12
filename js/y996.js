// indez996.js
document.addEventListener('DOMContentLoaded', () => {
  const canvas         = document.getElementById('draw-canvas');
  const ctx            = canvas.getContext('2d');
  const colorButtons   = document.querySelectorAll('.color-btn');
  const colorPicker    = document.getElementById('color-picker');
  const penWidthSlider = document.getElementById('pen-width');
  const eraserBtn      = document.getElementById('eraser-btn');
  const undoBtn        = document.getElementById('undo-btn');
  const clearBtn       = document.getElementById('clear-btn');
  const saveBtn        = document.getElementById('save-btn');
  const widthInput     = document.getElementById('canvas-width');
  const heightInput    = document.getElementById('canvas-height');
  const timerDisplay   = document.getElementById('timer-display');
  const startBtn       = document.getElementById('start-btn');
  const timerBtns      = document.querySelectorAll('.timer-set-btn');
  const soundBtns      = document.querySelectorAll('.sound-btn');

  // 音声ファイルをあらかじめ読み込む
  const pipipiSound = new Audio('https://raw.githubusercontent.com/google/WebFundamentals/master/src/site/voice/sounds/notification.mp3');
  const piSound    = new Audio('https://raw.githubusercontent.com/google/WebFundamentals/master/src/site/voice/sounds/notification-2.mp3');
  pipipiSound.preload = 'auto';
  piSound.preload    = 'auto';
  pipipiSound.volume = 1.0;
  piSound.volume     = 1.0;
  pipipiSound.load();
  piSound.load();

  // ブラウザのオーディオロックを解除
  function unlockAudio() {
    pipipiSound.play().then(() => { pipipiSound.pause(); pipipiSound.currentTime = 0; }).catch(()=>{});
    piSound.play().then(()    => { piSound.pause();    piSound.currentTime     = 0; }).catch(()=>{});
    document.body.removeEventListener('click', unlockAudio);
  }
  document.body.addEventListener('click', unlockAudio);

  let isDrawing        = false;
  let lastX            = 0;
  let lastY            = 0;
  let history          = [];
  let isErasing        = false;
  let timerInterval;
  let totalSeconds     = 60;
  let currentSoundMode = 'pipipi';

  function initializeCanvas() {
    const savedDrawing = localStorage.getItem('savedDrawing');
    const savedW       = localStorage.getItem('canvasWidth')  || '500';
    const savedH       = localStorage.getItem('canvasHeight') || '400';
    widthInput.value   = savedW;
    heightInput.value  = savedH;
    canvas.width       = savedW;
    canvas.height      = savedH;
    ctx.fillStyle      = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveState();
      };
      img.src = savedDrawing;
    }
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    }
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoords(e);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const [x, y] = getCoords(e);
    ctx.lineCap               = 'round';
    ctx.lineJoin              = 'round';
    ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    saveState();
    saveToLocalStorage();
  }

  function saveState() {
    if (history.length > 20) history.shift();
    history.push(canvas.toDataURL());
  }

  function undo() {
    if (history.length > 1) {
      history.pop();
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveToLocalStorage();
      };
      img.src = history[history.length - 1];
    }
  }

  function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    history = [];
    saveState();
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    localStorage.setItem('savedDrawing', canvas.toDataURL());
    localStorage.setItem('canvasWidth',  canvas.width);
    localStorage.setItem('canvasHeight', canvas.height);
  }

  function resizeCanvas() {
    const snapshot = canvas.toDataURL();
    canvas.width   = widthInput.value  || 500;
    canvas.height  = heightInput.value || 400;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      saveState();
      saveToLocalStorage();
    };
    img.src = snapshot;
  }

  function updateTimerDisplay() {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
  }

  function startTimer() {
    clearInterval(timerInterval);
    if (totalSeconds <= 0) return;
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay();
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        handleTimerEnd();
      }
    }, 1000);
  }

  function handleTimerEnd() {
    switch (currentSoundMode) {
      case 'pipipi':
        pipipiSound.currentTime = 0;
        pipipiSound.play().catch(err => console.error('Audio再生エラー:', err));
        break;
      case 'pi':
        piSound.currentTime = 0;
        piSound.play().catch(err => console.error('Audio再生エラー:', err));
        break;
      case 'flash':
        document.body.classList.add('flash');
        setTimeout(() => document.body.classList.remove('flash'), 1000);
        break;
    }
  }

  // イベントバインド
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw,      { passive: false });
  canvas.addEventListener('touchend',  stopDrawing);

  widthInput.addEventListener('change', resizeCanvas);
  heightInput.addEventListener('change', resizeCanvas);

  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      isErasing        = false;
      ctx.strokeStyle  = btn.dataset.color;
      colorPicker.value = btn.dataset.color;
    });
  });

  colorPicker.addEventListener('input', e => {
    isErasing       = false;
    ctx.strokeStyle = e.target.value;
  });

  penWidthSlider.addEventListener('input', e => ctx.lineWidth = e.target.value);
  eraserBtn.addEventListener('click', () => isErasing = true);
  undoBtn.addEventListener('click', undo);
  clearBtn.addEventListener('click', clearCanvas);

  saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  });

  timerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(timerInterval);
      totalSeconds = parseInt(btn.dataset.time) * 60;
      updateTimerDisplay();
    });
  });

  startBtn.addEventListener('click', startTimer);

  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSoundMode = btn.dataset.mode;
      soundBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 初期化
  initializeCanvas();
  ctx.lineWidth = penWidthSlider.value;
  ctx.strokeStyle = colorPicker.value;
  soundBtns[0].classList.add('active');
  updateTimerDisplay();
});