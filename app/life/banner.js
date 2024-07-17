var banner = document.getElementById("headerBanner");
var title = document.getElementById("title");

var colors = ["green", "yellow", "magenta", "red", "orange", "blue", "lightblue", "lime"];
var rects = [];
for (var i = 0; i<100;i++) {
    rects.push(new Rectangle(Math.random() * banner.offsetWidth, Math.random() * banner.offsetHeight - 200, Math.random()*100 + 100, Math.random() * 500 + 500, colors[Math.round(Math.random()*colors.length)], Math.random + 0.8, 0, Math.random() * 2 - 1, 0));
}


setInterval(updateCanvas, 30);
document.addEventListener("scroll", scrollEventHandler);
window.addEventListener("resize", resizeEventHandler);

function updateCanvas() {
    banner.width = parseInt(banner.offsetWidth);
    banner.height = parseInt(banner.offsetHeight);
    var ctx = banner.getContext("2d");
    for (var i = 0; i<rects.length; i++) {
        var rect = rects[i];
        rect.applyVelocity();
        rect.render(banner, true, true);
    }
    Rectangle.updateVelMultiplier();
    title.style.opacity = 1 - (document.documentElement.scrollTop/300);
    // circle1.applyVelocity();
    // circle1.render(banner);
    // circle2.applyVelocity();
    // circle2.render(banner);
}

function scrollEventHandler() {
    Rectangle.setVelMultiplier(10);
}

function resizeEventHandler() {
    for (var i = 0; i<rects.length; i++) {
        var rect = rects[i];
        rect.setPos(Math.random() * banner.offsetWidth, Math.random() * banner.offsetHeight);
    }
}