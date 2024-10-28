package com.kurttekin.can.job_track.infrastructure.repository.resume;

import com.kurttekin.can.job_track.domain.model.resume.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findAllByResumeId(Long resumeId);
}
