var song;
var fft;

function preload() {
  song = loadSound('../hideaway(Mitch).mp3');
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  // put drawing code here
  background(0);
  stroke(255);
  noFill();

  let wave = fft.waveform();

  beginShape();
  for (let i = 0; i < width; i++) {
    let index = floor(map(i, 0, width, 0, wave.length));

    let x = i;
    let y = wave[index] * 300 + height /2;
    vertex(x, y);
  }
  endShape();
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