/**
 * Monkey Steal Monkey Move: Catch that thief!
 * Alycia Malonga
 *
 * A monkey stole a tourist's backpack full of jewelry! Chase him through the
 * jungle, grab the jewelry that falls out of the backpack, and catch up to him.
 *
 * Instructions:
 * - LEFT / RIGHT arrows: switch lanes
 * - UP arrow: jump (over logs and rocks)
 * - DOWN arrow: slide (under hanging branches)
 * - Collecting jewelry closes the gap. Hitting obstacles lets him get away!
 * - SPACE: advance the dialogue / restart
 */

"use strict";

// ----- Game state -----
let state = "dialogue"; // "dialogue", "play", "win", or "lose"
let score = 0;
let lives = 3;
let gap = 520; // distance between you and the monkey
let gameSpeed = 11;
let scrollZ = 0;
let startTime = 0;
let shake = 0;
let obstacleTimer = 0;
let dropTimer = 60;

// ----- Perspective (pseudo-3D) -----
const HORIZON_Y = 170; // where the road meets the sky
const GROUND_Y = 400; // where the player's feet are
const FOCAL = 200; // bigger = flatter perspective
const LANE_W = 150; // lane width at the player's position
const FAR_Z = 1400; // how far away things appear

// ----- The chase -----
const CATCH_GAP = 60; // gap this small = you caught him
const ESCAPE_GAP = 900; // gap this big = he escaped
const OBSTACLE_GAP = 520; // distance between rows of obstacles

const ALL_JEWELS = ["necklace", "bracelet", "earrings", "ring", "crown"];
const JEWEL_VALUE = { necklace: 20, bracelet: 15, earrings: 10, ring: 25, crown: 50 };
let collected = {};

// ----- Characters -----
// player.x is a decimal lane position: -1 (left), 0 (middle), 1 (right)
const player = { lane: 0, x: 0, h: 0, vh: 0, sliding: 0, hurtUntil: 0 };
const monkey = { x: 0, targetLane: 0, z: 520, nextSwitch: 60 };

// ----- Arrays of things -----
let things = []; // jewelry and obstacles
let particles = [];
let trees = [];
let canopy = [];

// ----- Dialogue -----
let dialogueIndex = 0;
let lineStartFrame = 0;
let monkeyDX = 800; // monkey's x position in the dialogue scene
const dialogue = [
  {
    speaker: "Tourist",
    text: "Ahhh, paradise! Sun, sand, ocean... and my whole jewelry collection safe in my backpack.",
    mood: "happy", pack: true, monkeyX: 800, monkeyPack: false,
  },
  {
    speaker: "Tourist",
    text: "Nothing could possibly go wrong on this vacation!",
    mood: "happy", pack: true, monkeyX: 560, monkeyPack: false,
  },
  {
    speaker: "Monkey",
    text: "Ooo ooo! Ahh ahh!",
    mood: "shocked", pack: false, monkeyX: 430, monkeyPack: true,
  },
  {
    speaker: "Tourist",
    text: "HEY! That's my backpack! My necklace, my bracelets, my earrings, my crown... it's ALL in there!",
    mood: "shocked", pack: false, monkeyX: 430, monkeyPack: true,
  },
  {
    speaker: "Tourist",
    text: "Come back here, you thief! I'm getting my jewelry back!",
    mood: "angry", pack: false, monkeyX: 820, monkeyPack: true,
  },
  {
    speaker: "Tip",
    text: "Run after him! LEFT and RIGHT switch lanes, UP jumps, DOWN slides. Grab the jewelry he drops to catch up!",
    mood: "angry", pack: false, monkeyX: 820, monkeyPack: true,
  },
];

function setup() {
  createCanvas(640, 480);
  resetCollected();

  // Jungle trees on both sides of the path
  for (let i = 0; i < 16; i++) {
    trees.push({
      z: (i * (FAR_Z + 100)) / 16,
      side: i % 2 === 0 ? -1 : 1,
      off: random(2.4, 3.6),
    });
  }

  // Leafy canopy along the top of the screen
  for (let i = 0; i < 12; i++) {
    canopy.push({
      x: i * 60 + random(-10, 10),
      y: random(-20, 15),
      size: random(90, 140),
      phase: random(TWO_PI),
    });
  }
}

// ---------- Perspective helpers ----------

function scaleAt(z) {
  return FOCAL / (FOCAL + z); // 1 at the player, smaller far away
}

function groundY(s) {
  return HORIZON_Y + (GROUND_Y - HORIZON_Y) * s;
}

function laneScreenX(lane, s) {
  return width / 2 + lane * LANE_W * s;
}

// ---------- Main loop ----------

function draw() {
  if (state === "dialogue") {
    drawDialogue();
    return;
  }

  push();
  if (shake > 0.5) {
    translate(random(-shake, shake), random(-shake, shake));
  }
  shake *= 0.88;

  drawSky();
  drawGround();
  drawTrees();
  drawFog();
  if (state === "play") {
    updateGame();
  }
  drawThings();
  drawPlayer();
  drawParticles();
  pop();

  drawSpeedLines();
  drawCanopyFrame();
  drawVignette();

  if (state === "play") {
    drawHUD();
  } else {
    drawEndScreen();
  }
}

// ---------- Game logic ----------

function resetCollected() {
  for (let type of ALL_JEWELS) {
    collected[type] = 0;
  }
}

function startGame() {
  state = "play";
  score = 0;
  lives = 3;
  gap = 520;
  gameSpeed = 11;
  things = [];
  particles = [];
  obstacleTimer = 0;
  dropTimer = 60;
  startTime = millis();
  shake = 0;
  resetCollected();
  player.lane = 0;
  player.x = 0;
  player.h = 0;
  player.vh = 0;
  player.sliding = 0;
  player.hurtUntil = 0;
  monkey.x = 0;
  monkey.targetLane = 0;
}

function updateGame() {
  // The game slowly speeds up over 90 seconds
  gameSpeed = map(millis() - startTime, 0, 90000, 11, 18, true);
  scrollZ += gameSpeed;

  // The monkey slowly runs farther away
  gap += 0.2;
  monkey.z = gap;

  updateMonkey();
  updatePlayer();

  for (let tree of trees) {
    tree.z -= gameSpeed;
    if (tree.z < -100) {
      tree.z += FAR_Z + 100;
      tree.off = random(2.4, 3.6);
    }
  }

  // Obstacles: a new row each time we've travelled OBSTACLE_GAP
  obstacleTimer += gameSpeed;
  if (obstacleTimer > OBSTACLE_GAP) {
    obstacleTimer = 0;
    spawnObstacles();
  }

  // The monkey drops jewelry from his backpack every second or so
  dropTimer--;
  if (dropTimer <= 0) {
    dropJewelry();
    dropTimer = random(35, 65);
  }

  for (let t of things) {
    t.z -= gameSpeed;

    if (t.kind === "jewel") {
      // Jewelry falls out of the backpack and bounces
      t.vh -= 0.9;
      t.h += t.vh;
      if (t.h <= 0) {
        t.h = 0;
        t.vh = abs(t.vh) > 4 ? -t.vh * 0.4 : 0;
      }
    }

    if (!t.done && t.z < 30 && t.z > -40) {
      checkCollision(t);
    }
  }
  things = things.filter((t) => !t.done && t.z > -80);

  if (gap <= CATCH_GAP) {
    state = "win";
  } else if (lives <= 0 || gap >= ESCAPE_GAP) {
    state = "lose";
  }
}

function updateMonkey() {
  // The monkey swings from vine to vine, changing lanes
  monkey.nextSwitch--;
  if (monkey.nextSwitch <= 0) {
    monkey.targetLane = floor(random(-1, 2));
    monkey.nextSwitch = random(70, 140);
  }
  monkey.x = lerp(monkey.x, monkey.targetLane, 0.05);
}

function updatePlayer() {
  player.x = lerp(player.x, player.lane, 0.18);

  // Jumping physics
  if (player.h > 0 || player.vh > 0) {
    player.vh -= 0.7;
    player.h += player.vh;
    if (player.h <= 0) {
      player.h = 0;
      player.vh = 0;
    }
  }

  if (player.sliding > 0) {
    player.sliding--;
  }
}

function addThing(kind, type, lane, z) {
  let t = { kind: kind, type: type, lane: lane, z: z, h: 0, vh: 0, done: false };
  things.push(t);
  return t;
}

function spawnObstacles() {
  // Sometimes a hanging branch blocks the whole path (you must slide)
  if (random() < 0.2) {
    addThing("obstacle", "branch", 0, FAR_Z);
    return;
  }
  // Otherwise 1 or 2 logs/rocks (you must jump or dodge)
  let lanes = shuffle([-1, 0, 1]);
  let count = random() < 0.4 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    addThing("obstacle", random(["log", "rock"]), lanes[i], FAR_Z);
  }
}

function dropJewelry() {
  let type = random() < 0.1 ? "crown" : random(["necklace", "bracelet", "earrings", "ring"]);
  let lane = constrain(round(monkey.x), -1, 1);
  let t = addThing("jewel", type, lane, monkey.z);
  t.h = 90; // starts up at the monkey's backpack
}

function checkCollision(t) {
  if (t.kind === "jewel") {
    if (abs(player.x - t.lane) < 0.6 && player.h < 70) {
      collectJewel(t);
      t.done = true;
    }
    return;
  }

  let sameLane = t.type === "branch" || abs(player.x - t.lane) < 0.55;
  if (sameLane) {
    let hit = t.type === "branch" ? player.sliding === 0 : player.h < 40;
    if (hit) {
      hurtPlayer();
      t.done = true;
    }
  }
}

function collectJewel(t) {
  let points = JEWEL_VALUE[t.type];
  collected[t.type]++;
  score += points;
  gap = max(CATCH_GAP, gap - points * 1.2); // closer to the monkey!
  burst(laneScreenX(t.lane, 1), GROUND_Y - 40, [255, 225, 90], 14);
  addText("+" + points, laneScreenX(t.lane, 1), GROUND_Y - 80);
}

function hurtPlayer() {
  if (millis() < player.hurtUntil) {
    return;
  }
  lives--;
  gap = min(ESCAPE_GAP, gap + 120); // the monkey gets farther away
  shake = 16;
  player.hurtUntil = millis() + 1200;
  burst(laneScreenX(player.x, 1), GROUND_Y - 40, [160, 120, 80], 16);
  addText("Ouch!", laneScreenX(player.x, 1), GROUND_Y - 100);
}

// ---------- Particles ----------

function burst(x, y, col, amount) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: x, y: y,
      vx: random(-4, 4), vy: random(-5, 2),
      life: 40, maxLife: 40, size: random(4, 9),
      col: col, text: null,
    });
  }
}

function addText(message, x, y) {
  particles.push({
    x: x, y: y, vx: 0, vy: -1.2,
    life: 50, maxLife: 50, size: 22,
    col: [255, 255, 255], text: message,
  });
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    let alpha = map(p.life, 0, p.maxLife, 0, 255);
    if (p.text !== null) {
      fill(255, 240, 150, alpha);
      textAlign(CENTER, BASELINE);
      textSize(p.size);
      text(p.text, p.x, p.y);
    } else {
      p.vy += 0.2;
      fill(p.col[0], p.col[1], p.col[2], alpha);
      ellipse(p.x, p.y, p.size);
    }
  }
  particles = particles.filter((p) => p.life > 0);
}

// ---------- Background ----------

function drawSky() {
  let top = color(25, 100, 90);
  let bottom = color(190, 240, 205);
  for (let y = 0; y <= HORIZON_Y + 1; y++) {
    stroke(lerpColor(top, bottom, y / HORIZON_Y));
    line(0, y, width, y);
  }

  noStroke();
  // Sun glow and light rays
  fill(255, 250, 190, 50);
  ellipse(width * 0.62, 70, 160);
  for (let i = 0; i < 3; i++) {
    let x0 = width * (0.15 + i * 0.3) + sin(frameCount * 0.01 + i) * 20;
    fill(255, 250, 190, 14 + sin(frameCount * 0.02 + i * 2) * 8);
    triangle(x0, -10, x0 + 70, -10, x0 + 220, HORIZON_Y + 60);
  }

  // Two layers of distant hills (they shift a little as you change lanes)
  drawHills(color(70, 150, 120, 220), HORIZON_Y - 35, -player.x * 6, 0.02);
  drawHills(color(40, 115, 85), HORIZON_Y - 15, -player.x * 12, 0.035);
}

function drawHills(col, baseY, shift, freq) {
  noStroke();
  fill(col);
  beginShape();
  vertex(0, HORIZON_Y + 2);
  for (let x = 0; x <= width; x += 10) {
    vertex(x, baseY - sin((x - shift) * freq) * 18 - sin((x - shift) * freq * 2.3) * 8);
  }
  vertex(width, HORIZON_Y + 2);
  endShape(CLOSE);
}

function drawGround() {
  // Jungle floor
  for (let y = HORIZON_Y; y <= height; y++) {
    stroke(lerpColor(color(90, 170, 100), color(35, 95, 55), (y - HORIZON_Y) / (height - HORIZON_Y)));
    line(0, y, width, y);
  }

  // Dirt path (a triangle fanning out from the vanishing point)
  let sBottom = (height - HORIZON_Y) / (GROUND_Y - HORIZON_Y);
  let half = 1.7 * LANE_W;
  noStroke();
  fill(196, 160, 110);
  quad(
    width / 2, HORIZON_Y,
    width / 2, HORIZON_Y,
    width / 2 + half * sBottom, height,
    width / 2 - half * sBottom, height
  );

  // Moving stripes and lane dashes give the feeling of running
  for (let zz = -(scrollZ % 400) - 400; zz < FAR_Z; zz += 400) {
    let z1 = max(zz, -100);
    let z2 = max(zz + 200, -100);
    let s1 = scaleAt(z1);
    let s2 = scaleAt(z2);
    noStroke();
    fill(0, 0, 0, 20);
    quad(
      width / 2 - half * s1, groundY(s1), width / 2 + half * s1, groundY(s1),
      width / 2 + half * s2, groundY(s2), width / 2 - half * s2, groundY(s2)
    );

    let d2 = max(zz + 100, -100);
    let sd = scaleAt(d2);
    stroke(255, 255, 255, 70);
    strokeWeight(max(1, 3 * s2));
    for (let side = -1; side <= 1; side += 2) {
      line(
        width / 2 + side * 0.5 * LANE_W * s1, groundY(s1),
        width / 2 + side * 0.5 * LANE_W * sd, groundY(sd)
      );
    }
  }

  // Path edges
  stroke(120, 90, 50);
  strokeWeight(3);
  line(width / 2, HORIZON_Y, width / 2 - half * sBottom, height);
  line(width / 2, HORIZON_Y, width / 2 + half * sBottom, height);
}

function drawTrees() {
  trees.sort((a, b) => b.z - a.z); // far trees first
  for (let t of trees) {
    if (t.z < -100) {
      continue;
    }
    let s = scaleAt(t.z);
    let sx = laneScreenX(t.side * t.off, s);
    let sy = groundY(s);
    drawingContext.globalAlpha = constrain(map(t.z, FAR_Z, FAR_Z - 300, 0, 1), 0, 1);

    noStroke();
    fill(90, 60, 40);
    rect(sx - 18 * s, sy - 300 * s, 36 * s, 300 * s);
    fill(20, 100, 60);
    ellipse(sx, sy - 310 * s, 170 * s, 110 * s);
    fill(30, 130, 75);
    ellipse(sx - 40 * s, sy - 290 * s, 110 * s, 80 * s);
    ellipse(sx + 45 * s, sy - 295 * s, 110 * s, 80 * s);

    stroke(50, 130, 60);
    strokeWeight(max(1, 4 * s));
    line(sx + 20 * s, sy - 300 * s, sx + 20 * s + sin(frameCount * 0.04 + t.z * 0.01) * 8 * s, sy - 180 * s);
    drawingContext.globalAlpha = 1;
  }
}

function drawFog() {
  // A soft mist where the path disappears into the distance
  for (let y = HORIZON_Y - 25; y < HORIZON_Y + 60; y++) {
    stroke(190, 240, 205, map(y, HORIZON_Y - 25, HORIZON_Y + 60, 220, 0));
    line(0, y, width, y);
  }
}

function drawSpeedLines() {
  if (state !== "play" || gameSpeed < 13) {
    return;
  }
  stroke(255, 255, 255, 28);
  strokeWeight(2);
  for (let i = 0; i < 10; i++) {
    let angle = random(TWO_PI);
    let r1 = random(200, 300);
    let r2 = r1 + random(40, 90);
    line(
      width / 2 + cos(angle) * r1, HORIZON_Y + 40 + sin(angle) * r1,
      width / 2 + cos(angle) * r2, HORIZON_Y + 40 + sin(angle) * r2
    );
  }
}

function drawCanopyFrame() {
  noStroke();
  for (let i = 0; i < canopy.length; i++) {
    let c = canopy[i];
    let sway = sin(frameCount * 0.02 + c.phase) * 4;
    noStroke();
    fill(15, 75, 50, 235);
    ellipse(c.x + sway, c.y, c.size, c.size * 0.6);
    fill(30, 115, 70, 200);
    ellipse(c.x + sway + 15, c.y + 12, c.size * 0.7, c.size * 0.4);
    if (i % 3 === 0) {
      stroke(40, 120, 55);
      strokeWeight(3);
      line(c.x + sway, c.y + 20, c.x + sway + sin(frameCount * 0.03 + c.phase) * 10, c.y + 80);
    }
  }
}

function drawVignette() {
  let g = drawingContext.createRadialGradient(
    width / 2, height / 2, height * 0.35,
    width / 2, height / 2, height * 0.8
  );
  g.addColorStop(0, "rgba(0, 0, 0, 0)");
  g.addColorStop(1, "rgba(0, 20, 15, 0.5)");
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

// ---------- Things on the path ----------

function drawThings() {
  // Far things first, and the monkey sits in the right place among them
  things.sort((a, b) => b.z - a.z);
  let monkeyDrawn = false;
  for (let t of things) {
    if (!monkeyDrawn && t.z <= monkey.z) {
      drawMonkeyAhead();
      monkeyDrawn = true;
    }
    drawThing(t);
  }
  if (!monkeyDrawn) {
    drawMonkeyAhead();
  }
}

function drawThing(t) {
  if (t.z < -100) {
    return;
  }
  let s = scaleAt(t.z);
  let sx = laneScreenX(t.lane, s);
  let sy = groundY(s);
  drawingContext.globalAlpha = constrain(map(t.z, FAR_Z, FAR_Z - 300, 0, 1), 0, 1);

  if (t.kind === "jewel") {
    noStroke();
    fill(0, 0, 0, 50);
    ellipse(sx, sy, 34 * s, 10 * s);
    let y = sy - (t.h + 14) * s;
    fill(255, 230, 120, 60 + sin(frameCount * 0.15 + t.z * 0.01) * 30);
    ellipse(sx, y, 56 * s);
    drawJewelry(t.type, sx, y, 1.3 * s);
  } else if (t.type === "log") {
    drawLog(sx, sy, s);
  } else if (t.type === "rock") {
    drawRock(sx, sy, s);
  } else if (t.type === "branch") {
    drawBranch(width / 2, sy, s);
  }

  drawingContext.globalAlpha = 1;
}

function drawLog(x, y, s) {
  noStroke();
  fill(0, 0, 0, 50);
  ellipse(x, y, 110 * s, 16 * s);
  fill(110, 70, 40);
  rect(x - 55 * s, y - 36 * s, 110 * s, 36 * s, 14 * s);
  fill(85, 52, 30);
  rect(x - 45 * s, y - 26 * s, 90 * s, 4 * s);
  fill(200, 160, 110);
  ellipse(x + 55 * s, y - 18 * s, 18 * s, 34 * s);
  fill(150, 110, 70);
  ellipse(x + 55 * s, y - 18 * s, 8 * s, 18 * s);
}

function drawRock(x, y, s) {
  noStroke();
  fill(0, 0, 0, 50);
  ellipse(x, y, 100 * s, 16 * s);
  fill(115, 120, 130);
  ellipse(x, y - 26 * s, 90 * s, 60 * s);
  fill(150, 155, 165);
  ellipse(x - 14 * s, y - 36 * s, 36 * s, 20 * s);
}

function drawBranch(x, y, s) {
  // A thick branch with hanging vines stretches across the whole path
  let top = y - 100 * s;
  noFill();
  stroke(100, 65, 40);
  strokeWeight(16 * s);
  bezier(x - 260 * s, top - 10 * s, x - 120 * s, top + 14 * s, x + 120 * s, top + 14 * s, x + 260 * s, top - 10 * s);
  for (let i = -4; i <= 4; i++) {
    let vx = x + i * 55 * s + sin(frameCount * 0.05 + i) * 6 * s;
    let len = (40 + (abs(i) % 3) * 14) * s;
    stroke(50, 130, 60);
    strokeWeight(max(1, 4 * s));
    line(x + i * 55 * s, top + 8 * s, vx, top + 8 * s + len);
    noStroke();
    fill(60, 170, 80);
    ellipse(vx, top + 8 * s + len, 16 * s, 24 * s);
  }
}

// ---------- Jewelry ----------

function drawJewelry(type, x, y, sc) {
  push();
  translate(x, y);
  scale(sc);
  if (type === "necklace") {
    noFill();
    stroke(255, 215, 0);
    strokeWeight(3);
    arc(0, -4, 34, 34, PI * 0.1, PI * 0.9);
    noStroke();
    fill(220, 40, 80);
    ellipse(0, 16, 10, 13);
  } else if (type === "bracelet") {
    noFill();
    stroke(255, 215, 0);
    strokeWeight(5);
    ellipse(0, 0, 34, 20);
    noStroke();
    fill(220, 40, 80);
    ellipse(-15, 0, 6);
    fill(60, 160, 255);
    ellipse(0, 10, 6);
    fill(80, 220, 120);
    ellipse(15, 0, 6);
  } else if (type === "earrings") {
    for (let dx = -9; dx <= 9; dx += 18) {
      stroke(255, 215, 0);
      strokeWeight(2);
      line(dx, -14, dx, -6);
      noStroke();
      fill(80, 200, 255);
      ellipse(dx, 2, 9, 13);
    }
  } else if (type === "ring") {
    noFill();
    stroke(255, 215, 0);
    strokeWeight(4);
    ellipse(0, 4, 22, 22);
    noStroke();
    fill(200, 240, 255);
    quad(0, -18, 7, -10, 0, -2, -7, -10);
  } else if (type === "crown") {
    noStroke();
    fill(255, 210, 40);
    beginShape();
    vertex(-18, 10);
    vertex(-18, -6);
    vertex(-9, 2);
    vertex(0, -12);
    vertex(9, 2);
    vertex(18, -6);
    vertex(18, 10);
    endShape(CLOSE);
    fill(200, 150, 20);
    rect(-18, 8, 36, 6);
    fill(220, 40, 80);
    ellipse(0, 3, 6);
    fill(60, 160, 255);
    ellipse(-10, 5, 5);
    ellipse(10, 5, 5);
  }
  pop();
}

// ---------- The monkey (ahead of you) ----------

function drawMonkeyAhead() {
  let s = scaleAt(monkey.z);
  let mx = laneScreenX(monkey.x, s);
  let hover = 90 + abs(monkey.targetLane - monkey.x) * 40; // he swings higher mid-swing
  let my = groundY(s) - hover * s;
  let sc = s * 1.6;
  let lean = constrain((monkey.targetLane - monkey.x) * 0.3, -0.4, 0.4);

  // The vine he's swinging on
  let ax = mx + (monkey.targetLane - monkey.x) * 70 * s;
  stroke(70, 130, 50);
  strokeWeight(max(2, 6 * sc));
  noFill();
  bezier(ax, -20, ax, my * 0.4, mx - lean * 60 * sc, my * 0.8, mx, my - 44 * sc);

  push();
  translate(mx, my);
  scale(sc);
  rotate(lean);
  drawMonkeyBack();
  pop();

  // Sparkles falling from the backpack
  if (state === "play" && random() < 0.15) {
    particles.push({
      x: mx + random(-8, 8) * sc, y: my + random(0, 20) * sc,
      vx: 0, vy: 1, life: 25, maxLife: 25, size: random(2, 4),
      col: [255, 230, 120], text: null,
    });
  }
}

function drawMonkeyBack() {
  // Tail
  noFill();
  stroke(120, 75, 40);
  strokeWeight(7);
  bezier(0, 26, 14, 50, 40, 45, 36, 22);

  // Arms up to the vine
  line(-14, -8, -4, -44);
  line(14, -8, 4, -44);

  // Body and legs
  noStroke();
  fill(130, 80, 45);
  ellipse(0, 10, 44, 54);
  ellipse(-10, 38, 13, 20);
  ellipse(10, 38, 13, 20);

  // The stolen backpack, with jewelry peeking out
  fill(230, 70, 60);
  rect(-17, -4, 34, 38, 8);
  fill(200, 50, 45);
  rect(-17, -4, 34, 12, 8);
  fill(255, 200, 60);
  rect(-4, 14, 8, 6);
  fill(255, 230, 120);
  ellipse(-6, -6, 7);
  fill(120, 220, 255);
  ellipse(6, -5, 6);

  // Back of the head
  fill(130, 80, 45);
  ellipse(-20, -22, 15);
  ellipse(20, -22, 15);
  ellipse(0, -22, 38, 34);
  fill(100, 60, 35);
  ellipse(0, -24, 24, 18);

  // Hands
  fill(100, 60, 35);
  ellipse(0, -44, 10);
}

// ---------- The tourist (you) ----------

function changeLane(direction) {
  let newLane = constrain(player.lane + direction, -1, 1);
  if (newLane !== player.lane) {
    player.lane = newLane;
    burst(laneScreenX(player.x, 1), GROUND_Y, [200, 170, 110], 6);
  }
}

function jump() {
  if (player.h === 0) {
    player.vh = 11;
    burst(laneScreenX(player.x, 1), GROUND_Y, [200, 170, 110], 6);
  }
}

function slide() {
  player.sliding = 35;
  if (player.h > 0) {
    player.vh = -14; // slam back down
  }
}

function drawPlayer() {
  let sx = laneScreenX(player.x, 1);

  // Shadow stays on the ground even when jumping
  noStroke();
  fill(0, 0, 0, 50);
  ellipse(sx, GROUND_Y + 2, 60 - player.h * 0.3, 16);

  // Flicker after being hit
  if (millis() < player.hurtUntil && frameCount % 6 < 3) {
    return;
  }

  let tilt = constrain((player.lane - player.x) * 0.5, -0.4, 0.4);
  push();
  translate(sx, GROUND_Y - player.h);
  rotate(tilt);
  if (player.sliding > 0) {
    scale(1.15, 0.55); // squash down to slide under branches
  }
  drawTouristBack();
  pop();
}

function drawTouristBack() {
  let phase = frameCount * 0.3;
  let liftL = player.h > 0 ? 8 : max(0, sin(phase)) * 14;
  let liftR = player.h > 0 ? 8 : max(0, -sin(phase)) * 14;
  noStroke();

  // Legs and shoes (running animation)
  fill(235, 190, 150);
  rect(-20, -50, 14, 50 - liftL, 4);
  rect(6, -50, 14, 50 - liftR, 4);
  fill(245);
  ellipse(-13, -liftL, 18, 9);
  ellipse(13, -liftR, 18, 9);

  // Shorts and Hawaiian shirt
  fill(50, 120, 200);
  rect(-24, -72, 48, 28, 6);
  fill(255, 150, 80);
  rect(-26, -122, 52, 56, 10);
  fill(255, 255, 255, 200);
  ellipse(-10, -105, 10);
  ellipse(8, -95, 8);
  ellipse(-2, -78, 9);
  fill(240, 70, 120);
  ellipse(10, -108, 9);
  ellipse(-8, -90, 8);

  // Swinging arms
  push();
  translate(-27, -116);
  rotate(sin(phase) * 0.5);
  fill(255, 150, 80);
  rect(-6, 0, 12, 26, 5);
  fill(235, 190, 150);
  rect(-5, 24, 10, 18, 5);
  pop();
  push();
  translate(27, -116);
  rotate(-sin(phase) * 0.5);
  fill(255, 150, 80);
  rect(-6, 0, 12, 26, 5);
  fill(235, 190, 150);
  rect(-5, 24, 10, 18, 5);
  pop();

  // Back of the head and sun hat
  fill(110, 70, 40);
  ellipse(0, -136, 34, 32);
  fill(240, 210, 110);
  ellipse(0, -144, 70, 16);
  ellipse(0, -152, 38, 26);
  fill(220, 60, 60);
  rect(-19, -150, 38, 6);
}

// ---------- HUD & end screens ----------

function shadowText(message, x, y) {
  noStroke();
  fill(0, 0, 0, 130);
  text(message, x + 2, y + 2);
  fill(255);
  text(message, x, y);
}

function drawHeart(x, y, full) {
  noStroke();
  fill(full ? color(255, 80, 100) : color(255, 255, 255, 60));
  ellipse(x - 5, y - 3, 11, 11);
  ellipse(x + 5, y - 3, 11, 11);
  triangle(x - 10, y - 1, x + 10, y - 1, x, y + 11);
}

function drawHUD() {
  textAlign(LEFT, BASELINE);
  textSize(20);
  shadowText("Score " + score, 16, 56);

  for (let i = 0; i < 3; i++) {
    drawHeart(width - 28 - i * 30, 56, i < lives);
  }

  // Catch meter: the fuller it is, the closer you are to the monkey
  let progress = map(gap, ESCAPE_GAP, CATCH_GAP, 0, 1, true);
  noStroke();
  fill(0, 0, 0, 120);
  rect(170, 44, 300, 14, 7);
  fill(255, 210, 60);
  rect(170, 44, 300 * progress, 14, 7);
  textAlign(CENTER, BASELINE);
  textSize(13);
  shadowText("Catch the monkey!", width / 2, 76);

  // Jewelry collected
  noStroke();
  fill(0, 0, 0, 110);
  rect(10, height - 52, 330, 44, 10);
  for (let i = 0; i < ALL_JEWELS.length; i++) {
    let type = ALL_JEWELS[i];
    let x = 38 + i * 64;
    drawJewelry(type, x, height - 30, 0.6);
    textAlign(LEFT, BASELINE);
    textSize(14);
    shadowText("x" + collected[type], x + 17, height - 25);
  }
}

function drawEndScreen() {
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  textAlign(CENTER, BASELINE);
  textSize(42);
  if (state === "win") {
    shadowText("Got him!", width / 2, 120);
    textSize(18);
    shadowText("You caught the monkey and got your backpack back!", width / 2, 155);
  } else {
    shadowText("He got away...", width / 2, 120);
    textSize(18);
    shadowText(
      lives <= 0 ? "You ran out of lives!" : "The monkey vanished into the jungle.",
      width / 2, 155
    );
  }

  textSize(22);
  shadowText("Score: " + score, width / 2, 200);
  textSize(16);
  shadowText("Jewelry recovered:", width / 2, 240);
  for (let i = 0; i < ALL_JEWELS.length; i++) {
    let type = ALL_JEWELS[i];
    let x = width / 2 - 160 + i * 80;
    drawJewelry(type, x, 285, 1.1);
    textAlign(CENTER, BASELINE);
    textSize(16);
    shadowText("x" + collected[type], x, 325);
  }

  textSize(18 + sin(frameCount * 0.1) * 2);
  shadowText("Press SPACE to chase him again", width / 2, 400);
}

// ---------- Dialogue scene ----------

function drawDialogue() {
  let line = dialogue[dialogueIndex];
  drawBeachScene();

  // Tourist
  push();
  translate(170, 300);
  scale(1.3);
  drawTouristFront(line.mood, line.pack);
  pop();

  // Monkey slides in and out
  monkeyDX = lerp(monkeyDX, line.monkeyX, 0.08);
  if (monkeyDX < 720) {
    push();
    translate(monkeyDX, 340);
    scale(1.2);
    drawMonkeyFront(line.monkeyPack);
    pop();
  }

  // Dialogue box
  noStroke();
  fill(255, 255, 255, 235);
  rect(30, height - 125, width - 60, 105, 14);
  let tagColor = color(60, 160, 100);
  if (line.speaker === "Tourist") {
    tagColor = color(255, 150, 80);
  } else if (line.speaker === "Monkey") {
    tagColor = color(130, 80, 45);
  }
  fill(tagColor);
  rect(45, height - 142, 110, 30, 8);
  fill(255);
  textAlign(CENTER, BASELINE);
  textSize(16);
  text(line.speaker, 100, height - 121);

  // Typewriter effect: show a few more letters each frame
  let shown = floor((frameCount - lineStartFrame) * 0.6);
  fill(40);
  textAlign(LEFT, TOP);
  textSize(18);
  text(line.text.substring(0, shown), 48, height - 98, width - 96, 70);

  textAlign(RIGHT, BASELINE);
  textSize(13);
  fill(120);
  text("Press SPACE", width - 44, height - 30);
}

function advanceDialogue() {
  let line = dialogue[dialogueIndex];
  let fullyShown = (frameCount - lineStartFrame) * 0.6 >= line.text.length;
  if (!fullyShown) {
    lineStartFrame = frameCount - 10000; // skip the typing animation
  } else {
    dialogueIndex++;
    if (dialogueIndex >= dialogue.length) {
      dialogueIndex = dialogue.length - 1;
      startGame();
    } else {
      lineStartFrame = frameCount;
    }
  }
}

function drawBeachScene() {
  let top = color(110, 200, 255);
  let bottom = color(255, 225, 170);
  for (let y = 0; y < 260; y++) {
    stroke(lerpColor(top, bottom, y / 260));
    line(0, y, width, y);
  }
  noStroke();
  fill(255, 240, 170, 60);
  ellipse(450, 110, 150);
  fill(255, 245, 190);
  ellipse(450, 110, 80);

  fill(40, 170, 200);
  rect(0, 250, width, 80);
  fill(255, 255, 255, 120);
  for (let x = 0; x < width; x += 40) {
    ellipse(x + sin(frameCount * 0.03 + x) * 6, 290, 28, 4);
  }
  fill(245, 215, 150);
  rect(0, 320, width, height - 320);

  // Palm tree
  let sway = sin(frameCount * 0.02) * 6;
  stroke(130, 85, 45);
  strokeWeight(14);
  line(590, 400, 575 + sway, 170);
  noStroke();
  fill(40, 170, 80);
  push();
  translate(575 + sway, 170);
  for (let i = 0; i < 6; i++) {
    push();
    rotate(map(i, 0, 5, -PI * 0.95, -PI * 0.05));
    ellipse(45, 0, 90, 18);
    pop();
  }
  pop();
}

function drawTouristFront(mood, hasPack) {
  noStroke();

  // Backpack (behind the shoulders)
  if (hasPack) {
    fill(230, 70, 60);
    rect(-34, -48, 68, 86, 12);
    fill(200, 50, 45);
    rect(-34, -48, 68, 24, 12);
  }

  // Legs, shoes, shorts, shirt
  fill(235, 190, 150);
  rect(-18, 40, 13, 48, 4);
  rect(5, 40, 13, 48, 4);
  fill(245);
  ellipse(-12, 90, 20, 9);
  ellipse(12, 90, 20, 9);
  fill(50, 120, 200);
  rect(-24, 22, 48, 26, 6);
  fill(255, 150, 80);
  rect(-26, -40, 52, 66, 10);
  fill(255, 255, 255, 200);
  ellipse(-12, -22, 10);
  ellipse(8, -8, 9);
  fill(240, 70, 120);
  ellipse(10, -26, 9);
  ellipse(-8, -4, 8);

  // Arms go up when surprised or angry
  stroke(235, 190, 150);
  strokeWeight(11);
  if (mood === "shocked" || mood === "angry") {
    line(-26, -30, -48, -62);
    line(26, -30, 48, -62);
  } else {
    line(-26, -30, -34, 10);
    line(26, -30, 34, 10);
  }

  // Head and sun hat
  noStroke();
  fill(235, 190, 150);
  ellipse(0, -62, 46, 46);
  fill(240, 210, 110);
  ellipse(0, -76, 82, 18);
  ellipse(0, -86, 44, 30);
  fill(220, 60, 60);
  rect(-22, -82, 44, 6);

  // Face
  if (mood === "happy") {
    fill(20);
    rect(-17, -68, 15, 9, 3);
    rect(2, -68, 15, 9, 3);
    noFill();
    stroke(120, 50, 40);
    strokeWeight(2);
    arc(0, -56, 18, 12, 0, PI);
  } else if (mood === "shocked") {
    fill(255);
    ellipse(-8, -64, 12);
    ellipse(8, -64, 12);
    fill(0);
    ellipse(-8, -64, 4);
    ellipse(8, -64, 4);
    fill(120, 40, 40);
    ellipse(0, -48, 10, 14);
  } else {
    fill(0);
    ellipse(-8, -62, 5);
    ellipse(8, -62, 5);
    stroke(60, 30, 20);
    strokeWeight(3);
    line(-14, -72, -3, -66);
    line(14, -72, 3, -66);
    noFill();
    strokeWeight(2);
    arc(0, -46, 16, 10, PI, TWO_PI);
  }
}

function drawMonkeyFront(hasPack) {
  noFill();
  stroke(120, 75, 40);
  strokeWeight(7);
  bezier(14, 28, 46, 46, 52, 6, 34, 0);

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