package controllers;

import java.net.URI;
import java.util.Map;

import javax.ws.rs.core.Response;

import util.LinkBuilder;

import com.google.gson.Gson;


/**
 * Base JAX-RS service with methods for common usage
 * @author lee
 */
public abstract class GameCircleService
{

	protected String toJSONString(Object o)
	{
	    return (new Gson().toJson(o));
	}

	protected Response sendRedirect(String service, String action, Map<String, String> params)
	{
		URI uri  = LinkBuilder.buildURI(service, action, params);
		
		return Response.status(303).contentLocation(uri).build();
	}

}
