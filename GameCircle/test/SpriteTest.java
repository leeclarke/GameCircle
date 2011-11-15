import java.util.List;

import models.Adventure;
import models.Sprite;
import models.User;

import org.junit.Test;

import play.test.UnitTest;

public class SpriteTest extends UnitTest
{

	@Test
	public void testCreateFind()
	{
		User user = User.getUserByUID("SuperEBear");
		List<Adventure> adventures = Adventure.findByUser(user);
		Adventure adv = adventures.get(0);
		assertNotNull(adv);
		Sprite sprite = new Sprite();
		sprite.adventure = adv;
		sprite.col = 0;
		sprite.row = 0;
		sprite.name = "WALL1";
		sprite.grouping = "wall";
		
		Sprite resp = sprite.save();
		
		assertNotNull(resp);
		assertNotNull(resp.id);
		
		Sprite rtnSprite = Sprite.findById(resp.id);
		assertNotNull(rtnSprite);
		assertNotNull(rtnSprite.id);
	}
}
