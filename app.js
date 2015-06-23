var util = require('util');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var applescript = require('applescript');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api!' });
});

app.listen(3000);
