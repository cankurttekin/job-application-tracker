package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.model.resume.Resume;

public interface ResumeService {
    ResumeDTO findById(Long id);
    ResumeDTO createResume(Resume resume);
    //List<Resume> getResumesByUserId(Long userId);
    Resume updateResume(Long id, Resume resume);
    void deleteResume(Long id);
    ResumeDTO createOrUpdateResume(Resume resume);
}
