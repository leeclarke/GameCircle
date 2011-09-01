/**
 * FileManager loads and saves map files. 
 */
function FileManager(){
	SAVE_PREFIX = "GameCircle_";
};

FileManager.save = function(fileId) {
	localStorage[SAVE_PREFIX+fileId] = JSON.stringify(GameCircle.getAdventureData());
}

/**
 * Loads saved Adventure file from storage.
 */
FileManager.load = function(fileId) {
	if(fileId !== null) {
		//TODO: Add checks for local/web
		
		var objStr = localStorage[SAVE_PREFIX+fileId];
		var formDataParse;
		if(objStr && objStr.length >2){
			formDataParse = jQuery.parseJSON(objStr);
			debug("FileManager == "+formDataParse + " name==" + formDataParse.$recName);
		}
		
		setFormValues(formData);
	
	} else {
		return FileManager.newFile(30, 30);
	}
}


/**
 * Creates a new Adventure file with assigned dimentions.
 */
FileManager.newFile = function(advName, rows, cols){
	var newAdventure = jQuery.extend(true, {}, emptyAdventureFile);
	newAdventure.adventureId = advName;
	newAdventure.mapData.rows = rows;
	newAdventure.mapData.cols = cols;  //TODO: do these really need to be here?
	mapData = [];
	for(var r = 0; r < rows ;r++)
	{
		newCol = [];
		for(var c = 0; c < cols; c++){
			tile = EntityManager.createEntity('MapTile')
			tile.init({"id":-1, "type":-1});
			tile.col = cols;
			tile.row = rows;
			//TODO: Check GameCircle.currentMap.getTileHeight() for null and if so get data from this object.
			
			tile.x = (cols*newAdventure.tileManConfig.tileWidth); tile.y = (rows*newAdventure.tileManConfig.tileHeight); 
			tile.width = newAdventure.tileManConfig.tileWidth; tile.height = newAdventure.tileManConfig.tileHeight;
			newCol.push(tile);
			
		}	
		newAdventure.mapData.map.push(newCol);		
	}
	
	
	return newAdventure;
}

emptyAdventureFile = {
"adventureId":"Test",
"prefs":{"gridColor":"", "bgColor":"#000", "placementTile":{"id":-1, "type":-1}},
"tileManConfig":{"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0, "group":"wall"},
		{"id":1,"name":"FLOOR1","col":1,"row":8, "group":"floor"},
		{"id":2,"name":"DOOR1","col":4,"row":2, "group":"door"},
		{"id":3,"name":"DOOR2","col":0,"row":1, "group":"door"},
		{"id":4,"name":"DOOR3","col":0,"row":2, "group":"door"},
		{"id":5,"name":"DOOR4","col":0,"row":3, "group":"door"},
		{"id":6,"name":"WALL2","col":0,"row":4, "group":"wall"},
		{"id":7,"name":"WALL3","col":0,"row":5, "group":"wall"},
		{"id":8,"name":"DOOR5","col":0,"row":6, "group":"door"},
		{"id":9,"name":"DOOR6","col":0,"row":7, "group":"door"},
		{"id":10,"name":"FLOOR2","col":0,"row":8, "group":"floor"},
		{"id":11,"name":"FLOOR3","col":0,"row":9, "group":"floor"},
		{"id":12,"name":"DOOR7","col":2,"row":2, "group":"door"},
		{"id":13,"name":"DOOR8","col":2,"row":3, "group":"door"},
		{"id":14,"name":"DOOR9","col":2,"row":5, "group":"door"},
		{"id":15,"name":"DOOR10","col":2,"row":6, "group":"door"}		
	]},
"mapData":{
	"title":"Test Map",
	"rows":30,
	"cols":30,
	"createTimeDate":"",
	"updateTimeDate":"",
	"map":	[]
	}
};

/* Reference sample file for validation of test and documentation.*/
stubMapFile = {
"adventureId":"Test",
"prefs":{"gridColor":"", "bgColor":"#000", "placementTile":{"id":-1, "type":-1}},
"tileManConfig":{"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]},
"mapData":{
	"title":"Test Map",
	"rows":30,
	"cols":30,
	"createTimeDate":"",
	"updateTimeDate":"",
	"map":	[[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{"id":1, "type":1},{"id":2, "type":2},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{}],
			[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],				
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],		
			[{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
			[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
	]}};
