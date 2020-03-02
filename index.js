const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

var gitHubUser = "";
var avatar     = "";
var email      = "";
var giphyID    = "";

var giphyUrl   = "";
var giphyUrl1  = "https://media.giphy.com/media/";
var giphyID    = "";
var giphyUrl2  = "/giphy.gif";

function getGitHub() {
inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function({ username }) {
    gitHubUser = username; 
    const queryUrl = `https://api.github.com/users/${username}/events/public`; 
    console.log(queryUrl); 
    
   axios.get(queryUrl)
  .then(function(res) {

      //console.log(res.data[1]);
      //console.log("here")
      //console.log(res)
      console.log(res.data[1].actor.avatar_url);
      console.log(res.data[1].payload.commits[0].author.email);
      //console.log("here")
      avatar = res.data[1].actor.avatar_url;
      email  = res.data[1].payload.commits[0].author.email
      //console.log("here")
      getGiphy();
  })
})    

}

function getGiphy() {

  axios
//.get("https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC")
.get("https://api.giphy.com/v1/stickers/search?api_key=dc6zaTOxFJmzC&q=happy")
.then(function({ data }) {
  console.log("here")
  fs.writeFile("json-son.json", JSON.stringify(data.data[0], null, 2), function(err){
    if(err) throw err
  })
  //console.log(data);
  //console.log(data.data[0].url);
  giphyID    =  data.data[0].id;
  giphyUrl   = giphyUrl1 + giphyID + giphyUrl2;
  console.log(data.data[0].id);
  console.log(giphyUrl);
  //giphyUrl =  data.data[0].user.banner_url;
      
  init();
});

}


function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of your project?"
    },
    {
      type: "input",
      name: "description",
      message: "describe your project."
    },
    {
      type: "input",
      name: "installation",
      message: "How was the project installed?"
    },
    {
      type: "input",
      name: "usage",
      message: "How is it used?"
    },
    {
      type: "input",
      name: "license",
      message: "What kind of licenses?"
    },
    {
      type: "input",
      name: "contributing",
      message: "Did anyone else contribute to the project?"
    },
    {
      type: "input",
      name: "test",
      message: "What kind of testing was done?"
    }

  ]);
}

function generateMd(answers) {
  return `
# ${answers.title} by ${gitHubUser} email at: ${email} 

![Author's Photo](${avatar})
![Funny Photo](${giphyUrl})

# Table of Contents

[Project Installtion](#Project_Installtion)<br>
[Project Usage](#Project_Usage)<br>
[Project Licenses](#Project_Licenses)<br>
[Project Testing](#Project_Testing)<br>


${answers.description}

## Project_Installtion
${answers.installation}

## Project_Usage
${answers.usage}

## Project_Licenses
${answers.license}

## Project_Contributors
${answers.contributing}

## Project_Testing
${answers.test}


- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.

`}

async function init() {
  //console.log("hi")
  try {
    const answers = await promptUser();

    const md = generateMd(answers);

    await writeFileAsync("README.md", md);

    console.log("Successfully wrote to README.md");
  } catch(err) {
    console.log(err);
  }
}


getGitHub();


