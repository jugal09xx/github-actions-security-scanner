import axios from 'axios';
import fs from 'fs';
import path from 'path';

const downloadWorkflowsFromRepo = async (githubLink, outputDirectory) => {
  try {
    // Extract owner and repo name from the GitHub link
    const regex = /github.com\/([^/]+)\/([^/]+)/;
    const matches = githubLink.match(regex);

    if (!matches) {
      throw new Error('Invalid GitHub link format.');
    }

    const owner = matches[1];
    const repo = matches[2];

    // Make API request to retrieve repository contents
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`);

    // Filter for workflow files
    const workflowFiles = response.data.filter(item => item.type === 'file' && item.name.endsWith('.yml'));

    if (workflowFiles.length === 0) {
      console.log('No workflow files found.');
    } else {
      console.log(`${workflowFiles.length} workflow file(s) found.`);
      // Download each workflow file
      var count = 1;
      for (const file of workflowFiles) {
        const fileResponse = await axios.get(file.download_url);
        const filePath = path.join(outputDirectory, file.name);
        fs.writeFileSync(filePath, fileResponse.data);
        console.log(`(${count}/${workflowFiles.length}) Downloaded ${file.name} successfully`);
        count++;
      }
      console.log('Workflow files processed successfully.');
    }

    
  } catch (error) {
    console.error('Bad link or .github/workflows does not exist. Error:', error.message);
  }
};

export {downloadWorkflowsFromRepo}





