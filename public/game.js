<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
<script src="/socket.io/socket.io.js"></script>
</head>

<body class="game">
<div id="board">🎲 Tavla Tahtası</div>

<script>
document.documentElement.requestFullscreen?.();
screen.orientation?.lock("landscape");
</script>

<script src="game.js"></script>
</body>
</html>
