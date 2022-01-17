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
            if (index == 0 && digit != 0) {
                illionName += namesBelowDecillion[digit - 1];
            } else if (index > illionPairs * 3) {
                //TODO
            } else { //TODO: add condition for 'nilli'
                switch(index % 3) {
                    case 0:
                        illionName = illionOnes[digit][0] + "something" + illionName; //TODO: Write the code to determine infixes
                        break;
                }
            }
        });
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
        illionIndexes.pop();
        illionIndexes.pop();
        illionIndexes.pop();
        illionPairs++;
    }
    return illionPairs;
}
