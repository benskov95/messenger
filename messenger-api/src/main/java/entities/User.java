package entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.mindrot.jbcrypt.BCrypt;

@Entity
@NamedQuery (name = "User.deleteAllRows", query = "DELETE FROM User")
@Table(name = "user")
public class User implements Serializable {
    
    private static final long serialVersionUID = 1L;
  
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "user_name", length = 14)
    private String username;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "user_pass")
    private String userPass;

    @JoinTable(name = "user_roles", joinColumns = {
    @JoinColumn(name = "user_name", referencedColumnName = "user_name")}, inverseJoinColumns = {
    @JoinColumn(name = "role_name", referencedColumnName = "role_name")})
    @ManyToMany (cascade = CascadeType.PERSIST)
    private List<Role> roleList = new ArrayList<>();
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friend> friends = new ArrayList<>();
    
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();
    
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    private List<FriendRequest> friendRequests = new ArrayList<>();

    private String profilePic = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg";

    public User() {}

    public User(String username, String userPass) {
        this.username = username;
        this.userPass = BCrypt.hashpw(userPass, BCrypt.gensalt(12));
    }

    public boolean verifyPassword(String pw) {
        boolean matches = BCrypt.checkpw(pw, this.userPass);
        return(matches);
    }

    public List<String> getRolesAsStrings() {
        if (roleList.isEmpty()) {
          return null;
        }
        List<String> rolesAsStrings = new ArrayList<>();
        roleList.forEach((role) -> {
            rolesAsStrings.add(role.getRoleName());
          });
        return rolesAsStrings;
    }
    
    public void addMessage(Message m) {
        m.setSender(this);
        this.messages.add(m);
    }
    
    public void addRequest(FriendRequest r) {
        r.setSender(this);
        this.friendRequests.add(r);
    }

    public String getUsername() {
      return username;
    }

    public void setUsername(String userName) {
      this.username = userName;
    }

    public String getUserPass() {
      return this.userPass;
    }

    public void setUserPass(String userPass) {
      this.userPass = BCrypt.hashpw(userPass, BCrypt.gensalt(12));
    }

    public List<Role> getRoleList() {

      return roleList;
    }

    public void setRoleList(List<Role> roleList) {
      this.roleList = roleList;
    }

    public void addRole(Role userRole) {
      roleList.add(userRole);
    }

    public List<Friend> getFriends() {
        return friends;
    }

    public void setFriends(List<Friend> friends) {
        this.friends = friends;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public List<FriendRequest> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<FriendRequest> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    
}
