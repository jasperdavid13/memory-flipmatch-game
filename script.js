// ====== Hardcoded card data ======
const cardData = [
    { name: "card1", image: "assets/card1.png" },
    { name: "card2", image: "assets/card2.png" },
    { name: "card3", image: "assets/card3.png" },
    { name: "card4", image: "assets/card4.png" },
    { name: "card5", image: "assets/card5.png" },
    { name: "card6", image: "assets/card6.png" },
    { name: "card7", image: "assets/card7.png" },
    { name: "card8", image: "assets/card8.png" }
];

const gameBoard = document.querySelector('.game-board');
const scoreEl = document.querySelector('.score');
const timerEl = document.querySelector('.timer');
const bestTimeEl = document.querySelector('.best-time');
const winPopup = document.querySelector('.win-popup');
const winTimeMessage = document.querySelector('.win-time-message');
const winBestTimeMessage = document.querySelector('.win-best-time-message');

let score = 0;
let timer = 0;
let timerInterval;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Load best time from localStorage
let bestTime = localStorage.getItem('bestTime');
if (bestTime !== null && bestTimeEl) {
    bestTimeEl.textContent = `${bestTime}s`;
} else {
    bestTime = null;
}

// Duplicate and shuffle cards
let gameCards = [...cardData, ...cardData];
gameCards = shuffle(gameCards);

// ====== Create game grid ======
function createGrid() {
    gameBoard.innerHTML = '';
    gameCards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="assets/smart-logo.png" alt="Card front">
                </div>
                <div class="card-back">
                    <img src="${card.image}" alt="${card.name}">
                </div>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// ====== Shuffle function ======
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// ====== Flip card ======
function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkMatch();
}

// ====== Check for match ======
function checkMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        updateScore();
        resetFlip();
        checkWin();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetFlip();
        }, 1000);
    }
}

// ====== Update score ======
function updateScore() {
    score++;
    scoreEl.textContent = score;
}

// ====== Reset flipped cards ======
function resetFlip() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// ====== Restart game ======
function restart() {
    score = 0;
    scoreEl.textContent = '0';
    timer = 0;
    clearInterval(timerInterval);
    timerEl.textContent = '0s';
    startTimer();
    gameCards = shuffle([...cardData, ...cardData]);
    createGrid();
    if (winPopup) winPopup.classList.add('hidden');
}

// ====== Timer ======
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = `${timer}s`;
    }, 1000);
}

// ====== Check if all matched ======
function checkWin() {
    const matchedCards = document.querySelectorAll('.card.matched');
    if (matchedCards.length === gameCards.length) {
        clearInterval(timerInterval);
        updateBestTime(timer);
        setTimeout(() => {
            showWinPopup(timer, bestTime);
        }, 300);
    }
}

// ====== Show Win Popup ======
function showWinPopup(currentTime, bestTimeValue) {
    if (!winPopup) return;
    winTimeMessage.textContent = `Your Time: ${currentTime}s`;
    winBestTimeMessage.textContent = bestTimeValue ? `Best Time: ${bestTimeValue}s` : 'New Best Time!';
    winPopup.classList.remove('hidden');
}

// ====== Best Time Logic ======
function updateBestTime(currentTime) {
    if (bestTime === null || currentTime < parseInt(bestTime)) {
        bestTime = currentTime;
        localStorage.setItem('bestTime', bestTime);
        if (bestTimeEl) {
            bestTimeEl.textContent = `${bestTime}s`;
        }
    }
}

// ====== Initialize ======
window.onload = () => {
    createGrid();
    startTimer();
    if (bestTime !== null && bestTimeEl) {
        bestTimeEl.textContent = `${bestTime}s`;
    }
};
