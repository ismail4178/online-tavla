const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const rooms = {};

io.on("connection", socket => {

  socket.on("createRoom", ({ nickname }) => {
    const room = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[room] = { players: [{ id: socket.id, name: nickname }] };
    socket.join(room);
    socket.emit("roomCreated", room);
  });

  socket.on("joinRoom", ({ room, nickname }) => {
    if (!rooms[room] || rooms[room].players.length >= 2) {
      socket.emit("roomError");
      return;
    }
    rooms[room].players.push({ id: socket.id, name: nickname });
    socket.join(room);
    io.to(room).emit("players", rooms[room].players);
    io.to(room).emit("startGame");
  });

  socket.on("rollDice", room => {
    const dice = [
      Math.ceil(Math.random() * 6),
      Math.ceil(Math.random() * 6)
    ];
    io.to(room).emit("diceResult", dice);
  });

  socket.on("disconnect", () => {
    for (const r in rooms) {
      rooms[r].players = rooms[r].players.filter(p => p.id !== socket.id);
      if (rooms[r].players.length === 0) delete rooms[r];
    }
  });
});

server.listen(3000, () => console.log("Server çalışıyor"));
