'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

app.use(function(req, res) {
  res.send('Hello World');
});

app.get('/pets', function(req, res) {
  res.send([{ "age": 7, "kind": "rainbow", "name": "fido" }, { "age": 5, "kind": "snake", "name": "Buttons" }])
})

app.listen(port, function() {
  console.log('Listening on port', port);
});
