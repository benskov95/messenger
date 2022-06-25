package rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.nimbusds.jose.JOSEException;
import dto.MessageDTO;
import dto.UnreadMsgCountDTO;
import errorhandling.ApiException;
import facades.MessageFacade;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.util.ArrayList;
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
    public String getUserMessages(@HeaderParam("x-access-token") String token, @PathParam("userId") String userId) throws ParseException, JOSEException, AuthenticationException, ApiException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<MessageDTO> messagesDto = MESSAGE_FACADE.getUserMessages(user.getName(), userId);
        return GSON.toJson(messagesDto);
    }
            
    @GET
    @Path("unread")
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    public String getUnreadMessages(@HeaderParam("x-access-token") String token) throws ParseException, JOSEException, AuthenticationException, ApiException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        List<UnreadMsgCountDTO> unreadDto = MESSAGE_FACADE.getUnreadMessages(user.getName());
        return GSON.toJson(unreadDto);
    }
    
    @PATCH
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String changeMessagesToRead(@HeaderParam("x-access-token") String token, String msgList) throws ParseException, JOSEException, AuthenticationException, ApiException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        Type listType = new TypeToken<ArrayList<MessageDTO>>(){}.getType();
        List<MessageDTO> unreadMessagesDto = GSON.fromJson(msgList, listType);
        MESSAGE_FACADE.changeMessagesToRead(unreadMessagesDto, user.getName());
        return "{\"status\": \"ok\"}";
    }
    
    @POST
    @RolesAllowed("user")
    @Produces({MediaType.APPLICATION_JSON})
    @Consumes({MediaType.APPLICATION_JSON})
    public String sendMessage(@HeaderParam("x-access-token") String token, String msg) throws ApiException, ParseException, JOSEException, AuthenticationException {
        UserPrincipal user = jwt.getUserPrincipalFromTokenIfValid(token);
        MessageDTO messageDto = GSON.fromJson(msg, MessageDTO.class);
        MessageDTO addedMessageDto = MESSAGE_FACADE.sendMessage(messageDto, user.getName());
        return GSON.toJson(addedMessageDto);
    }
    
    
}