'use strict';

var fs = require('fs');
var path = require('path');

var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var pets = JSON.parse(data);
    // console.log(process.argv[3]);
    if (Number(process.argv[3]) >= 0 && Number(process.argv[3]) <= pets.length - 1) {
      var index = process.argv[3];
      var pet = pets[index];
      console.log(pet);
    } else if (!process.argv[3]) {
      console.log(pets);
    } else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
  });
} else if (cmd === 'create') {

} else if (cmd === 'update') {

} else if (cmd === 'destroy') {

} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
