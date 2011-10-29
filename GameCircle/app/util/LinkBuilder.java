package util;

import java.util.Map;

import play.Play;

public class LinkBuilder {
    
    private static final String ACTION_KEY = "action.";
    private static final String SERVICE_KEY = "service.path.";
    private static String  restEasyPath = null;
    
    
    /**
     * Builds the URI and replaces the templates values with supplied params.
     * @param service - service being called, defined in link-builder.conf
     * @param action - action defined in link-builder.conf
     * @param params - key,value for replacement params.
     * @return - a URI String.
     */
    public static String buildURI(String service, String action, Map<String,String> params){
        configureRestPath();
        String uri = constructURITemplate(service, action);
        
        return processTemplate(uri,params);
    }
    
    
    /**
     * Processes key/values for template.
     * @param uri
     * @param params
     * @return
     */
    private static String processTemplate(String uri, Map<String,String> params) {
        String finalURI = uri;
        
        for (String key : params.keySet()) {
            finalURI.replaceAll("{"+key+"}", params.get(key));
        }
      //TODO: Might want to consider adding validation to the end result? make sure there are no {}s
        return finalURI;
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
