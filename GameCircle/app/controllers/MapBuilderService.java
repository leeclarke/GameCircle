package controllers;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import models.Sprite;

@Path("/maps")
public class MapBuilderService  extends GameCircleService{

    @GET
    @Path("/sprites")
    @Produces("application/json")
    public String getAllSprites(){
        List<Sprite> sprites = Sprite.findAll();
        return toJSONString(sprites);
    }
    
}
