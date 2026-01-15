const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {

  socket.on("createRoom", (nick) => {
    const code = Math.random().toString(36).substring(2,6).toUpperCase();
    rooms[code] = { players: [{ id: socket.id, nick }] };
    socket.join(code);
    socket.emit("roomCreated", code);
  });

  socket.on("joinRoom", ({ code, nick }) => {
    if (!rooms[code] || rooms[code].players.length >= 2) {
      socket.emit("errorMsg", "Oda bulunamadı veya dolu");
      return;
    }
    rooms[code].players.push({ id: socket.id, nick });
    socket.join(code);
    io.to(code).emit("startGame", rooms[code].players);
  });

  socket.on("rollDice", (code) => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    io.to(code).emit("diceResult", { d1, d2 });
  });

  socket.on("disconnect", () => {
    for (const code in rooms) {
      rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
      if (rooms[code].players.length === 0) delete rooms[code];
    }
  });

});

http.listen(3000, () => console.log("Server 3000 portunda"));
