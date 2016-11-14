'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var bodyParser = require('body-parser');
var morgan = require('morgan');
var basicAuth = require('basic-auth');


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('short'));
// app.use(express.static('public'));

// Authenticator
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };
  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };
  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.get('/pets',  auth, (req, res, next) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) return next(err);
        var pets = JSON.parse(data);
        res.set('Content-Type', 'application/json');
        res.send(pets);
    });
});

app.get('/pets/:index', auth, (req, res, next) => {
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

app.get('/boom', auth, function(req, res, next) {
    Item.find(function(err, items) {
        if (err) return next(err);
    });
});

app.post('/pets', auth, (req, res, next) => {
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
        pets.push(pet);
        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (err) => {
            if (err) return next(err);
            res.send(pet);
        });
    });
});

app.put('/pets/:index', auth, (req, res, next) => {
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

app.delete('/pets/:index', auth, (req, res, next) => {
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
  });
});

app.patch('/pets/:index', auth, (req, res, next) => {
  // The route handler must only update the record if age is an integer, if kind is not missing, or if name is not missing.
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) return next(err);
    var pets = JSON.parse(data);
    var index = Number.parseInt(req.params.index);
    var patchData = {
      age: Number.parseInt(req.body.age),
      kind: req.body.kind,
      name: req.body.name,
    };
    var updatedPet = Object.assign({}, pets[index]);

    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      return res.sendStatus(404);
    }

    if ( !isNaN(patchData.age) ) {
      updatedPet.age = patchData.age;
    }
    if ( patchData.kind ) {
      updatedPet.kind = patchData.kind;
    }
    if ( patchData.name ) {
      updatedPet.name = patchData.name;
    }
    pets[index] = updatedPet;

    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, (err) => {
        if (err) return next(err);
        return res.send(pets[index]);
    });
  });
});

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
