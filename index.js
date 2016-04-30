var express = require('express');
var pg = require('pg');
var app = express();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/getTest', function(req, res) {
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
	    console.log(result);
	    res.send(result);
	    client.end();
	  });
	});
		
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


