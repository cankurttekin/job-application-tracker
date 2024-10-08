package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.JobApplication;

import java.util.List;

public interface JobApplicationService {
    JobApplication createJobApplication(JobApplication jobApplication);
    List<JobApplication> findAllByUserId(Long userId);
}
