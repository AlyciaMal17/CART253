/**
 * Nervous Dot
 * Alycia Malonga
 *
 * A small dot that gets more anxious every time you click it.
 * The more it's clicked, the bigger it grows and the harder it shakes.
 */

"use strict";

// The dot
let dot = {
    // Where the dot "lives" (the middle of the canvas)
    homeX: 250,
    homeY: 250,
    // Where the dot is actually drawn (changes every frame because of the shaking)
    x: 250,
    y: 250,
    size: 30,
    shade: 255,
    // How many times it has been clicked
    clicks: 0,
    // How far it can jump away from home each frame
    shake: 1
};

function setup() {
    createCanvas(500, 500);
}

function draw() {
    background(20);

    // Size and shaking both grow with the number of clicks
    // constrain() stops the dot from getting too big for the canvas
    dot.size = constrain(30 + dot.clicks * 12, 30, 450);
    dot.shake = 1 + dot.clicks * 1.5;

    // The dot turns from white to red as it gets more anxious
    dot.shade = map(dot.clicks, 0, 20, 255, 0, true);

    // A new random jump every frame, bigger jumps with more clicks
    dot.x = dot.homeX + random(-dot.shake, dot.shake);
    dot.y = dot.homeY + random(-dot.shake, dot.shake);

    // The dot
    push();
    noStroke();
    fill(255, dot.shade, dot.shade);
    ellipse(dot.x, dot.y, dot.size);
    pop();
}

// Runs once every time the mouse is clicked
function mousePressed() {
    // Only count the click if the mouse is on the dot
    // (distance from the mouse to the centre is less than the radius)
    let d = dist(mouseX, mouseY, dot.homeX, dot.homeY);
    if (d < dot.size / 2) {
        dot.clicks += 1;
    }
}