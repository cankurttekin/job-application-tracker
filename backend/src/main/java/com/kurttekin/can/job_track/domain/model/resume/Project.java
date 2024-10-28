package com.kurttekin.can.job_track.domain.model.resume;

import jakarta.persistence.*;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String link;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
}
