module.exports = {
  getTags: function(req, res) {    
        var pg = require('pg');  
      
        var conString = "postgres://mattiaspalmgren:@localhost/mattiaspalmgren";

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
  }  
};