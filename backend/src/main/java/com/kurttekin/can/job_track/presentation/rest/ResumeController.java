package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.exception.UserNotFoundException;
import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.model.Resume;
import com.kurttekin.can.job_track.domain.model.User;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody Resume resume, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        // Find the user in the database
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        resume.setUser(user); // Set the user on the resume

        Resume createdResume = resumeService.createResume(resume);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResume);
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getResumesByUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Resume> resumes = resumeService.getResumesByUserId(user.getId());
        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @RequestBody Resume resume, @AuthenticationPrincipal UserDetails userDetails) {
        // Find the user
        User user = userService.findUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume existingResume = resumeService.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Ensure the resume belongs to the user
        if (!existingResume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        existingResume.setTitle(resume.getTitle());
        existingResume.setSummary(resume.getSummary());
        existingResume.setSkills(resume.getSkills());
        existingResume.setEducation(resume.getEducation());
        existingResume.setLocation(resume.getLocation());
        existingResume.setExperience(resume.getExperience());
        existingResume.setUpdatedAt(new Date()); // Update the timestamp

        Resume updatedResume = resumeService.updateResume(id, existingResume);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) throws Throwable {
        User user = userService.findUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeService.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Ensure the resume belongs to the user
        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}