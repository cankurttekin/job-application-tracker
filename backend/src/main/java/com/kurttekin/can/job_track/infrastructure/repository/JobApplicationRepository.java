package com.kurttekin.can.job_track.infrastructure.repository;

import com.kurttekin.can.job_track.domain.exception.JobApplicationNotFoundException;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findAllByUserId(Long userId) throws JobApplicationNotFoundException;

    void deleteByUserId(Long userId);
    //List<JobApplication> findByUserId(Long userId);

    List<JobApplication> findByApplicationDateBetween(LocalDate startDate, LocalDate endDate);

    List<JobApplication> findByUserId(Long userId);
}
