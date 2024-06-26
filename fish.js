class Fish  {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = 15;
    this.speed = 5;

    this.dx = 0;
    this.dy = 0;

    this.waterFriction = 0.96;
    this.stamina = 200;
    this.color = random(15, 60);
    this.saturation = 100;
    this.offset = floor(random(0, this.stamina-1));
    this.noMove = false;

    this.name = "";
  }

  drawSelf() {
    //no outline 
    noStroke(); 
    //get direction fish is facing 
    var angle = atan2(this.dy, this.dx); 
    //transform the fish to face the right direction 
    push(); 
    translate(this.x, this.y); 
    rotate(angle); 
    //draw an ellipse and triangle to represent the fish 
    fill(this.color, this.saturation, 100); 
    ellipse(0, 0, this.size * 1.25 * (this.speed / 5), this.size); 
    triangle(-this.size/2 * (this.speed / 5), 0, -this.size  * (this.speed / 5), -this.size/3, -this.size  * (this.speed / 5), this.size/3); 
    fill(0);
    ellipse(this.size/3 * (this.speed / 5), 0, this.size/4, this.size/4) 
    pop(); 
    //end transformation
  }

  mutate() {
    this.size *= 1 - (random(-2, 2)/10);
    this.speed *= 1 - (random(-2, 2)/10);
    this.stamina *= 1 - (random(-2, 2)/10);
    this.stamina = floor(this.stamina)
  }

  move() {
    if (frameCount % this.stamina == this.offset) {
      var vel_angle = random(0, 360);
      this.dx = cos(vel_angle) * this.speed;
      this.dy = sin(vel_angle) * this.speed;
    }

    if (this.x + this.dx < 0 || this.x + this.dx > width) {
      this.dx *= -1
    }

    if (this.y + this.dy < 0 || this.y + this.dy > height) {
      this.dy *= -1
    }

    for (var wall of walllist) {
      if (((this.y+this.dy - (wall.a * (this.x + this.dx) + wall.b)) / (this.y - (wall.a * (this.x) + wall.b)) <= 0 && ((wall.x1 <= this.x && wall.x2 >= this.x) || (wall.x2 <= this.x && wall.x1 >= this.x) )) || this.y + this.dy == (wall.a * this.x+this.dx) + wall.b) {
        var thisangle = atan2(this.dy, this.dx)
        var newAngle = 2 * atan2(wall.y2-wall.y1,wall.x2-wall.x1) - thisangle;
        var currentSpeed = sqrt(this.dx**2 + this.dy**2)
        this.dy = sin(newAngle) * currentSpeed;
        this.dx = cos(newAngle) * currentSpeed;
        break
      } else if (wall.x1 == wall.x2 && (this.x + this.dx - wall.x1) / (this.x - wall.x1) <=0) {
        var thisangle = atan2(this.dy, this.dx)
        var newAngle = PI - thisangle;
        var currentSpeed = sqrt(this.dx**2 + this.dy**2)
        this.dy = sin(newAngle) * currentSpeed;
        this.dx = cos(newAngle) * currentSpeed;
        break
      }
    }

    for (var circle of circlelist) {
      if ((dist(this.x + this.dx, this.y + this.dy, circle.x, circle.y) - circle.r) / (dist(this.x,this.y,circle.x,circle.y)-circle.r) <= 0) {
        var thisangle = atan2(this.dy, this.dx)
        var newAngle = 2 * atan2(circle.y-this.y,circle.x-this.x) - thisangle - PI;
        var currentSpeed = sqrt(this.dx**2 + this.dy**2)
        this.dy = sin(newAngle) * currentSpeed;
        this.dx = cos(newAngle) * currentSpeed;
        break
      }
    }

    this.x += this.dx;
    this.y += this.dy;

    this.dx *= this.waterFriction;
    this.dy *= this.waterFriction;
  }
}

class Wall {
  constructor(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.a = (y2 - y1) / (x2 - x1);
    this.b = y1 - this.a * x1;

    this.color = random(0,100);
  }

  drawSelf() {
    push();
    colorMode(HSB, 100)
    stroke(this.color,100,100);
    strokeWeight(2)
    line(this.x1, this.y1, this.x2, this.y2)
    pop();
  }
}

class Circle {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  drawSelf() {
    push();
    noFill();
    strokeWeight(2);
    stroke(0,0,0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
    pop();
  }
}
