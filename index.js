var app = require('express')();
var request = require('request');

var sqlite3 =  require('sqlite3');

var bodyparser = require('body-parser');

var db = new sqlite3.Database('./user1.db')

app.use(bodyparser.urlencoded({}));

function initializeDb() {
    console.log("Initialize table");

    db.run('CREATE TABLE IF NOT EXISTS user (id int,Name TEXT,Age int,Address TEXT)');

}

app.listen(3000,function (err) {
     initializeDb();

    console.log("Listening to port 3000");

});

app.get('/',function (req,res) {


    res.send('hello');

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

