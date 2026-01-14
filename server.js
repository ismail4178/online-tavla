// FULL GÖRSELLİ ONLINE 2 KİŞİLİK TAVLA OYUNU // Siteye gömülebilir – modern UI // Node.js + Express + Socket.IO

/* ================== KURULUM ==================

1. Node.js kur


2. npm init -y


3. npm install express socket.io


4. node server.js


5. http://localhost:3000 ================================================ */



const express = require("express"); const http = require("http"); const { Server } = require("socket.io");

const app = express(); const server = http.createServer(app); const io = new Server(server);

let players = []; let game = { turn: 'white', dice: [], board: Array(24).fill(null).map(()=>({color:null,count:0})), bar:{white:0,black:0}, off:{white:0,black:0} };

function set(i,c,n){game.board[i]={color:c,count:n}} function init(){ game.board=Array(24).fill(null).map(()=>({color:null,count:0})) set(0,'white',2);set(11,'white',5);set(16,'white',3);set(18,'white',5) set(23,'black',2);set(12,'black',5);set(7,'black',3);set(5,'black',5) } init();

app.get("/",(req,res)=>res.send(`<!DOCTYPE html><html lang=tr><head> <meta charset=UTF-8><title>Online Tavla</title>

<style>
body{margin:0;background:#1b1b1b;font-family:Arial;color:#fff}
#wrap{max-width:1100px;margin:auto;padding:20px}
h1{text-align:center}
#board{display:grid;grid-template-columns:repeat(12,1fr);gap:6px;background:#8b5a2b;padding:10px;border-radius:12px}
.point{background:#d2b48c;min-height:260px;border-radius:8px;display:flex;flex-direction:column;justify-content:flex-end;cursor:pointer}
.point.top{justify-content:flex-start}
.stone{width:42px;height:42px;border-radius:50%;margin:2px auto;box-shadow:0 2px 4px #000}
.white{background:#f5f5f5}
.black{background:#111}
.selected{outline:4px solid gold}
#panel{display:flex;justify-content:space-between;align-items:center;margin:15px 0}
button{padding:10px 20px;font-size:16px;border:none;border-radius:6px;cursor:pointer}
#dice span{display:inline-block;width:40px;height:40px;line-height:40px;background:#fff;color:#000;margin:0 5px;border-radius:6px;font-weight:bold}
@media(max-width:768px){#board{grid-template-columns:repeat(6,1fr)}}
</style></head><body><div id=wrap>
<h1>♟ Online Tavla</h1>
<div id=panel>
<div id=info>Bağlanıyor...</div>
<button onclick=roll()>Zar At</button>
<div id=dice></div>
</div>
<div id=board></div>
</div>
<script src=/socket.io/socket.io.js></script>
<script>
const socket=io();let color=null,state=null,sel=null;
const board=document.getElementById('board');for(let i=0;i<24;i++){ const d=document.createElement('div'); d.className='point '+(i<12?'top':''); d.onclick=()=>click(i); board.appendChild(d); }

socket.on('init',d=>{color=d.color;state=d.game;info.innerText='Oyuncu: '+color;draw()}); socket.on('state',g=>{state=g;draw()}); socket.on('dice',d=>{dice.innerHTML=d.map(x=>'<span>'+x+'</span>').join('')});

function roll(){socket.emit('roll')} function click(i){ if(!state) return; const p=state.board[i]; if(sel===null && p.color===color) sel=i; else if(sel!==null){socket.emit('move',{from:sel,to:i});sel=null} draw(); }

function draw(){ document.querySelectorAll('.point').forEach((p,i)=>{ p.innerHTML=''; if(i===sel) p.classList.add('selected'); else p.classList.remove('selected'); const pt=state.board[i]; for(let k=0;k<pt.count;k++){ const s=document.createElement('div');s.className='stone '+pt.color;p.appendChild(s) } }) } </script></body></html>`));

io.on('connection',s=>{ if(players.length<2){ const c=players.length===0?'white':'black'; players.push({id:s.id,color:c}); s.emit('init',{color:c,game}); } s.on('roll',()=>{game.dice=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];io.emit('dice',game.dice)}); s.on('move',({from,to})=>{ const p=game.board[from]; if(!p||p.color===null) return; p.count--; if(game.board[to].count===1&&game.board[to].color!==p.color){game.bar[game.board[to].color]++;game.board[to].count=0} game.board[to].color=p.color;game.board[to].count++; if(p.count===0)p.color=null; io.emit('state',game) }); s.on('disconnect',()=>players=[]) });

server.listen(3000,()=>console.log('Tavla hazır'));
