/**
 * Prototype Project 3
 * Alycia Malonga
 * 
 * Working on the third of the three prototype projects for the first assignment in the course.
 * Prototype 3 example; Absteact Minion
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
 * Draws the background and needed shape for the project example 2
 */
function draw() {
// Set the background color to a blue sky color
background(202, 179, 252);


//Character Design;
//Create a yellow oval for the body of the character
fill(255, 255, 0);
ellipse(320, 320, 300, 500);

// Goggle strap across the head (behind the goggle)
stroke(50);
strokeWeight(15);
line(180, 200, 460, 200);

// Create a white oval for the eye of the character
fill(255);
ellipse(320, 200, 100, 100);

// Create a black oval for the pupil of the character
fill(0);
ellipse(320, 200, 50, 50);

// Create a black line for the mouth of the character
stroke(5);
strokeWeight(5);
line(270, 400, 370, 400);



// Create a blue rectangle for the overalls of the character;
// Outer rectangle - darker blue, bigger, overlapping the minion's body
noStroke();
// dark navy blue
fill(20, 30, 100); 
rect(190, 380, 260, 200);

// Inner rectangle - lighter blue, smaller, centered on top of the darker one
// lighter blue
fill(80, 130, 220); 
rect(220, 410, 200, 110);

// Create a blue rectangle for the overalls of the character
// Outer rectangle - darker blue, bigger, overlapping the minion's body
noStroke();
// dark navy blue
fill(20, 30, 100); 
rect(190, 380, 260, 200);

// Inner rectangle - lighter blue, smaller, centered on top of the darker one
// lighter blue
fill(80, 130, 220); 
rect(220, 410, 200, 110);

// Feet - small squares for the legs/ankles
// same dark navy as the outer overalls
fill(20, 30, 100);
// left leg
rect(230, 580, 40, 30); 
// right leg
rect(370, 580, 40, 30); 

// Feet - circles underneath for rounded shoes
// dark grey/black shoes
fill(30, 30, 30); 
// left shoe
ellipse(250, 620, 60, 40); 
// right shoe
ellipse(390, 620, 60, 40); 


// Arms - yellow rectangles sticking out from the sides of the body
noStroke();
fill(255, 255, 0); 
// yellow, same as the minion's body
// left arm
rect(150, 400, 40, 120); 
// right arm
rect(450, 400, 40, 120); 

// Hands - black circles at the end of each arm
fill(0);
// left hand
ellipse(170, 530, 50, 50); 
// right hand
ellipse(470, 530, 50, 50); 

// Smile - a curved arc for the mouth
noFill();
stroke(0);
strokeWeight(5);
// smile curve
arc(320, 325, 100, 60, 0, PI); 


}