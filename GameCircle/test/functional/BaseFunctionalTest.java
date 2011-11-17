package functional;

import java.text.ParseException;
import java.util.List;

import org.junit.Test;

import play.mvc.Http.Response;
import play.test.FunctionalTest;

import com.jayway.jsonpath.JsonPath;


/**
 * The basis for all Functional Tests.
 * @author leeclarke
 */
public class BaseFunctionalTest extends FunctionalTest
{
    public static final String CONTENT_APPLICATION_JSON = "application/json";
	public static final String HTTP_CONTENT_TYPE = "Content-Type";
	protected static final String APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded";
	
	public BaseFunctionalTest()
	{
		super();
	}

	@Test
	public void testValidateContentType(){
		Response response = GET("/rest/users");
		validateContentType(response);
	}
	
    protected void validateContentType(Response response){
    	assertHeaderEquals(HTTP_CONTENT_TYPE, CONTENT_APPLICATION_JSON, response);
    }
    
    protected void validateContentType(Response response, String contentType){
    	assertHeaderEquals(HTTP_CONTENT_TYPE, contentType, response);
    }
    
    /**
     * Executes a JSONPath query on the response and returns that value.
     * @param <T> expected value type in response
     * @param path JSONPath expression
     * @return value
     */
    protected <T> T getNode(String json, String path) {
        
        T value = null;
        try {
            value = JsonPath.<T>read(json, path);
        } catch (ParseException e) {
            fail(e.getLocalizedMessage());
        }
        return value;
    }

    /**
     * Validates that an JSONArray pulled from the given path contains a given value. 
     * @param jsonPath - json path
     * @param json - full json
     * @param values - falues to validate are contained on the given apth.
     */
    protected void containsArrayValue(String jsonPath, String json, String... values) {
        List<String> refNpcBorderColor = getNode(json, jsonPath);
        for (int v = 0; v < values.length; v++) {
            assertTrue(refNpcBorderColor.contains(values[v]));
        }
    }
    
    /**
     * Validates that an JSONArray pulled from the given path contains a given value. 
     * @param jsonPath - json path
     * @param json - full json
     * @param values - falues to validate are contained on the given apth.
     */
    protected void containsArrayValue(String jsonPath, String json, Integer... values) {
        List<Integer> refNpcBorderColor = getNode(json, jsonPath);
        for (int v = 0; v < values.length; v++) {
            assertTrue(refNpcBorderColor.contains(values[v]));
        }
    }

	protected void validateJsonValue(Integer expected, String json, String path) throws ParseException
	{
		assertEquals(expected, JsonPath.read(json, path));
	}

	protected void validateJsonValue(String expected, String json, String path) throws ParseException
	{
		assertEquals(expected, JsonPath.read(json, path));
	}
}
