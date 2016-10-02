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