package controllers;

import java.lang.reflect.Modifier;
import java.net.URI;
import java.util.Map;

import javax.ws.rs.core.Response;

import models.util.ErrorMessages;
import models.util.FieldError;
import util.LinkBuilder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


/**
 * Base JAX-RS service with methods for common usage
 * @author lee
 */
public abstract class GameCircleService
{

	/**
	 * Convert object to JSON.
	 * Note: marking things transient will prevent them from being rendered in JSON.
	 * @param o - object
	 * @return - JSON stirng
	 */
	protected String toJSONString(Object o)
	{
	    Gson gson = new GsonBuilder()
        .excludeFieldsWithModifiers(Modifier.TRANSIENT)  
        .create();
	    return (gson.toJson(o));
	}

	/**
	 * Returns a 303 redirect after building the redirect link.
	 * @param service - target service
	 * @param action - action to map uri to
	 * @param params - replacement params
	 * @return - Response
	 */
	protected Response sendRedirect(String service, String action, Map<String, String> params)
	{
		URI uri  = LinkBuilder.buildURI(service, action, params);
		
		return Response.status(303).contentLocation(uri).build();
	}

	/**
	 * Returns an error of the specified status along with a structured JSON errorMessage collection for use by the front end.
	 * @param errors
	 * @return - Response
	 */
	protected Response sendError(ErrorMessages errors)
    {
        Response resp = Response.status(errors.status).entity(toJSONString(errors)).build(); 
        return resp;
    }

    /**
     * Returns an error of the specified status along with a structured JSON errorMessage collection for use by the front end.
     * @param status - HTTP status
     * @param fieldError - fieldError object
     * @return - Response
     */
    protected Response sendError(int status, FieldError fieldError) {
        ErrorMessages errors = new ErrorMessages();
        errors.addError(fieldError);
        errors.status = status;
        return this.sendError(errors );
    }
}
