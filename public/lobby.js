const socket = io();

const roomsUl = document.getElementById("rooms");
const roomInfo = document.getElementById("roomInfo");

socket.on("rooms", rooms => {
  roomsUl.innerHTML = "";
  rooms.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    roomsUl.appendChild(li);
  });
});

function createRoom() {
  const nick = document.getElementById("nick").value;
  if (!nick) return alert("Nick yaz");

  socket.emit("createRoom", nick);
}

socket.on("roomCreated", roomId => {
  roomInfo.innerHTML = `
    <p>Oda ID: <b>${roomId}</b></p>
    <button onclick="copy('${roomId}')">📋 Kopyala</button>
    <button onclick="share('${roomId}')">📤 Paylaş</button>
  `;
});

function copy(id) {
  navigator.clipboard.writeText(id);
  alert("Kopyalandı");
}

function share(id) {
  if (navigator.share) {
    navigator.share({ text: "Tavla Oda Kodu: " + id });
  }
}

function goJoin() {
  window.location = "room.html";
}
