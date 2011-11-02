package models;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Transient;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import play.data.validation.Email;
import play.data.validation.Required;
import play.db.jpa.Model;
import util.LinkBuilder;

@Entity
public class User extends Model {
	
	private static final String ID = "id";
	private static final String USERS = "users";
	@Required @Email public String email;
	@Required public String firstName;
    public String lastName;
    @Required(message="validation.user.uid.required")public String userName;
    public boolean isAGameMaster;
    @Transient public Map<String,String> links;
    
    public User(String userName) {
    	this.userName = userName;
    }
    
    public User(String email, String firstName, String lastName, String userName){
    	this.email = email;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.userName = userName;
    }
    
    /**
     * Initialize links for json responses. Doing this in the constructor doesn't do much good because JPA doesn't 
     * seem to call the constructor.
     */
    public void initLinks(){
    	if(this.links == null){
    		this.links = new HashMap<String, String>(); 
    	}
    	this.links.put("self",LinkBuilder.buildURI(USERS, "get-user", ID,this.userName).toString());
    	this.links.put("update",LinkBuilder.buildURI(USERS, "update-user", ID,this.userName).toString());
    }
    
    /**
     * Common call simplified by making a helper.
     * @param uid
     * @return
     */
    public static User getUserByUID(String uid){
    	return User.find("LOWER(UserName) = ?", uid.toLowerCase()).first();
    }
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
