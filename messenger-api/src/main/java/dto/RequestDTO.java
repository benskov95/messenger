package dto;

import entities.FriendRequest;

public class RequestDTO {
    
    private int id;
    private String senderProfilePic;
    private String senderName;
    private String receiverName;
    private boolean accepted;

    public RequestDTO() {}
    
    public RequestDTO(FriendRequest request) {
        this.id = request.getId();
        this.senderProfilePic = request.getSender().getProfilePic();
        this.senderName = request.getSender().getUsername();
        this.receiverName = request.getReceiver().getUsername();
        this.accepted = request.isAccepted();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSenderProfilePic() {
        return senderProfilePic;
    }

    public void setSenderProfilePic(String profilePic) {
        this.senderProfilePic = profilePic;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

}
