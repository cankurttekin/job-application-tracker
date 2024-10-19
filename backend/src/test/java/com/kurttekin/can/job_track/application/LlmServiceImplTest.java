package com.kurttekin.can.job_track.application;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InterviewServiceImplTest {
    @Test
    void testGenerateInterviewQuestions() {
        InterviewServiceImpl interviewService = new InterviewServiceImpl();

        String result = interviewService.generateInterviewQuestions("Sample job description", "Software Engineer");

        assertNotNull(result);
    }


}