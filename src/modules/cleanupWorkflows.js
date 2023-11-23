import fs from 'fs';

function cleanupWorkflows(directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file) => {
        const filePath = `${directoryPath}/${file}`;
  
        if (fs.lstatSync(filePath).isDirectory()) {
          deleteDirectory(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
  
      fs.rmdirSync(directoryPath);
      console.log(`Cleanup Function: Directory ${directoryPath} deleted successfully.`);
    } else {
      console.log(`Directory ${directoryPath} not found.`);
    }
  }

  export { cleanupWorkflows };