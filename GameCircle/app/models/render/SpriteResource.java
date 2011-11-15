package models.render;

import models.Sprite;

/**
 * @author leeclarke
 */
public class SpriteResource {
    // "id":0,"name":"WALL1","col":0,"row":0, "group":"wall"
    public Long id; // Remove if move this to JPA
    public String name;
    public Integer col;
    public Integer row;
    public String group;

    public SpriteResource(Sprite sprite) {
        this.id = sprite.id;
        this.name = sprite.name;
        this.col = sprite.col;
        this.row = sprite.row;
        this.group = sprite.grouping;
    }

}
