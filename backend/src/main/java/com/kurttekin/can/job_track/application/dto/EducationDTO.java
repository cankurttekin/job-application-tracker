package com.kurttekin.can.job_track.application.dto;

import com.kurttekin.can.job_track.domain.model.resume.Education;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EducationDTO {
    private Long id;
    private String schoolName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String field;
    private String location;

    public static EducationDTO fromEducation(Education education) {
        return EducationDTO.builder()
                .id(education.getId())
                .schoolName(education.getSchoolName())
                .startDate(education.getStartDate())
                .endDate(education.getEndDate())
                .field(education.getField())
                .location(education.getLocation())
                .build();
    }
}