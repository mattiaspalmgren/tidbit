var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var db= require("./modules/db.js");
var dropdownTables = [];
var dropdownAttributes = [];
var currentTable = "";


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// support json encoded bodies
app.use(bodyParser.json()); 
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function(req, res) {

	db.getTables(req, res, function(err, result) {

		dropdownTables = [];
		for(var i = 0; i < result.rows.length; i++){
			dropdownTables.push(result.rows[i].table_name);
		}

		res.render('pages/index', {
			dropdownTables: dropdownTables,
			dropdownAttributes: dropdownAttributes,
			currentTable: currentTable,
			items: []
		});
	});
});

app.get('/getTags', function(req, res) {
	db.getTags(req, res, function(err, result) {

		res.render('pages/index', {
			dropdownTables: dropdownTables,
			dropdownAttributes: dropdownAttributes,
			currentTable: currentTable,
			items: result.rows
		});
	});
	
});

app.post('/getAttributes', function(req, res) {
	db.getAttributes(req, res, function(err, result) {

	currentTable = req.body.tables;

	dropdownAttributes = [];
	for(var i = 0; i < result.rows.length; i++){
		dropdownAttributes.push(result.rows[i].column_name);
	}

	res.render('pages/index', {
			dropdownTables: dropdownTables,
			dropdownAttributes: dropdownAttributes,
			currentTable: currentTable,
			items: []
		});
	});
});

app.post('/getSearch', function(req, res) {
	db.getSearch(req, res, currentTable, function(err, result) {

		console.log(result.rows);
		res.render('pages/index', {
			dropdownTables: dropdownTables,
			dropdownAttributes: dropdownAttributes,
			currentTable: currentTable,
			items: result.rows
		});
	});
	
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


