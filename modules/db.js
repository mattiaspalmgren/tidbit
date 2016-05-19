module.exports = {

  getTags: function(req, res, callback) {    
    var queryString = 'SELECT tag_id FROM tags LIMIT 10;';
    queryDB(req, res, callback, queryString);

  },

  getAttributes: function(req, res, callback) {    
    var queryString = "SELECT column_name FROM information_schema.columns WHERE table_name = '" + req.body.tables + "' ORDER BY ordinal_position;";
    queryDB(req, res, callback, queryString);
  },

  getTables: function(req, res, callback) {    
    var queryString = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
    queryDB(req, res, callback, queryString);
  },

  getSearch: function(req, res, currentTable, callback) {    
    //console.log(req.body.search);
    var queryString = "SELECT *" + composeQueryFromInput(currentTable, req.body.attributes, req.body.search);
    //console.log(queryString);
    queryDB(req, res, callback, queryString);
  },

  postDelete: function(req, res, currentTable, callback) {    
    var queryString = "DELETE" + composeQueryFromInput(currentTable, req.body.attributes, req.body.search);
    //console.log(queryString);
    queryDB(req, res, callback, queryString);
  },

};

var queryDB = function(req, res, callback, queryString) {    
      var pg = require('pg');  
    
      //var conString = "postgres://mattiaspalmgren:@localhost/mattiaspalmgren";
      var conString = "postgres://petraohlin8:@localhost/tidbit";
      
      var client = new pg.Client(conString);
      client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query(queryString, function(err, result) {
          
          client.end();
          callback(err, result);
        });
      }); 
  };

var composeQueryFromInput = function(inputTable, inputAttribute, input) {    
    var queryString = "";

    if(input == "")
      queryString = " FROM " + inputTable
    else if(!isNaN(Date.parse(input)) && inputAttribute.indexOf("date") > -1)
      queryString = " FROM " + inputTable + " WHERE " + inputAttribute  + "::text LIKE '%" + input + "%';";
    else if(isNaN(input))
      queryString = " FROM " + inputTable + " WHERE " + inputAttribute + " LIKE '%" + input + "%';";
    else
       queryString = " FROM " + inputTable + " WHERE " + inputAttribute + " = " + input + ";";

     return queryString;
};





