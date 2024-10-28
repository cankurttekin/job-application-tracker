package com.kurttekin.can.job_track.infrastructure.repository.resume;

import com.kurttekin.can.job_track.domain.model.resume.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
