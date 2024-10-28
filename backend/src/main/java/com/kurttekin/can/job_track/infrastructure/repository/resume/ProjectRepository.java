package com.kurttekin.can.job_track.infrastructure.repository.resume;

import com.kurttekin.can.job_track.domain.model.resume.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
