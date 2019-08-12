const input = require('./input');
const fs = require('fs');
const argv = require('yargs').argv;
var os = require('os');

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
  return input.map(point => [point[0] + parseFloat(xOffset), point[1] + parseFloat(yOffset)]);
}

function sortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

function normalizePath(input) {
  const allXs = [];
  const allYs = [];
  // first we extract all x and ys
  input.forEach(([x, y]) => {
    allXs.push(x);
    allYs.push(y);
  });
  // sort them ascending to make finding the bounding box easier
  allXs.sort(sortDesc);
  allYs.sort(sortDesc);
  // create the bounding box we will use to normalize the values
  const upperBoundX = allXs[0];
  const upperBoundY = allYs[0];

  return input.map(([x, y]) => [x / upperBoundX, y / upperBoundY]);
}

function scaleNormalizedPath(input, scaleX, scaleY) {
  return input.map(([x, y]) => [x * scaleX, y * scaleY]);
}

// do our processing

if (argv.h != undefined) {
  console.log(`
Path Processing tool.

Possible arguments:
--no-compress    // This will stop the compression. Runs by default.
--reverse        // This will reverse the path direction.
--translateX=500 // This will translate the path on the X axis by the number provided.
--translateY=500 // This will translate the path on the Y axis by the number provided.
--scale=300,200  // This will scale the lines to the resolution provided.
--ci             // Outputs ci::vec2's instead of JSON.
  `);
  return;
}

let output = input;

if (argv.compress !== false) {
  output = removeUnnecessaryPoints(output);
}

if (argv.translateX != undefined || argv.translateY != undefined) {
  output = translatePoints(output, argv.translateX, argv.translateY);
}

if (argv.reverse === true) output.reverse();

if (argv.scale != undefined) {
  const scaleFormat = /^\d+,\d+$/;
  if (argv.scale.match(scaleFormat) == null) {
    console.log('Scale argument malformed. Should be in the form of "--scale=300,200"');
    return;
  }
  const [scaleX, scaleY] = argv.scale.split(',');
  console.log('scaleX', scaleX, 'scaleY', scaleY);

  // first we normalize the path. then we scale it up.
  const normalizedPath = normalizePath(output);
  output = scaleNormalizedPath(normalizedPath, parseFloat(scaleX), parseFloat(scaleY));
}

console.log('first output point: ', output[0]);
console.log('input.length: ', input.length);
console.log('output.length: ', output.length);
console.log('compressed by number of points: ', input.length - output.length);
if (argv.translateX) console.log('x translation: ', argv.translateX);
if (argv.translateY) console.log('y translation: ', argv.translateY);
if (argv.scale) console.log('scale factor: ', argv.scale);

const filepath = './output.json';

if (fs.existsSync(filepath)) {
  fs.unlinkSync(filepath);
}

// we either do the specific use case of generating vec2s in cinder, or we can specify json. By default, does vec2s.
if (argv.ci === true) {
  output = output.forEach(point => {
    fs.appendFileSync(filepath, os.EOL + `ci::vec2(${point[0]}, ${point[1]}),`, err => {
      if (err) console.log(err);
    });
  });
} else {
  fs.writeFileSync(filepath, JSON.stringify(output), err => {
    if (err) console.log(err);
  });
}
