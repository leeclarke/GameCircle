package models;

import javax.persistence.Entity;

import play.db.jpa.Model;

@Entity
public class User extends Model {
	public String email;
    public String firstName;
    public String lastName;
    public String userName;
    public boolean isAGameMaster;
    
    public User(String userName) {
    	this.userName = userName;
    }
    
    public User(String email, String firstName, String lastName, String userName){
    	this.email = email;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.userName = userName;
    }
    
}
