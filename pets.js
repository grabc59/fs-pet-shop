#!/Users/christopher/.nvm/versions/node/v7.0.0/bin/node
'use strict';

const fs = require('fs');
const path = require('path');

var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(data);
        let index = process.argv[3];

        if (index >= 0 && index < pets.length) {
            var pet = pets[index];
            console.log(pet);
        } else if (!index) {
            console.log(pets);
        } else {
            console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
            process.exit(1);
        }
    });
} else if (cmd === 'create') {
    if (process.argv.length === 6) {
        fs.readFile(petsPath, 'utf8', (readErr, data) => {
            if (readErr) {
                throw readErr;
            }
            let pets = JSON.parse(data);
            let pet = {
                'age': parseInt(process.argv[3]),
                'kind': process.argv[4],
                'name': process.argv[5],
            };

            pets.push(pet);
            let petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, (writeErr) => {
              if (writeErr) {
                throw writeErr;
              }
              console.log(pet);
            });
        });
    } else {
        console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
        process.exit(1);
    }
} else if (cmd === 'update') {
  if (process.argv.length === 7) {
    fs.readFile(petsPath, 'utf8', (readErr, data) => {
        if (readErr) {
            throw readErr;
        }
        let pets = JSON.parse(data);
        let petIndex = process.argv[3];
        let pet = pets[petIndex];

        pet.age = parseInt(process.argv[4]);
        pet.kind = process.argv[5];
        pet.name = process.argv[6];

        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (writeErr) => {
          if (writeErr) {
            throw writeErr;
          }
          console.log(pet);
        });
    });
  } else {
    console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
    process.exit(1);
  }
} else if (cmd === 'destroy') {
  if (process.argv.length === 4) {
    fs.readFile(petsPath, 'utf8', (readErr, data) => {
        if (readErr) {
            throw readErr;
        }
        let pets = JSON.parse(data);
        let petIndex = process.argv[3];
        let pet = pets[petIndex];

        pets.splice(petIndex,1);

        let petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (writeErr) => {
          if (writeErr) {
            throw writeErr;
          }
          console.log(pet);
        });
    });
  } else {
    console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
    process.exit(1);
  }
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
