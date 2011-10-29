package models;

import javax.persistence.Entity;
import javax.persistence.Transient;

import org.jboss.resteasy.spi.touri.ObjectToURI;
import org.jboss.resteasy.spi.touri.URITemplate;

import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class User extends Model {
	
	@Required @Email public String email;
	@Required public String firstName;
    public String lastName;
    @Required(message="validation.user.uid.required")public String userName;
    public boolean isAGameMaster;
    @Transient public String self;
    
    public User(String userName) {
    	this.userName = userName;
    	this.self = ObjectToURI.getInstance().resolveURI(this);
    }
    
    public User(String email, String firstName, String lastName, String userName){
    	this.email = email;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.userName = userName;
    	this.self = ObjectToURI.getInstance().resolveURI(this);
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
