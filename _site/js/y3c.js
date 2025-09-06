// game.js

(function() {
  let canvas, ctx;
  const rows = 4, cols = 5;
  let cellW, cellH;

  let grid;                      // 2D array: false = empty, true = black
  let currentPlayer;             // "1P", "2P" or "CPU"
  let playerPositions;           // { "1P": {r,c}, "2P": {r,c}, "CPU": {r,c} }
  let path;                      // Array of {r,c} for current 3-step path
  let mode;                      // "CPU" or "PVP"
  let gameState = 'loading';     // "loading", "start", "running", "victory"

  const images = {};
  let loadedCount = 0, totalImages = 3;

  window.onload = () => {
    // create full-screen canvas
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    preloadImages();
  };

  function preloadImages() {
    const srcMap = {
      "1P": '/images/zjump1.png',
      "2P": '/images/zjump2.png',
      "CPU": '/images/zjump3.png'
    };

    for (const key in srcMap) {
      const img = new Image();
      img.src = srcMap[key];
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          showStartScreen();
        }
      };
      images[key] = img;
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gameState === 'start') drawStartScreen();
    else if (gameState === 'running') drawGame();
    else if (gameState === 'victory') drawVictory();
  }

  // ─── START SCREEN ────────────────────────────────────────────────────────────

  function showStartScreen() {
    gameState = 'start';
    canvas.addEventListener('click', onStartClick);
    canvas.addEventListener('touchstart', onStartTouch, { passive: false });
    drawStartScreen();
  }

  function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // left half
    ctx.fillStyle = '#CCFFFF';
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
    // right half
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '24px sans-serif';
    ctx.fillText('1P vs コンピューター', canvas.width / 4, canvas.height / 2);
    ctx.fillText('1P vs 2P', (canvas.width * 3) / 4, canvas.height / 2);
  }

  function onStartClick(e) {
    mode = (e.clientX < canvas.width / 2) ? 'CPU' : 'PVP';
    cleanupStartListeners();
    initGame();
  }
  function onStartTouch(e) {
    e.preventDefault();
    const t = e.touches[0];
    onStartClick({ clientX: t.clientX });
  }

  function cleanupStartListeners() {
    canvas.removeEventListener('click', onStartClick);
    canvas.removeEventListener('touchstart', onStartTouch);
  }

  // ─── GAME SETUP ──────────────────────────────────────────────────────────────

  function initGame() {
    // reset grid
    grid = Array(rows).fill().map(() => Array(cols).fill(false));

    // initial positions: spawn at center (row=1, col=2)
    playerPositions = {
      "1P": { r: 1, c: 2 },
      "2P": { r: 1, c: 2 },
      "CPU": { r: 1, c: 2 }
    };
    currentPlayer = '1P';
    path = [];

    gameState = 'running';
    canvas.addEventListener('mousedown', onCanvasTap);
    canvas.addEventListener('touchstart', onCanvasTouch, { passive: false });
    document.addEventListener('keydown', onKeyDown);

    drawGame();

    if (mode === 'CPU' && currentPlayer === 'CPU') {
      setTimeout(computerMove, 300);
    }
  }

  // ─── INPUT HANDLING ──────────────────────────────────────────────────────────

  function onCanvasTap(e) {
    if (gameState !== 'running') return;
    const pos = getCellUnderMouse(e.clientX, e.clientY);
    if (pos) handleCellSelected(pos.r, pos.c);
  }

  function onCanvasTouch(e) {
    if (gameState !== 'running') return;
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const pos = getCellUnderMouse(x, y);
    if (pos) handleCellSelected(pos.r, pos.c);
  }

  function getCellUnderMouse(x, y) {
    cellW = canvas.width / cols;
    cellH = canvas.height / rows;
    const c = Math.floor(x / cellW);
    const r = Math.floor(y / cellH);
    if (r >= 0 && r < rows && c >= 0 && c < cols) return { r, c };
    return null;
  }

  function onKeyDown(e) {
    if (gameState === 'victory') {
      if (e.key === 'Enter' || e.key === 'Shift') restartToStart();
      return;
    }
    if (gameState !== 'running') return;

    let dir = null;
    if (currentPlayer === '1P') {
      if (e.key === 'w' || e.key === 'ArrowUp') dir = { dr: -1, dc: 0 };
      if (e.key === 's' || e.key === 'ArrowDown') dir = { dr: 1, dc: 0 };
      if (e.key === 'a' || e.key === 'ArrowLeft') dir = { dr: 0, dc: -1 };
      if (e.key === 'd' || e.key === 'ArrowRight') dir = { dr: 0, dc: 1 };
    } else if (mode === 'PVP' && currentPlayer === '2P') {
      if (e.key === '8') dir = { dr: -1, dc: 0 };
      if (e.key === '5') dir = { dr: 1, dc: 0 };
      if (e.key === '4') dir = { dr: 0, dc: -1 };
      if (e.key === '6') dir = { dr: 0, dc: 1 };
    }

    if (!dir) return;

    const start = path.length === 0
      ? playerPositions[currentPlayer]
      : path[path.length - 1];

    const nr = start.r + dir.dr;
    const nc = start.c + dir.dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

    // ensure cardinal adjacency
    if (Math.abs(nr - start.r) + Math.abs(nc - start.c) !== 1) return;

    path.push({ r: nr, c: nc });
    drawGame();

    if (path.length === 3) finalizeMove();
  }

  function handleCellSelected(r, c) {
    if (mode === 'CPU' && currentPlayer === 'CPU') return;

    const start = path.length === 0
      ? playerPositions[currentPlayer]
      : path[path.length - 1];

    if (Math.abs(start.r - r) + Math.abs(start.c - c) !== 1) return;
    path.push({ r, c });
    drawGame();

    if (path.length === 3) finalizeMove();
  }

  // ─── TURN RESOLUTION ─────────────────────────────────────────────────────────

  function finalizeMove() {
    const landing = path[2];

    // losing condition: landing on black
    if (grid[landing.r][landing.c]) {
      let winner;
      if (currentPlayer === '1P')      winner = (mode === 'CPU') ? 'CPU' : '2P';
      else if (currentPlayer === '2P') winner = '1P';
      else                             winner = '1P';
      showVictory(winner);
      return;
    }

    // occupy the landing
    grid[landing.r][landing.c] = true;
    playerPositions[currentPlayer] = { ...landing };

    // switch turn
    currentPlayer = (mode === 'CPU')
      ? (currentPlayer === '1P' ? 'CPU' : '1P')
      : (currentPlayer === '1P' ? '2P' : '1P');

    path = [];
    drawGame();

    if (mode === 'CPU' && currentPlayer === 'CPU') {
      setTimeout(computerMove, 400);
    }
  }

  // ─── SIMPLE COMPUTER AI ──────────────────────────────────────────────────────

  function computerMove() {
    const start = playerPositions['CPU'];
    const sequences = [];

    // depth-3 DFS to gather all length-3 paths
    (function dfs(seq, depth) {
      if (depth === 3) {
        sequences.push(seq.slice());
        return;
      }
      const dirs = [
        { dr: -1, dc: 0 },
        { dr:  1, dc: 0 },
        { dr:  0, dc: -1 },
        { dr:  0, dc:  1 }
      ];
      const last = depth === 0 ? start : seq[seq.length - 1];

      for (const d of dirs) {
        const nr = last.r + d.dr, nc = last.c + d.dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        seq.push({ r: nr, c: nc });
        dfs(seq, depth + 1);
        seq.pop();
      }
    })([], 0);

    // prefer paths landing on non-black
    const safe = sequences.filter(s => !grid[s[2].r][s[2].c]);
    const chosen = (safe.length > 0)
      ? safe[Math.floor(Math.random() * safe.length)]
      : sequences[Math.floor(Math.random() * sequences.length)];

    path = chosen;
    drawGame();
    setTimeout(finalizeMove, 500);
  }

  // ─── RENDERING ────────────────────────────────────────────────────────────────

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cellW = canvas.width / cols;
    cellH = canvas.height / rows;

    // draw checkerboard background
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = ((r + c) % 2 === 0) ? '#CCFFFF' : '#FFFFFF';
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }

    // draw grid lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(canvas.width, r * cellH);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, canvas.height);
      ctx.stroke();
    }

    // draw occupied (black) cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = '#000';
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }

    // highlight current path
    ctx.fillStyle = 'rgba(255,0,0,0.3)';
    for (const p of path) {
      ctx.fillRect(p.c * cellW, p.r * cellH, cellW, cellH);
    }

    // draw players
    const toDraw = (mode === 'CPU') ? ['1P','CPU'] : ['1P','2P'];
    toDraw.forEach(key => {
      const pos = playerPositions[key];
      const img = images[key];
      const x = pos.c * cellW;
      const y = pos.r * cellH - cellH * 0.1; 
      ctx.drawImage(img, x, y, cellW, cellH);
    });
  }

  // ─── VICTORY / RESTART ───────────────────────────────────────────────────────

  function showVictory(winner) {
    gameState = 'victory';
    cleanupGameListeners();
    canvas.addEventListener('click', onVictoryRestart);
    document.addEventListener('keydown', onVictoryRestartKey);
    drawVictory(winner);
  }

  function drawVictory(winner) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '32px sans-serif';

    let msg = '';
    if (winner === '1P') msg = '1Pの勝利☆';
    else if (winner === '2P') msg = '2Pの勝利☆';
    else msg = 'コンピューターの勝利☆';

    ctx.fillText(msg, canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '24px sans-serif';
    ctx.fillText('再対戦する', canvas.width / 2, canvas.height / 2 + 20);
  }

  function onVictoryRestart() {
    restartToStart();
  }
  function onVictoryRestartKey(e) {
    if (e.key === 'Enter' || e.key === 'Shift') restartToStart();
  }

  function cleanupGameListeners() {
    canvas.removeEventListener('mousedown', onCanvasTap);
    canvas.removeEventListener('touchstart', onCanvasTouch);
    document.removeEventListener('keydown', onKeyDown);
  }

  function restartToStart() {
    canvas.removeEventListener('click', onVictoryRestart);
    document.removeEventListener('keydown', onVictoryRestartKey);
    showStartScreen();
  }

})();