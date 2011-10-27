package controllers;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MultivaluedMap;

import models.User;
import models.util.UserDataMapper;

import com.google.gson.Gson;

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
		    throw new WebApplicationException(new IllegalArgumentException("2. Bad argument"), 404);
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

  //TODO: Test this. Write Selenium test?  
    @POST
    @Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public User createUser(MultivaluedMap<String, String> formParams)
	{
    	User newUser = UserDataMapper.buildUser(formParams);
    	validateUser(newUser);
    	newUser.save();
    	
    	return newUser;
	}
    
    /**
     * Validates User, throws Exceptions if invalid user.
     * @param newUser
     * @throws WebApplicationException
     */
    private void validateUser(User newUser) throws WebApplicationException
	{
		// TODO Auto-generated method stub
		//VErify that UID not null
    	//verify not used in db already
//    	check other fields
	}

	private String toJSONString(Object o){
        return (new Gson().toJson(o));
    }
    
}
