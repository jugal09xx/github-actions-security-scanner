import xlsx from "xlsx";
//import columnify from "columnify";
import chalk from "chalk";
import Table from "cli-table";
import fs from "fs";

const filePath = "./src/db/database1.xlsx";
const sheetName = "Sheet1";

const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

// import { cleanupWorkflows } from "./cleanupWorkflows.js";

// const directoryPath='../workflows';

const dictionary = {};
data.forEach((row) => {
  const subKey = row.Subkey;
  const value = row.Value;
  dictionary[subKey] = value;
});

//console.log(dictionary);

function evaluateWorkflowCommands(extractedCommands, file) {
  console.log();
  console.log(
    chalk.black.bgYellow("WORKFLOW EVALUATION RESULTS:") +
      " " +
      chalk.yellow(file)
  );
  // for (let rowIndex = 2; ; rowIndex++) {
  //   const cell = worksheet["A" + rowIndex];
  //   if (!cell || !cell.v) {
  //     break;
  //   }
  //   const command = cell.v;
  //   extractedCommands.push(command);
  // }

  const finalmalarray = [];
  let result = {};

  //table config

  var table = new Table({
    head: ["No.", "Command", "Score"],
    colWidths: [5, 70, 20],
  });

  for (let i = 0; i < extractedCommands.length; i++) {
    let matchingKey = null;
    for (const key in dictionary) {
      if (
        typeof extractedCommands[i] === "string" &&
        extractedCommands[i].includes(key)
      ) {
        matchingKey = key;
        break;
      }
    }
    if (matchingKey != null) {
      // const tableData = [];
      result = {
        NAME: file,
        DATE: new Date().toUTCString(),
        ID: i + 1,
        COMMAND: extractedCommands[i],
        SCORE: dictionary[matchingKey],
      };

      finalmalarray.push(result);

      // result["ID"] = i + 1;
      // result["COMMAND"] = extractedCommands[i];
      // result["SCORE"] = dictionary[matchingKey];

      // tableData.push({
      //   "No.": i + 1,
      //   Command: extractedCommands[i],
      //   Score: dictionary[matchingKey],
      // });

      function isEmptyObject(obj) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            return false;
          }
        }
        return true;
      }

      //table is an Array, so you can `push`, `unshift`, `splice` and friends
      table.push([result.ID, result.COMMAND, result.SCORE]);

      // result = {}

      // console.log(result);
      //console.log();

      // const dict = {};
      // dict[extractedCommands[i]] = dictionary[matchingKey];
      // finalmalarray.push(dict);

      // cleanupWorkflows(directoryPath);
    }
  }
  const resultToJSON = JSON.stringify(result, null, 2);
  console.log(resultToJSON)

  fs.writeFile(
    `../github-actions-security-scanner/src/scans/${file}.txt`,
    resultToJSON,
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log(`Report ${file}.txt has been saved.`);
      }
    }
  );
  console.log();
  console.log(table.toString());
  console.log();

  if (finalmalarray.length === 0) {
    console.log("All good here, no malicious content found.");
  }
  // console.log("\n\n", finalmalarray);
  // return finalmalarray;
}

export { evaluateWorkflowCommands };
