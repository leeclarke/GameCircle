package models.util;

/**
 * Object for communicating error state of a given field back to the client.
 * @author leeclarke
 */
public class FieldError {
    public String fieldName;
    public String message;
    public boolean required;
    
    public FieldError(){
    }
    
    public FieldError(String fieldName, String msg, boolean req){
        this.fieldName = fieldName;
        this.message = msg;
        this.required = req;
    }
}
