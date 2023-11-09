//import dependencies
import fs from "fs";
import yaml from "js-yaml";
import readline from "readline";
import path from "path";

//import modules
import { extractCommands } from "./src/modules/extractCommands.js";
import { extractEnv } from "./src/modules/extractEnv.js";
import { checkKeysPresence } from "./src/modules/extractKeys.js";
import { downloadWorkflowsFromRepo } from "./src/modules/downloadActionFiles.js";

// //import models
import { commands } from "./src/models/Commands.js";
import { environments } from "./src/models/Environments.js";

const directoryPath = "./src/workflows/"; //action file src

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

input.question("Enter the Github repository link:  ", async (githubLink) => {
  const outputDirectory = "./src/workflows";
  await downloadWorkflowsFromRepo(githubLink, outputDirectory);
  input.close();

  //identifying a github actions file. A workflow file must have keys for trigger events, runs-on machine, runs, etc.
  // const actionFile = yaml.load(
  //   fs.readFileSync("./src/data/Actions.yml", "utf-8")
  // );

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory: ", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      const fileContent = fs.readFileSync(filePath, "utf-8");

      try {
        
        const actionFile = yaml.load(fileContent);

        const missingKeys = checkKeysPresence(actionFile);
        // console.log(missingKeys.length)
        if (missingKeys.length > 0) {
          console.log(`${file}: `+
            "0 Keys Matched: The YAML file does not appear to be a valid Github Actions file."
          );
        } else {
          console.log(`${file}: `+ (5 - missingKeys.length) +
              "/5 Keys Matched: The file appears to be a valid Github Actions workflow."
          );
          extractEnv(actionFile);
          console.log(`${file}: Host system is running: ` + environments);
          extractCommands(actionFile);
          console.log(`${file}: Found ${commands.length} commands/scripts`);
        }
      } catch (error) {
        console.log(`${file}: Error processing ${file}: ` + error);
      }
    });
  });
});

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
