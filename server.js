const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// INDEX.HTML SERVE ET
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ODA SİSTEMİ
const rooms = {};

function rollDice() {
  return [
    1 + Math.floor(Math.random() * 6),
    1 + Math.floor(Math.random() * 6)
  ];
}

io.on("connection", socket => {

  socket.on("createRoom", () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[code] = { players: [socket.id] };
    socket.join(code);
    socket.emit("roomCreated", code);
  });

  socket.on("joinRoom", code => {
    const room = rooms[code];
    if (!room) {
      socket.emit("roomError", "Oda bulunamadı");
      return;
    }
    if (room.players.length >= 2) {
      socket.emit("roomError", "Oda dolu");
      return;
    }

    room.players.push(socket.id);
    socket.join(code);

    io.to(code).emit("gameStart", {
      dice: rollDice()
    });
  });

});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server çalışıyor");
});
