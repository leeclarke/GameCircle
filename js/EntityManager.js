/**
 * Entity Factory responsable for creating all types of game objects by injecting components and object nature.
 */
function EntityManager() {
	EntityTypes = {'Player':'Player','MapTile':'MapTile','Arrow':'Arrow', 'Creature':'Creature', 'Weapon':'Weapon', 'Armor':'Armor'}
}

function Entity(type){
	this.entityType = type;
	
}

 /**
  * Creates an Entity of the requested type. Types are publicly defined in EntityManager.EtityTypes Map.
  */
EntityManager.createEntity = function(entityType){
	entityType = entityType.toLowerCase();
	switch(entityType) {
		case 'player':
			entity = new Entity(entityType);
			addLocation(entity);
			alive(entity);
			addPlayer(entity);
			
			entity.toString = toString;
			renderable(entity);
			return entity;
		case 'creature':
			entity = new Entity(entityType);
			addLocation(entity);
			alive(entity);
			
			entity.toString = toString;
			renderable(entity);
			addMonster(entity);
			entity.visable = false;
			return entity;
		case 'maptile':
			entity = new Entity(entityType);
			entity.explored = false;
			entity.x = 0;
			entity.y = 0;
			entity.col = 0;
			entity.row = 0;
			entity.width = 0;
			entity.height = 0;
			entity.leftTop = null;
			entity.toString = toString;
			entity.init = initMapTile;
			return entity;
		case 'weapon':
			entity = new Entity(entityType);
			addWeapon(entity);				
			return entity;
		case 'armor':
			entity = new Entity(entityType);
					
			return entity;
	}
}

/**
 * Factory method which creates a Monster of the type requested. All Entities are of the type 'Creature' but 
 * are then configured to the Creature type.
 */
EntityManager.createCreature = function(creatureType){
	creature = this.createEntity('Creature');
	return creature;
}


/**
 * 
 */
function addLocation(entity) {
	entity.x = 0; //test
	entity.y = 0;
	entity.getCol = function() {
		return ~~(this.x/GameEngine.currentMap.getTileWidth())
	}
	entity.getRow = function() {
		return ~~(this.y/GameEngine.currentMap.getTileHeight())
	}
}


/**
 * Give the Entity the Monster component set.
 */
function addMonster(entity) {
	entity.isHostile = false;
	entity.range = 1; //Number of tiles creature can see
	oneLastSwing = false;
}

/**
 * Add player components to entity.
 */
function addPlayer(entity) {
//TODO: refactor
	entity.levelMax = 1;
	entity.hp = 8;
	entity.hpMax = 8;
	entity.str = 16;
	entity.strMax = 16;
	entity.pack = [];
	entity.vision = GameEngine.playerDefaltVisonRange; //number of tiles the player can see in any direction
}

/**
 * Add properties and functionality for things that can be killed.
 */
function alive(entity) {
	entity.alive = true;
	entity.hp = 1;
	entity.hpMax = 1;
	entity.str = 1;
	entity.strMax = 1;
	entity.deadImg = document.createElement('img');
	entity.deadImg.src = "res/bones.png";  //Set a default. TODO: revisit this later.
	entity.aggression = 0; //non-agressive @ 0   //TODO: need to implement use of this.
}



function stats(entity) {
	entity.name = "";
}

/**
 * Add to any entity for debugging.
 */
function toString() {
	out =  "["+ this.entityType +"] ";
	for(var prop in this)
	{
		if(this.hasOwnProperty(prop) && prop != 'toString') {
			var type = typeof prop;
			out += (prop + " = " + this[prop] + " , ");
		}
	}
	return out;
}

/**
 * Entity is able to be rendered to the screen.
 */
function renderable(entity) {
	entity.spriteImg = document.createElement('img');
	entity.width = 32;
	entity.height = 32;
	entity.renderImg = renderSprite;
	entity.spriteManager = null;
	entity.initSpriteManager = setupSpriteManager;
	entity.currentSequence = null;
	entity.currentSequenceStep = 0;
	entity.currentSequenceFrame = 0;
	entity.drawDeadSprite = drawDeadSprite;
}

/**
 * Initializes a sprite sheet for a given entity to provide support for animations.
 * @param spriteManagerConfig - config defining the sprites contined in a sprite sheet.
 * @param animationSequences - object containing sequences that reference tiles defined in the spriteManagerConfig
 */
function setupSpriteManager(spriteManagerConfig, animationSequences) {
	this.spriteManager = new SpriteTileManager(spriteManagerConfig);
	this.spriteManager.initAnimationSeqs(animationSequences);
}

/**
 * Renders the Dead Entitys sprite,or sequence from the spriteManager or spriteImg if no 'DEAD'
 * sprite is defined in the spriteManager. 
 */
function drawDeadSprite(context,x,y, entity) {
	if(entity.spriteManager !== null && entity.spriteManager.getSequenceSprite("DEAD",0) !== null) {
		if(entity.currentSequence != "DEAD"){
			entity.currentSequence = "DEAD";
			entity.currentSequenceStep = 0;
			entity.currentSequenceFrame = 0;
		}
		var deadSpriteData = entity.spriteManager.getSequenceSprite(entity.currentSequence, entity.currentSequenceStep);

	}
	if(entity.spriteManager !== null && entity.spriteManager.getNamedTile("DEAD") !== null) {
		var deadSpriteData = entity.spriteManager.getNamedTile("DEAD");
		deadSprite = entity.spriteManager.tileOrgPoint(deadSpriteData.col,deadSpriteData.row);
		context.drawImage(entity.spriteManager.spriteImage, deadSprite.xPos , deadSprite.yPos, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight, x, y, entity.spriteManager.tileWidth, entity.spriteManager.tileHeight);
	} else {
		context.drawImage(entity.deadImg, x, y);
	}	
};

/**
 * Renders correct sprite to the games context.
 */
function renderSprite(context, x,y){
	if(this.alive === false) {
		drawDeadSprite(context,x,y,this);
		return;
	}
	
	if(this.spriteManager != null && this.spriteManager.spriteImage.imageLoaded ) {
		defaultSprite = this.spriteManager.namedTileOrgPoint(0);
		context.drawImage(this.spriteManager.spriteImage, defaultSprite.xPos , defaultSprite.yPos, this.spriteManager.tileWidth, this.spriteManager.tileHeight, x, y, this.spriteManager.tileWidth,this.spriteManager.tileHeight);
		return;		
	}
	return this.spriteImg;
}


/**
 * Initiallize the map from stored data which should be int he format of {"id":0, "type":0}
 * Note: id should indicate the sprite image id. no idea what type ought to be..
 */
function initMapTile(data) {
	this.id = (data.hasOwnProperty('id'))?data.id:-1;
	this.type = (data.hasOwnProperty('type'))?data.type:-1;
		
}
