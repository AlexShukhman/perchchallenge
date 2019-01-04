// Table Setup
var tr1 = document.getElementById('row1');
var tr2 = document.getElementById('row2');
var html1;
var html2;
for (var i = 0; i < 5; i++) {
    html1 = '<td>Box ' + i.toString() + '<br>Average: <p id="a'+ i.toString() + '"></p><br>Current: <p id="c' + i.toString() + '"></p><br><br></td>';
    html2 = '<td>Box ' + (i+5).toString() + '<br>Average: <p id="a'+ (i+5).toString() + '"></p><br>Current: <p id="c' + (i+5).toString() + '"></p><br><br></td>';
    tr1.insertAdjacentHTML("beforeend", html1);
    tr2.insertAdjacentHTML("beforeend", html2);
}

// Canvas Setup
var canvas = document.getElementById('bCanvas');
var img = document.getElementById('logo');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#F0F0F0';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = "1";
ctx.fillStyle = 'gray';
ctx.font = '10px Lato'

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
    analyzePoint(data.x, data.y);
});

// Replay
function replay() {
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'gray';
    getPoints(reDraw);
    for (var i in boxes) {
        drawBox(boxes[i], 'gray');
        drawNumber(boxes[i][0][0], boxes[i][1][0], i)
    }
}

// Draw 10x Faster
function reDraw(o) {
    drawx10(o.x, o.y);
}

function drawx10(xs, ys) {
    if (xs.length != 0){
        ctx.drawImage(img, xs.shift(), ys.shift());
        setTimeout((()=>{drawx10(xs, ys)}), 10);
    }
}

// Velocity Code
var velocities = [];
var allPoints = [];
var boxes = [];

getPoints(pointsSetup);

for (var i = 0; i < 10; i++) {
    velocities.push([]);
    boxes.push(makeBox(i));
}

function makeBox(num) {
    var max = 500;
    var x = [];
    var y = [];
    for (var i = 0; i < 2; i++){
        x.push(Math.floor(Math.random() * max));
        y.push(Math.floor(Math.random() * max));
    }
    xn = [Math.min(...x), Math.max(...x)];
    yn = [Math.min(...y), Math.max(...y)];
    drawBox([xn,yn], 'gray');
    drawNumber(xn[0], yn[0], num);
    return [xn, yn];
}

function drawBox(box, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(box[0][0], box[1][0], box[0][1]-box[0][0], box[1][1]-box[1][0]);
    ctx.stroke();
}

function drawNumber(x, y, num) {
    ctx.fillText(num.toString(), x+2, y+10);
}

function checkBox(i, x, y) {
    var box = boxes[i];
    return x<=box[0][1] && x>=box[0][0] && y<=box[1][1] && y>=box[1][0];
}

function getPoints(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            callback(JSON.parse(xhr.response));
        }
    }
    xhr.open('GET', '/getOut');
    xhr.send();
}

function pointsSetup(o) {
    for (var i in o.x){
        analyzePoint(o.x[i], o.y[i]);
    }
}

function analyzePoint(x, y) {
    if (allPoints.length < 1){
        allPoints.push([x,y]);
        return;
    }
    else if (allPoints.length < 2){
        var x0 = allPoints[allPoints.length-1][0]
        var y0 = allPoints[allPoints.length-1][1]
        for (var i in boxes) {
            var b0 = checkBox(i, x0, y0);
            var b1 = checkBox(i, x, y);
            if (b0) {
                if (b1) {
                    drawBox(boxes[i], 'green');
                }
                else {
                    velocities[i].push(velocity(x0, y0, x, y));
                }
            }
            else if (b1) {
                velocities[i].push(velocity(x0, y0, x, y));
            }
        }
        allPoints.push([x,y]);
        return;
    }
    var x0 = allPoints[allPoints.length-2][0]
    var y0 = allPoints[allPoints.length-2][1]
    var x1 = allPoints[allPoints.length-1][0]
    var y1 = allPoints[allPoints.length-1][1]
    for (var i in boxes) {
        var b0 = checkBox(i, x0, y0);
        var b1 = checkBox(i, x1, y1);
        var b2 = checkBox(i, x, y);
        var v;
        if (b1) {
            if (b2) {
                drawBox(boxes[i], 'green');
                if (b0) {
                    velocities[i].push(velocity(x0, y0, x1, y1));
                    v = velocity(x1, y1, x, y);
                }
            }
            else {
                drawBox(boxes[i], 'gray');
                velocities[i].push(velocity(x1, y1, x, y));
                v = 0;
            }
        }
        else if (b2) {
            drawBox(boxes[i], 'green');
            velocities[i].push(velocity(x1, y1, x, y));
            v = velocity(x1, y1, x, y);
        }
        else {
            drawBox(boxes[i], 'gray');
            v = 0;
        }
        updateAvg(i);
        updateCurrent(i, v);
    }
    allPoints.push([x, y]);
}

function velocity(x0, y0, x1, y1) {
    return 10 * Math.sqrt((x0-x1)**2+(y0-y1)**2);
}

function updateCurrent(bnum, vel) {
    e = document.getElementById('c' + bnum.toString());
    e.innerHTML = Math.round(vel).toString() + "px/s";
}

function updateAvg(bnum) {
    e = document.getElementById('a' + bnum.toString());
    e.innerHTML = Math.round(velocities[bnum].reduce((a,b)=>{
        return a+b;
    }, 0)/velocities[bnum].length).toString() + 'px/s';
}