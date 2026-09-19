/**
 * Prototype Project 1
 * Alycia Malonga
 * 
 * Working on one of the three prototype projects for the first assignment in the course.
 * Prototype 1 example; The fish
 */

"use strict";

/**
 * creating the canvas for the prototype
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
background(139, 190, 247);

push();
// Set the fill color to a purple color
fill(146, 4, 214);
//changed the color of the stroke to black
stroke(146, 4, 214);
// Draw a circle in the center of the canva
ellipse(320, 320, 340, 320);
pop();


push();
// set the stroke color to the same as the circle
stroke (146, 4, 214);
//Change the fill color to a light purple color
fill(146, 4, 214);
//Draw an arc in the midddle of the circle
arc(540, 290, 150, 230, 170, PI + HALF_PI);
pop();


push();
//changed the color of the new circle for the eye to
fill(255, 255, 255);
//New circle for the eye of the character
circle(240, 280, 100);
pop();


push();
//changed the color of the new circle for the iris of the eye to green
fill(122, 194, 72);
//New circle for the iris of the character
circle(220, 280, 50);
pop();

push();
//changed the color of the new rectangle for fin color of the fish
fill(222, 129, 215);
//changed the color of the stroke to the same as the fill color
stroke (146, 4, 214);
//New rectangle for the fin of the fish
rect(320, 250, 145, 130, 310, 315, 315, 5);
pop();

(push);
//Adding the lips to the fish same color purple as fill of the body of the fish
fill(146, 4, 214);
//changed the color of the stroke to the same as the fill color
stroke(146, 4, 214);
ellipse(160, 350, 60, 25);
pop();

(push);
//Adding the bottom lips to the fish same color as fill purple
fill(146, 4, 214);
//changed the color of the stroke to the same as the fill color
stroke(146, 4, 214);
ellipse(160, 370, 60, 25);
pop();

(push);
//Adding a fin to the top of the fish in purple same color as the fill of the body of the fish
fill(146, 4, 214);
//changed the color of the stroke to the same as the fill color
stroke(146, 4, 214);
arc(300, 175, 185, 90, PI + QUARTER_PI, TWO_PI);
pop();

//Changed the color at the bottom of the sea
push();
//changed the color of the new rectangle for the floor of the sea to a light brown color
fill(232, 197, 132);
//New rectangle for the floor of the sea
rect(-10, 525, 650, 120);
pop();

}