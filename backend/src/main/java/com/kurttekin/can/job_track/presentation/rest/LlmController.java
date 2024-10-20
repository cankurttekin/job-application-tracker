package com.kurttekin.can.job_track.presentation.rest;


import com.kurttekin.can.job_track.application.dto.QuizRequest;
import com.kurttekin.can.job_track.domain.model.QuizQuestion;
import com.kurttekin.can.job_track.domain.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    @Autowired
    private LlmService llmService;

    @PostMapping("/generate-interview")
    public ResponseEntity<Map<String, Object>> generateInterviewQuestions(@RequestBody Map<String, String> payload) {
        String jobDescription = payload.get("jobDescription");
        String jobTitle = payload.get("jobTitle");

        // Generate the interview questions
        String questions = llmService.generateInterviewQuestions(jobDescription, jobTitle);

        // Split the questions string into a list
        List<String> questionList = Arrays.stream(questions.split("\n"))
                .map(q -> q.replaceAll("\\*+", "").trim()) // Remove asterisks and trim whitespace
                .filter(q -> !q.isEmpty()) // Filter out any empty lines
                .toList();

        // Return as a list
        return ResponseEntity.ok(Map.of("questions", questionList));
    }

    @PostMapping("/generate-quiz")
    public ResponseEntity<List<QuizQuestion>> generateQuiz(@RequestBody QuizRequest quizRequest) {
        // Generate the quiz content
        String quizContent = llmService.generateQuizQuestions(quizRequest.getJobDescription(), quizRequest.getJobTitle());

        // Parse the quiz content to create a list of QuizQuestion objects
        List<QuizQuestion> quizQuestions = parseQuizContent(quizContent);

        // Return the structured quiz questions
        return ResponseEntity.ok(quizQuestions);
    }

    private List<QuizQuestion> parseQuizContent(String content) {
        List<QuizQuestion> questions = new ArrayList<>();
        String[] lines = content.split("\n");
        String currentQuestion = null;
        List<String> options = new ArrayList<>();

        for (String line : lines) {
            line = line.trim();
            if (line.matches("^\\d+\\. .*")) { // Check if line starts with a number and period (e.g., "1. Question")
                // If there is an existing question, add it to the list
                if (currentQuestion != null) {
                    questions.add(new QuizQuestion(currentQuestion, options, null)); // Set correct answer to null for now
                }
                // Start a new question
                currentQuestion = line;
                options = new ArrayList<>();
            } else if (line.matches("^[a-d]\\) .*")) { // Check if line starts with an option (e.g., "a) Option")
                // Add options
                options.add(line);
            }
        }

        // Add the last question if exists
        if (currentQuestion != null) {
            questions.add(new QuizQuestion(currentQuestion, options, null)); // Set correct answer to null for now
        }

        return questions;
    }
}

