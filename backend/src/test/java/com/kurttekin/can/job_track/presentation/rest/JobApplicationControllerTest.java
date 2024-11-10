package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.JobApplicationService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobApplicationControllerTest {

    @Mock
    private JobApplicationService jobApplicationService;

    @Mock
    private UserService userService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private JobApplicationController jobApplicationController;

    private User user;
    private JobApplication jobApplication;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create a mock user and job application
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        jobApplication = new JobApplication();
        jobApplication.setId(1L);
        jobApplication.setUser(user);
        jobApplication.setCompanyName("Test Company");
        jobApplication.setJobTitle("Test Job");
        jobApplication.setApplicationDate(LocalDate.now());
    }

    @Test
    void createJobApplication() {
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));
        when(jobApplicationService.createJobApplication(any(JobApplication.class))).thenReturn(jobApplication);

        ResponseEntity<JobApplication> response = jobApplicationController.createJobApplication(jobApplication, userDetails);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(jobApplication, response.getBody());
        verify(jobApplicationService, times(1)).createJobApplication(any(JobApplication.class));
    }

    @Test
    void getJobApplications() {
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));
        when(jobApplicationService.findAllByUserId(1L)).thenReturn(Arrays.asList(jobApplication));

        ResponseEntity<List<JobApplication>> response = jobApplicationController.getJobApplications(mockAuthentication());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Test Company", response.getBody().get(0).getCompanyName());
        verify(jobApplicationService, times(1)).findAllByUserId(1L);
    }

    @Test
    void updateJobApplication() {
        // Mock the user details and the user service response
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));

        // Mock the job application response from the service
        when(jobApplicationService.findById(1L)).thenReturn(Optional.of(jobApplication));

        // Set up the job application to be updated with new values
        JobApplication updatedJobApplication = new JobApplication();
        updatedJobApplication.setCompanyName("Updated Company");
        updatedJobApplication.setJobTitle("Updated Job Title");
        updatedJobApplication.setStatus("Updated Status");
        updatedJobApplication.setJobUrl("Updated Job Url");
        updatedJobApplication.setDescription("Updated Description");
        updatedJobApplication.setApplicationDate(LocalDate.now());
        updatedJobApplication.setResponseDate(LocalDate.now());
        updatedJobApplication.setPlatform("Updated Platform");
        updatedJobApplication.setStarred(true);
        updatedJobApplication.setComments("Updated Comments");

        // Mock the updated job application to be returned by the service
        JobApplication mockUpdatedJobApplication = new JobApplication();
        mockUpdatedJobApplication.setCompanyName("Updated Company");
        mockUpdatedJobApplication.setJobTitle("Updated Job Title");
        mockUpdatedJobApplication.setStatus("Updated Status");
        mockUpdatedJobApplication.setJobUrl("Updated Job Url");
        mockUpdatedJobApplication.setDescription("Updated Description");
        mockUpdatedJobApplication.setApplicationDate(LocalDate.now());
        mockUpdatedJobApplication.setResponseDate(LocalDate.now());
        mockUpdatedJobApplication.setPlatform("Updated Platform");
        mockUpdatedJobApplication.setStarred(true);
        mockUpdatedJobApplication.setComments("Updated Comments");

        // When the controller method is called, it delegates to the service update method
        when(jobApplicationService.updateJobApplication(1L, updatedJobApplication, "testuser"))
                .thenReturn(mockUpdatedJobApplication);

        // Call the controller method
        ResponseEntity<JobApplication> response = jobApplicationController.updateJobApplication(1L, updatedJobApplication, userDetails);

        // Assert that the response status is OK (200)
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Assert that the job application was updated
        assertEquals("Updated Company", response.getBody().getCompanyName());
        assertEquals("Updated Job Title", response.getBody().getJobTitle());
        assertEquals("Updated Status", response.getBody().getStatus());
        assertEquals("Updated Job Url", response.getBody().getJobUrl());
        assertEquals("Updated Description", response.getBody().getDescription());
        assertEquals("Updated Platform", response.getBody().getPlatform());
        assertEquals("Updated Comments", response.getBody().getComments());

        // Verify that the service method was called with the correct arguments
        verify(jobApplicationService, times(1)).updateJobApplication(1L, updatedJobApplication, "testuser");
    }


    @Test
    void deleteJobApplication() {
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));
        when(jobApplicationService.findById(1L)).thenReturn(Optional.of(jobApplication));

        ResponseEntity<Void> response = jobApplicationController.deleteJobApplication(1L, userDetails);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(jobApplicationService, times(1)).deleteJobApplication(1L);
    }

    @Test
    void deleteAllJobApplications() {
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));

        ResponseEntity<Void> response = jobApplicationController.deleteAllJobApplications(userDetails);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(jobApplicationService, times(1)).deleteAllByUserId(1L);
    }

    @Test
    void getJobApplicationStats() {
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));
        when(jobApplicationService.findAllByUserId(1L)).thenReturn(Arrays.asList(jobApplication));

        ResponseEntity<Map<String, Object>> response = jobApplicationController.getJobApplicationStats(userDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> stats = response.getBody();
        assertEquals(1, stats.get("totalApplications"));
        verify(jobApplicationService, times(1)).findAllByUserId(1L);
    }


    private Authentication mockAuthentication() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        return authentication;
    }
}