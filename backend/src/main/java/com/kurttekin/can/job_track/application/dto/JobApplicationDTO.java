package com.kurttekin.can.job_track.application.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationDTO {
    private Long id;
    private String companyName;
    private String jobTitle;
    private String status;
    private LocalDate applicationDate;
    private LocalDate responseDate;
    private String platform;
    private String jobUrl;
    private String description;
    private String comments;
}
