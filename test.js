const inputText = `... (your input text) ...`;

// Split the inputText into lines.
const lines = inputText.split('\n');

// Initialize an array to store the matched commands.
const matchedCommands = [];

// Iterate through each line.
let isRunStep = false;

for (const line of lines) {
  // Check if this is the start of a "run" step.
  if (line.trim() === '- name: Run code style tests') {
    isRunStep = true;
    continue;
  }

  // Check if this is the end of the "run" step.
  if (isRunStep && line.trim().startsWith('run: |')) {
    isRunStep = false;
    continue;
  }

  // If inside a "run" step, add the line to the matchedCommands array.
  if (isRunStep) {
    const command = line.trim();
    if (command) {
      matchedCommands.push(command);
    }
  }
}

// Output the extracted commands.
console.log(matchedCommands);
