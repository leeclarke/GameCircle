/**
 * 
 */
package exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;


/**
 * Applications Exception handler, maps internal errors to HTTP Error codes and messages..
 * @author lee
 *
 */
public class GameCircleException extends WebApplicationException
{

	/**
	 * 
	 */
	public GameCircleException()
	{
		super();
	}

	/**
	 * @param response
	 */
	public GameCircleException(Response response)
	{
		super(response);
	}

	/**
	 * @param status
	 */
	public GameCircleException(int status)
	{
		super(status);
	}

	/**
	 * @param status
	 */
	public GameCircleException(Status status)
	{
		super(status);
	}

	/**
	 * @param cause
	 */
	public GameCircleException(Throwable cause)
	{
		super(cause);
		//TODO: Map cause to an HTTP error code.
	}

	/**
	 * @param cause
	 * @param response
	 */
	public GameCircleException(Throwable cause, Response response)
	{
		super(cause, response);
		//TODO: Map cause to an HTTP error code.
	}

	/**
	 * @param cause
	 * @param status
	 */
	public GameCircleException(Throwable cause, int status)
	{
		super(cause, status);
	}

	/**
	 * @param cause
	 * @param status
	 */
	public GameCircleException(Throwable cause, Status status)
	{
		super(cause, status);
	}

}
