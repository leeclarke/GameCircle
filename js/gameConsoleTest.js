//Set Static Values on the GameEngine
GameEngine.CANVAS_WIDTH = 1000;
GameEngine.CANVAS_HEIGHT = 600;
GameEngine.STATUS_WIDTH = 100;
GameEngine.DisplayGrid = true;
GameEngine.lightsOn = false;
GameEngine.lastUpdate = Date.now();

var context;

/**
 * WindowReady used for starting up the game prototype.
 *
 * This simulates an actual game client
 */
function windowReady() {
	var body = $(this).find("body");
	
	GameEngine.CANVAS_WIDTH = window.innerWidth;//body.width();
	GameEngine.CANVAS_HEIGHT = window.innerHeight;//body.height();
	
	//Create canvas
	var canvasElement = $("<canvas width='" + GameEngine.CANVAS_WIDTH + 
                      "' height='" + GameEngine.CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	//Set up background.
	context.fillStyle = 'rgb(0, 0, 0)' ;
	context.fillRect(0, 0, GameEngine.CANVAS_WIDTH, GameEngine.CANVAS_HEIGHT ) ;
	
	//TODO refactor this into GameEngine.tiledMap.
	GameEngine.currentMap = new TiledMap(GameEngine.CANVAS_WIDTH+300,GameEngine.CANVAS_HEIGHT+300,32,32);

	//add fake player sprite, centerd in middle of screen
	GameEngine.player = EntityManager.createEntity('Player');
	GameEngine.player.x = (3*32);
	GameEngine.player.y = (11*32);
	GameEngine.player.name = "Lee";
	GameEngine.player.spriteImg.src = "res/player.png";
	//GameEngine.player.deadImg.src = "res/bones.png";
	GameEngine.player.weaponWielded = EntityManager.weaponFactory('Sword');
	
	setUpPlayerImg();
	//set up player spriteSheet for animation. ABOVE	
	 
	
	//Test Monster
	dragon = EntityManager.createCreature('Green Dragon');
	dragon.x = 12*32;
	dragon.y = 8*32;
	dragon.name = "Green Dragon";
	dragon.spriteImg.src = "res/dragon.png";
	dragon.deadImg.src = "res/bones.png";
	dragon.agression = 7; //yikes!
	dragon.range = 5;
	dragon.hp = 8;
 	dragon.hpMax = 8;
 	setDragonImg(dragon);
	
	GameEngine.monsters.push(dragon);
	
	dragon2 = EntityManager.createCreature('Green Dragon');
	dragon2.x = 3*32;
	dragon2.y = 4*32;
	dragon2.name = "Puff The Dragon";
	dragon2.spriteImg.src = "res/dragon.png";
	dragon2.deadImg.src = "res/bones.png";
	dragon2.agression = 2;
	dragon2.range = 4;
	dragon2.hp = 9;
	dragon2.ac = 10;
 	dragon2.hpMax = 8;
	setDragonImg(dragon2);
	
	GameEngine.monsters.push(dragon2);
	
	dragon3 = EntityManager.createCreature('Green Dragon');
	dragon3.x = 14*32;
	dragon3.y = 13*32;
	dragon3.name = "Green Dragon";
	dragon3.spriteImg.src = "res/dragon.png";
	dragon3.deadImg.src = "res/bones.png";
	dragon3.agression = 7; //yikes!
	dragon3.range = 5;
	dragon3.hp = 8;
 	dragon3.hpMax = 8;
 	setDragonImg(dragon3);
	
	GameEngine.monsters.push(dragon3);

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":1,"row":6}
	]};
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	//'id' is the sprite id and type is the 
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
	GameEngine.currentMap.tileMapManager = tileMapManager;
	GameEngine.currentMap.updateMap(mapTiles);
	
	//draw to canvas		
	GameEngine.render();
	setInterval(main, 30);
}

/**
 * Capture click events to use for game play.
 */
window.addEventListener("mousedown", function(e) {
  //GameEngine.addEventMessage(("Mouse Event [ button="+e.button+" pageX=" + e.pageX + " pageY=" + e.pageY));
  GameEngine.mouseQueue.push(e);
  GameEngine.mouseClick = e;
}, false);


/**
 * Capture dblclick events to use for game play.
 *
window.addEventListener("dblclick", function(e) {
	/*TODO: this will only work if I create some sort of queing of clicks with  sshort delay giving time 
	 * for the dblckcik to happen 
	 * then I need to inspect the stack and popoff the 2 clicks that come before the dblClcik. PIA?
  GameEngine.addEventMessage(("Mouse dblClick Event [ button="+e.button+" pageX=" + e.pageX + " pageY=" + e.pageY));
  GameEngine.mouseQueue.push(e);
  GameEngine.mouseClick = e;
}, false);*/

/**
 * Do something with click events. Only want to fire this every 250ms to allow time for dblCLick detection.
 * @param lastMouseEvent number of ms since last processing of mouse events. reset to 0 if over the dblClcik tie limit.
 */
function handleInput() {
	
  // Here is where we respond to the click
  if(GameEngine.mouseQueue.length > 0 && GameEngine.lastMouseEvent > GameEngine.dblClickTimeLimit) {   
    var mEvent = GameEngine.mouseQueue.pop();
    var upperLeft = GameEngine.getMapUpperLeftPosition();
    
    var mapClickPoint = {"x":~~(mEvent.x-upperLeft.x), "y":~~(mEvent.y-upperLeft.y)};
    
    var clickedTile = GameEngine.currentMap.getTileAt(mapClickPoint.x, mapClickPoint.y);
	if(clickedTile === null) {
		return; //user probably clicked outside the map, do nothing.
	}
	
	var monsterAtTile = GameEngine.isMonsterAtTile(clickedTile);
	//If missile then create one and set start pos as center of player tile.
	if(monsterAtTile !== null && monsterAtTile.alive && GameEngine.player.weaponWielded.weaponType === 'bow'){
		var missile = EntityManager.createEntity('missile')//TODO Create factory
		missile.currentPosition.x = GameEngine.player.x + ~~(GameEngine.player.spriteManager.tileWidth/2);
		missile.currentPosition.y = GameEngine.player.y + ~~(GameEngine.player.spriteManager.tileHeight/2);
		monsterAtTile.hostile = true;
		missile.target = monsterAtTile;
		GameEngine.missiles.push(missile);
		//TODO: monster doesnt come alive unless call moveMonsters but this doesnt make since. goingto have to trace it.
		GameEngine.moveMonsters();
	} else {
		//TODO: Check why the col and rows are off. YThey seem to be passed right.
		var clickPath = a_star(GameEngine.player,clickedTile, GameEngine.currentMap);
		if(clickPath.length > 1) {
			//TODO: pull mover into GameEngine
			try{
				var moveDir = Mover.determineDirection(GameEngine.player, clickPath[1]);
				
				mover.movePlayer(GameEngine.player, (Mover.Coordinates[moveDir].x) , (Mover.Coordinates[moveDir].y), moveDir);
				GameEngine.moveMonsters();//TODO: seems like this is going to put things out of sequence since update is called adter this method.
			}
			catch(e) {
				GameEngine.addEventMessage("MouseIn Broke: "+e);
			}
		}
	}
	
     
    GameEngine.mouseClick = null;
    GameEngine.lastMouseEvent = 0;
  }
};

var tics = 0;
/**
 * The main processing is done by calling this in the thread loop. 
 */
function main () {
	tics += 1; //test for moving creatures to a speed.
	GameEngine.lastMouseEvent += GameEngine.elapsed;
	handleInput();
	GameEngine.processMissilesInFlight(context);
	update();
	if(tics%30===0) {
		GameEngine.moveMonsters();
	}
	GameEngine.render();
};


window.onload = windowReady;


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
	GameEngine.render();
}
//REMOVE: TESTING only

/**
 * Update player and Monster postion based on input.
 */
function update() {
  mover = new Mover();
  if(keydown.ctrl) {
	  if(keydown.x){
		GameEngine.debugOn = (GameEngine.debugOn)?false:true;
		GameEngine.addEventMessage("debug On.");
		keydown.x = false;
	  }
	  keydown.ctrl = false;
  }
  
  if (keydown.left) {
	keydown.left = false;
	mover.movePlayer(GameEngine.player, -32,0, Mover.MoveDir.LEFT);
	//GameEngine.moveMonsters();
  }

  if (keydown.right) {
	keydown.right = false;
	mover.movePlayer(GameEngine.player, 32,0, Mover.MoveDir.RIGHT);
	//GameEngine.moveMonsters();
  }
  
  if (keydown.up) {
	keydown.up = false;
	mover.movePlayer(GameEngine.player, 0,-32, Mover.MoveDir.UP);
	//GameEngine.moveMonsters();
  }
  
  if (keydown.down) {
	keydown.down = false;
	mover.movePlayer(GameEngine.player, 0,32, Mover.MoveDir.DOWN);
	//GameEngine.moveMonsters();
  }
  
  /**
   * TEMP toggle between sword and bow for testing 
   */
  if(keydown['2']) {
	GameEngine.player.weaponWielded = EntityManager.weaponFactory('Bow');
	keydown['2'] = false;
  }
  
  if(keydown['1']) {
	GameEngine.player.weaponWielded = EntityManager.weaponFactory('Sword');
	keydown['1'] = false;
  }
  
  if (keydown.f2) {
	keydown.f2 = false;
	//toggle display stats bar
	GameEngine.showPlayerStatus = (GameEngine.showPlayerStatus)?false:true;
  }
  
  //Test attack animation
  if (keydown.a) {
	keydown.a = false;
	GameEngine.player.currentSequence = 'attack_left'
  }
  
  if(keydown.g) {
	GameEngine.DisplayGrid = (GameEngine.DisplayGrid)?false:true;
	keydown.g = false;
  }
  
}


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
		
	GameEngine.player.initSpriteManager(player_testManagerConfig,attackAnimation);
}


function setDragonImg(monster){
	var monster_testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dragon.png", "namedTiles":[
		{"id":0,"name":"FRONT","col":0,"row":0}]};
		
	var monsterAnimation = 	[{"name":"nothing",
		"sequence":[0], 
		"sequenceFrameDuration":4}];
		
	monster.initSpriteManager(monster_testManagerConfig,monsterAnimation);
}



