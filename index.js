var express = require('express');
var fs = require('fs');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var db = require("./modules/db.js");

var query_data = JSON.parse(fs.readFileSync('query_data.json', 'utf8'));
var dropdownTablesSearch = [];
var dropdownTablesDelete = [];
var dropdownTablesInsert = [];
var dropdownAttributesSearch = [];
var dropdownAttributesInsert = [];
var dropdownAttributesDelete = [];
var currentTableSearch = "";
var currentTableInsert = "";
var currentTableDelete = "";
var maxId = -1;

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
		dropdownAttributes = [];
		dropdownTablesSearch = [];

		for(var i = 0; i < result.rows.length; i++){
			dropdownTablesSearch.push(result.rows[i].table_name);
		}

		res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownAttributesSearch: dropdownAttributesSearch,
			currentTableSearch: currentTableSearch,
			items: []
		});
	});
});

app.get('/deletePage', function(req, res) {
	db.getTables(req, res, function(err, result) {
		
		dropdownTablesDelete = [];
		for(var i = 0; i < result.rows.length; i++){
			dropdownTablesDelete.push(result.rows[i].table_name);
		}
		res.render('pages/deletepage', {
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableDelete: currentTableDelete,
			deleteSuccess: -1
		});
	});
});

app.get('/insertPage', function(req, res) {
	db.getTables(req, res, function(err, result) {
		
		dropdownTablesInsert = [];
		for(var i = 0; i < result.rows.length; i++){
			dropdownTablesInsert.push(result.rows[i].table_name);
		}

		dropdownAttributesInsert = [];
		currentTableInsert = [];
		res.render('pages/insertpage', {
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownAttributesInsert: dropdownAttributesInsert,
			currentTableInsert: currentTableInsert,
			InsertSuccess: -1, 
			maxId: maxId
		});
	});
});

app.get('/getQueries', function(req, res) {

	var queryString = query_data[req.query['id']].query
	
	db.getTags(req, res, queryString, function(err, result) {

		res.render('pages/querypage', {
			items: result.rows,
			buttons: query_data,
			description: query_data[req.query['id']].description

		});
	});
	
});

app.get('/queryPage', function(req, res) {

	res.render('pages/querypage', {
		items: [],
		buttons: query_data,
		description: ""
	});
	
});

app.post('/getAttributesSearch', function(req, res) {
	db.getAttributes(req, res, function(err, result) {

	currentTableSearch = req.body.tables;

	dropdownAttributes = [];
	for(var i = 0; i < result.rows.length; i++){
		dropdownAttributesSearch.push(result.rows[i].column_name);
	}

	currentAttribute = dropdownAttributes; 

	res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownAttributesSearch: dropdownAttributesSearch,
			currentTableSearch: currentTableSearch,
			items: []
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

	res.render('pages/deletepage', {
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableDelete: currentTableDelete,
			deleteSuccess: -1
		});
	});
});

app.post('/getAttributesInsert', function(req, res) {

	db.getAttributes(req, res, function(err, result) {

		currentTableInsert = req.body.tables;

		dropdownAttributesInsert = [];
		for(var i = 0; i < result.rows.length; i++){
			dropdownAttributesInsert.push(result.rows[i].column_name);
		}

		db.getMaxId(req, res, currentTableInsert, dropdownAttributesInsert[0], function(err, result) {
			maxId = result.rows[0].max +1;

			res.render('pages/insertpage', {
					dropdownTablesInsert: dropdownTablesInsert,
					dropdownAttributesInsert: dropdownAttributesInsert,
					currentTableInsert: currentTableInsert,
					InsertSuccess: -1,
					maxId: maxId
				});
		});
	});
});

app.post('/getSearch', function(req, res) {
	db.getSearch(req, res, currentTableSearch, function(err, result) {

		res.render('pages/index', {
			dropdownTablesSearch: dropdownTablesSearch,
			dropdownAttributesSearch: dropdownAttributesSearch,
			currentTableSearch: currentTableSearch,
			items: result.rows
		});
	});
	
});


app.post('/insert', function(req, res) {

	db.insert(req, res, currentTableInsert,dropdownAttributesInsert, maxId, function(err, result) {
		maxId = -1;
		dropdownAttributesInsert = [];
		currentTableInsert = [];
		items = [];
		res.render('pages/insertPage', {
			dropdownTablesInsert: dropdownTablesInsert,
			dropdownAttributesInsert: dropdownAttributesInsert,
			currentTableInsert: currentTableInsert,
			items: result.rows, 
			InsertSuccess: result.rowCount,
			maxId: maxId
		});


	});
	
});


app.post('/postDelete', function(req, res) {
	db.postDelete(req, res, currentTableDelete, function(err, result) {

		res.render('pages/deletepage', {
			dropdownTablesDelete: dropdownTablesDelete,
			dropdownAttributesDelete: dropdownAttributesDelete,
			currentTableDelete: currentTableDelete,
			deleteSuccess: result.rowCount
		});

	});
	
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



