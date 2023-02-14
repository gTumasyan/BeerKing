const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 400);

const SCORE = document.querySelector("h1");
const REPEAT = document.querySelector("p");
const SPAN = document.querySelector("span");

let beerDrinkingSound = new Audio("./Sounds/Decline.wav");
let backgroundSound = new Audio("./Sounds/Back.mp3");

const playerSprites = {
  idle: {
    idleNow: true,
    maxFrame: 0,
    frameBuffer: 4,
    playerImage: new Image(),
    src: "./Images/idle.png",
  },
  runningRight: {
    maxFrame: 7,
    playerImage: new Image(),
    src: "./Images/./runRight.png",
  },
  runningLeft: {
    maxFrame: 7,
    playerImage: new Image(),
    src: "./Images/./runLeft.png",
  },
};

let playerX = 0;

let frame = 1;
let image = playerSprites.runningRight.playerImage;
image.src = playerSprites.runningRight.src;

let score = 0;
let elapsedFrames = 0;

function drawPlayer(playerX, frame, image) {
  let dX = 156;
  let dY = 0;
  let sWidth = 156;
  let sHeight = 116;
  let dWidth = 156;
  let dHeight = 116;
  ctx.drawImage(
    image,
    dX * frame,
    dY,
    sWidth,
    sHeight,
    playerX,
    CANVAS_HEIGHT - 100 - 30,
    dWidth,
    dHeight
  );
}

function drawBeer(beerX) {
  let beerImage = new Image();
  beerImage.src = "./Images/./beer.png";
  ctx.drawImage(
    beerImage,
    0,
    0,
    128,
    128,
    beerX,
    CANVAS_HEIGHT - 40 - 30,
    156,
    116
  );
}

function drawGround() {
  let groundImage = new Image();
  groundImage.src = "./Images/./ground.png";
  ctx.drawImage(
    groundImage,
    600,
    0,
    1024,
    2048,
    0,
    CANVAS_HEIGHT - 40,
    CANVAS_WIDTH,
    200
  );
}

// For changing sprites while standing
function idle() {
  if (playerSprites.idle.idleNow) {
    elapsedFrames++;

    image = playerSprites.idle.playerImage;
    image.src = playerSprites.idle.src;
    if (elapsedFrames % playerSprites.idle.frameBuffer === 0) {
      if (frame < playerSprites.runningRight.maxFrame) {
        frame++;
      } else {
        frame = 1;
      }
    }
  }
}

// Checking collisions with canvas from left anf right
function colisionWithCanvas() {
  if (playerX <= -40) {
    playerX = -40;
  }
  if (playerX >= CANVAS_WIDTH - 120) {
    playerX = CANVAS_WIDTH - 120;
  }
}

// Place for first mug and object for 2 others
let beerX = 200;
let beerMugs = [
  { playerX: beerX, exists: true },
  { playerX: beerX + 150, exists: true },
  { playerX: beerX + 300, exists: true },
];

// Drawing beers, checking collisions and deleting beers after collisions
function beer() {
  for (let i = 0; i < beerMugs.length; i++) {
    if (beerMugs[i].exists) {
      drawBeer(beerMugs[i].playerX);

      // check for collision beetwen player and beer mugs
      if (
        playerX < beerMugs[i].playerX + 100 &&
        playerX + 100 > beerMugs[i].playerX &&
        CANVAS_HEIGHT - 100 < CANVAS_HEIGHT - 100 + 100 &&
        CANVAS_HEIGHT - 100 + 100 > CANVAS_HEIGHT - 100
      ) {
        beerMugs[i].exists = false;
        score++;
        beerDrinkingSound.play();
      }
    }
  }
}

// Checking score and adding wining text
function checkingScore() {
  if (score === 3) {
    SCORE.innerHTML = "Finally!!! You are drunk, sir.";
    REPEAT.innerHTML = "Press Space to REPEAT";

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        location.reload();
      }
    });
  }
}

// Main animate function
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, CANVAS_WIDTH, canvas.height);
  idle();
  colisionWithCanvas();
  drawPlayer(playerX, frame, image);
  beer();
  drawGround();
  checkingScore();
}

animate();

// For running and changing sprites
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    playerSprites.idle.idleNow = false;

    image = playerSprites.runningRight.playerImage;
    image.src = playerSprites.runningRight.src;
    if (frame < playerSprites.runningRight.maxFrame) {
      frame++;
      playerX += 10;
    } else {
      frame = 1;
    }
  }
  if (e.key === "ArrowLeft") {
    playerSprites.idle.idleNow = false;

    image = playerSprites.runningLeft.playerImage;
    image.src = playerSprites.runningLeft.src;
    if (frame < playerSprites.runningRight.maxFrame) {
      frame++;
      playerX -= 10;
    } else {
      frame = 1;
    }
  }
});

// For starting idleing while standing
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") {
    playerSprites.idle.idleNow = true;
  }
  if (e.key === "ArrowLeft") {
    playerSprites.idle.idleNow = true;
  }
});

// To start game and backgroudn music
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    backgroundSound.play();
    SPAN.innerHTML = "&ensp;";
  }
});
