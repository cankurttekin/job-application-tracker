package com.kurttekin.can.job_track.application.dto;

import com.kurttekin.can.job_track.domain.model.resume.WorkExperience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkExperienceDTO {
    private Long id;
    private String title;
    private String company;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    public static WorkExperienceDTO fromWorkExperience(WorkExperience workExperience) {
        return WorkExperienceDTO.builder()
                .id(workExperience.getId())
                .title(workExperience.getTitle())
                .company(workExperience.getCompany())
                .startDate(workExperience.getStartDate())
                .endDate(workExperience.getEndDate())
                .description(workExperience.getDescription())
                .build();
    }
}