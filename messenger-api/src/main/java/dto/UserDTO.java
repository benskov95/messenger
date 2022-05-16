package dto;

import entities.User;

public class UserDTO {

    private String username;
    private String profilePic;
    private String password;

    public UserDTO() {}
    
    public UserDTO(User user) {
        this.username = user.getUsername();
        this.profilePic = user.getProfilePic();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    
}
