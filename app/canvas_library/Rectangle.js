class Rectangle {
    static velMultiplier = 1;
    constructor(x, y, width, height, color, alpha,  xVel = 0, yVel = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = alpha;
        this.angle = 0;
        this.xVel = xVel;
        this.yVel = yVel;
        this.class = Rectangle;
    }

    render(canvas, loop=true, glow=false) {
        var ctx = canvas.getContext("2d");
        if (glow) {
            ctx.shadowBlur = 50;
            ctx.shadowColor = this.color;
        }
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (loop) {
            if (this.x - this.width - 50 > canvas.width) {
                this.x = -this.width
            }
            if (this.x + this.width + 50 < 0) {
                this.x = canvas.width + this.width;
            }
            if (this.y - 50> canvas.height) {
                this.y = -this.height - 50;
            }
            if (this.y + this.height + 50 < 0) {
                this.y = canvas.height + 50;
            }
        }
    }

    setPos (x, y) {
        this.x = x;
        this.y = y;
    }

    move (x, y) {
        this.x += x;
        this.y += y;
    }

    rotate (angle) {
        this.angle += angle;
    }

    applyVelocity() {
        this.x += this.xVel * this.class.velMultiplier;
        this.y += this.yVel * this.class.velMultiplier;
        this.angle += this.rotVel;
    }

    static setVelMultiplier(newVelMultiplier) {
        Rectangle.velMultiplier = newVelMultiplier;
    }

    static updateVelMultiplier() {
        if (Rectangle.velMultiplier > 1) {
            Rectangle.velMultiplier = Rectangle.velMultiplier * 0.95;
        }
        else if (Rectangle.velMultiplier != 1) {
            Rectangle.velMultiplier = 1;
        }
    }
}