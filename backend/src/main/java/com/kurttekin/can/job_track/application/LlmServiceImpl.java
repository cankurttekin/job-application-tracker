package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.domain.service.InterviewService;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class InterviewServiceImpl implements InterviewService {

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
            return response.body().string();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating questions.";
        }
    }
}