package models;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import play.db.jpa.JPABase;
import play.db.jpa.Model;

/**
 * Model for a single map associated with an adventure. The SpriteSheet is also associate with the Adventure and 
 * is required to make use of the data contained with in.
 * @author leeclarke
 */
@Entity
public class AdventureMap extends Model{
    public String title;
    public Integer rows;
    public Integer cols;
    public Date createTimeDate;
    public Date updateTimeDate;
    
    @OneToMany(mappedBy="map")
    public List<MapTile> mapTiles;
    
    @ManyToOne
    public Adventure adventure;

    public AdventureMap(Adventure adventure2) {
        this.adventure = adventure2;
    }
    
    @Override
    public <T extends JPABase> T save() {
        if(this.createTimeDate == null){
            this.createTimeDate = new Date();
        }
        this.updateTimeDate = new Date();
        return super.save();
    }
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
