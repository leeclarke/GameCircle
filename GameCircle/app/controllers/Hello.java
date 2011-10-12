package controllers;

@Path("/hello")
public class Hello {

 @GET
 @Produces("text/plain")
 public String get(){
  return "Hello World\n";
 }

}
