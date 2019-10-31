function Player(x, y, world) {
  // store the player position
  this.x = x;
  this.y = y;

  // store a reference to our "world" object - we will ask the world to tell us about
  // tiles that are in our path
  this.world = world;

  this.leftCycle = [];
  this.rightCycle = [];
  this.upCycle = [];
  this.downCycle = [];
  this.currentImageNum = 0;
  this.currentCycle = this.leftCycle;
  for (var i = 0; i < 2; i++) {
    var filename = "frame" + nf(i,2) + ".png";
    this.downCycle.push( loadImage("player/playerDown/" + filename) )
    this.upCycle.push( loadImage("player/playerUp/" + filename) )
    this.leftCycle.push( loadImage("player/playerLeft/" + filename) )
    this.rightCycle.push( loadImage("player/playerRight/" + filename) )
  }

  this.currentCycle = this.leftCycle;
  this.currentImage = this.currentCycle[ this.currentImageNum ]
  
  // define our speed
  this.speed = 3;

  //this.pass = 0;

  // display our player
  this.display = function() {
    imageMode(CORNER);
    image(this.currentImage, this.x, this.y);
  }

  // display "sensor" positions
  this.displaySensor = function(direction) {
    fill(255);
    if (direction == "up") {
      //ellipse(this.top[0], this.top[1], 20, 20);
    } else if (direction == "down") {
      //ellipse(this.bottom[0], this.bottom[1], 20, 20);
    } else if (direction == "right") {
      //ellipse(this.right[0], this.right[1], 20, 20);
    } else if (direction == "left") {
      //ellipse(this.left[0], this.left[1], 20, 20);
    }
  }

  // set our sensor positions (computed based on the position of the character and the
  // size of our graphic)
  this.refreshSensors = function() {
    this.left = [this.x, this.y + this.currentImage.height / 2];
    this.right = [this.x + this.currentImage.width, this.y + this.currentImage.height / 2];
    this.top = [this.x + this.currentImage.width / 2, this.y];
    this.bottom = [this.x + this.currentImage.width / 2, this.y + this.currentImage.height];
  }

  // move our character
  this.move = function() {
    // refresh our "sensors" - these will be used for movement & collision detection
    this.refreshSensors();

    // see if one of our movement keys is down -- if so, we should try and move
    // note that this character responds to the following key combinations:
    // The four directional arrows
    if (keyIsDown(LEFT_ARROW)) {

      // see which tile is to our left
      var tile = world.getTile(this.left[0], this.left[1]);

      // would moving in this direction require a room change?
      if (tile == "roomChange") {
        // ask the world to request a room change
        world.changeRoom("left");

        // move the player into the new room
        this.x = width - this.currentImage.width;
      }

      // otherwise this is a regular tile
      else {
      
        // is this tile solid?
        if (!world.isTileSolid(tile)) {
          // move
          this.x -= this.speed;
        }
      }

      // change artwork
      //this.currentImage = this.artworkLeft;
      this.currentCycle = this.leftCycle;
      this.displaySensor("left");
    }
    if (keyIsDown(RIGHT_ARROW)) {
      // see which tile is to our right
      var tile = world.getTile(this.right[0], this.right[1]);

      // would moving in this direction require a room change?
      //&& this.pass != 0
      if (tile == "roomChange" ) {
        // ask the world to request a room change
        world.changeRoom("right");

        // move the player into the new room
        this.x = 0 + this.currentImage.width;
      }

      // otherwise this is a regular tile
      else {

        // is this tile solid?
        if (!world.isTileSolid(tile)) {
          this.x += this.speed;

        }
      }

      // change artwork
      //this.currentImage = this.artworkRight;
      this.currentCycle = this.rightCycle;
      this.displaySensor("right");
    }
    if (keyIsDown(DOWN_ARROW)) {
      // see which tile is below us
      var tile = world.getTile(this.bottom[0], this.bottom[1]);

      // would moving in this direction require a room change?
      if (tile == "roomChange") {
        // ask the world to request a room change
        world.changeRoom("down");

        // move the player into the new room
        this.y = 0 + this.currentImage.height;
      }

      // otherwise this is a regular tile
      else {

        // is this tile solid?
        if (!world.isTileSolid(tile)) {
          // move
          this.y += this.speed;
        }
      }

      // change artwork
      //this.currentImage = this.artworkDown;
      this.currentCycle = this.downCycle;
      this.displaySensor("down");
    }
    if (keyIsDown(UP_ARROW)) {
      // see which tile is below us
      var tile = world.getTile(this.top[0], this.top[1]);

      // would moving in this direction require a room change?
      if (tile == "roomChange") {
        // ask the world to request a room change
        world.changeRoom("up");

        // move the player into the new room
        this.y = height - this.currentImage.height-50;
      }

      // otherwise this is a regular tile
      else {

        // is this tile solid?
        if (!world.isTileSolid(tile)) {
          // move
          this.y -= this.speed;
        }
      }

      // change artwork
      //this.currentImage = this.artworkUp;
      this.currentCycle = this.upCycle;
      this.displaySensor("up");
    }

    this.currentImage = this.currentCycle[ this.currentImageNum ]
    // increase current image to go to the next cycle image if a key is down
    // only do this every few frames since we don't want this to run too fast!
    if (keyIsPressed && frameCount % 10 == 0) {
      this.currentImageNum += 1;
    }

    // cycle around to the beginning of the walk cycle, if necessary
    if (this.currentImageNum >= 2) {
      this.currentImageNum = 0;
    }
  }

  this.pianoInteract = function(){
    var tile = world.getTile(this.top[0], this.top[1]);
    // console.log("touch")
    if(world.isTileGame(tile)){
      // console.log("piano")
      return true;
    }
  }

  this.bookInteract = function(){
    var tile1 = world.getTile(this.top[0], this.top[1]);

    var tile2 = world.getTile(this.bottom[0], this.bottom[1]);

    if(world.isTileBook1(tile1)){
      return 1;
    }
    if(world.isTileBook2(tile2)){
      return 2;
    }
    if(world.isTileBook3(tile1)){
      return 3;
    }
    return 0;
  }

  this.poemInteract = function(){
    var tile = world.getTile(this.top[0], this.top[1]);
    if(world.isPoemGame(tile)){
      return true;
    }
  }

  this.canvasInteract = function(){
    var tile = world.getTile(this.top[0], this.top[1]);
    if(world.isTileCanvas(tile)){
      return true;
    }
  }
}