package facades;

import dto.FriendDTO;
import dto.RequestDTO;
import entities.Friend;
import entities.FriendRequest;
import entities.User;
import errorhandling.ApiException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class FriendFacade {
    
    private static EntityManagerFactory emf;
    private static FriendFacade instance;

    private FriendFacade() {}

    public static FriendFacade getFriendFacade(EntityManagerFactory _emf) {
        if (instance == null) {
            emf = _emf;
            instance = new FriendFacade();
        }
        return instance;
    }
    
    public List<FriendDTO> getAllFriends(String username) throws ApiException {
        EntityManager em = emf.createEntityManager();
        List<FriendDTO> friendsDto = new ArrayList();
        
        try {
            List<Friend> friends = em.createQuery("SELECT f From Friend f WHERE f.owner.username =:user OR f.friend.username =:user")
                    .setParameter("user", username)
                    .getResultList();

            for (Friend f : friends) {
                if (f.getFriend().getUsername().equals(username)) {
                    friendsDto.add(new FriendDTO(f.getOwner().getUsername(), f.getOwner().getProfilePic()));
                } else {
                    friendsDto.add(new FriendDTO(f.getFriend().getUsername(), f.getFriend().getProfilePic()));
                }
            }

            return friendsDto;            
        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when loading friends. Try again later.");
        } finally {
            em.close();
        }
    }
    
    public List<RequestDTO> getAllPendingRequests(String username) throws ApiException {
        EntityManager em = emf.createEntityManager();
        List<RequestDTO> requestsDto = new ArrayList();
        
        try {
            List<FriendRequest> requests = em.createQuery("SELECT r From FriendRequest r WHERE r.receiver.username =:user AND r.accepted = false")
                    .setParameter("user", username)
                    .getResultList();

            for (FriendRequest r : requests) {
                requestsDto.add(new RequestDTO(r));
            }

            return requestsDto;
        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when loading friend requests. Try again later.");
        } finally {
            em.close();
        }
    }
    
    public RequestDTO sendFriendRequest(RequestDTO requestDto) throws ApiException {
        EntityManager em = emf.createEntityManager();
        
        try {
            User u1 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                    .setParameter("username", requestDto.getSenderName())
                    .getSingleResult();
            User u2 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                    .setParameter("username", requestDto.getReceiverName())
                    .getSingleResult();

            FriendRequest request = new FriendRequest(u2);
            u1.addRequest(request);
            em.getTransaction().begin();
            em.persist(request);
            em.getTransaction().commit();
            return new RequestDTO(request);
        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when sending friend request. Try again later.");
        } finally {
            em.close();
        }
    }

    public RequestDTO handleFriendRequest(RequestDTO requestDto) throws ApiException {
        EntityManager em = emf.createEntityManager();
        
        try {
            FriendRequest request = (FriendRequest) em.createQuery("SELECT r FROM FriendRequest r where r.id =:id")
                    .setParameter("id", requestDto.getId())
                    .getSingleResult();
            
            em.getTransaction().begin();
            
            if (requestDto.isAccepted()) {
                User u1 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                        .setParameter("username", requestDto.getSenderName())
                        .getSingleResult();
                User u2 = (User) em.createQuery("SELECT u FROM User u WHERE u.username =:username")
                        .setParameter("username", requestDto.getReceiverName())
                        .getSingleResult();
                
                Friend newFriend = new Friend(u1, u2);
                request.setAccepted(requestDto.isAccepted());
                em.persist(request);
                em.persist(newFriend);
            } else {
                em.remove(request);
            }
            
            em.getTransaction().commit();
            return new RequestDTO(request);
        } catch(Exception e) {
            System.out.println(e.getMessage());
            throw new ApiException("Encountered an error when handling friend request. Try again later.");
        }finally {
            em.close();
        }
    }
    
}
