// /js/y996.js
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

  // Sounds (preload)
  const pipipiSound = new Audio('https://raw.githubusercontent.com/google/WebFundamentals/master/src/site/voice/sounds/notification.mp3');
  const piSound     = new Audio('https://raw.githubusercontent.com/google/WebFundamentals/master/src/site/voice/sounds/notification-2.mp3');
  pipipiSound.preload = 'auto';
  piSound.preload     = 'auto';
  pipipiSound.volume  = 1.0;
  piSound.volume      = 1.0;
  pipipiSound.load();
  piSound.load();

  // Unlock audio on first user interaction (click or touch)
  function unlockAudio() {
    pipipiSound.play().then(() => { pipipiSound.pause(); pipipiSound.currentTime = 0; }).catch(()=>{});
    piSound.play().then(()    => { piSound.pause();    piSound.currentTime     = 0; }).catch(()=>{});
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);
  }
  document.body.addEventListener('click', unlockAudio);
  document.body.addEventListener('touchstart', unlockAudio, { once: true });

  let isDrawing        = false;
  let lastX            = 0;
  let lastY            = 0;
  const MAX_HISTORY    = 20;
  let history          = [];
  let isErasing        = false;
  let timerInterval;
  let totalSeconds     = 60;
  // default sound mode
  let currentSoundMode = 'pipipi';

  // Ensure canvas has CSS pixel size for responsiveness and proper drawing scale
  function setCanvasDisplaySize() {
    // Keep logical canvas pixel size from inputs, but make it scale responsively on screen
    const cssMaxWidth = Math.min(window.innerWidth - 20, 1000);
    canvas.style.maxWidth = cssMaxWidth + 'px';
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.display = 'block';
  }

  function initializeCanvas() {
    const savedDrawing = localStorage.getItem('savedDrawing');
    const savedW       = parseInt(localStorage.getItem('canvasWidth'))  || 500;
    const savedH       = parseInt(localStorage.getItem('canvasHeight')) || 400;
    widthInput.value   = savedW;
    heightInput.value  = savedH;
    canvas.width       = savedW;
    canvas.height      = savedH;
    // fill white background to avoid transparency after resize or on fresh load
    ctx.fillStyle      = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveState();
        saveToLocalStorage();
      };
      img.src = savedDrawing;
    }
    setCanvasDisplaySize();
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    }
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  function startDrawing(e) {
    // Only start drawing when pointer/touch is on canvas
    isDrawing = true;
    [lastX, lastY] = getCoords(e);
    // ensure current stroke settings applied
    ctx.lineWidth = parseFloat(penWidthSlider.value) || 1;
    ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : colorPicker.value || '#000';
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const [x, y] = getCoords(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isErasing ? parseFloat(penWidthSlider.value) * 2 : parseFloat(penWidthSlider.value);
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
    if (history.length >= MAX_HISTORY) history.shift();
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
    // snapshot current drawing, set new size, clear to white then redraw snapshot
    const snapshot = canvas.toDataURL();
    const newW = parseInt(widthInput.value) || 500;
    const newH = parseInt(heightInput.value) || 400;
    canvas.width  = newW;
    canvas.height = newH;
    // fill white background first
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      saveState();
      saveToLocalStorage();
      setCanvasDisplaySize();
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
    if (totalSeconds <= 0) {
      handleTimerEnd();
      return;
    }
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
    // visual flash
    document.body.classList.add('flash');
    setTimeout(() => document.body.classList.remove('flash'), 1000);
    // play selected sound mode
    if (currentSoundMode === 'pipipi') {
      pipipiSound.currentTime = 0;
      pipipiSound.play().catch(()=>{});
    } else if (currentSoundMode === 'pi') {
      piSound.currentTime = 0;
      piSound.play().catch(()=>{});
    } else if (currentSoundMode === 'flash') {
      // no sound, only flash
    }
  }

  // Canvas pointer / touch handling
  // Use pointer events if supported for simpler cross-device handling
  if (window.PointerEvent) {
    canvas.addEventListener('pointerdown', e => { if (e.isPrimary) startDrawing(e); }, { passive: false });
    canvas.addEventListener('pointermove',  e => { if (e.isPrimary) draw(e); }, { passive: false });
    canvas.addEventListener('pointerup',    e => { if (e.isPrimary) stopDrawing(); });
    canvas.addEventListener('pointercancel', e => { if (e.isPrimary) stopDrawing(); });
    canvas.addEventListener('pointerout',    e => { if (e.isPrimary) stopDrawing(); });
  } else {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw,      { passive: false });
    canvas.addEventListener('touchend',  stopDrawing);
  }

  widthInput.addEventListener('change', resizeCanvas);
  heightInput.addEventListener('change', resizeCanvas);

  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      isErasing         = false;
      const color = btn.dataset.color;
      ctx.strokeStyle   = color;
      colorPicker.value = color;
    });
  });

  colorPicker.addEventListener('input', e => {
    isErasing       = false;
    ctx.strokeStyle = e.target.value;
  });

  penWidthSlider.addEventListener('input', e => ctx.lineWidth = e.target.value);
  eraserBtn.addEventListener('click', () => {
    isErasing = true;
  });
  undoBtn.addEventListener('click', undo);
  clearBtn.addEventListener('click', clearCanvas);

  saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href     = canvas.toDataURL('image/png');
    // for browsers that require the link to be in the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  timerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(timerInterval);
      totalSeconds = parseInt(btn.dataset.time, 10) * 60;
      updateTimerDisplay();
    });
  });

  startBtn.addEventListener('click', startTimer);

  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSoundMode = btn.dataset.mode || 'pipipi';
      soundBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // handle window resize to adjust CSS sizing of canvas area
  window.addEventListener('resize', setCanvasDisplaySize);

  // initialize
  initializeCanvas();
  ctx.lineWidth     = penWidthSlider.value;
  ctx.strokeStyle   = colorPicker.value;
  // select default sound button if present
  const firstSound = Array.from(soundBtns).find(b => b.dataset.mode === currentSoundMode);
  if (firstSound) firstSound.classList.add('active');
  updateTimerDisplay();
});