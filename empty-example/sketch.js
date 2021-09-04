var song;
var fft;
//keep track of the particles by using array
let particles = [];

function preload() {
  song = loadSound('../hideaway(Mitch).mp3');
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  //Instead of making the lines sharp and 'boxy', change the anglemode to degrees to make it 
  // more curvy
  angleMode(DEGREES);
  fft = new p5.FFT();
}

function draw() {
  // put drawing code here
  background(0);
  stroke(255);
  strokeWeight(.5);
  noFill();

  translate(width / 2, height /2);

  //help react to the bets
  fft.analyze();
  amp = fft.getEnergy(20, 200);

  let wave = fft.waveform();
  
  for (let j = -1; j <= 1; j += 2){

    beginShape();

    //replace 180 with 'width' on the next 2 lines to create a straight line
    for (let i = 0; i <= 180; i++) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1));

      let radius = map(wave[index], -1, 1, 150, 350)

      //straight line
      // let x = i;
      // let y = wave[index] * 300 + height /2;
      let x = radius * sin(i) * j;
      let y = radius * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  let particle = new Particle();
  particles.push(particle);

  for (let i = particles.length - 1; i >= 0 ; i--) {
    if (!particles[i].edges()){
      //depending of the amp, it eacts to the beats
      particles[i].update(amp > 200);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }

  // //the other half of the circle (change the cosine and sin to a negative)
  // beginShape();
  // //replace 180 with 'width' on the next two lines
  // for (let i = 0; i <= 180; i++) {
  //   let index = floor(map(i, 0, 180, 0, wave.length - 1));

  //   let radius = map(wave[index], -1, 1, 150, 350)

  //   //straight line
  //   // let x = i;
  //   // let y = wave[index] * 300 + height /2;
  //   let x = radius * -sin(i);
  //   let y = radius * -cos(i);
  //   vertex(x, y);
  // }
  // endShape();
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    //define a position using the vector.random2D method in p5
    this.position = p5.Vector.random2D().mult(250);
    //starting velocity
    this.velocity = createVector(0, 0);
    //allows the partile t ospeed up
    this.acceleration = this.position.copy().mult(random(0.0001, 0.00001))

    this.width = random(3, 5);

    this.color = [random(200, 255), random(200, 255), random(200, 255)]
  }

  //method to get rid of the particle after leaving thescreen
  edges() {
    if (this.position.x < -width / 2 || this.position.x > width / 2 || this.position.y < -height / 2 || this.position.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }

  update(condition) {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (condition) {
      this.position.add(this.velocity);
      this.position.add(this.velocity);
      this.position.add(this.velocity);
    }
  }

  //this method allows the particle to show on the screen
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.width)
  }
}