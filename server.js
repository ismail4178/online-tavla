const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/*
rooms = {
  ABC123: {
    players: [
      { id: socketId, nick: "Ali" },
      { id: socketId, nick: "Veli" }
    ]
  }
}
*/
let rooms = {};

io.on("connection", socket => {

  // ODA OLUŞTUR
  socket.on("createRoom", nick => {
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();

    rooms[roomId] = {
      players: [{ id: socket.id, nick }]
    };

    socket.join(roomId);
    socket.roomId = roomId;

    socket.emit("roomCreated", roomId);
  });

  // ODAYA GİR
  socket.on("joinRoom", ({ roomId, nick }) => {
    const room = rooms[roomId];

    if (!room || room.players.length >= 2) {
      socket.emit("roomFull");
      return;
    }

    room.players.push({ id: socket.id, nick });
    socket.join(roomId);
    socket.roomId = roomId;

    io.to(roomId).emit("startGame", room.players);
  });

  // BAĞLANTI KOPARSA
  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;

    const room = rooms[roomId];
    room.players = room.players.filter(p => p.id !== socket.id);

    if (room.players.length === 0) {
      delete rooms[roomId];
    } else {
      io.to(roomId).emit("opponentLeft");
      delete rooms[roomId];
    }
  });

});

server.listen(3000, () => {
  console.log("✅ Tavla server çalışıyor :3000");
});
socket.on("leaveRoom", () => {
  for (let room in rooms) {
    if (rooms[room].includes(socket.id)) {
      socket.to(room).emit("opponentLeft");
      delete rooms[room];
    }
  }
});

socket.on("disconnect", () => {
  for (let room in rooms) {
    if (rooms[room].includes(socket.id)) {
      socket.to(room).emit("opponentLeft");
      delete rooms[room];
    }
  }
});
