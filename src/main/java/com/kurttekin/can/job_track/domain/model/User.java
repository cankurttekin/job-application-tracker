package com.kurttekin.can.job_track.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@Table(name = "app_user")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;

    @OneToMany(mappedBy = "user")
    private List<JobApplication> jobApplications;

    @Enumerated(EnumType.STRING)
    private Role role;

}
