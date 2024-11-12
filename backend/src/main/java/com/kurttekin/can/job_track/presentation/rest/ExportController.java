package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.service.ExportServiceImpl;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.ExportService;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    private final ExportService exportService;
    private final JobApplicationService jobApplicationService;
    @Autowired
    private UserService userService;

    public ExportController(ExportServiceImpl exportService, JobApplicationService jobApplicationService) {
        this.exportService = exportService;
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping(value = "/csv", produces = "text/csv")
    public ResponseEntity<String> exportCSV(Authentication authentication) throws IOException {
        String username = authentication.getName(); // Get the username from authentication
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<JobApplication> applications = jobApplicationService.findAllByUserId(user.getId());
        String csvData = exportService.exportToCSV(applications);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"applications.csv\"")
                .body(csvData);
    }

}
