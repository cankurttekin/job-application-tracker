package com.kurttekin.can.job_track.domain.model.resume;

import jakarta.persistence.*;

@Entity
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    //private String level; // e.g., Beginner, Intermediate, Advanced

    /*
    @JsonCreator
    public Skill(@JsonProperty("name") String name) {
        this.name = name;
    }
     */


    @ManyToOne
    @JoinColumn(name = "resume_id")
    private Resume resume;
}
