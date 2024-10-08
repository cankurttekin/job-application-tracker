package com.kurttekin.can.job_track.infrastructure.repository;

import com.kurttekin.can.job_track.domain.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findAllByUserId(Long userId);
    //List<JobApplication> findByUserId(Long userId);
}
