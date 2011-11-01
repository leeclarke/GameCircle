package exception;

import models.util.ErrorMessages;


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

}
