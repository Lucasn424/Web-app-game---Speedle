import Speedle from "./common/Speedle.js";
import Json_rpc from "./Json_rpc.js";

const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

const high_scores = document.getElementById("highScores");


const register = Json_rpc.method("register");
const top_ten = Json_rpc.method("top_ten");


const getWordle = Speedle.ranword();
let wordle = getWordle;

const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "«"];

const guessRows = Speedle.new_empty_board();

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

const updateScore = function() {
    top_ten().then(function (scores) {
        high_scores.textContent = "";
        scores.forEach(function (score_line) {
            const lis = document.createElement("li");
            lis.textContent = `${score_line.totalScore}`;
            high_scores.append(lis);
        });
    });
};

guessRows.forEach(function(guessRow, guessRowIndex) {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
    guessRow.forEach(function (_guess, guessIndex) {
        const tileElement = document.createElement("div");
        tileElement.setAttribute("id", "guessRow-" + guessRowIndex +
         "-tile-" + guessIndex);
        tileElement.classList.add("tile");
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement);
});

keys.forEach(function(key) {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.addEventListener("click", () => handleClick(key));
    keyboard.append(buttonElement);
});

const handleClick = function(letter) {
    if (!isGameOver) {
        if (letter === "«") {
            deleteLetter();
            return;
        }
        if (letter === "ENTER") {
            checkRow();
            return;
        }
        addLetter(letter);
    }
};

const addLetter = function(letter) {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById("guessRow-" + currentRow +
         "-tile-" + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute("data", letter);
        currentTile = currentTile + 1;
    }
};

document.body.onkeydown = function (event) {
    if (!isGameOver) {
        if (event.key === "Backspace") {
            deleteLetter();
            return;
        }
        if (event.key === "Enter") {
            checkRow();
            return;
        }
        let found = event.key.match(/[a-z]/gi);
        if (!found || found.length > 1) {
            return;
        } else {
            addLetter(event.key.toUpperCase());
        }
    }
};

const deleteLetter = function() {
    if (currentTile > 0) {
        currentTile =  currentTile - 1;
        const tile = document.getElementById("guessRow-" + currentRow +
         "-tile-" + currentTile);
        tile.textContent = "";
        guessRows[currentRow][currentTile] = "";
        tile.setAttribute("data", "");
    }
};

const showMessage = function(message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), 5000);
};



const checkRow = function () {
    const guess = guessRows[currentRow].join("");
                if (Speedle.validateword(guess) === false) {
                    showMessage("Word is not in the list");
                    let audio = new Audio("./assets/Wrong-Answer.mp3");
                    audio.volume = 0.2;
                    audio.play();
                    return;
                } else {
                    flipTile();
                    if (wordle === guess) {
                        isGameOver = true;
                        let guessTimes = currentRow;
                        clearTimeout(tGame);
                        clearTimeout(t);
                        let guesspoint = Speedle.GuessPoints(guessTimes);
                        let timePoints = Speedle.timerMultiplier(h2);
                        let totalScore = Speedle.Score(guesspoint, timePoints);
                        setTimeout(() => showMessage(
                            "Good job, you won! \n Your score is " + totalScore)
                            , 2600);
                        let audio2 = new Audio("./assets/Correct-Answer.mp3");
                        audio2.volume = 0.5;
                        setTimeout(() => audio2.play(), 2600);
                        //----------------------------
                        //Code below is for server to record high score.
                        register(totalScore).then(updateScore);



                        // ---------------------------
                        //The code blow is for the confetti effect
                        const duration = 5 * 1000;
                        const end = Date.now() + duration;

                        setTimeout(() => (function frame() {
                            // launch a few confetti from the left edge
                            confetti({
                                particleCount: 6,
                                angle: 50,
                                spread: 55,
                                origin: { x: 0 }
                            });
                            // and launch a few from the right edge
                            confetti({
                                particleCount: 6,
                                angle: 120,
                                spread: 55,
                                origin: { x: 1 }
                            });
                            if (Date.now() < end) {
                                requestAnimationFrame(frame);
                            }
                            }()), 2600);
                        return;
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true;
                            clearTimeout(tGame);
                            clearTimeout(t);
                            showMessage(
                                "Game Over, Out of Guesses. Your Score is 0. "
                                + "The word was " + wordle);
                            return;
                        }
                        }
                        if (currentRow < 5) {
                            if (currentRow === 0) {
                                timerGame();
                                timer();
                                currentRow++;
                                currentTile = 0;
                            } else {
                            currentRow = currentRow + 1;
                            currentTile = 0;
                        }
                    }
                }
    };


const addColorToKey = function(keyLetter, color) {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
};


const flipTile = function() {
    const rowTiles = document.querySelector(
        "#guessRow-" + currentRow).childNodes;
    const guess = [];
    const userGuess = guessRows[currentRow].join("");
    let yellow = Speedle.yellow_or_gray(userGuess,wordle);
    let green = Speedle.green_or_grey(userGuess,wordle);
    let guessColours = Speedle.colour_determine(yellow,green);


    rowTiles.forEach(function(tile) {
        guess.push({letter: tile.getAttribute("data"), color: "grey-overlay"});
    });

    guessColours.forEach(function(number, index) {
        if (number === 2){
            guess[index].color = "green-overlay";
        }
        if (number === 1){
            guess[index].color = "yellow-overlay";
        }
    });

    rowTiles.forEach(function (tile, index) {
        setTimeout(function() {
            tile.classList.add("flip");
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });
};



//Code for the Dark/light mode which also sotres the colour preference
//on the users browser
const toggleSwitch = document.querySelector
(".theme-switch input[type='checkbox']");

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
    else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
}

toggleSwitch.addEventListener("change", switchTheme, false);


const currentTheme =
(localStorage.getItem("theme") ? localStorage.getItem("theme") : null);

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (currentTheme === "light") {
        toggleSwitch.checked = true;
    }
}


//Code for the Colour Blind mode which also sotres the colour preference
//on the users browser
const ColourtoggleSwitch = document.querySelector
(".colour-switch input[type='checkbox']");

function ColourswitchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("colour-theme", "blind");
        localStorage.setItem("colour", "blind");
    }
    else {
        document.documentElement.setAttribute("colour-theme", "typical");
        localStorage.setItem("colour", "typical");
    }
}

ColourtoggleSwitch.addEventListener("change", ColourswitchTheme, false);

const currentColour =
(localStorage.getItem("colour") ? localStorage.getItem("colour") : null);

if (currentColour) {
    document.documentElement.setAttribute("colour-theme", currentColour);

    if (currentColour === "blind") {
        ColourtoggleSwitch.checked = true;
    }
}



//Code for the invisible timer which only counts seconds
//used to calculate time multiplier for score
let h2 = 0;
let secGame = 0;
let tGame;

function tickGame(){
    secGame = secGame + 1;
}

function addGame() {
    tickGame();
    h2 = (secGame > 9 ? secGame : secGame);
    timerGame();
}
function timerGame() {
    tGame = setTimeout(addGame, 1000);
}




//Code for visible stopwatch visilbe to the user to see
//how long they've been playing
let h3 = document.getElementsByTagName("h3")[0];
let sec = 0;
let min = 0;
let hrs = 0;
let t;

function tick(){
    sec = sec + 1;
    if (sec >= 60) {
        sec = 0;
        min = min + 1;
        if (min >= 60) {
            min = 0;
            hrs = hrs + 1;
        }
    }
}
function add() {
    tick();
    h3.textContent = (hrs > 9 ? hrs : "0" + hrs)
        + ":" + (min > 9 ? min : "0" + min)
        + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}




//Code for the movable menu anyhwere in the screen
//Can be clicked and dragged around
dragElement(document.getElementById("mydiv"));
dragElement(document.getElementById("mydiv2"));


function dragElement(elmnt) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


//Always updates highscore list at the start
updateScore();