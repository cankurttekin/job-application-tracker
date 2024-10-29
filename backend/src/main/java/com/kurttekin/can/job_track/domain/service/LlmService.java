package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.model.resume.Resume;

public interface LlmService {
    String generateInterviewQuestions(String jobDescription, String jobTitle, ResumeDTO resume);
    String generateQuizQuestions(String jobDescription, String jobTitle);
}
