/**
 * Events Prototype 2 - The Stop Light
 * Alycia Malonga
 *
 * A traffic light that you control by clicking.
 * The car only drives when the light is green.
 *
 */

"use strict";

// Our traffic light
const trafficLight = {
    x: 320,
    y: 130,
    // Is the light green right now? (false means red)
    isGreen: false
};

// The red mini car (x and y are the top left of the body)
const car = {
    x: 20,
    y: 320,
    speed: 3
};

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draws the scene and moves the car if the light is green
 */
function draw() {
    background(150, 200, 250);

    // The road
    push();
    noStroke();
    fill(70);
    rect(0, 300, width, 80);
    pop();

    // The traffic light box
    push();
    fill(30);
    rect(trafficLight.x - 50, trafficLight.y - 110, 100, 220);
    pop();

    // The top lamp (red)
    push();
    noStroke();
    if (trafficLight.isGreen) {
        fill(80, 0, 0);
    }
    else {
        fill(255, 0, 0);
    }
    ellipse(trafficLight.x, trafficLight.y - 50, 70);
    pop();

    // The bottom lamp (green)
    push();
    noStroke();
    if (trafficLight.isGreen) {
        fill(0, 255, 0);
    }
    else {
        fill(0, 80, 0);
    }
    ellipse(trafficLight.x, trafficLight.y + 50, 70);
    pop();

    // The car only moves when the light is green
    if (trafficLight.isGreen) {
        car.x += car.speed;
    }

    // When the car drives off the right side, it comes back on the left
    if (car.x > width) {
        car.x = -80;
    }

    // The car: two rectangles and two wheels
    push();
    noStroke();
    fill(200, 50, 50);
    rect(car.x, car.y, 80, 30);
    rect(car.x + 15, car.y - 20, 50, 20);
    fill(20);
    ellipse(car.x + 20, car.y + 30, 20);
    ellipse(car.x + 60, car.y + 30, 20);
    pop();
}

/**
 * Switches the light each time the mouse is clicked
 */
function mousePressed() {
    if (trafficLight.isGreen) {
        trafficLight.isGreen = false;
    }
    else {
        trafficLight.isGreen = true;
    }
}