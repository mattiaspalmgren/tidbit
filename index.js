var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var db = require("./modules/db.js");


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/getTags', function(req, res) {
	db.getTags(req, res, function(err, result) {

		res.render('pages/result', {
			items: result.rows
		});
	});
	
});

app.post('/getSearch', function(req, res) {
	db.getSearch(req, res, function(err, result) {

	res.render('pages/resultAuthor', {
			items: result.rows
		});
	});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


