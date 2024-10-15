package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.domain.exception.JobApplicationNotFoundException;
import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.infrastructure.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Override
    public JobApplication createJobApplication(JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }

    @Override
    public List<JobApplication> findAllByUserId(Long userId) {
        List<JobApplication> applications = jobApplicationRepository.findAllByUserId(userId);

        if (applications.isEmpty()) {
            throw new JobApplicationNotFoundException("Job Applications not found for user ID: " + userId);
        }

        return applications;
    }

    @Override
    public Optional<JobApplication> findById(Long id) {
        return jobApplicationRepository.findById(id);
    }

    @Override
    public JobApplication updateJobApplication(JobApplication jobApplication) {
        // Check if the job application exists
        jobApplicationRepository.findById(jobApplication.getId())
                .orElseThrow(() -> new JobApplicationNotFoundException("Job Application not found"));

        // If it exists, save and return the updated application
        return jobApplicationRepository.save(jobApplication);
    }

    @Override
    public void deleteJobApplication(Long id) {
        // Check if the job application exists
        JobApplication jobApplication = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException("Job Application not found for ID: " + id));

        // If found, proceed with deletion
        jobApplicationRepository.deleteById(id);
    }


    @Override
    public void deleteAllByUserId(Long userId) {
        jobApplicationRepository.deleteByUserId(userId);
    }

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
