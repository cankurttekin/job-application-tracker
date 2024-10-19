package com.kurttekin.can.job_track.domain.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    private String title;
    private String summary;
    private String skills;
    private String education;
    private String location;
    private String experience;

}
