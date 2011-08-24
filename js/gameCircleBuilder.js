//Set Static Values on the GameCircle
GameCircle.CANVAS_WIDTH = 1000;
GameCircle.CANVAS_HEIGHT = 600;
GameCircle.STATUS_WIDTH = 100;
GameCircle.DisplayGrid = true;
GameCircle.lightsOn = false;
GameCircle.lastUpdate = Date.now();

var context;

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	var body = $(this).find("body");
	
	GameCircle.CANVAS_WIDTH = window.innerWidth;//body.width();
	GameCircle.CANVAS_HEIGHT = window.innerHeight;//body.height();
	
	//Create canvas
	var canvasElement = $("<canvas width='" + GameCircle.CANVAS_WIDTH + 
                      "' height='" + GameCircle.CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, GameCircle.CANVAS_WIDTH, GameCircle.CANVAS_HEIGHT ) ;
	
	//TODO refactor this into GameCircle.tiledMap. Build load process to set theis up.
	GameCircle.currentMap = new TiledMap(GameCircle.CANVAS_WIDTH+300,GameCircle.CANVAS_HEIGHT+300,32,32);

	//add fake player sprite, centerd in middle of screen
	GameCircle.player = EntityManager.createEntity('Player');
	GameCircle.player.x = (3*32);
	GameCircle.player.y = (11*32);
	GameCircle.player.name = "Lee";
	GameCircle.player.spriteImg.src = "res/player.png";
	//GameCircle.player.deadImg.src = "res/bones.png";
	
	
	setUpPlayerImg();

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]};
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	//'id' is the sprite id and type is the 
	//TODO: This should be loaded from the saved data.
	mapTiles = [
				[{},{}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{"id":1, "type":1},{"id":2, "type":2},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{},{},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],				
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],
				[{},{},{"id":0, "type":0},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":3, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":1, "type":1},{"id":0, "type":0}],		
				[{},{},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0},{"id":0, "type":0}]
		];
	GameCircle.currentMap.tileMapManager = tileMapManager;
	GameCircle.currentMap.updateMap(mapTiles);
	
	//draw to canvas		
	GameCircle.render();
	setInterval(main, 30);
}

/**
 * Capture click events to use for game play.
 */
window.addEventListener("mousedown", function(e) {
  //GameCircle.addEventMessage(("Mouse Event [ button="+e.button+" pageX=" + e.pageX + " pageY=" + e.pageY));
  GameCircle.mouseQueue.push(e);
  GameCircle.mouseClick = e;
}, false);


/**
 * Do something with click events. Only want to fire this every 250ms to allow time for dblCLick detection.
 * @param lastMouseEvent number of ms since last processing of mouse events. reset to 0 if over the dblClcik tie limit.
 */
function handleInput() {
  // Here is where we respond to the click
  if(GameCircle.mouseQueue.length > 0 && GameCircle.lastMouseEvent > GameCircle.dblClickTimeLimit) {   
    var mEvent = GameCircle.mouseQueue.pop();
    var upperLeft = GameCircle.getMapUpperLeftPosition();
    
    var mapClickPoint = {"x":~~(mEvent.x-upperLeft.x), "y":~~(mEvent.y-upperLeft.y)};
    
    var clickedTile = GameCircle.currentMap.getTileAt(mapClickPoint.x, mapClickPoint.y);
	if(clickedTile !== null) {	
		//Note: Select is drawn when rendering the grid.
		if(keydown.ctrl) {
			if(GameCircle.selectedTileRangeStart == null) {
				//Assume Start
				GameCircle.selectedTile == clickedTile;
			} else {
				//Set end
				GameCircle.selectedTileEnd == clickedTile;
			}
		} else {
			GameCircle.selectedTile = clickedTile;
			GameCircle.selectedTileEnd = null;
			//TODO: Verify above needs to be done.
		}		
		
	}
	
	 
    GameCircle.mouseClick = null;
    GameCircle.lastMouseEvent = 0;
  }
};

var tics = 0;
/**
 * The main processing is done by calling this in the thread loop. 
 */
function main () {
	tics += 1; //test for moving creatures to a speed.
	GameCircle.lastMouseEvent += GameCircle.elapsed;
	handleInput();
	update();
	/*if(tics%30===0) {
		//TODO: Add check to ping server for data update.	
	}*/
	GameCircle.render();
};


window.onload = windowReady;

//TODO: Decide if this is really used.
//TODO: REMOVE this is for testing only,  with out running a game loop.  add key_status.js to html page for actual support.
$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
    //fakeLoop();
  });
  
  /*$(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
    //fakeLoop(); //Forcing an update outside of thread loop
  });*/
});

/*function fakeLoop() {
	update();
	GameCircle.render();
}
//REMOVE: TESTING only

/**
 * Update User Center point if they press keys etc. Also update changes in screen state.
 */
function update() {
  mover = new Mover();
  if(keydown.ctrl) {
	  if(keydown.x){
		GameCircle.debugOn = (GameCircle.debugOn)?false:true;
		GameCircle.addEventMessage("debug On.");
		keydown.x = false;
	  }
	  keydown.ctrl = false;
  }
  
  //Esc clears things like selected tile
  if (keydown.esc) {
	GameCircle.selectedTile = null;	
	GameCircle.selectedTileEnd = null;
	keydown.esc = false;
  }
  
  if (keydown.left) {
	keydown.left = false;
	mover.movePlayer(GameCircle.player, -32,0, Mover.MoveDir.LEFT);
  }

  if (keydown.right) {
	keydown.right = false;
	mover.movePlayer(GameCircle.player, 32,0, Mover.MoveDir.RIGHT);
  }
  
  if (keydown.up) {
	keydown.up = false;
	mover.movePlayer(GameCircle.player, 0,-32, Mover.MoveDir.UP);
  }
  
  if (keydown.down) {
	keydown.down = false;
	mover.movePlayer(GameCircle.player, 0,32, Mover.MoveDir.DOWN);
  }
  
  /**
   * TEMP toggle between sword and bow for testing 
   */
  /*if(keydown['2']) {
	GameCircle.player.weaponWielded = EntityManager.weaponFactory('Bow');
	keydown['2'] = false;
  }
  
  if(keydown['1']) {
	GameCircle.player.weaponWielded = EntityManager.weaponFactory('Sword');
	keydown['1'] = false;
  }
  */
  if (keydown.f2) {
	keydown.f2 = false;
	//toggle display stats bar
	GameCircle.showPlayerStatus = (GameCircle.showPlayerStatus)?false:true;
  }
  
  //Test attack animation
/*  if (keydown.a) {
	keydown.a = false;
	GameCircle.player.currentSequence = 'attack_left'
  }
*/  
  if(keydown.g) {
	GameCircle.DisplayGrid = (GameCircle.DisplayGrid)?false:true;
	keydown.g = false;
  }
  
}

//TODO: remove this.
function setUpPlayerImg() {
	var player_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/hero2.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0},
		{"id":1,"name":"FRONT_RT","col":1,"row":0},
		{"id":2,"name":"FRONT_LT","col":2,"row":0},
		{"id":3,"name":"FRONT_SW","col":3,"row":0},
		{"id":4,"name":"LEFT_1","col":0,"row":1},
		{"id":5,"name":"LEFT_2","col":1,"row":1},
		{"id":6,"name":"LEFT_3","col":2,"row":1},
		{"id":7,"name":"LEFT_4","col":3,"row":1},
		{"id":8,"name":"RIGHT_1","col":0,"row":2},
		{"id":9,"name":"RIGHT_2","col":1,"row":2},
		{"id":10,"name":"RIGHT_3","col":2,"row":2},
		{"id":11,"name":"RIGHT_4","col":3,"row":2},
		{"id":12,"name":"BACK_1","col":0,"row":3},
		{"id":13,"name":"BACK_2","col":1,"row":3},
		{"id":14,"name":"BACK_3","col":2,"row":3},
		{"id":15,"name":"BACK_4","col":3,"row":3},
		{"id":16,"name":"DEAD","col":0,"row":4},
	]};
	var attackAnimation = [{"name":"attack_left",
		"sequence":[6,5,4,5,6,7,6,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.LEFT},
		{"name":"attack_right",
		"sequence":[10,9,8,9,10,11,10,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.RIGHT},
		{"name":"attack_up",
		"sequence":[13,12,13,14,13,15,13,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.UP},
		{"name":"attack_down",
		"sequence":[0,3,0,2,0], 
		"sequenceFrameDuration":4,
		"direction":Mover.MoveDir.DOWN}
		];
		
	GameCircle.player.initSpriteManager(player_testManagerConfig,attackAnimation);
}


function setDragonImg(monster){
	var monster_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dragon.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0}]};
		
	var monsterAnimation = 	[{"name":"nothing",
		"sequence":[0], 
		"sequenceFrameDuration":4}];
		
	monster.initSpriteManager(monster_testManagerConfig,monsterAnimation);
}



