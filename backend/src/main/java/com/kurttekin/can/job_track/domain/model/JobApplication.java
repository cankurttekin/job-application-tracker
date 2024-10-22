package com.kurttekin.can.job_track.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
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

    @Lob // This annotation indicates a large object (TEXT in PostgreSQL)
    private String description;

    @Lob // This annotation indicates a large object (TEXT in PostgreSQL)
    private String comments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id"/*, referencedColumnName = "id"*/)
    @JsonBackReference
    private User user;

}