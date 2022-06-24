package dto;

public class UnreadMsgCountDTO {
    
    private int count;
    private String senderName;
    private String receiverName;

    public UnreadMsgCountDTO(int count, String senderName, String receiverName) {
        this.count = count;
        this.senderName = senderName;
        this.receiverName = receiverName;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
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
