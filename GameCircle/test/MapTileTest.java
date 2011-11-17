import java.util.List;

import models.Adventure;
import models.AdventureMap;
import models.MapTile;
import models.User;

import org.junit.Test;

import play.test.UnitTest;


public class MapTileTest extends UnitTest{

    @Test
    public void createAndRetrieveMapTile() {
        User aUser = User.find("byUserName", "SuperEBear").first();
        List<Adventure> advs = Adventure.findByUser(aUser);
        assertNotNull(advs);
        assertTrue(advs.size()>0);
        Adventure adventure = advs.get(0);
        assertNotNull(adventure);
        
        //Test creating new Map. and MapTiles
        AdventureMap map = new AdventureMap(adventure);
        map.cols = 30;
        map.rows = 30;
        map.title = "New Test Map";
        AdventureMap newMap = map.save();
        assertNotNull(newMap);
        assertNotNull(newMap.id);
        
        MapTile  mapTile = new MapTile(newMap, 1, 1,"1","2").save();
        assertNotNull(mapTile);
        assertNotNull(mapTile.id);
        assertEquals("1", mapTile.spriteId);
        assertEquals("2", mapTile.type);
        
        MapTile mapTile2 = new MapTile(newMap, 1, 2,"1","2").save();
        assertNotNull(mapTile2);
        assertNotNull(mapTile2.id);
        assertEquals("1", mapTile2.spriteId);
        assertEquals("2", mapTile2.type);
        
        MapTile mapTile3 = new MapTile(newMap, 0, 1,"1","2").save();
        assertNotNull(mapTile3);
        assertNotNull(mapTile3.id);
        assertEquals("1", mapTile3.spriteId);
        assertEquals("2", mapTile3.type);
    }
}
