package models.render;

import models.Adventure.SaveType;

/**
 * Rendering object for JSON structure, not-persistent object.
 * @author leeclarke
 */
public class Preferences {
    public String bgColor;
    public String gridColor;
    public String npcBorderColor;
    public String saveType;
    public MapTile placementTile;
    
    public Preferences(){
    	this.saveType = SaveType.ONLINE.toString();
    	this.placementTile = new MapTile();
    }
}
