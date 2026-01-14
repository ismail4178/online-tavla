// =============================== // FULL ONLINE TAVLA + ODA SİSTEMİ (ÇALIŞAN) // Render.com uyumlu // Node.js + Express + Socket.IO // ===============================

const express = require("express"); const http = require("http"); const { Server } = require("socket.io");

const app = express(); const server = http.createServer(app); const io = new Server(server);

// =============================== // ODA ve OYUN VERİLERİ // =============================== const rooms = {}; // { ODAKODU: { players:[], game:{} } }

function createGame() { return { turn: "white", board: Array(24).fill(null).map(() => ({ color: null, count: 0 })) }; }

function initBoard(game) { const s = (i, c, n) => (game.board[i] = { color: c, count: n }); s(0, "white", 2); s(11, "white", 5); s(16, "white", 3); s(18, "white", 5); s(23, "black", 2); s(12, "black", 5); s(7, "black", 3); s(5, "black", 5); }

// =============================== // ANA SAYFA (HTML) // =============================== app.get("/", (req, res) => { res.send(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">

<title>Online Tavla</title>
<style>
body{font-family:Arial;background:#1e1e1e;color:#fff;text-align:center}
#board{display:grid;grid-template-columns:repeat(12,60px);gap:6px;max-width:760px;margin:20px auto}
.point{background:#c2a46d;min-height:220px;border-radius:8px;cursor:pointer}
.stone{width:42px;height:42px;border-radius:50%;margin:2px auto}
.white{background:#eee}.black{background:#111}
.selected{outline:4px solid gold}
#panel{margin:10px}
button{padding:8px 14px;margin:5px;border-radius:6px;border:none}
</style></head><body>
<h2>Online Tavla</h2>
<div id="panel">
<button onclick="createRoom()">ODA KUR</button>
<input id="roomInput" placeholder="ODA KODU" />
<button onclick="joinRoom()">KATIL</button>
<p id="info"></p>
</div>
<div id="board"></div><script src="/socket.io/socket.io.js"></script><script>
const socket = io();
let room = null, color = null, state = null, selected = null;
const boardDiv = document.getElementById('board');

for(let i=0;i<24;i++){
  const d=document.createElement('div');d.className='point';
  d.onclick=()=>clickPoint(i);boardDiv.appendChild(d);
}

function createRoom(){ socket.emit('createRoom'); }
function joinRoom(){ const c=document.getElementById('roomInput').value.toUpperCase(); socket.emit('joinRoom',c); }

socket.on('roomCreated', code => {
  room = code;
  info.innerText = 'Oda Kodu: ' + code;
});

socket.on('roomError', msg => alert(msg));

socket.on('roomReady', data => {
  room = data.room;
  color = data.color;
  state = data.game;
  info.innerText = 'Oyuncu: ' + color + ' | Oda: ' + room;
  render();
});

socket.on('state', g => { state = g; render(); });

function clickPoint(i){
  if(!state) return;
  const p = state.board[i];
  if(selected === null && p.color === color) selected = i;
  else if(selected !== null){ socket.emit('move',{room,from:selected,to:i}); selected=null; }
  render();
}

function render(){
  document.querySelectorAll('.point').forEach((p,i)=>{
    p.innerHTML='';
    if(i===selected) p.classList.add('selected'); else p.classList.remove('selected');
    const pt=state.board[i];
    for(let k=0;k<pt.count;k++){
      const s=document.createElement('div');s.className='stone '+pt.color;p.appendChild(s);
    }
  });
}
</script></body></html>`);});

// =============================== // SOCKET.IO (ASLINDA ARADIĞIN YER) // =============================== io.on("connection", socket => {

socket.on('createRoom', () => { const code = Math.random().toString(36).substring(2,7).toUpperCase(); const game = createGame(); initBoard(game); rooms[code] = { players: [socket.id], game }; socket.join(code); socket.emit('roomCreated', code); });

socket.on('joinRoom', code => { const room = rooms[code]; if(!room) return socket.emit('roomError','Oda bulunamadı'); if(room.players.length >= 2) return socket.emit('roomError','Oda dolu');

room.players.push(socket.id);
socket.join(code);

const colors = ['white','black'];
room.players.forEach((id,i)=>{
  io.to(id).emit('roomReady',{room:code,color:colors[i],game:room.game});
});

});

socket.on('move', ({room,from,to}) => { const r = rooms[room]; if(!r) return; const b = r.game.board; if(b[from].count === 0) return; b[from].count--; if(b[from].count === 0) b[from].color = null; b[to].color = b[to].color || r.game.turn; b[to].count++; io.to(room).emit('state', r.game); });

socket.on('disconnect', () => { for(const code in rooms){ rooms[code].players = rooms[code].players.filter(p => p !== socket.id); if(rooms[code].players.length === 0) delete rooms[code]; } }); });

// =============================== // RENDER UYUMLU PORT // =============================== const PORT = process.env.PORT || 3000; server.listen(PORT, () => console.log('Server running'));
