<!-- FULL ONLINE TAVLA – MOBİL YATAY – SOCKET.IO --><!DOCTYPE html><html lang="tr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>HerbiOyun | Online Tavla</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
<script src="/socket.io/socket.io.js"></script>
<style>
*{box-sizing:border-box;font-family:'Orbitron',sans-serif}
html,body{margin:0;padding:0;background:#1b1b1b;color:#fff;height:100%;overflow:hidden}/* YATAY ZORUNLU */ #rotateLock{position:fixed;inset:0;background:#000;display:none;align-items:center;justify-content:center;z-index:9999;text-align:center;padding:20px}

/* POPUP */ .popup{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:999} .popupBox{background:#222;border-radius:15px;padding:20px;width:90%;max-width:400px;text-align:center} .popupBox h2{margin-top:0} .popupBox input,button{width:100%;padding:12px;margin-top:10px;border:none;border-radius:8px;font-size:16px} button{background:#d4af37;color:#000;font-weight:bold} button.secondary{background:#444;color:#fff}

/* OYUN */ #game{display:flex;flex-direction:column;height:100%} #topBar{display:flex;justify-content:space-between;padding:10px;background:#111} #board{flex:1;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:1fr 1fr;gap:4px;padding:10px;background:#3b2a1a} .point{background:linear-gradient(#8b5a2b,#5a3a1a);border-radius:4px;display:flex;flex-direction:column-reverse;align-items:center;padding:4px} .checker{width:26px;height:26px;border-radius:50%;margin:2px} .white{background:#f5f5f5} .black{background:#111}

#diceArea{display:flex;justify-content:center;gap:20px;padding:10px} .dice{width:50px;height:50px;background:#fff;color:#000;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;animation:spin .6s} @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}} </style>

</head>
<body><div id="rotateLock"><h1>📱 Lütfen telefonu yatay çevir</h1></div><!-- POPUP: NICKNAME --><div class="popup" id="namePopup">
  <div class="popupBox">
    <h2>Takma Ad</h2>
    <input id="nickname" placeholder="Nick gir" />
    <button onclick="saveName()">Devam</button>
  </div>
</div><!-- POPUP: ODA --><div class="popup" id="roomPopup">
  <div class="popupBox">
    <h2>Oda Kodu</h2>
    <div id="roomCode" style="font-size:28px;margin:10px"></div>
    <button onclick="copyCode()">📋 Kopyala</button>
    <button class="secondary" onclick="closeRoom()">Devam</button>
  </div>
</div><div id="game">
  <div id="topBar">
    <div id="p1">-</div>
    <div id="p2">-</div>
  </div>  <div id="board"></div>  <div id="diceArea">
    <div class="dice" id="d1">?</div>
    <div class="dice" id="d2">?</div>
  </div>
</div><script>
const socket = io();
let nickname="";

function checkOrientation(){
  document.getElementById('rotateLock').style.display = window.innerHeight>window.innerWidth?'flex':'none';
}
window.addEventListener('resize',checkOrientation);
checkOrientation();

// BOARD
const board=document.getElementById('board');
for(let i=0;i<24;i++){
  const p=document.createElement('div');
  p.className='point';
  board.appendChild(p);
}

// START
window.onload=()=>document.getElementById('namePopup').style.display='flex';

function saveName(){
  nickname=document.getElementById('nickname').value.trim();
  if(!nickname)return;
  document.getElementById('namePopup').style.display='none';
  socket.emit('createRoom');
}

socket.on('roomCreated',code=>{
  document.getElementById('roomCode').innerText=code;
  document.getElementById('roomPopup').style.display='flex';
});

function copyCode(){navigator.clipboard.writeText(document.getElementById('roomCode').innerText)}
function closeRoom(){document.getElementById('roomPopup').style.display='none'}

socket.on('gameStart',data=>{
  document.getElementById('d1').innerText=data.dice[0];
  document.getElementById('d2').innerText=data.dice[1];
});
</script></body>
</html>
