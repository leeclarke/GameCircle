package models;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import play.data.validation.Required;
import play.db.jpa.Model;

@Entity
public class Adventure extends Model
{
	public enum SaveType{
		ONLINE, LOCAL, BOTH;
	}
	@Required  public String name;
	public String backroundColor;
	public String gridColor;
	public String npcBorderColor;
	public SaveType saveOptions;
	
	@ManyToOne
    public User user;
	
	public Adventure(User user, String name){
		this.user = user;
		this.name = name;
		this.saveOptions = SaveType.ONLINE;
	}
	
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
	
}
