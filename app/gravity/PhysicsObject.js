class PhysicsObject {
  constructor(x, y, xVel, yVel, mass, name = "Point Mass", orbitColor = "lime") {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.mass = mass;
    this.name = name;
    this.orbitPoints = [];
    this.traceOrbit = false;
    this.traceQuality = 20;
    this.orbitRelativeTo = "coordinate system";
    this.id = crypto.randomUUID();
    this.orbitColor = orbitColor;
    this.phData = new PhysicsData(0, 0, 0);
  }

  applyVelocity(stepSize = 1) {
    this.x += this.xVel * stepSize;
    this.y += this.yVel * stepSize;
  }
}

class Physics {
  static gravityConstant = 0.1;

  static applyGravity(phObject1, phObject2, stepSize = 1) {
    var distance = Math.sqrt(Math.pow(phObject2.x - phObject1.x, 2) + Math.pow(phObject2.y - phObject1.y, 2));
    distance = distance < 10 ? 10 : distance;
    var force = (Physics.gravityConstant * phObject1.mass * phObject2.mass) / Math.pow(distance, 2);
    var angle = Math.atan2((phObject2.y - phObject1.y), (phObject2.x - phObject1.x));
    Physics.applyForceAtAngle(phObject2, force, angle, stepSize);
    return new PhysicsData(force, angle);
  }

  static applyForceAtAngle(phObject, force, angle, stepSize = 1) {
    phObject.xVel -= ((force * Math.cos(angle)) / phObject.mass) * stepSize;
    phObject.yVel -= ((force * Math.sin(angle)) / phObject.mass) * stepSize;
  }
}

class PhysicsData {
  constructor(force, angle, distance) {
    this.force = force;
    this.angle = angle;
  }

  reset() {
    this.force = 0;
    this.angle = 0;
  }

  add(phData2) {
    var [x, y] = this.toVector();
    var [x2, y2] = phData2.toVector();
    var xr = x + x2;
    var yr = y + y2;
    var rForce = Math.sqrt(xr * xr + yr * yr);
    var rAngle = Math.atan2(yr, xr);
    this.force = rForce;
    this.angle = rAngle;
  }

  toVector() {
    return [Math.cos(this.angle) * this.force, Math.sin(this.angle) * this.force];
  }
}
