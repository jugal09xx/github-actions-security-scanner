//import dependencies
const fs = require("fs");
const yaml = require("js-yaml");

//import modules
const { extractCommands } = require("./src/modules/extractCommands");
const { extractEnv } = require("./src/modules/extractEnv");

//import models
const { commands } = require("./src/models/Commands");
const { environments } = require("./src/models/Environments");

//load file
const filePath = "./Actions.yml";
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
