'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('short'));
// app.use(express.static('public'));

app.get('/pets', (req, res, next) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) return next(err);
        var pets = JSON.parse(data);
        res.set('Content-Type', 'application/json');
        res.send(pets);
    });
});

app.get('/pets/:index', (req, res, next) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) return next(err);
        var index = Number.parseInt(req.params.index);
        var pets = JSON.parse(data);
        if (index < 0 || index >= pets.length || Number.isNaN(index)) {
            return res.sendStatus(404);
        }
        var pet = pets[index];

        res.send(pet);
    });
});

app.get('/boom', function(req, res, next) {
    Item.find(function(err, items) {
        if (err) return next(err);
    });
});

app.post('/pets', (req, res, next) => {
    var pet = {
        age: Number.parseInt(req.body.age),
        kind: req.body.kind,
        name: req.body.name,
    }
    if (isNaN(pet.age) || !pet.kind || !pet.name) {
        return res.sendStatus(400);
    }

    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) return next(err);
        var pets = JSON.parse(data);
        console.log(pet);
        pets.push(pet);
        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (err) => {
            if (err) return next(err);
            res.send(pet);
        });
    });
});

app.put('/pets/:index', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
      if (err) return next(err);
      var pets = JSON.parse(data);
      var index = Number.parseInt(req.params.index);
      if (Number.isNaN(index) || index < 0 || index >= pets.length) {
        return res.sendStatus(404);
      }
      pets[index] = {
        age: Number.parseInt(req.body.age),
        kind: req.body.kind,
        name: req.body.name,
      }
      if (isNaN(pets[index].age) || !pets[index].kind || !pets[index].name) {
          return res.sendStatus(400);
      }
      var petsJSON = JSON.stringify(pets);
      fs.writeFile(petsPath, petsJSON, (err) => {
          if (err) return next(err);
          res.send(pets[index]);
      });
  });
});

app.delete('/pets/:index', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) return next(err);
    var pets = JSON.parse(data);
    var index = Number.parseInt(req.params.index);
    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      return res.sendStatus(404);
    }
    var pet = pets.splice(index,1)[0];
    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) return next(err);
        res.send(pet);
    });
  })
})

app.get('*', (req, res) => {
    res.sendStatus(404);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    return res.status(500).send({message: err.message});
});

app.listen(port, () => {
    console.log('Listening on port', port);
});

module.exports = app; // so the tests will work?
