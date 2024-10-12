package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.JobApplication;

import java.util.List;
import java.util.Optional;

public interface JobApplicationService {
    JobApplication createJobApplication(JobApplication jobApplication);
    List<JobApplication> findAllByUserId(Long userId);
    Optional<JobApplication> findById(Long id);
    JobApplication updateJobApplication(JobApplication jobApplication);
    void deleteJobApplication(Long id);
    void deleteAllByUserId(Long userId);
}