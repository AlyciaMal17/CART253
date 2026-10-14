/**
 * Sleepy Eyes
 * Alycia Malonga
 *
 * Two eyes with eyelids that slowly close and the eyes get darker
 * while the mouse is pressed, then slowly open again when it's released.
 */

"use strict";

// How open the eyes are: 1 is fully open, 0 is fully closed
let openness = 1;

// How much openness changes each frame (smaller = slower)
const blinkSpeed = 0.01;

// The lids are the same colour as the background, so they hide the eye
const bgColour = "#dcc8eb";

// Our left eye
const leftEye = {
    x: 115,
    y: 200,
    size: 150,
    pupilSize: 60
};

// Our right eye
const rightEye = {
    x: 285,
    y: 200,
    size: 150,
    pupilSize: 60
};

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Updates how open the eyes are, then draws everything
 */
function draw() {
    background(bgColour);

    updateOpenness();
    drawEyes();
    drawLids();
}

/**
 * Closes the eyes a little while the mouse is pressed,
 * and opens them a little when it isn't
 */
function updateOpenness() {
    if (mouseIsPressed) {
        openness -= blinkSpeed;
    }
    else {
        openness += blinkSpeed;
    }

    // Keep it between 0 (closed) and 1 (open)
    openness = constrain(openness, 0, 1);
}

/**
 * Draws the two eyes. They never change size or position,
 * but they get darker as openness goes down.
 */
function drawEyes() {
    // 255 (white) when open, 70 (dark grey) when almost closed
    const shade = map(openness, 0, 1, 70, 255);

    // The whites of the eyes
    push();
    stroke(0);
    strokeWeight(4);
    fill(shade);
    ellipse(leftEye.x, leftEye.y, leftEye.size);
    ellipse(rightEye.x, rightEye.y, rightEye.size);
    pop();

    // The pupils
    push();
    noStroke();
    fill(0);
    ellipse(leftEye.x, leftEye.y, leftEye.pupilSize);
    ellipse(rightEye.x, rightEye.y, rightEye.pupilSize);
    pop();
}

/**
//Draws a lid coming down from the top and one coming up
//from the bottom. They meet in the middle when openness is 0.
 */
function drawLids() {
    // How tall each lid is: 0 when open, half the eye when closed
    const lidHeight = (1 - openness) * (leftEye.size / 2);

    // Where the top and bottom of the eyes are
    const eyeTop = leftEye.y - leftEye.size / 2;
    const eyeBottom = leftEye.y + leftEye.size / 2;

    push();
    noStroke();
    fill(bgColour);

    // Top lids (the extra 5 covers the eye's outline)
    rect(leftEye.x - leftEye.size / 2, eyeTop - 5, leftEye.size, lidHeight + 5);
    rect(rightEye.x - rightEye.size / 2, eyeTop - 5, rightEye.size, lidHeight + 5);

    // Bottom lids
    rect(leftEye.x - leftEye.size / 2, eyeBottom - lidHeight, leftEye.size, lidHeight + 5);
    rect(rightEye.x - rightEye.size / 2, eyeBottom - lidHeight, rightEye.size, lidHeight + 5);
    pop();

    // Once the eyes are fully shut, draw a line where the lids meet
    const eyesAreShut = (openness <= 0);

    if (eyesAreShut) {
        push();
        stroke(0);
        strokeWeight(8);
        strokeCap(ROUND);
        line(leftEye.x - leftEye.size / 2, leftEye.y, leftEye.x + leftEye.size / 2, leftEye.y);
        line(rightEye.x - rightEye.size / 2, rightEye.y, rightEye.x + rightEye.size / 2, rightEye.y);
        pop();
    }
}