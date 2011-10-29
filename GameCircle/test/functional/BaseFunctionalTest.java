package functional;

import org.junit.Test;

import play.mvc.Http.Response;
import play.test.FunctionalTest;


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
}
