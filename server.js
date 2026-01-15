const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = [];

io.on("connection", socket => {

  socket.emit("rooms", rooms);

  socket.on("createRoom", nick => {
    const roomId = Math.random().toString(36).substr(2, 6);
    rooms.push(roomId);
    socket.join(roomId);

    socket.emit("roomCreated", roomId);
    io.emit("rooms", rooms);
  });

  socket.on("joinRoom", roomId => {
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    // basit tutuyoruz
  });
});

server.listen(3000);
