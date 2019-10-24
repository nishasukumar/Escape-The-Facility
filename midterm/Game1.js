/* adapted from the p5 sound example library */
function Game1 (world, player){
  this.world = world;
  this.player = player;
  // var tile = world.getTile(this.player.top[0], this.player.top[1]);
  this.osc, this.envelope, this.fft;
  //C G A F E D 
  //Keyboard:Note - D:C, F:D, G:E, H:F, J:G, K:A, L:B
  //C:60, D:62, E:64, F:65, G:67, A:69, B:71, C:72
  this.scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
  this.note = 0;

  function setup() {
    //createCanvas(800, 200);
    this.osc = new p5.SinOsc();

    // Instantiate the envelope
    this.envelope = new p5.Envelope();

    // set attackTime, decayTime, sustainRatio, releaseTime
    this.envelope.setADSR(0.001, 0.5, 0.1, 0.5);

    // set attackLevel, releaseLevel
    this.envelope.setRange(1, 0);

    //fill(255);
  }

  this.draw = function() {
    // if(keyIsPressed){
    //   console.log("working")
    // }
  }

  this.keyPressed = function() {
    this.osc = new p5.SinOsc();
    this.envelope = new p5.Envelope();
    this.envelope.setADSR(0.001, 0.5, 0.1, 0.5);
    this.envelope.setRange(1, 0);
    console.log("working")
    if(player.pianoInteract()){
      console.log("play")

      if (keyIsDown(71)) {
        console.log("G")
        this.osc.stop();
        var midiValue = this.scaleArray[0];
        // rect(0,0,100,200);
      }
      // if (keyCode == LEFT_ARROW) {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[1];
      //   // rect(100,0,100,200);
      // }
      // if (keyCode == DOWN_ARROW) {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[2];
      //   // rect(200,0,100,200);
      // }
      // if (keyCode == RIGHT_ARROW) {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[3];
      //   // rect(300,0,100,200);
      // }
      // if (key == 'W' || key == 'w') {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[4];
      //   // rect(400,0,100,200);
      // }
      // if (key == 'A' || key == 'a') {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[5];
      //   // rect(500,0,100,200);
      // }
      // if (key == 'S' || key == 's') {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[6];
      //   // rect(600,0,100,200);
      // }
      // if (key == 'D' || key == 'd') {
      //   this.osc.stop();
      //   var midiValue = this.scaleArray[7];
      //   // rect(700,0,100,200);
      // }


      if (midiValue) {
        console.log(key, midiValue)

        this.osc.start();
        var freqValue = midiToFreq(midiValue);
        this.osc.freq(freqValue);

        this.envelope.play(this.osc, 0, 0.1);
        this.note = (this.note + 1) % this.scaleArray.length;
      }
    }
  }
}