package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.exception.ResumeNotFoundException;
import com.kurttekin.can.job_track.domain.exception.UserNotFoundException;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.infrastructure.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Override
    public ResumeDTO findById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume Not Found"));

        return convertToDTO(resume);
    }


    @Override
    public ResumeDTO createOrUpdateResume(Resume resume) {
        // Check if a resume already exists for the user
        Optional<Resume> existingResume = resumeRepository.findByUserId(resume.getUser().getId());

        if (existingResume.isPresent()) {
            // Update existing resume fields
            Resume resumeToUpdate = existingResume.get();
            resumeToUpdate.setTitle(resume.getTitle());
            resumeToUpdate.setSummary(resume.getSummary());
            resumeToUpdate.setEducation(resume.getEducation());
            resumeToUpdate.setLocation(resume.getLocation());
            resumeToUpdate.setSkills(resume.getSkills());

            // Save updated resume
            Resume updatedResume = resumeRepository.save(resumeToUpdate);
            return convertToDTO(updatedResume);
        } else {
            // If no resume exists for this user, create a new one
            Resume savedResume = resumeRepository.save(resume);
            return convertToDTO(savedResume);
        }
    }


    @Override
    public ResumeDTO createResume(Resume resume) {
        Resume savedResume = resumeRepository.save(resume);
        return ResumeDTO.fromResume(savedResume);
    }

    @Override
    public Resume updateResume(Long userId, Resume resume) {
        // Check if exists
        resumeRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found")); // fix

        // Set userid on resume
        resume.setId(userId);

        // Save and return updated resume
        return resumeRepository.save(resume);
    }

    @Override
    public void deleteResume(Long id) {
        // Check if resume exists
        resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found"));

        // If found proceed with deletion
        resumeRepository.deleteById(id);
    }

    private ResumeDTO convertToDTO(Resume resume) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(resume.getId());
        dto.setTitle(resume.getTitle());
        dto.setSummary(resume.getSummary());
        dto.setEducation(resume.getEducation());
        dto.setLocation(resume.getLocation());
        dto.setSkills(resume.getSkills());
        //dto.setCreatedAt(resume.getCreatedAt());
        return dto;
    }

}
