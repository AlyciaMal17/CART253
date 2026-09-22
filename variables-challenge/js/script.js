/**
 * Variables Challenge
 * Alycia Malonga and Mariam-Choukri Mahdi
 * 
 *  A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let mrFurious = {
  // Position and size
x : 200,
y : 200,
size: 100,

  // Colour
  fill: {
    r: 255,
    g: 225,
    b: 225,
  }
};

let sky = {
    // color of the sky
    fill: {
        r: 160,
        g: 180,
        b: 200,
    }
}

let bird = {
    // Position 
  x: 10,
  y: 200
  
}

/**
 * Create the canvas
 */
function setup() {
  createCanvas(400, 400);
}

/**
 * Draw (and update) Mr. Furious
 */
function draw() {
background(sky.fill.r, sky.fill.g, sky.fill.b);

// Update Mr. Furious's colour to be more red over time
mrFurious.fill.g = mrFurious.fill.g - 1;
mrFurious.fill.b = mrFurious.fill.b - 1;

// Update sky color to be more darker over time
sky.fill.r = sky.fill.r - 10;
sky.fill.g = sky.fill.g - 10;
sky.fill.b = sky.fill.b - 10;

//Move the bird
bird.x = bird.x + 3;

//shake his head
mrFurious.x = mrFurious.x + random(-2,2);
mrFurious.y = mrFurious.y - random(-2,2);


// Draw Mr. Furious as a coloured circle
push();
noStroke();
fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
pop();

// added the annoying bird
push();
fill (255,20,147)
circle (bird.x,bird.y,25)


}