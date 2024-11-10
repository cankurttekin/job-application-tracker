package com.kurttekin.can.job_track.application;

import com.kurttekin.can.job_track.application.service.JobApplicationServiceImpl;
import com.kurttekin.can.job_track.domain.exception.JobApplicationNotFoundException;
import com.kurttekin.can.job_track.domain.model.jobapplication.JobApplication;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.infrastructure.repository.JobApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobApplicationServiceImplTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private JobApplicationServiceImpl jobApplicationService;

    private JobApplication jobApplication;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        jobApplication = new JobApplication();
        jobApplication.setId(1L);
        jobApplication.setCompanyName("Test Company");
        jobApplication.setJobTitle("Test Job");
        jobApplication.setUser(user);
        jobApplication.setApplicationDate(LocalDate.now());
        jobApplication.setResponseDate(LocalDate.now());
        jobApplication.setStatus("Applied");
        jobApplication.setComments("No comments");
    }
    @Test
    void createJobApplication() {
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplication createdApplication = jobApplicationService.createJobApplication(jobApplication);

        assertNotNull(createdApplication);
        assertEquals("Test Company", createdApplication.getCompanyName());
        verify(jobApplicationRepository, times(1)).save(jobApplication);
    }

    @Test
    void testFindAllByUserId_NotFound() {
        // Mock the repository to return an empty list
        when(jobApplicationRepository.findAllByUserId(user.getId())).thenReturn(Collections.emptyList());

        // Expect the custom exception to be thrown
        JobApplicationNotFoundException exception = assertThrows(
                JobApplicationNotFoundException.class,
                () -> jobApplicationService.findAllByUserId(user.getId())
        );

        // Verify the exception message
        assertEquals("Job Applications not found for user ID: " + user.getId(), exception.getMessage());
    }

    @Test
    void testFindById_Success() {
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(jobApplication));

        Optional<JobApplication> foundApplication = jobApplicationService.findById(1L);

        assertTrue(foundApplication.isPresent());
        assertEquals("Test Company", foundApplication.get().getCompanyName());
    }

    @Test
    void testFindById_NotFound() {
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<JobApplication> foundApplication = jobApplicationService.findById(1L);

        assertFalse(foundApplication.isPresent());
    }


    @Test
    void testUpdateJobApplication_NotFound() {
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            jobApplicationService.updateJobApplication(user.getId(), jobApplication, user.getUsername());
        });

        assertEquals("Job Application not found", exception.getMessage());
    }

    @Test
    void testDeleteJobApplication() {
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.of(jobApplication));

        jobApplicationService.deleteJobApplication(1L);

        verify(jobApplicationRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteJobApplication_NotFound() {
        // Mock the repository to return an empty
        // Optional when searching for the JobApplication by ID
        when(jobApplicationRepository.findById(1L)).thenReturn(Optional.empty());

        // Expect the custom exception to be thrown
        // when trying to delete a non-existing JobApplication
        JobApplicationNotFoundException exception = assertThrows(
                JobApplicationNotFoundException.class,
                () -> jobApplicationService.deleteJobApplication(1L)
        );

        // Verify the exception message
        assertEquals("Job Application not found for ID: 1", exception.getMessage());

        // Verify that the delete method was never called on the repository
        verify(jobApplicationRepository, never()).deleteById(1L);
    }


    @Test
    void testDeleteAllByUserId() {
        jobApplicationService.deleteAllByUserId(user.getId());

        verify(jobApplicationRepository, times(1)).deleteByUserId(user.getId());
    }

    @Test
    void testGetJobApplicationStats() {
        when(jobApplicationRepository.findByUserId(user.getId())).thenReturn(Arrays.asList(jobApplication));

        Map<String, Integer> stats = jobApplicationService.getJobApplicationStats(user.getId());

        assertEquals(1, stats.get("totalApplications"));
        verify(jobApplicationRepository, times(1)).findByUserId(user.getId());
    }
}