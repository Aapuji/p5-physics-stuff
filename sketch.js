let object;
let bob;
const GRAVITY = 0.31;
const worldObjects = [];

function setup() {
  createCanvas(400, 400);
  console.log('HEIGHT: ' + height);
  object = new PhysicsEntity(10, 10, 50, 50, {vx: 10, mass: 100});
  bob = new PhysicsEntity(100, 20, 25, 25, {mass: 10});
  worldObjects.push(object, bob);
  
}

function draw() {
  background(220);
  object.updatePos();
  bob.updatePos()
}

class PhysicsEntity {
  constructor(x, y, height, width, obj = {}) {
    this.height = height;
    this.width = width;
    
    this.mass = obj.mass ? obj.mass : this.width * this.height;
    
    this.x = x;
    this.y = y;
    this.vx = obj.vx ? obj.vx : 0;
    this.vy = obj.vy ? obj.vy : 0;
    this.ax = obj.ax ? obj.ax : 0;
    this.ay = obj.ay ? obj.ay : GRAVITY;
    
    this.DAMPING = obj.damping ? obj.damping : 0.8;
  
    // Calculations
    this.force = 1;
    
    // Collision
    this.collision = true;
  }
  
  updatePos() {
    rect(this.x, this.y, this.width, this.height);
    this.updateVals();
  }
  
  updateVals() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx += this.ax;
    this.vy += this.ay;
    this.checkBorderCollision();
    this.checkObjectCollision(worldObjects);
  }
  
  checkBorderCollision() {
    // Top and Bottom
    if (this.y + this.height >= height) {
      this.y = height - this.height;
      this.ay = GRAVITY;
      this.vy = -this.vy * (1 - this.DAMPING);
      this.vx *= (1 - this.DAMPING);
    } else if (this.y <= 0) {
      this.y = 0;
      this.ay = GRAVITY;
      this.vy = -this.vy * (1 - this.DAMPING);
      this.vx *= (1 - this.DAMPING) * 2;
    }
    // Left and Right
    if (this.x <= 0) {
      this.x = 0;
      this.ax = 0;
      this.vx = -this.vx * (1 - this.DAMPING);
    } else if (this.x + this.width >= width) {
      this.x = width - this.width;
      this.ax = 0;
      this.vx = -this.vx * (1 - this.DAMPING);
    }
  }
  
  checkObjectCollision(others) {
    for (let other of others) {  
      if (other !== this &&
          this.x <= other.x + other.width && 
          other.x <= this.x + this.width && 
          this.y <= other.y + other.height &&
          other.y <= this.y + this.height
         ) {
        this.changeV(other);
      }
    }
  }
  
  changeV(other) {
    this.vx = ((this.mass - other.mass) * this.vx + 2 * other.mass * other.vx) / (this.mass + other.mass);
    this.vy = -((this.mass - other.mass) * this.vy + 2 * other.mass * other.vy) / (this.mass + other.mass);
  }
}
