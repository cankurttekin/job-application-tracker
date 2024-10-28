package com.kurttekin.can.job_track.domain.model.resume;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class WorkExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
}
