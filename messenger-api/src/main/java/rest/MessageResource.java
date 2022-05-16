package rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.nimbusds.jose.JOSEException;
import dto.MessageDTO;
import facades.MessageFacade;
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


@Path("message")
public class MessageResource {


    private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    public static final MessageFacade MESSAGE_FACADE = MessageFacade.getMessageFacade(EMF);
    private static final JWTAuthenticationFilter jwt = new JWTAuthenticationFilter();
    
    @GET
    @Path("{userId}")
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    public String getUserMessages(@HeaderParam("x-access-token") String token, @PathParam("userId") String userId) throws ParseException, JOSEException, AuthenticationException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<MessageDTO> messages = MESSAGE_FACADE.getUserMessages(user.getName(), userId);
        return GSON.toJson(messages);
    }
            
    @POST
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String sendMessage(String msg) {
        MessageDTO messageDto = GSON.fromJson(msg, MessageDTO.class);
        MessageDTO addedMsg = MESSAGE_FACADE.sendMessage(messageDto);
        return GSON.toJson(addedMsg);
    }
    
}