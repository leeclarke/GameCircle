package functional;

import net.minidev.json.parser.ParseException;

import org.junit.Test;

import play.mvc.Http;
import play.mvc.Http.Response;
import play.test.FunctionalTest;
import play.utils.HTTP;
import sun.net.www.http.HttpClient;

import com.google.api.client.http.HttpResponse;
import com.jayway.jsonpath.JsonPath;
import com.ning.http.client.HttpContent;

public class UserFunctionalTest extends FunctionalTest {
    
    private static final String CONTENT_APPLICATION_JSON = "application/json";
	private static final String HTTP_CONTENT_TYPE = "Content-Type";

	@Test
    public void testGetAllUsers() throws ParseException {
        Response response = GET("/rest/users");
        assertStatus(200, response);
        assertHeaderEquals(HTTP_CONTENT_TYPE, CONTENT_APPLICATION_JSON, response);
        
        //TODO: Build tests from here: http://code.google.com/p/json-path/
        String json = getContent(response);
        
        //String email = JsonPath.read(json, "$.[].email");
    
        
    }
    
    @Test
    public void testGetUser() throws ParseException, java.text.ParseException {
        String uid = "JoeCoolDM";
        Response response = GET("/rest/users/"+uid);
        assertStatus(200, response);
        assertHeaderEquals(HTTP_CONTENT_TYPE, CONTENT_APPLICATION_JSON, response); 
        
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
