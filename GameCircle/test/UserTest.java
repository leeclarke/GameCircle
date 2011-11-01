import org.junit.*;
import java.util.*;
import play.test.*;
import models.*;

public class UserTest extends UnitTest {

	@Test
	public void createAndRetrieveUser() {
		// Create a new user and save it
		new User("mr_dm@gmail.com", "Joe", "DM","MrDm").save();

		// Retrieve the user with e-mail address the_dm@gmail.com
		User theDM = User.find("byEmail", "mr_dm@gmail.com").first();

		// Test
		assertNotNull(theDM);
		assertEquals("Joe", theDM.firstName);
		assertEquals("DM", theDM.lastName);
		assertEquals("MrDm", theDM.userName);
	}

	@Test
	public void testGetUser() {
		User theDM = User.find("byUserName", "SuperEBear").first();
		
		// Test
		assertNotNull(theDM);
		assertEquals("SuperEBear", theDM.userName);
		assertEquals("Eli", theDM.firstName);
		assertEquals("Clarke", theDM.lastName);
	}
}
