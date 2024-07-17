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
    }

    render(canvas, loop=true, glow=false) { //abstract
        
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
        this.x += this.xVel * Rectangle.velMultiplier;
        this.y += this.yVel * Rectangle.velMultiplier;
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