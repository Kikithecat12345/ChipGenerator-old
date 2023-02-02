/**
 * Chip generator made by Kiki
 * Instructions, credits and other stuff is in the Readme.
 */

/**
 * Generates a prefix for a specified -illion. 
 * Ex. prefixNum = 3 returns "Trillion" and PrefixNum = 3 returns "Trigintillion"
 * @param {Number} prefixNum The number of the illion to generate a prefix for.
 * @returns {String} The prefix for the illion. The number of the illion is 10^(3*prefixNum+3).
 */

var hundredsPrefixes = [
"centi", // 1
"ducenti",
"trecenti",
"quadragcenti",
"quingenti",
"sescenti",
"septingenti",
"octingenti",
"nongenti" // 9
];
var tensPrefixes = [
"deci", // 1
"viginti",
"triginta",
"quadraginta",
"quinquaginta",
"sexaginta",
"septuaginta",
"octoginta",
"nonaginta" // 9
];
var onesPrefixes = [
"un", // 1
"duo",
"tre",
"quattuor",
"quinqua",
"se",
"septe",
"octo",
"nove" // 9
];

var smallPrefixes = [
"milli", // 1
"billi",
"trilli",
"quadrilli",
"quintilli",
"sextilli",
"septilli",
"octilli",
"nonilli" // 9
]

function generateIllionPrefix(prefixNum) {
    // split prefixNum into sections of 3 digits right to left
    // ex. 3 -> [3], 12 -> [12], 123 -> [123], 1234 -> [1,234], 12345 -> [12,345], 123456 -> [123,456]
    let prefixNumSections = [];
    while (prefixNum > 0) {
        prefixNumSections.push(prefixNum % 1000);
        prefixNum = Math.floor(prefixNum / 1000);
    }
    // reverse the array so we can read it left to right
    prefixNumSections.reverse();

    // is it less than 10?
    if (prefixNumSections.length == 1 && prefixNumSections[0] < 10) {
        // use the small prefixes
        return smallPrefixes[prefixNumSections[0] - 1] + "on";
    }

    // for each number in prefixNumSections in reverse order, generate the prefix for that section
    let prefix = "";
    for (let i = prefixNumSections.length - 1; i >= 0; i--) {
        // is it 0?
        if (prefixNumSections[i] == 0) {
            // add "nilli" to the prefix
            prefix = "nilli" + prefix;
        } else if (prefixNumSections[i] < 10) { // is it 00X?
            // use the small prefixes
            prefix = smallPrefixes[prefixNumSections[i] - 1] + prefix;
        } else {
            // We need to treat the hundreds, tens, and ones separately cause they have seperate prefixes.
            // Also, they are reversed. you write 123-illion as Un-Viginti-Trecenti-llion.
            // One last thing to look out for is the fact that certain ones prefixes need to be spelled differently depending on what is infront of it. English sucks.
            // https://en.wikipedia.org/wiki/Names_of_large_numbers#Extensions_of_the_standard_dictionary_numbers

            let lastPrefixAdded = "";

            // is there a hundreds digit?
            if (prefixNumSections[i] >= 100) {
                // add the hundreds prefix
                lastPrefixAdded = hundredsPrefixes[Math.floor(prefixNumSections[i] / 100) - 1]; // minus one cause index 0 is 1
                prefix = lastPrefixAdded + prefix;
            }
            // is there a tens digit?
            if (prefixNumSections[i] % 100 >= 10) {
                // add the tens prefix
                lastPrefixAdded = tensPrefixes[Math.floor(prefixNumSections[i] % 100 / 10) - 1];
                prefix = lastPrefixAdded + prefix; 
            }
            // is there a ones digit?
            if (prefixNumSections[i] % 10 >= 1) {
                // we need to treat this one special depending on the prefix last added. 
                let onesDigit = prefixNumSections[i] % 10;
                switch (onesDigit) { // depending on the ones digit, we need to check grammar
                    case 3:
                        // if the last prefix added was Viginti, Triginta, Quadraginta, Quinquaginta, Centi, Trecenti, Quadragcenti, or Quingenti, we need to add "tres" instead of "tre"
                        if (lastPrefixAdded == "viginti" || 
                            lastPrefixAdded == "triginta" || 
                            lastPrefixAdded == "quadraginta" || 
                            lastPrefixAdded == "quinquaginta" || 
                            lastPrefixAdded == "centi" || 
                            lastPrefixAdded == "trecenti" || 
                            lastPrefixAdded == "quadragcenti" || 
                            lastPrefixAdded == "quingenti") 
                        {
                            prefix = "tres" + prefix;
                        } else prefix = onesPrefixes[onesDigit - 1] + prefix;
                        break;
                    case 6:
                        // same as above, but there's 2 cases, changing to "ses" or "sex" instead of "se"
                        if (lastPrefixAdded == "viginti" || 
                            lastPrefixAdded == "triginta" || 
                            lastPrefixAdded == "quadraginta" || 
                            lastPrefixAdded == "quinquaginta" || 
                            lastPrefixAdded == "centi" || 
                            lastPrefixAdded == "trecenti" || 
                            lastPrefixAdded == "quadragcenti" || 
                            lastPrefixAdded == "quingenti") {
                            prefix = "ses" + prefix;
                        } else if (lastPrefixAdded == "octoginta" ||
                                   lastPrefixAdded == "centi" ||
                                   lastPrefixAdded == "octingenti") 
                        {
                            prefix = "sex" + prefix;
                        } else prefix = onesPrefixes[onesDigit - 1] + prefix;
                        break;
                        // septe and nove are like above, but change to "septem" and "novem" or "septen" and "noven" instead of "septe" and "nove"
                    case 7:
                        if (lastPrefixAdded == "viginti" ||
                            lastPrefixAdded == "octoginta" ||
                            lastPrefixAdded == "octingenti")
                        {
                            prefix = "septem" + prefix;
                        } else if (lastPrefixAdded == "deci" ||
                                   lastPrefixAdded == "triginta" ||
                                   lastPrefixAdded == "quadraginta" ||
                                   lastPrefixAdded == "quinquaginta" ||
                                   lastPrefixAdded == "sexaginta" ||
                                   lastPrefixAdded == "septuaginta" ||
                                   
                                   lastPrefixAdded == "centi" ||
                                   lastPrefixAdded == "ducenti" ||
                                   lastPrefixAdded == "trecenti" ||
                                   lastPrefixAdded == "quadragcenti" ||
                                   lastPrefixAdded == "quingenti" ||
                                   lastPrefixAdded == "secenti" ||
                                   lastPrefixAdded == "septingenti")
                        {
                            prefix = "septen" + prefix;
                        } else prefix = onesPrefixes[onesDigit - 1] + prefix;
                        break;
                    case 9:
                        if (lastPrefixAdded == "viginti" ||
                            lastPrefixAdded == "octoginta" ||
                            lastPrefixAdded == "octingenti")
                        {
                            prefix = "novem" + prefix;
                        } else if (lastPrefixAdded == "deci" ||
                                   lastPrefixAdded == "triginta" ||
                                   lastPrefixAdded == "quadraginta" ||
                                   lastPrefixAdded == "quinquaginta" ||
                                   lastPrefixAdded == "sexaginta" ||
                                   lastPrefixAdded == "septuaginta" ||
                                   
                                   lastPrefixAdded == "centi" ||
                                   lastPrefixAdded == "ducenti" ||
                                   lastPrefixAdded == "trecenti" ||
                                   lastPrefixAdded == "quadragcenti" ||
                                   lastPrefixAdded == "quingenti" ||
                                   lastPrefixAdded == "secenti" ||
                                   lastPrefixAdded == "septingenti")
                        {
                            prefix = "noven" + prefix;
                        } else prefix = onesPrefixes[onesDigit - 1] + prefix;
                        break;
                    default:
                        prefix = onesPrefixes[onesDigit - 1] + prefix;
                        break;
                }; 
            }
        }
    }

    // add "llion" to the end UNLESS ends in -illi, then add the "on" to the end of that
    if (prefix.endsWith("illi")) {
        prefix = prefix.slice(0, -4) + "illion";
    } else prefix += "llion";
    return prefix;
};  

console.log("test 1: " + generateIllionPrefix(10));
