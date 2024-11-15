package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.exception.JobApplicationNotFoundException;
import com.kurttekin.can.job_track.domain.exception.UnauthorizedAccessException;
import com.kurttekin.can.job_track.domain.exception.UserNotFoundException;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.infrastructure.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserService userService;

    @Transactional
    @Override
    public JobApplication createJobApplication(JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }

    @Transactional(readOnly = true)
    @Override
    public List<JobApplication> findAllByUserId(Long userId) {
        List<JobApplication> applications = jobApplicationRepository.findAllByUserId(userId);

        if (applications.isEmpty()) {
            throw new JobApplicationNotFoundException("Job Applications not found for user ID: " + userId);
        }

        return applications;
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<JobApplication> findById(Long id) {
        return jobApplicationRepository.findById(id);
    }

    @Transactional
    @Override
    public JobApplication updateJobApplication(Long id, JobApplication updatedJobApplication, String username) {
        // First, check if the job application exists
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException("Job Application not found"));

        // Then, check if the user exists
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Ensure the job application belongs to the user
        if (!jobApplication.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to update this job application.");
        }

        // Proceed with the update
        jobApplication.setCompanyName(updatedJobApplication.getCompanyName());
        jobApplication.setJobTitle(updatedJobApplication.getJobTitle());
        jobApplication.setStatus(updatedJobApplication.getStatus());
        jobApplication.setJobUrl(updatedJobApplication.getJobUrl());
        jobApplication.setDescription(updatedJobApplication.getDescription());
        jobApplication.setApplicationDate(updatedJobApplication.getApplicationDate());
        jobApplication.setResponseDate(updatedJobApplication.getResponseDate());
        jobApplication.setPlatform(updatedJobApplication.getPlatform());
        jobApplication.setStarred(updatedJobApplication.isStarred());
        jobApplication.setComments(updatedJobApplication.getComments());

        // Save and return the updated job application
        return jobApplicationRepository.save(jobApplication);
    }

    @Transactional
    @Override
    public void deleteJobApplication(Long id) {
        // Check if the job application exists
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException("Job Application not found for ID: " + id));

        // If found, proceed with deletion
        jobApplicationRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void deleteAllByUserId(Long userId) {
        jobApplicationRepository.deleteByUserId(userId);
    }

    @Transactional(readOnly = true)
    @Override
    public Map<String, Integer> getJobApplicationStats(Long userId) {
        Map<String, Integer> stats = new HashMap<>();

        List<JobApplication> applications = jobApplicationRepository.findByUserId(userId);

        stats.put("totalApplications", applications.size());

        for (JobApplication application : applications) {
            String date = application.getApplicationDate().toString();
            stats.put(date, stats.getOrDefault(date, 0) + 1); // Increment the count for the date
        }

        return stats;
    }
}
