import axios from "axios";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const downloadWorkflowsFromRepo = async (githubLink, outputDirectory) => {
  try {
    // Extract owner and repo name from the GitHub link
    const regex = /github.com\/([^/]+)\/([^/]+)/;
    const matches = githubLink.match(regex);
    let status = false;
    const owner = matches[1];
    const repo = matches[2];
    if (!matches) {
      console.log("Invalid GitHub link format.");
      status=false;
    }
    else{
      // Make API request to retrieve repository contents
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`,
        {
          validateStatus: function (status) {
            return true;
          },
        }
      );
      // if path doesn't exist
      if (response.statusText === "Not Found") {
        status=false;
      }
      else{
        status=true;
        console.log(chalk.italic("Downloading action files from: " + githubLink));
        const workflowFiles = response.data.filter(
          (item) =>
            item.type === "file" &&
            (item.name.endsWith(".yml") || item.name.endsWith("yaml"))
        );
    
        if (workflowFiles.length === 0) {
          console.log("No workflow files found.");
          console.log();
          status = false;
        } 
        else {
          console.log("valid github link received.");
          console.log(chalk.yellow(`${workflowFiles.length} workflow file(s) found.`));
          console.log();
          // Download each workflow file
          var count = 1;
          for (const file of workflowFiles) {
            const fileResponse = await axios.get(file.download_url);
            const filePath = path.join(outputDirectory, file.name);
            fs.writeFileSync(filePath, fileResponse.data);
            console.log(
              `(${count}/${workflowFiles.length}) Downloaded ` +
                chalk.yellow(file.name) +
                ` successfully`
            );
            count++;
          }
          console.log("Workflow files processed successfully.");
          console.log();
        }
    }
  }

  return status;

  } catch (error) {
    console.error("Error : ", error.message);
    return false;
  }
};

export { downloadWorkflowsFromRepo };
