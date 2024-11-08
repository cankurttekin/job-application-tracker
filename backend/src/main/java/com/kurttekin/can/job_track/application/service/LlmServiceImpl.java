package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.application.dto.WorkExperienceDTO;
import com.kurttekin.can.job_track.domain.service.LlmService;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LlmServiceImpl implements LlmService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final OkHttpClient client = new OkHttpClient();

    @Override
    public String generateInterviewQuestions(String jobDescription, String jobTitle, ResumeDTO resume, Map<String, Object> personalization) {
        // Extract skills and work experience from ResumeDTO
        String resumeSkills = String.join(", ", resume.getSkills());
        StringBuilder workExperiences = new StringBuilder();

        for (WorkExperienceDTO experience : resume.getWorkExperiences()) {
            workExperiences.append(experience.getTitle()).append(" at ")
                    .append(experience.getCompany()).append(" from ")
                    .append(experience.getStartDate()).append(" to ")
                    .append(experience.getEndDate()).append(". ")
                    .append(experience.getDescription()).append("\n");
        }

// Create the prompt
        StringBuilder prompt = new StringBuilder("You are an interviewer. Generate questions for a candidate applying for a ")
                .append(jobTitle).append(" position with the following job description: ")
                .append(jobDescription).append("\n\n")
                .append("The candidate has the following skills: ").append(resumeSkills).append(".\n")
                .append("Work Experience:\n").append(workExperiences.toString());

        // Add personalization to the prompt
        if (personalization != null) {
            addListToPrompt(prompt, personalization.get("tone"), "Preferred tones");
            addListToPrompt(prompt, personalization.get("focusAreas"), "Focus areas");
            addListToPrompt(prompt, personalization.get("questionTypes"), "Question types");
            addStringToPrompt(prompt, personalization.get("experienceLevel"), "Experience level");
        }
        try {
            // Create the JSON body
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("contents", new JSONArray()
                    .put(new JSONObject()
                            .put("parts", new JSONArray()
                                    .put(new JSONObject()
                                            .put("text", prompt)))));

            RequestBody body = RequestBody.create(
                    jsonBody.toString(),
                    MediaType.get("application/json"));

            // Build the request
            Request request = new Request.Builder()
                    .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey)
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            // Execute the request
            Response response = client.newCall(request).execute();

            // Log the response body
            String responseBody = response.body().string();
            System.out.println("API Response: " + responseBody); // Log the full response

            // Parse the response to extract the questions
            JSONObject responseJson = new JSONObject(responseBody);

            return parseQuestions(responseJson);

        } catch (Exception e) {
            // Exception handling
            return "Error generating questions.";
        }
    }

    /**
     * Adds a section to the prompt for list-based personalization fields if the list is not empty.
     */
    private void addListToPrompt(StringBuilder prompt, Object listObj, String label) {
        if (listObj instanceof List<?> list && list.stream().allMatch(item -> item instanceof String) && !list.isEmpty()) {
            String joinedList = list.stream().map(String.class::cast).collect(Collectors.joining(", "));
            prompt.append(label).append(": ").append(joinedList).append(".\n");
        }
    }

    /**
     * Adds a section to the prompt for string-based personalization fields if the string is non-null and non-empty.
     */
    private void addStringToPrompt(StringBuilder prompt, Object strObj, String label) {
        if (strObj instanceof String str && !str.isBlank()) {
            prompt.append(label).append(": ").append(str).append(".\n");
        }
    }

    private String parseQuestions(JSONObject responseJson) {
        if (responseJson.has("candidates") && !responseJson.getJSONArray("candidates").isEmpty()) {
            JSONArray parts = responseJson.getJSONArray("candidates")
                    .getJSONObject(0) // Get the first candidate
                    .getJSONObject("content") // Access content
                    .getJSONArray("parts"); // Get the parts

            StringBuilder questions = new StringBuilder();
            for (int i = 0; i < parts.length(); i++) {
                questions.append(parts.getJSONObject(i).getString("text")).append("\n");
            }

            return questions.toString();
        } else {
            return "No interview questions were generated.";
        }
    }

    @Override
    public String generateQuizQuestions(String jobDescription, String jobTitle) {
        String prompt = "You are a quiz creator. Generate a variety of quiz questions (multiple choice, true/false, short answer) for a "
                + jobTitle + " position with the following job description: "
                + jobDescription;

        try {
            // Create the JSON body
            JSONObject jsonBody = createJsonBody(prompt);

            // Build the request
            Request request = buildRequest(jsonBody);

            // Execute the request
            Response response = client.newCall(request).execute();

            // Log the response body
            String responseBody = response.body().string();
            System.out.println("Quiz API Response: " + responseBody); // Log the full response

            // Parse the response to extract the quiz questions
            return parseQuizQuestions(responseBody);

        } catch (Exception e) {
            // Exception handling
            return "Error generating quiz questions.";
        }
    }

    private JSONObject createJsonBody(String prompt) {
        return new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)))));
    }

    private Request buildRequest(JSONObject jsonBody) {
        return new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey)
                .post(RequestBody.create(jsonBody.toString(), MediaType.get("application/json")))
                .addHeader("Content-Type", "application/json")
                .build();
    }

    private String parseQuizQuestions(String responseBody) {
        JSONObject responseJson = new JSONObject(responseBody);

        if (responseJson.has("candidates") && !responseJson.getJSONArray("candidates").isEmpty()) {
            JSONArray parts = responseJson.getJSONArray("candidates")
                    .getJSONObject(0) // Get the first candidate
                    .getJSONObject("content") // Access content
                    .getJSONArray("parts"); // Get the parts

            StringBuilder quizQuestions = new StringBuilder();
            for (int i = 0; i < parts.length(); i++) {
                quizQuestions.append(parts.getJSONObject(i).getString("text")).append("\n");
            }

            return quizQuestions.toString();
        } else {
            return "No quiz questions were generated.";
        }
    }
}