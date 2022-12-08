const answer_length = 5;
const rounds = 6;
const letters = document.querySelectorAll(".board-letter");

// initializer function to set game variables. Async was used to allow 'await' keyword later
async function init() {
    let row = 0;
    let guess = 0;
    let finish = false;
    let loading = true;

    // Front end API to get the word to guess | This came directly from frontend masters
    // The guy teaching the course, Brian Holt, walked through all of this code pretty
    // much, so it's not completely original, like the API stuff, it is pretty much word
    // for word Brian Holt's code.
    const res = await fetch("https://words.dev-apis.com/word-of-the-day&random=1");
    const {word: wordRes} = await res.json()
    const word = wordRes.toUpperCase();
    const wordParts = word.split("");
    loading = false;
    setLoading(loading);

    function addLetter(letter) {
        if (guess.length < answer_length) {
            guess += letter;
        } else {
            current = guess.substring(0, guess.length - 1) + letter;
        }

        letters[row * answer_length + guess.length - 1].innerText = letter;
    }

    async function commit() {
        if (guess.length !== answer_length) {
            return;
        }
        loading = true;
        setLoading(loading);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({word: guess}),
        });
        const {validWord} = await res.json();
        loading = false;
        setLoading(loading);

        if (!validWord) {
            invalidWord();
            return;
        }

        const guessParts = guess.split("");
        const map = makeMap(wordParts);
        let allRight = true;

        for (let i = 0; i < answer_length; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[row * answer_length + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        for (let i = 0; i < answer_length; i++) {
            if (guessParts[i] === wordParts[i]) {

            } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
                allRight = false;
                letters[row * answer_length + i].classList.add("close");
                map[guessParts[i]]--;
            } else {
                allRight = false;
                letters[row * answer_length + i].classList.add("wrong");
            }
        }

        row++;
        guess = "";
        if (allRight) {
            alert("Winner winner, chicken dinner!");
            finish = true;
        } else if (row === rounds) {
            alert(`You lose, the word was ${word}`);
            finish = true;
        }
    }

    function undo() {
        guess = guess.substring(0, guess.length - 1);
        letters[row * answer_length + guess.length].innerText = "";
    }

    function invalidWord() {
        for (let i = 0; i < answer_length; i++) {
            letters[row * answer_length + i].classList.remove("invalid");

            setTimeout(
                () => letters[row * answer_length + i].classList.add("invalid"),
                10
            );
        }
    }

    document.addEventListener("keydown", function handleKeyPress(event) {
        if (finish || loading) {
            return;
        }

        const action = event.key;

        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            undo();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {

        }
    });
}
// /^[a-zA-Z]$/ is something I learned from frontend masters. The stuff in
// the / / is a regular expression, and it's a data type in Javascript.
// it tests what is passed into it to see if it is a valid character between
// a - z.
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

console.log(isLetter("a"));
console.log(isLetter("abc"));
console.log(isLetter("1"));

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        }
        else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

init();