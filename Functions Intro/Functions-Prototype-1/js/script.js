/**
 * Functions Protoype Project 1 - Balloon Stand
 * Alycia Malonga
 *
 * A carnival balloon stand. Each balloon takes three clicks:
 * the first makes it swell a little, the second turns it orange,
 * and the third pops it. One function draws every balloon, and
 * one function creates every balloon object.
 */

"use strict";

// The colour every balloon turns on the second click
const warningColour = "#ff9933";

// Our five balloons (they start undefined and are created in setup())
let balloon1 = undefined;
let balloon2 = undefined;
let balloon3 = undefined;
let balloon4 = undefined;
let balloon5 = undefined;

/**
 * Creates the canvas and the balloons
 */
function setup() {
  createCanvas(400, 400);

  balloon1 = createBalloon(60, "#ff4d4d");
  balloon2 = createBalloon(130, "#ffd633");
  balloon3 = createBalloon(200, "#4d94ff");
  balloon4 = createBalloon(270, "#66cc66");
  balloon5 = createBalloon(340, "#ff80c0");
}

/**
 * Creates a balloon object at a given x position with a given colour
 */
function createBalloon(x, colour) {
  const balloon = {
    // Position (x comes from the parameter, y is the same for all)
    x: x,
    y: 190,
    // Size (default)
    size: 60,
    // Colour (parameter)
    colour: colour,
    // How many times it has been clicked
    clicks: 0,
    // Has it been popped?
    isPopped: false,
  };
  return balloon;
}

/**
 * Draws the stand and all the balloons
 */
function draw() {
  background(150, 200, 250);

  drawStand();

  drawBalloon(balloon1);
  drawBalloon(balloon2);
  drawBalloon(balloon3);
  drawBalloon(balloon4);
  drawBalloon(balloon5);
}

/**
 * Draws the stand: two posts, an awning and a counter
 */
function drawStand() {
  push();
  noStroke();

  // The posts
  fill(120, 70, 30);
  rect(10, 80, 15, 320);
  rect(375, 80, 15, 320);

  // The awning (red with three white stripes)
  fill(220, 50, 50);
  rect(0, 40, width, 50);
  fill(255);
  rect(60, 40, 40, 50);
  rect(180, 40, 40, 50);
  rect(300, 40, 40, 50);

  // The counter
  fill(150, 90, 40);
  rect(0, 290, width, 110);
  pop();
}

/**
 * Draws the balloon passed in, unless it has been popped
 */
function drawBalloon(balloon) {
  if (balloon.isPopped === false) {
    // The string
    push();
    stroke(80);
    strokeWeight(2);
    line(balloon.x, balloon.y + balloon.size / 2, balloon.x, 290);
    pop();

    // The balloon
    push();
    noStroke();
    fill(balloon.colour);
    ellipse(balloon.x, balloon.y, balloon.size);
    pop();
  }
}

/**
 * Hits the balloon passed in if the mouse is on it.
 * 1st click: it swells. 2nd click: it changes colour. 3rd click: it pops.
 */
function hitIfClicked(balloon) {
  const d = dist(mouseX, mouseY, balloon.x, balloon.y);
  const mouseIsOnBalloon = d < balloon.size / 2;

  if (mouseIsOnBalloon && balloon.isPopped === false) {
    balloon.clicks += 1;

    if (balloon.clicks === 1) {
      // First click: it swells a little
      balloon.size = 70;
    } else if (balloon.clicks === 2) {
      // Second click: it turns a different colour
      balloon.colour = warningColour;
    } else {
      // Third click: it pops for real
      balloon.isPopped = true;
    }
  }
}

/**
 * Runs when the mouse is pressed. Checks every balloon.
 */
function mousePressed() {
  hitIfClicked(balloon1);
  hitIfClicked(balloon2);
  hitIfClicked(balloon3);
  hitIfClicked(balloon4);
  hitIfClicked(balloon5);
}
