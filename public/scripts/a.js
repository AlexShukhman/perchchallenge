// Mouse Tracking Setup
document.addEventListener('mousemove', mouseUpdate, false);
document.addEventListener('mouseenter', mouseUpdate, false);
var x = null;
var y = null;

// Canvas Setup
var canvas = document.getElementById('aCanvas');
var img = document.getElementById('logo');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#F0F0F0';
ctx.fillRect(0, 0, canvas.width, canvas.height);
var rect = canvas.getBoundingClientRect();
var scalex = canvas.width/rect.width;
var scaley = canvas.height/rect.height;

// Socket Setup
var socket = io();

socket.on('connect', (data) => {
    socket.emit('join', JSON.stringify({
        type: 'a'
    }));
});

// Draw
socket.on('update', (data) => {
    ctx.drawImage(img, data.x-20, data.y-28);
});

// Mouse Tracking
function mouseUpdate(e) {
    x = (e.pageX - rect.left)*scalex;
    y = (e.pageY - rect.top)*scaley;
}

function getMouse() {
    console.log(x);
    return {
        x: x, 
        y: y,
        t: new Date()
    };
}

// Sampling
(function sample() {
    socket.emit('sample', JSON.stringify(getMouse()));
    setTimeout(sample, 100); // 100 ms = .1 sec
})(); // auto loop