package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Adventure extends Model {
	public enum SaveType{
		ONLINE, LOCAL, BOTH;
	}

	@Required  public String name;
	@Required  public String backgroundColor;
	@Required  public String gridColor;
	public String npcBorderColor;
	public SaveType saveOptions = SaveType.ONLINE;
	
	public String placementTileId;
	public String placementTileType;
	
	public Integer spriteTileWidth; 
    public Integer spriteTileHeight;
    public String spriteSrc;
    
    @OneToMany
    public List<Sprite> spriteSheetNamedTiles;
    
    @OneToMany(mappedBy="adventure")
    public List<AdventureMap> maps;
	
	@ManyToOne
	public User user;
	
	public Adventure(User user, String name){
	    this.id = null;
		this.user = user;
		this.name = name;
		this.placementTileId = "-1";
		this.placementTileType = "-1";
	}
	
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
	
	public static  List<Adventure> findByUser(User user){
		return Adventure.find("byUser", user).fetch();
	}
}
