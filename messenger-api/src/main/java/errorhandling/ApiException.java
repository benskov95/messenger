package errorhandling;

public class ApiException extends Exception {
    public ApiException(String message) {
        super(message);
    }

    public ApiException() {
        super("Server responded with an error. Try again later.");
    }  
}
