class OptimisedCircle {
    static velMultiplier = 1;
    constructor(canvas, radius, x, y, color, alpha, glow=false, xVel = 0, yVel = 0) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.xVel = xVel;
        this.yVel = yVel;
        this.glow = glow;
        this.canvas = canvas;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.glow) {
            ctx.shadowBlur = 50;
            ctx.shadowColor = this.color;
        }
        else {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        }
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.radius+50, this.radius+50, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        this.image = new Image();
        this.image.src = canvas.toDataURL();
    }

    render(loop=true) {
        var ctx = this.canvas.getContext("2d");
        ctx.drawImage(this.image, this.x-this.radius-50, this.y-this.radius-50);
        if (loop) {
            if (this.x - this.radius > this.canvas.width) {
                this.x = -this.radius;
            }
            if (this.x + this.radius < 0) {
                this.x = this.canvas.width + this.radius
            }
            if (this.y - this.radius > this.canvas.height) {
                this.y = -this.radius;
            }
            if (this.y + this.radius < 0) {
                this.y = this.canvas.height + this.radius;
            }
        }
    }

    move (x, y) {
        this.x += x;
        this.y += y;
    }

    applyVelocity() {
        this.x += this.xVel * OptimisedCircle.velMultiplier;
        this.y += this.yVel * OptimisedCircle.velMultiplier;
    }

    static setVelMultiplier(newVelMultiplier) {
        OptimisedCircle.velMultiplier = newVelMultiplier;
    }

    static updateVelMultiplier() {
        if (OptimisedCircle.velMultiplier > 1) {
            OptimisedCircle.velMultiplier = OptimisedCircle.velMultiplier * 0.95;
        }
        else if (OptimisedCircle.velMultiplier != 1) {
            OptimisedCircle.velMultiplier = 1;
        }
    }
}