package com.kurttekin.can.job_track.domain.service;

import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;

import java.io.IOException;
import java.util.List;

public interface ExportService {
    String exportToCSV(List<JobApplication> applications) throws IOException;
}
