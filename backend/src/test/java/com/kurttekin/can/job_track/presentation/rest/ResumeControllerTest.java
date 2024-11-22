package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.ResumeDTO;
import com.kurttekin.can.job_track.domain.model.resume.Resume;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.ResumeService;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ResumeControllerTest {

    @InjectMocks
    private ResumeController resumeController;

    @Mock
    private ResumeService resumeService;

    @Mock
    private UserService userService;

    private User user;
    private UserDetails userDetails;
    private Resume resume;
    private ResumeDTO resumeDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Create mock User and Resume
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(user.getUsername());

        resume = new Resume();
        resume.setTitle("Software Developer but unemployed");
        resumeDTO = new ResumeDTO();
        resumeDTO.setTitle("Software Developer but unemployed");
    }

    @Test
    public void testCreateOrUpdateResume_Success() {
        // Mock userService behavior
        when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

        // Mock resumeService behavior
        when(resumeService.createOrUpdateResume(resume)).thenReturn(resumeDTO);

        // Call the controller method
        ResponseEntity<ResumeDTO> response = resumeController.createOrUpdateResume(resume, userDetails);

        // Verify and assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(resumeDTO, response.getBody());
        verify(userService).findUserByUsername(user.getUsername());
        verify(resumeService).createOrUpdateResume(resume);
    }

    @Test
    public void testCreateOrUpdateResume_UserNotFound() {
        // Mock userService behavior to return empty
        when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.empty());

        // Expect an exception when calling the method
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> resumeController.createOrUpdateResume(resume, userDetails));

        assertEquals("User not found", exception.getMessage());
        verify(userService).findUserByUsername(user.getUsername());
        verifyNoInteractions(resumeService); // Ensure resumeService is not called
    }

    @Test
    public void testGetResume_Success() {
        // Mock userService behavior
        when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.of(user));

        // Mock resumeService behavior
        when(resumeService.findById(user.getId())).thenReturn(resumeDTO);

        // Call the controller method
        ResponseEntity<ResumeDTO> response = resumeController.getResume(userDetails);

        // Verify and assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(resumeDTO, response.getBody());
        verify(userService).findUserByUsername(user.getUsername());
        verify(resumeService).findById(user.getId());
    }

    @Test
    public void testGetResume_UserNotFound() {
        // Mock userService behavior to return empty
        when(userService.findUserByUsername(user.getUsername())).thenReturn(Optional.empty());

        // Expect an exception when calling the method
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> resumeController.getResume(userDetails));

        assertEquals("User not found", exception.getMessage());
        verify(userService).findUserByUsername(user.getUsername());
        verifyNoInteractions(resumeService); // Ensure resumeService is not called
    }

}