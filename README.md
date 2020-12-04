# Manipulate Paths

A small node script for compressing, reversing, translating and scaling paths represented by [x, y] coordinates. Can output in ci::vec2 format because that's what I needed it for at the time.

## Usage

Run with `yarn start` with any arguments. You can also just use your system's node with `node .`.

## Arguments

- `--no-compress`    // This will stop the compression. Runs by default.
- `--reverse`        // This will reverse the path direction.
- `--translateX=500` // This will translate the path on the X axis by the number provided.
- `--translateY=500` // This will translate the path on the Y axis by the number provided.
- `--scale=300,200`  // This will scale the lines to the resolution provided.
- `--ci`             // Output in the format of ci::vec2's instead of JSON (for a specific use case I had).
