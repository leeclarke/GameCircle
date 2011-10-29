import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import play.test.UnitTest;
import util.LinkBuilder;


public class LinkBuilderTest extends UnitTest {
    
    @Test
    public void constructURITemplate() {
        
        String uriTemplate = LinkBuilder.constructURITemplate("users", "get-user");
        
        assertNotNull(uriTemplate);
        assertEquals("http://localhost:9000/rest/users/{id}", uriTemplate);
    }
    
    @Test
    public void buildURI() throws URISyntaxException {
    	String userId = "testid";
        URI expectedURI = new URI("http://localhost:9000/rest/users/"+userId);
        
        Map<String, String> params = new HashMap<String, String>();
        params.put("id", userId);
		URI resp = LinkBuilder.buildURI("users", "get-user", params );
        assertEquals(expectedURI, resp);
    }
}
