/**
 * Arrays Protoype Porject 1 - Night Sky
 * Alycia Malonga
 *
 * An ombre night sky full of twinkling stars that drift around
 * and scatter away from the mouse. Press the spacebar to add a
 * star, and click a star to remove it. The stars are stored in an
 * array.
 * 
 */

"use strict";

// The colours of the ombre sky, from the top of the canvas to the bottom
const skyColours = [
  "#0b0b2e",
  "#16164a",
  "#26226b",
  "#3d2f86",
  "#5e3f98",
  "#8a5aa8",
  "#c47fb0"
];

// One star is added for each size in this list (so we can add a group at once)
const starSizes = [3, 5, 4, 6, 3, 4, 5, 3, 6, 4];

// The stars that float around (it starts empty)
let stars = [];

// How close the mouse has to be to scatter a star
const scatterDistance = 100;

/**
 * Creates the canvas and the first stars
 */
function setup() {
  createCanvas(500, 500);

  // Three groups of ten stars = 30 stars
  addStarGroup();
  addStarGroup();
  addStarGroup();
}

/**
 * Adds one star for every size in the starSizes array
 */
function addStarGroup() {
  for (const size of starSizes) {
    addStar(size);
  }
}

/**
 * Adds a star of the given size at a random spot in the sky
 */
function addStar(size) {
  const x = random(20, width - 20);
  const y = random(20, height - 20);

  const star = createStar(x, y, size);
  stars.push(star);
}

/**
 * Creates and returns a star object using the values provided
 */
function createStar(x, y, size) {
  const star = {
    x: x,
    y: y,
    size: size,
    // A random timing offset so the stars don't all twinkle together
    offset: random(0, 10),
    velocity: {
      x: random(-0.5, 0.5),
      y: random(-0.5, 0.5)
    }
  };
  return star;
}

/**
 * Draws the sky, then updates and draws every star
 */
function draw() {
  drawSky();

  for (const star of stars) {
    updateStar(star);
    drawStar(star);
  }
}

/**
 * Draws the ombre sky as a stack of coloured bands
 */
function drawSky() {
  const bandHeight = height / skyColours.length;

  push();
  noStroke();
  for (const colour of skyColours) {
    // The index tells us which band this is (0 is the top)
    const index = skyColours.indexOf(colour);
    fill(colour);
    rect(0, index * bandHeight, width, bandHeight + 1);
  }
  pop();
}

/**
 * Applies the forces to the star passed in, then moves it
 */
function updateStar(star) {
  applyForces(star);
  moveStar(star);
}

/**
 * Slows the star down, gives it a gentle drift,
 * and pushes it away if the mouse is close
 */
function applyForces(star) {
  // Friction: multiplying by less than 1 makes it slow down
  star.velocity.x *= 0.96;
  star.velocity.y *= 0.96;

  // A tiny random drift so the stars never stop completely
  star.velocity.x += random(-0.03, 0.03);
  star.velocity.y += random(-0.03, 0.03);

  // If the mouse is close, the star accelerates away from it
  const d = dist(mouseX, mouseY, star.x, star.y);
  const mouseIsClose = (d < scatterDistance);

  if (mouseIsClose) {
    star.velocity.x += (star.x - mouseX) * 0.01;
    star.velocity.y += (star.y - mouseY) * 0.01;
  }
}

/**
 * Applies the star's velocity to its position and bounces it
 * off the edges of the sky
 */
function moveStar(star) {
  star.x += star.velocity.x;
  star.y += star.velocity.y;

  if (star.x < 0 || star.x > width) {
    star.velocity.x = -star.velocity.x;
  }
  if (star.y < 0 || star.y > height) {
    star.velocity.y = -star.velocity.y;
  }

  star.x = constrain(star.x, 0, width);
  star.y = constrain(star.y, 0, height);
}

/**
 * Calculates how big the star is right now so it twinkles,
 * and returns the result
 */
function calculateTwinkle(star) {
  const result = star.size + sin(frameCount * 0.05 + star.offset) * star.size * 0.4;
  return result;
}

/**
 * Draws a star from two triangles (one up, one down) with a soft glow.
 * Everything is measured from the star's twinkling size.
 */
function drawStar(star) {
  const twinkle = calculateTwinkle(star);

  // The radius of the star (how far the points reach from the centre)
  const r = twinkle * 2;

  // 0.866 and 0.5 place the corners evenly around the centre
  const sideX = r * 0.866;
  const sideY = r * 0.5;

  // The glow
  push();
  noStroke();
  fill(255, 255, 220, 50);
  ellipse(star.x, star.y, r * 3);
  pop();

  // The star: two triangles on top of each other
  push();
  noStroke();
  fill(255, 255, 230);

  // Triangle pointing up
  triangle(
    star.x, star.y - r,
    star.x - sideX, star.y + sideY,
    star.x + sideX, star.y + sideY
  );

  // Triangle pointing down
  triangle(
    star.x, star.y + r,
    star.x - sideX, star.y - sideY,
    star.x + sideX, star.y - sideY
  );
  pop();
}

/**
 * Adds a star when the spacebar is pressed
 */
function keyPressed(event) {
  if (event.keyCode === 32) {
    addStar(random(starSizes));
  }
}

/**
 * Removes a star if you click on it
 */
function mousePressed() {
  for (const star of stars) {
    const d = dist(mouseX, mouseY, star.x, star.y);
    if (d < star.size * 3) {
      const index = stars.indexOf(star);
      stars.splice(index, 1);
    }
  }
}