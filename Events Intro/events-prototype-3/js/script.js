/**
 * The Barking Doorbell
 * Alycia Malonga
 *
 * Click the doorbell button and a dog barks inside the house.
 * The door opens and the light turns on, then the door closes
 * after 2 seconds.
 */

"use strict";

// Our door
const door = {
    x: 120,
    y: 100,
    w: 100,
    h: 220,
    // Is the door open right now?
    isOpen: false,
    // How long it stays open, in milliseconds
    delay: 2000
};

// The doorbell button
const button = {
    x: 300,
    y: 210,
    size: 40
};

// The light above the door
const light = {
    x: 170,
    y: 60,
    size: 40
};

// The bark sound (nothing useful in it YET)
let barkSFX = undefined;

/**
 * Load the bark sound
 */
async function preload() {
    barkSFX = await loadSound("assets/sounds/bark.wav");
}

/**
 * Creates the canvas and loads the sound
 */
async function setup() {
    createCanvas(400, 400);

    await preload();
}

/**
 * Draws the wall, the ground, the door, the light and the button
 */
function draw() {
    // The wall
    background(200, 170, 140);

    // The ground
    push();
    noStroke();
    fill(90, 70, 50);
    rect(0, 320, width, 80);
    pop();

    // The door
    push();
    stroke(0);
    strokeWeight(3);
    if (door.isOpen) {
        // Open: a warm yellow room behind a thin slice of door
        fill(255, 230, 150);
        rect(door.x, door.y, door.w, door.h);
        fill(120, 70, 30);
        rect(door.x, door.y, 25, door.h);
    }
    else {
        // Closed: a brown door with a doorknob
        fill(120, 70, 30);
        rect(door.x, door.y, door.w, door.h);
        fill(255, 220, 0);
        ellipse(door.x + door.w - 15, door.y + door.h / 2, 12);
    }
    pop();

    // The light is on when the door is open
    push();
    stroke(0);
    strokeWeight(3);
    if (door.isOpen) {
        fill(255, 238, 68);
    }
    else {
        fill(120);
    }
    ellipse(light.x, light.y, light.size);
    pop();

    // The doorbell: a small plate with a round button on it
    push();
    stroke(0);
    strokeWeight(3);
    fill(230);
    rect(button.x - 25, button.y - 35, 50, 70);
    if (door.isOpen) {
        // Darker red while the door is open
        fill(120, 20, 20);
    }
    else {
        fill(200, 50, 50);
    }
    ellipse(button.x, button.y, button.size);
    pop();
}

/**
 * Runs when the mouse is pressed. If the doorbell button was
 * clicked and the door is closed, make the dog bark and open the door.
 */
function mousePressed() {
    // Is the mouse on the button?
    const d = dist(mouseX, mouseY, button.x, button.y);
    const clickedButton = (d < button.size / 2);

    if (clickedButton && !door.isOpen) {
        door.isOpen = true;

        // The dog barks once
        barkSFX.play();

        // Close the door after 2 seconds
        setTimeout(closeDoor, door.delay);
    }
}

/**
 * Closes the door. Called by the timer.
 */
function closeDoor() {
    door.isOpen = false;
}