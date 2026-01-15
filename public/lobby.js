const socket = io();
let myNick = "";

function createRoom() {
  const nick = document.getElementById("nick").value.trim();
  if (!nick) return alert("Kullanıcı adı zorunlu");

  myNick = nick;
  socket.emit("createRoom", nick);
}

function joinRoom() {
  const nick = document.getElementById("nick").value.trim();
  if (!nick) return alert("Kullanıcı adı zorunlu");

  const code = prompt("Oda kodunu gir");
  if (!code) return;

  window.location = `game.html?room=${code}&nick=${nick}`;
}

socket.on("roomCreated", roomId => {
  document.getElementById("roomInfo").innerHTML = `
    <p>Oda Kodu:</p>
    <b>${roomId}</b><br><br>
    <button onclick="copy('${roomId}')">📋 Kopyala</button>
    <button onclick="goGame('${roomId}')">🎮 Oyuna Gir</button>
  `;
});

function copy(id) {
  navigator.clipboard.writeText(id);
  alert("Kopyalandı");
}

function goGame(room) {
  window.location = `game.html?room=${room}&nick=${myNick}`;
}
