var express = require('express');
var pg = require('pg');
var app = express();
var db = require("./scripts/db.js");
var bodyParser = require('body-parser');


var db = require("./scripts/db.js");app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/getTest', function(req, res) {
	db.getTags(req, res);	
});

app.post('/getSearch', function(req, res) {
	db.getSearch(req, res);	
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


