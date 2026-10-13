/**
 * Heartbeat (mouse controlled)
 * Alycia Malonga
 *
 * Move the mouse left and right to make the heart expand and retreat.It changes from pink to bright red as it grows.
 *
 */


/**
 * The Second prototype: 
*/
// The heart (x and y are the centre of the heart)
let heart = {
    x: 240,
    y: 240,
    size: 100,
    red: 255,
    green: 150,
    blue: 180
};

function setup() {
    createCanvas(480, 480);
}

function draw() {
    background(20);

    // The mouse's horizontal position sets the base size
    let baseSize = map(mouseX, 0, width, 80, 350, true);

    // A small sine wave adds a steady beat on top
    let beat = sin(frameCount * 0.1) * 10;

    heart.size = baseSize + beat;

    // Pink when small, bright red when large
    heart.green = map(mouseX, 0, width, 150, 0, true);
    heart.blue = map(mouseX, 0, width, 180, 0, true);

    // Every part of the heart is measured from heart.size,
    // so the whole shape scales together
    let s = heart.size;

    // The bottom point of the heart (shifted so the heart looks centred)
    let bottomY = heart.y + s * 0.55;

    push();
    noStroke();
    fill(heart.red, heart.green, heart.blue);

    // A diamond makes the body and the pointed bottom
    quad(
        heart.x, bottomY,                // bottom point
        heart.x - s * 0.5, bottomY - s * 0.5,  // left corner
        heart.x, bottomY - s,            // top middle (the dip between the lobes)
        heart.x + s * 0.5, bottomY - s * 0.5   // right corner
    );

    // Two circles sit on the upper left and upper right sides
    // Their diameter equals the side of the diamond (s * 0.7071)
    ellipse(heart.x - s * 0.25, bottomY - s * 0.75, s * 0.7071);
    ellipse(heart.x + s * 0.25, bottomY - s * 0.75, s * 0.7071);
    pop();

}