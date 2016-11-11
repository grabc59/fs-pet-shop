'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static('public'));

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON, next) => {
    if (err) return next(err);
    var pets = JSON.parse(petsJSON);
    res.set('Content-Type', 'application/json');
    res.send(pets);
  });
});

app.get('/pets/:index', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON, next) => {
    if (err) return next(err);
    var index = Number.parseInt(req.params.index);
    var pets = JSON.parse(petsJSON);
    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }
    var pet = pets[index];
    res.set('Content-Type', 'application/json');
    res.send(pet);
  });
});

app.post('/pets', (req, res) => {
  var pet = req.body;
  if (!pet.name || !pet.age || !pet.kind) {
    return res.sendStatus(400);
  }
  fs.readFile(petsPath, 'utf8', (err, petsJSON, next) => {
    if (err) return next(err);
    var pets = JSON.parse(petsJSON);
    pets.push(pet);
    res.set('Content-Type', 'application/json');
    res.send(pet);
  });
});

app.get('/boom', function(req, res, next) {
  Item.find(function(err, items) {
    if (err) return next(err);
  });
});

app.get('*', (req, res) => {
  res.sendStatus(404);
})

app.use(function(err, req, res, next) {
  console.error(err.stack);
  return res.send(500, { message: err.message });
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app; // so the tests will work?
