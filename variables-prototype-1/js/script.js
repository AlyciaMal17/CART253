/**
 * Variables 3 prototype project - The Sunset
 * Alycia Malonga
 * 
 * Here you will find my 1/3 different prototype projects for this assignement.
 */

"use strict";

/**
 * The first prototype: 
*/
function setup() {
    createCanvas(500, 500);
}

// Colour of the sky (these values will change with the mouse position)
let sky = {
    red: 150,
    green: 180,
    blue: 250
};

// The sun
let sun = {
    red: 255,
    green: 255,
    blue: 0,
    x: 320,
    y: 60,
    size: 100,
    size: 100
};

function setup() {
    createCanvas(640, 320);
}

function draw() {
    // The sun's height follows the mouse's height
    // constrain() keeps it from going outside the range we want
    sun.y = constrain(mouseY, 60, 320);

    // Tie the colours to the sun's height with map()
    // High on screen = bright day, low on screen = dark night
    sky.red = map(sun.y, 60, 320, 150, 20);
    sky.green = map(sun.y, 60, 320, 180, 20);
    sky.blue = map(sun.y, 60, 320, 250, 70);

    // The sun turns from yellow to orange-red as it gets lower
    sun.green = map(sun.y, 60, 320, 255, 60);

    // The sky
    background(sky.red, sky.green, sky.blue);

    // The sun
    push();
    noStroke();
    fill(sun.red, sun.green, sun.blue);
    ellipse(sun.x, sun.y, sun.size);
    pop();

    // The ground in green, drawn after the sun so the sun sinks behind it
    push();
    noStroke();
    fill(20, 40, 20);
    rect(0, 260, width, 60);
    pop();
}