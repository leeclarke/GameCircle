package functional;


import java.util.List;

import org.junit.Test;


import play.mvc.Http.Response;


public class AdventureFunctionalTest extends BaseFunctionalTest {

    @Test
    public void testGetAdventureById() throws  java.text.ParseException {
        Response response = GET("/rest/adventure/1");
        assertStatus(200, response);
        validateContentType(response);
        
        String json = getContent(response);
        validateJsonValue("SuperEBear", json, "$.userId");
        validateJsonValue("Eli First Adv", json, "$.adventureId");
        validateJsonValue("#000000", json, "$.prefs.bgColor");
        validateJsonValue("#345345", json, "$.prefs.gridColor");
        validateJsonValue("#110011", json, "$.prefs.npcBorderColor");
        validateJsonValue("ONLINE", json, "$.prefs.saveType");
        validateJsonValue("ONLINE", json, "$.prefs.saveType");
        validateJsonValue("-1", json, "$.prefs.placementTile.id");
        validateJsonValue("-1", json, "$.prefs.placementTile.type");
        
        
        validateJsonValue(32, json, "$.tileManConfig.tileWidth");
        validateJsonValue(32, json, "$.tileManConfig.tileHeight");
        validateJsonValue("res/spriteSheet.jpg", json, "$.tileManConfig.src");
        
        containsArrayValue("$.tileManConfig.namedTiles.id", json, 1);
        containsArrayValue("$.tileManConfig.namedTiles.name", json, "WALL1","FLOOR1");
        containsArrayValue("$.tileManConfig.namedTiles.col", json, 0,1,2);
        containsArrayValue("$.tileManConfig.namedTiles.row", json, 2,3,0);
        containsArrayValue("$.tileManConfig.namedTiles.group", json, "wall","floor","door");
        
        containsArrayValue("$.mapData.title", json, "New Test Map");
        containsArrayValue("$.mapData.rows", json, 30);
        containsArrayValue("$.mapData.rows", json, 30);
//TODO: This test is dependent on the UnitTest running to populate data: Fix soon.
        
//        validateMatrixValue("$.mapData.map.[].id", json, "1","2","3");
//        validateMatrixValue("$.mapData.map.type", json, "2");
        
        //TODO: Add more JSON field checks 
    }
    
//    private void validateMatrixValue(String jsonPath, String json, String... values)
//	{
//    	//TODO its having trouble with [[{},{}]] arrays in arrays
//     	List<List> refNpcBorderColor = getNode(json, jsonPath);
//        for (int v = 0; v < values.length; v++) {
//            assertTrue(refNpcBorderColor.contains(values[v]));
//        }
//	}
    
    @Test
    public void testPostAdventure()
	{
        String uid = "test"+System.currentTimeMillis();
    	String expectedURI = "http://localhost:9000/rest/adventure";
    	Response response = POST("/rest/adventure/", APPLICATION_X_WWW_FORM_URLENCODED,"userId=SuperEBear&adventureId=Eli's+Next+Adventure&prefs.bgColor=%23000000&prefs.gridColor=%23556677&prefs.npcBorderColor=%23666666&prefs.saveType=ONLINE&prefs.placementTile.id=1&prefs.placementTile.type=1");
    	assertStatus(303, response);
    	//Content-Location
    	String actualURI = response.headers.get("Content-Location").value();
    	
    	assertTrue(actualURI.contains(expectedURI));
	}
    
}
