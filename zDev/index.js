const joinButton = document.getElementById("join-button");
const gameDiv = document.getElementById("game-container");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = gameDiv.clientWidth;
canvas.height = gameDiv.clientHeight;

console.log(gameDiv.clientWidth);
console.log(gameDiv.clientHeight);

let clientID;

joinButton.addEventListener("click", (event) => {
  reqJoin().then();
});

const reqJoin = async () => {
  try {
    const result = await fetch("api/users/join", { method: "GET" });
    const data = await result.json();
    clientID = data.id;
    //console.log('Successful POST request:', data);
  } catch (err) {
    console.log("Error in POST request:", error);
  }
};

const reqPlayers = async () => {
  try {
    const result = await fetch("api/users/players", { method: "GET" });
    const data = await result.json();
    //console.log('Successful POST request:', data);
    return data;
  } catch (err) {
    console.log("Error in POST request:", error);
  }
};

const reqMovement = async (movement) => {
  try {
    const result = await fetch(`api/users/movement/${clientID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movement),
    });
    const data = await result.json();
    //console.log('Successful POST request:', data);
  } catch (err) {
    console.log("Error in POST request:", error);
  }
};

const drawPlayers = (playerArr) => {
  for (var i = 0; i < playerArr.length; i++) {
    context.fillRect(
      playerArr[i].xPos,
      playerArr[i].yPos,
      playerArr[i].width,
      playerArr[i].height
    );
  }
};

const keys = {
  x: 0,
  y: 0,
};

addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.x = -1;
      break;
    case "ArrowRight":
      keys.x = 1;
      break;
    case "ArrowUp":
      keys.y = 1;
      break;
    case "ArrowDown":
      keys.y = -1;
      break;
  }
});

addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      keys.x = 0;
      break;
    case "ArrowRight":
      keys.x = 0;
      break;
    case "ArrowUp":
      keys.y = 0;
      break;
    case "ArrowDown":
      keys.y = 0;
      break;
  }
});

const update = () => {
  // only request movement if user is pressing keys
  if (keys.x !== 0 || keys.y !== 0) {
    reqMovement(keys).then();
  }
};

const render = () => {
  reqPlayers().then((playerArr) => {
    // console.log(playerArr);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers(playerArr);
  });
};

let frameID;

function runGameLoop(tFrame) {
  frameID = window.requestAnimationFrame(runGameLoop);
  if (clientID !== undefined) {
    update(tFrame);
  }

  render();
}

runGameLoop();
