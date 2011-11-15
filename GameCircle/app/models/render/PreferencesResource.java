package models.render;

import models.Adventure.SaveType;

/**
 * Rendering object for JSON structure, not-persistent object.
 * @author leeclarke
 */
public class PreferencesResource {
    public String bgColor;
    public String gridColor;
    public String npcBorderColor;
    public String saveType;
    public MapTileResource placementTile;
    
    public PreferencesResource(){
    	this.saveType = SaveType.ONLINE.toString();
    	this.placementTile = new MapTileResource();
    }
}
