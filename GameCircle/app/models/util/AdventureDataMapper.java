package models.util;

import javax.ws.rs.core.MultivaluedMap;

import models.Adventure;
import models.User;
import models.Adventure.SaveType;
import exception.JSONException;

/**
 * Maps data to and from other formats and into an Adventure
 * @author lee
 */
public class AdventureDataMapper {

    /**
     * Maps submitted data values to the object.
     * @param user
     * @param formParams
     * @return
     */
    public static Adventure buildAdventure(User user, MultivaluedMap<String, String> formParams) {
        Adventure newAdv = new Adventure(user, DataMapperUtils.getMapValue(formParams, "adventureId"));
        newAdv.backgroundColor = DataMapperUtils.getMapValue(formParams, "prefs.bgColor");
        newAdv.gridColor = DataMapperUtils.getMapValue(formParams, "prefs.gridColor");
        newAdv.npcBorderColor = DataMapperUtils.getMapValue(formParams, "prefs.npcBorderColor");
        String saveTypeString = DataMapperUtils.getMapValue(formParams, "prefs.saveType");
        newAdv.saveOptions = SaveType.valueOf(saveTypeString);
        
        newAdv.placementTileId = DataMapperUtils.getMapValue(formParams, "prefs.placementTile.id");
        newAdv.placementTileType = DataMapperUtils.getMapValue(formParams, "prefs.placementTile.type");
        
        return newAdv;
    }

    /**
     * Retrieves a User to be used when persisting the Adventure.
     * @param formParams
     * @return
     * @throws JSONException
     */
    public static User retrieveUser(MultivaluedMap<String, String> formParams) throws JSONException {
        String uid = formParams.getFirst("UID");
        User user = User.getUserByUID(uid);
        
        if(user == null) {
            throw new JSONException(404, "userName", "Invalid User ID");
        }
            
        return user;
    }

}
