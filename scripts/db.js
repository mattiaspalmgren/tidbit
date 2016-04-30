module.exports = {
  getTags: function(req, res) {    
        var pg = require('pg');  
      
        //var conString = "postgres://mattiaspalmgren:@localhost/mattiaspalmgren";
        var conString = "postgres://petraohlin8:@localhost/tidbit";
        
        var client = new pg.Client(conString);
        client.connect(function(err) {
          if(err) {
            return console.error('could not connect to postgres', err);
          }
          client.query('SELECT tag_id FROM tags', function(err, result) {
            if(err) {
              return console.error('error running query', err);
            }
            res.send(result);
            client.end();
          });
        });
  },

  getSearch: function(req, res) {    
      var pg = require('pg');  
    
      //var conString = "postgres://mattiaspalmgren:@localhost/mattiaspalmgren";
      var conString = "postgres://petraohlin8:@localhost/tidbit";
      var queryString = "SELECT * FROM authors WHERE author_name = '" + req.body.search + "'"

      console.log(req.body.search);
      console.log(queryString);

      
      var client = new pg.Client(conString);
      client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query(queryString, function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }

          res.send(result);
          client.end();
        });
      }); 
  }


};