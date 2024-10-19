package com.kurttekin.can.job_track.presentation.rest;


import com.kurttekin.can.job_track.domain.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    @Autowired
    private LlmService llmServic;

    @PostMapping("/generate-interview")
    public ResponseEntity<Map<String, Object>> generateInterviewQuestions(@RequestBody Map<String, String> payload) {
        String jobDescription = payload.get("jobDescription");
        String jobTitle = payload.get("jobTitle");

        // Generate the interview questions
        String questions = llmServic.generateInterviewQuestions(jobDescription, jobTitle);

        // Split the questions string into a list
        List<String> questionList = Arrays.stream(questions.split("\n"))
                .map(q -> q.replaceAll("\\*+", "").trim()) // Remove asterisks and trim whitespace
                .filter(q -> !q.isEmpty()) // Filter out any empty lines
                .toList();

        // Return as a list
        return ResponseEntity.ok(Map.of("questions", questionList));
    }
}
