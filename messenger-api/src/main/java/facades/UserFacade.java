package facades;

import dto.UserDTO;
import entities.Friend;
import entities.FriendRequest;
import entities.Role;
import entities.User;
import errorhandling.ApiException;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import security.errorhandling.AuthenticationException;
import java.util.ArrayList;
import java.util.List;

public class UserFacade {

    private static EntityManagerFactory emf;
    private static UserFacade instance;

    private UserFacade() {}

    public static UserFacade getUserFacade(EntityManagerFactory _emf) {
        if (instance == null) {
            emf = _emf;
            instance = new UserFacade();
        }
        return instance;
    }

    public User getVerifiedUser(String username, String password) throws AuthenticationException {
        EntityManager em = emf.createEntityManager();
        User user;
        try {
            user = em.find(User.class, username);
            if (user == null || !user.verifyPassword(password)) {
                throw new AuthenticationException("Invalid user name or password");
            }
        } finally {
            em.close();
        }
        return user;
    }

    public List<UserDTO> getAllUsers(String username) throws ApiException {
        EntityManager em = emf.createEntityManager();
        List<UserDTO> userDTOlist = new ArrayList();
        
        try { 
            List<User> userList = em.createQuery("SELECT u FROM User u WHERE u.username <> :username")
                    .setParameter("username", username)
                    .getResultList();
            List<Friend> friendList = em.createQuery("SELECT f FROM Friend f WHERE f.friend.username =:user OR f.owner.username =:user")
                    .setParameter("user", username)
                    .getResultList();
            List<FriendRequest> requests = em.createQuery("SELECT r FROM FriendRequest r WHERE r.receiver.username =:user OR r.sender.username =:user")
                    .setParameter("user", username)
                    .getResultList();
            
            List<User> listCopy = userList;
            
            if (friendList.size() >= 1) {
                for (Friend f : friendList) {
                    if (userList.contains(f.getFriend())) {
                        listCopy.remove(f.getFriend());
                    }
                    if (userList.contains(f.getOwner())) {
                        listCopy.remove(f.getOwner());
                    }
                }                
            }
            
            for (FriendRequest r : requests) {
                if (userList.contains(r.getReceiver())) {
                    listCopy.remove(r.getReceiver());
                }
                if (userList.contains(r.getSender())) {
                    listCopy.remove(r.getSender());
                }
            }
            
            for (User user: listCopy){
                userDTOlist.add(new UserDTO(user));
            }
            
            return userDTOlist;
            
        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when loading users. Try again later.");
        }finally {
            em.close();
        }
    }

    public UserDTO addUser(UserDTO userDto) throws  AuthenticationException, ApiException {
        EntityManager em = emf.createEntityManager();
        User user = new User(userDto.getUsername(), userDto.getPassword());
        addInitialRoles(em);
        setUserRole(user, em);
        validateUser(userDto, em);
        
        try {
            em.getTransaction().begin();
            em.persist(user);
            em.getTransaction().commit();
            return new UserDTO(user);

        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when registering. Try again later.");
        }finally {
            em.close();
        }
    }

    private void setUserRole(User user, EntityManager em) {
        Query query = em.createQuery("SELECT r FROM Role r WHERE r.roleName =:role ");
        query.setParameter("role", "user");
        user.addRole((Role) query.getSingleResult());
    }
    
    private void addInitialRoles(EntityManager em) {
        Query query = em.createQuery("SELECT r FROM Role r");
        if (query.getResultList().isEmpty()) {
            em.getTransaction().begin();
            em.persist(new Role("user"));
            em.persist(new Role("admin"));
            em.getTransaction().commit();
        }
    }
    
    private void validateUser(UserDTO userDto, EntityManager em) throws ApiException {
        // have to use dto because password gets hashed in user entity constructor, so can't accurately check length.
        List<User> resList = em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                .setParameter("username", userDto.getUsername())
                .getResultList();
        
        if (resList.size() > 0) {
            throw new ApiException("This username is taken. Try another.");
        }
        if (userDto.getUsername().length() < 5) {
            throw new ApiException("Username must be 5 or more characters long.");
        }
        if (userDto.getPassword().length() < 5) {
            throw new ApiException("Password must be 5 or more characters long.");
        }
    }
    
}
