package models.render;

import java.util.ArrayList;
import java.util.List;

import models.Adventure;
import models.Sprite;

/**
 * Maps all sprites to positions on a larger image.
 * @author leeclarke
 */
public class SpriteSheetMappingResource{
   
	public Integer tileWidth; 
    public Integer tileHeight;
    public String src;
    public List<SpriteResource> namedTiles;

    public SpriteSheetMappingResource(Adventure adventure, List<Sprite> sprites)
	{
    	this.tileWidth = adventure.spriteTileWidth;
    	this.tileHeight = adventure.spriteTileHeight;
    	this.src = adventure.spriteSrc;
    	this.namedTiles = mapSprites(sprites);
	}
     
    private List<SpriteResource> mapSprites(List<Sprite> spriteSheetNamedTiles) {
        List<SpriteResource> spriteRes = new ArrayList<SpriteResource>();
        for (Sprite sprite : spriteSheetNamedTiles) {
            spriteRes.add(new SpriteResource(sprite));
        }
        
        return spriteRes ;
    }
    
}
