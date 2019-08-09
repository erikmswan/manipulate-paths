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
  if (argv.reverse === 'true') input.reverse();
  const indicesToDelete = [];
  for (let i = 1; i < input.length; i++) {
    if (i === input.length - 1) break;
    
    let thisSlope = getSlope(input[i - 1], input[i]);
    let nextSlope = getSlope(input[i], input[i + 1]);
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

function translatePoints(input, xOffset = 0, yOffset = 0) {
  return input.map(point => [
    point[0] + parseFloat(xOffset),
    point[1] + parseFloat(yOffset)
  ]);
}


// do our processing

let output = input;

if (argv.compress !== 'false') {
  output = removeUnnecessaryPoints(output);
}

if (
  argv.translateX != undefined
  || argv.translateY != undefined
) {
  output = translatePoints(output, argv.translateX, argv.translateY);
}

console.log('input.length: ', input.length);
console.log('output.length: ', output.length);
console.log('difference: ', input.length - output.length);
console.log('x translation: ', argv.translateX);
console.log('y translation: ', argv.translateY);

fs.writeFile('./output.json', JSON.stringify(output), err => {
  if (err) console.log(err)
});
