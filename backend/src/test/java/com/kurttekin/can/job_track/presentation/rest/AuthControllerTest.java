package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.ErrorResponse;
import com.kurttekin.can.job_track.application.dto.JwtResponse;
import com.kurttekin.can.job_track.application.dto.LoginRequest;
import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;
import com.kurttekin.can.job_track.application.service.EmailService;
import com.kurttekin.can.job_track.application.service.TurnstileVerificationService;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.infrastructure.security.jwt.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @Mock
    private TurnstileVerificationService turnstileVerificationService;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private Authentication authentication;

    private LoginRequest loginRequest;
    private UserRegistrationRequest userRegistrationRequest;
    private String token;
    private String turnstileToken;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        loginRequest = new LoginRequest("testuser", "testpassword");

        userRegistrationRequest = new UserRegistrationRequest("testuser", "testuser@test.com", "testpassword");
        //token = "test.jwt.token";
        turnstileToken= "test.jwt.turnstile";
    }

    // === Login tests ===
    @Test
    public void testLogin_Success() {
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);
        User user = new User();
        user.setVerified(true);

        when(userService.findUserByUsername(loginRequest.getUsername())).thenReturn(Optional.of(user));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtProvider.generateToken(authentication)).thenReturn("jwtToken");

        ResponseEntity<?> response = authController.login(loginRequest, turnstileToken);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("jwtToken", ((JwtResponse) Objects.requireNonNull(response.getBody())).getToken());
    }

    @Test
    public void testLogin_InvalidCredentials() {
        // Mock Turnstile verification logic
        //when(turnstileVerificationService.verifyToken(anyString())).thenReturn(true);
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        ResponseEntity<?> response = authController.login(loginRequest, turnstileToken);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody());

        // Check that the SecurityContext is still empty
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void testLogin_CAPTCHAFailed() {
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(false);

        ResponseEntity<?> response = authController.login(loginRequest, turnstileToken);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("CAPTCHA failed.", ((ErrorResponse) Objects.requireNonNull(response.getBody())).getMessage());
    }

    @Test
    public void testLogin_EmailNotVerified() {
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);
        User user = new User();
        user.setEmail("test@test.com");
        user.setVerified(false);

        when(userService.findUserByUsername(loginRequest.getUsername())).thenReturn(Optional.of(user));
        ResponseEntity<?> response = authController.login(loginRequest, turnstileToken);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Email not verified. Please verify your email before logging in.", ((ErrorResponse) Objects.requireNonNull(response.getBody())).getMessage());

        // Never call jwtProvider.generateToken
        verify(jwtProvider, never()).generateToken(any(Authentication.class));
    }

    // === Register tests ===
    @Test
    public void testRegisterUser_Success() {
        // Mock the behavior of the service method
        doNothing().when(userService).registerUser(any(UserRegistrationRequest.class));
        doNothing().when(emailService).sendVerificationEmail(anyString(),anyString(), anyString()); // Mock email sending

        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);

        // Call the registerUser method in the controller
        ResponseEntity<?> response = authController.registerUser(userRegistrationRequest, turnstileToken);

        // Check the status and response body
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully! Please verify your email before logging in.", response.getBody());
    }

    @Test
    public void testRegisterUser_CAPTCHAFailed() {
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(false);

        ResponseEntity<?> response = authController.registerUser(userRegistrationRequest, turnstileToken);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("CAPTCHA failed.", ((ErrorResponse) Objects.requireNonNull(response.getBody())).getMessage());
    }

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);
        doThrow(new RuntimeException("Email already exists")).when(userService).registerUser(any(UserRegistrationRequest.class));

        ResponseEntity<?> response = authController.registerUser(userRegistrationRequest, turnstileToken);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());

    }

    @Test
    public void testRegisterUser_Failure() {
        doThrow(new RuntimeException("Registration failed")).when(userService).registerUser(any(UserRegistrationRequest.class));

        when(turnstileVerificationService.verifyToken(turnstileToken)).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(userRegistrationRequest, turnstileToken);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Registration failed", response.getBody());
    }
}