const SECRET_WORD = "PHATASS";
const MAX_ATTEMPTS = 6;
let attempts = MAX_ATTEMPTS;
let guesses = [];
let currentGuess = "";
let gameOver = false;

const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const wordInput = document.getElementById('wordInput');
const submitBtn = document.getElementById('submitBtn');
const messageEl = document.getElementById('message');
const guessesEl = document.getElementById('guesses');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const successScreen = document.getElementById('successScreen');
const failScreen = document.getElementById('failScreen');

function addLetter(letter) {
    if (currentGuess.length < 6 && !gameOver) {
        currentGuess += letter;
        wordInput.value = currentGuess;
    }
}

function deleteLetter() {
    if (currentGuess.length > 0 && !gameOver) {
        currentGuess = currentGuess.slice(0, -1);
        wordInput.value = currentGuess;
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace') {
        deleteLetter();
    } else if (/^[A-Za-z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
    }
}

wordInput.addEventListener('input', (e) => {
    currentGuess = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    wordInput.value = currentGuess;
});

function getLetterFeedback(guess, word) {
    const feedback = Array(6).fill('absent');
    const wordLetters = word.split('');
    const guessLetters = guess.split('');

    // First pass: check for correct letters
    for (let i = 0; i < 6; i++) {
        if (guessLetters[i] === wordLetters[i]) {
            feedback[i] = 'correct';
            wordLetters[i] = null; // Mark as used
        }
    }

    // Second pass: check for present letters
    for (let i = 0; i < 6; i++) {
        if (feedback[i] === 'absent' && wordLetters.includes(guessLetters[i])) {
            feedback[i] = 'present';
            wordLetters[wordLetters.indexOf(guessLetters[i])] = null; // Mark as used
        }
    }

    return feedback;
}

function displayGuess(guess, feedback) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    for (let i = 0; i < 6; i++) {
        const tile = document.createElement('div');
        tile.className = `guess-tile ${feedback[i]} flip`;
        tile.textContent = guess[i];
        row.appendChild(tile);
    }

    guessesEl.appendChild(row);
}

function submitGuess() {
    if (gameOver) return;

    if (currentGuess.length !== 6) {
        messageEl.textContent = '⚠️ Word must be 6 letters!';
        messageEl.style.color = '#f87171';
        return;
    }

    const feedback = getLetterFeedback(currentGuess, SECRET_WORD);
    guesses.push({ guess: currentGuess, feedback: feedback });
    displayGuess(currentGuess, feedback);

    if (currentGuess === SECRET_WORD) {
        gameOver = true;
        messageEl.textContent = '🎉 Correct! You unlocked the surprise!';
        messageEl.style.color = '#4ade80';
        triggerConfetti();
        setTimeout(() => {
            successScreen.classList.remove('hidden');
        }, 500);
    } else {
        attempts--;
        attemptsLeftEl.textContent = attempts;

        if (attempts === 0) {
            gameOver = true;
            messageEl.textContent = '❌ Game Over!';
            messageEl.style.color = '#f87171';
            setTimeout(() => {
                failScreen.classList.remove('hidden');
            }, 500);
        } else {
            messageEl.textContent = `Try again! ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'} left`;
            messageEl.style.color = '#fbbf24';
        }
    }

    currentGuess = "";
    wordInput.value = "";
    wordInput.focus();
}

function triggerConfetti() {
    const colors = ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        confetti.animate([
            { 
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight}px) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

function proceedToMain() {
    window.location.href = 'index.html';
}

// Focus input on load
window.addEventListener('load', () => {
    wordInput.focus();
});

// Prevent form submission
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target === wordInput) {
        e.preventDefault();
    }
});
