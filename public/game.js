const socket = io();

const board = document.getElementById("board");

for (let i = 0; i < 24; i++) {
  const p = document.createElement("div");
  p.className = "point";
  p.dataset.index = i;
  board.appendChild(p);
}

function createStone(color) {
  const s = document.createElement("div");
  s.className = "stone " + color;
  s.draggable = true;

  s.ondragstart = e => {
    e.dataTransfer.setData("color", color);
  };
  return s;
}

document.querySelectorAll(".point").forEach(p => {
  p.ondragover = e => e.preventDefault();
  p.ondrop = e => {
    const color = e.dataTransfer.getData("color");
    const stone = createStone(color);
    p.appendChild(stone);

    socket.emit("move", {
      index: p.dataset.index,
      color
    });
  };
});

socket.on("move", data => {
  const p = document.querySelector(`.point[data-index="${data.index}"]`);
  p.appendChild(createStone(data.color));
});

socket.on("startGame", () => {
  alert("Rakip bulundu, oyun başladı!");
});

socket.on("opponentLeft", () => {
  alert("Rakip oyundan çıktı");
});
