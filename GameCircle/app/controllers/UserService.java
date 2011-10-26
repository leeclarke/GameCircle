package controllers;

import java.util.List;

import models.User;
import play.mvc.Controller;

/**
 * @author lee
 */
public class UserService extends Controller{

	public static void getUser(String uid) {
		User user = User.find("LOWER(UserName) = ?", uid.toLowerCase()).first();
		
		if(user == null){
		        response.status = 405;
		        render();
		} else {
		    renderJSON(user);
		}
	}
	
	public static void getAllUsers(){
		List<User> all = User.findAll();
		
		renderJSON(all);
	}

}
