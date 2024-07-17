var lines = [];
var points = [];
var canvas = document.getElementById("background");
for (var i = 0; i<200;i++) {
    points.push(new OptimisedCircle(canvas, 5, Math.random()* parseInt(canvas.offsetWidth), Math.random() * parseInt(canvas.offsetHeight), "white", 0.6, true, Math.random()*2-1, Math.random()*2-1));
}
//canvas.width = 500;
//canvas.height = 500;
//points.push(new OptimisedCircle(canvas, 5, Math.random()* parseInt(canvas.offsetWidth), Math.random() * parseInt(canvas.offsetHeight), "white", 0.6, true, Math.random()*2-1, Math.random()*2-1));
resizeEventHandler();
const ctx = canvas.getContext("2d");

var mouseX = -200;
var mouseY = -200;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

setInterval(updateCanvas, 30);
window.addEventListener("resize", resizeEventHandler);

var gravityRadius = 200;
var gravityStrength = 0.002;
var lineRadius = 100;

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i<points.length; i++) {
        var point = points[i];
        if (i == 0) {
            point.x = mouseX;
            point.y = mouseY;
            point.xVel = 0;
            point.yVel = 0;
        }
        point.applyVelocity();
        if (i != 0) {
            point.render(canvas, true, true);
        }
    }
    lines = [];
    for (var i = 0; i<points.length; i++) {
        var modifiedGravityStrength = gravityStrength;
        var modifiedLineRadius = lineRadius;
        var point = points[i];
        if (i == 0) {
            modifiedGravityStrength = gravityStrength * 100;
            modifiedLineRadius = lineRadius * 2;
        }
        var closePoints = points.filter((p) => calculateDistance(point.x, point.y, p.x, p.y) < gravityRadius);
        for (var j = 0; j<closePoints.length; j++) {
            var point2 = closePoints[j];
            applyGravity(point, point2, gravityRadius, modifiedGravityStrength);
            var distance = calculateDistance(point.x, point.y, point2.x, point2.y);
            if (distance < modifiedLineRadius) {
                var lineWidth = 1;
                if (i == 0) {
                    lineWidth = 5;
                }
                var line = new Line(point.x, point.y, point2.x, point2.y, lineWidth, "white", (((distance/modifiedLineRadius)-1)*-1)/2);
                lines.push(line);
            }
        }
    }

    for (var i = 0; i<lines.length; i++) {
        var line = lines[i];
        line.render(canvas);
    }

    OptimisedCircle.updateVelMultiplier();
}

function resizeEventHandler() {
    canvas.width = parseInt(canvas.offsetWidth);
    canvas.height = parseInt(canvas.offsetHeight);
    // line.render(canvas);
}

function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function applyGravity(p1, p2, radius, amount) {
    var divisor = Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
    if (divisor == 0) {
        divisor = 1;
    }
    var factor = (((calculateDistance(p1.x, p1.y, p2.x, p2.y)/radius)-1)*-amount);
    var xGrav = ((p1.x - p2.x)/divisor)*factor;
    var yGrav = ((p1.y - p2.y)/divisor)*factor;
    p2.xVel += xGrav;
    p2.yVel += yGrav;
}