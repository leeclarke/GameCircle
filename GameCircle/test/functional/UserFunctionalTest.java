package functional;

import java.text.ParseException;

import org.junit.Test;

import play.mvc.Http.Response;
import play.test.FunctionalTest;

import com.jayway.jsonpath.JsonPath;

public class UserFunctionalTest extends FunctionalTest {
    
    @Test
    public void testGetAllUsers() throws ParseException {
        Response response = GET("/rest/users");
        assertStatus(200, response);
        assertContentType("application/json", response);
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        //String email = JsonPath.read(json, "$.[].email");
    
        
    }
    
    @Test
    public void testGetUser() throws ParseException {
        String uid = "JoeCoolDM";
        Response response = GET("/rest/users/"+uid);
        assertStatus(200, response);
        assertContentType("application/json", response); 
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        //TODO: Something about this isnt parsing.. giving error about loading Jackson..
        assertEquals("joeCool@gmail.com", JsonPath.read(json, "$.email"));
        assertEquals("JoeCoolDM", JsonPath.read(json, "$.userName"));
        assertEquals("Dave", JsonPath.read(json, "$.firstName"));
        assertEquals("DM", JsonPath.read(json, "$.lastName"));
        assertEquals(false, JsonPath.read(json, "$.isAGameMaster"));
        
        
    }
}
