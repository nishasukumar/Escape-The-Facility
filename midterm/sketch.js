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

var notes = []
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
  pianoTiles: {49:true},
  bookTiles: {16:true}
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

  for (let i = 0; i < notes.length; i++) {
    notes[i].display()
    let tooSmall = notes[i].move()
    if (tooSmall) { //if true then delete particle from array
      notes.splice(i,1)
      i--
    }
  }
}

function keyPressed(){
  if(theGame.keyPressed()){
    var note = new MusicNote(key);
    notes.push(note)
    console.log("added")
  }
}

//C G A F E D 
//Keyboard:Note - D:C, F:D, G:E, H:F, J:G, K:A, L:B
//C:60, D:62, E:64, F:65, G:67, A:69, B:71, C:72
class Game1 {
  constructor(){
    this.world = theWorld;
    this.player = thePlayer;
    this.osc = new p5.SinOsc();
    this.envelope = new p5.Envelope();
    this.fft;
    this.scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
    this.note = 0;
    this.playing = false;
  }

  draw() {
    if(thePlayer.bookInteract()){
      fill(255)
      rect(thePlayer.x, thePlayer.y + 60, 150, 60)
      fill(0)
      textSize(10)
      text("C C G G A A G F F E E D D C ", thePlayer.x + 10, thePlayer.y + 80,)
      text("G G F F E E D G G F F E E D ", thePlayer.x + 10, thePlayer.y + 95,)
      text("C C G G A A G F F E E D D C ", thePlayer.x + 10, thePlayer.y + 110,)
    }
  }

  keyPressed() {
    // set attackTime, decayTime, sustainRatio, releaseTime
    this.envelope.setADSR(0.001, 0.5, 0.1, 0.5);

    // set attackLevel, releaseLevel
    this.envelope.setRange(1, 0);

    if(thePlayer.pianoInteract() && (key == 'F' || key == 'f' || key == 'T' || key == 't'||key == 'G' || 
      key == 'g'||key == 'H' || key == 'h'|| key == 'J' || key == 'j' || key == 'I' || key == 'i' || 
      key == 'K' || key == 'k' || key == 'L' || key == 'l')){

      if ((key == 'F' || key == 'f')) {
        console.log("C")
        this.osc.stop();
        var midiValue = this.scaleArray[0];
      }
      if ((key == 'T' || key == 't')) {
        console.log("D")
        this.osc.stop();
        var midiValue = this.scaleArray[1];
      }
      if ((key == 'G' || key == 'g')) {
        console.log("E")
        this.osc.stop();
        var midiValue = this.scaleArray[2];
      }
      if ((key == 'H' || key == 'h')) {
        console.log("F")
        this.osc.stop();
        var midiValue = this.scaleArray[3];
      }
      if (key == 'J' || key == 'j') {
        console.log("G")
        this.osc.stop();
        var midiValue = this.scaleArray[4];
      }
      if (key == 'I' || key == 'i') {
        console.log("A")
        this.osc.stop();
        var midiValue = this.scaleArray[5];
      }
      if (key == 'K' || key == 'k') {
        console.log("B")
        this.osc.stop();
        var midiValue = this.scaleArray[6];
      }
      if (key == 'L' || key == 'l') {
        console.log("C")
        this.osc.stop();
        var midiValue = this.scaleArray[7];
      }

      if (midiValue) {
        console.log(key, midiValue)

        this.osc.start();
        var freqValue = midiToFreq(midiValue);
        this.osc.freq(freqValue);

        this.envelope.play(this.osc, 0, 0.1);
        this.note = (this.note + 1) % this.scaleArray.length;
      }
      return true;
    }

    return false;
  }
}

class MusicNote {
  constructor(key){
    this.x = thePlayer.x;
    this.y = thePlayer.y;
    this.key = key;
    this.noiseOffsetX = random(0,1000);
  }

  display(){
    fill(255)
    textSize(25)
    if ((this.key == 'F' || this.key == 'f')) {
      text("C", this.x, this.y)
    }
    if ((this.key == 'T' || this.key == 't')) {
      text("D", this.x, this.y)
    }
    if ((this.key == 'G' || this.key == 'g')) {
      text("E", this.x, this.y)
    }
    if ((this.key == 'H' || this.key == 'h')) {
      text("F", this.x, this.y)
    }
    if (this.key == 'J' || this.key == 'j') {
      text("G", this.x, this.y)
    }
    if (this.key == 'I' || this.key == 'i') {
      text("A", this.x, this.y)
    }
    if (this.key == 'K' || this.key == 'k') {
      text("B", this.x, this.y)
    }
    if (this.key == 'L' || this.key == 'l') {
      text("C", this.x, this.y)
    }
  }

  move(){
    this. y += map(noise(this.noiseOffsetX), 0, 1, -1, -0.5);
    this. x += map(noise(this.noiseOffsetX), 0, 1, 0.5, 1);

    this.noiseOffsetX += 0.01;

    if(this.y <= 0){
      return true
    }

    return false

  }
}