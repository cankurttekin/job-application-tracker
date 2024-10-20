package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.domain.service.LlmService;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LlmServiceImpl implements LlmService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final OkHttpClient client = new OkHttpClient();

    @Override
    public String generateInterviewQuestions(String jobDescription, String jobTitle) {
        String prompt = "You are an interviewer. Generate questions for a candidate applying for a "
                + jobTitle + " position with the following job description: "
                + jobDescription;

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

            // Check if "candidates" exists
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

        } catch (Exception e) {
            // imp exc handling
            return "Error generating questions.";
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
        // Create the JSON body
        return new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)))));
    }

    private Request buildRequest(JSONObject jsonBody) {
        // Build the request
        return new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey)
                .post(RequestBody.create(jsonBody.toString(), MediaType.get("application/json")))
                .addHeader("Content-Type", "application/json")
                .build();
    }

    private String parseQuestions(String responseBody) {
        // Parse the response to extract the questions
        JSONObject responseJson = new JSONObject(responseBody);

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

    private String parseQuizQuestions(String responseBody) {
        // Parse the response to extract the quiz questions
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