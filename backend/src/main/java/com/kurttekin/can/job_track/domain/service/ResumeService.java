package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.Resume;

import java.util.List;
import java.util.Optional;

public interface ResumeService {
    Optional<Resume> findById(Long id);
    Resume createResume(Resume resume);
    List<Resume> getResumesByUserId(Long userId);
    Resume updateResume(Long id, Resume resume);
    void deleteResume(Long id);
}
