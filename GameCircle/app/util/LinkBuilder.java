package util;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import play.Play;

/**
 * Helps in building links for the return objects. 
 * @author lee
 */
public class LinkBuilder {
    
    private static final String ACTION_KEY = "action.";
    private static final String SERVICE_KEY = "service.path.";
    private static String  restEasyPath = null;
    
    
    /**
     * Builds the URI and replaces the templates values with supplied params.
     * @param service - service being called, defined in link-builder.conf
     * @param action - action defined in link-builder.conf
     * @param params - key,value for replacement params.
     * @return - a URI.
     */
    public static URI buildURI(String service, String action, Map<String,String> params){
        configureRestPath();
        String uriStr = constructURITemplate(service, action);
        
        URI uri = null;
		try {
			uri = processTemplate(uriStr,params);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} 
        
        return uri;
    }
    
	/**
	 * Calls link builder with a single key,value pair replacement. Just makes the call easier when 
	 * the Map isn't really important for the call. 
	 * @param service - service being called, defined in link-builder.conf
     * @param action - action defined in link-builder.conf
	 * @param key - replacement key
	 * @param value - value for replacement
	 * @return - a URI.
	 */
	public static URI buildURI(String service, String action, String key, String value)
	{
		Map<String, String> params = new HashMap<String, String>();
		params.put(key, value);
		return LinkBuilder.buildURI(service, action, params);
	}
	
    /**
     * Processes key/values for template.
     * @param uri
     * @param params
     * @return
     * @throws URISyntaxException 
     */
    private static URI processTemplate(String uri, Map<String,String> params) throws URISyntaxException {
        String finalURI = uri;
        
        for (String key : params.keySet()) {
        	finalURI = finalURI.replace("{"+key+"}", params.get(key));
        }
      //TODO: Might want to consider adding validation to the end result? make sure there are no {}s left
        return new URI(finalURI);
    }

        //TODO: Build a Unit test.

    public static String constructURITemplate(String service, String action){
        configureRestPath();
        
        String serviceKey = SERVICE_KEY+ service;
        String actionKey = ACTION_KEY+ action;
        
        //TODO: need to get the host name and port numbers for building the URI.
        StringBuilder uri = new StringBuilder();
        uri.append(Play.configuration.get("application.baseUrl"));
        uri.append(restEasyPath).append("/");
        uri.append(Play.configuration.get(serviceKey));
        uri.append(Play.configuration.get(actionKey));
         return uri.toString();
    }
    
    private static void configureRestPath(){
        if(restEasyPath == null) {
            LinkBuilder.restEasyPath = (String) Play.configuration.get("resteasy.path");
        }    
    }


}
