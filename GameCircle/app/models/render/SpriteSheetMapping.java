package models.render;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import models.Adventure;
import models.Sprite;


import play.db.jpa.Model;

/**
 * Maps all sprites to positions on a larger image.
 * @author leeclarke
 */
public class SpriteSheetMapping{
   
	public Integer tileWidth; 
    public Integer tileHeight;
    public String src;
    public List<Sprite> namedTiles;
    
    public SpriteSheetMapping(Adventure adventure)
	{
    	this.tileWidth = adventure.spriteTileWidth;
    	this.tileHeight = adventure.spriteTileHeight;
    	this.src = adventure.spriteSrc;
    	this.namedTiles = adventure.spriteSheetNamedTiles;

	}
     
}
