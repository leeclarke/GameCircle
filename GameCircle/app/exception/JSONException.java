package exception;

import models.util.ErrorMessages;
import models.util.FieldError;


/**
 * Throwable Wrapper for returning Validation errors.
 * @author lee
 */
public class JSONException extends Exception
{

	public ErrorMessages errors;
	
	/**
	 * @param status
	 * @param errors
	 */
	public JSONException(int status, ErrorMessages errors)
	{
		this.errors = errors;
		this.errors.status = status;
	}

	/**
	 * @param status
	 * @param fieldName
	 * @param message
	 */
	public JSONException(int status, String fieldName, String message)
    {
        this.errors = new ErrorMessages();
        this.errors.addError(new FieldError(fieldName, message, true));
        this.errors.status = status;
    }
	
}
