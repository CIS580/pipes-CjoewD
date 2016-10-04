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