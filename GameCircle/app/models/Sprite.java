package models;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
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
    public String group;
    
    @ManyToOne
    public Adventure adventure; 
}
