package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;
import com.kurttekin.can.job_track.domain.model.user.User;

import java.util.Optional;

public interface UserService {
    void registerUser(UserRegistrationRequest userRegistrationRequest);
    Optional<User> findUserById(Long userId);
    Optional<User> findUserByUsername(String username);
}

