//import dependencies
import fs from "fs";
import yaml from "js-yaml";

//import modules
import { extractCommands } from "./src/modules/extractCommands.js";
import { extractEnv } from "./src/modules/extractEnv.js";

//import models
import { commands } from "./src/models/Commands.js";
import { environments } from "./src/models/Environments.js";

//load file
//const filePath = "./Actions.yml";
const actionFile = yaml.load(fs.readFileSync("./src/data/Actions.yml", "utf-8"));

//execute the extract function
extractCommands(actionFile);
extractEnv(actionFile);

//print output -> ./utils/printResults.js
console.log(`Host system is running: ${environments}`);
console.log();
console.log(`Found ${commands.length} commands/scripts!`);
console.log();

commands.forEach((command, index) => {
  console.log(`Command/Script ${index + 1}`);
  console.log(command);
  console.log();
});
