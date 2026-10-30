/**
 * Arrays Prototype Project 3 - Annoyed Ghost
 * Alycia Malonga
 *
 * A ghost is trick-or-treating, but nobody will open the door
 * because they think he's a real ghost. Click to move through
 * what he says. The lines are stored in an array, and the dialogue
 * box border turns from white to red as he gets more annoyed.
 * Image: from google search
 */

"use strict";

// What the ghost says, in order
const speech = [
  "Trick or treat!",
  "Hello?",
  "I can see your lights on.",
  "I'm just wearing a costume. Mostly.",
  "Please stop hiding behind the curtain.",
  "I'm a kid. I swear.",
  "...",
  "Okay, that was one time. In 1743.",
  "I only want one candy.",
  "Fine. I'll go to the next house."
];

// Which line are we on?
let speechIndex = 0;

// The dialogue box
const box = {
  x: 25,
  y: 400,
  width: 450,
  height: 80,
  padding: 15,
  fontSize: 20
};

// The picture of the ghost at the house (nothing useful in it YET)
let ghostImage = undefined;

/**
 * Loads the picture
 */
function preload() {
  ghostImage = loadImage("../../assets/image/ghostimage.jpeg");
}

/**
 * Creates the canvas after the picture has loaded
 */
function setup() {
  createCanvas(500, 500);
}

/**
 * Draws the picture and the dialogue box
 */
function draw() {
  background(0);

  // Stretches the picture to fill the canvas
  image(ghostImage, 0, 0, width, height);

  showDialog();
}

/**
 * Displays the current line in a dialogue box
 */
function showDialog() {
  // The border goes from white to red as the lines go on
  const lastIndex = speech.length - 1;
  const fadeAmount = map(speechIndex, 0, lastIndex, 255, 0);

  // The box
  push();
  fill(0);
  stroke(255, fadeAmount, fadeAmount);
  strokeWeight(4);
  rect(box.x, box.y, box.width, box.height);
  pop();

  // The text, wrapped inside the box using the padding
  push();
  fill(255);
  textSize(box.fontSize);
  text(
    speech[speechIndex],
    box.x + box.padding,
    box.y + box.padding,
    box.width - 2 * box.padding,
    box.height - 2 * box.padding
  );
  pop();
}

/**
 * Moves to the next line when the mouse is pressed,
 * unless he has already said the last one
 */
function mousePressed() {
  if (speechIndex < speech.length - 1) {
    speechIndex++;
  }
}