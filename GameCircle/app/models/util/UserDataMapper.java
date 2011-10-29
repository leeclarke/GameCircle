package models.util;

import java.util.List;

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
		String userName = (String) getMapValue(formParams,"userName");
		User user = new User(userName);
		user.email = (String) getMapValue(formParams,"email");
		user.firstName = (String) getMapValue(formParams,"firstName");
		user.lastName = (String) getMapValue(formParams,"lastName");
		user.isAGameMaster = getMapValueAsBoolean(formParams, "isAGameMaster");
		return user;
	}

}
