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

context.font = "30px Comic Sans MS";
context.textAlign = "center";

// let clientID;

let playerArr = [];

connectButton.addEventListener("click", (event) => {
  connectButton.style.display = "none";
  disconnectButton.style.display = "block";
  socket.emit("join");
});

disconnectButton.addEventListener("click", (event) => {
  connectButton.style.display = "block";
  disconnectButton.style.display = "none";
  socket.emit("leave");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", chatInput.value);
  chatInput.value = "";
});

socket.on("change", (arr) => {
  playerArr = arr;
  console.log(playerArr);
});

socket.on("message", (arr) => {
  messages = arr;
  console.log(arr);
});

const drawPlayers = (playerArr) => {
  for (var i = 0; i < playerArr.length; i++) {
    context.fillRect(
      playerArr[i].xPos,
      playerArr[i].yPos,
      playerArr[i].width,
      playerArr[i].height
    );

    if (playerArr[i].message !== "") {
      context.fillText(
        playerArr[i].message,
        playerArr[i].xPos + playerArr[i].width / 2,
        playerArr[i].yPos - 50
      );
      console.log(playerArr[i].message);
    }
  }
};

var keyState = {};
window.addEventListener(
  "keydown",
  function (e) {
    keyState[e.key || e.which] = true;
  },
  true
);
window.addEventListener(
  "keyup",
  function (e) {
    keyState[e.key || e.which] = false;
  },
  true
);

const update = () => {
  if (keyState["ArrowLeft"]) {
    socket.emit("move", -1, 0);
  }
  if (keyState["ArrowRight"]) {
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
};

let frameID;

function runGameLoop(tFrame) {
  frameID = window.requestAnimationFrame(runGameLoop);

  update(tFrame);
  render();
}

runGameLoop();
