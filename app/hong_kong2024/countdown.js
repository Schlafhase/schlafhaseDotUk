var depatureTime = new Date("2024-08-04");
var arrivalTime = new Date("2024-08-04");
var countdown = document.getElementById("countdown");
var background = document.getElementById("bg");

setInterval(updateCountdown, 10);
fitBg();

function updateCountdown() {
    var utcNow = new Date();
    var difference = new Date(depatureTime.getTime() - utcNow.getTime())
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor(difference % (1000));
    countdown.innerHTML = `${days}:${hours}:${minutes}:${seconds}:${milliseconds}`;
}

function fitBg() {
    var bgAspectRatio = 630/450;
    var windowAspectRatio = window.innerWidth/window.innerHeight;
    if (windowAspectRatio > bgAspectRatio) {
        background.style.width = window.innerWidth + "px";
    }
    else {
        background.style.height = window.innerHeight + "px";
    }
}