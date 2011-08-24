/**
 * Just utils for rendering to the canvas
 */

function paintGrid(context, mapWidth, mapHeight) {
//TODO: Extract to configurable properties. Same with grid line thickness?
	context.strokeStyle = 'rgb(255, 255, 51)' ;
	
	context.lineWidth = "0.5";
	gridWidth = ~~(mapWidth/GameEngine.currentMap.getTileWidth());
	gridHeight = ~~(mapHeight/GameEngine.currentMap.getTileHeight());
	
	//drawFrame
	context.strokeRect(0,0,mapWidth,mapHeight);
	
	context.lineWidth = "0.25";
	//drawVert
	for(x = 0; x<= gridWidth; x++) {
		xPos = GameEngine.currentMap.getTileWidth()*x;
		drawLine(context,xPos,0,xPos,mapHeight);
		context.fillRect(xPos,2, 2, 2) ;
	}
	
	//drawHorz
	for(y = 0; y<= gridWidth; y++) {
		yPos = GameEngine.currentMap.getTileHeight()*y;
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
 * When a grid square is clicked it becomes selected and the borders change colors.
 */
 function drawSelectBoxOnGrid(context) {
 	if(GameEngine.selectedTile !== null){
		selTile = GameEngine.selectedTile;
		
		//Get uperleftCorner
		leftX = selTile.col*selTile.width;
		leftY = selTile.row*selTile.height;
		
		context.strokeStyle = 'rgb(0, 204, 0)' ;//green
		context.lineWidth = "0.75";
		
		drawLine(context,leftX, leftY, leftX+selTile.width,leftY);
		drawLine(context,leftX, leftY, leftX,leftY+selTile.height);
		drawLine(context,leftX, leftY+selTile.height, leftX+selTile.width, leftY+selTile.height);
		drawLine(context,leftX+selTile.width, leftY, leftX+selTile.width,leftY+selTile.height);
 	}
 }
