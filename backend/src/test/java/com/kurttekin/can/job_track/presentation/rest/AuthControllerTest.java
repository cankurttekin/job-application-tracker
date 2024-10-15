package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.JwtResponse;
import com.kurttekin.can.job_track.application.dto.LoginRequest;
import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.infrastructure.security.jwt.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtProvider jwtProvider;

    private LoginRequest loginRequest;
    private UserRegistrationRequest userRegistrationRequest;
    private String token;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        loginRequest = new LoginRequest("testuser", "testpassword");

        userRegistrationRequest = new UserRegistrationRequest("testuser", "testuser@test.com", "testpassword");
        token = "test.jwt.token";
    }

    @Test
    public void testLogin_InvalidCredentials() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());

        // Check that the SecurityContext is still empty
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void testRegisterUser_Success() {
        doNothing().when(userService).registerUser(any(UserRegistrationRequest.class));

        ResponseEntity<String> response = authController.registerUser(userRegistrationRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", response.getBody());
    }

    @Test
    public void testRegisterUser_Failure() {
        doThrow(new RuntimeException("Registration failed")).when(userService).registerUser(any(UserRegistrationRequest.class));

        ResponseEntity<String> response = authController.registerUser(userRegistrationRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Registration failed", response.getBody());
    }

}