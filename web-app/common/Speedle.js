
import R from "./ramda.js";
import {WORDS} from "./words2.js";

/**
 * Speedle.js is a module to model and play "Speedle" which is a variant
 * on the popular game of wordle.
 * https://en.wikipedia.org/wiki/Wordle
 * This game takes the base gameplay of wordle and incorperates time into it.
 * The faster you finish the game and the less guesses you get, the more points
 * @namespace Speedle
 * @author Lucas Newman
 * @version 2021/22
 */
const Speedle = Object.create(null);

/**
 * Create a new empty board.
 * Optionally with a specified width and height,
 * otherwise returns a standard 7 wide, 6 high board.
 * This is an impure function
 * @memberof Speedle
 * @function
 * @returns {Speedle.Board} An empty board for starting a game.
 */

Speedle.new_empty_board = function () {
    let empty_board = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ];
    return empty_board;
};


/**
 * Generate a random number from 0 up to a max
 * @memberof Speedle
 * @function
 * @param {number} max The maximum guess value
 * @returns {number} The random number
 */

Speedle.randomNumber = function (max) {
    return Math.floor(Math.random() * max);
};

/**
 * Generate a random word from an array of words based on random number
 * 5756 is the number of words in the file array.
 * This is an impure function
 * @memberof Speedle
 * @function
 * @returns {string} The random words
 */

Speedle.ranword = function () {
    const random = WORDS[(Speedle.randomNumber(5756))];
    return random.toUpperCase();
};

/**
 * Check if guessed word is a valid word
 * @memberof Speedle
 * @function
 * @param {string} guess
 * @returns {boolean} True if valid guess, false if invalid guess
 */

Speedle.validateword = function (guess) {
    return (WORDS.includes(guess.toLowerCase()));
};


/**
 * Will return an array with each letter is either grey or yellow
 * @memberof Speedle
 * @function
 * @param {string} guess The guess string a user has inputed
 * @param {string} answer The randomized answer string
 * @param {array} yellows An empty array
 * @returns {array} Output is an array where 0 is a grey square
 * (AKA letter not in word) and a 1 means letter in word (yellow)
 */
Speedle.yellow_or_gray = function (guess, answer, yellows = []) {
    if (guess.length === 0) {
        return (yellows);
    }
    let head = (guess.substring(0, 1));
    if (answer.includes(head)) {
        return Speedle.yellow_or_gray(
            (guess.slice(1)),
            (answer.replace(head, "")),
            [...yellows, 1]
        );
    } else {
        return Speedle.yellow_or_gray(
            (guess.slice(1)),
            (answer.replace(head, "")),
            [...yellows, 0]
        );
    }

};

/**
 * Will return an array with each letter is either grey or green
 * @memberof Speedle
 * @function
 * @param {string} guess The guess string a user has inputed
 * @param {string} answer The randomized answer string
 * @param {array} greens An empty array
 * @returns {array} Output is an array where 0 is a grey square
 * (AKA letter not in word) and a 2 means letter in word and right spot (green)
 */
Speedle.green_or_grey = function (guess, answer, greens = []) {
    if (guess.length === 0) {
        return (greens);
    }
    let head = (guess.substring(0, 1));
    if ((answer.substring(0, 1)) === head) {
        return Speedle.green_or_grey(
            (guess.slice(1)),
            (answer.slice(1)),
            [...greens, 2]
        );
    } else {
        return Speedle.green_or_grey(
            (guess.slice(1)),
            (answer.slice(1)),
            [...greens, 0]
        );
    }

};

/**
 * Combines the two arrays priotizing the 2 of the green function to override
 * the 1 of the yellow function if it is in the same poisiton
 * @memberof Speedle
 * @function
 * @param {function} YEL, should be Speedle.yellow(guess, answers)
 * @param {function} GRE, should be Speedle.green_or_grey(guess, answers)
 * @param {array} colours emptry array to be filled
 * @returns {array} Array of 0, 1, and 2. 0 = grey, 1, yellow, 2 = green.
 */

Speedle.colour_determine = function (YEL, GRE, colours = []) {
    if (YEL.length === 0) {
        return (colours);
    }

    const combine = R.zip(YEL, GRE); //ADD R

    if ((combine[0][0] === 1) && (combine[0][1] === 2)) {
        return Speedle.colour_determine(
            (YEL.slice(1)),
            (GRE.slice(1)),
            [...colours, 2]
        );
    }
    if ((combine[0][0] === 1) && (combine[0][1] === 0)) {
        return Speedle.colour_determine(
            (YEL.slice(1)),
            (GRE.slice(1)),
            [...colours, 1]
        );
    }
    if ((combine[0][0] === 0) && (combine[0][1] === 0)) {
        return Speedle.colour_determine(
            (YEL.slice(1)),
            (GRE.slice(1)),
            [...colours, 0]
        );
    }
};

/**
 * @memberof Speedle
 * @function
 * @param {number} remainingGuesses
 * @returns {number} The score you receive before the time multiplier
 */
Speedle.GuessPoints = function (remainingGuesses) {
    if (remainingGuesses === 0) {
        return 20;
    }
    if (remainingGuesses === 1) {
        return 10;
    }
    if (remainingGuesses === 2) {
        return 7;
    }
    if (remainingGuesses === 3) {
        return 4;
    }
    if (remainingGuesses === 4) {
        return 2;
    }
    if (remainingGuesses === 5) {
        return 1;
    }
    if (remainingGuesses === 6) {
        return 0;
    }
};

/**
 * @memberof Speedle
 * @function
 * @param {number} time
 * @returns {number} The mupltiplier for the score
 */
Speedle.timerMultiplier = function (time) {
    if (time <= 10) {
        return 100;
    }
    if (10 < time && time <= 30) {
        return 50;
    }
    if (30 < time && time <= 60) {
        return 25;
    }
    if (60 < time && time <= 90) {
        return 15;
    }
    if (90 < time && time <= 120) {
        return 10;
    }
    if (120 < time && time <= 300) {
        return 7;
    }
    if (300 < time && time <= 500) {
        return 5;
    }
    if (500 < time && time <= 1000) {
        return 3;
    }
    if (1000 < time) {
        return 1;
    }
};

/**
 * Uses the score based on the number of guesses and multiplies it by the
 * multiplier which is based on how long it takes to complete the game
 * @memberof Speedle
 * @function
 * @param {number} guessScore Score based
 * on number of guesses, should be Speedle.GuessPoints(guessesRemaining)
 * @param {number} timeScore Score based on number
 * of how long to finis, should be Speedle.timerMultiplier(time)
 * @returns {number} The final score the player recieves
 */

Speedle.Score = function (guessScore, timeScore) {
    return (guessScore * timeScore);
};


export default Object.freeze(Speedle);

