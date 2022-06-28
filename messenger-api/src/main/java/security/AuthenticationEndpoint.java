package security;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import dto.UserDTO;
import facades.UserFacade;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import entities.User;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import security.errorhandling.AuthenticationException;
import errorhandling.GenericExceptionMapper;
import java.text.ParseException;
import java.util.HashMap;
import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManagerFactory;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import utils.EMF_Creator;

@Path("auth")
public class AuthenticationEndpoint {

  private static final int TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 2; // 2 hrs
  private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
  private static final UserFacade USER_FACADE = UserFacade.getUserFacade(EMF);
  private static final JWTAuthenticationFilter jwt = new JWTAuthenticationFilter();
  private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
  private static HashMap<String, String> loggedInUsersMap = new HashMap();
  
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response login(String jsonString) throws AuthenticationException {
    JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
    String username = json.get("username").getAsString();
    String password = json.get("password").getAsString();
    
    if (loggedInUsersMap.get(username) != null) {
        throw new AuthenticationException("User is already logged in.");
    }

    try {
      User user = USER_FACADE.getVerifiedUser(username, password);
      String token = createToken(user);
      JsonObject responseJson = new JsonObject();
      responseJson.addProperty("username", username);
      responseJson.addProperty("token", token);
      loggedInUsersMap.put(username, token);
      return Response.ok(GSON.toJson(responseJson)).build();
      
    } catch (JOSEException | AuthenticationException ex) {
      if (ex instanceof AuthenticationException) {
        throw (AuthenticationException) ex;
      }
      Logger.getLogger(GenericExceptionMapper.class.getName()).log(Level.SEVERE, null, ex);
    }
    throw new AuthenticationException("Invalid username or password! Please try again");
  }
  
  @GET
  @RolesAllowed("user")
  @Produces(MediaType.APPLICATION_JSON)
  public String logout(@HeaderParam("x-access-token") String token) throws ParseException, JOSEException, AuthenticationException {
      UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
      String result = loggedInUsersMap.remove(user.getName());
      return GSON.toJson(new UserDTO(result));
  }

  private String createToken(User user) throws JOSEException {
    String issuer = "b-messenger";

    JWSSigner signer = new MACSigner(SharedSecret.getSharedKey());
    Date date = new Date();
    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getUsername())
            .claim("username", user.getUsername())
            .claim("profilePic", user.getProfilePic())
            .claim("roles", user.getRolesAsStrings().get(0))
            .claim("issuer", issuer)
            .issueTime(date)
            .expirationTime(new Date(date.getTime() + TOKEN_EXPIRE_TIME))
            .build();
    SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
    signedJWT.sign(signer);
    return signedJWT.serialize();
  }
  
}