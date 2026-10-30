/**
 * Arrays Prototype Project 2 - Candy Catcher
 * Alycia Malonga
 *
 * Catch as many falling candies as you can in 45 seconds. Click a
 * candy to catch it. The candies are stored in an array, and a
 * for...of loop moves and draws every one. As the time runs down,
 * the candy falls faster and arrives more often.
 *There is a 45-second timer, candy counter and a final score.
 */

"use strict";

// The candies that are falling (it starts empty)
let candies = [];

// The colours a candy can be (one is picked at random)
const candyColours = ["#ff6699", "#ffd633", "#66ccff", "#99dd66", "#cc66ff"];

// How long the game lasts, in seconds
const gameLength = 45;

// How many seconds are left
let timeLeft = gameLength;

// Is the game over?
let gameIsOver = false;

// How many candies you caught and how many hit the ground
let caught = 0;
let missed = 0;

/**
 * Creates the canvas, starts the countdown and the first candy
 */
function setup() {
  createCanvas(500, 500);

  // Call countDown() every second, forever
  setInterval(countDown, 1000);

  // The first candy arrives after one second
  setTimeout(addCandy, 1000);
}

/**
 * Takes one second off the clock. Called by the timer every second.
 */
function countDown() {
  if (gameIsOver === false) {
    timeLeft -= 1;

    if (timeLeft <= 0) {
      timeLeft = 0;
      gameIsOver = true;
    }
  }
}

/**
 * Calculates how much faster things are right now and returns it.
 * It is 1 at the start and goes up to 2.5 when time is almost out.
 */
function calculateSpeedUp() {
  const result = map(timeLeft, gameLength, 0, 1, 2.5);
  return result;
}

/**
 * Adds a candy to the array, then sets the timer for the next one.
 * The time between candies gets shorter as the game goes on.
 * If the game is over, it does nothing, so the timer stops for good.
 */
function addCandy() {
  if (gameIsOver) {
    return;
  }

  const candy = createCandy();
  candies.push(candy);

  // The delay shrinks from 1000 to 350 milliseconds as time runs out
  const delay = map(timeLeft, gameLength, 0, 1000, 350);
  setTimeout(addCandy, delay);
}

/**
 * Creates and returns a random candy that starts above the canvas
 * and falls down. Its speed depends on how far into the game we are.
 */
function createCandy() {
  const candy = {
    x: random(30, width - 30),
    y: -40,
    speed: random(2, 4) * calculateSpeedUp(),
    size: random(30, 45),
    colour: random(candyColours)
  };
  return candy;
}

/**
 * Draws the background, then either plays the game or shows the end screen
 */
function draw() {
  background(255, 225, 240);

  if (gameIsOver) {
    drawEndScreen();
  }
  else {
    for (const candy of candies) {
      moveCandy(candy);
      drawCandy(candy);
    }

    removeFallenCandy();
    drawScore();
  }
}

/**
 * Draws the time and the score at the top of the canvas
 */
function drawScore() {
  push();
  fill(120, 40, 90);
  textSize(20);
  text("Time: " + timeLeft, 15, 30);
  text("Caught: " + caught, 15, 58);
  pop();
}

/**
 * Draws the end screen with the final score
 */
function drawEndScreen() {
  push();
  fill(120, 40, 90);
  textAlign(CENTER, CENTER);

  textSize(48);
  text("Time's up!", width / 2, height / 2 - 40);

  textSize(26);
  text("You caught " + caught + " candies", width / 2, height / 2 + 20);

  textSize(18);
  text("Refresh the page to play again", width / 2, height / 2 + 60);
  pop();
}

/**
 * Moves the candy passed in down by its speed
 */
function moveCandy(candy) {
  candy.y += candy.speed;
}

/**
 * Draws a candy: a round middle with a triangle wrapper on each side
 */
function drawCandy(candy) {
  const s = candy.size;

  push();
  noStroke();
  fill(candy.colour);

  // The wrapper on the left
  triangle(
    candy.x - s * 0.3, candy.y,
    candy.x - s * 0.8, candy.y - s * 0.3,
    candy.x - s * 0.8, candy.y + s * 0.3
  );

  // The wrapper on the right
  triangle(
    candy.x + s * 0.3, candy.y,
    candy.x + s * 0.8, candy.y - s * 0.3,
    candy.x + s * 0.8, candy.y + s * 0.3
  );

  // The round middle
  ellipse(candy.x, candy.y, s);
  pop();

  // A little shine
  push();
  noStroke();
  fill(255, 255, 255, 180);
  ellipse(candy.x - s * 0.15, candy.y - s * 0.15, s * 0.25);
  pop();
}

/**
 * Removes any candy that fell off the bottom and counts it as missed
 */
function removeFallenCandy() {
  for (const candy of candies) {
    const candyHitTheGround = (candy.y > height + 50);

    if (candyHitTheGround) {
      const index = candies.indexOf(candy);
      candies.splice(index, 1);
      missed += 1;
    }
  }
}

/**
 * Catches a candy if you click near it
 */
function mousePressed() {
  // Once the game is over, clicks do nothing
  if (gameIsOver) {
    return;
  }

  // We need to check EVERY candy to see if it was clicked
  for (const candy of candies) {
    const d = dist(mouseX, mouseY, candy.x, candy.y);

    if (d < candy.size) {
      const index = candies.indexOf(candy);
      candies.splice(index, 1);
      caught += 1;
    }
  }
}