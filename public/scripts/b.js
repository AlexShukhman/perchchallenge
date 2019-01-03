// Canvas Setup
var canvas = document.getElementById('bCanvas');
var img = document.getElementById('logo');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#F0F0F0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Socket Setup
var socket = io();

socket.on('connect', (data) => {
    socket.emit('join', JSON.stringify({
        type: 'b'
    }));
});

// Draw
socket.on('update', (data) => {
    ctx.drawImage(img, data.x-20, data.y-28);
});