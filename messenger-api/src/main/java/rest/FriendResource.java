package rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.nimbusds.jose.JOSEException;
import dto.FriendDTO;
import dto.RequestDTO;
import facades.FriendFacade;
import java.text.ParseException;
import java.util.List;
import utils.EMF_Creator;
import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManagerFactory;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import security.JWTAuthenticationFilter;
import security.UserPrincipal;
import security.errorhandling.AuthenticationException;


@Path("friend")
public class FriendResource {


    private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    public static final FriendFacade FRIEND_FACADE = FriendFacade.getFriendFacade(EMF);
    private static final JWTAuthenticationFilter jwt = new JWTAuthenticationFilter();
    
    @GET
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    public String getAllFriends(@HeaderParam("x-access-token") String token) throws ParseException, JOSEException, AuthenticationException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<FriendDTO> friends = FRIEND_FACADE.getAllFriends(user.getName());
        return GSON.toJson(friends);
    }
    
    @GET
    @Path("requests")
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    public String getAllPendingRequests(@HeaderParam("x-access-token") String token) throws ParseException, JOSEException, AuthenticationException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<RequestDTO> requests = FRIEND_FACADE.getAllPendingRequests(user.getName());
        return GSON.toJson(requests);
    }
            
    @POST
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String sendRequest(String request) {
        RequestDTO requestDto = GSON.fromJson(request, RequestDTO.class);
        RequestDTO addedReq = FRIEND_FACADE.sendFriendRequest(requestDto);
        return GSON.toJson(addedReq);
    }
    
    @PUT
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String handleRequest(String request) {
        RequestDTO requestDto = GSON.fromJson(request, RequestDTO.class);
        RequestDTO addedReq = FRIEND_FACADE.handleFriendRequest(requestDto);
        return GSON.toJson(addedReq);
    }
    
}
