/**
 * Prototype Project 2
 * Alycia Malonga
 * 
 * Working on two of the three prototype projects for the first assignment in the course.
 * Prototype 2 example; The Ice Cream Cone
 */

"use strict";

/**
 * Creating the canvas and setting up the environment for the project.
*/
function setup() {
// Create a canvas to draw on
createCanvas(640, 640);
}

/**
 * Draws the background and needed shape for the project example 1
 */
function draw() {
// Set the background color to a blue sky color
background(252, 179, 245);



// Bottom scoop
push();
//  Set the fill color to a pinkish color for the bottom scoop of ice cream
fill(255, 102, 178);
ellipse(320, 300, 140, 140);
pop();

// Bottom scoop eyes and smile
push();
// Set the fill color to black for the eyes
fill(0);
// Draw the eyes
ellipse(295, 285, 10, 10); // left eye
ellipse(345, 285, 10, 10); // right eye
noFill();
// Draw the smile
stroke(0);
// Set the stroke weight for the smile
strokeWeight(3);
// Draw the smile using an arc
arc(320, 300, 40, 30, 0, PI); // smile
pop();



// Middle scoop
push();
// Set the fill color to a light pink for the middle scoop of ice cream
fill(255, 153, 200);
// Draw the middle scoop of ice cream
ellipse(320, 190, 140, 140);
pop();
// Middle scoop eyes and smile
push();
// Set the fill color to black for the eyes
fill(0);
// Draw the eyes
ellipse(295, 175, 10, 10);
ellipse(345, 175, 10, 10);
noFill();
// Draw the smile
stroke(0);
strokeWeight(3);
arc(320, 190, 40, 30, 0, PI);
pop();



// Top scoop
push();
// Set the fill color to a light pink for the top scoop of ice cream
fill(255, 200, 220);
//  Draw the top scoop of ice cream
ellipse(320, 80, 140, 140);
pop();
push();
// Set the fill color to black for the eyes
fill(0);
// Draw the eyes
ellipse(295, 65, 10, 10);
ellipse(345, 65, 10, 10);
// Draw the smile
noFill();
// Set the stroke color and weight for the smile
stroke(0);
// Set the stroke weight for the smile
strokeWeight(3);
arc(320, 80, 40, 30, 0, PI);
pop();


push();
// Set the fill color to a light brown for the ice cream cone
fill(255, 204, 153);
// Draw the ice cream cone
triangle(320, 567, 240, 367, 400, 367);
pop();

push();
noStroke();
fill(150, 90, 40); 
// darker brown band
rect(240, 360, 160, 15); 
pop();

push();
noStroke();
fill(255, 255, 255); 
// white scallops, change if you want a different color
for (let x = 250; x <= 390; x += 20) {
  arc(x, 367, 20, 20, 0, PI); 
// half circle bumps
}
pop();



}