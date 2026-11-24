/**
 * MONKEY STEAL MONKEY MOVE
 * Alycia Malonga
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
 noStroke();
  fill(130, 80, 45);
  ellipse(0, 12, 44, 54);
  ellipse(-11, 38, 13, 20);
  ellipse(11, 38, 13, 20);
  fill(220, 180, 130);
  ellipse(0, 16, 26, 32);

  stroke(130, 80, 45);
  strokeWeight(8);
  line(-18, 0, -26, 26);
  line(18, 0, 26, 26);

  noStroke();
  fill(130, 80, 45);
  ellipse(-21, -14, 15);
  ellipse(21, -14, 15);
  ellipse(0, -12, 40, 36);
  fill(230, 190, 150);
  ellipse(-21, -14, 8);
  ellipse(21, -14, 8);
  ellipse(0, -8, 28, 22);
  fill(30, 20, 15);
  ellipse(-6, -13, 5);
  ellipse(6, -13, 5);
  noFill();
  stroke(30, 20, 15);
  strokeWeight(1.5);
  arc(0, -6, 12, 8, 0, PI);

  // Hugging the stolen backpack
  if (hasPack) {
    noStroke();
    fill(230, 70, 60);
    rect(-20, 12, 40, 34, 8);
    fill(255, 200, 60);
    rect(-4, 26, 8, 6);
    fill(255, 230, 120);
    ellipse(-8, 12, 7);
    fill(120, 220, 255);
    ellipse(8, 11, 6);
  }
}

// ---------- Input ----------

function keyPressed() {
  let isAction = key === " " || keyCode === ENTER;

  if (state === "dialogue") {
    if (isAction) {
      advanceDialogue();
      return false;
    }
    return;
  }

  if (state === "win" || state === "lose") {
    if (isAction) {
      startGame();
      return false;
    }
    return;
  }

  if (keyCode === LEFT_ARROW) {
    changeLane(-1);
    return false;
  }
  if (keyCode === RIGHT_ARROW) {
    changeLane(1);
    return false;
  }
  if (keyCode === UP_ARROW) {
    jump();
    return false;
  }
  if (keyCode === DOWN_ARROW) {
    slide();
    return false;
  }
}

function mousePressed() {
  // Clicking also works for the dialogue and the end screens
  if (state === "dialogue") {
    advanceDialogue();
  } else if (state === "win" || state === "lose") {
    startGame();
  }
}