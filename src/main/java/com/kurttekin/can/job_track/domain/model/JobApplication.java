package com.kurttekin.can.job_track.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
/*
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")*/
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id"/*, referencedColumnName = "id"*/)
    @JsonBackReference
    private User user;
}
