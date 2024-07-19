var depatureTime = new Date("2024-08-04");
var arrivalTime = new Date("2024-08-04");
var countdown = document.getElementById("countdown");
var background = document.getElementById("bg");

setInterval(updateCountdown, 10);
fitBg();
window.addEventListener("resize", fitBg);

function updateCountdown() {
    var utcNow = new Date();
    var difference = new Date(depatureTime.getTime() - utcNow.getTime())
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor(difference % (1000));
    countdown.innerHTML = `${days}:${expandNumber(hours, 2)}:${expandNumber(minutes, 2)}:${expandNumber(seconds, 2)}:${expandNumber(milliseconds, 3)}`;
}

function expandNumber(num, digits) {
    var count = digits - num.toString().length;
    if (count < 1) {
        return num.toString();
    }
    else {
        var result = "0".repeat(count) + num.toString();
        return result;
    }
}

function fitBg() {
    var bgAspectRatio = 630/450;
    var windowAspectRatio = window.innerWidth/window.innerHeight;
    if (windowAspectRatio > bgAspectRatio) {
        background.style.height = "";
        background.style.top = "";
        background.style.right = "";
        background.style.width = window.innerWidth * 1.2 + "px";
        background.style["bottom"] = -window.innerHeight/7 + "px";
    }
    else {
        background.style.width = "";
        background.style.bottom = "";
        background.style.height = window.innerHeight * 1.2 + "px";
        background.style.top = "0px";
        background.style.right = -window.innerWidth/5 + "px";
    }
}