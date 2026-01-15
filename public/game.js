const socket = io();

const board = document.getElementById("board");

// TAHTA OLUŞTUR (24 HANE)
for (let i = 0; i < 24; i++) {
  const point = document.createElement("div");
  point.className = "point";
  point.innerText = i + 1;
  board.appendChild(point);
}

// TEST TAŞLARI
function addStone(pointIndex, color) {
  const stone = document.createElement("div");
  stone.className = "stone " + color;
  board.children[pointIndex].appendChild(stone);
}

// DENEME TAŞLARI (ekranda görünmesi için)
addStone(0, "white");
addStone(5, "white");
addStone(18, "black");
addStone(23, "black");
socket.on("opponentLeft", () => {
  alert("Rakip oyundan çıktı. Salona dönüyorsun.");
  window.location.href = "/";
});
