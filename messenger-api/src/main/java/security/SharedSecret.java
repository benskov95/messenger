package security;

import java.security.SecureRandom;

public class SharedSecret {
    private static byte[] secret;
    public static byte[] getSharedKey() {
        if (secret == null) {  
            secret = new byte[32];
            new SecureRandom().nextBytes(secret);
        }
        return secret;
    }
}