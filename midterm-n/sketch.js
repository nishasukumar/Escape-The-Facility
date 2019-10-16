// SPECIAL NOTE: This program uses a number of external JavaScript files to organize some of
// the objects that we need to fully implement a tile-based game.  These JavaScript files
// are referenced in the HTML document.  References to these documents are also included 
// as comments within this file.

// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld;

// our user controlled character object - see Player.js for more information
var thePlayer;

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
    51:true, 52:true, 53:true, 54:true, 55:true, 56:true}
};

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  theWorld = new OverheadWorld(worldParameters);
  thePlayer = new Player(100, 100, theWorld);
}

function setup() {
  createCanvas(500,500);
}

function draw() {
  theWorld.displayWorld()
  thePlayer.move();
  thePlayer.display();
}