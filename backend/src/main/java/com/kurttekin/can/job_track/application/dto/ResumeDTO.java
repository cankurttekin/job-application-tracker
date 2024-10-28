package com.kurttekin.can.job_track.application.dto;

import com.kurttekin.can.job_track.domain.model.resume.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeDTO {
    private Long id;
    private String title;
    private String summary;
    private String education;
    private String location;
    private Set<String> skills;
    private LocalDateTime createdAt;

    // Factory method to create a ResumeDTO from a Resume entity
    public static ResumeDTO fromResume(Resume resume) {
        return ResumeDTO.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .summary(resume.getSummary())
                .education(resume.getEducation())
                .location(resume.getLocation())
                .skills(resume.getSkills())
                //.createdAt(resume.getCreatedAt())
                .build();
    }
}
