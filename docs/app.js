/* Sliding puzzle game using a single background image. */
(function () {
  const boardEl = document.getElementById('board');
  const sizeEl = document.getElementById('size');
  const newGameBtn = document.getElementById('newGame');
  const timeEl = document.getElementById('time');
  const movesEl = document.getElementById('moves');
  const winDialog = document.getElementById('winDialog');
  const winStats = document.getElementById('winStats');

  const IMG_URL = 'assets/images/photo.jpg';

  let n = 4; // default grid size
  let tiles = []; // 0..n*n-1 where last is empty
  let emptyIndex = 0;
  let timer = null;
  let seconds = 0;
  let moves = 0;

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const r = (s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      seconds += 1;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function resetStats() {
    seconds = 0;
    moves = 0;
    timeEl.textContent = '00:00';
    movesEl.textContent = '0';
  }

  function initTiles() {
    tiles = Array.from({ length: n * n }, (_, i) => i);
    emptyIndex = n * n - 1;
  }

  function shuffleTiles() {
    // Fisher–Yates then ensure solvable
    do {
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }
      emptyIndex = tiles.indexOf(n * n - 1);
    } while (!isSolvable());
  }

  function isSolvable() {
    const arr = tiles.slice();
    const emptyRowFromBottom = n - Math.floor(emptyIndex / n);
    let inv = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] === n * n - 1 || arr[j] === n * n - 1) continue;
        if (arr[i] > arr[j]) inv++;
      }
    }
    if (n % 2 === 1) return inv % 2 === 0; // odd grid
    // even grid: blank on even row from bottom => inversions odd; on odd row => inversions even
    return (emptyRowFromBottom % 2 === 0) ? (inv % 2 === 1) : (inv % 2 === 0);
  }

  function render() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${n}, 1fr)`;

    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tile-gap')) || 6;

    for (let i = 0; i < tiles.length; i++) {
      const trueIndex = tiles[i];
      const isEmpty = trueIndex === n * n - 1;
      const tile = document.createElement('button');
      tile.className = 'tile' + (isEmpty ? ' empty' : '');
      tile.setAttribute('data-idx', i.toString());
      tile.setAttribute('aria-label', isEmpty ? 'Empty space' : `Tile ${trueIndex + 1}`);
      tile.tabIndex = isEmpty ? -1 : 0;

      if (!isEmpty) {
        const row = Math.floor(trueIndex / n);
        const col = trueIndex % n;
        // Use background positioning to slice the full image
        const sizePercent = 100;
        tile.style.backgroundImage = `url('${IMG_URL}')`;
        tile.style.backgroundSize = `${n * 100}% ${n * 100}%`;
        tile.style.backgroundPosition = `${(col / (n - 1)) * 100}% ${(row / (n - 1)) * 100}%`;
        tile.textContent = '';
      }

      tile.addEventListener('click', () => attemptMove(i));
      boardEl.appendChild(tile);
    }
  }

  function neighbors(index) {
    const r = Math.floor(index / n);
    const c = index % n;
    const list = [];
    if (r > 0) list.push(index - n);
    if (r < n - 1) list.push(index + n);
    if (c > 0) list.push(index - 1);
    if (c < n - 1) list.push(index + 1);
    return list;
  }

  function attemptMove(index) {
    const nb = neighbors(index);
    if (nb.includes(emptyIndex)) {
      [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
      emptyIndex = index;
      moves += 1;
      movesEl.textContent = String(moves);
      render();
      if (isComplete()) onWin();
    }
  }

  function isComplete() {
    for (let i = 0; i < tiles.length; i++) if (tiles[i] !== i) return false;
    return true;
  }

  function onWin() {
    stopTimer();
    winStats.textContent = `Solved in ${formatTime(seconds)} with ${moves} move${moves === 1 ? '' : 's'}!`;
    try { winDialog.showModal(); } catch {}
  }

  function newGame() {
    n = parseInt(sizeEl.value, 10) || 4;
    resetStats();
    initTiles();
    shuffleTiles();
    render();
    startTimer();
  }

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    let targetIndex = null;
    if (key === 'ArrowUp') targetIndex = emptyIndex + n; // move tile down into empty
    else if (key === 'ArrowDown') targetIndex = emptyIndex - n;
    else if (key === 'ArrowLeft') targetIndex = emptyIndex + 1;
    else if (key === 'ArrowRight') targetIndex = emptyIndex - 1;
    if (targetIndex != null && targetIndex >= 0 && targetIndex < tiles.length) {
      attemptMove(targetIndex);
    }
  });

  newGameBtn.addEventListener('click', newGame);
  sizeEl.addEventListener('change', newGame);

  // Preload image to avoid flashing
  const img = new Image();
  img.onload = () => { newGame(); };
  img.onerror = () => { console.warn('Could not load photo.jpg; using blank tiles.'); newGame(); };
  img.src = IMG_URL;
})();

