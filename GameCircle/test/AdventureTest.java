import java.util.ArrayList;
import java.util.List;

import models.Adventure;
import models.Sprite;
import models.User;

import org.junit.Test;

import play.test.UnitTest;


public class AdventureTest  extends UnitTest 
{
	@Test
	public void createAndRetrieveAdventure() {
		Integer tileSize = new Integer(32);
		//Get User for the Adventure		
		User aUser = User.find("byUserName", "SuperEBear").first();
		assertNotNull(aUser);
		
		String advName ="Eli's Grand Adventure";
		String bgColor = "#FFFFFF";
		Adventure adv = new Adventure(aUser,advName);
		adv.backgroundColor = bgColor;
		
		adv.spriteTileWidth = tileSize ;
		adv.spriteTileHeight = tileSize;
		adv.spriteSrc = "res/spriteSheet.jpg";
		adv.spriteSheetNamedTiles = new ArrayList<Sprite>();
		Adventure resp = adv.save();
		
		//Test adding Sprites
		//TODO Add a sprite and test.
        Sprite testSprite = new Sprite("WALL1",1,2,"wall",adv);
        testSprite.save();
        new Sprite("FLOOR1",0,1,"floor",adv).save();
//        adv.spriteSheetNamedTiles.add(testSprite);
//        adv.save();
//        adv.spriteSheetNamedTiles.add();
		
		
		Adventure adv1 = Adventure.findById(resp.id);
		assertNotNull(adv1);
		assertNotNull(adv1.id);
		assertEquals(advName, adv1.name);
		assertEquals(bgColor, adv1.backgroundColor);
		assertEquals(aUser, adv1.user);
		assertEquals(tileSize, adv1.spriteTileWidth);
		assertEquals(tileSize, adv1.spriteTileHeight);
		assertEquals("res/spriteSheet.jpg", adv1.spriteSrc);
	}

	@Test
	public void findByUser(){
		User aUser = User.find("byUserName", "SuperEBear").first();
		assertNotNull(aUser);
		
		//Add an adv to be sure there is one.
		String advName ="Eli's Grand Adventure";
		String bgColor = "#FFFFFF";
		Adventure adv = new Adventure(aUser,advName);
		adv.backgroundColor = bgColor;
		
		Adventure resp = adv.save();
		
		List<Adventure> advs = Adventure.findByUser(aUser);
		assertTrue(advs.size()>0);
	}
}
