package com.kurttekin.can.job_track.domain.exception;

public class CoverLetterTooLongException extends RuntimeException {
    public CoverLetterTooLongException(String message) {
        super(message);
    }
}
