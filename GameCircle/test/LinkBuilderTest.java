import org.junit.Test;

import play.test.UnitTest;
import util.LinkBuilder;


public class LinkBuilderTest extends UnitTest {
    
    @Test
    public void constructURITemplate() {
        
        String uriTemplate = LinkBuilder.constructURITemplate("user", "get-user");
        
        assertNotNull(uriTemplate);
        assertEquals("http://localhost:9000/rest/users/{id}", uriTemplate);
    }
    
    @Test
    public void processTemplate() {
        //TODO: finish
    }
    
    @Test
    public void buildURI() {
        
    }
}
