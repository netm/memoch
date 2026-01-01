/* app.js - 全文 */
document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const modeButtons = document.querySelectorAll('.mode-btn');
  const shareButtons = document.querySelectorAll('.share-btn');
  const nativeShareBtn = document.getElementById('nativeShare');
  const emailShareBtn = document.getElementById('emailShare');
  const board = document.getElementById('cardBoard');
  const infoBox = document.getElementById('infoBox');
  const messageBox = document.getElementById('messageBox');
  const startBtn = document.getElementById('startGame');
  const playersList = document.getElementById('playersList');
  const scoreBoard = document.getElementById('scoreBoard');
  const rulesText = document.getElementById('rulesText');

  // --- Game state ---
  let players = []; // {name, isCOM, score}
  let currentPlayer = 0;
  let totalRounds = 3;
  let round = 1;
  let flips = [];
  let positions = []; // numbers in positions 0..5
  let maxPlayers = 6;
  let gameActive = false;
  let totalTurnsTaken = 0;
  let totalTurnsNeeded = 0;

  // Allowed winning pairs (unordered)
  const winningPairs = [
    [1,5],
    [1,6],
    [2,3],
    [2,4]
  ];

  // --- Helpers ---
  function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function resetBoard(){
    board.innerHTML = '';
    positions = shuffleArray([1,2,3,4,5,6].slice());
    for(let i=0;i<6;i++){
      const card = document.createElement('button');
      card.className = 'card';
      card.setAttribute('data-index', i);
      card.setAttribute('aria-label', `カード ${i+1}`);
      card.innerHTML = `<span class="card-back">?</span><span class="card-front">${positions[i]}</span>`;
      card.addEventListener('click', onCardClick);
      board.appendChild(card);
    }
  }

  function updatePlayersUI(){
    playersList.innerHTML = '';
    scoreBoard.innerHTML = '';
    players.forEach((p, idx) => {
      const li = document.createElement('li');
      li.className = 'player-item';
      li.innerHTML = `<strong>${escapeHtml(p.name)}</strong> ${p.isCOM?'<em>(COM)</em>':''}`;
      playersList.appendChild(li);

      const scoreLi = document.createElement('li');
      scoreLi.className = 'score-item';
      scoreLi.innerHTML = `<span class="player-name">${escapeHtml(p.name)}</span> <span class="player-score">⭐ ${p.score}</span>`;
      scoreBoard.appendChild(scoreLi);
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function onCardClick(e){
    if(!gameActive) return;
    const btn = e.currentTarget;
    const idx = Number(btn.getAttribute('data-index'));
    if(flips.includes(idx)) return; // already flipped this turn
    // reveal
    btn.classList.add('flipped');
    flips.push(idx);
    if(flips.length === 2){
      // evaluate after short delay for UX
      setTimeout(() => evaluatePair(flips[0], flips[1]), 600);
    }
  }

  function evaluatePair(i1, i2){
    const n1 = positions[i1];
    const n2 = positions[i2];
    const pair = [n1,n2].sort((a,b)=>a-b);
    const matched = winningPairs.some(w => w[0]===pair[0] && w[1]===pair[1]);
    if(matched){
      players[currentPlayer].score += 1;
      showMessage('星を獲得☆', 'success');
    } else {
      showMessage('残念…星は獲得できません', 'info');
    }
    updatePlayersUI();
    // prepare next turn
    flips = [];
    // hide all cards (flip back) and reshuffle positions
    setTimeout(() => {
      const cards = document.querySelectorAll('.card');
      cards.forEach(c => c.classList.remove('flipped'));
      shufflePositions();
      // advance player
      advanceTurn();
    }, 800);
  }

  function shufflePositions(){
    positions = shuffleArray(positions);
    const fronts = document.querySelectorAll('.card-front');
    fronts.forEach((f, idx) => f.textContent = positions[idx]);
  }

  function advanceTurn(){
    totalTurnsTaken++;
    // check if round finished (each player had a turn)
    currentPlayer++;
    if(currentPlayer >= players.length){
      currentPlayer = 0;
      round++;
    }
    if(round > totalRounds){
      endGame();
      return;
    }
    showMessage(`ターン ${round} - ${players[currentPlayer].name} の番`, 'turn');
    // if COM, simulate
    if(players[currentPlayer].isCOM){
      setTimeout(() => comPlay(), 700);
    }
  }

  function comPlay(){
    // simple random flip of two different cards
    const available = [0,1,2,3,4,5];
    shuffleArray(available);
    const i1 = available[0];
    const i2 = available[1];
    const card1 = document.querySelector(`.card[data-index="${i1}"]`);
    const card2 = document.querySelector(`.card[data-index="${i2}"]`);
    card1.classList.add('flipped');
    card2.classList.add('flipped');
    flips = [i1,i2];
    setTimeout(() => evaluatePair(i1,i2), 700);
  }

  function endGame(){
    gameActive = false;
    // determine winner(s)
    const maxScore = Math.max(...players.map(p=>p.score));
    const winners = players.filter(p=>p.score===maxScore);
    if(winners.length === 1){
      const winner = winners[0];
      const label = winner.isCOM ? `P（COM）の勝利☆☆` : `${escapeHtml(winner.name)} の勝利☆☆`;
      showMessage(label, 'win', true);
    } else {
      showMessage('ひきわけ　再チャレンジ', 'draw', true);
    }
  }

  function showMessage(text, type='info', persistent=false){
    messageBox.innerHTML = `<div class="msg ${type}">${text}</div>`;
    if(!persistent){
      setTimeout(()=> {
        if(messageBox) messageBox.innerHTML = '';
      }, 1800);
    }
  }

  // --- Mode selection and start ---
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = Number(btn.getAttribute('data-players'));
      preparePlayers(val);
    });
  });

  function preparePlayers(n){
    players = [];
    for(let i=0;i<n;i++){
      const isCOM = (i>0 && i===n-1 && n===1) ? true : false; // not used
      players.push({name: `P${i+1}`, isCOM: false, score:0});
    }
    // If single player mode, add COM as opponent
    if(n === 1){
      players = [{name:'P1', isCOM:false, score:0}, {name:'COM', isCOM:true, score:0}];
    } else {
      // allow COM as Pn if user wants? Keep all human except if user chooses COM via UI (not implemented)
      // For convenience, if user selected 2 and wants COM, they can choose 1人 vs COM mode
    }
    currentPlayer = 0;
    round = 1;
    totalTurnsTaken = 0;
    totalTurnsNeeded = players.length * totalRounds;
    updatePlayersUI();
    resetBoard();
    showMessage('準備完了。スタートを押してください', 'info');
  }

  startBtn.addEventListener('click', () => {
    if(players.length === 0){
      preparePlayers(1);
    }
    // reset scores
    players.forEach(p => p.score = 0);
    currentPlayer = 0;
    round = 1;
    totalTurnsTaken = 0;
    totalTurnsNeeded = players.length * totalRounds;
    gameActive = true;
    resetBoard();
    updatePlayersUI();
    showMessage(`ゲーム開始！ターン ${round} - ${players[currentPlayer].name} の番`, 'turn');
    if(players[currentPlayer].isCOM){
      setTimeout(() => comPlay(), 700);
    }
  });

  // --- Share buttons ---
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.getAttribute('data-share');
      const url = location.href;
      const title = document.title;
      if(type === 'x'){
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
      } else if(type === 'facebook'){
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      } else if(type === 'instagram'){
        // Instagram doesn't support direct share via web; open profile or show message
        alert('Instagramではブラウザからの直接シェアはサポートされていません。画像を保存して投稿してください。');
      } else if(type === 'line'){
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank');
      }
    });
  });

  nativeShareBtn.addEventListener('click', async () => {
    if(navigator.share){
      try{
        await navigator.share({title: document.title, text: '6エンジェルナンバー 複数人ブラウザゲーム', url: location.href});
      }catch(e){}
    } else {
      alert('このブラウザはネイティブシェアに対応していません。');
    }
  });

  emailShareBtn.addEventListener('click', () => {
    const subject = encodeURIComponent('6エンジェルナンバー 複数人ブラウザゲーム');
    const body = encodeURIComponent(`このゲームを遊んでみてください： ${location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });

  // --- Initialize default UI ---
  // default select 1人 vs COM
  document.querySelector('.mode-btn[data-players="1"]').classList.add('active');
  preparePlayers(1);

  // --- Rules text fill ---
  rulesText.innerHTML = `
    <p>・カードを2枚めくり【足して6】【かけて6】になれば星を獲得☆</p>
    <p>・具体的には、1と5（1＋5）、1と6（1×6）、2と3（2×3）、2と4（2＋4）、の組み合わせ☆</p>
    <p>・3ターン終了時に星の数が多い人が勝利です。</p>
    <p>・カードはプレイヤー交代ごとにランダムに並び替えられます。</p>
  `;

});