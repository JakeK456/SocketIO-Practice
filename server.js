const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require("uuid");

const Player = require("./models/player.js");
const MS_PER_FRAME = 16.6;

let playerArr = [];
let messages = [];

const path = require("path");
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
    removePlayer(socket.id);
    io.emit("change", playerArr);
  });

  socket.on("join", () => {
    playerArr.push(new Player(-1, -1, 50, 50, "black", socket.id));
    io.emit("change", playerArr);
  });

  socket.on("leave", () => {
    console.log("user disconnected " + socket.id);
    removePlayer(socket.id);
    io.emit("change", playerArr);
  });

  socket.on("move", (x, y) => {
    let player = findPlayer(socket.id);
    if (player !== undefined) {
      player.move(x, y);
    }
    io.emit("change", playerArr);
  });

  socket.on("message", (msg) => {
    let player = findPlayer(socket.id);
    if (player !== undefined) {
      player.message = msg;
      io.emit("change", playerArr);
      setTimeout(() => {
        player.message = "";
        io.emit("change", playerArr);
      }, 8000);
    }
  });
});

server.listen(PORT, () => console.log(`App listening on port ${PORT}`));

const removePlayer = (socketId) => {
  playerArr = playerArr.filter((obj) => obj.socketId !== socketId);
};

const findPlayer = (socketId) => {
  return playerArr.find((obj) => obj.socketId === socketId);
};

const serverLoop = () => {
  playerArr.forEach((player) => {
    player.calcCollisions(playerArr);
  });
};

setInterval(serverLoop, MS_PER_FRAME);
