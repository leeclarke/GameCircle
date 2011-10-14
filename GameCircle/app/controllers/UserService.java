package controllers;

import java.util.HashMap;
import java.util.List;

import models.User;

import play.db.jpa.JPABase;
import play.mvc.Controller;

/**
 * @author lee
 */
public class UserService extends Controller{

	public static void getUser(String uid) {
		User user = User.find("byUserName", uid).first();
		renderJSON(user);
	}
	
	public static void getAllUsers(){
		List<User> all = User.findAll();
		
		renderJSON(all);
	}

}
