
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.statusText');
const resetButton = document.getElementById('reset');
const scoreboard = document.querySelector('.scoreboard');

let play1 = 'X';
let play2 = 'O';
let currentPlayer = play1;
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];

// اقرأ النتائج السابقة من LocalStorage أو ضع صفر
let scoreX = parseInt(localStorage.getItem('scoreX')) || 0;
let scoreO = parseInt(localStorage.getItem('scoreO')) || 0;

// اعرض النتائج
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
// we put it in postion tempreatly to avaulate the move 
//bestmove for best index
function checkWinnerForMinimax(){
  for (let i = 0; i < winCondition.length; i++) {
    const [a, b, c] = winCondition[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // return 'X' or 'O'
    }
  }
  if (!board.includes('')) {
    return 'tie'; // return 'tie' if no empty cells
  }
  return null; // game is still ongoing
}



function minimax(newBoard, depth, isMaximizing) {
  let result = checkWinnerForMinimax(); // هل أحد فاز؟
  if (result !== null) {
    const scores = {
      [play1]: -1, // X
      [play2]: 1,  // O
      tie: 0       // تعادل
    };
    return scores[result]; // يرجّع القيمة حسب من فاز
  }

  // إذا الدور على الكمبيوتر (O)
  if (isMaximizing) {
    let bestScore = -Infinity; // نبدأ بأسوأ نتيجة
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = play2; // نحط O مؤقتًا
        let score = minimax(newBoard, depth + 1, false); // نشغّل Minimax
        newBoard[i] = ''; // نرجّع الخانة فاضية
        bestScore = Math.max(score, bestScore); // ناخذ أعلى نتيجة
      }
    }
    return bestScore;
  } else {
    // إذا الدور على اللاعب (X)
    let bestScore = Infinity; // نبدأ بأفضل نتيجة للاعب
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = play1; // نحط X مؤقتًا
        let score = minimax(newBoard, depth + 1, true); // نشغّل Minimax
        newBoard[i] = ''; // نرجّع الخانة فاضية
        bestScore = Math.min(score, bestScore); // ناخذ أقل نتيجة
      }
    }
    return bestScore;
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = play2; // نحط 'O' مؤقتاً
      let score = minimax(board, 0, false); // نقيّم الحركة
      board[i] = ''; // نرجّعها فاضية
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}


function computerMove() {
  if (!gameActive) return; 
  const bestMove = getBestMove(); 
  if (bestMove === undefined) return;
  const cell = cells[bestMove]; 
  update(cell, bestMove); 
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