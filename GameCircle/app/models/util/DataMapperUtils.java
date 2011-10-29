package models.util;

import java.util.List;

import javax.ws.rs.core.MultivaluedMap;


/**
 * Helper Methods for use in Data Mapping.
 * @author lee
 */
public class DataMapperUtils
{
	/**
	 * Provides a safe way to retrieve a value from a MultivaluedMap.
	 * @param map - MultivaluedMap
	 * @param key - mapKey
	 * @return - value or null if not present/set
	 */
	public static String getMapValue(MultivaluedMap<String, String> map, String key) {
		if(key != null && map.containsKey(key)){
			return map.getFirst(key); 
		}		
		return null;
	}
	
	/**
	 *Provides a safe way to retrieve a value from a MultivaluedMap.
	 * @param map - MultivaluedMap
	 * @param key - mapKey
	 * @return-  List or null if not present/set
	 */
	public static List<String> getMapListValue(MultivaluedMap<String, String> map, String key) {
		if(key != null && map.containsKey(key)){
			return map.get(key); 
		}		
		return null;
	}
	
	/**
	 * Returns a Boolean value based on map value. Only a 'true' (case insensitive) will return true, anything 
	 * else will be false. 
	 * @param map - MultivaluedMap
	 * @param key - mapKey
	 * @return - Boolean value
	 */
	public static Boolean getMapValueAsBoolean(MultivaluedMap<String, String> map, String key) {
		if(key != null && map.containsKey(key)){
			String strBool = (String) getMapValue(map,"isAGameMaster");
			return (strBool != null && strBool.equalsIgnoreCase("true"))?Boolean.TRUE: Boolean.FALSE; 
		}		
		return Boolean.FALSE;
	}
}
