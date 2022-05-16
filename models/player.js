const { v4: uuidv4 } = require("uuid");

class Player {
  constructor(xPos, yPos, width, height, color, socketId) {
    this.id = uuidv4();
    this.socketId = socketId;
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
    this.speed = 2;
    this.message = "";
  }

  // ux and uy must be unit. either -1, 0, or 1
  move(ux, uy) {
    this.xPos += normalize(ux) * this.speed;
    this.yPos += normalize(uy) * this.speed;
  }
}

function normalize(number) {
  if (number > 0) return 1;
  if (number < 0) return -1;
  return 0;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = Player;
