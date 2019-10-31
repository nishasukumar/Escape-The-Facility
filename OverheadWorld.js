function OverheadWorld(params) {
  // store our desired tile size
  this.tileSize = params.tileSize;
  
  // store our tile map
  this.tileMap = params.tileMap;

  // store the folder in which all of our tiles are stored
  this.tileFolder = params.tileFolder;
  
  // store how many tiles we are working with
  this.numTiles = params.numTiles;
  
  // store an object that defines which tiles are solid
  this.solidTiles = params.solidTiles;

  this.pianoTiles = params.pianoTiles;

  this.bookTiles1 = params.bookTiles1;

  this.bookTiles2 = params.bookTiles2;

  // an array to hold all tile graphics
  this.tileLibrary = [];

  // load in all tile graphics
  for (var i = 0; i < this.numTiles; i++) {
    var tempTile = loadImage(this.tileFolder + "/tile" + nf(i,3) + ".png");
    this.tileLibrary.push(tempTile);
  }

  // displayTile: draws a single tile at a specified location
  this.displayTile = function(id, x, y) {
    image(this.tileLibrary[id], x, y);
  }

  // displayWorld: displays the current world
  this.displayWorld = function() {
    for (var row = 0; row < this.tileMap.length; row += 1) {
      for (var col = 0; col < this.tileMap[row].length; col += 1) {
        image(this.tileLibrary[ this.tileMap[row][col] ], col*this.tileSize, row*this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }
  
  // get a tile based on a screen x,y position
  this.getTile = function(x, y) {
    // convert the x & y position into a grid position
    var col = Math.floor(x/this.tileSize);
    var row = Math.floor(y/this.tileSize);
    
    // if the computed position is not in the array we can send back a -1 value
    if (row < 0 || row >= this.tileMap.length || col < 0 || col >= this.tileMap[row].length) {
      return -1;
    }

    // get the tile from our map
    return this.tileMap[row][col];
  }
  
  // see if this tile is solid
  this.isTileSolid = function(id) {
    if (id in this.solidTiles || id == -1) {
      return true;
    }
    
    // otherwise return false
    return false;
  }

  this.isTileGame = function(id){
    if((id in this.solidTiles || id == -1) && id in this.pianoTiles){
      return true
    }

    return false
  }

  this.isTileBook1 = function(id){
    if((id in this.solidTiles || id == -1) && id in this.bookTiles1){
      return true
    }

    return false
  }

  this.isTileBook2 = function(id){
    if((id in this.solidTiles || id == -1) && id in this.bookTiles2){
      return true
    }

    return false
  }
}