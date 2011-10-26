package controllers;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Path("/responses")
public class ResponseMaker
{
   /**
    * Generates an HTTP response based on the String provided as part of this
    * resource's URI.
    * 
    * @param responseString Portion of this resource's URI from which the
    *    particular response will be generated.
    * @return Response based on provided URI portion.
    */
   @GET
   @Path("/{responseString}")
   @Consumes("text/plain")
   @Produces("text/html")
   public Response getResponse(
      @PathParam("responseString") final String responseString)
   {
      final String desiredResponse =  responseString != null
                                    ? responseString.trim().toUpperCase()
                                    : Status.BAD_REQUEST.name();
      Status status = null;
      try
      {
         status = Status.valueOf(desiredResponse);
      }
      catch (IllegalArgumentException illegalArgEx)
      {
         status = Status.BAD_REQUEST;
      }
      return Response.status(status).type(MediaType.TEXT_HTML_TYPE).build();
   }
   
   /**
    * Return an exception-based HTTP response based on the provided number
    * indicating a particular exception to be used.  The HTTP method PUT would
    * normally likely not be the method used for this type of operation, but
    * it makes it easy to differentiate from the other method in this class
    * already tied to @GET and also accepting a single String.
    *
    * There are four cases in which a particular exception is used to build the
    * response and that exception and a particular Response.Status are provided,
    * telling the JAX-RS provider which HTTP status to tie to that particular
    * thrown exception.  In the default/general case when one of the first four
    * are not used, no specific Response.Status is used, so the general 500
    * Internal Server Error will be returned to the client along with the'
    * exception's stack trace as the body.
    *
    * @param exceptionNumberType A number used to determine which type of
    *    exception is used for the basis of the response.
    * @return Response based on the described exception type.
    */
   @PUT
   @Path("/{exceptionNumberType}")
   @Consumes("text/plain")
   public Response causeException(
      @PathParam("exceptionNumberType") final int exceptionNumberType)
   {
      Exception exception;
      Status status = null;
      switch (exceptionNumberType)
      {
         case 1  : exception = new NullPointerException("1. Null Encountered.");
                   status = Status.NOT_FOUND;
                   break;
         case 2  : exception = new IllegalArgumentException("2. Bad argument");
                   status = Status.PRECONDITION_FAILED;
                   break;
         case 3  : exception = new RuntimeException("3. Runtime Exception");
                   status = Status.BAD_REQUEST;
                   break;
         case 4  : exception = new NumberFormatException("4. Bad Numeric Format");
                   status = Status.NOT_ACCEPTABLE;
                   break;
         default : exception = new Exception("General Exception");
      }
      throw  status != null
           ? new WebApplicationException(exception, status)
           : new WebApplicationException(exception);
   }

}

