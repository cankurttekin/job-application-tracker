package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.service.CustomUserDetailsService;
import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.model.User;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
/*
    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(@RequestBody JobApplication jobApplication) {
        return ResponseEntity.ok(jobApplicationService.createJobApplication(jobApplication));
    }
*/

    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(@RequestBody JobApplication jobApplication, Authentication authentication) {
        String username = authentication.getName(); // Get the username from the Authentication
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        jobApplication.setUser(user); // Set the user on the job application
        JobApplication createdJobApplication = jobApplicationService.createJobApplication(jobApplication);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobApplication);
    }



    @GetMapping
    public ResponseEntity<List<JobApplication>> getJobApplications(Authentication authentication) {
        String username = authentication.getName(); // Get the username from authentication

        // Fetch the user by username
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found")); // Handle user not found

        // Fetch and return the job applications for that user
        List<JobApplication> jobApplications = jobApplicationService.findJobApplicationByUserId(user.getId());
        return ResponseEntity.ok(jobApplications);
    }
}
