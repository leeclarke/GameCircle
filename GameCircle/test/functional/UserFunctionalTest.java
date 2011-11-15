package functional;

import java.text.ParseException;
import java.util.List;

import net.minidev.json.JSONArray;

import org.junit.Test;

import play.mvc.Http.Response;

import com.jayway.jsonpath.JsonPath;

public class UserFunctionalTest extends BaseFunctionalTest {

    @Test
    public void testGetAllUsers() throws  java.text.ParseException {
        Response response = GET("/rest/users");
        assertStatus(200, response);
        validateContentType(response);
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        JSONArray email = JsonPath.read(json, "$.[].email");
        //TODO finish this test.
        
    }
    
    @Test
    public void testGetUser() throws  java.text.ParseException {
        String uid = "SuperEBear";
        Response response = GET("/rest/users/"+uid);
        assertStatus(200, response);
        validateContentType(response); 
        
        String json = getContent(response);
        
        assertEquals("super.e.bear@gmail.com", JsonPath.read(json, "$.email"));
        assertEquals("SuperEBear", JsonPath.read(json, "$.userName"));
        assertEquals("Eli", JsonPath.read(json, "$.firstName"));
        assertEquals("Clarke", JsonPath.read(json, "$.lastName"));
        assertEquals(false, JsonPath.read(json, "$.isAGameMaster"));
        
        assertEquals("http://localhost:9000/rest/users/SuperEBear", JsonPath.read(json, "$.links.self"));
        assertEquals("http://localhost:9000/rest/users/SuperEBear", JsonPath.read(json, "$.links.update"));
        assertEquals("http://localhost:9000/rest/users/SuperEBear/adventures", JsonPath.read(json, "$.links.adventures"));
    }
 
    @Test
    public void testPostUser()
	{
        String uid = "test"+System.currentTimeMillis();
    	String expectedURI = "http://localhost:9000/rest/users/"+uid;
    	Response response = POST("/rest/users/", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeCool%40gmail.com&firstName=Joe&userName="+uid+"&lastName=DM&isAGameMaster=true");
    	assertStatus(303, response);
    	//Content-Location
    	String actualURI = response.headers.get("Content-Location").value();
    	assertEquals(expectedURI, actualURI);
	}
    
    @Test
    public void testPostUser_missingREquiredFields() throws ParseException
	{
    	//Invalid email and missing first name.
    	String expectedURI = "http://localhost:9000/rest/users";
    	Response response = POST("/rest/users/", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeCool.dd&userName=InvalidShmer&lastName=DM&isAGameMaster=true");
    	assertStatus(409, response);
    	validateContentType(response); 
    	String json = getContent(response);
    	assertNotNull(json);
    	List<String> fieldNames = getNode(json, "$.errors.fieldName");
    	assertTrue(fieldNames.contains(".email"));
    	assertTrue(fieldNames.contains(".firstName"));
	}
    
    @Test
    public void testPutUser()
	{
    	String expectedURI = "http://localhost:9000/rest/users/JoeCoolDM";
    	Response response = PUT("/rest/users/JoeCoolDM", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeIsCool%40gmail.com&firstName=Joe&userName=JoeCoolDM&lastName=DM&isAGameMaster=true");
    	assertStatus(303, response);
    	//Content-Location
    	String actualURI = response.headers.get("Content-Location").value();
    	assertEquals(expectedURI, actualURI);
	}
    
    @Test
    public void testPutUser_badEmailFirstName()
	{
    	String expectedURI = "http://localhost:9000/rest/users/SuperEBear";
    	Response response = PUT("/rest/users/JoeCoolDM", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeIsCoo$.com&firstName=&userName=JoeCoolDM&lastName=DM&isAGameMaster=true");
    	assertStatus(409, response);
    	validateContentType(response); 
    	String json = getContent(response);
    	assertNotNull(json);
    	List<String> fieldNames = getNode(json, "$.errors.fieldName");
        assertTrue(fieldNames.contains(".firstName"));
	}
    
    @Test
    public void testGetUserAdventures(){
    	String expectedURI = "http://localhost:9000/rest/users/SuperEBear/adventures";
    	String uid = "SuperEBear";
		Response response = GET("/rest/users/"+uid +"/adventures");
		assertStatus(200, response);
		validateContentType(response);
		String json = getContent(response);
		assertNotNull(json);
		List<String> uids = getNode(json, "$.userId");
		assertNotNull(uids);
		assertEquals(uid, uids.get(0));
		List<String> names = getNode(json, "$.adventureId");
		assertTrue(names.contains("Eli First Adv"));
		
		//
		
    	assertFalse("Implement test!",true);
    }
}
