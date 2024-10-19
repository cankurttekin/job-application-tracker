package com.kurttekin.can.job_track.infrastructure.repository;

import com.kurttekin.can.job_track.domain.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserId(Long userId);
}
