package models.render;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import models.MapTile;

public class MapTileResource {
	public String id;
    public String type;
    
    public MapTileResource(String id,String type){
    	this.id = id;
		this.type = type;
    }

	public MapTileResource()
	{
		this.id = "-1";
		this.type = "-1";
	}

	public MapTileResource(MapTile mapTile)
	{
		this.id = mapTile.id.toString();
		this.type = mapTile.type;
	}
	
	/**
	 * The Client expects empty objects for blank map tiles and this creates exactly that.
	 * @return
	 */
	public static MapTileResource getEmptyMapTileResource(){
		MapTileResource resp = new MapTileResource();
		resp.id = null;
		resp.type = null;
		return resp;
	}
	
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
