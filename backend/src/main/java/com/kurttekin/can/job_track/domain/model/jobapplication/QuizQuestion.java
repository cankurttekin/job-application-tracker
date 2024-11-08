package com.kurttekin.can.job_track.domain.model.jobapplication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizQuestion {
    private String questionText;
    private List<String> options;
    private String correctAnswer;
}
