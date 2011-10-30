package functional;

import java.util.HashMap;
import java.util.Map;

import net.minidev.json.JSONArray;
import net.minidev.json.parser.ParseException;

import org.junit.Test;

import play.mvc.Http;
import play.mvc.Http.Response;
import play.test.FunctionalTest;
import play.utils.HTTP;
import sun.net.www.http.HttpClient;

import com.jayway.jsonpath.JsonPath;
import com.ning.http.client.HttpContent;

public class UserFunctionalTest extends BaseFunctionalTest {
    
	@Test
    public void testGetAllUsers() throws ParseException, java.text.ParseException {
        Response response = GET("/rest/users");
        assertStatus(200, response);
        validateContentType(response);
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        JSONArray email = JsonPath.read(json, "$.[].email");
        //TODO finish this test.
        
    }
    
    @Test
    public void testGetUser() throws ParseException, java.text.ParseException {
        String uid = "SuperEBear";
        Response response = GET("/rest/users/"+uid);
        assertStatus(200, response);
        validateContentType(response); 
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        assertEquals("super.e.bear@gmail.com", JsonPath.read(json, "$.email"));
        assertEquals("SuperEBear", JsonPath.read(json, "$.userName"));
        assertEquals("Eli", JsonPath.read(json, "$.firstName"));
        assertEquals("Clarke", JsonPath.read(json, "$.lastName"));
        assertEquals(false, JsonPath.read(json, "$.isAGameMaster"));
        
    }
    
    @Test
    public void testPostUser()
	{
    	String expectedURI = "http://localhost:9000/rest/users/JoeCoolShmer";
    	Response response = POST("/rest/users/", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeCool%40gmail.com&firstName=Joe&userName=JoeCoolShmer&lastName=DM&isAGameMaster=true");
    	assertStatus(303, response);
    	//Content-Location
    	String actualURI = response.headers.get("Content-Location").value();
    	assertEquals(expectedURI, actualURI);
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
    
}
