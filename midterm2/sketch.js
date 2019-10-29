// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;
var ref;
//var personLeft;
// our user controlled character object - see Player.js for more information
var thePlayer;
var theGame;
var notes = []
var pass = 0
var begSeq1
var begSeq2
var begSeq3
var currentImage
var endSeq

var begSequence = 0;
// create an object to hold our "world parameters" - we will send this object into our 
// OverheadWorld to tell it how our world is organized
var worldParameters = {
  tileSize: 50,
  tileFolder: 'labTiles',
  numTiles: 71,
  solidTiles: {1:true, 2:true, 3:true, 8:true, 9:true, 15:true, 16:true, 17:true, 18:true, 19:true, 20:true, 33:true, 34:true,
    35:true, 38:true, 39:true, 40:true, 41:true, 21:true, 22:true, 47:true, 48:true, 49:true, 50:true,
    51:true, 52:true, 53:true, 54:true, 55:true, 56:true, 59:true, 60:true, 61:true, 62:true, 63:true},
  pianoTiles: {59:true, 60:true},
  poemTiles: {48:true, 47:true},
  bookTiles1: {61:true},
  bookTiles2: {62:true},
  bookTiles3: {63:true},
  canvasTiles: {0:true},
};

// room data - loaded in from an external file (see 'data/rooms.json')
var roomData;

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  
  // load in room data
  roomData = loadJSON("data/rooms.json");
  
  // create our world
  theWorld = new OverheadWorld(worldParameters);
  
  // create our player
  thePlayer = new Player(100, 100, theWorld);

  begSeq1 = loadImage('begSeq1.png')
  begSeq2 = loadImage('begSeq2.png')
  begSeq3 = loadImage('begSeq3.png')
  endSeq = loadImage('endSeq.png')
  //personLeft = loadImage('player/tile005.png');
}

function setup() {
  ref = createCanvas(500, 500)
  ref.style('display', 'block')
  ref.style('margin', 'auto')
  ref.parent("#gamespace")
  
  // now that everything is fully loaded send over the room data to our world object
  // also let the world know which room we should start with
  theWorld.setupRooms( roomData, "start" );
  theGame = new Game1();
  game2 = new Game2();
  game3 = new Game3();
  currentImage = begSeq1
}

function allDone(worldData) {
  console.log("here");
}

function badStuffHappened(result) {
  console.log(result);
}

function draw() {
  background(0)
  //console.log(theWorld.state)
  theWorld.displayWorld()

  if(theWorld.state == 3){
    game2.display();
  }

  thePlayer.move();
  //thePlayer.pianoInteract();
  thePlayer.display();
  console.log(pass)

  if(theWorld.state == 1){
    //console.log(thePlayer.x)
    if(pass == 0){
      //console.log(thePlayer.x)
      thePlayer.x = constrain(thePlayer.x, 0, 400)
    }
    theGame.draw();
  //image(personLeft, 400, 250);

    for (let i = 0; i < notes.length; i++) {
      notes[i].display()
      let tooSmall = notes[i].move()
      if (tooSmall) { //if true then delete particle from array
        notes.splice(i,1)
        i--
      }
    }
  }

  if(theWorld.state == 2){
    game3.draw();
    if(pass == 1){
      //console.log(thePlayer.x)
      thePlayer.y = constrain(thePlayer.y, 0, 450)
    }
  }

  if(theWorld.state == 1 && begSequence == 0){
    image(currentImage, 0,0)
  }

  if(pass == 3){
    image(endSeq,0,0)
  }
}

function keyPressed(){
  if(theWorld.state == 1){
    if(key == 'e' || key == 'E'){
      if(theGame.checkSong()){
        //console.log("complete")
        pass = 1
      }
    }
    if(theGame.keyPressed()){
      var note = new MusicNote(key);
      notes.push(note)
      console.log("added")
    }
  }
  if(theWorld.state == 3){
    game2.paint();
    if(key == "e" || key == "E"){
      if(game2.checkPainting()){
        console.log("true")
        pass = 3
      }
    }
  }
  if(theWorld.state == 1 && begSequence == 0){
    if(currentImage == begSeq1){
      currentImage = begSeq2
      //console.log(currentImage)
    }
    else if(currentImage == begSeq2){
      currentImage = begSeq3
    }
    else if(currentImage == begSeq3){
      begSequence = 1
    }
  }
}

function changeColor() {
  if(theWorld.state == 2){
    if(game3.checkPoem()){
      console.log("complete")
      pass = 2
    }
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
    this.playerSong = [];
  }

  draw() {
    if(thePlayer.bookInteract() == 1){
      fill(255)
      rect(thePlayer.x, thePlayer.y + 60, 150, 60)
      fill(0)
      textSize(10)
      text("C C G G A A G F F E E D D C ", thePlayer.x + 10, thePlayer.y + 80,)
      text("G G F F E E D G G F F E E D ", thePlayer.x + 10, thePlayer.y + 95,)
      text("C C G G A A G F F E E D D C ", thePlayer.x + 10, thePlayer.y + 110,)
    }
    if(thePlayer.bookInteract() == 2){
      fill(255)
      rect(thePlayer.x, thePlayer.y + 60, 150, 90)
      fill(0)
      textSize(10)
      text("keyboard keys - piano keys", thePlayer.x + 10, thePlayer.y + 80,)
      text("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0F - C\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0J - G", thePlayer.x + 10, thePlayer.y + 95,)
      text("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0T - D\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0I\xa0 - A", thePlayer.x + 10, thePlayer.y + 110,)
      text("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0G - E\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0K - B", thePlayer.x + 10, thePlayer.y + 125,)
      text("\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0H - F\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0L - C", thePlayer.x + 10, thePlayer.y + 140,)
    }
    if(thePlayer.bookInteract() == 3){
      fill(255)
      rect(thePlayer.x, thePlayer.y + 60, 150, 90)
      fill(0)
      textSize(10)
      text("press 'r' to ", thePlayer.x + 10, thePlayer.y + 80,)
      text("restart your recording", thePlayer.x + 10, thePlayer.y + 95,)
      text("press 'e' to enter", thePlayer.x + 10, thePlayer.y + 110,)
      text("your completed recording", thePlayer.x + 10, thePlayer.y + 125,)
    }
  }

  keyPressed() {
    // set attackTime, decayTime, sustainRatio, releaseTime
    this.envelope.setADSR(0.001, 0.5, 0.1, 0.5);

    // set attackLevel, releaseLevel
    this.envelope.setRange(1, 0);

    if(thePlayer.pianoInteract() && (key == 'F' || key == 'f' || key == 'T' || key == 't'||key == 'G' || 
      key == 'g'||key == 'H' || key == 'h'|| key == 'J' || key == 'j' || key == 'I' || key == 'i' || 
      key == 'K' || key == 'k' || key == 'L' || key == 'l' || key == 'r' || key == 'R')){

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
      this.playerSong.push(key)
      if (key == 'R' || key == 'r'){
        this.playerSong.splice(0, this.playerSong.length)
      }
      console.log(this.playerSong)
      return true;
    }

    return false;
  }

  checkSong(){
    var correct = ["f", "f", "j", "j", "i", "i", "j", "h", "h", "g", "g", "t", "t", "f", 
    "j", "j", "h", "h", "g", "g", "t", "j", "j", "h", "h", "g", "g", "t",
    "f", "f", "j", "j", "i", "i", "j", "h", "h", "g", "g", "t", "t", "f"]
    if(this.playerSong.length != correct.length){
      return false
    }
    for (var i = 0; i < correct.length; ++i) {
      if (correct[i] !== this.playerSong[i]){
        return false
      }
    }
    return true
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

class Game3{
  constructor(){

    //array of words
    this.words = ["symphony", "dismal", "summer", "whisper", "wind", "year","brutal",
            "fluttered", "sea", "breeze","darkness", "passing", "gone", "piercing",
            "abyss", "crumble", "silky", "throbbing", "electric", "supple", "sorrow",
            "tingle", "blood", "suffer", "grief", "nothing", "everything", "mother",
            "cry", "free", "chained", "forgotten", "mercy"];

    //choose which words they must use
    this.rand1 = int(random(0,33));
    this.rand2 = int(random(0,33));
    this.rand3 = int(random(0,33));
    this.word1 = this.words[this.rand1];
    this.word2 = this.words[this.rand2];
    this.word3 = this.words[this.rand3];

    //make sure no repeats
    // if (this.word1 != this.word2 && this.word1 != this.word3 && this.word3 != this.word2){
    //   return true;
    // }
    // else{
    //   this.rand1 = int(random(0,33));
    //   this.rand2 = int(random(0,33));
    //   this.rand3 = int(random(0,33));
    //   this.word1 = this.words[this.rand1];
    //   this.word2 = this.words[this.rand2];
    //   this.word3 = this.words[this.rand3];
    // }
    this.show = 0;
    this.textArea = select('#textArea');
    this.button = select('#button1');

  }


  draw() {
    //this.textArea = select('#textArea');
    // console.log(this.show)

    // console.log("working")
    if(thePlayer.poemInteract() && this.show == 0){
      //console.log("poem")

      //console.log(this.word1);
      //console.log(this.word2);
      //console.log(this.word3);

      //pop up a rectangle overlapping the game canvas
      colorMode(HSB);
      strokeWeight(20);
      stroke(50);
      fill(0)
      rect(40, 30, 420, 420);
      fill(50)
      rect(40, 460, 420, 30);

      let a = this.word1
      let b = this.word2
      let c = this.word3

      noStroke()
      fill(140,100,100)
      textSize(10)
      //display instructions & which words must be used
      let s = "to prove that you experience emotion at profound depths, compose a poem containing these words:      " + a + ", " +  b  + ", " + c
      text(s, 100, 100, 300,400)


      // console.log(textArea);
      //display form elements
      this.textArea.style('display', 'block');
      this.button.style('display', 'block');

      // grab the data in the text area box and paint it to the screen
      var textAreaData = select('#textArea').value();
      text(textAreaData, 100, 200);

      //after submit button get data and compare
      // var textAreaPoem = select('#textArea').value();

      //if all words are used
      //congrats
      //exit box
      //else
      //error message, try again

    }
    else{
      this.textArea.style('display', 'none');
      this.button.style('display', 'none');
    }
 }

 checkPoem(){
   var textAreaData = select('#textArea').value();
   if(textAreaData.includes(this.word1) && textAreaData.includes(this.word2) && textAreaData.includes(this.word3)){
     // console.log('true')
     this.show = 1
     return true
     // console.log(this.show)
   }
   return false
   //text(textAreaData, 100, 200);
   //console.log(textAreaData)
 }
}

class Game2 {
  constructor() {
    this.world = theWorld;
    this.player = thePlayer;
    this.shapes = []
    this.cNum = int(random(2,5))
    this.rNum = int(random(2,5))
    this.tNum = int(random(2,5))
    this.circles = 0
    this.rectangles = 0
    this.triangles = 0
  }

  display() {
    fill(255)
    rect(100,100,300,300)
    for(let i = 0; i < this.shapes.length; i++){
      this.shapes[i].display()
    }
    fill(0)
    textSize(15)
    text("circles: " + this.cNum + " rectangles: " + this.rNum + " triangles: "+ this.tNum, 110, 390)

  }

  paint(){
    if(thePlayer.canvasInteract()) {
      if ((key == 'F') || (key == 'f')) {
        var shape = new Shapes(thePlayer.x, thePlayer.y, 1)
        this.shapes.push(shape)
        this.circles++
      }
      if ((key == 'G') || (key == 'g')) {
        var shape = new Shapes(thePlayer.x, thePlayer.y, 2)
        this.shapes.push(shape)
        this.rectangles++
      }
      if ((key == 'H') || (key == 'h')) {
        var shape = new Shapes(thePlayer.x, thePlayer.y, 3)
        this.shapes.push(shape)
        this.triangles++
      }
    }
  }

  checkPainting(){
    if(this.circles >= this.cNum && this.rectangles >= this.rNum && this.triangles >= this.tNum){
      return true
    }
    return false

  }
}

class Shapes {
  constructor(x, y, num) {
    this.shapeNum = num
    this.x = x
    this.y = y
    this.color = color(random(255), random(255), random(255))
    this.xSize = random(10,50)
    this.ySize = random(10,25)
  }

  display() {
    if(this.shapeNum == 1){
      fill(this.color)
      ellipse(this.x, this.y, this.xSize, this.xSize)
    }
    if(this.shapeNum == 2){
      fill(this.color)
      rect(this.x, this.y, this.xSize, 50)
    }
    if(this.shapeNum == 3){
      fill(this.color)
      triangle(this.x, this.y, this.x + 2*(this.ySize), this.y, this.x + this.ySize, this.y - 2*(this.ySize))
    }
  }

}
