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
	GameCircle.windowHt = window.innerHeight;
	GameCircle.windowWd = window.innerWidth;
	GameCircle.CANVAS_WIDTH = 32*50;//window.innerWidth;
	GameCircle.CANVAS_HEIGHT = 32*50;//window.innerHeight;
	
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
	GameCircle.player.x = (12*32);
	GameCircle.player.y = (6*32);
	GameCircle.player.name = "DM";
	GameCircle.player.spriteImg.src = "res/player.png";

	//Get New File from FileManager
	GameCircle.advData = FileManager.newFile("Test Adventure",50,50);
	
	tileMapManager = new SpriteTileManager(GameCircle.advData.tileManConfig);

	GameCircle.currentMap.tileMapManager = tileMapManager;	
	GameCircle.currentMap.updateMap(GameCircle.advData.mapData.map);
	
	//TODO: set for test, in Edit Mode it should always be true.
	GameCircle.lightsOn = true;
	//TODO: For testing setting a default Sprite Tile, remove later.
	//GameCircle.placementTile = {"id":1,"name":"FLOOR1","col":1,"row":8};
	
	//draw to canvas		
	GameCircle.render();
	setInterval(main, 30);
	
	//Show Left Tray on start.
	//TODO: Need to prevent this firingin until after the image load event happens. Depends on final app workflow.
	//displayToolPallet();
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
  
  if(keydown.alt  && keydown.v) {
	  GameCircle.addEventMessage("Saving File...");
	  debug("Saving File...");
	  FileManager.save(GameCircle.getAdventureData().adventureId);
  }
  
  if(keydown.alt && keydown.s) {
	GameCircle.selectedMode = !GameCircle.selectedMode;
	updateMultiSelectStat();
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
  
  if(keydown.alt && keydown.o) {
	openFileManager();
	keydown.o = false;
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
	    var maskHeight = GameCircle.windowHt//$(document).height();
        var maskWidth = GameCircle.windowWd//$(window).width();
     
        //Set height and width to mask to fill up the whole screen
        $('#mask').css({'width':maskWidth,'height':maskHeight});
         
        //transition effect     
        $('#mask').fadeIn(1000);    
        $('#mask').fadeTo("slow",0.8);  
     
        //Get the window height and width
        var winH = GameCircle.windowHt;//$(window).height();
        var winW = GameCircle.windowWd;//$(window).width();
               
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
	    //var maskHeight = $(document).height();
        //var maskWidth = $(window).width();
		
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

//TODO: ADD the HTML Dialog box #filedialog
function displayFileManagementDialog() {
	if(GameCircle.activeDialog === null | GameCircle.activeDialog !== 'fileManDialog') {  
		GameCircle.activeDialog = 'fileManDialog';
		var fileDialog = $("<div></div>");
		
		//TODO: Add select box with possible load files..
		
		
		var openButton = $("<button onclick='GameCircle.loadAdventure();'>Load</button>")	;
		openButton.appendTo(fileDialog);

		var openButton = $("<button onclick='GameCircle.saveAdventure();'>Save</button>")	;
		openButton.appendTo(fileDialog);
		
		openToolDialog('#filedialog', palletContent, GameCircle.CANVAS_WIDTH, GameCircle.CANVAS_HEIGHT);
	}
}

function updateSaveInput(){
	var selected = $("#selFileId").val();
	$("#saveName").val(selected);
}

function openFileManager() {
	$('#saveLoad').css('width',  '250px');
	$('#saveLoad').css('height', '300px');
	$('#saveLoad').css('background-color',  '#ffffcc');
	
	var ioContent = $('<div><b>Manage Map Files</b></div>');
	
	//display in a select box
	var fileSelect = $("<br><select id='selFileId' style='width:250px' size=5 onChange='updateSaveInput();'></select>");
	
	for(opt=0; opt < FileManager.listFiles().length ;opt++) {
		var fileId = FileManager.listFiles()[opt];
		var option = $("<option value='" + fileId + "'>" + fileId + "</option>");
		option.appendTo(fileSelect);
	}
	fileSelect.appendTo(ioContent);
	
	var openButton = $("<input id='saveName' size='35' maxlength=40><br><br><button onclick='doLoad();'>Load</button>");
	openButton.appendTo(ioContent);
	
	var openButton = $("&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='doSave();'>Save</button>");
	openButton.appendTo(ioContent);
	
	var openButton = $("&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='hideDialog();'>Close</button>");
	openButton.appendTo(ioContent);
	
	openToolDialog('#saveLoad', ioContent, (GameCircle.windowHt/2)-150,(GameCircle.windowWd/2)-100);
}

function doLoad(){
	if($("#selFileId").val() === null || $("#selFileId").val() === '') {
		alert("No File was selected for Load!");
	} else {
		GameCircle.loadAdventure($("#selFileId").val());
		hideDialog();
	}
}

function doSave(){
	//TODO: Remove  This is temp for testing
	GameCircle.getAdventureData().adventureId = $("#saveName").val();
	GameCircle.saveAdventure();
	hideDialog();
}
/**
 * Builds the ToolShelf with Tile Pallet
 */
function displayToolPallet() {
	if(GameCircle.activeDialog === null | GameCircle.activeDialog !== 'toolPallet') {  
		$('#dialog').css('width',  '400px');
		$('#dialog').css('height', '200px');
		$('#dialog').css('background-color',  '#ffffcc');
		GameCircle.activeDialog = 'toolPallet';
		tileName = (typeof GameCircle.placementTile.name != 'undefined' || GameCircle.placementTile.name != null)?GameCircle.placementTile.name:"UnNamed Tile"
		var palletContent = $("<div></div>");
		
		// Mode indicators.
		var statusContent = $("<div id='selStatus'></div>");
		stat = (GameCircle.selectedMode)?'<span style="color:green">ON</span>':'OFF';
		$('<b>Multi-Select:</b>&nbsp;' + stat + '<br>').appendTo(statusContent);
		statusContent.appendTo(palletContent);

		
		$('<span id="selTile"><b>Selected Tile:</b>&nbsp;'+tileName+'</span><hr>').appendTo(palletContent);

		//TODO: Add test load button 
		var openButton = $("<button onclick='GameCircle.loadAdventure();'>Load</button>")	;
		openButton.appendTo(palletContent);

		var openButton = $("<button onclick='GameCircle.saveAdventure();'>Save</button>")	;
		openButton.appendTo(palletContent);
		//Draw Pallet Selector
		var palletSelector = $("<div id='palletSelector'></div>");
		palletSelector.css('border','1px solid #333333');
	
		tileRows = 8*40;
		
		palletSelector.css('height',tileRows+'px');
		palletSelector.css('width','180px');
		palletSelector.css('margin-left','auto');
		palletSelector.css('margin-right','auto');

		
		//Add Selector
		groupSelSrc = "buildPallet(\'#pallet\');";
		var groupSel = $('<select id="tileGroup" name="tileGroup" onChange="'+groupSelSrc+'"></select>');
		
		$("<option value='ALL'>All</option>").appendTo(groupSel);
		$("<option value='wall'>Wall</option>").appendTo(groupSel);
		$("<option value='floor'>Floor</option>").appendTo(groupSel);
		$("<option value='door'>Door</option>").appendTo(groupSel);
		groupSel.css('width','180px');
		groupSel.css('margin-left','auto');
		groupSel.css('margin-right','auto');
		groupSel.css('margin-right','auto');
		
		groupSel.appendTo(palletSelector);
			
		//Build Pallet	
		var pallet = $('<div id="pallet"></div>');
		buildPallet(pallet);
		pallet.appendTo(palletSelector);
		
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
	updateSelTile();
}

function updateMultiSelectStat() {
	stat = (GameCircle.selectedMode)?'<span style="color:green">ON</span>':'OFF';
	$('#selStatus').html('<b>Multi-Select:</b>&nbsp;' + stat + '<br>');
}

function updateSelTile() {
	$('#selTile').html('<b>Selected Tile:</b>&nbsp;'+GameCircle.placementTile.name);
}

/**
 * Lays out all of the tiles available to the pallet based on filter selected.
 */
function buildPallet(targetPallet) {
	if(typeof targetPallet === "string") {
		targetPallet = $(targetPallet);
		targetPallet.html('');
	}
	filter = $('#tileGroup').val();
	
	//ADD Blank tile.
	clickSrc = "updatePallet(\'"+ GameCircle.BLANK.name +"\');";
	var ptile = $('<canvas width="32" height="32" onClick="'+clickSrc+'"></canvas>');
	
	ptile.attr('name', GameCircle.BLANK.name);
	ptile.attr('alt', GameCircle.BLANK.name);
	ptile.attr('id', 'tile_'+GameCircle.BLANK.name);
	ptileCtx = ptile.get(0).getContext("2d");
	ptile.css('background',GameCircle.backgroundColor);
	selected = (GameCircle.placementTile.id === GameCircle.BLANK.id)? true:false;
	if(selected){
		ptile.css('border','2px solid #00CC00');
	} else {
		ptile.css('border','2px solid #FFC');
	}
	ptile.appendTo(targetPallet);
	
	itemCt = 0;
	//Display
	for(var t = 0; t < GameCircle.currentMap.tileMapManager.namedTiles.length;t++){
			
			//Filter list for display
			if(filter !== 'ALL' && filter !== GameCircle.currentMap.tileMapManager.namedTiles[t].group) {
				continue;
			}
			itemCt++;
			curTile = GameCircle.currentMap.tileMapManager.namedTiles[t];
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
			}

			if(itemCt>0 && itemCt%5===0) {
				$("<BR>").appendTo(targetPallet);
			} 
			ptile.appendTo(targetPallet);
		}
		
}

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}
