import Speedle from "../common/Speedle.js";


const throw_if_not_ended = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    if (ended_word != "2,2,2,2,2") {
    // info on why using string to compare to array and
    // why using != instead of !==
    // when trying to compare array to array, test failed multiple time
    // https://stackoverflow.com/questions/13856597/why-does-and-others-return-false-in-javascript#:~:text=Note%20that%20%3D%3D%3D%20never%20causes,far%20more%20reliable%20than%20%3D%3D%20.
        throw new Error(
            "The Correct word is not being reported as correct and all green."
        );
    }
};

const throw_if_not_all_grey = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    console.log(ended_word);
    if (ended_word != "0,0,0,0,0") {
        throw new Error(
            "The wrong guess is not being reported as all wrong (all grey)."
        );
    }
};

const throw_if_not_all_green = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    console.log(ended_word);
    if (ended_word != "2,2,2") {
        throw new Error(
            "Green isnt the priotity colour even though it should be."
        );
    }
};

const throw_if_not_alligned = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    console.log(ended_word);
    if (ended_word != "1,0,0,0,0") {
        throw new Error(
            "Double counting yellow lettrs even though there should only be one"
        );
    }
};

const throw_if_not_positioned = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    console.log(ended_word);
    if (ended_word != "0,2,1,0,0") {
        throw new Error(
            "The proper sequence of green, then yellow is not being followed."
        );
    }
};

const throw_if_not_same_gre = function (UsGuess, Word) {
    let yellow = Speedle.yellow_or_gray(UsGuess,Word);
    let green = Speedle.green_or_grey(UsGuess,Word);
    let ended_word = Speedle.colour_determine(yellow,green);
    console.log(ended_word);
    if (ended_word != "0,0,0,0,2") {
        throw new Error(
            `The correct colours are not being displayed.
Letter should be green not yellow`
        );
    }
};


describe("Checking each letter in guess against answer", function () {
    it(
        `Given two of the same letter in an answer,
when a player plays a guess with only one of those two letters,
if its in one of the two correct postions,
then make sure green is the overriding colour.`,
         function () {
            const userGuess = "CCCCA";
            const wordle = "BBBAA";
            throw_if_not_same_gre(userGuess,wordle);

    });

    it(`Given a guess two of the Same letter, and one is in the correct postion,
and the other is in the word but incorrect postion, then the letter in the
corect postion should be green, and the one in the incorrect postion
should be yellow.`,
    function () {
        const userGuess = "CBBCC";
        const wordle = "BBAAA";
        throw_if_not_positioned(userGuess,wordle);

    });



    it(
        `Given two of the same letter in a guess, when the answer only
contains one of those two double letters and neither is in the
correct postion, only the first letter should be highlighted yellow.`,
         function () {
            const userGuess = "AABBB";
            const wordle = "CCCCA";
            throw_if_not_alligned(userGuess,wordle);

    });




    it(
        `If a letter is in the correct postion for the guess,
then make sure it is green not yellow.`,
         function () {
            const userGuess = "AAA";
            const wordle = "AAA";
            throw_if_not_all_green(userGuess,wordle);


    });



    it(
        `If the guess and answer are the same,
then all the letter should be green.`,
         function () {
            //Can Change the words around to test different combinations
            const userGuess = "HELLO";
            const wordle = "HELLO";
            throw_if_not_ended(userGuess,wordle);

    });





    it(
        `Given a guess and answer with no common letters,
then all the tiles should flip grey.`,
        function () {
            const userGuess = "ABCDE";
            const wordle = "FGHIJ";
            throw_if_not_all_grey(userGuess,wordle);


    });

});





describe("Checking if guess is valid", function () {
    it (
        `A word of less than 5 characters, is an invalid guess`,
        function () {
            const shortWord = "HELPS";
            const wordLength = shortWord.length;
            if (Speedle.validateword(shortWord) === false && wordLength < 5) {
                throw new Error (
                    `The word is not a valid word because it is too short.
The current word is ` + wordLength + `, but it should be 5.`

                );
            }
        });


    it (
        `A word of 5 characters, but not a real word, is an invalid guess`,
        function () {
            const shortWord = "HELPS";
            const wordLength = shortWord.length;
            if (Speedle.validateword(shortWord) === false && wordLength === 5) {
                throw new Error (`The word is the correct length,
but it is not a valid word because it does not exist`
                );
            }
        });

});