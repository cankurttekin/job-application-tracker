package com.kurttekin.can.job_track.application.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String username;
    private String email;
    private String password;
}
