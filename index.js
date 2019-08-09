const input = require('./input');
const fs = require('fs');
const argv = require('yargs').argv;

function getSlope(origin, destination) {
  const ogCoord = {
    x: origin[0],
    y: origin[1]
  };
  const destCoord = {
    x: destination[0],
    y: destination[1]
  };

  if (destCoord.y - ogCoord.y === 0 || destCoord.x - ogCoord.x === 0) {
    return 0;
  }

  return (destCoord.y - ogCoord.y) / (destCoord.x - ogCoord.x);
}

function removeUnnecessaryPoints(rawInput) {
  const input = rawInput.slice();
  console.log('argv', argv, argv.reverse === 'true');
  if (argv.reverse === 'true') {
    console.log('reversing');
    input.reverse();
  }
  const indicesToDelete = [];
  for (let i = 1; i < input.length; i++) {
    if (i === input.length - 1) break;
    
    let thisSlope = getSlope(input[i - 1], input[i]);
    let nextSlope = getSlope(input[i], input[i + 1]);
    // console.log('thisSlope', thisSlope);
    // console.log('nextSlope', nextSlope, '\n');
    if (thisSlope === nextSlope) {
      console.log('deleting index at: ', i);
      indicesToDelete.push(i);
    }
  }

  indicesToDelete.forEach(indexToDelete => {
    input.splice(indexToDelete, 1);
  });

  return input;
}

const output = removeUnnecessaryPoints(input);

console.log('output', output);
console.log('difference', input.length, output.length, input.length - output.length);

fs.writeFile('./output.json', JSON.stringify(output), err => console.log(err));
