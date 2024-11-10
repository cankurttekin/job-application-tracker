package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.model.user.VerificationToken;
import com.kurttekin.can.job_track.domain.service.VerificationService;
import com.kurttekin.can.job_track.infrastructure.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationServiceImpl implements VerificationService {

    private static final int EXPIRATION_HOURS = 24;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Override
    public String generateToken(User user) {
        String token = UUID.randomUUID().toString();

        LocalDateTime expiryDate = LocalDateTime.now().plusHours(EXPIRATION_HOURS);

        // Create and save token
        VerificationToken verificationToken = new VerificationToken(token, user, expiryDate);
        verificationTokenRepository.save(verificationToken);

        return token;
    }

    @Override
    public boolean verifyUser(String token) {
        Optional<VerificationToken> verificationToken = verificationTokenRepository.findByToken(token);
        if (verificationToken.isEmpty() || verificationToken.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Enable the user and delete token
        User user = verificationToken.get().getUser();
        user.setVerified(true);
        verificationTokenRepository.delete(verificationToken.get());
        return true;
    }

    @Override
    public boolean isTokenExpired(VerificationToken verificationToken) {
        return LocalDateTime.now().isAfter(verificationToken.getExpiryDate());
    }
}
