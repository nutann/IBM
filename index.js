var express = require('express');
var request = require('request');
const dialogflow = require('dialogflow');
const uuid = require('uuid');


var app = express();
//var bodyparser = require('body-parser');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//app.use(bodyparser.urlencoded({ extended: false }));

// // Import the appropriate service and chosen wrappers
// const {
//   dialogflow,
//   Image,
// } = require('actions-on-google')

// // Create an app instance
// const dialogueflow = dialogflow()

// dialogueflow.intent('Default Welcome Intent', conv => {
//   conv.ask('Hi, how is it going?')
//   conv.ask(`Here's a picture of a cat`)
//   conv.ask(new Image({
//     url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
//     alt: 'A cat',
//   }))
// })



/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = 'texecom-dxllts') {
    // A unique identifier for the given session
    const sessionId = uuid.v4();
   
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient( {keyFilename: "./googlekey.json"});
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
 
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
           // The query to send to the dialogflow agent
        text: '',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
 
  // Send request and log result
  const responses = await sessionClient.detectIntent(request).catch((err) => console.log(err));
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
}
}



var port = process.env.PORT || 8080;
app.listen(port,function (err) {
    console.log("Listening to port "+port);
    runSample();
});

app.get('/',function(req,res){
    console.log("******************");
    res.send('We are happy to see you using Chat Bot Webhook');
  });
app.post('/',function (req,res) {

    console.log("****************** POST request ***********");
   // runSample();

});
app.post('/webhook',function (req,res) {

    console.log("post ssrequest webhook"+JSON.stringify(req.body.queryResult.action));
    
    let fullFillementText = processAction(req.body.queryResult.action);
    console.log("post fullFillementText"+JSON.stringify(fullFillementText));
    res.json((fullFillementText));
  //  runSample();

});
function processAction(action){
    console.log("processAction action"+action);
    switch(action){
        case "input.welcome" :
            console.log("processAction welcome action");
            return {
				fulfillmentText: 'Hi! I am Texecom Assistant ! Currently I have limited functionality . Please select one of the option',
				source: 'getmovie'
			}
            break;
    }
}


