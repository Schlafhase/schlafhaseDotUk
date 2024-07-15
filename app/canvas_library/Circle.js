class Circle {
    static velMultiplier = 1;
    constructor(radius, x, y, color, alpha, xVel = 0, yVel = 0) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.xVel = xVel;
        this.yVel = yVel;
    }

    render(canvas, loop=true) {
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        if (loop) {
            if (this.x - this.radius > canvas.width) {
                this.x = -this.radius;
            }
            if (this.x + this.radius < 0) {
                this.x = canvas.width + this.radius
            }
            if (this.y - this.radius > canvas.height) {
                this.y = -this.radius;
            }
            if (this.y + this.radius < 0) {
                this.y = canvas.height + this.radius;
            }
        }
    }

    move (x, y) {
        this.x += x;
        this.y += y;
    }

    applyVelocity() {
        this.x += this.xVel * Circle.velMultiplier;
        this.y += this.yVel * Circle.velMultiplier;
    }

    static setVelMultiplier(newVelMultiplier) {
        Circle.velMultiplier = newVelMultiplier;
    }

    static updateVelMultiplier() {
        if (Circle.velMultiplier > 1) {
            Circle.velMultiplier = Circle.velMultiplier * 0.95;
        }
        else if (Circle.velMultiplier != 1) {
            Circle.velMultiplier = 1;
        }
    }
}