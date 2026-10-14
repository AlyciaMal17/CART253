/**
 * Mr. Mercurial
 * Alycia Malonga
 *
 * A face whose mood depends on where the mouse is.
 * Mouse in the top third: happy. Middle third: neutral.
 * Bottom third: sad.
 *
 */

"use strict";

// Our face
const face = {
    // Position
    x: 200,
    y: 200,
    // Size
    size: 300,
    // Fill (starts out neutral)
    fill: "#cccccc",
    // Possible fills that show its mood
    fills: {
        happy: "#ffdd33", // Yellow
        neutral: "#cccccc", // Grey
        sad: "#6699ee" // Blue
    }
};

// The emotions displayed by the facial features created using the mouth is doing: "smile", "flat", or "frown"
let mouth = "flat";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
//Fills the background, checks the mouse, displays the face
 */
function draw() {
    background(220, 200, 235);

    checkInput();
    drawFace();
}

/**
 * Responds to where the mouse is
 */
function checkInput() {
    // Storing the conditions in variables makes them easier to read
    const mouseIsInTop = (mouseY < height / 3);
    const mouseIsInMiddle = (mouseY < (height / 3) * 2);

    if (mouseIsInTop) {
        // Mouse is high up: the face is happy
        face.fill = face.fills.happy;
        mouth = "smile";
    }
    else if (mouseIsInMiddle) {
        // Mouse is in the middle: the face doesn't feel much
        face.fill = face.fills.neutral;
        mouth = "flat";
    }
    else {
        // Mouse is low down: the face is sad
        face.fill = face.fills.sad;
        mouth = "frown";
    }
}

/**
 * Draws the face: head, eyes, and a mouth that depends on the mood
 */
function drawFace() {
    // Head
    push();
    stroke(0);
    strokeWeight(3);
    fill(face.fill);
    ellipse(face.x, face.y, face.size);
    pop();

    // Eyes
    push();
    noStroke();
    fill(0);
    ellipse(face.x - 55, face.y - 35, 30);
    ellipse(face.x + 55, face.y - 35, 30);
    pop();

    // Mouth
    push();
    noFill();
    stroke(0);
    strokeWeight(6);
    strokeCap(ROUND);
    if (mouth === "smile") {
        // The bottom half of an ellipse looks like a smile
        arc(face.x, face.y + 35, 120, 80, 0, PI);
    }
    else if (mouth === "frown") {
        // The top half of an ellipse looks like a frown
        arc(face.x, face.y + 70, 120, 80, PI, TWO_PI);
    }
    else {
        // A flat line
        line(face.x - 50, face.y + 60, face.x + 50, face.y + 60);
    }
    pop();
}