package facades;

import dto.MessageDTO;
import entities.Message;
import entities.User;
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
    
    public List<MessageDTO> getUserMessages(String loggedInUser, String selectedUser) {
        EntityManager em = emf.createEntityManager();
        List<MessageDTO> messagesDto = new ArrayList<>();
        
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
        } finally {
            em.close();
        }
    }
    
    public MessageDTO sendMessage(MessageDTO messageDto) {
        EntityManager em = emf.createEntityManager();
        User u1 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                .setParameter("username", messageDto.getSenderName())
                .getSingleResult();
        User u2 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                .setParameter("username", messageDto.getReceiverName())
                .getSingleResult();

        Message message = new Message(messageDto.getContent(), messageDto.getTimestamp(), u2);
        u1.addMessage(message);
        
        try {
            em.getTransaction().begin();
            em.persist(message);
            em.getTransaction().commit();
            return new MessageDTO(message);
        } finally {
            em.close();
        }
    }
    
}
