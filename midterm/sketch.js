// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;
var ref;

// our user controlled character object - see Player.js for more information
var thePlayer;

var theGame;
// create an object to hold our "world parameters" - we will send this object into our 
// OverheadWorld to tell it how our world is organized
var worldParameters = {
  tileSize: 50,
  tileFolder: 'labTiles',
  numTiles: 57,
  tileMap: [
    [51, 15, 17, 19, 49, 50, 38, 40, 21, 51],
    [52, 16, 18, 20,  0,  0, 39, 41, 22, 52],
    [52,  0,  0,  0,  0,  0,  0,  0,  0, 52],
    [52,  0,  0,  0,  0,  0,  0,  0,  0, 52],
    [52,  0,  0,  0,  0,  0,  0,  0,  0, 52],
    [52,  0,  0,  0,  0,  0,  0,  0,  0, 52],
    [52, 54, 55,  0,  0,  0,  0,  0,  0, 52],
    [52, 56,  0,  0,  0,  0,  0,  0,  0, 52],
    [52,  0,  0,  0,  0,  0,  0,  0,  0, 52],
    [53, 53, 53,  53, 0,  0, 53, 53, 53, 53]
  ],
  solidTiles: {15:true, 16:true, 17:true, 18:true, 19:true, 20:true,
    38:true, 39:true, 40:true, 41:true, 21:true, 22:true, 49:true, 50:true,
    51:true, 52:true, 53:true, 54:true, 55:true, 56:true},
  pianoTiles: {49:true}
};

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  theWorld = new OverheadWorld(worldParameters);
  thePlayer = new Player(100, 100, theWorld);
  // theGame = new Game1(theWorld, thePlayer);
}

function setup() {
  ref = createCanvas(500, 500)
  ref.style('display', 'block')
  ref.style('margin', 'auto')
  ref.parent("#gamespace")
  theGame = new Game1();
}

function draw() {
  theWorld.displayWorld()
  thePlayer.move();
  thePlayer.pianoInteract();
  thePlayer.display();
  theGame.draw();
  // theGame.mousePressed();
  theGame.keyPressed();
}

class Game1 {
  constructor(){
    this.world = theWorld;
    this.player = thePlayer;
    // var tile = world.getTile(this.player.top[0], this.player.top[1]);
    this.osc, this.envelope, this.fft;
    //C G A F E D 
    //Keyboard:Note - D:C, F:D, G:E, H:F, J:G, K:A, L:B
    //C:60, D:62, E:64, F:65, G:67, A:69, B:71, C:72
    this.scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
    this.note = 0;
  }
  setup() {
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

  draw() {
    // if(keyIsPressed){
    //   console.log("working")
    // }
    console.log("work")
  }

  keyPressed() {
    this.osc = new p5.SinOsc();

    // Instantiate the envelope
    this.envelope = new p5.Envelope();

    // set attackTime, decayTime, sustainRatio, releaseTime
    this.envelope.setADSR(0.001, 0.5, 0.1, 0.5);

    // set attackLevel, releaseLevel
    this.envelope.setRange(1, 0);

    console.log("working")
    if(thePlayer.pianoInteract()){
      console.log("play")

      if (key == 'G' || key == 'g') {
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