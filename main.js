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

// === user settings ===

// = I/O settings =
const chipTexture = "chip.png";
const plaqueTexture = "plaque.png";
const chipOutputFolder = "./chips/";
const palette = "palette.png"; // this file holds all the colors for the chips, in order.
const format = "png";
// supported formats are: png, jpg, bmp. if not one of these, or omitted, defaults to png.

// = chip settings =

const mode = "range";
/* This variable determines how the chips are generated.
 * options are:
 * single: generates only the chip defined by the minimum.
 * range: generates all chips between the minimum and maximum.
 * set: generates all chips defined by the chipSet variable.
 * rangeSet: generates all chips between the minimum and maximum, and all chips defined by the chipSet variable. duplicates are not removed.
 *** if not one of these options, defaults to single.
 */

const minimum = 0; // inclusive.
const maximum = 6; // inclusive.
/* The minimum and maximum values are powers of 10.
 * i.e. 0 = 10^0, 1 = 10^1, 2 = 10^2, etc.
 * if the mode is set to "single", the minimum is the only value used.
 * if the mode is set to "range", the minimum and maximum are used, inclusive.
 */

const chipSet = [1, 5, 10, 50, 100, 500, 1000];
const chipSetMode = 2;
/* The chipSetMode variable determines how the chipSet variable is used.
 * options are:
 * 0 / Powers of 10: the chipSet variable is a list of powers of 10, i.e. 0 = 10^0, 1 = 10^1, 2 = 10^2, etc.
 * 1 / Illions: the chipSet variable is a list of illions. to convert an illion to a power of 10, multiply it by 3 and add 3.
 ** example: million = 10^6 = 3*1 + 3 = 6
 * 2 / Custom: the chipSet variable is a list of custom values. these values are used directly.
 * default: 2
 */

const usePalette = true;
// if true, uses the palette defined in the palette variable. if false, uses random colors, and groups of 3 chips will have similar colors.
// if the palette is not defined, or the file is not found, this setting is ignored, and random colors are used.

const patterns = [[1, 5], [1]]; // leave the last pattern as [1] to avoid errors.
const patternSwitchPoints = [3];
const patternMode = 0;
/* These variables define the pattern of the chips generated in "range" or "rangeSet" mode.
 * patterns is a list of lists of numbers that define the pattern.
 ** ex. 1: [1, 5] - 1, 5, 10, 50, 100, etc.
 ** ex. 2: [1, 2, 5] - 1, 2, 5, 10, 20, 50, 100, 200, 500, etc.
 ** ex. 3: [1, 2.5,] - 1, 2, 5 (2.5 is ignored because it's not a power of 10) 10, 25, 50, 100, 250, 500, etc.

 * patternSwitchPoints is a list of numbers that define when to switch to the next pattern. These numbers are powers of 10.
 * if there is not a last pattern, it will use [1]. excess numbers after this point are ignored.
 * if not enough numbers are defined, it will not use any patterns that don't have a switch point defined.
 *** if the mode is set to 0, ("all") the pattern is ignored.
 ** ex: (using ex.1 from above) [3] - 1, 5, 10, 50, 100, 1000, 10k, 100k, 1M, etc.
 *** NOTE: negative numbers go from highest to lowest, so if you are using negative powers of 10, 0.0001 is before 0.001, etc.

 * patternMode determines how the pattern is used. default is 0.
 * options are:
 * 0 / first: first pattern is used for all chips.
 * 1 / normal: patterns are used in order, and switch when the switch points are reached.
 * 2 / none: patterns are ignored, and all chips are clean powers of 10.
 */

plaqueStart = 10000;
plaqueMode = 0b011;
/* These variables determine when to use the plaque model.
 * plaqueStart is the value at which to start using the plaque model, inclusive.
 * plaqueMode determines how the plaque model is used. It is a bitfield.
 * if bit 0 is set, the plaque model is used. else, all other bits are ignored.
 * if bit 1 is set, the plaque model is used according to the plaqueStart value, inclusive. else, it is used exclusively.
 * if bit 2 is set, plaqueStart is interpreted as a power of 10. else, it is interpreted as a custom value.
 ** ex. 1: plaqueMode = 0b011 - plaques are used at plaqueStart, inclusive, and plaqueStart is interpreted as a custom value.
 ** ex. 2: plaqueMode - 0bx01 - plaques are the only model used.
 ** ex. 3: plaqueMode = 0bXX0 - plaques are not used.
 */

// = text settings =

const chipTextCenter = [0, 0];
const plaqueTextCenter = [0, 0];
// center of the text, in pixels, from the top left of the texture. positive is down and right.

const chipTextSize = 12;
const plaqueTextSize = 12;
// size of the text, in pixels.

const chipTextFont = "Fira Code";
const plaqueTextFont = "Fira Code";
// font of the text. must be installed on the system.

// === end of user settings, don't edit below this line unless you know what you're doing. ===

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
