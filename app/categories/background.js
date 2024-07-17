var lines = [];
var points = [];
var canvas = document.getElementById("background");
for (var i = 0; i<200;i++) {
    points.push(new OptimisedCircle(canvas, 5, Math.random()* parseInt(canvas.offsetWidth), Math.random() * parseInt(canvas.offsetHeight), "white", 0.6, true, Math.random()*2-1, Math.random()*2-1));
}

const ctx = canvas.getContext("2d");
resizeEventHandler();


setInterval(updateCanvas, 30);
window.addEventListener("resize", resizeEventHandler);

var gravityRadius = 200;
var gravityStrength = 0.002;
var lineRadius = 100;

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i<points.length; i++) {
        var point = points[i];
        point.applyVelocity();
        point.render(canvas, true, true);
    }
    lines = [];
    for (var i = 0; i<points.length; i++) {
        var point = points[i];
        var closePoints = points.filter((p) => calculateDistance(point.x, point.y, p.x, p.y) < gravityRadius);
        for (var j = 0; j<closePoints.length; j++) {
            var point2 = closePoints[j];
            applyGravity(point, point2, gravityRadius, gravityStrength);
            var distance = calculateDistance(point.x, point.y, point2.x, point2.y);
            if (distance < lineRadius) {
                var line = new Line(point.x, point.y, point2.x, point2.y, 1, "white", (((distance/lineRadius)-1)*-1)/2);
                line.render(canvas);
            }
        }
    }

    OptimisedCircle.updateVelMultiplier();
}

function resizeEventHandler() {
    canvas.width = parseInt(canvas.offsetWidth);
    canvas.height = parseInt(canvas.offsetHeight);
    // line.render(canvas);
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