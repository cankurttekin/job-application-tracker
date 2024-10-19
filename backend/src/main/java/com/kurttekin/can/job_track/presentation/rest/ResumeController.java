package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.model.Resume;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody Resume resume) {
        Resume createdResume = resumeService.createResume(resume);
        return ResponseEntity.ok(createdResume);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Resume>> getResumesByUserId(@PathVariable Long userId) {
        List<Resume> resumes = resumeService.getResumesByUserId(userId);
        return ResponseEntity.ok(resumes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @RequestBody Resume resume) {
        Resume updatedResume = resumeService.updateResume(id, resume);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}
