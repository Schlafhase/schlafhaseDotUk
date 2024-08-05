var departureTime = new Date(Date.UTC(2024, 7, 4, 18, 10));
// depatureTime = new Date("2024-07-20 14:00");
var arrivalTime = new Date(Date.UTC(2024, 7, 5, 13, 15));
var istArrivalTime = new Date(Date.UTC(2024, 7, 4, 20, 30));
var istDepartureTime = new Date(Date.UTC(2024, 7, 5, 2, 45));
var countdown = document.getElementById("countdown");
var background = document.getElementById("bg");

const plane = document.getElementById("plane");
const countDownInterval = setInterval(updateCountdown, 1);
var timeLineInterval = undefined;
fitBg();
window.addEventListener("resize", fitBg);

function updateCountdown() {
    var utcNow = new Date();
    var difference = new Date(departureTime.getTime() - utcNow.getTime())
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor(difference % (1000));
    countdown.innerHTML = `${expandNumber(days, 2)}:${expandNumber(hours, 2)}:${expandNumber(minutes, 2)}:${expandNumber(seconds, 2)}:${expandNumber(milliseconds, 3)}`;
    if (difference < 0) {
        clearInterval(countDownInterval);
        document.getElementById("label").style.display = "none";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("timeDescription").style.display = "none";
        document.getElementById("flightTimeLine").style.display = "inline";
        timeLineInterval = setInterval(updateFlightTimeLine, 10);
    }
}

function updateFlightTimeLine() {
    var percentage = 0
    var now = new Date()
    if (now.getTime() > istArrivalTime.getTime() && now.getTime() < istDepartureTime.getTime()) {
        plane.setAttribute("x", "58.5px");
        return;
    }
    else if (now.getTime() < istArrivalTime.getTime()) {
        percentage = 1 - (istArrivalTime.getTime() - now.getTime())/(istArrivalTime.getTime() - departureTime.getTime())
        console.log(percentage);
        plane.setAttribute("x", (percentage*30)+28.5 + "px");
        return;
    }
    else {
        percentage = 1 - (arrivalTime.getTime() - now.getTime())/(arrivalTime.getTime() - istDepartureTime.getTime())
        console.log(percentage);
        if (percentage > 1) {
            percentage = 1;
            document.getElementById("arrival").style.display = "block";
            clearInterval(timeLineInterval);
        }
        plane.setAttribute("x", (percentage*102)+58.5 + "px");
    }

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