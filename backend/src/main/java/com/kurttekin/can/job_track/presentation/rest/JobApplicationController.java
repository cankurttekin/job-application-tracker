package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.exception.JobApplicationNotFoundException;
import com.kurttekin.can.job_track.domain.exception.UserNotFoundException;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {
// REFACTOR THIS SHIT, move bus. logic to service
    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(
            @RequestBody JobApplication jobApplication,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        jobApplication.setUser(user); // Set the user on the job application
        JobApplication createdJobApplication = jobApplicationService.createJobApplication(jobApplication);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobApplication);
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getJobApplications(Authentication authentication) {
        String username = authentication.getName(); // Get the username from authentication
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<JobApplication> jobApplications = jobApplicationService.findAllByUserId(user.getId());
        return ResponseEntity.ok(jobApplications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateJobApplication(
            @PathVariable Long id,
            @RequestBody JobApplication updatedJobApplication,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();

        // Call the service to handle the update
        JobApplication updatedJob = jobApplicationService.updateJobApplication(id, updatedJobApplication, username);

        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        JobApplication jobApplication = jobApplicationService.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException("Job Application not found"));

        // Ensure the job application belongs to the user
        if (!jobApplication.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobApplicationService.deleteJobApplication(id);
        return ResponseEntity.noContent().build();
    }

    // Delete all job applications for the authenticated user
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllJobApplications(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        jobApplicationService.deleteAllByUserId(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getJobApplicationStats(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Get all job applications for the user
        List<JobApplication> jobApplications = jobApplicationService.findAllByUserId(user.getId());

        // Calculate statistics
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", jobApplications.size());

        Map<LocalDate, Long> applicationsByDay = jobApplications.stream()
                .filter(application -> application.getApplicationDate() != null)
                .collect(Collectors.groupingBy(
                        jobApplication -> jobApplication.getApplicationDate(),
                        Collectors.counting()
                ));

        stats.put("applicationsByDay", applicationsByDay);

        return ResponseEntity.ok(stats);
    }
}
