package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;

import java.util.Map;

public interface LlmService {
    String generateInterviewQuestions(String jobDescription, String jobTitle, ResumeDTO resume, Map<String, Object> personalization);
    String generateQuizQuestions(String jobDescription, String jobTitle);
}
