package com.kurttekin.can.job_track.domain.model.user;

import com.fasterxml.jackson.annotation.*;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@Table(name = "app_user")
@AllArgsConstructor
@NoArgsConstructor
/*@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
 */
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;

    @JsonIgnore
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<JobApplication> jobApplications;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    //@JoinColumn(name = "resume_id", referencedColumnName = "id")
    @JsonBackReference
    private Resume resume;

    private boolean verified = false;
}
