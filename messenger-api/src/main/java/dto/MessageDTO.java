package dto;

import entities.Message;

public class MessageDTO {
    
    private int id;
    private String content;
    private String timestamp;
    private String senderName;
    private String receiverName;

    public MessageDTO() {}
    
    public MessageDTO(Message msg) {
        this.id = msg.getId();
        this.content = msg.getContent();
        this.timestamp = msg.getMsgTimestamp();
        this.senderName = msg.getSender().getUsername();
        this.receiverName = msg.getReceiver().getUsername();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
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
    
}
