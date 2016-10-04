(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;

/* Classes */
const Game = require('./game');
const PipeCross = require('./pipeCross.js');
const PipeConnect = require('./pipeConnect.js');
const PipeCorner = require('./pipeCorner.js');
const PipeCenter = require('./pipeCenter.js');
const PipeStraight = require('./pipeStraight.js');
const PipeTank = require('./pipeTank.js');
const PipeThin = require('./pipeThin.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var backdrop = new Image();
backdrop.src = 'assets/pipes_backdrop.jpg';
var grid = new Array(169);
var tank = [-1, -1, -1, -1, -1];;
var next = new PipeCross(0);
var waterSpeed = 1;
var state = 'pause';
grid[29] = new PipeConnect({x: 388, y: 128, piece: 0});
grid[139] = new PipeConnect({x: 772, y: 640, piece: 1});
var flashTimer = 0;
var startTimer = 10;
var timer = 0;
var forFlash = true;
var score = 0;
var levelScore = 23;
var lastState = 'start';
//images
var pipes = new Image();
pipes.src = 'assets/pipes_edited.png';
var menu = new Image();
menu.src = 'assets/menu.png';
//sounds
var backgroundSound = new Audio();
backgroundSound.src = 'assets/backgroundSound.wav';
backgroundSound.loop = true;
backgroundSound.volume = 0.3;
backgroundSound.play();
var pause = new Audio();
pause.src = 'assets/pause.wav';
var success = new Audio();
success.src = 'assets/success.wav';
var failure = new Audio();
failure.src = 'assets/failure.wav';
var place = new Audio();
place.src = 'assets/place.wav';
var rotate = new Audio();
rotate.src = 'assets/rotate.wav';


canvas.onclick = function(event) {
  event.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  if(x > 30 && x < 162 && y > 700 && y < 750){
	  while(state == 'running'){
		  fillPipes();
	  }
  }
  switch(state){
	  case 'start':
		  if(x > 196 ) state = 'countdown';
	  case 'countdown':
	  case 'running':
		  var gridNumber = findGrid({x: x, y: y});
		  if(gridNumber > -1 && grid[gridNumber] == null) {
			  placeNext(gridNumber);
			  place.play();
			  if(levelScore > 0) levelScore--;
		  }
		  break;
  }
}

canvas.oncontextmenu = function (event)
{
    event.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	switch(state){
		case 'countdown':
		case 'running':
			var gridNumber = findGrid({x: x, y: y});
			if(grid[gridNumber] != null) {
				grid[gridNumber].rotate();
				rotate.play();
			}
			break;
	  }	
}

window.onkeydown = function (event) {
    switch (event.keyCode) {
		case 27:
			pause.play();
			if(state == 'pause') state = lastState;
			else {
				lastState = state;
				state = 'pause';
			}
			break;
	}
}

//finds the array location of the click
function findGrid(position){
	var x = position.x;
	var y = position.y;
	x -= 192;
	if(x<0) return -1;
	var xValue = 0;
	var yValue = 0;
	while(x>63){
		x-=64;
		xValue++;
	}
	while(y>63){
		y-=64;
		yValue++;
	}
	
	return xValue + (yValue * 13);
}

//place the next peice in the array location
function placeNext(number){
	grid[number] = next;
	grid[number].place({x:((number%13)*64)+196, y: Math.floor((number/13))*64});
	switch(Math.floor(Math.random()*13))
	{
		case 0:
			next = new PipeCross(0);
			break;
		case 1:
		case 2:
		case 3:
			next = new PipeCorner(Math.floor(Math.random()*4));
			break;
		case 4:
		case 5:
		case 6:
			next = new PipeCenter(Math.floor(Math.random()*4));
			break;
		case 7:
		case 8:
		case 9:
			next = new PipeStraight(Math.floor(Math.random()*4));
			break;
		case 10:
			next = new PipeTank(Math.floor(Math.random()*4));
			break;
		case 11:
		case 12:
			next = new PipeThin(Math.floor(Math.random()*4));
			break;
	}
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  switch(state){
	  case 'start':
		  break;
	  case 'countdown':
		    //used for flashing affects
		  flashTimer += elapsedTime;
		  if (flashTimer > MS_PER_FRAME * 4) {
			  flashTimer = 0;
			  if(forFlash) forFlash = false;
			  else forFlash = true;
			  if(forFlash) {
				  startTimer--;
			  }
		  }
		  if(startTimer <= 0){
			  state = 'running';
			  if(waterSpeed < 6) startTimer = 10 + waterSpeed;
			  else startTimer = 15;
		  }
		  break;
	  case 'won':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
			  flashTimer++;
			  if(flashTimer >= 20){
				  flashTimer = 0;
				  state = 'start';
				  score += levelScore * waterSpeed;
				  waterSpeed++;
				  levelScore = 23;
				  grid = new Array(169);
				  grid[29] = new PipeConnect({x: 388, y: 128, piece: 0});
				  grid[139] = new PipeConnect({x: 772, y: 640, piece: 1});
			  }
		  }//end if (timer)
		  break;
	  case 'lost':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
			  flashTimer++;
			  if(flashTimer >= 20){
				  flashTimer = 0;
				  state = 'start';
				  score = 0;
				  waterSpeed = 1;
				  levelScore = 23;
				  grid = new Array(169);
				  grid[29] = new PipeConnect({x: 388, y: 128, piece: 0});
				  grid[139] = new PipeConnect({x: 772, y: 640, piece: 1});
				  next = new PipeCross(0);
			  }
		  }
		  break;
	  case 'running':
		  timer += elapsedTime;
		  if (timer > MS_PER_FRAME) {
			  timer = 0;
			  fillPipes();
		  }//end if (timer)
		  break;
  }//end switch
}

//fills pipes and checks for a win or loss
function fillPipes(){
	var lostCheck = 0;
	for(var i = 0; i < grid.length; i++){
		if(grid[i] != null){
			var exit = grid[i].getExits();
			switch(grid[i].findState()){
				case 'full':
					if(exit[0] == 0){
						if(i-13 >= 0){
							if(grid[i-13] != null && grid[i-13].findState() == 'empty'){
								grid[i-13].setFilling(2);
								grid[i-13].fill(waterSpeed);
							}
						}
					}
					if(exit[1] == 0){
						if(i+1 < grid.length){
							if(grid[i+1] != null && grid[i+1].findState() == 'empty'){
								grid[i+1].setFilling(3);
								grid[i+1].fill(0);
							}
						}
					}
					if(exit[2] == 0){
						if(i+13 < grid.length){
							if(grid[i+13] != null && grid[i+13].findState() == 'empty'){
								grid[i+13].setFilling(0);
								grid[i+13].fill(0);
							}
						}
					}
					if(exit[3] == 0){
						if(i-1 >= 0){
							if(grid[i-1] != null && grid[i-1].findState() == 'empty'){
								grid[i-1].setFilling(1);
								grid[i-1].fill(waterSpeed);
							}
						}
					}
					break;
				case 'filling':
					lostCheck = 1;
					var overFill = grid[i].fill(waterSpeed);
					if(overFill >= 0){
						if(exit[0] == 0){
							if(i-13 >= 0){
								if(grid[i-13] != null && grid[i-13].findState() != 'full'){
									grid[i-13].setFilling(2);
									grid[i-13].fill(overFill);
								}
							}
						}
						if(exit[1] == 0){
							if(i+1 < grid.length){
								if(grid[i+1] != null && grid[i+1].findState() != 'full'){
									grid[i+1].setFilling(3);
									grid[i+1].fill(overFill-waterSpeed);
								}
							}
						}
						if(exit[2] == 0){
							if(i+13 < grid.length){
								if(grid[i+13] != null && grid[i+13].findState() != 'full'){
									grid[i+13].setFilling(0);
									grid[i+13].fill(overFill-waterSpeed);
								}
							}
						}
						if(exit[3] == 0){
							if(i-1 >= 0){
								if(grid[i-1] != null && grid[i-1].findState() != 'full'){
									grid[i-1].setFilling(1);
									grid[i-1].fill(overFill);
								}
							}
						}
					}//end if
					break;
			}//end switch
		}//end if
	}//end for
	if(lostCheck == 0) {
		if(state == 'running') failure.play();
		state = 'lost';
	}
	if(grid[139].findState() != 'empty') {
		success.play();
		state = 'won';
	}
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //draw backdrop
  ctx.drawImage(backdrop,0,0);

  //draw ui shapes
  ctx.fillStyle = 'black';  
  ctx.fillRect(0,0,192,832); //large black border
  ctx.fillStyle = 'white';
  ctx.fillRect(2,2,188,828); //large white box
  
  //draw next part
  ctx.fillStyle = 'black';
  ctx.fillRect(30,30,132,132); //small black border
  ctx.fillStyle = '#c7c7c7';
  ctx.fillRect(32,32,128,128); //next box 
  next.render(elapsedTime,ctx);
  
  //draw finish button
  ctx.fillStyle = 'black';
  ctx.fillRect(30,700,132,50); //small black border for button
  ctx.fillStyle = '#c7c7c7';
  ctx.fillRect(32,702,128,46); //button
  
  //draw text
  ctx.fillStyle = "black";
  ctx.font = "bold 23px Arial";
  ctx.fillText("NEXT PART", 30, 185);//next part
  ctx.font = "bold 30px Arial";
  ctx.fillText("FINISH",47, 736);//finish button
  ctx.font = "20px Arial";
  ctx.fillText("LEVEL",62, 360);//level label
  ctx.fillText("SCORE", 60, 530);//score label
  ctx.font = "Bold 100px Arial";
  if(waterSpeed < 10) ctx.fillText(waterSpeed,65, 330);//level if less than 10
  else ctx.fillText(waterSpeed,36, 330); // level if >= 10
  ctx.font = "Bold 65px Arial";
  if(score < 10) ctx.fillText(score, 78, 500);//level if less than 10
  else if (score < 100) ctx.fillText(score, 60, 500); // level if >= 10 and < 100
  else ctx.fillText(score, 40, 500); // level if >= 100
  
  //draw parts
  for(var i = 0; i < grid.length; i++){
	  if(grid[i] != null) grid[i].render(elapsedTime,ctx);
  }
  
  switch(state){
	  case 'start':
		  ctx.fillStyle = '#9fff91';
		  ctx.font = "bold 30px Arial";
		  ctx.fillText("START", 370, 155);
		  ctx.fillStyle = '#ff7f7f';
		  ctx.fillText("END", 770, 700);
		  break;
	  case 'countdown':
		  if(forFlash){
			  ctx.fillStyle = '#c7c7c7';
			  ctx.font = "bold 30px Arial";
			  if(startTimer < 10) ctx.fillText(startTimer, 412, 180);
			  else ctx.fillText(startTimer, 402, 180);
		  }
		  break;
	  case 'won':
		  ctx.fillStyle = 'black';
		  ctx.fillRect(0,200,1024,150); //black border
		  ctx.fillStyle = '#9fff91';
		  ctx.fillRect(4,204,1016,142); //banner
		  ctx.fillStyle = 'black';
		  ctx.font = "bold 100px Arial";
		  ctx.fillText("SUCCESS",280, 310);
		  break;
	  case 'lost':
		  ctx.fillStyle = 'black';
		  ctx.fillRect(0,200,1024,150); //small black
		  ctx.fillStyle = '#ff7f7f';
		  ctx.fillRect(4,204,1016,142); //banner
		  ctx.fillStyle = 'black';
		  ctx.font = "bold 100px Arial";
		  ctx.fillText("FAILURE",300, 310);
		  break;
	  case 'pause':
		  ctx.drawImage(menu,-2,-2);
		  break;
  }//end switch
}

},{"./game":2,"./pipeCenter.js":3,"./pipeConnect.js":4,"./pipeCorner.js":5,"./pipeCross.js":6,"./pipeStraight.js":7,"./pipeTank.js":8,"./pipeThin.js":9}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeCenter;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeCenter(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction;// 0 means an exit, 1 means an entrance
  switch(this.rotation){
	  case 0:
		this.direction = [-1,0,0,0];
		break;
	  case 1:
		this.direction = [0,-1,0,0];
		break;
	  case 2:
		this.direction = [0,0,-1,0];
		break;
	  case 3:
		this.direction = [0,0,0,-1];
		break;
  }
}

//rotates the pipe
PipeCenter.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
			this.direction = [0,-1,0,0];
			break;
		  case 1:
			this.direction = [0,0,-1,0];
			break;
		  case 2:
			this.direction = [0,0,0,-1];
			break;
		  case 3:
			this.direction = [-1,0,0,0];
			break;
	  }//end switch
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}//end if
}

//places the pipe on the screen with given x and y positions
PipeCenter.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeCenter.prototype.getName = function(){
	return "center";
}

//increases the wterlevel in the pipe
PipeCenter.prototype.fill = function(amount){
	var overFlow = -1;
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel>63){
			overFlow = this.waterLevel - 63;
			this.waterLevel = 63;
			this.state = 'full';
		}//end if
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeCenter.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeCenter.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeCenter.prototype.setFilling = function(entrance){
	switch(entrance){
		case 0:
			if(this.direction[0] == 0) {
				this.direction[0] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 1:
			if(this.direction[1] == 0) {
				this.direction[1] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 2:
			if(this.direction[2] == 0) {
				this.direction[2] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 3:
			if(this.direction[3] == 0) {
				this.direction[3] = 1;
				this.state = 'filling';
			}//end if
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeCenter.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+32,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+63-this.waterLevel,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}//end switch
		case 'empty':
			//draws the pipe image
			ctx.drawImage(
				// image
				this.pipes,
				// source rectangle
				32*this.rotation+1, 65, 30, 30,
				// destination rectangle
				this.x, this.y, 64, 64
		    );
    }//end switch
}
},{}],4:[function(require,module,exports){
"use strict";


/**
 * @module exports the Player class
 */
module.exports = exports = PipeConnect;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function PipeConnect(parm) {
  this.x = parm.x; //x position
  this.y = parm.y; //y position
  this.piece = parm.piece; //Rotation of pipe
  this.waterLevel = 0; //how much water is in pipe from 0 to 64
  this.state;
  this.direction;
  if(this.piece == 0) {
	  this.state = 'filling';
	  this.direction = [-1,-1,0,-1];
  }
  else if(this.piece == 1) {
	  this.state = 'empty';
	  this.direction = [0,-1,-1,-1];
  }
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
}


PipeConnect.prototype.fill = function(amount){
	var overFlow = -1;
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel>31){
			overFlow = this.waterLevel - 31;
			this.waterLevel = 31;
			this.state = 'full';
		}//end if
	}//end if
	return overFlow;
}

PipeConnect.prototype.setFilling = function(entrance){
	if(entrance == 0 && this.state == 'empty'){
		this.direction[0] = 1;
		this.state = 'filling';
	}
}

//returns this pipes name
PipeConnect.prototype.getName = function(){
	return "connect";
}

//returns the state
PipeConnect.prototype.findState = function(){
	return this.state;
}


PipeConnect.prototype.rotate = function(){
	
}

PipeConnect.prototype.getExits = function(){
	return this.direction;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeConnect.prototype.render = function(time, ctx) {
	ctx.fillStyle = 'blue';
	if(this.piece == 0){
		ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel);
	}
	else{
		ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
	}
	
	ctx.drawImage(
        // image
        this.pipes,
        // source rectangle
        32*this.piece, 96, 32, 32,
        // destination rectangle
        this.x, this.y, 64, 64
      );
}
},{}],5:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeCorner;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeCorner(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction;// 0 means an exit, 1 means an entrance
  switch(this.rotation){
	  case 0:
		this.direction = [-1,0,0,-1];
		break;
	  case 1:
		this.direction = [-1,-1,0,0];
		break;
	  case 2:
		this.direction = [0,-1,-1,0];
		break;
	  case 3:
		this.direction = [0,0,-1,-1];
		break;
  }
}

//rotates the pipe
PipeCorner.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
			this.direction = [-1,-1,0,0];
			break;
		  case 1:
			this.direction = [0,-1,-1,0];
			break;
		  case 2:
			this.direction = [0,0,-1,-1];
			break;
		  case 3:
			this.direction = [-1,0,0,-1];
			break;
	  }//end switch
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}//end if
}

//places the pipe on the screen with given x and y positions
PipeCorner.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeCorner.prototype.getName = function(){
	return "corner";
}

//increases the wterlevel in the pipe
PipeCorner.prototype.fill = function(amount){
	var overFlow = -1;
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel>63){
			overFlow = this.waterLevel - 63;
			this.waterLevel = 63;
			this.state = 'full';
		}//end if
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeCorner.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeCorner.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeCorner.prototype.setFilling = function(entrance){
	switch(entrance){
		case 0:
			if(this.direction[0] == 0) {
				this.direction[0] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 1:
			if(this.direction[1] == 0) {
				this.direction[1] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 2:
			if(this.direction[2] == 0) {
				this.direction[2] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 3:
			if(this.direction[3] == 0) {
				this.direction[3] = 1;
				this.state = 'filling';
			}//end if
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeCorner.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+32,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+63-this.waterLevel,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}//end switch
		case 'empty':
			//draws the pipe image
			ctx.drawImage(
				// image
				this.pipes,
				// source rectangle
				32*this.rotation+1, 33, 30, 30,
				// destination rectangle
				this.x, this.y, 64, 64
		    );
    }//end switch
}
},{}],6:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeCross;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeCross(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction = [0,0,0,0]; // 0 means an exit, 1 means an entrance
}

//rotates the pipe
PipeCross.prototype.rotate = function(){
	
}

//places the pipe on the screen with given x and y positions
PipeCross.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeCross.prototype.getName = function(){
	return "cross";
}

//increases the wterlevel in the pipe
PipeCross.prototype.fill = function(amount){
	var overFlow = -1;
	this.waterLevel += amount;
	if(this.waterLevel>63){
		overFlow = this.waterLevel - 63;
		this.waterLevel = 63;
		this.state = 'full';
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeCross.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeCross.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeCross.prototype.setFilling = function(entrance){
	this.state = 'filling';
	switch(entrance){
		case 0:
			this.direction[0] = 1;
			break;
		case 1:
			this.direction[1] = 1;
			break;
		case 2:
			this.direction[2] = 1;
			break;
		case 3:
			this.direction[3] = 1;
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeCross.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+32,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+63-this.waterLevel,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}//end switch
		case 'empty':
			//draws the pipe image
			ctx.drawImage(
				// image
				this.pipes,
				// source rectangle
				1, 1, 30, 30,
				// destination rectangle
				this.x, this.y, 64, 64
		    );
    }//end switch
}
},{}],7:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeStraight;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeStraight(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction;// 0 means an exit, 1 means an entrance
  switch(this.rotation){
	  case 0:
	  case 2:
		this.direction = [-1,0,-1,0];
		break;
	  case 1:
	  case 3:
		this.direction = [0,-1,0,-1];
		break;
  }
}

//rotates the pipe
PipeStraight.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
		  case 2:
			this.direction = [0,-1,0,-1];
			break;
		  case 1:
		  case 3:
			this.direction = [-1,0,-1,0];
			break;
	  }//end switch
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}//end if
}

//places the pipe on the screen with given x and y positions
PipeStraight.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeStraight.prototype.getName = function(){
	return "straight";
}

//increases the wterlevel in the pipe
PipeStraight.prototype.fill = function(amount){
	var overFlow = -1;
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel>63){
			overFlow = this.waterLevel - 63;
			this.waterLevel = 63;
			this.state = 'full';
		}//end if
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeStraight.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeStraight.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeStraight.prototype.setFilling = function(entrance){
	switch(entrance){
		case 0:
			if(this.direction[0] == 0) {
				this.direction[0] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 1:
			if(this.direction[1] == 0) {
				this.direction[1] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 2:
			if(this.direction[2] == 0) {
				this.direction[2] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 3:
			if(this.direction[3] == 0) {
				this.direction[3] = 1;
				this.state = 'filling';
			}//end if
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeStraight.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+32,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+30,this.y+32,4,this.waterLevel-32);
					break;
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+64-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 0:
					if(this.waterLevel >= 32) ctx.fillRect(this.x+63-this.waterLevel,this.y+26,this.waterLevel-32,4);
					break;
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}//end switch
		case 'empty':
			switch(this.rotation){
				case 0:
				case 2:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						33, 1, 30, 30,
						// destination rectangle
						this.x, this.y, 64, 64
					);
					break;
				case 1:
				case 3:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						65, 1, 30, 30,
						// destination rectangle
						this.x, this.y, 64, 64
					);
					break;
			}
    }//end switch
}
},{}],8:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeTank;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeTank(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction = [0,0,0,0]; // 0 means an exit, 1 means an entrance
}

//rotates the pipe
PipeTank.prototype.rotate = function(){
	
}

//places the pipe on the screen with given x and y positions
PipeTank.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeTank.prototype.getName = function(){
	return "cross";
}

//increases the wterlevel in the pipe
PipeTank.prototype.fill = function(amount){
	var overFlow = -1;
	this.waterLevel += amount;
	if(this.waterLevel>255){
		overFlow = this.waterLevel - 255;
		this.waterLevel = 255;
		this.state = 'full';
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeTank.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeTank.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeTank.prototype.setFilling = function(entrance){
	this.state = 'filling';
	switch(entrance){
		case 0:
			this.direction[0] = 1;
			break;
		case 1:
			this.direction[1] = 1;
			break;
		case 2:
			this.direction[2] = 1;
			break;
		case 3:
			this.direction[3] = 1;
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeTank.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y,5,32);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x+64-this.waterLevel,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x+32,this.y+26,32,4)
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 1:
					if(this.waterLevel < 32) ctx.fillRect(this.x+30,this.y+26-this.waterLevel,4,this.waterLevel);
					else ctx.fillRect(this.x+30,this.y+32,4,32);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 1:
					if(this.waterLevel < 32 ) ctx.fillRect(this.x,this.y+26,this.waterLevel,4);
					else ctx.fillRect(this.x,this.y+26,32,4);
					break;
			}//end switch
			if(this.waterLevel > 32) ctx.fillRect(this.x+32-this.waterLevel/16,this.y+32-this.waterLevel/16,this.waterLevel/8,this.waterLevel/8)
		case 'empty':
			//draws the pipe image
			ctx.drawImage(
				// image
				this.pipes,
				// source rectangle
				97, 1, 30, 30,
				// destination rectangle
				this.x, this.y, 64, 64
		    );
    }//end switch
}
},{}],9:[function(require,module,exports){
"use strict";


/**
 * @module exports the pipe class
 */
module.exports = exports = PipeThin;

/**
 * @constructor pipe
 * Creates a new pipe object
 * @param {Postition} position object specifying an x and y
 */
function PipeThin(rotation) {
  this.x = 64; //x position
  this.y = 64; //y position
  this.rotation = rotation; //Rotation of pipe
  this.waterLevel = 0;  //how much water is in pipe from 0 to 64
  this.state = 'empty'; 
  this.pipes = new Image();
  this.pipes.src = 'assets/pipes_edited.png';
  this.direction;// 0 means an exit, 1 means an entrance
  switch(this.rotation){
	  case 0:
	  case 2:
		this.direction = [-1,0,-1,0];
		break;
	  case 1:
	  case 3:
		this.direction = [0,-1,0,-1];
		break;
  }
}

//rotates the pipe
PipeThin.prototype.rotate = function(){
	if(this.state == 'empty'){
		switch(this.rotation){
		  case 0:
		  case 2:
			this.direction = [0,-1,0,-1];
			break;
		  case 1:
		  case 3:
			this.direction = [-1,0,-1,0];
			break;
	  }//end switch
		this.rotation++;
		if(this.rotation == 4) this.rotation = 0;
	}//end if
}

//places the pipe on the screen with given x and y positions
PipeThin.prototype.place = function(position){
	this.x = position.x;
	this.y = position.y;
}

//returns this pipes name
PipeThin.prototype.getName = function(){
	return "straight";
}

//increases the wterlevel in the pipe
PipeThin.prototype.fill = function(amount){
	var overFlow = -1;
	if(this.state == 'filling'){
		this.waterLevel += amount;
		if(this.waterLevel>31){
			overFlow = this.waterLevel - 31;
			this.waterLevel = 31;
			this.state = 'full';
		}//end if
	}//end if
	return overFlow;
}

//returns array to find the exits
PipeThin.prototype.getExits = function(){
	return this.direction;
}

//returns the state
PipeThin.prototype.findState = function(){
	return this.state;
}

//sets the pipe that is filling
PipeThin.prototype.setFilling = function(entrance){
	switch(entrance){
		case 0:
			if(this.direction[0] == 0) {
				this.direction[0] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 1:
			if(this.direction[1] == 0) {
				this.direction[1] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 2:
			if(this.direction[2] == 0) {
				this.direction[2] = 1;
				this.state = 'filling';
			}//end if
			break;
		case 3:
			if(this.direction[3] == 0) {
				this.direction[3] = 1;
				this.state = 'filling';
			}//end if
			break;
	}//end switch
}

/**
 * @function renders the pipe into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
PipeThin.prototype.render = function(time, ctx) {
	switch(this.state){
		case 'filling':
		case 'full':
			//draws the water
			ctx.fillStyle = 'blue';
			//water in upper part
			switch(this.direction[0]){
				case 1:
					ctx.fillRect(this.x+30,this.y,4,this.waterLevel*2);
					break;
			}//end switch
			//water in right part
			switch(this.direction[1]){
				case 1:
					ctx.fillRect(this.x+64-this.waterLevel*2,this.y+26,this.waterLevel*2,4);
					break;
			}//end switch
			//water in bottom part
			switch(this.direction[2]){
				case 1:
					ctx.fillRect(this.x+30,this.y+64-this.waterLevel*2,4,this.waterLevel*2);
					break;
			}//end switch
			//water in left part
			switch(this.direction[3]){
				case 1:
					ctx.fillRect(this.x,this.y+26,this.waterLevel*2,4);
					break;
			}//end switch
		case 'empty':
			switch(this.rotation){
				case 0:
				case 2:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						65, 97, 30, 30,
						// destination rectangle
						this.x, this.y, 64, 64
					);
					break;
				case 1:
				case 3:
					//draws the pipe image
					ctx.drawImage(
						// image
						this.pipes,
						// source rectangle
						97, 97, 30, 30,
						// destination rectangle
						this.x, this.y, 64, 64
					);
					break;
			}
    }//end switch
}
},{}]},{},[1]);
