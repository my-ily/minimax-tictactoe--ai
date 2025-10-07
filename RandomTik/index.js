const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.statusText');
const resetButton = document.getElementById('reset');
const scoreboard = document.querySelector('.scoreboard');

let play1 = 'X';
let play2 = 'O';
let currentPlayer = play1;
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];

//localstorge
let scoreX = parseInt(localStorage.getItem('scoreX')) || 0;
let scoreO = parseInt(localStorage.getItem('scoreO')) || 0;

//update scoreboard
scoreboard.textContent = `X: ${scoreX} | O: ${scoreO}`;

const winCondition = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

init();

function init() {
  cells.forEach(cell => cell.addEventListener('click', cellClicked));
  resetButton.addEventListener('click', resetGame);
  statusText.textContent = `${currentPlayer}'s turn`;

  // لو اللاعب الثاني يبدأ أول مرة
  if (currentPlayer === play2) {
    setTimeout(computerMove, 500);
  }
}

function cellClicked() {
  const cellIndex = Number(this.getAttribute('data-cell'));
  if (board[cellIndex] !== '' || !gameActive) return;

  update(this, cellIndex);
  checkWinner();
}

function update(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === play1 ? play2 : play1;
  statusText.textContent = `${currentPlayer}'s turn`;

  // إذا الدور على الكمبيوتر
  if (currentPlayer === play2) {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
    //look for empty cells
  const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  if (emptyCells.length === 0) return; //stop if no empty cells

  //choose random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cellIndex = emptyCells[randomIndex];
  const cell = cells[cellIndex];
  update(cell, cellIndex);
  checkWinner();
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winCondition.length; i++) {
    const [a, b, c] = winCondition[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    gameActive = false;
// بعد الفوز احتاج اعرف مين اخر واحد لعب الي هو الفايز وازود النقاط 
    // تحديث LocalStorage
    if (currentPlayer === play1) {
      scoreX++;
      localStorage.setItem('scoreX', scoreX);
    } else {
      scoreO++;
      localStorage.setItem('scoreO', scoreO);
    }

    scoreboard.textContent = `X: ${scoreX} | O: ${scoreO}`;
    return;
  }

  if (!board.includes('')) {
    statusText.textContent = `Draw!`;
    gameActive = false;
    return;
  }

  changePlayer();
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => cell.textContent = '');
  gameActive = true;
  currentPlayer = play1;
  statusText.textContent = `${currentPlayer}'s turn`;
}