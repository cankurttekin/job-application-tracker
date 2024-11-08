package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.application.dto.EducationDTO;
import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.application.dto.WorkExperienceDTO;
import com.kurttekin.can.job_track.domain.exception.CoverLetterTooLongException;
import com.kurttekin.can.job_track.domain.exception.ResumeNotFoundException;
import com.kurttekin.can.job_track.domain.exception.UserNotFoundException;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.infrastructure.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Optional<Resume> existingResumeOpt = resumeRepository.findByUserId(resume.getUser().getId());

        // Validate the cover letter length
        if (resume.getCoverLetter() != null && resume.getCoverLetter().length() > 2000) {
            throw new CoverLetterTooLongException("Cover letter must not exceed 2000 characters.");
        }

        if (existingResumeOpt.isPresent()) {
            // Update existing resume fields
            Resume existingResume = existingResumeOpt.get();
            existingResume.setTitle(resume.getTitle());
            existingResume.setSummary(resume.getSummary());
            existingResume.setLocation(resume.getLocation());
            existingResume.setCoverLetter(resume.getCoverLetter());
            existingResume.setSkills(resume.getSkills());

            // Update work experiences
            existingResume.getWorkExperiences().clear();  // Clear existing work experiences
            if (resume.getWorkExperiences() != null) {
                // Set resume reference for each work experience and add to the list
                resume.getWorkExperiences().forEach(workExperience -> workExperience.setResume(existingResume));
                existingResume.getWorkExperiences().addAll(resume.getWorkExperiences());
            }

            // Update education entries
            existingResume.getEducationList().clear();
            if (resume.getEducationList() != null) {
                resume.getEducationList().forEach(education -> education.setResume(existingResume));
                existingResume.getEducationList().addAll(resume.getEducationList());
            }

            // Save the updated resume
            Resume updatedResume = resumeRepository.save(existingResume);
            return convertToDTO(updatedResume);
        } else {
            // If no resume exists for this user, create a new one
            if (resume.getWorkExperiences() != null) {
                // Set resume reference for each new work experience
                resume.getWorkExperiences().forEach(workExperience -> workExperience.setResume(resume));
            }
            if (resume.getEducationList() != null) {
                resume.getEducationList().forEach(education -> education.setResume(resume));
            }
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
        dto.setLocation(resume.getLocation());
        dto.setSkills(resume.getSkills());
        dto.setCoverLetter(resume.getCoverLetter());

        // Convert work experiences
        List<WorkExperienceDTO> workExperienceDTOs = resume.getWorkExperiences().stream()
                .map(WorkExperienceDTO::fromWorkExperience)
                .collect(Collectors.toList());
        dto.setWorkExperiences(workExperienceDTOs);

        // Convert education
        List<EducationDTO> educationDTOS = resume.getEducationList().stream()
                .map(EducationDTO::fromEducation)
                .collect(Collectors.toList());
        dto.setEducationList(educationDTOS);

        return dto;
    }

}
