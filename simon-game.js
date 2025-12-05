// Simon game logic with high-score persistence
let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let started = false;
let level = 0;
let inputEnabled = false; // Controls user input

let h2 = document.querySelector("h2");

// Highscore elements
const highscoresListEl = document.getElementById('highscores-list');
const clearScoresBtn = document.getElementById('clear-scores');

document.addEventListener("keypress", function () {
    if (started == false) {
        started = true;
        level = 0;
        h2.innerText = "Get Ready...";
        setTimeout(levelUp, 500);
    }
});


function gameFlash(btn) {
    if (!btn) return;
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    if (!btn) return;
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

// Plays FULL sequence
function playSequence() {
    for (let i = 0; i < gameSeq.length; i++) {
        setTimeout(() => {
            let randBtn = document.querySelector(`.${gameSeq[i]}`);
            gameFlash(randBtn);
        }, i * 800);
    }
}


function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    // random btn choose
    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randBtn);

    inputEnabled = false;
    playSequence();

    // Enable input AFTER full sequence + pause
    setTimeout(() => {
        inputEnabled = true;
        h2.innerText = `Level ${level} - Your Turn`;
    }, gameSeq.length * 600 + 300);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            h2.innerText = "Perfect! Next Level...";
            inputEnabled = false;
            setTimeout(levelUp, 1000);
        }
    } else {
        const finalScore = level;
        h2.innerHTML = `Game Over! your score was <b>${finalScore}</b>.<br> You will be prompted to save your score.`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = " rgb(79, 119, 140)";
        }, 3000);

        // Prompt for name after short delay so user sees message
        setTimeout(() => {
            const name = prompt(`Game Over! Your score: ${finalScore}\nEnter your name to save your score:`, "Player");
            if (name !== null && name.trim() !== "") {
                saveScore(name.trim(), finalScore);
                renderHighscores();
            }
            reset();
        }, 600);
    }
}

function btnPress() {
    if (!inputEnabled) return; // Ignore input if not enabled
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
    // keyboard support
    btn.setAttribute('tabindex', 0);
    btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btnPress.call(this);
        }
    });
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    h2.innerText = `Your Score Level ${level} - congratulations!`;
    level = 0;
    inputEnabled = false;

    setTimeout(() => {
        h2.innerText = "Press Any Key to Start";
    }, 3000);
}

/* Highscore persistence using localStorage */
function getHighscores() {
    try {
        const raw = localStorage.getItem('simonHighscores');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveScore(name, score) {
    const list = getHighscores();
    list.push({ name, score, date: new Date().toISOString() });
    // sort descending
    list.sort((a, b) => b.score - a.score);
    // keep top 10
    const trimmed = list.slice(0, 10);
    localStorage.setItem('simonHighscores', JSON.stringify(trimmed));
}

function renderHighscores() {
    if (!highscoresListEl) return;
    const list = getHighscores();
    highscoresListEl.innerHTML = '';
    if (list.length === 0) {
        highscoresListEl.innerHTML = '<li>No scores yet</li>';
        return;
    }
    for (const entry of list) {
        const li = document.createElement('li');
        li.textContent = `${entry.name} — ${entry.score}`;
        highscoresListEl.appendChild(li);
    }
}

if (clearScoresBtn) {
    clearScoresBtn.addEventListener('click', () => {
        localStorage.removeItem('simonHighscores');
        renderHighscores();
    });
}

// Render on load
renderHighscores();


