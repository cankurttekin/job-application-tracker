package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.model.user.VerificationToken;
import com.kurttekin.can.job_track.domain.service.VerificationService;

public class VerificationServiceImpl implements VerificationService {

    private static final int EXPIRATION_HOURS = 24;

    @Override
    public String generateAndSendToken(User user) {
        return "";
    }

    @Override
    public boolean verifyUser(String token) {
        return false;
    }

    @Override
    public boolean isTokenExpired(VerificationToken verificationToken) {
        return false;
    }
}
