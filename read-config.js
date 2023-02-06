import { readIniFileSync } from "read-ini-file";
import fs from "fs";
import process from "process";

// readConfigFile reads and parses the 'config.ini' file
// it also copies the 'config.example.ini' => 'config.ini' if it doesn't exist
export function readConfigFile() {
  let config;
  try {
    config = readIniFileSync("./config.ini");
  } catch (e) {
    if (e.message.indexOf("no such file or directory")) {
      console.info("Creating 'config.ini' as it currently doesn't exist");
      fs.copyFileSync("./config.example.ini", "./config.ini");
      try {
        config = readIniFileSync("./config.ini");
      } catch (e) {
        console.error("Error opening 'config.ini':", e);
        process.exit(1);
      }
    } else {
      console.error("Error opening 'config.ini':", e);
      process.exit(1);
    }
  }
  const propsParseJson = {
    Chip: {
      chipSet: 1,
      patterns: 1,
      patternSwitchPoints: 1,
      minimum: 2,
      maximum: 2,
      chipSetMode: 2,
      patternMode: 2,
      plaqueStart: 2,
      plaqueMode: 3,
    },
    Text: {
      chipTextCenter: 1,
      plaqueTextCenter: 1,
      chipTextSize: 2,
      plaqueTextSize: 2,
    },
  };
  Object.keys(propsParseJson).forEach((x) => {
    Object.keys(propsParseJson[x]).forEach((y) => {
      try {
        switch (propsParseJson[x][y]) {
          case 1:
            config[x][y] = JSON.parse(config[x][y]);
            break;
          case 2:
            config[x][y] = parseInt(config[x][y], 10);
            break;
          case 3:
            config[x][y] = parseInt(config[x][y], 2);
            break;
        }
      } catch (e) {
        console.error(`Failed to parse ${x}.${y}:`, e);
        process.exit(1);
      }
    });
  });
  return config;
}
