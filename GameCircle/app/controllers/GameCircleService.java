package controllers;

import java.net.URI;
import java.util.Map;

import javax.ws.rs.core.Response;

import models.util.ErrorMessages;
import util.LinkBuilder;

import com.google.gson.Gson;


/**
 * Base JAX-RS service with methods for common usage
 * @author lee
 */
public abstract class GameCircleService
{

	/**
	 * convert object to JSON.
	 * @param o
	 * @return - JSON stirng
	 */
	protected String toJSONString(Object o)
	{
	    return (new Gson().toJson(o));
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
	 * @return
	 */
	protected Response sendError(ErrorMessages errors)
    {
        Response resp = Response.status(errors.status).entity(toJSONString(errors)).build(); 
        return resp;
    }
}
