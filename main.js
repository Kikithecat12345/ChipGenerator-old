/**
 * Chip generator made by Kiki
 * Instructions, credits and other stuff is in the Readme.
 */



// Below this you shouldn't need to touch unless you are doing silly stuff
const namesBelowTen = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const namesBelowTwenty = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
const namesBelowHundred = ["twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"]
const theRest = ["hundred", "thousand"]

const namesBelowDecillion = ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
// each inner array is main part, then prefix/suffix bits.
const illionOnes = [[""],["un"],["duo"],["tre", "s"],["quattuor"],["quinqua"],["se", "sx"],["septe", "mn"],["octo"],["nove", "mn"]]; 
const illionTens = [[""],["deci", "n"],["viginti", "ms"],["triginta", "ns"],["quadraginta", "ns"],["quinquaginta", "ns"],["sexaginta", "n"],["septuaginta", "n"],["octoginta", "mx"],["nonaginta"]];
const illionHundreds = [[""],["centi", "nx"],["ducenti", "n"],["trecenti", "ns"],["quadringcenti", "ns"],["quingenti", "ns"],["sescenti", "n"],["septingenti", "n"],["octingenti","mx"],["nongenti"]];
const illionThousands = "milli";
const illionZero = "nilli";

// regexes to find the illion parts above

const illionOnesRegex = /(un|duo|tre|quattuor|quinqua|se|septe|octo|nove)/gid;
const illionTensRegex = /(deci|viginti|triginta|quadraginta|quinquaginta|sexaginta|septuaginta|octoginta|nonaginta)/gid;
const illionHundredsRegex = /(centi|ducenti|trecenti|quadringcenti|quingenti|sescenti|septingenti|octingenti|nongenti)/gid;



/**
 * Takes in a power of 10 and outputs an array of all the -illions at and below the power of 10.
 * @param {Number} maxPower Largest power of 10
 * @returns {String[]} List of -illions
 */
function calcNames(maxPower) {
    // subtract the power by 3 then divide by 3 to get the illion index.
    let illionIndex = Math.floor((maxPower - 3) / 3);
    let illionList = [];
    for (i = illionIndex; i > 0; i--) {
        let illionIndexes = i.toString().split("").map(Number).reverse();
        let illionPairs = illionPairing(illionIndexes);
        let illionName = "";
        illionIndexes.forEach((digit, index) => {
            // calculate which set the digit is in
            if (index > illionPairs * 3) {
                // last set
            } else {
                // which set is it in
                let set = Math.floor(index / 3);
                let dIndex = index % 3;
                // check if all the digits in the set are 0:
                if (illionIndexes.slice(set * 3, set * 3 + 3).every(digit => digit === 0)) {
                    // check if it's the first in the set
                    if (dIndex === 0) {
                        // check it isn't the first or last set
                        if (!(set === 0 || set === illionPairs)) {
                            // if it gets here, it's the first in the set, and not the first or last set, therefore print 'nilli'
                            illionName = illionZero + illionName;
                        }
                    }
                } else if (digit === 0) { // check if it's zero
                    // if it's zero, don't print anything
                } else if (set === 0 && dIndex === 0 && illionIndexes.slice(set * 3, set * 3 + 3).filter(digit => digit !== 0).length === 1) {  // check if it's the first set and it's the first digit in the set and it's the only non-zero in the set
                    // if it gets here print the corrosponding illion in namesBelowDecillion:
                    illionName = namesBelowDecillion[digit - 1] + illionName;

                } else {
                    // if it gets here, print the name of the digit depending on the position in the set. We will deal with the infixes later using regex magic.
                    switch(dIndex) {
                        case 0: // ones
                            illionName = illionOnes[digit][0] + illionName;
                            break;
                        case 1: // tens
                            illionName = illionTens[digit][0] + illionName;
                            break;
                        case 2: // hundreds
                            illionName = illionHundreds[digit][0] + illionName;
                            break;
                    }
                }
            }
        });
        // add the infixes by finding the ones and testing if they are adjacent to tens/hundreds and that the prefix requirements are met.
        let regexResultOnes = illionOnesRegex.exec(illionName);
        let regexResultTens = illionTensRegex.exec(illionName);
        let regexResultHundreds = illionHundredsRegex.exec(illionName);
        // for each ones digit...
        if (regexResultOnes !== null) {
            for (var i=1; i <= (regexResultOnes.length); i++) {
                let onesIndex = illionOnes.findIndex((value, index) => illionOnes[index][0] === regexResultOnes[i]); // iterate through illionOnes, check that the illionOnes = regexResultOnes
                let tensIndex, hundredsIndex;
                if (regexResultTens !== null) {
                    tensIndex = illionTens.findIndex((value, index) => { // look for an illionTens in regexResultTens with a index after the ones.
                        for (var j=0; j < (regexResultTens.length); j++) { // for each of the tens results...
                            if (regexResultOnes.indices[i-1][1] + 1 === regexResultTens.indices[j][0]) { // check if it's index is one above the ones index
                                return illionTens[index][0] === regexResultTens[j + 1]; // check if it's even the index we want
                            }
                        }
                        return false;
                    });
                }
                if (regexResultHundreds !== null) {
                    hundredsIndex = illionHundreds.findIndex((value, index) => {
                        for (var j=0; j < (regexResultTens.length); j++) {
                            if (regexResultOnes.indices[i-1][1] + 1 === regexResultHundreds.indices[j][0]) {
                                return illionHundreds[index][0] === regexResultHundreds[j + 1];
                            }
                        }
                        return false;
                    }); 
                }   
                if (regexResultTens.indices.find((value, index, indices) => indices[index][0] === regexResultOnes.indices[i-1][1] + 1) !== -1) { // check if the start index of the tens digit is directly after the ones digit
                    let infixLetter = checkForCommonLetters(illionOnes[onesIndex][1], illionTens[tensIndex][1]) // check for infix letters
                    if (infixLetter != "") { // if there isn't an infix letter, do nothing
                        illionName = insertString(illionName, infixLetter, regexResultOnes.indices[i-1][1] + 1); // insert the infix letter
                    }
                } else if (regexResultHundreds.indices.find((value, index, indices) => indices[index][0] === regexResultOnes.indices[i-1][1] + 1) !== -1) { // same but hundreds
                    let infixLetter = checkForCommonLetters(illionOnes[onesIndex][1], illionHundreds[hundredsIndex][1]) // check for infix letters
                    if (infixLetter != "") { // if there isn't an infix letter, do nothing
                        illionName = insertString(illionName, infixLetter, regexResultOnes.indices[i-1][1] + 1); // insert the infix letter
                    } else continue; // else, do nothing
                }
            }
        }
        illionList.push(illionName);
    }
    return illionList;
}

// Subfunctions

/**
 * Takes in an array of digits and calculates the # of sets of 3 possible, while leaving up to 4 at the end.
 * @param {Number[]} indexes Array of digits
 * @returns {Number} # of sets
 */
function illionPairing(indexes) {
    if (indexes.length <= 4) return 1;
    let illionIndexes = indexes;
    let illionPairs = 0;
    while (illionIndexes.length > 4) {
        illionIndexes.splice(-3,3);
        illionPairs++;
    }
    return illionPairs;
}
/**
 * Takes in 2 strings and finds all common letters between them. Any letters that are in both strings multiple times are counted as multiple.
 * @param {String} str1 First String 
 * @param {String} str2 Second String
 * @returns {String} All common letters between the two strings
 */
function checkForCommonLetters(str1, str2) {
    let commonLetters = "";
    for (let i = 0; i < str1.length; i++) {
        if (str2.includes(str1[i])) {
            commonLetters += str1[i];
        }
    }
    return commonLetters;    
}
/**
 * Takes in 2 strings and places str2 into str1 at the index of the specified index.
 * @param {String} str1 First String
 * @param {String} str2 Second String
 * @param {Number} index Index to place str2 into str1
 * @returns {String} str1 with str2 placed in it 
 */
function insertString(str1, str2, index) {
    return str1.slice(0, index) + str2 + str1.slice(index);
}

console.log(calcNames(120));