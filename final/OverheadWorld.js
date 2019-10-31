function OverheadWorld(params) {
  // store our desired tile size
  this.tileSize = params.tileSize;
  
  // store the folder in which all of our tiles are stored
  this.tileFolder = params.tileFolder;
  
  // store how many tiles we are working with
  this.numTiles = params.numTiles;
  
  // store an object that defines which tiles are solid
  this.solidTiles = params.solidTiles;

  this.pianoTiles = params.pianoTiles;

  this.bookTiles1 = params.bookTiles1;

  this.bookTiles2 = params.bookTiles2;

  this.bookTiles3 = params.bookTiles3;

  this.poemTiles = params.poemTiles;

  this.canvasTiles = params.canvasTiles;

  // an array to hold all tile graphics
  this.tileLibrary = [];

  this.state = 0;

  // load in all tile graphics
  for (var i = 0; i < this.numTiles; i++) {
    var tempTile = loadImage(this.tileFolder + "/tile" + nf(i,3) + ".png");
    this.tileLibrary.push(tempTile);
  }

  // displayTile: draws a single tile at a specified location
  this.displayTile = function(id, x, y) {
    image(this.tileLibrary[id], x, y);
  }
  
  // setup rooms
  this.setupRooms = function(data, startRoom) {
    // store room data (an object)
    this.roomData = data;
    
    // store our current room
    this.roomCurrent = startRoom;

    this.state = this.roomData[this.roomCurrent].state
    
    // extract the level definition for our starting room
    this.tileMap = this.roomData[this.roomCurrent].level;
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
    //console.log("gettin tlie for:", col, row, "y is:", y)
    
    // if the computed position is not in the array we should determine if this movement
    // requires a room change - if so we need to notifiy the player
    if (row < 0 && this.roomData[this.roomCurrent].up != "none") {
      //console.log("room change!")
      return "roomChange";
    }
    else if (row >= this.tileMap.length && this.roomData[this.roomCurrent].down != "none") {
      return "roomChange";
    }
    else if (col < 0 && this.roomData[this.roomCurrent].left != "none") {
      return "roomChange";
    }
    else if (col >= this.tileMap[row].length && this.roomData[this.roomCurrent].right != "none") {
      return "roomChange";
    }
    
    // otherwise we hit and edge but there is no room to move into - assume the edge is solid
    else if (row < 0 || row >= this.tileMap.length || col < 0 || col >= this.tileMap[row].length) {
      return -1;
    }

    // get the tile from our map
    return this.tileMap[row][col];
  }
  
  // change rooms
  this.changeRoom = function(direction) {
    // store our current room
    //console.log(this.roomData[this.roomCurrent])
    //console.log("Direction is:", direction)
    this.roomCurrent = this.roomData[this.roomCurrent][direction];
    
    this.state = this.roomData[this.roomCurrent].state
    // extract the level definition for our starting room
    this.tileMap = this.roomData[this.roomCurrent].level;
    //console.log(this.tileMap)
  }
  
  // see if this tile is solid
  this.isTileSolid = function(id) {
    if (id in this.solidTiles || id == -1) {
      return true;
    }
    
    // otherwise return false
    return false;
  }

  //check if the tile is a piano tile
  this.isTileGame = function(id){
    if((id in this.solidTiles || id == -1) && id in this.pianoTiles){
      return true
    }

    return false
  }

  //check if the tile is a book tile 1
  this.isTileBook1 = function(id){
    if((id in this.solidTiles || id == -1) && id in this.bookTiles1){
      return true
    }

    return false
  }

  //check if the tile is a book tile 2
  this.isTileBook2 = function(id){
    if((id in this.solidTiles || id == -1) && id in this.bookTiles2){
      return true
    }

    return false
  }

  //check if the tile is a book tile 3
  this.isTileBook3 = function(id){
    if((id in this.solidTiles || id == -1) && id in this.bookTiles3){
      return true
    }

    return false
  }

  //check if the tile is a poem tile
  this.isPoemGame = function(id){
    if((id in this.solidTiles || id == -1) && id in this.poemTiles ){
      return true
    }

    return false
  }

  //check if the tile is a canvas tile
  this.isTileCanvas= function(id) {
    if (id in this.canvasTiles) {
      return true;
    }

    // otherwise return false
    return false;
  }
}