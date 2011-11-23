package controllers;

import java.util.ArrayList;
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

import models.Adventure;
import models.Sprite;
import models.User;
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

    @GET
    @Produces("application/json")
    public String getAllAdventures(){
        List<Adventure> adventures = Adventure.findAll();
 //TODO: Remove, this would expose all adventures to all users.       
        if (adventures == null)
        {
            throw new WebApplicationException(new IllegalArgumentException("Bad argument"), 404);
        } else
        {
            List<AdventureResource> advColl = new ArrayList<AdventureResource>();
            for (Adventure adventure : adventures) {
                List<Sprite> sprites = Sprite.findByAdventure(adventure); //Sort of hack-ish but JPA is failing to populate and I'm tired of debugging the thing.
                AdventureResource advResource = new AdventureResource(adventure, sprites);
                advColl.add(advResource);
            }
           
            return toJSONString(advColl);
        }
    }
    
	@GET
	@Produces("application/json")
	@Path("/{id}")
	public String getAdventure(@PathParam("id") final Long id){
	    Adventure adventure = Adventure.findById(id);
	    
	    if (adventure == null)
        {
            throw new WebApplicationException(new IllegalArgumentException("Bad argument id="+id), 404);
        } else
        {
            List<Sprite> sprites = Sprite.findByAdventure(adventure); //Sort of hack-ish but JPA is failing to populate and I'm tired of debugging the thing.
            AdventureResource advResource = new AdventureResource(adventure, sprites);
    	    return toJSONString(advResource);
        }
	}
	
	/**
	 * Adds top level data not the entire map.
	 * Fields: userId, adventureId, prefs.bgColor, prefs.gridColor, prefs.npcBorderColor, prefs.saveType, prefs.placementTile.id, prefs.placementTile.type
	 * @param formParams
	 * @return
	 */
	@POST
	@Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public Response addAdventure(MultivaluedMap<String, String> formParams){
	    //get User
	    String uid = formParams.getFirst("userId");
	    User user = User.getUserByUID(uid);
	    Adventure newAdv = AdventureDataMapper.buildAdventure(user, formParams);
        if (!isExistingAdventure(user,newAdv)) {
            try {
                validateAdventure(newAdv);
            } catch (JSONException jsonE) {
                return sendError(jsonE.errors);
            }
            newAdv = newAdv.save();
        } else {
            return sendError(409, new FieldError("adventureName", "Adventure Name already in use by you.", true));
        }
        
	    Map<String, String> params = new HashMap<String, String>();
        params.put("id", String.valueOf(newAdv.id));
        
	    return sendRedirect("adventure", "get-adventure", params);
	}
	
	/**
	 * Updates the following parts of the Adventure.
	 * Fields: userId, adventureId, prefs.bgColor, prefs.gridColor, prefs.npcBorderColor, prefs.saveType, prefs.placementTile.id, prefs.placementTile.type
	 * @param formParams
	 * @return
	 */
	@PUT
	@Path("/{id}")
	@Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public Response saveAdventure(@PathParam("id") final Long id, MultivaluedMap<String, String> formParams) {
		
	    String uid = formParams.getFirst("userId");
	    User user = User.getUserByUID(uid);
	    Adventure adventure = Adventure.findById(id);
	    if(adventure.user != user){
	    	return sendError(404, new FieldError("userId", "That adventure does not belong to you.", true));
	    }
	    
	    AdventureDataMapper.mapFields(adventure, formParams);
        if (isExistingAdventure(user,adventure)) {
            try {
                validateAdventure(adventure);
            } catch (JSONException jsonE) {
                return sendError(jsonE.errors);
            }
            adventure = adventure.save();
        } else {
            return sendError(404, new FieldError("adventureName", "Adventure Name already in use by you.", true));
        }
        
	    Map<String, String> params = new HashMap<String, String>();
        params.put("id", String.valueOf(adventure.id));
        
	    return sendRedirect("adventure", "get-adventure", params);
    }
	
	@POST
	@Path("/{id}/map/{mapId}")
    @Produces("application/json")
	public Response updateAdventureMap(@PathParam("id") final String id, @PathParam("mapId") final String mapId) {
	    //TODO: Stubbed. Figure out how to handle JSON POST
	    
	    Map<String, String> params = new HashMap<String, String>();
        params.put("id", id);
        
	    return sendRedirect("adventure", "get-map", params);
    }
	
	/**
     * Checks to see if adventure already exists enforcing that the Adventure name is unique for the user..
     * 
	 * @param user 
     * @param newUser
     * @throws WebApplicationException
     * @throws JSONException 
     */
    private boolean isExistingAdventure(User user, Adventure newAdv) throws WebApplicationException
    {
        List<Adventure> advs = Adventure.findByUser(user);
        for (Adventure adventure : advs) {
            if(adventure.name.equalsIgnoreCase(newAdv.name)){
                return true;
            }
        }
        if(newAdv == null || newAdv.id == null){
            return false;
        }
        
        return false;
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
        int status = 409;
        Validation validation = Validation.current();
        if (newAdv == null) {
            validation.addError("adventure", "Invalid State", "");
            status = 404;
        }

        //TODO: Consider validating the color values with custom validator.
        boolean updateSuccess = newAdv.validateAndSave(); 

        if(!updateSuccess && !validation.hasErrors()){
            validation.addError("user", "Unable to update User data.", "");
        }
        
        ErrorMessages errors = new ErrorMessages();
        if (validation.hasErrors())
        {
            for (Error err : validation.errors()) {
                errors.errors.add(new FieldError(err.getKey(), err.toString(), false));
            }
            throw new JSONException(status, errors);
        }
    }
    
}
