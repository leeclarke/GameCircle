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
	
	GameCircle.CANVAS_WIDTH = window.innerWidth;
	GameCircle.CANVAS_HEIGHT = window.innerHeight;
	
	//Create canvas
	var canvasElement = $("<canvas width='" + GameCircle.CANVAS_WIDTH + 
                      "' height='" + GameCircle.CANVAS_HEIGHT + "'></canvas>");
	context = canvasElement.get(0).getContext("2d");
	canvasElement.appendTo('body');
	
	//Set up background.
	context.fillStyle = GameCircle.backgroundColor;//'rgb(0, 0, 0)' ;  //TODO: Config Param.
	context.fillRect(0, 0, GameCircle.CANVAS_WIDTH, GameCircle.CANVAS_HEIGHT ) ;
	
	//TODO refactor this into GameCircle.tiledMap. Build load process to set this up.
	GameCircle.currentMap = new TiledMap(GameCircle.CANVAS_WIDTH+300,GameCircle.CANVAS_HEIGHT+300,32,32, 26,26);

	//TODO: This esentally sets the point of view of the view port. should probably default to centered.
	GameCircle.player = EntityManager.createEntity('Player');
	GameCircle.player.x = (3*32);
	GameCircle.player.y = (11*32);
	GameCircle.player.name = "DM";
	GameCircle.player.spriteImg.src = "res/player.png";

	testManagerConfig = {"tileWidth":32, "tileHeight":32, "src":"res/dungeontiles.gif", "namedTiles":[
		{"id":0,"name":"WALL1","col":0,"row":0},
		{"id":1,"name":"FLOOR1","col":1,"row":8},
		{"id":2,"name":"DOOR1","col":4,"row":2},
		{"id":3,"name":"DOOR2","col":0,"row":1},
		{"id":4,"name":"DOOR3","col":0,"row":2},
		{"id":5,"name":"DOOR4","col":0,"row":3},
		{"id":6,"name":"WALL2","col":0,"row":4},
		{"id":7,"name":"WALL3","col":0,"row":5},
		{"id":8,"name":"DOOR5","col":0,"row":6},
		{"id":9,"name":"DOOR6","col":0,"row":7},
		{"id":10,"name":"FLOOR2","col":0,"row":8},
		{"id":11,"name":"FLOOR3","col":0,"row":9},
		{"id":12,"name":"DOOR7","col":2,"row":2},
		{"id":13,"name":"DOOR8","col":2,"row":3},
		{"id":14,"name":"DOOR9","col":2,"row":5},
		{"id":15,"name":"DOOR10","col":2,"row":6}		
	]};
	
	tileMapManager = new SpriteTileManager(testManagerConfig);

	GameCircle.currentMap.tileMapManager = tileMapManager;
	mapTiles = FileManager.newFile(30,30);
	
	GameCircle.currentMap.updateMap(mapTiles);
	
	//TODO: set for test, in Edit Mode it should always be true.
	GameCircle.lightsOn = true;
	//TODO: For testing setting a default Sprite Tile, remove later.
	GameCircle.placementTile = {"id":1,"name":"FLOOR1","col":1,"row":8};
	
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
		if(GameCircle.selectedMode) {
			if(GameCircle.selectedTile == null) {
				GameCircle.selectedTile = clickedTile;
			} else {
				GameCircle.selectedTileEnd = clickedTile;
			}
		} else {
			GameCircle.selectedTile = clickedTile;
			GameCircle.selectedTileEnd = null;
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
  
  if(keydown.alt && keydown.s) {
	GameCircle.selectedMode = !GameCircle.selectedMode;
	keydown.s = false;
	keydown.alt = false;
  }
  
  if(keydown.alt && keydown.z) {
  	GameCircle.setSelectedTiles();
  	keydown.z = false;
  	keydown.alt = false;
  }

  if(keydown.alt && keydown.x) {
  	GameCircle.clearSelectedTiles();
  	keydown.x = false;
  	keydown.alt = false;
  }
  
  if(keydown.alt && keydown.d) {
	openDialog('#dialog', '<p>This is just a test dialog<br><button type="button" onclick="hideDialog();">Click Me!</button></p>');
	keydown.d = false;
  	keydown.alt = false;
  }
  
  if(keydown.alt && keydown.t) {
	displayToolPallet();
	keydown.t = false;
  	keydown.alt = false;
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
 
  if(keydown.g) {
	GameCircle.DisplayGrid = (GameCircle.DisplayGrid)?false:true;
	keydown.g = false;
  }
  
}

/**
 * Open Dialog above Canvas for data input.
 */
function openDialog(id, content){
	    var maskHeight = $(document).height();
        var maskWidth = $(window).width();
     
        //Set height and width to mask to fill up the whole screen
        $('#mask').css({'width':maskWidth,'height':maskHeight});
         
        //transition effect     
        $('#mask').fadeIn(1000);    
        $('#mask').fadeTo("slow",0.8);  
     
        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
               
        //Set the popup window to center
        $(id).html(content);
        $(id).css('top',  winH/2-$(id).height()/2);
        $(id).css('left', winW/2-$(id).width()/2);
     
        //transition effect
        $(id).fadeIn(1000); 
}

/**
 * Display Dialog w/o mask
 */
function openToolDialog(id, content, top, left){
	    var maskHeight = $(document).height();
        var maskWidth = $(window).width();
		
        //Set the popup window to center
        $(id).html(content);
        $(id).css('top',  top);
        $(id).css('left', left);
     
        //transition effect
        $(id).fadeIn(1000); 
}

/**
 * Hides any visable dialog box.
 */
function hideDialog() {
	$('#mask').hide();
    $('.window').hide();
}

/**
 * Builds the ToolShelf with Tile Pallet
 */
function displayToolPallet() {
	if(GameCircle.activeDialog === null | GameCircle.activeDialog !== 'toolPallet') {  
		$('#dialog').css('width',  '200px');
		$('#dialog').css('height', '400px');
		$('#dialog').css('background-color',  '#ffffcc');
		GameCircle.activeDialog = 'toolPallet';
		tileName = (typeof GameCircle.placementTile.name != 'undefined' || GameCircle.placementTile.name != null)?GameCircle.placementTile.name:"UnNamed Tile"
		var palletContent = $("<div></div>");
		
		// Mode indicators.
		var statusContent = $("<div></div>");
		stat = (GameCircle.selectedMode)?'<span style="color:green">ON</span>':'OFF';
		$('<b>Multi-Select:</b>&nbsp;' + stat + '<br>').appendTo(statusContent);
		//$('<b>Multi-Select:&nbsp;<br>').appendTo(statusContent);
		statusContent.appendTo(palletContent);
		
		$('<b>Selected Tile:</b>&nbsp;'+tileName+'<hr>').appendTo(palletContent);

		//Draw Pallet Selector
		var palletSelector = $("<div id='palletSelector'></div>");
		palletSelector.css('border','1px solid #333333');
		//TODO: Compute count of tiles mod 5 and add that to height.
		tileRows = ((GameCircle.currentMap.tileMapManager.namedTiles.length/5)+1)*40;
		
		palletSelector.css('height',tileRows+'px');
		//palletSelector.css('height','256px');
		palletSelector.css('width','180px');
		
		//TODO: ADD Blank tile.
		
		for(var t = 0; t < GameCircle.currentMap.tileMapManager.namedTiles.length;t++){
			curTile = GameCircle.currentMap.tileMapManager.namedTiles[t]
			selected = (GameCircle.placementTile.id === curTile.id)? true:false;
			tileSpr = GameCircle.currentMap.tileMapManager.namedTileOrgPoint(curTile.id);
	
			clickSrc = "updatePallet(\'"+ curTile.name +"\');";
			var ptile = $('<canvas width="32" height="32" onClick="'+clickSrc+'"></canvas>');
			ptile.attr('name', curTile.name);
			ptile.attr('id', 'tile_'+curTile.name);
			ptileCtx = ptile.get(0).getContext("2d");
			renderTile(ptileCtx, tileSpr, 0, 0);
			if(selected){
				ptile.css('border','2px solid #00CC00');
			} else {
				ptile.css('border','2px solid #FFC');
				//ptile.css('padding','2px');
			}
			//ptile.live('click',function() { updatePallet($(this).name)});
			if(t>0 && t%5===0) {
				$("<BR>").appendTo(palletSelector);
			} 
			ptile.appendTo(palletSelector);
		}
		palletSelector.appendTo(palletContent);
		
		openToolDialog('#dialog', palletContent, 10, 10);
	} else {
		hideDialog();
		GameCircle.activeDialog = null;
	}
}

/**
 * Refresh the pallet display when diff tile selected. and set newly selected.
 */
function updatePallet(tileName) {
	$('#tile_'+GameCircle.placementTile.name).css('border','2px solid #FFC');
	$('#tile_'+tileName).css('border','2px solid #00CC00');
	GameCircle.setSelectedTileByName(tileName);
}

