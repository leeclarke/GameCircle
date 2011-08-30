/**
 * Just utils for rendering to the canvas
 */

function paintGrid(context, mapWidth, mapHeight) {

	context.strokeStyle = GameCircle.GridColor;
	
	context.lineWidth = "0.5";
	gridWidth = ~~(mapWidth/GameCircle.currentMap.getTileWidth());
	gridHeight = ~~(mapHeight/GameCircle.currentMap.getTileHeight());
	
	//drawFrame
	context.strokeRect(0,0,mapWidth,mapHeight);
	
	context.lineWidth = "0.25";
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = GameCircle.currentMap.getTileWidth()*x;
		drawLine(context,xPos,0,xPos,mapHeight);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = GameCircle.currentMap.getTileHeight()*y;
		drawLine(context,0,yPos,mapWidth,yPos);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//IF tile is selected highlite it.
	drawSelectBoxOnGrid(context);
}

/**
 * Line Drawing Helper
 */
function drawLine(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
}

/**
 * When a grid square is clicked it becomes selected and the borders change colors. If the End tile is not null 
 * include all selected squares in selected grid.
 *
 * Note: Select is drawn when rendering the grid.
 */
 function drawSelectBoxOnGrid(context) {
 	if(GameCircle.selectedTile !== null){
 		if(GameCircle.selectedTileEnd === null) { 	
 			drawSingleSquareSelect(context, GameCircle.selectedTile);
		} else { //Draw square range.
			tileRange = GameCircle.currentMap.getTileRange(GameCircle.selectedTile, GameCircle.selectedTileEnd);
		
			for(var t = 0; t < tileRange.length ;t++) {
				drawSingleSquareSelect(context, tileRange[t]);
			}
		}
 	}
 }

/**
 * Draws the box around the given grid tile.
 */
function drawSingleSquareSelect(context, selectedTile) {
	leftX = selectedTile.col*selectedTile.width;
	leftY = selectedTile.row*selectedTile.height;

	context.strokeStyle = 'rgb(0, 204, 0)' ;//green
	context.lineWidth = "0.75";

	drawLine(context,leftX, leftY, leftX+selectedTile.width,leftY);
	drawLine(context,leftX, leftY, leftX,leftY+selectedTile.height);
	drawLine(context,leftX, leftY+selectedTile.height, leftX+selectedTile.width, leftY+selectedTile.height);
	drawLine(context,leftX+selectedTile.width, leftY, leftX+selectedTile.width,leftY+selectedTile.height);
}

/**
 * Renders a tile Sprite to a 2d context ad the x,y position. 
 */
function renderTile(targetContext, tileSprite, x, y) {
	if(targetContext != null){
		targetContext.drawImage(GameCircle.currentMap.tileMapManager.spriteImage, tileSprite.xPos, tileSprite.yPos, 
			GameCircle.currentMap.tileMapManager.tileWidth, GameCircle.currentMap.tileMapManager.tileHeight, 
			x,y, GameCircle.currentMap.tileMapManager.tileWidth, GameCircle.currentMap.tileMapManager.tileHeight);
		
	}
}


/**
 * Should check to see if can log..
 */
function debug(msg){
	if (window.console && window.console.firebug) {
		console.log(msg);
	}
}
