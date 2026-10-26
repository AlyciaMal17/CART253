/**
 * Functions Protoype Project 2 - Buzzing Flies
 * Alycia Malonga
 *
 * Four derpy flies buzz around the canvas. They are calm and
 * happy until the mouse gets close. Then they turn red, get
 * angry, and shake much harder. One function creates every fly,
 * one checks the mouse, one moves every fly, and one draws every fly.
 */

"use strict";

// How close the mouse has to be to make a fly angry
const angerDistance = 100;

// Our four flies (they start undefined and are created in setup())
let fly1 = undefined;
let fly2 = undefined;
let fly3 = undefined;
let fly4 = undefined;

/**
 * Creates the canvas and the flies
 */
function setup() {
  createCanvas(400, 400);

  // From very calm to a little less calm
  fly1 = createFly(1);
  fly2 = createFly(1.5);
  fly3 = createFly(2);
  fly4 = createFly(3);
}

/**
 * Creates a fly object with a random position, a default size,
 * and the calm buzziness that is passed in
 */
function createFly(calmBuzziness) {
  const fly = {
    // Position (random, but not too close to the edges)
    x: random(50, width - 50),
    y: random(50, height - 50),
    // Size (default)
    size: 60,
    // How much it shakes when it is calm (parameter)
    calmBuzziness: calmBuzziness,
    // How much it shakes right now (changes when it gets angry)
    buzziness: calmBuzziness,
    // Is it angry right now?
    isAngry: false,
  };
  return fly;
}

/**
 * Background, move all the flies, draw all the flies
 */
function draw() {
  background(150, 200, 250);

  moveFly(fly1);
  moveFly(fly2);
  moveFly(fly3);
  moveFly(fly4);

  drawFly(fly1);
  drawFly(fly2);
  drawFly(fly3);
  drawFly(fly4);
}

/**
 * Returns true if the mouse is close to the fly passed in,
 * and false if it is not
 */
function mouseIsCloseTo(fly) {
  const d = dist(mouseX, mouseY, fly.x, fly.y);
  const result = d < angerDistance;
  return result;
}

/**
 * Checks the mouse, then moves the fly passed in by a random amount
 */
function moveFly(fly) {
  // Ask the function above whether the mouse is close
  const mouseIsClose = mouseIsCloseTo(fly);

  if (mouseIsClose) {
    // The mouse is close: angry, and it shakes a lot more
    fly.isAngry = true;
    fly.buzziness = fly.calmBuzziness * 3 + 4;
  } else {
    // The mouse is far: calm and happy again
    fly.isAngry = false;
    fly.buzziness = fly.calmBuzziness;
  }

  fly.x += random(-fly.buzziness, fly.buzziness);
  fly.y += random(-fly.buzziness, fly.buzziness);

  // Keep the fly on the canvas
  fly.x = constrain(fly.x, fly.size / 2, width - fly.size / 2);
  fly.y = constrain(fly.y, fly.size / 2, height - fly.size / 2);
}

/**
 * Draws the fly passed in. Everything is measured from the fly's
 * size, and the colours and face change if the fly is angry.
 */
function drawFly(fly) {
  const s = fly.size;

  // The wings
  push();
  noStroke();
  fill(220, 240, 255);
  ellipse(fly.x - s * 0.3, fly.y - s * 0.5, s * 0.5, s * 0.7);
  ellipse(fly.x + s * 0.3, fly.y - s * 0.5, s * 0.5, s * 0.7);
  pop();

  // The body: red when angry, dark grey when calm
  push();
  noStroke();
  if (fly.isAngry) {
    fill(220, 30, 30);
  } else {
    fill(70);
  }
  ellipse(fly.x, fly.y, s);
  pop();

  // The eyes (one big, one small, so it looks derpy)
  push();
  noStroke();
  fill(255);
  ellipse(fly.x - s * 0.18, fly.y - s * 0.1, s * 0.38);
  ellipse(fly.x + s * 0.2, fly.y - s * 0.1, s * 0.24);
  pop();

  // The pupils (both look towards the middle, so it's cross-eyed)
  push();
  noStroke();
  fill(0);
  ellipse(fly.x - s * 0.1, fly.y - s * 0.08, s * 0.14);
  ellipse(fly.x + s * 0.16, fly.y - s * 0.08, s * 0.1);
  pop();

  if (fly.isAngry) {
    // Angry eyebrows (the inside ends are lower)
    push();
    stroke(0);
    strokeWeight(3);
    line(fly.x - s * 0.38, fly.y - s * 0.4, fly.x - s * 0.05, fly.y - s * 0.26);
    line(
      fly.x + s * 0.08,
      fly.y - s * 0.24,
      fly.x + s * 0.34,
      fly.y - s * 0.36,
    );
    pop();

    // A frown (the top half of an ellipse)
    push();
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(fly.x, fly.y + s * 0.35, s * 0.4, s * 0.25, PI, TWO_PI);
    pop();
  } else {
    // A happy smile (the bottom half of an ellipse)
    push();
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(fly.x, fly.y + s * 0.15, s * 0.4, s * 0.25, 0, PI);
    pop();

    // The tongue sticking out of the smile
    push();
    noStroke();
    fill(255, 120, 150);
    ellipse(fly.x + s * 0.1, fly.y + s * 0.33, s * 0.15, s * 0.2);
    pop();
  }
}
