module.exports = {
  getTags: function(req, res, callback) {    
    var queryString = 'SELECT tag_id FROM tags LIMIT 10';
    queryDB(req, res, callback, queryString);

  },

  getSearch: function(req, res, callback) {    

    if(req.body.tables = "Authors"){
      var attribute = "author_name";
    }
    else if(req.body.tables = "Titles"){
      var attribute = "title";
    }
    else if(req.body.tables = "Publications"){
      var attribute = "publication_title"
    }


    var queryString = "SELECT * FROM " + req.body.tables + " WHERE " + attribute + " = '" + req.body.search + "'";
    console.log(queryString);
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

          // res.send(result);
          // client.end();
          client.end();
          callback(err, result);
        });
      }); 
  };

