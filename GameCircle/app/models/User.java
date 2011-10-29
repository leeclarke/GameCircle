package models;

import javax.persistence.Entity;

import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class User extends Model {
	
	@Required @Email public String email;
	@Required public String firstName;
    public String lastName;
    public String userName;
    public boolean isAGameMaster;
    
    public User(@Required(message="validation.user.uid.required") String userName) {
    	this.userName = userName;
    }
    
    public User(String email, String firstName, String lastName, @Required(message="validation.user.uid.required") String userName){
    	this.email = email;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.userName = userName;
    }
    
    
    /**
     * Common call simplified by making a helper.
     * @param uid
     * @return
     */
    public static User getUserByUID(String uid){
    	return User.find("LOWER(UserName) = ?", uid.toLowerCase()).first();
    }
}
