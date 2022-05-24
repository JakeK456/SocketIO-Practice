var socket = io();

const connectButton = document.getElementById("connect-button");
const disconnectButton = document.getElementById("disconnect-button");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const gameDiv = document.getElementById("game-container");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = gameDiv.clientWidth;
canvas.height = gameDiv.clientHeight;

const SPRITE_WIDTH = 256;
const SPRITE_HEIGHT = 256;
const NUM_SPRITE_FRAMES = 8;
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const staggerFrames = 15;

var keyState = {};

const bodyPlayerImage = new Image();
bodyPlayerImage.src = "../images/256px/8frames/body.png";

const bodyLPlayerImage = new Image();
bodyLPlayerImage.src = "../images/256px/8frames/body_l.png";

const clothesPlayerImage = new Image();
clothesPlayerImage.src = "../images/256px/8frames/clothes_1.png";

const clothesLPlayerImage = new Image();
clothesLPlayerImage.src = "../images/256px/8frames/clothes_1_l.png";

const headPlayerImage = new Image();
headPlayerImage.src = "../images/256px/8frames/head.png";

const headLPlayerImage = new Image();
headLPlayerImage.src = "../images/256px/8frames/head_l.png";

const hairPlayerImage = new Image();
hairPlayerImage.src = "../images/256px/8frames/hair_1.png";

const hairLPlayerImage = new Image();
hairLPlayerImage.src = "../images/256px/8frames/hair_1_l.png";

const eyesPlayerImage = new Image();
eyesPlayerImage.src = "../images/256px/8frames/eyes_1.png";

const eyesLPlayerImage = new Image();
eyesLPlayerImage.src = "../images/256px/8frames/eyes_1_l.png";

const mouthPlayerImage = new Image();
mouthPlayerImage.src = "../images/256px/8frames/mouth.png";

const mouthLPlayerImage = new Image();
mouthLPlayerImage.src = "../images/256px/8frames/mouth_l.png";

const weaponPlayerImage = new Image();
weaponPlayerImage.src = "../images/256px/8frames/weapon_1.png";

const weaponLPlayerImage = new Image();
weaponLPlayerImage.src = "../images/256px/8frames/weapon_1_l.png";

let facingRight = true;

let imgArr = [
  bodyPlayerImage,
  clothesPlayerImage,
  headPlayerImage,
  hairPlayerImage,
  eyesPlayerImage,
  mouthPlayerImage,
  weaponPlayerImage,
];

context.font = "30px Comic Sans MS";
context.textAlign = "center";

let playerArr = [];

const drawImages = (ctx, imgArr, x, y) => {
  imgArr.forEach((element) => {
    ctx.drawImage(
      element,
      frameX * SPRITE_WIDTH,
      frameY * SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      x - SPRITE_WIDTH / 2,
      y - SPRITE_HEIGHT / 2,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
  });
};

connectButton.addEventListener("click", (event) => {
  connectButton.style.display = "none";
  //disconnectButton.style.display = "block";
  socket.emit("join");
});

// disconnectButton.addEventListener("click", (event) => {
//   connectButton.style.display = "block";
//   disconnectButton.style.display = "none";
//   socket.emit("leave");
// });

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", chatInput.value);
  chatInput.value = "";
});

socket.on("change", (arr) => {
  playerArr = arr;
});

socket.on("message", (arr) => {
  messages = arr;
});

const drawPlayers = (playerArr) => {
  for (var i = 0; i < playerArr.length; i++) {
    drawImages(context, imgArr, playerArr[i].x, playerArr[i].y);

    if (playerArr[i].message !== "") {
      context.fillText(
        playerArr[i].message,
        playerArr[i].x,
        playerArr[i].y - 75
      );
    }
  }
};

window.addEventListener("keydown", function (e) {
  if (document.activeElement !== chatInput) {
    e.preventDefault();
    keyState[e.key] = true;
  }
});
window.addEventListener("keyup", function (e) {
  if (document.activeElement !== chatInput) {
    e.preventDefault();
    keyState[e.key] = false;
  }
});

const update = () => {
  if (keyState["ArrowLeft"]) {
    facingRight = false;
    socket.emit("move", -1, 0);
  }
  if (keyState["ArrowRight"]) {
    facingRight = true;
    socket.emit("move", 1, 0);
  }
  if (keyState["ArrowUp"]) {
    socket.emit("move", 0, -1);
  }
  if (keyState["ArrowDown"]) {
    socket.emit("move", 0, 1);
  }
};

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayers(playerArr);

  if (facingRight) {
    imgArr = [
      bodyPlayerImage,
      clothesPlayerImage,
      headPlayerImage,
      hairPlayerImage,
      eyesPlayerImage,
      mouthPlayerImage,
      weaponPlayerImage,
    ];
    if (gameFrame % staggerFrames === 0) {
      frameX < NUM_SPRITE_FRAMES - 1 ? frameX++ : (frameX = 0);
    }
  } else {
    imgArr = [
      bodyLPlayerImage,
      clothesLPlayerImage,
      headLPlayerImage,
      hairLPlayerImage,
      eyesLPlayerImage,
      mouthLPlayerImage,
      weaponLPlayerImage,
    ];
    if (gameFrame % staggerFrames === 0) {
      frameX > 0 ? frameX-- : (frameX = NUM_SPRITE_FRAMES - 1);
    }
  }
  gameFrame++;
};

let frameID;

function runGameLoop(tFrame) {
  if (document.activeElement === chatInput) {
    console.log("yes");
  } else {
    console.log("no");
  }
  frameID = window.requestAnimationFrame(runGameLoop);

  update(tFrame);
  render();
}

runGameLoop();
