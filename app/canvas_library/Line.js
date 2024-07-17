class Line {
    static velMultiplier = 1;
    constructor(x, y, x2, y2, width, color, alpha,  xVel = 0, yVel = 0) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.color = color;
        this.alpha = alpha;
        this.angle = 0;
        this.xVel = xVel;
        this.yVel = yVel;
    }

    render(canvas, loop=true, glow=false) {
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    setPos (x, y) {
        this.x = x;
        this.y = y;
    }

    move (x, y) {
        this.x += x;
        this.y += y;
    }

    applyVelocity() {
        this.x += this.xVel * Line.velMultiplier;
        this.y += this.yVel * Line.velMultiplier;
        this.angle += this.rotVel;
    }

    static setVelMultiplier(newVelMultiplier) {
        Line.velMultiplier = newVelMultiplier;
    }

    static updateVelMultiplier() {
        if (Line.velMultiplier > 1) {
            Line.velMultiplier = Line.velMultiplier * 0.95;
        }
        else if (Line.velMultiplier != 1) {
            Line.velMultiplier = 1;
        }
    }
}