package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(@RequestBody JobApplication jobApplication) {
        return ResponseEntity.ok(jobApplicationService.createJobApplication(jobApplication));
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getJobApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(jobApplicationService.findJobApplicationByUserId(userId));

    }
}
