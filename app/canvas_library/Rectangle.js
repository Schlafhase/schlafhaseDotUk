// This code is outdated.
// I stopped updating it, because I realised that I don't need this.

class Rectangle {
    constructor(x, y, width, height, color, alpha,  xVel = 0, yVel = 0, rotVel = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = alpha;
        this.angle = 0;
        this.xVel = xVel;
        this.yVel = yVel;
        this.rotVel = rotVel;
    }

    render(canvas, loop=true) {
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x+this.width/2, this.y+this.height/2 );
        ctx.rotate(this.angle * Math.PI / 180)
        ctx.fillRect(-(this.width/2), -(this.height/2), this.width, this.height)
        if (loop) {
            if (this.x - Math.min(this.width, this.height) > canvas.width) {
                this.x = -Math.max(this.width, this.height);
            }
            if (this.x + Math.min(this.width, this.height) < 0) {
                this.x = canvas.width + Math.max(this.width, this.height);
            }
            if (this.y > canvas.height) {
                this.y = -Math.max(this.width, this.height);
            }
            if (this.y < 0) {
                this.y = canvas.height - Math.max(this.width, this.height);
            }
        }
    }

    move (x, y) {
        this.x += x;
        this.y += y;
    }

    rotate (angle) {
        this.angle += angle;
    }

    applyVelocity() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.angle += this.rotVel
    }
}