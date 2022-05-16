package rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.nimbusds.jose.JOSEException;
import dto.UserDTO;
import facades.UserFacade;
import java.text.ParseException;
import security.errorhandling.AuthenticationException;
import utils.EMF_Creator;
import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManagerFactory;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import security.JWTAuthenticationFilter;
import security.UserPrincipal;


@Path("user")
public class UserResource {


    private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    public static final UserFacade USER_FACADE = UserFacade.getUserFacade(EMF);
    private static final JWTAuthenticationFilter jwt = new JWTAuthenticationFilter();
            
    @GET
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    public String getUsers(@HeaderParam("x-access-token") String token) throws ParseException, JOSEException, AuthenticationException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<UserDTO> dtoList = USER_FACADE.getAllUsers(user.getName());
        return GSON.toJson(dtoList);
    }
    
    @POST
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String addUser(String user) throws  AuthenticationException {
        UserDTO userDTO = GSON.fromJson(user, UserDTO.class);
        UserDTO newUser = USER_FACADE.addUser(userDTO);
        return GSON.toJson(newUser);
    }
   
}
