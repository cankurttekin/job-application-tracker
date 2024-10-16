package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.domain.model.JobApplication;
import com.kurttekin.can.job_track.domain.model.User;
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
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findUserByUsername("testuser")).thenReturn(Optional.of(user));
        when(jobApplicationService.findById(1L)).thenReturn(Optional.of(jobApplication));
        when(jobApplicationService.updateJobApplication(any(JobApplication.class))).thenReturn(jobApplication);

        jobApplication.setCompanyName("Updated Company");
        ResponseEntity<JobApplication> response = jobApplicationController.updateJobApplication(1L, jobApplication, userDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated Company", response.getBody().getCompanyName());
        verify(jobApplicationService, times(1)).updateJobApplication(any(JobApplication.class));
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