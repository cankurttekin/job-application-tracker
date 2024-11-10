package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface JobApplicationService {
    // TO DO custom exceptions
    JobApplication createJobApplication(JobApplication jobApplication);
    List<JobApplication> findAllByUserId(Long userId);
    Optional<JobApplication> findById(Long id);
    //JobApplication updateJobApplication(JobApplication jobApplication);
    JobApplication updateJobApplication(Long id, JobApplication updatedJobApplication, String username);
    void deleteJobApplication(Long id);
    void deleteAllByUserId(Long userId);
    Map<String, Integer> getJobApplicationStats(Long userId);
}
