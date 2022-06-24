package facades;

import dto.MessageDTO;
import dto.UnreadMsgCountDTO;
import entities.Message;
import entities.User;
import errorhandling.ApiException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class MessageFacade {
    
    private static EntityManagerFactory emf;
    private static MessageFacade instance;

    private MessageFacade() {}

    public static MessageFacade getMessageFacade(EntityManagerFactory _emf) {
        if (instance == null) {
            emf = _emf;
            instance = new MessageFacade();
        }
        return instance;
    }
    
    public List<MessageDTO> getUserMessages(String loggedInUser, String selectedUser) throws ApiException {
        EntityManager em = emf.createEntityManager();
        List<MessageDTO> messagesDto = new ArrayList();
        
        try {
            List<Message> messages = em.createQuery("SELECT m FROM Message m "
                    + "WHERE m.sender.username =:lUser AND m.receiver.username =:sUser "
                    + "OR m.receiver.username =:lUser AND m.sender.username =:sUser")
                    .setParameter("lUser", loggedInUser)
                    .setParameter("sUser", selectedUser)
                    .getResultList();

            for (Message m : messages) {
                messagesDto.add(new MessageDTO(m));
            }

            return messagesDto;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when loading user messages. Try again later.");
        }finally {
            em.close();
        }
    }
    
    public List<UnreadMsgCountDTO> getNumberOfUnreadMessagesByUser(String receiverName) throws ApiException {
        EntityManager em = emf.createEntityManager();
        List<UnreadMsgCountDTO> unreadMessages = new ArrayList();
        
        try {
            List<Message> messages = em.createQuery("SELECT m FROM Message m WHERE m.receiver.username = :receiver")
                    .setParameter("receiver", receiverName)
                    .getResultList();
            
            List<Message> filteredMessages = new ArrayList();
            for (Message m: messages) {
                if (filteredMessages.isEmpty()) {
                    filteredMessages.add(m);
                } else {
                    for (Message filteredM : filteredMessages) {
                        if (!filteredM.getSender().getUsername().equals(m.getSender().getUsername())) {
                            filteredMessages.add(m);
                        }
                    }
                }
            }
            
            for (Message m : filteredMessages) {
                List<Message> messagesFromSender = em.createQuery("SELECT m FROM Message m WHERE m.sender.username = :sender " + 
                        "AND m.receiver.username = :receiver AND m.msgRead = false")
                        .setParameter("sender", m.getSender().getUsername())
                        .setParameter("receiver", receiverName)
                        .getResultList();
                unreadMessages.add(new UnreadMsgCountDTO(messagesFromSender.size(), m.getSender().getUsername(), m.getReceiver().getUsername()));
            }
            
            return unreadMessages;
        } catch (Exception e) {
            throw new ApiException("Encountered an error when checking for unread messages. Try again later.");
        } finally {
            em.close();
        }
    }
    
    public MessageDTO sendMessage(MessageDTO messageDto, String username) throws ApiException {
        EntityManager em = emf.createEntityManager();
        validateMessage(messageDto, username);
        
        try {
            User u1 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                    .setParameter("username", messageDto.getSenderName())
                    .getSingleResult();
            User u2 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                    .setParameter("username", messageDto.getReceiverName())
                    .getSingleResult();

            Message message = new Message(messageDto.getContent(), u2);
            u1.addMessage(message);
            
            em.getTransaction().begin();
            em.persist(message);
            em.getTransaction().commit();
            return new MessageDTO(message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when sending message. Try again later.");
        } finally {
            em.close();
        }
    }
    
    
    private void validateMessage(MessageDTO messageDto, String username) throws ApiException {
        if (!messageDto.getSenderName().equals(username)) {
            throw new ApiException("Sender does not match logged in user.");
        }
        if (messageDto.getContent().length() > 1000) {
            throw new ApiException("Your message is too long. Send it in parts or shorten it.");
        }
        if (messageDto.getContent().trim().length() == 0) {
            throw new ApiException("Message must be at least 1 character long");
        }
    }
    
}