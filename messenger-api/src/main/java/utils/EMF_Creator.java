package utils;

import java.util.Properties;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class EMF_Creator {

    /**
     * Call this method before all integration tests that uses the Grizzly
     * Server and the Test Database (in @BeforeAll ) Remember to call
     * enRestTestWithDB() in @AfterAll
     */
    public static void startREST_TestWithDB() {
        System.setProperty("IS_INTEGRATION_TEST_WITH_DB", "testing");
    }

    /*
      Call this method in your @AfterAll method if startREST_TestWithDB() was previously called
     */
    public static void endREST_TestWithDB() {
        System.clearProperty("IS_INTEGRATION_TEST_WITH_DB");
    }

    public static EntityManagerFactory createEntityManagerFactory() {
        return createEntityManagerFactory(false);
    }

    public static EntityManagerFactory createEntityManagerFactoryForTest() {
        return createEntityManagerFactory(true);
    }

    private static EntityManagerFactory createEntityManagerFactory(boolean isTest) {

        
        boolean isDeployed = (System.getProperty("DEPLOYED") != null);
        if (isDeployed) {
            System.out.println("USING ENVIRONMENT VARIABLES");
            System.out.println("DEPLOYED       -->" + System.getProperty("DEPLOYED"));
            System.out.println("USER           -->" + System.getProperty("USER"));
            System.out.println("PW             -->" + System.getProperty("PW"));
            System.out.println("CONNECTION_STR -->" + System.getProperty("CONNECTION_STR"));
            String user = System.getProperty("USER");
            String pw = System.getProperty("PW");
            String connection_str = System.getProperty("CONNECTION_STR"); 
            Properties props = new Properties();
            props.setProperty("javax.persistence.jdbc.user", user);
            props.setProperty("javax.persistence.jdbc.password", pw);
            props.setProperty("javax.persistence.jdbc.url", connection_str);
            props.setProperty("javax.persistence.jdbc.driver", "com.mysql.cj.jdbc.Driver");
            
            props.setProperty("eclipselink.logging.level","WARNING");
            props.setProperty("eclipselink.logging.level.sql","WARNING");
            return Persistence.createEntityManagerFactory("pu", props);
        }

        String puName = isTest || System.getProperty("IS_INTEGRATION_TEST_WITH_DB") != null ? "puTest" : "pu"; //Only legal names
        if (puName.equals("puTest")) {
            System.out.println("Using the TEST database via persistence-unit --> puTest ");
        } else {
            System.out.println("Using the DEV database via persistence-unit --> pu ");
        }
        EntityManagerFactory emf = null;
        try {
         emf =  Persistence.createEntityManagerFactory(puName, null);
       
        } catch (javax.persistence.PersistenceException ex){
            throw ex; 
        }
         return emf;
    }
}
