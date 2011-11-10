package controllers;

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
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import models.User;
import models.util.ErrorMessages;
import models.util.FieldError;
import models.util.UserDataMapper;
import play.data.validation.Error;
import play.data.validation.Validation;
import exception.JSONException;

//TODO: Add a getAdventuresForUser   /{id}/adventures/
//TODO: Implement Error responses for POST/PUTs
 
/**
 * Provides all User management services.
 * 
 * @author lee
 */
@Path("/users")
public class UserService extends GameCircleService
{

	@GET
	@Path("/{id}")
	@Produces("application/json")
	public String getUser(@PathParam("id") final String uid)
	{
		User user = User.find("LOWER(UserName) = ?", uid.toLowerCase()).first();

		if (user == null)
		{
			throw new WebApplicationException(new IllegalArgumentException("Bad argument"), 404);
		} else
		{
			user.initLinks();
			return this.toJSONString(user);
		}
	}

	@GET
	@Produces("application/json")
	public String getAllUsers()
	{
		List<User> all = User.findAll();

		for (User user : all)
		{
			user.initLinks();
		}

		return this.toJSONString(all);
	}

	@POST
	@Consumes("application/x-www-form-urlencoded")
	@Produces("application/json")
	public Response createUser(MultivaluedMap<String, String> formParams)
	{
		User newUser = UserDataMapper.buildUser(formParams);
		if (!isExistingUser(newUser))
		{
			try
			{
				validateAndSaveUser(newUser);
			} catch (JSONException jsonE)
			{
				return sendError(jsonE.errors);
			}
			newUser.save();
		} else
		{
			return sendError(404,new FieldError("userName","User ID already in use.",true));
		}

		Map<String, String> params = new HashMap<String, String>();
		params.put("id", newUser.userName);

		return sendRedirect("users", "get-user", params);
	}

	@PUT
	@Path("/{id}")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("application/json")
	public Response updateUser(@PathParam("id") final String uid, MultivaluedMap<String, String> formParams)
	{
		Map<String, String> params = new HashMap<String, String>();
		try
		{
			User user = UserDataMapper.updateUserFromPut(uid, formParams);
			if (isExistingUser(user))
			{
				validateAndSaveUser(user);
			}
			params.put("id", user.userName);
		} catch (JSONException e)
		{
			return sendError(e.errors);
		} catch (Exception ex) {
		    //TODO: Add mapper to map Runtime exceptions to an error message.
		    ErrorMessages err = new ErrorMessages();
		    err.addError(new FieldError("user",ex.getMessage()+" ",false));
		    return sendError(err);
		}
		return sendRedirect("users", "get-user", params);
	}

	/**
	 * Validates User, throws Exceptions if invalid user.
	 * 
	 * @param newUser
	 * @throws WebApplicationException
	 * @throws JSONException
	 */
	private void validateAndSaveUser(User newUser) throws WebApplicationException, JSONException
	{
		int status = 303;
		Validation validation = Validation.current();
		if (newUser == null) {
		    validation.addError("userName", "Invalid Account", "");
		    status = 404;
		}
		
		validation.email(newUser.email);
        validation.minSize("firstName", newUser.firstName, 2);
		boolean updateSuccess = newUser.validateAndSave(); 
		
		//Catch a save error that wasn't from validation.
		if(!updateSuccess && !validation.hasErrors()){
            validation.addError("user", "Unable to update User data.", "");
        }
		
		ErrorMessages errors = new ErrorMessages();
		if (validation.hasErrors())
		{
		    status = 409;
		    for (Error err : validation.errors()) {
                errors.errors.add(new FieldError(err.getKey(), err.toString(), false));
            }
			
		     throw new JSONException(status, errors);
		}
	}

	/**
	 * Checks to see if uses already exists.
	 * 
	 * @param newUser
	 * @throws WebApplicationException
	 * @throws JSONException 
	 */
	private boolean isExistingUser(User newUser) throws WebApplicationException
	{
		boolean exists = true;
		if(newUser == null || newUser.userName == null){
		    return false;
		}
		User user = User.getUserByUID(newUser.userName);
		if (user == null)
		{
			exists = false;
		}
		return exists;
	}
}
