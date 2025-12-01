document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  const startBtn = document.getElementById('startBtn');
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const volumeSlider = document.getElementById('volume');
  const resultOverlay = document.getElementById('resultOverlay');
  const resultScore = document.getElementById('resultScore');
  const shareX = document.getElementById('shareX');
  const shareFB = document.getElementById('shareFB');
  const shareLINE = document.getElementById('shareLINE');
  const shareMail = document.getElementById('shareMail');
  const shareNative = document.getElementById('shareNative');

  let spawnIntervalId = null, spawnRate = 1000, gameTimerId = null;
  let remaining = 60, score = 0, running = false, globalVolume = 0.6;

  // Audio Context for synthetic explosion sound
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // 新しい爆発音（ユーザー提供の実装を globalVolume に合わせて調整）
  function playExplosion(volume = 1) {
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);

    // globalVolume を反映
    gainNode.gain.setValueAtTime(volume * globalVolume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    // クリーンアップ（安全のためタイムアウトで切断）
    setTimeout(() => {
      try { osc.disconnect(); gainNode.disconnect(); } catch (e) {}
    }, 700);
  }

  function spawnHima() {
    if (!running) return;
    const hima = document.createElement('span');
    hima.className = 'hima';
    hima.textContent = '暇';
    const size = 28 + Math.floor(Math.random() * 36);
    hima.style.fontSize = size + 'px';
    const rect = stage.getBoundingClientRect();
    const padding = 8;
    const x = Math.random() * Math.max(0, rect.width - size - padding * 2) + padding;
    const y = Math.random() * Math.max(0, rect.height - size - padding * 2) + padding;
    hima.style.left = x + 'px';
    hima.style.top = y + 'px';
    hima.style.transform = `rotate(${(Math.random()-0.5)*30}deg) scale(0.95)`;
    stage.appendChild(hima);
    requestAnimationFrame(()=>{ hima.style.opacity='1'; hima.style.transform = hima.style.transform.replace('scale(0.95)','scale(1)'); });

    const onPop = (e) => {
      e.stopPropagation();
      hima.removeEventListener('click', onPop);
      hima.removeEventListener('touchstart', onPop);
      // ここで新しい爆発音を再生
      playExplosion(1.0);
      hima.classList.add('explode');
      score += 10;
      scoreEl.textContent = score;
      setTimeout(()=>{ if (hima.parentNode) hima.parentNode.removeChild(hima); }, 350);
    };
    hima.addEventListener('click', onPop);
    hima.addEventListener('touchstart', onPop, {passive:true});
    setTimeout(()=>{ if (hima.parentNode){ hima.classList.add('fadeout'); setTimeout(()=>{ if (hima.parentNode) hima.parentNode.removeChild(hima); },400); } }, 6000);
  }

  function startSpawning(){ stopSpawning(); spawnIntervalId = setInterval(()=>{ if (remaining<=30){ const factor = Math.ceil((31-remaining)/6)+1; for(let i=0;i<factor;i++) spawnHima(); } else spawnHima(); }, spawnRate); }
  function stopSpawning(){ if(spawnIntervalId){ clearInterval(spawnIntervalId); spawnIntervalId=null; } }

  function startGame(){
    if(running) return;
    running=true; score=0; remaining=60; scoreEl.textContent=score; timerEl.textContent=remaining;
    resultOverlay.classList.remove('visible');
    if(audioCtx && audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
    startSpawning();
    gameTimerId = setInterval(()=>{
      remaining--; timerEl.textContent = remaining;
      if(remaining===30){ stopSpawning(); spawnRate = Math.max(200, spawnRate*0.6); startSpawning(); }
      if(remaining<=0) endGame();
    },1000);
  }

  function endGame(){
    running=false; stopSpawning();
    if(gameTimerId){ clearInterval(gameTimerId); gameTimerId=null; }
    document.querySelectorAll('.hima').forEach(el=>{ el.classList.add('fadeout'); setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); },300); });
    resultScore.textContent = score;
    resultOverlay.classList.add('visible');
    const shareText = encodeURIComponent(`暇つぶしブラウザゲームで${score}点を獲得しました！`);
    const pageUrl = encodeURIComponent(location.href);
    shareX.href = `https://x.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
    shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareText}`;
    shareLINE.href = `https://social-plugins.line.me/lineit/share?url=${pageUrl}&text=${shareText}`;
    shareMail.href = `mailto:?subject=${encodeURIComponent('暇つぶしブラウザゲームのスコア')}&body=${shareText}%0A${pageUrl}`;
  }

  function setVolume(v){ globalVolume = Math.max(0, Math.min(1, v)); }

  async function nativeShare(){
    const shareText = `暇つぶしブラウザゲームで${score}点を獲得しました！ ${location.href}`;
    if(navigator.share){ try{ await navigator.share({ title:'暇つぶしブラウザゲーム', text:shareText, url:location.href }); }catch(e){} }
    else window.open(`mailto:?subject=${encodeURIComponent('暇つぶしブラウザゲームのスコア')}&body=${encodeURIComponent(shareText)}`, '_blank');
  }

  startBtn.addEventListener('click', ()=>{
    if(!running){ startGame(); startBtn.textContent='スタート'; startBtn.classList.add('playing'); }
    else { endGame(); startBtn.textContent='スタート'; startBtn.classList.remove('playing'); }
  });
  volumeSlider.addEventListener('input', (e)=> setVolume(e.target.valueAsNumber));
  shareNative.addEventListener('click', (e)=>{ e.preventDefault(); nativeShare(); });

  document.addEventListener('keydown', (e)=>{ if(e.code==='Space' && running){ const himas = document.querySelectorAll('.hima'); if(himas.length){ const el = himas[Math.floor(Math.random()*himas.length)]; el.click(); } } });

  function adjustStageHeight(){ const vh = window.innerHeight; if(window.matchMedia('(orientation: landscape)').matches){ stage.style.height = Math.max(220, Math.floor(vh*0.55)) + 'px'; } else { stage.style.height = Math.max(220, Math.floor(vh*0.45)) + 'px'; } }
  window.addEventListener('resize', adjustStageHeight);
  adjustStageHeight();
  setVolume(Number(volumeSlider.value));
});