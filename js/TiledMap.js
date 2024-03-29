/**
 * Here's where we build and manage the Map, also included in this fiel is the SpriteManager.
 */

/**
 * @object TiledMap
 * Manages a Game Map, both the data and rendered images.
 */
function TiledMap(width, height, tileWidth, tileHeight, rowCount, colCount) {
	map = document.createElement('canvas');
	this.rows = rowCount;
	this.cols = colCount;
	height = (~~(height/tileHeight))*tileHeight;
	width = (~~(width/tileWidth))*tileWidth;
	map.width = (~~(width/tileWidth))*tileWidth; //faster then calling floor
	map.height = (~~(height/tileHeight))*tileHeight;
	mapCtx = map.getContext('2d');
	tiles = [];
	BLANK_TILE = '';
	tileMapManager = "";	
}

/**
 * Conveniance wrapper method
 */
TiledMap.prototype.getTileWidth = function() {
	return this.tileMapManager.tileWidth;
}

/**
 * Conveniance wrapper method
 */
TiledMap.prototype.getTileHeight = function() {
	return this.tileMapManager.tileHeight;
}

/**
 * Returns the size of the canvas containing the map. This size is adjusted to fit the tile size.
 TODO: Not being used and has an odd bug. Fix is needed.
 */
//TiledMap.prototype.getMapSize = function() {
//	return {"width":this.width, "height": this.height};
//}

/**
 * Using an x,y point get the tile that contains that point.
 * @param x - x coordinate
 * @param y - y coordinate
 * @return Tile
 */
TiledMap.prototype.getTileAt = function(x,y) {
	//Determine row/col
	var pointCol =  (~~(x/this.tileMapManager.tileWidth))
	var pointRow = (~~(y/this.tileMapManager.tileHeight));
	return this.getTile(pointRow,pointCol);
}

/**
 * Safely grab a single tile from map.
 */
TiledMap.prototype.getTile = function(row, col) {
	if(row <0 || col <0 || row > this.tiles.length || col > this.tiles[0].length){
		return null;
	} else {
		if(col > this.tiles[row].length) {
			return null;
		} 
		return this.tiles[row][col];
	}
		
}

/**
 * Returns a rectangle of tile points around a given map tile, not exceeding the boundry of the map. 
 * 		Values exceeding will be set to the min/max
 * @return rectangle Object with upperLeft and bottomRight points or rectangle. 
 *		ex: {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 */
TiledMap.prototype.getSurroundingTiles = function(startRow, startCol, radialHeight, radialWidth) {
	
	if(!radialHeight || radialHeight < 0) radialHeight = 0;
	if(!radialWidth  || radialWidth < 0) radialWidth = 0;
	
	leftTopPoint = {"row":(startRow-radialHeight),"col":(startCol-radialWidth)}
	rightBottomPoint = {"row":(startRow+radialHeight),"col":(startCol+radialWidth)}
	if(leftTopPoint.row <0) leftTopPoint.row = 0;
	if(leftTopPoint.col <0) leftTopPoint.col = 0;
	if(rightBottomPoint.row > this.rows) rightBottomPoint.row = this.rows;
	if(rightBottomPoint.col > this.cols) rightBottomPoint.col = this.cols;
	
	return 	{"upperLeft":leftTopPoint,"bottomRight":rightBottomPoint}
}


TiledMap.prototype.movementAttributes = { "unpassable":0,"open":1, "locked":2, "slow":3, "blocked":4, "trapped":5, "stairsUp":6, "stairsDown":7, "portal":8}

/**
 * Sets a grid tile to be soemthing other then it was.
 * @param tileData - {"id":1, "type":1}
 */
TiledMap.prototype.setGridTile = function(tileRow, tileCol, tileData) {
	if(!(typeof(tileData) === undefined) && tileData !== null) {
		tile = EntityManager.createEntity('MapTile');
		tile.init(tileData); 
		tile.col = tileCol;
		tile.row = tileRow;
		tile.x = (tile.col*this.tileMapManager.tileWidth); 
		tile.y = (tile.row*this.tileMapManager.tileHeight); 
		tile.width = this.tileMapManager.tileWidth; 
		tile.height = this.tileMapManager.tileHeight;
		GameCircle.currentMap.tiles[tile.row][tile.col] = tile;
	}
}

/**
 * Use to provide control over updating internals when the map layout data changes.
 * Use in place of setting tiles directly or the row/col values wont be set!
 * @param mapData  - data format is [[{"id":0,"type":0},{"id":0,"type":0}],[{"id":0,"type":0},{"id":0,"type":0}]]
 */
TiledMap.prototype.updateMap = function(mapData) {
	this.tiles = [];

	for(var rows = 0; rows < mapData.length ;rows++)
	{
		newCol = [];
		for(var cols = 0; cols < mapData[rows].length; cols++){
			tile = EntityManager.createEntity('MapTile');
			
			if(mapData[rows].length) {
				tile.init(mapData[rows][cols]);
			} else {
				tile.init({});
			}
			tile.col = cols;
			tile.row = rows;
			tile.x = (cols*this.tileMapManager.tileWidth); tile.y = (rows*this.tileMapManager.tileHeight); 
			tile.width = this.tileMapManager.tileWidth; tile.height = this.tileMapManager.tileHeight;
			newCol.push(tile);
			
		}	
		this.tiles[rows] = newCol;		
	}
}

/**
 * Returns the max Cols for all rows.
 */
TiledMap.prototype.getCols = function() {
	colCnt = 0;
	for(x in this.tiles) {
		if(this.tiles[x].length> colCnt){
			colCnt = this.tiles[x].length;
		}
	}
	return colCnt;
}

/**
 * Returns a rendered Map Canvas ready for display on a game canvas. This is cached in a buffer 
 * canvas to speed up rendering.  
 */
TiledMap.prototype.renderMap = function() {	
	this.exploreTiles();
	for(var rows = 0; rows < this.tiles.length ;rows++)
	{
		for(var cols = 0; cols < this.tiles[rows].length; cols++){
			currTile = this.tiles[rows][cols];
			if(currTile.hasOwnProperty('id') && currTile.hasOwnProperty('type')) {
				sprPos = tileMapManager.namedTileOrgPoint(currTile.id);
				tileX = cols*tileMapManager.tileWidth;
				tileY = rows*tileMapManager.tileHeight;
				if(!sprPos) {
					oldFill = mapCtx.fillStyle;
					mapCtx.fillStyle = GameCircle.backgroundColor; 
					mapCtx.fillRect(tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
					mapCtx.fillStyle = oldFill;
					continue;
				}
				if(GameCircle.lightsOn == false && currTile.explored == false){
					//TODO: If anything with visability comes up heres where its a problem no doubt. ;)
					continue; //not visable yet, skip render
				} else {				
					
					mapCtx.drawImage(tileMapManager.spriteImage, sprPos.xPos, sprPos.yPos, tileMapManager.tileWidth, tileMapManager.tileHeight, tileX,tileY, tileMapManager.tileWidth, tileMapManager.tileHeight);
				}
			}
		}
	}
	return mapCtx.canvas;
}

/**
 * Make tiles in player range visable.
 {"upperLeft":{"row":0,"col":0},"bottomRight":{"row":0,"col":0}}
 */
TiledMap.prototype.exploreTiles = function() {	
	expArea = this.getSurroundingTiles(GameCircle.player.getRow(),GameCircle.player.getCol(),GameCircle.player.vision,GameCircle.player.vision);
	maxRow = (expArea.bottomRight.row>this.tiles.length)?this.tiles.length:expArea.bottomRight.row;
	for(var rows = expArea.upperLeft.row; rows < maxRow ;rows++) {
		bRight = (expArea.bottomRight.col>this.tiles[rows].length-1)?this.tiles[rows].length-1:expArea.bottomRight.col
		for(var cols = expArea.upperLeft.col; cols <= bRight; cols++){
			this.tiles[rows][cols].explored = true;	
		}
	}
}

/**
 * Given start and end point tiles, return multi array of tiles in range.
 */
TiledMap.prototype.getTileRange = function(tileStart, tileEnd) {	
	range = [];
	
	//make sure the right tile is set to start since the click start and end could be reversed.
	leftStartRow = (tileStart.row > tileEnd.row) ? tileEnd.row : tileStart.row;
	leftStartCol = (tileStart.col > tileEnd.col) ? tileEnd.col : tileStart.col;
	bottomEndRow = (tileEnd.row < tileStart.row) ? tileStart.row: tileEnd.row;
	bottomEndCol = (tileEnd.col < tileStart.col) ? tileStart.col: tileEnd.col;
	
	upperLeft = this.getTile(leftStartRow,leftStartCol);
	bottomRight = this.getTile(bottomEndRow,bottomEndCol);
	
	for(var rows = upperLeft.row; rows <= bottomRight.row ;rows++) {
		for(var cols = upperLeft.col; cols <= bottomRight.col; cols++){					
			range.push(this.getTile(rows,cols));
		}
	}
	
	return range;
}
