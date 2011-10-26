package controllers;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;

import models.User;

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

    private String toJSONString(Object o){
        return (new Gson().toJson(o));
    }
    
}
