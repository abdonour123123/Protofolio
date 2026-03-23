(function () {
  emailjs.init("YOUR_PUBLIC_KEY");
})();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded!");

  // Smooth scrolling for any anchor links we add
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "Message Sent!";
        btn.style.backgroundColor = "#10b981"; // Green
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = "";
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }
});

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.getElementById("resetBtn");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let playerTurn = true;

let scores = {
  X: 0,
  O: 0,
  draw: 0,
};

const HUMAN = "X";
const AI = "O";

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(e) {
  const clickedCell = e.target;
  const clickedIndex = Number(clickedCell.dataset.index);

  if (!gameActive || !playerTurn || board[clickedIndex] !== "") {
    return;
  }

  makeMove(clickedIndex, HUMAN);

  const result = getGameResult();
  if (result) {
    endGame(result);
    return;
  }

  playerTurn = false;
  statusText.textContent = "PC is thinking...";

  setTimeout(() => {
    aiMove();
  }, 450);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  cells[index].disabled = true;
}

function aiMove() {
  if (!gameActive) return;

  const bestMove = getBestMove();

  if (bestMove !== -1) {
    makeMove(bestMove, AI);
  }

  const result = getGameResult();
  if (result) {
    endGame(result);
    return;
  }

  playerTurn = true;
  statusText.textContent = "Your turn";
}

function getBestMove() {
  const emptyCells = getEmptyCells(board);

  for (const index of emptyCells) {
    board[index] = AI;
    if (checkWinner(board, AI)) {
      board[index] = "";
      return index;
    }
    board[index] = "";
  }

  for (const index of emptyCells) {
    board[index] = HUMAN;
    if (checkWinner(board, HUMAN)) {
      board[index] = "";
      return index;
    }
    board[index] = "";
  }

  if (board[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter((index) => board[index] === "");
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  if (emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return -1;
}

function getEmptyCells(currentBoard) {
  return currentBoard
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);
}

function checkWinner(currentBoard, player) {
  return winningConditions.some(([a, b, c]) => {
    return (
      currentBoard[a] === player &&
      currentBoard[b] === player &&
      currentBoard[c] === player
    );
  });
}

function getGameResult() {
  if (checkWinner(board, HUMAN)) return HUMAN;
  if (checkWinner(board, AI)) return AI;
  if (!board.includes("")) return "draw";
  return null;
}

function endGame(result) {
  gameActive = false;
  disableBoard();

  if (result === HUMAN) {
    statusText.textContent = "You win!";
    scores.X++;
  } else if (result === AI) {
    statusText.textContent = "PC wins!";
    scores.O++;
  } else {
    statusText.textContent = "It's a draw!";
    scores.draw++;
  }

  updateScores();
}

function disableBoard() {
  cells.forEach((cell) => {
    cell.disabled = true;
  });
}

function enableBoard() {
  cells.forEach((cell, index) => {
    if (board[index] === "") {
      cell.disabled = false;
    }
  });
}

function restartRound() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  playerTurn = true;
  statusText.textContent = "Your turn";

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("x", "o");
  });
}

function resetScore() {
  scores = {
    X: 0,
    O: 0,
    draw: 0,
  };

  updateScores();
  restartRound();
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draw;
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartRound);
resetBtn.addEventListener("click", resetScore);

updateScores();
enableBoard();

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    })
    .then(() => alert("Sent ✅"))
    .catch(() => alert("Error ❌"));
});

document.getElementById("copyBtn").addEventListener("click", function () {
  navigator.clipboard.writeText("body50nour@gmail.com");
});
