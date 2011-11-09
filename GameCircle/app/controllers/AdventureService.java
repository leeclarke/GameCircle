package controllers;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import models.Adventure;
import models.render.AdventureResource;
import models.util.AdventureDataMapper;
import models.util.ErrorMessages;
import models.util.FieldError;
import play.data.validation.Error;
import play.data.validation.Validation;
import exception.JSONException;

/**
 * Responsible for Functions surrounding building and maintaining Adventures. All functionality 
 * is supported through JAX-WS and RESTEasy plug-in.
 * @author lee
 */
@Path("/adventure")
public class AdventureService extends GameCircleService{ 

	/**
	 * Returns the current conditions in JSON format
	 */
	public static void saveAdventure() {
		//HashMap<SensorType, SensorData> conds = SensorData.retrieveLatestSensorData();
		//conds.put(SensorType.TEMPERATURE, TempSensorData.getCurrentReading());
		//renderJSON(conds);
	}
	
	@GET
	@Produces("application/json")
	@Path("/{id}")
	public String getAdventure(@PathParam("id") final String id){
	    Adventure adventure = Adventure.findById(id);
	    
	    if (adventure == null)
        {
            throw new WebApplicationException(new IllegalArgumentException("Bad argument"), 404);
        } else
        {
    	    AdventureResource advResource = new AdventureResource(adventure);
    	    return toJSONString(advResource);
        }
	}
	
	@PUT
	@Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public Response addAdventure(MultivaluedMap<String, String> formParams){
	    Adventure newAdv = AdventureDataMapper.buildAdventure(formParams);
        if (!isExistingAdventure(newAdv))
        {
            try
            {
                validateAdventure(newAdv);
            } catch (JSONException jsonE)
            {
                return sendError(jsonE.errors);
            }
            newAdv.save();
        } else
        {
            return sendError(404,new FieldError("userName","User ID already in use.",true));
        }
        
	    Map<String, String> params = new HashMap<String, String>();
        params.put("id", String.valueOf(newAdv.id));
        
	    return sendRedirect("adventure", "get-adventure", params);
	}
	
	/**
     * Checks to see if uses already exists.
     * 
     * @param newUser
     * @throws WebApplicationException
     * @throws JSONException 
     */
    private boolean isExistingAdventure(Adventure newAdv) throws WebApplicationException
    {
        boolean exists = true;
        if(newAdv == null || newAdv.id != null){
            return false;
        }
        //TODO: What would indicase a unique value for an Adventure? Name and User? Does this need checking?
//        Adventure adv = Adventure.findById(id)(newUser.userName);
//        if (user == null)
//        {
//            exists = false;
//        }
        return exists;
    }
    
    /**
     * Validates User, throws Exceptions if invalid user.
     * 
     * @param newUser
     * @throws WebApplicationException
     * @throws JSONException
     */
    private void validateAdventure(Adventure newAdv) throws WebApplicationException, JSONException
    {
        int status = 303;
        Validation validation = Validation.current();
        if (newAdv == null) {
            validation.addError("userName", "Invalid State", "");
            status = 404;
        }
        //TODO: Replace user example with actual validation.
//        validation.email(newUser.email);
//        validation.minSize("firstName", newUser.firstName, 2);
//        boolean updateSuccess = newUser.validateAndSave(); 
//        
//        //Catch a save error that wasn't from validation.
//        if(!updateSuccess && !validation.hasErrors()){
//            validation.addError("user", "Unable to update User data.", "");
//        }
        
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
    
}
