/**
 * Events Prototype 1 - Lightbulb
 * Alycia Malonga
 *
 * A lightbulb that turns on while the spacebar is held down
 * and turns off when it's released.
 *
 */

"use strict";

// Our lightbulb
const bulb = {
    x: 200,
    y: 170,
    size: 150,
    // Is the bulb on right now?
    isOn: false
};

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draws the room and the bulb
 */
function draw() {
    // The room is dark when the bulb is off, lighter when it's on
    if (bulb.isOn) {
        background(80, 80, 110);
    }
    else {
        background(10, 10, 20);
    }

    // The glass (lightbulb interior)
    push();
    stroke(0);
    strokeWeight(3);
    if (bulb.isOn) {
        fill(255, 238, 68);
    }
    else {
        fill(90);
    }
    ellipse(bulb.x, bulb.y, bulb.size);
    pop();

    // The base (the rectangle for the metal part)
    push();
    stroke(0);
    strokeWeight(3);
    fill(150);
    rect(bulb.x - 30, bulb.y + 70, 60, 50);
    pop();
}

/**
 * Turns the bulb on when the space bar is pressed
 */
function keyPressed(event) {
    if (event.keyCode === 32) {
        bulb.isOn = true;
    }
}

/**
 * Turns the bulb off when the space bar is released
 */
function keyReleased(event) {
    if (event.keyCode === 32) {
        bulb.isOn = false;
    }
}