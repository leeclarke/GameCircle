package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

/**
 * Contained by an AdventureMap and defines each tile on the map.
 * @author leeclarke
 */
@Entity
public class MapTile extends Model{
	public Integer row;
	public Integer col;
    public String spriteId;
    public String type;
    
    @ManyToOne
    public AdventureMap map;
    
    public MapTile(AdventureMap map, Integer row, Integer col, String spriteId,String type){
    	this.row = row;
    	this.col = col;
        this.map = map;
        this.spriteId = spriteId;
        this.type = type;
    }

    public MapTile()
    {
        this.spriteId = "-1";
        this.type = "-1";
    }
}
