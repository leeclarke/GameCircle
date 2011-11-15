package models.render;

import java.util.List;

/**
 * Maps all sprites to positions on a larger image.
 * @author leeclarke
 */
public class SpriteMapping {
    public Integer tileWidth; 
    public Integer tileHeight;
    public String src;
    public List<SpriteResource> namedTiles;
}
