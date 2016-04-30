var express = require('express');
var pg = require('pg');
var app = express();
var db = require("./modules/db.js");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/getTags', function(req, res) {
	var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
	db.getTags(req, res, function(err, result) {
		res.render('pages/tags', {
			items: result.rows, 
			tagline: tagline
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


