const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");

let playersArr = [];

router.get("/join", async (req, res) => {
  let newPlayer = new Player(-1, -1, 50, 50, "black");
  playersArr.push(newPlayer);
  res.json(newPlayer);
});

router.get("/players", async (req, res) => {
  res.json(playersArr);
});

router.post("/movement/:id", async (req, res) => {
  const player = getPlayerByID(req.params.id);
  if (player === undefined) {
    res.json("Could not find player");
  }
  player.move(req.body.x, req.body.y);
});

module.exports = router;

const getPlayerByID = (id) => {
  return playersArr.find((obj) => obj.id === id);
};

class Player {
  constructor(xPos, yPos, width, height, color) {
    this.id = uuidv4();
    if (xPos === -1) {
      this.xPos = getRandomInt(0, 1024);
    } else {
      this.xPos = xPos;
    }

    if (yPos === -1) {
      this.yPos = getRandomInt(0, 576);
    } else {
      this.yPos = yPos;
    }
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 50;
  }

  // ux and uy must be unit. either -1, 0, or 1
  move(ux, uy) {
    this.xPos += ux * this.speed;
    this.yPos += uy * this.speed;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
