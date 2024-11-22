package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ResumeDTO> createOrUpdateResume(
            @RequestBody Resume resume,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        resume.setUser(user); // Set the user on the resume
        ResumeDTO createdOrUpdatedResume = resumeService.createOrUpdateResume(resume);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrUpdatedResume);
    }

    @GetMapping
    public ResponseEntity<ResumeDTO> getResume(
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername(); // Get the username from authentication
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ResumeDTO resume = resumeService.findById(user.getId());
        return ResponseEntity.ok(resume);
    }
}