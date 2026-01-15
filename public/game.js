const socket = io();

// URL PARAMETRELERİ
const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");
const nick = params.get("nick");

if (!roomId || !nick) {
  alert("Nick veya oda bilgisi eksik");
  window.location.href = "/";
}

// SERVER'A ODAYA GİRDİĞİNİ BİLDİR
socket.emit("joinRoom", { roomId, nick });

// TAHTA
const board = document.getElementById("board");
board.innerHTML = "";

// 24 HANE OLUŞTUR
const points = [];
for (let i = 0; i < 24; i++) {
  const p = document.createElement("div");
  p.className = "point";
  p.dataset.index = i;
  p.innerText = i + 1;
  board.appendChild(p);
  points.push(p);
}

// TAŞ EKLEME
function addStone(pointIndex, color) {
  const stone = document.createElement("div");
  stone.className = "stone " + color;
  points[pointIndex].appendChild(stone);
}

// 🔥 GERÇEK TAVLA BAŞLANGIÇ DİZİLİMİ
function setupBackgammon() {
  // Beyaz
  addStone(0, "white");
  addStone(0, "white");

  for (let i = 0; i < 5; i++) addStone(11, "white");
  for (let i = 0; i < 3; i++) addStone(16, "white");
  for (let i = 0; i < 5; i++) addStone(18, "white");

  // Siyah
  addStone(23, "black");
  addStone(23, "black");

  for (let i = 0; i < 5; i++) addStone(12, "black");
  for (let i = 0; i < 3; i++) addStone(7, "black");
  for (let i = 0; i < 5; i++) addStone(5, "black");
}

// SERVER “OYUN BAŞLASIN” DERSE
socket.on("startGame", () => {
  setupBackgammon();
});

// RAKİP KAÇARSA
socket.on("opponentLeft", () => {
  alert("Rakip oyundan çıktı. Salona dönüyorsun.");
  window.location.href = "/";
});
