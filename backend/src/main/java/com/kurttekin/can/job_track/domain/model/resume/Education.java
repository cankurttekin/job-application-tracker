package com.kurttekin.can.job_track.domain.model.resume;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schoolName; // University or School name
    private LocalDate startDate;
    private LocalDate endDate;
    private String field; // Field/Major/Subject
    private String location;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume; // Reference back to the Resume
}