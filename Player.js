function Player(x, y, world) {
  // store the player position
  this.x = x;
  this.y = y;

  // store a reference to our "world" object - we will ask the world to tell us about
  // tiles that are in our path
  this.world = world;

  // load & store our artwork
  this.artworkLeft = loadImage('player/tile005.png');
  this.artworkRight = loadImage('player/tile008.png');
  this.artworkUp = loadImage('player/tile010.png');
  this.artworkDown = loadImage('player/tile001.png');

  // assume we are pointing to the right
  this.currentImage = this.artworkRight;

  // define our speed
  this.speed = 3;

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
    // WASD
    // wasd
    // The four directional arrows
    if (keyIsDown(LEFT_ARROW) || keyIsDown(97) || keyIsDown(65)) {

      // see which tile is to our left
      var tile = world.getTile(this.left[0], this.left[1]);

      // is this tile solid?
      if (!world.isTileSolid(tile)) {
        // move
        this.x -= this.speed;
      }

      // change artwork
      this.currentImage = this.artworkLeft;
      this.displaySensor("left");
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(100) || keyIsDown(68)) {
      // see which tile is to our right
      var tile = world.getTile(this.right[0], this.right[1]);

      // is this tile solid?
      if (!world.isTileSolid(tile)) {
        // move
        this.x += this.speed;
      }

      // change artwork
      this.currentImage = this.artworkRight;
      this.displaySensor("right");
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(115) || keyIsDown(83)) {
      // see which tile is below us
      var tile = world.getTile(this.bottom[0], this.bottom[1]);

      // is this tile solid?
      if (!world.isTileSolid(tile)) {
        // move
        this.y += this.speed;
      }

      // change artwork
      this.currentImage = this.artworkDown;
      this.displaySensor("down");
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(119) || keyIsDown(87)) {
      // see which tile is below us
      var tile = world.getTile(this.top[0], this.top[1]);

      // is this tile solid?
      if (!world.isTileSolid(tile)) {
        // move
        this.y -= this.speed;
      }

      // change artwork
      this.currentImage = this.artworkUp;
      this.displaySensor("up");
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
    var tile = world.getTile(this.top[0], this.top[1]);
    // console.log("touch")
    if(world.isTileBook1(tile)){
      // console.log("piano")
      return 1;
    }
    if(world.isTileBook2(tile)){
      // console.log("piano")
      return 2;
    }
    return 0;
  }
}
