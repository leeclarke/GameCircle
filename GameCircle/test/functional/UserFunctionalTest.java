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
        //TODO This test isnt getting the array
        
    }
    
    @Test
    public void testGetUser() throws ParseException, java.text.ParseException {
        String uid = "JoeCoolDM";
        Response response = GET("/rest/users/"+uid);
        assertStatus(200, response);
        validateContentType(response); 
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        assertEquals("joeCool@gmail.com", JsonPath.read(json, "$.email"));
        assertEquals("JoeCoolShmer", JsonPath.read(json, "$.userName"));
        assertEquals("Dave", JsonPath.read(json, "$.firstName"));
        assertEquals("DM", JsonPath.read(json, "$.lastName"));
        assertEquals(false, JsonPath.read(json, "$.isAGameMaster"));
        
    }
    
    @Test
    public void testPostUser()
	{
    	Response response = POST("/rest/users/", APPLICATION_X_WWW_FORM_URLENCODED,"email=joeCool%40gmail.com&firstName=Joe&userName=JoeCoolShmer&lastName=DM&isAGameMaster=true");
    	assertStatus(200, response);
    	validateContentType(response);
    	
	}
    
}
