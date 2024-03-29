package models.util;

import javax.ws.rs.core.MultivaluedMap;

import models.User;


/**
 * Maps data to and or from an User model.
 * @author lee
 */
public class UserDataMapper extends DataMapperUtils
{

	/**
	 * Populates a User Object from a Map of POSTed values.
	 * @param formParams - map containing posted form values
	 * @return - populated <codeUser></code>
	 */
	public static User buildUser(MultivaluedMap<String, String> formParams)
	{
		String userName = getMapValue(formParams,"userName");
		User user = new User(userName);
		user.email = getMapValue(formParams,"email").toLowerCase();
		user.firstName = getMapValue(formParams,"firstName");
		user.lastName = getMapValue(formParams,"lastName");
		user.isAGameMaster = getMapValueAsBoolean(formParams, "isAGameMaster");
		return user;
	}
	
	/**
	 * Updates existing user model with any values posted in JSON.
	 * @param uid 
	 * @param formParams
	 * @return
	 */
	public static User updateUserFromPut(String uid, MultivaluedMap<String, String> formParams){
//		String userName = (String) getMapValue(formParams,"userName");
		User user = User.getUserByUID(uid);
		if(user != null){
		    String email = getMapValue(formParams,"email");
		    if(email != null) {
		        updateIfChanged(user,"email", email.toLowerCase());
		    }
			updateIfChanged(user,"firstName", getMapValue(formParams,"firstName"));
			updateIfChanged(user,"lastName", getMapValue(formParams,"lastName"));
			user.isAGameMaster = getMapValueAsBoolean(formParams, "isAGameMaster");
		}
		return user;
	}

	/**
	 * Update the Model with the new value if the value is not a null. A "" value indicates it should be 
	 * set to null.
	 * 
	 * @param model - model object to be updated.
	 * @param fieldName - name of field to be updated
	 * @param mapValue - new data value.
	 */
	private static void updateIfChanged(User user, String fieldName, String mapValue)
	{
		try
		{
			if(mapValue == null){
				return;
			} else if(mapValue.trim().isEmpty()){
				User.class.getDeclaredField(fieldName).set(user, null);
			} else{
				User.class.getDeclaredField(fieldName).set(user, mapValue);
			}
			User.class.getDeclaredField(fieldName);
		} catch (Exception e)
		{
			e.printStackTrace();
		} 
		
	}

	

}
