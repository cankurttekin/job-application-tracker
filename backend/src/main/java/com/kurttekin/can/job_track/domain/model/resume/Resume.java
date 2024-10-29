package com.kurttekin.can.job_track.domain.model.resume;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kurttekin.can.job_track.domain.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference
    private User user;

    private String title;
    private String summary;

    private String education;
    private String location;


    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkExperience> workExperiences;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL)
    private List<Project> projects;

    @ElementCollection
    @CollectionTable(name = "resume_skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    private Date createdAt;

    private Date updatedAt;
}
