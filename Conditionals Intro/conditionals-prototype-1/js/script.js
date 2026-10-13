/**
 * Shy Creature
 * Alycia Malonga
 *
 * A creature that is shy. It's happy when the mouse is far away,
 * bored when the mouse is at a medium distance, and scared (and runs away) when the mouse gets too close.
 *
 */

"use strict";

// The shy creature position on the screen 
const creature = {
    // Position
    x: 200,
    y: 200,
    // Size
    size: 100,
    // Fill (starts out bored)
    fill: "#000000",
    // How fast it runs away when scared
    speed: 4,
    // Possible fills that show its mood
    fills: {
        bored: "#000000", // Black
        happy: "#33cc33", // Green
        scared: "#3366cc" // Blue
    }
};

// How close the mouse has to be for the creature to be scared
const scaredDistance = 120;
// How far away the mouse has to be for the creature to be happy
const happyDistance = 250;

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Fills the background, checks the mouse, displays the creature
 */
function draw() {
    //changing the background to a lilac purple 
    background(200, 162, 200);

    checkInput();
    drawCreature();
}

/**
 * Responds to how close the mouse is
 */
function checkInput() {
    // How far is the mouse from the creature?
    const d = dist(mouseX, mouseY, creature.x, creature.y);

    // Storing the conditions in variables makes them easier to read
    const mouseIsClose = (d < scaredDistance);
    const mouseIsFar = (d > happyDistance);

    if (mouseIsClose) {
        // Too close! The creature is scared and runs away.
        creature.fill = creature.fills.scared;
        runAway();
    }
    else if (mouseIsFar) {
        // The mouse is far away. The creature feels safe and happy.
        creature.fill = creature.fills.happy;
    }
    else {
        // The mouse is somewhere in between. Nothing much to feel.
        creature.fill = creature.fills.bored;
    }
}

/**
 * Moves the creature directly away from the mouse
 */
function runAway() {
    // The angle from the mouse to the creature points "away" from the mouse
    const angle = atan2(creature.y - mouseY, creature.x - mouseX);

    // Move in that direction
    creature.x += cos(angle) * creature.speed;
    creature.y += sin(angle) * creature.speed;

    // Keep the creature on the canvas
    creature.x = constrain(creature.x, creature.size / 2, width - creature.size / 2);
    creature.y = constrain(creature.y, creature.size / 2, height - creature.size / 2);
}

/**
 * Draws the creature
 */
function drawCreature() {
    push();
    noStroke();
    fill(creature.fill);
    ellipse(creature.x, creature.y, creature.size);
    pop();
}