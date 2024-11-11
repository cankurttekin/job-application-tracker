package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;
import com.kurttekin.can.job_track.domain.model.user.Role;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.VerificationService;
import com.kurttekin.can.job_track.infrastructure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private EmailService emailService;

    @Override
    public void registerUser(UserRegistrationRequest userRequest) {
        // check username or email
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // create and save new user
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setVerified(false);
        user.setRole(Role.USER);
        userRepository.save(user);

        // Generate verification token and send email
        String token = verificationService.generateToken(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token);
    }

    public User registerGoogleUser(String email) {
        // Create a new user instance
        User user = new User();
        user.setEmail(email);

        // Generate a random username based on the email or name (you could use UUID or similar)
        user.setUsername("google_" + UUID.randomUUID().toString());

        // Set a random password (will not be used, as Google users don't log in with password)
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        // Mark the user as verified since they authenticated through Google
        user.setVerified(true);

        // Assign a default role (e.g., "ROLE_USER")
        user.setRole(Role.USER);
        //user.setRoles(Collections.singleton(new Role("ROLE_USER")));

        // Save the new user to the database
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
