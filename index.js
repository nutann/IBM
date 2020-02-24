var express = require('express');
var request = require('request');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
// websocket and http servers
//var webSocketServer = require('websocket').server;
var http = require('http'); 
var WebSocket = require('ws');

var app = express();
//var bodyparser = require('body-parser');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//initialize a simple http server
const server = http.createServer(app);

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
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );


var port = process.env.PORT || 8090;
server.listen(port,function (err) {
    console.log("Listening to port "+port);
    //runSample();
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

//initialize the WebSocket server instance
const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', (ws) => {
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(message) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  var projectId = 'texecom-dxllts'
 
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient( {keyFilename: "./googlekey.json"});
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);


// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
         // The query to send to the dialogflow agent
      text: message,
      // The language used by the client (en-US)
      languageCode: 'en-US',
    },
  },
  queryParameters: {
    contexts: [botcontext]
  },
};
context_short_name = "bot"
context_name = "projects/" + projectId + "/agent/sessions/" + sessionId + "/contexts/" + 
              bot.lower()
var botcontext = {
  "name": context_name,
  "lifespanCount": 1,
  "parameters": {
    "name": "Nutan"
  }
}

// Send request and log result
const responses = await sessionClient.detectIntent(request).catch((err) => console.log(err));
console.log('Detected intent');
const result = responses[0].queryResult;
console.log(`  Query: ${result.queryText}`);
console.log(`  Response: ${result.fulfillmentText}`);
sendMessage(result.fulfillmentText);
if (result.intent) {
  console.log(`  Intent: ${result.intent.displayName}`);
} else {
  console.log(`  No intent matched.`);
}
}

 // clients = webSocketServer.clients
  var userName = false;
  var userColor = false;
  console.log((new Date()) + ' Connection accepted.');
  // send back chat history
  if (history.length > 0) {
    ws.send(JSON.stringify( { type: 'history', data: history.reverse()} ));
}
  function sendMessage(message) {
    var obj = {
      time: (new Date()).getTime(),
      text: htmlEntities(message),
      author: "Texecom",
      color: userColor
    };
    history.push(obj);
    history = history.slice(-100);
    var json = JSON.stringify({ type: 'message', data: obj });
    ws.send(json);
  }
  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {
    if (userName === false) { // first message sent by user is their name
      // remember user name
      userName = htmlEntities(message);
      // get random color and send it back to the user
      userColor = colors.shift();
      ws.send(JSON.stringify({ type:'color', data: userColor }));
      console.log((new Date()) + ' User is known as: ' + userName
                  + ' with ' + userColor + ' color.');

  }else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                            + userName + ': ' + message);
                
                // we want to keep history of all sent messages
                var obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);
  
                // broadcast message to all connected clients
                var json = JSON.stringify({ type:'message', data: obj });
               ws.send(json);
              runSample(message);
            }
      //log the received message and send it back to the client
      console.log('received: %s', message);
    //  ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
});
