package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.model.user.VerificationToken;

public interface VerificationService {
    String generateAndSendToken(User user);
    boolean verifyUser(String token);
    boolean isTokenExpired(VerificationToken verificationToken);
}
