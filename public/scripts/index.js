import InputHandler from "./input.js";
import Player from "./player.js";

const socket = io("127.0.0.1:3001", { transports: ["websocket"] });

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

let playerArrServer = [];
let playerObjClient = {};

connectButton.addEventListener("click", (event) => {
  connectButton.style.display = "none";
  socket.emit("join");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("message", chatInput.value);
  chatInput.value = "";
});

socket.on("change", (arr) => {
  playerArrServer = arr;
});

const drawPlayers = () => {
  // copy data array from server into client player model
  playerArrServer.forEach((playerServer) => {
    if (!playerObjClient.hasOwnProperty(playerServer.id)) {
      playerObjClient[playerServer.id] = new Player();
    }
    playerObjClient[playerServer.id].x = playerServer.x;
    playerObjClient[playerServer.id].y = playerServer.y;
    playerObjClient[playerServer.id].frameY = playerServer.frameY;
    console.log("server ", playerServer.facingRight);
    console.log("client ", playerObjClient[playerServer.id].facingRight);
    if (
      playerObjClient[playerServer.id].facingRight !== playerServer.facingRight
    ) {
      playerObjClient[playerServer.id].flipSprites(playerServer.facingRight);
      console.log("flippingSprite");
    }

    // TODO: move this onto player
    if (playerServer.message !== "") {
      context.fillText(
        playerServer.message,
        playerServer.x,
        playerServer.y - 75
      );
    }
  });

  // remove player from client if not on server arr
  const clientIds = Object.keys(playerObjClient);
  const serverIds = playerArrServer.map((player) => player.id);
  const difference = clientIds.filter((x) => !serverIds.includes(x));
  difference.forEach((diff) => {
    delete playerObjClient[diff];
  });

  // draw client player model
  for (const player in playerObjClient) {
    playerObjClient[player].draw(context);
  }
};

const input = new InputHandler();
let lastTime;

const update = (currentTime) => {
  const dt = currentTime - lastTime;
  lastTime = currentTime;
  console.log(dt);

  const keys = input.getInputs();
  console.log(keys);
  const emits = input.generateEmits(keys, dt);

  emits.forEach((emit) => {
    if (emit !== []) {
      socket.emit(...emit, dt);
    }
  });
};

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayers();
};

let frameID;

function runGameLoop(tFrame) {
  frameID = window.requestAnimationFrame(runGameLoop);
  update(tFrame);
  render();
}

runGameLoop();
