package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.domain.exception.ResumeNotFoundException;
import com.kurttekin.can.job_track.domain.model.Resume;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.infrastructure.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Override
    public Resume createResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    @Override
    public List<Resume> getResumesByUserId(Long userId) {
        return resumeRepository.findByUserId(userId);
    }

    @Override
    public Resume updateResume(Long id, Resume resume) {
        Resume existingResume = resumeRepository.findById(id).orElseThrow(() -> new ResumeNotFoundException("Resume not found"));
        existingResume.setTitle(resume.getTitle());
        existingResume.setSummary(resume.getSummary());
        existingResume.setSkills(resume.getSkills());
        existingResume.setEducation(resume.getEducation());
        existingResume.setExperience(resume.getExperience());
        existingResume.setUpdatedAt(new Date());
        return resumeRepository.save(existingResume);
    }

    @Override
    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
}
