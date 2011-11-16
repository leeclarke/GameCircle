import java.util.List;

import models.Adventure;
import models.AdventureMap;
import models.User;

import org.junit.Test;

import play.test.UnitTest;


public class AdventureMapTest extends UnitTest{

    @Test
    public void createAndRetrieveAdventureMap() {
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
        AdventureMap resp = map.save();
        assertNotNull(resp);
        assertNotNull(resp.id);
        
        AdventureMap newMap = AdventureMap.findById(resp.id);
        assertNotNull(newMap);
        
        assertNotNull(newMap.createTimeDate);
        assertNotNull(newMap.updateTimeDate);
        assertEquals(new Integer(30), newMap.cols);
        assertEquals(new Integer(30), newMap.rows);
        assertEquals("New Test Map", newMap.title);
    }
}
