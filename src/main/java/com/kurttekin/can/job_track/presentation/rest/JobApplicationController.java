package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.model.User;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(
            @RequestBody JobApplication jobApplication,
            //Authentication authentication,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Get the authenticated user from the SecurityContext
        String username = userDetails.getUsername();

        //String username = authentication.getName(); // Get the username from the Authentication
        // User user = userService.findUserByUsername(username)
        //        .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        jobApplication.setUser(user); // Set the user on the job application
        JobApplication createdJobApplication = jobApplicationService.createJobApplication(jobApplication);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobApplication);
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getJobApplications(Authentication authentication) {
        String username = authentication.getName(); // Get the username from authentication
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<JobApplication> jobApplications = jobApplicationService.findAllByUserId(user.getId());
        return ResponseEntity.ok(jobApplications);
    }
}
