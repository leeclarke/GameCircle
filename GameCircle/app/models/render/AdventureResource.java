package models.render;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import models.Adventure;
import models.AdventureMap;
import models.Sprite;
import util.LinkBuilder;

/**
 * The JSON model has already been determined for the UI so to simplify
 * rendering the JSON in the needed format this Resource object manages
 * conversion for rendering.
 * 
 * @author leeclarke
 */
public class AdventureResource {
    //Note: marking things transient will prevent them from being rendered in JSON.
    private transient static final String ADVENTURE = "adventure";
    private transient static final String ID = "id";
    
    private transient Long id; 
    public String userId;
    public String adventureId;
    public PreferencesResource prefs;
    public SpriteSheetMappingResource tileManConfig;
    public List<MapResource> mapData;  //TODO: consider rename when refactroring JSON model in UI.
    public Map<String,String> links;
    
    public AdventureResource(Adventure adventure, List<Sprite> sprites) {
        this.id = adventure.id;
    	this.userId = adventure.user.userName;
        this.adventureId = adventure.name;
        this.prefs = new PreferencesResource();
        this.prefs.bgColor = adventure.backgroundColor;
        this.prefs.gridColor = adventure.gridColor;
        this.prefs.npcBorderColor = adventure.npcBorderColor;
        this.prefs.placementTile = new MapTileResource();
        this.tileManConfig = new SpriteSheetMappingResource(adventure,sprites);
        initMaps(adventure);
        initLinks();
    }
    
    private void initMaps(Adventure adventure2)
	{
    	this.mapData = new ArrayList<MapResource>();
    	for (AdventureMap advMap : adventure2.maps)
		{
    		this.mapData.add(new MapResource(advMap));
		}
	}

	/**
     * Initialize links for json responses. Doing this in the constructor doesn't do much good because JPA doesn't 
     * seem to call the constructor.
     */
    public void initLinks(){
        if(this.links == null){
            this.links = new HashMap<String, String>(); 
        }
        this.links.put("self",LinkBuilder.buildURI(ADVENTURE, "get-adventure", ID, this.id.toString()).toString());
        this.links.put("update",LinkBuilder.buildURI(ADVENTURE, "update-user", ID,this.id.toString()).toString());
    }
    
    //JSON Example ,aka definition.
    /*  emptyAdventureFile = {
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
                    "map":  [[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
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
                    ]
                    }
                }
    */
}
