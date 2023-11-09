//import dependencies
import fs from "fs";
import yaml from "js-yaml";

//import modules
import { extractCommands } from "./src/modules/extractCommands.js";
import { extractEnv } from "./src/modules/extractEnv.js";
import { checkKeysPresence } from "./src/modules/extractKeys.js";

// //import models
import { commands } from "./src/models/Commands.js";
import { environments } from "./src/models/Environments.js";

//load file
//const filePath = "./Actions.yml";
const actionFile = yaml.load(
  fs.readFileSync("./src/data/Actions.yml", "utf-8")
);

//execute the extract function
//extractCommands(actionFile);
//extractEnv(actionFile);

//identifying a github actions file. A workflow file must have keys for trigger events, runs-on machine, runs, etc.
const missingKeys = checkKeysPresence(actionFile);

if (missingKeys.length > 0) {
  console.log(
    "0 Keys Matched: The YAML file does not appear to be a valid Github Actions file. Do you still want to scan it? (Y/N)"
  );
} else {
  console.log(
    5 -
      missingKeys.length +
      "/5 Keys Matched: The file appears to be a valid Github Actions workflow."
  );
  extractEnv(actionFile);
  console.log('Host system is running: ' + environments);
  extractCommands(actionFile);
  console.log(`Found ${commands.length} commands/scripts`);
}

// //print output -> ./utils/printResults.js
// console.log(`Host system is running: ${environments}`);
// console.log();
// console.log(`Found ${commands.length} commands/scripts!`);
// console.log();

// commands.forEach((command, index) => {
//   console.log(`Command/Script ${index + 1}`);
//   console.log(command);
//   console.log();
// });
