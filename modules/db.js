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
    var queryString = "";
    if(!isNaN(Date.parse(req.body.search)) && req.body.attributes.indexOf("date") > -1)
      queryString = "SELECT * FROM " + currentTable + " WHERE " + req.body.attributes  + "::text LIKE '%" + req.body.search + "%';";
    else if(isNaN(req.body.search))
      queryString = "SELECT * FROM " + currentTable + " WHERE " + req.body.attributes + " LIKE '%" + req.body.search + "%';";
    else
       queryString = "SELECT * FROM " + currentTable + " WHERE " + req.body.attributes + " = " + req.body.search + ";";

    //console.log(queryString);
    queryDB(req, res, callback, queryString);
  }

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
          if(err) {
            return console.error('error running query', err);
          }
          
          client.end();
          callback(err, result);
        });
      }); 
  };

