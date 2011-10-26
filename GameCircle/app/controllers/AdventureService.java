package controllers;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;

/**
 * Responsible for Functions surrounding building and maintaining Adventures. All functionality 
 * is supported through JAX-WS and RESTEasy plug-in.
 * @author lee
 */
@Path("/adventure")
public class AdventureService { 

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
	public String getAdventure(@PathParam("id") final String responseString){
	    if(responseString.equalsIgnoreCase("boom")){
	        throw new WebApplicationException(new IllegalArgumentException("2. Bad argument"), 404);
	    }else if(responseString.equalsIgnoreCase("splat")){
            throw new WebApplicationException(new IllegalArgumentException("2. Bad argument"), 500);
        }
	    
	    return "{greet:'Hello REST'}";
	}
}
