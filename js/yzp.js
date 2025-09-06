// game.js

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const digitalTimer    = document.getElementById('digital-timer');
  const statusDisplay   = document.getElementById('status');
  const canvas          = document.getElementById('analog-clock');
  const ctx             = canvas.getContext('2d');
  const soundBtns       = document.querySelectorAll('.sound-btn');
  const durationBtns    = document.querySelectorAll('.duration-btn');
  const startBtn        = document.getElementById('start');
  const resetBtn        = document.getElementById('reset');
  const volumeSlider    = document.getElementById('volume-slider');

  // State
  let studyDuration   = 0,
      breakDuration   = 0;
  let isStudy         = true,
      remaining       = 0,
      running         = false;
  let blinkEnabled    = false,
      soundType       = 'none';
  let timerInterval   = null,
      blinkTimeouts   = [];

  // Audio Setup
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx  = new AudioCtx();
  const gainNode  = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 0.5;

  // iOS Safari Unlock Trick
  function unlockAudio() {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      // play a tiny silent buffer to actually unlock audio
      const buf = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      src.start(0);
    }
  }

  // Helpers
  function formatTime(sec) {
    const hh = String(Math.floor(sec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return { hh, mm, ss };
  }

  function renderDigital(sec) {
    const { hh, mm, ss } = formatTime(sec);
    digitalTimer.innerHTML = `
      <span class="digit">${hh}</span>:
      <span class="digit">${mm}</span>:
      <span class="digit">${ss}</span>`;
  }

  function drawClock() {
    const now = new Date();
    const w   = canvas.width,
          h   = canvas.height,
          r   = (w / 2) * 0.9;

    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);

    // face
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fillStyle   = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth   = r * 0.05;
    ctx.stroke();

    // marks
    for (let i = 0; i < 60; i++) {
      ctx.rotate(Math.PI / 30);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(r - (i % 5 ? r * 0.05 : r * 0.12), 0);
      ctx.strokeStyle = '#000';
      ctx.lineWidth   = i % 5 ? 1.5 : 3;
      ctx.stroke();
    }

    // hands
    const sec = now.getSeconds(),
          min = now.getMinutes(),
          hr  = now.getHours() % 12;

    drawHand((hr + min / 60) * 5, r * 0.5, r * 0.07);
    drawHand(min,              r * 0.75, r * 0.07);
    drawHand(sec,              r * 0.85, r * 0.02, 'red');

    ctx.resetTransform();
  }

  function drawHand(pos, length, width, color = '#000') {
    ctx.beginPath();
    ctx.rotate((Math.PI / 30) * pos);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = color;
    ctx.lineWidth   = width;
    ctx.stroke();
    ctx.rotate(-(Math.PI / 30) * pos);
  }

  function playElectronic() {
    unlockAudio();
    const pattern = [0.1, 0.1, 0.1, 0.1, 0.1];
    let t = audioCtx.currentTime;
    pattern.forEach(dur => {
      const osc = audioCtx.createOscillator();
      osc.type       = 'square';
      osc.frequency.value = 880;
      osc.connect(gainNode);
      osc.start(t);
      osc.stop(t + dur);
      t += dur + 0.05;
    });
  }

  function playTriangle() {
    unlockAudio();
    const osc = audioCtx.createOscillator();
    osc.type           = 'triangle';
    osc.frequency.value = 1760;
    osc.connect(gainNode);
    osc.start();
    osc.stop(audioCtx.currentTime + 5);
  }

  function triggerAlert() {
    if (soundType === 'electronic') playElectronic();
    if (soundType === 'triangle')   playTriangle();
    if (blinkEnabled)               startBlink();
  }

  function startBlink() {
    let on = false;
    for (let i = 0; i < 7; i++) {
      blinkTimeouts.push(
        setTimeout(() => {
          document.body.style.filter = on ? 'invert(1)' : 'none';
          on = !on;
        }, i * 1000)
      );
    }
    blinkTimeouts.push(
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 7 * 1000)
    );
  }

  function tick() {
    if (remaining > 0) {
      remaining--;
      renderDigital(remaining);
    } else {
      triggerAlert();
      isStudy = !isStudy;
      statusDisplay.textContent = isStudy ? '勉強中' : '休憩中';
      remaining = isStudy ? studyDuration : breakDuration;
      renderDigital(remaining);
    }
  }

  function startTimer() {
    if (running || !studyDuration || !breakDuration) return;
    unlockAudio();
    running       = true;
    isStudy       = true;
    remaining     = studyDuration;
    statusDisplay.textContent = '勉強中';
    renderDigital(remaining);
    timerInterval = setInterval(tick, 1000);
  }

  function resetAll() {
    clearInterval(timerInterval);
    blinkTimeouts.forEach(t => clearTimeout(t));
    document.body.style.filter = 'none';
    running       = false;
    isStudy       = true;
    remaining     = 0;
    studyDuration = 0;
    breakDuration = 0;
    soundType     = 'none';
    blinkEnabled  = false;
    statusDisplay.textContent = '';
    digitalTimer.innerHTML = `
      <span class="digit">00</span>:
      <span class="digit">00</span>:
      <span class="digit">00</span>`;
    soundBtns.forEach(b => b.classList.remove('active'));
    durationBtns.forEach(b => b.classList.remove('active'));
  }

  // Events
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unlockAudio();
      soundBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.sound;
      soundType  = type === 'none' ? 'none' : type;
      blinkEnabled = btn.dataset.blink === 'true';
    });
  });

  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studyDuration = parseInt(btn.dataset.study, 10)
                      * (btn.dataset.unit === 'min' ? 60 : 1);
      breakDuration = parseInt(btn.dataset.rest, 10)
                      * (btn.dataset.restUnit === 'min' ? 60 : 1);
    });
  });

  startBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetAll);

  volumeSlider.addEventListener('input', e => {
    gainNode.gain.value = e.target.value;
  });

  // Initialize display & clock
  renderDigital(0);
  drawClock();
  setInterval(drawClock, 1000);
});