package com.kurttekin.can.job_track.presentation.rest;


import com.kurttekin.can.job_track.application.dto.QuizRequest;
import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.application.dto.WorkExperienceDTO;
import com.kurttekin.can.job_track.domain.model.jobapplication.QuizQuestion;
import com.kurttekin.can.job_track.domain.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    @Autowired
    private LlmService llmService;

    @PostMapping("/generate-interview")
    public ResponseEntity<Map<String, Object>> generateInterviewQuestions(@RequestBody Map<String, Object> payload) {
        String jobDescription = (String) payload.get("description");
        String jobTitle = (String) payload.get("jobTitle");
        ResumeDTO resume = parseResumeFromPayload(payload); // Update method to parse ResumeDTO

        // Retrieve personalization preferences
        Map<String, Object> personalization = (Map<String, Object>) payload.get("personalization");

        System.out.println("Received request for generating interview questions:");
        System.out.println("Job Title: " + jobTitle);
        System.out.println("Resume: " + resume);
        System.out.println("Personalization: " + personalization);

        // Generate the interview questions
        //String questions = llmService.generateInterviewQuestions(jobDescription, jobTitle, resume);
        String questions = llmService.generateInterviewQuestions(jobDescription, jobTitle, resume, personalization);

        // Split the questions string into a list
        List<String> questionList = Arrays.stream(questions.split("\n"))
                .map(q -> q.replaceAll("\\*+", "").trim())
                .filter(q -> !q.isEmpty())
                .toList();

        return ResponseEntity.ok(Map.of("questions", questionList));
    }

    @PostMapping("/generate-quiz")
    public ResponseEntity<List<QuizQuestion>> generateQuiz(@RequestBody QuizRequest quizRequest) {
        String quizContent = llmService.generateQuizQuestions(quizRequest.getJobDescription(), quizRequest.getJobTitle());
        List<QuizQuestion> quizQuestions = parseQuizContent(quizContent);
        return ResponseEntity.ok(quizQuestions);
    }

    private List<QuizQuestion> parseQuizContent(String content) {
        List<QuizQuestion> questions = new ArrayList<>();
        String[] lines = content.split("\n");
        String currentQuestion = null;
        List<String> options = new ArrayList<>();

        for (String line : lines) {
            line = line.trim();
            if (line.matches("^\\d+\\. .*")) {
                if (currentQuestion != null) {
                    questions.add(new QuizQuestion(currentQuestion, options, null));
                }
                currentQuestion = line;
                options = new ArrayList<>();
            } else if (line.matches("^[a-d]\\) .*")) {
                options.add(line);
            }
        }

        if (currentQuestion != null) {
            questions.add(new QuizQuestion(currentQuestion, options, null));
        }
        return questions;
    }

    private ResumeDTO parseResumeFromPayload(Map<String, Object> payload) {
        ResumeDTO resume = new ResumeDTO();

        // Check if resume exists in the payload
        if (payload.get("resume") instanceof Map) {
            Map<String, Object> resumeData = (Map<String, Object>) payload.get("resume");

            // Ensure skills is a List and convert to Set
            if (resumeData.get("skills") instanceof List) {
                List<String> skillsList = (List<String>) resumeData.get("skills");
                resume.setSkills(new HashSet<>(skillsList)); // Convert List to Set
            }

            List<WorkExperienceDTO> workExperiences = new ArrayList<>();
            if (resumeData.get("workExperiences") instanceof List) {
                List<Map<String, Object>> workExperienceData = (List<Map<String, Object>>) resumeData.get("workExperiences");

                for (Map<String, Object> experienceData : workExperienceData) {
                    WorkExperienceDTO experience = new WorkExperienceDTO();
                    experience.setTitle((String) experienceData.get("title"));
                    experience.setCompany((String) experienceData.get("company"));

                    // Convert String to LocalDate
                    if (experienceData.get("startDate") instanceof String startDateStr) {
                        experience.setStartDate(LocalDate.parse(startDateStr, DateTimeFormatter.ISO_DATE)); // Assuming ISO format
                    }

                    if (experienceData.get("endDate") instanceof String) {
                        String endDateStr = (String) experienceData.get("endDate");
                        experience.setEndDate(LocalDate.parse(endDateStr, DateTimeFormatter.ISO_DATE)); // Assuming ISO format
                    }

                    experience.setDescription((String) experienceData.get("description"));
                    workExperiences.add(experience);
                }
            }
            resume.setWorkExperiences(workExperiences);
        }
        return resume;
    }
}

