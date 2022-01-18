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
        let lastIllionSize = illionIndexes.length - illionPairs;
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
                    continue; // if it's zero, don't print anything
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
        for (var i=1; i < (regexResultOnes.length-1); i++) {
            // look for the next Illion
            let nextIllionTens = regexResultTens.indices.find(index => index[0] === regexResultOnes.indices[i][1] + 1) 
            let nextIllionHundreds = regexResultHundreds.indices.find(index => index[0] === regexResultOnes.indices[i][1] + 1)
            // if the next illion is a ones type OR there is no next illion move on
            let indexOfNextIllion = (nextIllionTens ?? 0) + (nextIllionHundreds ?? 0)
            if (!indexOfNextIllion) continue;

        }
    }
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
