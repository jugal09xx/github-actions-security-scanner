//import dependencies
import fs from "fs";
import yaml from "js-yaml";
import readline from "readline";
import path from "path";
import chalk from "chalk";

//import modules
import { extractCommands } from "./src/modules/extractCommands.js";
import { extractEnv } from "./src/modules/extractEnv.js";
import { extractUses } from "./src/modules/extractUses.js";
import { checkKeysPresence } from "./src/modules/extractKeys.js";
import { downloadWorkflowsFromRepo } from "./src/modules/downloadWorkflowsFromRepo.js";
import { evaluateWorkflowCommands } from "./src/modules/evaluateWorkflowCommands.js";
import { cleanupWorkflows } from "./src/modules/cleanupWorkflows.js";

// //import models
import { commands } from "./src/models/Commands.js";
import { environments } from "./src/models/Environments.js";
//import { workerData } from "worker_threads";
import { uses } from "./src/models/Uses.js";


//action file src
const directoryPath = "./src/workflows/";

//Welcome
console.log(
  chalk.black.bgGreenBright("Welcome to Github Actions Security Scanner!")
);
console.log(
  chalk.yellow.italic(
    "A tool to scan Github Actions (.yml) files for malicious content"
  )
);
console.log();

//check if /src/workflows exists
if (!fs.existsSync(directoryPath)) {
  //if not, create dir
  console.log("/src/workflows does not exist, creating directory.");
  fs.mkdirSync(directoryPath);
  console.log(`${directoryPath} created successfully.`);
  console.log();
} else {
  //already exists then proceed
  console.log(`${directoryPath} already exists. Proceeding...`);
  console.log();
}

//input github link
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const promptForGitHubLink = async () => {
  return new Promise((resolve) => {
    input.question("Enter the Github repository link:  ", (githubLink) => {
      resolve(githubLink);
    });
  });
};

// Define an asynchronous function to handle the entire process
const main = async () => {
  let validLink = false;
  let githubLink = "";
  const outputDirectory = "./src/workflows";
  
  //while function to loop until valid github link is received
  while (!validLink) {
    githubLink = await promptForGitHubLink();

    const regex = /github.com\/([^/]+)\/([^/]+)/;
    const matches = githubLink.match(regex);

    if (!matches) {
      console.log("Invalid GitHub link format.");
      validLink=false;
    }
    else{
      validLink=true;
    }
    console.log();
  }
  
  await downloadWorkflowsFromRepo(githubLink, outputDirectory);
    input.close();

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory: ", err);
      console.log();
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      const fileContent = fs.readFileSync(filePath, "utf-8");

      try {
        const actionFile = yaml.load(fileContent);

        const missingKeys = checkKeysPresence(actionFile);
        // console.log(missingKeys.length)
        if (missingKeys.length === 5) {
          console.log();
          console.log(
            `${chalk.yellow(file)}: ` +
              "0 Keys Matched: The YAML file does not appear to be a valid Github Actions file."
          );
        } else {
          console.log();
          console.log(
            `${chalk.yellow(file)}: ` +
              (5 - missingKeys.length) +
              "/5 Keys Matched: The file appears to be a valid Github Actions workflow."
          );
          extractEnv(actionFile);
          console.log(
            `${chalk.yellow(file)}: Host system is running: ` +
              chalk.yellow(environments)
          );
          extractCommands(actionFile);
          console.log(
            `${chalk.yellow(file)}: Found ${chalk.yellow(
              commands.length
            )} commands/scripts`
          );
          extractUses(actionFile);
          console.log();
          console.log(chalk.yellow("Linked file(s): "+uses.length+"\n"+uses));
          console.log();
          //console.log(commands);
          evaluateWorkflowCommands(commands, file);

          //delete all files in /src/workflow after evaluation
        }
      } catch (error) {
        console.log(`${file}: Error processing ${file}: ` + error);
      }
    });
    cleanupWorkflows("src/workflows");
  });
};


main();