package models.util;

import java.util.ArrayList;
import java.util.List;

/**
 * JSON renderable object for carrying back to the UI error messages.
 * @author lee
 */
public class ErrorMessages {

    public int status;
    public List<FieldError> errors;

    public ErrorMessages(){
        errors = new ArrayList<FieldError>();
        status = 404;
    }
    
    /**
     * Helper method.
     * @param fieldError
     */
    public void addError(FieldError fieldError){
    	this.errors.add(fieldError);
    }
}
