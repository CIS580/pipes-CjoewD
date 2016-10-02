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