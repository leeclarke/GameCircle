package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import play.db.jpa.Model;

/**
 * @author leeclarke
 */
@Entity
public class Sprite extends Model{
//    "id":0,"name":"WALL1","col":0,"row":0, "group":"wall"
    public String name;
    public Integer col;
    public Integer row;
    public String grouping;
    
    @ManyToOne
    public Adventure adventure; 
    
    public Sprite(){
        
    }
    
    public Sprite(String name, Integer col, Integer row, String grouping, Adventure adv){
        this.name = name;
        this.col = col;
        this.row = row;
        this.grouping = grouping;
        this.adventure = adv;
    }
    
    public static  List<Sprite> findByAdventure(Adventure adv){
        return Sprite.find("byAdventure", adv).fetch();
    }
}
