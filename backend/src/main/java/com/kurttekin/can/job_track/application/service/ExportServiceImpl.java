package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.service.ExportService;
import org.apache.commons.csv.CSVFormat;
import org.springframework.stereotype.Service;
import org.apache.commons.csv.CSVPrinter;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

@Service
public class ExportServiceImpl implements ExportService {
    @Override
    public String exportToCSV(List<JobApplication> applications) throws IOException {
        StringWriter writer = new StringWriter();
        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("Company", "Job Title", "Status", "Application Date", "Response Date", "Platform", "Url", "Description", "Comments"))) {
            for (JobApplication app : applications) {
                csvPrinter.printRecord(app.getCompanyName(), app.getJobTitle(), app.getStatus(), app.getApplicationDate(), app.getResponseDate(), app.getPlatform(), app.getJobUrl(), app.getDescription(), app.getComments());
            }
        }
        return writer.toString();
    }

}
