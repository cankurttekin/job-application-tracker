package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.infrastructure.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return jobApplicationRepository.findAllByUserId(userId);
    }
}
