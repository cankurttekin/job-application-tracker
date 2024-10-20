package com.kurttekin.can.job_track.domain.service;

public interface LlmService {
    String generateInterviewQuestions(String jobDescription, String jobTitle);
    String generateQuizQuestions(String jobDescription, String jobTitle);
}
