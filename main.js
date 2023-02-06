/**
 * Chip generator made by Kiki
 * Instructions, credits and other stuff is in the Readme.
 */

// imports
import { generateIllionPrefix } from "./numbers.js";
import Jimp from "jimp";
import process from "process";
import { readConfigFile } from "./read-config.js";

let config = readConfigFile();

console.log("Loaded config:", config);

/**
 * Generates all chip textures based on the user's settings.
 * refer to the main.js for a list of settings.
 */
function makeChipTextures() {
  // determine which chips to generate
  let chipsToGenerate = [];
  // format for each entry: [pow of 10, pattern]

  switch (mode) {
    case "single":
    default:
      chipsToGenerate.push([minimum, 1]);
      break;

    case "range":
      for (let i = minimum; i <= maximum; i++) {
        // iterate through the range of powers of 10.
        // check for pattern by iterating patternSwitchPoints until the current power of 10 is less than the current switch point.
        let pattern = 0;
        for (let j = 0; j < patternSwitchPoints.length; j++) {
          // iterate through patternSwitchPoints
          if (i < patternSwitchPoints[j]) {
            // if the current power of 10 is less than the current switch point...
            // set the pattern to the current pattern, and break out of the loop.
            pattern = j;
            break;
          }
        }
        // iterate through the pattern, and add each chip to the list.
        for (let j = 0; j < patterns[pattern].length; j++) {
          // for each entry in patterns[pattern] (the current pattern)...
          chipsToGenerate.push([i, patterns[pattern][j]]); // add the current power of 10 and the current pattern entry to the list.
        }
      }
      break;

    case "set":
      switch (chipSetMode) {
        case 0: // powers of 10
          for (let i = 0; i < chipSet.length; i++)
            chipsToGenerate.push([chipSet[i], 1]);
          break;

        case 1: // illions
          for (let i = 0; i < chipSet.length; i++)
            chipsToGenerate.push([chipSet[i] * 3 + 3, 1]); // convert illions to powers of 10
          break;

        case 2: // custom
        default:
          // we need to convert the chipSet to powers of 10, and add a pattern for the starting digits.
          for (let i = 0; i < chipSet.length; i++) {
            /* we need to extract the starting digits but also convert it to a power of 10.
             * as an example, let's use 250,000.
             * 250,000 = 2.5 * 10^5, so to get these 2 numbers, we do the following:
             * to get the power of 10 cleanly, we use Math.log10, which returns log base 10 of the number.
             * in other words, the result of Math.log10 is the number that you need to raise 10 to the power of to get the number.
             * by flooring the result, we get the nearest clean power of 10.
             * so, Math.log10(250000) =~ 5.39794, so Math.floor(Math.log10(250000)) = 5.
             *
             * to get the starting digits, we divide the number by 10 to the power of the number we just got.
             * in our example, 10^5 = 100,000. so if we divide 250,000 by 100,000 we get 2.5.
             *
             * we need to do this because Number variables are stored as floating point numbers, which means that they are not exact.
             * this method allows us to store the magnitude of the number, and the starting digits, which is all that matters for our use case.
             */

            let pow = Math.floor(Math.log10(chipSet[i]));
            let pattern = chipSet[i] / Math.pow(10, pow);
          }
          break;
      }
      break;

    case "rangeSet":
      // we need to do both range and set, but also check for duplicates.
      // we can start by doing the range part.

      // copied from range mode, but removed comments.
      for (let i = minimum; i <= maximum; i++) {
        let pattern = 0;
        for (let j = 0; j < patternSwitchPoints.length; j++) {
          if (i < patternSwitchPoints[j]) {
            pattern = j;
            break;
          }
        }

        for (let j = 0; j < patterns[pattern].length; j++) {
          chipsToGenerate.push([i, patterns[pattern][j]]);
        }
      }
      // now we need to do the set part.
      switch (chipSetMode) {
        case 0: // powers of 10
          for (let i = 0; i < chipSet.length; i++)
            chipsToGenerate.push([chipSet[i], 1]);
          break;

        case 1: // illions
          for (let i = 0; i < chipSet.length; i++)
            chipsToGenerate.push([chipSet[i] * 3 + 3, 1]);
          break;

        case 2: // custom
        default:
          for (let i = 0; i < chipSet.length; i++) {
            let pow = Math.floor(Math.log10(chipSet[i]));
            let pattern = chipSet[i] / Math.pow(10, pow);
          }
          break;
      }
      // now we need to remove duplicates.
      chipsToGenerate.forEach((chip, index) => {
        chipsToGenerate.forEach((chip2, index2) => {
          if (index != index2 && chip[0] == chip2[0] && chip[1] == chip2[1])
            chipsToGenerate.splice(index2, 1);
        });
      });
      break;
  }

  // LICENSE: the following function (and nested functions therein) is licensed under the "you probably aren't going to use this anyway" license.
  function checkPlaqueMode(chip) {
    function checkPlaqueStartType() {
      function getPowerOf10() {
        return 10 ** chip[0] * chip[1] >= plaqueStart;
      }
      return (plaqueMode & 0b100) > 0 ? chip[0] >= plaqueStart : getPowerOf10();
    }
    return (
      (plaqueMode & 0b001) > 0 &&
      ((plaqueMode & 0b010) > 0 || checkPlaqueStartType())
    );
  }

  chipsToGenerate.forEach((chip, i) => {
    if (checkPlaqueMode(chip)) {
    } else {
    }
  });
}
