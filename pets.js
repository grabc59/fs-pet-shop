'use strict';
var fs = require('fs');
var path = require('path');
var guestsPath = path.join(__dirname, 'guests.json');
var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {

} else if (cmd === 'create') {

} else if (cmd === 'update') {

} else if (cmd === 'destroy') {

} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}

// ```shell
// $ node pets.js
// Usage: node pets.js [read | create | update | destroy]
// ```
// console.error(`Usage: ${node} ${file} ${cmd} GUEST`);
// process.exit(1);
