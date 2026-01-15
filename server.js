const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let waitingPlayer = null;

io.on("connection", socket => {
  if (waitingPlayer) {
    socket.room = waitingPlayer.room;
    socket.join(socket.room);

    io.to(socket.room).emit("startGame");
    waitingPlayer = null;
  } else {
    socket.room = "room-" + socket.id;
    socket.join(socket.room);
    waitingPlayer = socket;
  }

  socket.on("move", data => {
    socket.to(socket.room).emit("move", data);
  });

  socket.on("disconnect", () => {
    io.to(socket.room).emit("opponentLeft");
  });
});

server.listen(3000, () => {
  console.log("Tavla server çalışıyor :3000");
});
