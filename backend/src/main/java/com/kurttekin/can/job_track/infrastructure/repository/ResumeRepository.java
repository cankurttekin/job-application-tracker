package com.kurttekin.can.job_track.infrastructure.repository;

import com.kurttekin.can.job_track.domain.model.resume.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    Resume findByUserId(Long userId);
}
