package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.service.LlmService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LlmControllerTest {
    @InjectMocks
    private LlmController llmController;

    @Mock
    private LlmService llmService;

    private Map<String, Object> payload;
//    private QuizRequest quizRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);

        // Initialize payload for generateInterviewQuestions
        payload = new HashMap<>();
        payload.put("description", "Job description for testing");
        payload.put("jobTitle", "Software Engineer");


        // Resume
        Map<String, Object> resumeData = new HashMap<>();
        resumeData.put("skills", List.of("Java", "Spring Boot"));
        resumeData.put("workExperiences", List.of(Map.of(
                "title", "Fullstack Developer",
                "company", "ATSFS",
                "startDate", "2023-01-01",
                "endDate", "2024-01-01",
                "description", "ATSFS"
        )));
        payload.put("resume", resumeData);

        // Personalization
        Map<String, Object> personalization = new HashMap<>();
        personalization.put("level", "advanced");
        payload.put("personalization", personalization);

        // Initialize quiz request
        //quizRequest = new QuizRequest();
        //quizRequest.setJobDescription("Quiz job description");
        //quizRequest.setJobTitle("Quiz job title");
    }

    @Test
    void testGenerateInterviewQuestions_Success() {
        // Mock service
        String mockQuestions = """
                * Question 1
                * Question 2
                * Question 3
                """;
        when(llmService.generateInterviewQuestions(
                anyString(), anyString(), any(ResumeDTO.class), anyMap()))
                .thenReturn(mockQuestions);

        // Call controller
        ResponseEntity<Map<String, Object>> response = llmController.generateInterviewQuestions(payload);

        // Assertions
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        List<String> questions = (List<String>) response.getBody().get("questions");
        assertEquals(3, questions.size());
        assertEquals("Question 1", questions.get(0));

        // Verify service call
        verify(llmService, times(1))
                .generateInterviewQuestions(anyString(), anyString(), any(ResumeDTO.class), anyMap());

    }
}