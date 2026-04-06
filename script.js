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

  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  
  if (localStorage.getItem("theme") === "light") {
    document.body.setAttribute("data-theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.getAttribute("data-theme") === "light") {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }
  });

  // Mobile Hamburger Menu
  const menuIcon = document.getElementById("menu-icon");
  const navLinksContainer = document.getElementById("nav-links");
  
  menuIcon.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });

  navLinksContainer.querySelectorAll("a").forEach(item => {
    item.addEventListener("click", () => {
      navLinksContainer.classList.remove("active");
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

        /* 
        // 🚀 WHEN YOU GET REAL EMAILJS KEYS, ADD THIS HERE:
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          from_name: document.getElementById("name").value,
          from_email: document.getElementById("email").value,
          message: document.getElementById("message").value,
        });
        */

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = "";
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // == NEW ANIMATIONS ==
  
  // 1. Scroll-Triggered Fade In
  const fadeElements = document.querySelectorAll(".fade-in");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeElements.forEach((el) => fadeObserver.observe(el));

  // 2. 3D Mouse Tilt & Spotlight Effect on Glass Cards
  const glassCards = document.querySelectorAll(".glass-card");
  glassCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight Variables
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // 3D Tilt Calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; // Subtle 5deg tilt
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      // Reset tilt when mouse leaves (hover state CSS handles the rest)
      card.style.transform = ``;
    });
  });

  // 3. Scroll Progress Bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.prepend(progressBar);

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (totalScroll / windowHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });

  // 4. Parallax Background Stars
  const starsBg = document.querySelector(".bg-stars");
  if (starsBg) {
    window.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Move background slightly opposite to mouse
      starsBg.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
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


document.getElementById("copyBtn").addEventListener("click", function () {
  navigator.clipboard.writeText("body50nour@gmail.com");
});
