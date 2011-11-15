package models.render;

import java.util.List;

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

    public Integer rows;
    public Integer cols;
    public DateTime createTimeDate;
    public DateTime updateTimeDate;
    
    public List<MapTileResource> map; //TODO rename in JSON refactoring.
    
}
