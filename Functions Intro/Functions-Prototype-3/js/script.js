/**
 * Functions Protoype Project 3 - Fish Tank
 * Alycia Malonga
 *
 * Three fish float inside a round fish bowl that sits on a table.
 * Press the spacebar to shake the bowl: the bowl and the fish
 * shake for 1.5 seconds. After the shake, the fish look sick
 * (green, X eyes, frown) and sink a little lower. One function
 * creates every fish, one moves every fish, and one draws every fish.
 *
 * 
 */

"use strict";

// The colour of a sick fish
const sickColour = "#8fae5a";

// The round fish bowl (x and y are the centre)
const tank = {
  x: 200,
  y: 200,
  size: 240,
  // How far the bowl is pushed away from its normal spot right now
  shakeX: 0,
  shakeY: 0,
  // Is the bowl shaking right now?
  isShaking: false,
  // How long the shaking lasts, in milliseconds
  shakeTime: 1500
};

// Our three fish (they start undefined and are created in setup())
let fish1 = undefined;
let fish2 = undefined;
let fish3 = undefined;

/**
 * Creates the canvas and the fish
 */
function setup() {
  createCanvas(400, 400);

  fish1 = createFish(160, 170, "#ff8c33", 0);
  fish2 = createFish(235, 210, "#ffd633", 2);
  fish3 = createFish(190, 250, "#ff6699", 4);
}

/**
 * Creates a fish object with a home position, a colour, and
 * a timing offset so the fish don't all bob at the same time
 */
function createFish(homeX, homeY, colour, offset) {
  const fish = {
    // Where the fish floats around (parameters)
    homeX: homeX,
    homeY: homeY,
    // Where the fish is drawn right now
    x: homeX,
    y: homeY,
    // Size (default)
    size: 50,
    // Colour (parameter)
    colour: colour,
    // Timing offset for the floating (parameter)
    offset: offset,
    // Is the fish sick? (it gets sick after the bowl is shaken)
    isSick: false
  };
  return fish;
}

/**
 * Draws the table, the bowl and the fish
 */
function draw() {
  background(232, 217, 240);

  updateTank();

  drawTable();
  drawTank();

  moveFish(fish1);
  moveFish(fish2);
  moveFish(fish3);

  drawFish(fish1);
  drawFish(fish2);
  drawFish(fish3);
}

/**
 * Sets how far the bowl is pushed this frame:
 * a random amount while shaking, nothing otherwise
 */
function updateTank() {
  if (tank.isShaking) {
    tank.shakeX = random(-6, 6);
    tank.shakeY = random(-6, 6);
  }
  else {
    tank.shakeX = 0;
    tank.shakeY = 0;
  }
}

/**
 * Draws the table the bowl sits on: a top and two legs
 */
function drawTable() {
  push();
  noStroke();
  fill(130, 80, 40);
  rect(40, 320, 320, 20);
  rect(60, 340, 20, 60);
  rect(320, 340, 20, 60);
  pop();
}

/**
 * Draws the round bowl: water, sand and a white glass edge
 */
function drawTank() {
  const x = tank.x + tank.shakeX;
  const y = tank.y + tank.shakeY;

  // The water
  push();
  noStroke();
  fill(130, 200, 240);
  ellipse(x, y, tank.size);
  pop();

  // The sand at the bottom (narrow enough to fit inside the curve)
  push();
  noStroke();
  fill(230, 210, 150);
  ellipse(x, y + tank.size / 2 - 15, 100, 24);
  pop();

  // The glass edge
  push();
  noFill();
  stroke(255);
  strokeWeight(6);
  ellipse(x, y, tank.size);
  pop();
}

/**
 * Makes the fish passed in float up and down. When the bowl is
 * shaking, the fish gets pushed with it and shakes even more.
 * A sick fish sinks a little lower.
 */
function moveFish(fish) {
  // sin() gives a smooth up and down wave
  const bob = sin(frameCount * 0.05 + fish.offset) * 10;

  fish.x = fish.homeX + tank.shakeX;
  fish.y = fish.homeY + bob + tank.shakeY;

  if (fish.isSick) {
    fish.y += 15;
  }

  if (tank.isShaking) {
    fish.x += random(-5, 5);
    fish.y += random(-5, 5);
  }
}

/**
 * Draws the fish passed in: a body, a tail and a face.
 * A sick fish is green with an X eye and a frown.
 * Everything is measured from the fish's size.
 */
function drawFish(fish) {
  const s = fish.size;

  // Pick the colour: green if sick, its own colour if not
  let bodyColour = fish.colour;
  if (fish.isSick) {
    bodyColour = sickColour;
  }

  // The tail
  push();
  noStroke();
  fill(bodyColour);
  triangle(
    fish.x - s * 0.3, fish.y,
    fish.x - s * 0.7, fish.y - s * 0.25,
    fish.x - s * 0.7, fish.y + s * 0.25
  );
  pop();

  // The body
  push();
  noStroke();
  fill(bodyColour);
  ellipse(fish.x, fish.y, s, s * 0.6);
  pop();

  if (fish.isSick) {
    // An X for an eye
    push();
    stroke(0);
    strokeWeight(2);
    line(fish.x + s * 0.19, fish.y - s * 0.12, fish.x + s * 0.31, fish.y);
    line(fish.x + s * 0.31, fish.y - s * 0.12, fish.x + s * 0.19, fish.y);
    pop();

    // A sad little mouth that slants down
    push();
    stroke(0);
    strokeWeight(2);
    line(fish.x + s * 0.2, fish.y + s * 0.18, fish.x + s * 0.4, fish.y + s * 0.12);
    pop();
  }
  else {
    // A normal eye
    push();
    noStroke();
    fill(255);
    ellipse(fish.x + s * 0.25, fish.y - s * 0.05, s * 0.2);
    fill(0);
    ellipse(fish.x + s * 0.28, fish.y - s * 0.05, s * 0.1);
    pop();
  }
}

/**
 * Makes the fish passed in sick
 */
function makeSick(fish) {
  fish.isSick = true;
}

/**
 * Stops the shaking. Called by the timer.
 */
function stopShaking() {
  tank.isShaking = false;
}

/**
 * Runs when a key is pressed. The spacebar shakes the bowl
 * and makes the fish sick.
 */
function keyPressed(event) {
  const spaceWasPressed = (event.keyCode === 32);

  if (spaceWasPressed && !tank.isShaking) {
    tank.isShaking = true;

    // The shaking makes every fish sick
    makeSick(fish1);
    makeSick(fish2);
    makeSick(fish3);

    // Call stopShaking() once after 1.5 seconds
    setTimeout(stopShaking, tank.shakeTime);
  }
}  