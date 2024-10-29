package com.kurttekin.can.job_track.application.dto;

import com.kurttekin.can.job_track.domain.model.resume.Resume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeDTO {
    private Long id;
    private String title;
    private String summary;
    private String location;
    private Set<String> skills;
    private String coverLetter;
    private LocalDateTime createdAt;
    private List<WorkExperienceDTO> workExperiences;
    private List<EducationDTO> educationList;

    // Factory method to create a ResumeDTO from a Resume entity
    public static ResumeDTO fromResume(Resume resume) {
        return ResumeDTO.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .summary(resume.getSummary())
                .location(resume.getLocation())
                .skills(resume.getSkills())
                .coverLetter(resume.getCoverLetter())
                .workExperiences(resume.getWorkExperiences().stream()
                        .map(WorkExperienceDTO::fromWorkExperience)
                        .collect(Collectors.toList()))
                .educationList(resume.getEducationList().stream()
                        .map(EducationDTO::fromEducation)
                        .collect(Collectors.toList()))
                .build();
    }
}
