package com.kurttekin.can.job_track.application.service;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TurnstileVerificationService {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${turnstile.secret-key}")
    private String turnstileSecretKey;

    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    public boolean verifyToken(String turnstileToken) {
        if ("dev".equals(activeProfile)) {
            return true;
        }

        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("secret", turnstileSecretKey);
        requestBody.put("response", turnstileToken);

        Map response = restTemplate.postForObject(VERIFY_URL, requestBody, Map.class);
        return response != null && Boolean.TRUE.equals(response.get("success"));
    }
}
