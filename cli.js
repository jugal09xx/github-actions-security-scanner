import inquirer from 'inquirer';

function main() {
  console.log('Hi! welcome to github security scanner');
  prompt1();
}

function prompt1() {
  inquirer.prompt({
    type: 'list',
    name: 'prompt1Ques',
    message: 'choose the scan type',
    choices: [
      {name: 'New Scan',value: 'newscan',
      },
      {name: 'Past Scans',value: 'pastscans',},
      {name: 'Quit',value: 'quit',},
    ],
  }).then((answers) => {
    if (answers.prompt1Ques === 'newscan') {
      prompt1a();
    } 
    if(answers.prompt1Ques=== 'pastscans'){
      prompt1b();
    }
    if(answers.prompt1Ques==='quit'){
      quit();
    }

  });
}

function prompt1a() {
  inquirer.prompt({
    type: 'list',
    name: 'prompt1aQues',
    message: 'choose your option',
    choices: [
      {name: 'Enter Github',value: 'entergithub',},
      {name: 'Quit',value: 'quit',},
    ],
  }).then((answers) => {
    if (answers.prompt1aQues === 'entergithub') {
      prompt2a();
    } 
    if(answers.prompt1aQues==='quit'){
      quit();
    }
  });
}

function prompt2a(){
  inquirer.prompt({
    type: 'input',
    name: 'linktogithub',
    message: "input the link to github repo",
    validate(value) {
      const pass = value.match(
        /(https?:\/\/[^\s]+)/g,
      );
      if (pass) {
        return true;
      }
  
      return 'Please enter a valid github link';
    },
  }).then((answers) => {
    console.log('constructing this path....');
  });
}

function prompt1b() {
  inquirer.prompt({
    type: 'list',
    name: 'prompt1bQues',
    message: 'choose your option',
    choices: [
      {name: 'Triggered Scans',value: 'triggered_scans',},
      {name: 'Manual Scans',value: 'manual_scans',},
  ],
  }).then((answers) => {
    if (answers.prompt1bQues === 'triggered_scans') {
      triggeredScans();
    } 
    if(answers.prompt1bQues ==='manual_scans'){
      triggeredScans();
    }
  });
}

function triggeredScans(){
  inquirer.prompt({
    type: 'input',
    name: 'enterdate',
    message: "enter the date in DD-MM-YYYY",
    validate(value) {
      const pass = value.match(
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      );
      if (pass) {
        return true;
      }
  
      return 'Please enter a valid date';
    },
  },
  {
    type: 'input',
    name: 'linktogithub',
    message: "input the link to github repo",
    validate(value) {
      const pass = value.match(
        /(https?:\/\/[^\s]+)/g,
      );
      if (pass) {
        return true;
      }
  
      return 'Please enter a valid github link';
    },
  }).then((answers) => {
    console.log('constructing this path....');
  });
}

function quit(){
  console.log('Bye..');
}

main();