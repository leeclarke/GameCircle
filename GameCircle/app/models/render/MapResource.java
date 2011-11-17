package models.render;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import models.AdventureMap;
import models.MapTile;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.joda.time.DateTime;

/**
 * Game , adventure Map not a collection type of Java object!
 * 
 * JSON Structure:
 * 
  "title":"Test Map",
                "rows":30,
                "cols":30,
                "createTimeDate":"",
                "updateTimeDate":"",
                "map":[]
 *    
 * @author leeclarke
 */

public class MapResource {
    public String title;
    public Integer rows;
    public Integer cols;
    public Date createTimeDate;
    public Date updateTimeDate;
    
    public List<List<MapTileResource>> map; //TODO rename in JSON refactoring.
    
	public MapResource(AdventureMap advMap)
	{
		this.cols = advMap.cols;
		this.rows = advMap.rows;
		this.title = advMap.title;
		this.createTimeDate = advMap.createTimeDate;
		this.updateTimeDate = advMap.updateTimeDate;
		populateEmptyMap();
		
		for (MapTile mapTile : advMap.mapTiles)
		{
			this.map.get(mapTile.row).add(mapTile.col, new MapTileResource(mapTile));
		}
	}
	
	private void populateEmptyMap(){
		this.map = new ArrayList<List<MapTileResource>>(this.rows);

		for (int r = 0; r < this.rows; r++)
		{
			List<MapTileResource> row = new ArrayList<MapTileResource>(this.cols);
			for (int i = 0; i < this.cols; i++)
			{
				row.add(MapTileResource.getEmptyMapTileResource());
			}
			this.map.add(row);
		}
	}
	
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
