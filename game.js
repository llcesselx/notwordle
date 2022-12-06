// /^[a-zA-Z]$/ is something I learned from frontend masters. The stuff in
// the / / is a regular expression and is a data type in Javascript.
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

console.log(isLetter("a"));
console.log(isLetter("abc"));
console.log(isLetter("1"));