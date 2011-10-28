package models;

import javax.persistence.Entity;
import javax.persistence.Transient;

import org.jboss.resteasy.spi.touri.ObjectToURI;
import org.jboss.resteasy.spi.touri.URITemplate;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
@URITemplate("/user/{userName}")
public class User extends Model {
	public String email;
    public String firstName;
    public String lastName;
    public String userName;
    public boolean isAGameMaster;
    @Transient public String self;
    
    public User(@Required(message="validation.user.uid.required") String userName) {
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
