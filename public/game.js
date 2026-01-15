const socket = io();

/* URL PARAMETRELERİ */
const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");
const nick = params.get("nick");

if (!roomId || !nick) {
  alert("Nick veya oda eksik");
  window.location.href = "/";
}

socket.emit("joinRoom", { roomId, nick });

/* OYUNCU DURUM */
let myTurn = false;

const rollBtn = document.getElementById("rollBtn");
const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");

/* TAHTA */
const board = document.getElementById("board");
for (let i = 0; i < 24; i++) {
  const p = document.createElement("div");
  p.className = "point";
  board.appendChild(p);
}

/* ZAR AT */
rollBtn.onclick = () => {
  if (!myTurn) return;

  rollBtn.disabled = true;
  animateDice();

  setTimeout(() => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);

    dice1.textContent = d1;
    dice2.textContent = d2;

    socket.emit("rollDice", { roomId, d1, d2 });
    endTurn();
  }, 800);
};

function animateDice() {
  let count = 0;
  const anim = setInterval(() => {
    dice1.textContent = Math.ceil(Math.random() * 6);
    dice2.textContent = Math.ceil(Math.random() * 6);
    count++;
    if (count > 10) clearInterval(anim);
  }, 80);
}

/* SIRA */
function startTurn() {
  myTurn = true;
  rollBtn.disabled = false;
  setActive(true);
}

function endTurn() {
  myTurn = false;
  rollBtn.disabled = true;
  setActive(false);
}

/* AKTİF / PASİF */
function setActive(active) {
  document.getElementById("player1").classList.toggle("active", active);
  document.getElementById("player1").classList.toggle("passive", !active);

  document.getElementById("player2").classList.toggle("active", !active);
  document.getElementById("player2").classList.toggle("passive", active);
}

/* SERVER'DAN */
socket.on("startGame", players => {
  document.getElementById("p1nick").innerText = players[0].nick;
  document.getElementById("p2nick").innerText = players[1].nick;

  // İlk giren başlasın
  if (players[0].nick === nick) {
    startTurn();
  }
});

socket.on("rollDice", data => {
  dice1.textContent = data.d1;
  dice2.textContent = data.d2;
  startTurn();
});

socket.on("opponentLeft", () => {
  alert("Rakip oyundan çıktı");
  window.location.href = "/";
});
