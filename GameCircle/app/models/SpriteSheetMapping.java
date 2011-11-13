package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;


import play.db.jpa.Model;

/**
 * Maps all sprites to positions on a larger image.
 * @author leeclarke
 */
@Entity
public class SpriteSheetMapping extends Model{
    public Integer tileWidth; 
    public Integer tileHeight;
    public String src;
//    @OneToMany
//    public List<Sprite> namedTiles;
    
//    @ManyToOne
//    public Adventure adventure;
    
//    public SpriteSheetMapping(Adventure adv, int tileWidth, int tileHeight, String imgSource){
//    	this.tileWidth = tileWidth;
//    	this.tileHeight = tileHeight;
////    	this.src = imgSource;
//    	this.adventure = adv;
//    }
}
