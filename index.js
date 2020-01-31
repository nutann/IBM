var app = require('express')();
var request = require('request');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

var sqlite3 =  require('sqlite3');

var bodyparser = require('body-parser');

var db = new sqlite3.Database('./user1.db')

app.use(bodyparser.urlencoded({}));

function initializeDb() {
    console.log("Initialize table");

    db.run('CREATE TABLE IF NOT EXISTS user (id int,Name TEXT,Age int,Address TEXT)');

}


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
        text: 'hello',
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
    // initializeDb();

    console.log("Listening to port "+port);

});

app.get('/',function(req,res){
    res.send('We are happy to see you using Chat Bot Webhook');
  });
app.post('/',function (req,res) {

    console.log("post request "+JSON.stringify(req));
    runSample();

});

app.post('/update',function (req,res) {

    console.log("iCheck "+JSON.stringify(req.body));

    db.run('INSERT INTO user (id,Name,age) VALUES (?,?,?)',req.body.id,req.body.name,req.body.age);

    var options = {
        url : "http://localhost:3000/updateAddress",
        form: {
        id: req.body.id,
        address: req.body.address
        }
    }
    request.post(options,function (response,body) {
        console.log("updated");
    })



    res.send('updated');

});

app.post('/updateAddress',function (req,res) {

    console.log("iCheck updateAddress"+JSON.stringify(req.body));

    db.run('UPDATE user SET Address=? WHERE id=?',req.body.address,req.body.id);

    res.send('updated');

});

