package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.exception.ResumeNotFoundException;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import com.kurttekin.can.job_track.domain.model.resume.WorkExperience;
import com.kurttekin.can.job_track.infrastructure.repository.ResumeRepository;
import com.kurttekin.can.job_track.infrastructure.repository.resume.WorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkExperienceService {
    @Autowired
    private WorkExperienceRepository workExperienceRepository;
    @Autowired
    private ResumeRepository resumeRepository;

    public WorkExperience addWorkExperience(Long resumeId, WorkExperience workExperience) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found"));
        workExperience.setResume(resume);
        return workExperienceRepository.save(workExperience);
    }

    public List<WorkExperience> getWorkExperiencesByResumeId(Long resumeId) {
        return workExperienceRepository.findAllByResumeId(resumeId);
    }

    public WorkExperience updateWorkExperience(Long id, WorkExperience updatedExperience) {
        return workExperienceRepository.findById(id).map(workExperience -> {
            workExperience.setTitle(updatedExperience.getTitle());
            workExperience.setCompany(updatedExperience.getCompany());
            workExperience.setStartDate(updatedExperience.getStartDate());
            workExperience.setEndDate(updatedExperience.getEndDate());
            workExperience.setDescription(updatedExperience.getDescription());
            return workExperienceRepository.save(workExperience);
        }).orElseThrow(() -> new ResumeNotFoundException("Work Experience not found")); // refactor
    }

    public void deleteWorkExperience(Long id) {
        workExperienceRepository.deleteById(id);
    }
}
