var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var db= require("./modules/db.js");
var dropdownTablesSearch = [];
var dropdownTablesDelete = [];
var dropdownTablesInsert = [];
var dropdownAttributesSearch = [];
var dropdownAttributesInsert = [];
var dropdownAttributesDelete = [];
var currentTableSearch = "";
var currentTableInsert = "";
var currentTableDelete = "";

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

		dropdownTablesSearch = [];
		dropdownTablesInsert = [];
		dropdownTablesDelete = [];
		for(var i = 0; i < result.rows.length; i++){
			dropdownTablesSearch.push(result.rows[i].table_name);
			dropdownTablesInsert.push(result.rows[i].table_name);
			dropdownTablesDelete.push(result.rows[i].table_name);
		}

		res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesSearch: dropdownAttributesSearch,
			dropdownAttributesInsert: dropdownAttributesInsert,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableSearch: currentTableSearch,
			currentTableInsert: currentTableInsert,
			currentTableDelete: currentTableDelete,
			items: [],
			deleteSuccess: -1
		});
	});
});

app.get('/getTags', function(req, res) {
	db.getTags(req, res, function(err, result) {

		res.render('pages/querypage', {
			items: result.rows
		});
	});
	
});

app.get('/getQueries', function(req, res) {
	res.render('pages/querypage', {
		items: []
	});
	
});

app.post('/getAttributesSearch', function(req, res) {
	db.getAttributes(req, res, function(err, result) {

	currentTableSearch = req.body.tables;

	dropdownAttributes = [];
	for(var i = 0; i < result.rows.length; i++){
		dropdownAttributesSearch.push(result.rows[i].column_name);
	}

	res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesSearch: dropdownAttributesSearch,
			dropdownAttributesInsert: dropdownAttributesInsert,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableSearch: currentTableSearch,
			currentTableInsert: currentTableInsert,
			currentTableDelete: currentTableDelete,
			items: [],
			deleteSuccess: -1
		});
	});
});


app.post('/getAttributesDelete', function(req, res) {
	db.getAttributes(req, res, function(err, result) {

	currentTableDelete = req.body.tables;

	dropdownAttributes = [];
	for(var i = 0; i < result.rows.length; i++){
		dropdownAttributesDelete.push(result.rows[i].column_name);
	}

	res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesSearch: dropdownAttributesSearch,
			dropdownAttributesInsert: dropdownAttributesInsert,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableSearch: currentTableSearch,
			currentTableInsert: currentTableInsert,
			currentTableDelete: currentTableDelete,
			items: [],
			deleteSuccess: -1
		});
	});
});

app.post('/getSearch', function(req, res) {
	db.getSearch(req, res, currentTableSearch, function(err, result) {

		res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesSearch: dropdownAttributesSearch,
			dropdownAttributesInsert: dropdownAttributesInsert,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableSearch: currentTableSearch,
			currentTableInsert: currentTableInsert,
			currentTableDelete: currentTableDelete,
			items: result.rows,
			deleteSuccess: -1
		});
	});
	
});

app.post('/postDelete', function(req, res) {
	db.postDelete(req, res, currentTableDelete, function(err, result) {

		res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesSearch: dropdownAttributesSearch,
			dropdownAttributesInsert: dropdownAttributesInsert,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableSearch: currentTableSearch,
			currentTableInsert: currentTableInsert,
			currentTableDelete: currentTableDelete,
			items: [],
			deleteSuccess: result.rowCount
		});

	});
	
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


