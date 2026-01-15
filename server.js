const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

io.on("connection", socket => {

  socket.on("createRoom", nick => {
    const roomId = Math.random().toString(36).substr(2,6);
    rooms[roomId] = [socket.id];
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRoom", roomId => {
    if (!rooms[roomId] || rooms[roomId].length >= 2) {
      socket.emit("roomFull");
      return;
    }
    rooms[roomId].push(socket.id);
    socket.join(roomId);
    io.to(roomId).emit("startGame");
  });

  socket.on("disconnect", () => {
    for (let r in rooms) {
      rooms[r] = rooms[r].filter(id => id !== socket.id);
      if (rooms[r].length === 0) delete rooms[r];
      else io.to(r).emit("opponentLeft");
    }
  });

});

server.listen(3000);
