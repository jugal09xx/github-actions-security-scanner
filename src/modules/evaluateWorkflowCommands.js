import xlsx from "xlsx";
//import columnify from "columnify";
import chalk from "chalk";

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
  for (let i = 0; i < extractedCommands.length; i++) {
    let matchingKey = null;
    for (const key in dictionary) {
      if (typeof extractedCommands[i] === "string" && extractedCommands[i].includes(key)) {
        matchingKey = key;
        break;
      }
    }
    if (matchingKey != null) {
      // const tableData = [];
      const result = {};

      result["ID."] = i + 1;
      result["COMMAND"] = extractedCommands[i];
      result["SCORE"] = dictionary[matchingKey];

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

      console.log(result);
      console.log();

      const dict = {};
      dict[extractedCommands[i]] = dictionary[matchingKey];
      finalmalarray.push(dict);

      // cleanupWorkflows(directoryPath);
    }
  }
  if(finalmalarray.length === 0){
    console.log("All good here, no malicious content found.");
  }
  //console.log("\n\n", finalmalarray);
  //return finalmalarray;
}

export { evaluateWorkflowCommands };
