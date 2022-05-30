const { v4: uuidv4 } = require("uuid");

class Player {
  constructor(x, y, w, h, color, socketId) {
    this.id = uuidv4();
    this.socketId = socketId;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.speed = 0.12;
    this.message = "";
    this.frameY = 0;
    this.facingRight = true;
  }

  // ux and uy must be unit. either -1, 0, or 1
  move(ux, uy, dt) {
    this.x += normalize(ux) * this.speed * dt;
    this.y += normalize(uy) * this.speed * dt;

    if (ux > 0) {
      this.facingRight = true;
    }
    if (ux < 0) {
      this.facingRight = false;
    }
    // ux > 0 ? (this.facingRight = true) : (this.facingRight = false);
  }

  // takes in array of objects, each object has a x,y,w,h
  calcCollisions(arrOfObjs) {
    let hits = [];
    arrOfObjs.forEach((obj) => {
      if (
        this.id !== obj.id &&
        this.x < obj.x + obj.w &&
        this.x + this.w > obj.x &&
        this.y < obj.y + obj.h &&
        this.y + this.h > obj.y
      ) {
        hits.push(obj);
      }
    });

    if (hits.length === 0) {
      this.color = "black";
    } else {
      this.color = "red";
      hits.forEach((obj) => {
        obj.color = "red";
      });
    }

    return hits;
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
