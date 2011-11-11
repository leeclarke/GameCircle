import java.util.List;

import models.Adventure;
import models.User;

import org.junit.Test;

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
		
		Adventure adv1 = Adventure.findById(resp.id);
		assertNotNull(adv1);
		assertNotNull(adv1.id);
		assertEquals(advName, adv1.name);
		assertEquals(bgColor, adv1.backroundColor);
		assertEquals(aUser, adv1.user);
	}

	@Test
	public void findByUser(){
		User aUser = User.find("byUserName", "SuperEBear").first();
		assertNotNull(aUser);
		
		//Add an adv to be sure there is one.
		String advName ="Eli's Grand Adventure";
		String bgColor = "#FFFFFF";
		Adventure adv = new Adventure(aUser,advName);
		adv.backroundColor = bgColor;
		
		Adventure resp = adv.save();
		
		List<Adventure> advs = Adventure.findByUser(aUser);
		assertTrue(advs.size()>0);
	}
}
