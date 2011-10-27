import models.User;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;
 
@OnApplicationStart
public class Bootstrap extends Job {
 
    @Override
    public void doJob() {
        // Check if the database is empty
        if(User.count() <= 0) {
            Fixtures.deleteDatabase();
            Fixtures.loadModels("data.yml");
        }
    }
 
}