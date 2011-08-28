/**
 * GameCircle runs the show, this is the Main controller.
 */
function GameCircle(){
	
};

GameCircle.debugOn = false;
GameCircle.CANVAS_WIDTH = 0;
GameCircle.CANVAS_HEIGHT = 0;
GameCircle.ViewPortCenterX = 0;
GameCircle.ViewPortCenterY = 0;
GameCircle.STATUS_WIDTH = 0;
GameCircle.playerDefaltVisonRange = 5;
GameCircle.DisplayGrid = false;
GameCircle.lightsOn = false; //Toggles visability, true makes whole map explored.
GameCircle.showPlayerStatus = true;
GameCircle.elapsed = 0;
GameCircle.lastUpdate = 0;
GameCircle.lastUpdateTime = 0;
GameCircle.fps = 0;
GameCircle.buttonStates = [];
GameCircle.player = {};
GameCircle.monsters = [];
GameCircle.eventMesgsStack = [];
GameCircle.currentMap = null;
GameCircle.mouseQueue = [];
GameCircle.dblClickTimeLimit = 8000;
GameCircle.lastMouseEvent = 0; //in ms
GameCircle.watchedMouseEvents = [];
GameCircle.missiles = [];  //in flight
/* selectedTile can indicate either a single tile or the starting tile in a range. 
Ranges are only set when ctrl is held and only valid when selectedTileEnd is not null.*/
GameCircle.selectedTile = null;
GameCircle.selectedTileEnd = null;
GameCircle.selectedMode = false;
GameCircle.placementTile = {"id":-1, "type":-1};
GameCircle.activeDialog = null;
GameCircle.BLANK = {"id":-1,"name":"BLANK", "type":-1, "group":"blank"};
//Preferences:
GameCircle.backgroundColor = '#000';

/**
 * Adds Messages to the Message queue to display to player.
 */
GameCircle.addEventMessage = function(msg,life) {
	if(msg) {
		life = (life || life == null)?60:life;
		this.eventMesgsStack.push({"msg":msg, "life":life})
	}
};

/**
 * Responsable for rendering the ViewPort or Camera of the game.
 */
GameCircle.render = function() {
	vpX = (this.CANVAS_WIDTH/2)-(this.currentMap.getTileWidth()/2); //viewPort Center.
	vpY = (this.CANVAS_HEIGHT/2)-(this.currentMap.getTileHeight()/2);
	GameCircle.ViewPortCenterX = vpX;
	GameCircle.ViewPortCenterY = vpY;
	context.fillStyle = GameCircle.backgroundColor;//'rgb(0, 0, 0)' ;
	context.fillStyle = GameCircle.backgroundColor;//'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT ) ;
	this.renderViewPort(context, vpX,vpY); 
};

/**
 * Paints the game map then centers the viewport on the player sprite.
 *
 * @param contest - ViewPort's 2D context
 * @param vpCtrX - ViewPort's center X position, adjusted to the UL corner of the center player tile.
 * @param vpCtrY - ViewPort's center Y position, adjusted to the UL corner of the center player tile.
 */
GameCircle.renderViewPort = function(context, vpCtrX, vpCtrY) {
	var now = new Date().getTime();
	GameCircle.elapsed = (now - this.lastUpdate);
	GameCircle.fps = ~~(1000/(now - GameCircle.elapsed));
	GameCircle.lastUpdateTime = now;
	renderedMap = GameCircle.currentMap.renderMap();
	context.save();  //save position to return to later.
	context.translate(vpCtrX-GameCircle.player.x,vpCtrY-GameCircle.player.y); //Move to point on map where player stands
	context.drawImage(renderedMap, 0, 0);
	//render missiles in play.
	/*for(mis = 0; mis < GameCircle.missiles.length; mis++){
		GameCircle.missiles[mis].render(context);
		
	}*/
	
	//Draw monsters
	for(m = 0; m < GameCircle.monsters.length; m++){
		if(GameCircle.monsters[m].visable == false) {
			continue;
		}		
		GameCircle.monsters[m].renderImg(context,GameCircle.monsters[m].x, GameCircle.monsters[m].y);
	}

	if(this.DisplayGrid) {
		paintGrid(context, renderedMap.width, renderedMap.height);
	}
	context.restore(); //pop the canvas back to where it was which moves the map.
	this.buildStatusDisplay(context);
	this.writeStatus(context);
	//GameCircle.player.renderImg(context, vpCtrX, vpCtrY);
};

/**
 * Displays the Messages overlay at the top of the viewPort, it doesnt display if no messages.
 */
GameCircle.writeStatus = function(context) {
	var vertPosStart = 20;
	var statusMargin = 5;
	var statusHeight = vertPosStart*GameCircle.eventMesgsStack.length + vertPosStart;
	if(GameCircle.eventMesgsStack.length === 0) {
		//nothing to display
		return;
	}
	//position in upper left corner	
	context.save();
	context.translate(0,0);
	
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	context.lineWidth = "0.5";

	//drawFrame
	context.strokeRect(this.STATUS_WIDTH+statusMargin,statusMargin,(this.CANVAS_WIDTH-10-this.STATUS_WIDTH),statusHeight-10);
	context.fillStyle = "rgba(204, 204, 204, 0.1)";
	context.fillRect(this.STATUS_WIDTH+statusMargin,statusMargin,(this.CANVAS_WIDTH-10-this.STATUS_WIDTH),statusHeight-10);
	context.fillStyle = "#FFFF33";	
	var msgCt = 1;
	
	//context.fillText("TEST2", STATUS_WIDTH+(statusMargin*2), 30);
	//while(GameCircle.length >0) {
	for(m = 0; m < GameCircle.eventMesgsStack.length ;m++)	{
		//e = GameCircle.eventMesgsStack.pop();
		e = GameCircle.eventMesgsStack[m];
		context.fillText(e.msg, this.STATUS_WIDTH+statusMargin, vertPosStart*msgCt);	
		if(e.life > 0) {
			e.life--;
		} else {
			GameCircle.eventMesgsStack.splice(m,1);
		}
		msgCt++;	
	}
	
	context.restore();
};

/**
 * Draws the status display overlay. 
 */
GameCircle.buildStatusDisplay = function(context) {
	//TODO: Refactor
	//position in upper left corner	
	if(GameCircle.showPlayerStatus) {
		context.save();
		context.translate(0,0);
		
		context.strokeStyle = 'rgb(255, 255, 51)' ;
		context.lineWidth = "0.5";

		//drawFrame
		context.strokeRect(5,5,(this.STATUS_WIDTH-10),this.CANVAS_HEIGHT-10);
		context.fillStyle = "rgba(204, 204, 204, 0.1)";
		context.fillRect(6,6,(this.STATUS_WIDTH-12),this.CANVAS_HEIGHT-12);
		
		//Write some text for Debugging
		context.fillStyle = "#FFFF33"; // Set color to black
		context.fillText("Select:"+GameCircle.selectedMode, 8, 20);
/*		context.fillText("HP: "+GameCircle.player.hp, 8, 40);
		context.fillText("AC: "+GameCircle.player.getArmor(), 8, 60);
		context.fillText("Wep: "+GameCircle.player.weaponWielded.name, 8, 80);*/
		if(GameCircle.selectedTile !== null) {
			context.fillText("SEL: c:"+GameCircle.selectedTile.col+" r:"+GameCircle.selectedTile.row, 8, 100);
		} else {
			context.fillText("SEL: c:0 r:0", 8, 100);
		}
		context.fillText("Col: "+GameCircle.player.getCol()+" Row: "+GameCircle.player.getRow(), 8, 120);
		context.fillText("fps: "+GameCircle.fps,8, 140);
		context.fillText("ctPt-x: "+ ~~(GameCircle.ViewPortCenterX),8, 160);
		context.fillText("ctPt-y: "+ ~~(GameCircle.ViewPortCenterY),8, 180);
		var upperLeft = this.getMapUpperLeftPosition();
		context.fillText("mapPt-x: "+ upperLeft.x,8, 200);
		context.fillText("mapPt-y: "+ ~~(upperLeft.y),8, 220);
		context.restore();
	}
};

/**
 * Computes the upper Left corner of the map which will rarely be 0,0. THis can be used to determine
 * click locations relative to the map.
 * @return the usual point response. {"x":0,"y":0}
 */
GameCircle.getMapUpperLeftPosition = function() {
	var ulX = GameCircle.ViewPortCenterX - GameCircle.player.x;
	var ulY = GameCircle.ViewPortCenterY - GameCircle.player.y;
	return {"x":ulX, "y":ulY};
}

/**
 * Generate rnd number between 2 numbers including the from and to values.
 */
GameCircle.randomInt = function(from, to) {
   return Math.floor(Math.random() * (to - from + 1) + from);
};

/**
 * Random number gen that simulates dice rolls just for simple understanding..
 */
GameCircle.diceRoll = function( sides, numDice) {
	return this.randomInt(sides, sides*numDice);       
};

/**
 * Checks 2 entities to see if they have collided.
 */
GameCircle.checkCollision = function(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
};

/**
 * See if an entity is with-in a given area 
 * 
 * @entity - object created from EntityMaanger with location component.
 * @area - defined area with upperLeft and bottomRight positions.  ex. {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 * @return - true if entity lies with-in area  
 */
GameCircle.inRange = function(entity, area) {
	if(area.upperLeft.row <= entity.getRow() && area.bottomRight.row >= entity.getRow()) {
			if(area.upperLeft.col <= entity.getCol() && area.bottomRight.col >= entity.getCol())
				return true;
	}
	return false;
};

/**
 * Simple helper to simplify the retrival of the players visable area. 
 */
GameCircle.getPlayerVisableArea = function() {
	return this.currentMap.getSurroundingTiles(this.player.getRow(),this.player.getCol(),this.player.vision,this.player.vision);
};

/**
 * To make this work you would register an Objects events
 *From http://www.geekdaily.net/2008/04/02/javascript-defining-and-using-custom-events/
 */
GameCircle.CustomEvent = function() {
	//name of the event
	this.eventName = arguments[0];
	var mEventName = this.eventName;

	//function to call on event fire
	var eventAction = null;

	//subscribe a function to the event
	this.subscribe = function(fn) {
		eventAction = fn;
	};

	//fire the event
	this.fire = function(sender, eventArgs) {
		//this.eventName = eventName2; //Not needed?
		if(eventAction != null) {
			eventAction(sender, eventArgs);
		}
		else {
			alert('There was no function subscribed to the ' + mEventName + ' event!');
		}
	};
};

/**
 * Adds additional CustomeEvents to the listener queue which responds to mouse events.
 */
GameCircle.addMouseEventListener = function(custEvent) {
	if(custEvent && custEvent !== null) {
		this.watchedMouseEvents.push(custEvent);
	}
}

/**
 * 
 */
GameCircle.processMouseEvents = function(mouseEvent){
	for(e = 0 ; e < watchedEvents.length; e++) {
			this.watchedEvents[e].fire(null, {message: eventTestMsg + " " + watchedEvents[e].eventName, event: mouseEvent});
	}
}

/**
 * Debug method to display debug in game.
 */
GameCircle.debug = function(source, msg) {
	if(GameCircle.debugOn){
		GameCircle.addEventMessage("["+source+"] "+msg);
	}
}

/**
 * Check for monster at location.
 * @return the monster at location or null if none.
 */
GameCircle.isMonsterAtTile = function(clickedTile) {
	//TODO: Refactor
	var tileMonster = null;
	if(clickedTile !== null) {
		//TODO: TEST
		for(m = 0; m < GameCircle.monsters.length; m++) {
			var collide = GameCircle.checkCollision(clickedTile, GameCircle.monsters[m]);
			if(collide) {tileMonster = GameCircle.monsters[m]};
		}
	}
	return tileMonster;
}


/**
 * Sets selected Tiles to the Sprite set in GameCircle.placementTile
 */
GameCircle.setSelectedTiles = function() {
	if( GameCircle.selectedTile !== null) {  //addd GameCircle.placementTile !== null &&
		//get range if there is one and set all tiles to the new sprite.
		if(GameCircle.selectedTileEnd != null){
			//set Multi - get the range again.
			range = GameCircle.currentMap.getTileRange(GameCircle.selectedTile, GameCircle.selectedTileEnd);
			for(var r = 0; r < range.length;r++) {
				GameCircle.currentMap.setGridTile(range[r].row,range[r].col,GameCircle.placementTile); 	
			}
		} else {
			GameCircle.currentMap.setGridTile(GameCircle.selectedTile.row,GameCircle.selectedTile.col,GameCircle.placementTile);
		}
	}
}

GameCircle.clearSelectedTiles = function() {
	if( GameCircle.selectedTile !== null) {  //addd GameCircle.placementTile !== null &&
		//get range if there is one and set all tiles to the new sprite.
		if(GameCircle.selectedTileEnd != null){
			//set Multi - get the range again.
			range = GameCircle.currentMap.getTileRange(GameCircle.selectedTile, GameCircle.selectedTileEnd);
			for(var r = 0; r < range.length;r++) {
				GameCircle.currentMap.setGridTile(range[r].row,range[r].col,GameCircle.BLANK); 	
			}
		} else {
			GameCircle.currentMap.setGridTile(GameCircle.selectedTile.row,GameCircle.selectedTile.col,GameCircle.BLANK);
		}
	}
}

/**
 * Setter looks up the Tile by name and sets it as the currently selected edit tile.
 */
GameCircle.setSelectedTileByName = function(tileName) {
	if(tileName === GameCircle.BLANK.name) {
		GameCircle.placementTile = GameCircle.BLANK;
	} else {
		GameCircle.placementTile = GameCircle.currentMap.tileMapManager.getNamedTile(tileName);
	}
}


/****Array mods. These dont actually attach to the Array object..******/

/**
 * Select random item from an Array.
 */
Array.prototype.ramdomItem =  function(){	
	return this[GameCircle.randomInt(0, this.length - 1)];
};

/**
 * Find an object location in an Array.
 */
Array.prototype.indexOf = function (vItem) {
    for (var i=0; i < this.length; i++) {
        if (vItem == this[i]) {
            return i;
        }    }
    return -1;
};
