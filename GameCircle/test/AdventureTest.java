import models.Adventure;
import models.User;

import org.junit.Test;

import play.db.jpa.JPABase;
import play.test.UnitTest;


public class AdventureTest  extends UnitTest 
{
	@Test
	public void createAndRetrieveAdventure() {
		//Get User for the Adventure
		User aUser = User.find("byUserName", "SuperEBear").first();
		assertNotNull(aUser);
		
		String advName ="Eli's Grand Adventure";
		String bgColor = "#FFFFFF";
		Adventure adv = new Adventure(aUser,advName);
		adv.backroundColor = bgColor;
		
		Adventure resp = adv.save();
		
		assertEquals(advName, resp.name);
		assertEquals(bgColor, resp.backroundColor);
		assertEquals(aUser, resp.user);
	}

}
