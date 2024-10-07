package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;

public interface UserService {
    void registerUser(UserRegistrationRequest userRegistrationRequest);
}
