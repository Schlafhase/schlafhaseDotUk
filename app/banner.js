var banner = document.getElementById("headerBanner");
var title = document.getElementById("title");

var colors = ["green", "yellow", "magenta", "pink", "red", "orange", "blue", "lightblue", "lime"]
var circles = [];
for (var i = 0; i<50;i++) {
    circles.push(new Circle((Math.random() * 500) + 50, Math.random()* parseInt(banner.offsetWidth), Math.random() * parseInt(banner.offsetHeight), colors[Math.round(Math.random()*colors.length)], Math.random()/2, Math.random()*2-1, Math.random()*2-1));
}


 setInterval(updateCanvas, 30);
document.addEventListener("scroll", scrollEventHandler)

function updateCanvas() {
    banner.width = parseInt(banner.offsetWidth);
    banner.height = parseInt(banner.offsetHeight);
    var ctx = banner.getContext("2d");
    for (var i = 0; i<circles.length; i++) {
        var circle = circles[i];
        circle.applyVelocity();
        circle.render(banner);
    }
    Circle.updateVelMultiplier();
    title.style.opacity = 1 - (document.documentElement.scrollTop/300);
    // circle1.applyVelocity();
    // circle1.render(banner);
    // circle2.applyVelocity();
    // circle2.render(banner);
}

function scrollEventHandler() {
    Circle.setVelMultiplier(10);
}