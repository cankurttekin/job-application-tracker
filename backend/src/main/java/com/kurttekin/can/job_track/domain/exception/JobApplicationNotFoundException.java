package com.kurttekin.can.job_track.domain.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class JobApplicationNotFoundException extends RuntimeException {
    public JobApplicationNotFoundException(String message) {
        super(message);
    }
}
