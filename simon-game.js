let gameSeq =[];
let userSeq =[];
let btns = ["yellow", "red", "purple","green"];
let started = false;
let level =0;
let inputEnabled = false;  // NEW: Controls user input

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function(){
    
    if(started == false){
        console.log("game is started");
        started = true; 
        level = 0;  // Ensure starts at 0
        h2.innerText = "Get Ready...";
        setTimeout(levelUp, 500);  // Slight delay before first level

       // levelUp();
    }
});


function gameFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn){
    btn.classList.add("userflash");
    setTimeout(function(){
        btn.classList.remove("userflash");
    }, 250);
}

// Plays FULL sequence
function playSequence() {
    for (let i = 0; i < gameSeq.length; i++) {
        setTimeout(() => {
            let randBtn = document.querySelector(`.${gameSeq[i]}`);
            gameFlash(randBtn);
        }, i * 1000);  // 400ms between flashe
    }
}


function levelUp(){
    userSeq =[];
    level++;
    h2.innerText = `Level ${level}`;
    //random btn choose
    let randIdx = Math.floor(Math.random() * 3);
    let randColor = btns[randIdx];
    let randBtn =document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    console.log(gameSeq);
    gameFlash(randBtn);

    inputEnabled = false;  // Disable during playback
    playSequence();  // Play FULL sequence

    // Enable input AFTER full sequence + pause
    setTimeout(() => {
        inputEnabled = true;
        h2.innerText = `Level ${level} - Your Turn`;
    }, gameSeq.length * 400 + 200);
}

function checkAns(idx){
    // console.log("curr level: " + level);
    //let idx =level -1;
    if(userSeq[idx] === gameSeq[idx]){
       // console.log("same value");
        if(userSeq.length == gameSeq.length){
           // levelUp();
           h2.innerText = "Perfect! Next Level...";
           inputEnabled = false;  // Disable until next level
           setTimeout(levelUp, 1000);
        }
    }else{
        h2.innerHTML = `Game Over! your score was <b>${level}</b>.<br> Press any key to Restart`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
         setTimeout(function(){
            document.querySelector("body").style.backgroundColor = " rgb(79, 119, 140)";
        }, 3000);

        reset();
       
    }
}

function btnPress(){
   // console.log("button pressed");
    if (!inputEnabled) return;  // Ignore input if not enabled
   let btn = this;
   userFlash(btn);
   let userColor = btn.getAttribute("id");
    userSeq.push(userColor); //save user choice
   console.log(userColor);

   checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
    btn.addEventListener("click", btnPress);
}

function reset(){
    started = false;
    gameSeq =[];
    userSeq =[];
     h2.innerText = `Your Score Level ${level} - congratulations!`;
    level =0;
    inputEnabled = false;  // Disable input on reset

    setTimeout(() => {
        h2.innerText = "Press Any Key to Start";  //reset message
    }, 5000); 
    
}

