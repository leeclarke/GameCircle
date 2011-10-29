package controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import play.data.validation.Validation;
import play.test.Fixtures;
import util.LinkBuilder;

import models.User;
import models.util.UserDataMapper;

import com.google.gson.Gson;

import exception.GameCircleException;

/**
 * @author lee
 */
@Path("/users")
public class UserService{ 

    @GET
    @Path("/{id}")
    @Produces("application/json")
	public String getUser(@PathParam("id") final String uid) {
		User user = User.find("LOWER(UserName) = ?", uid.toLowerCase()).first();
		
		if(user == null){
		    throw new WebApplicationException(new IllegalArgumentException("Bad argument"), 404);
		} else {
		     return this.toJSONString(user);
		}
	}
	
    @GET
    @Produces("application/json")
	public String getAllUsers(){
		List<User> all = User.findAll();
		
		return this.toJSONString(all);
	}

  
    @POST
    @Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public Response createUser(MultivaluedMap<String, String> formParams)
	{
    	reloadDataBase();
    	
    	User newUser = UserDataMapper.buildUser(formParams);
    	if(!isExistingUser(newUser)){
    		validateAndSaveUser(newUser);
        	newUser.save();
    	} else {
    		throw new GameCircleException(new IllegalArgumentException("User ID already in use."), 404);
    		//TODO: reconsider error handling on POSTs, might want to return JSON Error object.
    	}
    	
    	Map<String, String> params = new HashMap<String, String>();
    	params.put("id", newUser.userName);
    	
		return sendRedirect("users", "get-user", params);
	}
    
    @PUT
    @Path("/{id}")
    @Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public User updateUser(@PathParam("id") final String uid, MultivaluedMap<String, String> formParams)
	{
    	User user = UserDataMapper.buildUser(formParams);
    	if(isExistingUser(user)){
    		validateAndSaveUser(user);
    	}
    	return user;
	}
    
    /**
     * Validates User, throws Exceptions if invalid user.
     * @param newUser
     * @throws WebApplicationException
     */
    private void validateAndSaveUser(User newUser) throws WebApplicationException
	{
    	try{
    		if(newUser== null) throw new NullPointerException("Unknown User");
    		newUser.save();
    	}catch (Exception e) {
			throw new GameCircleException(e, 400 ); //TODO: consider to error Mapper once ready
		}
	}

    /**
     * Checks to see if uses already exists.
     * @param newUser
     * @throws WebApplicationException
     */
    private boolean  isExistingUser(User newUser) throws WebApplicationException
	{
    	boolean exists = true;
		User user = User.getUserByUID(newUser.userName);
		if(user == null){
			exists = false;
		}
    	return exists;
	}
    
    
	private String toJSONString(Object o){
        return (new Gson().toJson(o));
    }

	protected void reloadDataBase(){
		Fixtures.deleteAllModels();
		Fixtures.loadModels("data.yml");
	}
	
	protected Response sendRedirect(String service, String action, Map<String, String> params){
		URI uri  = LinkBuilder.buildURI(service, action, params);
		
		return Response.status(303).contentLocation(uri).build();
	}
}
