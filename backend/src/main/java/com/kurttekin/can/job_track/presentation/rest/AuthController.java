package com.kurttekin.can.job_track.presentation.rest;

import com.kurttekin.can.job_track.application.dto.ErrorResponse;
import com.kurttekin.can.job_track.application.dto.UserRegistrationRequest;
import com.kurttekin.can.job_track.application.service.TurnstileVerificationService;
import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.UserService;
import com.kurttekin.can.job_track.domain.service.VerificationService;
import com.kurttekin.can.job_track.infrastructure.security.jwt.JwtProvider;
import com.kurttekin.can.job_track.application.dto.JwtResponse;
import com.kurttekin.can.job_track.application.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private TurnstileVerificationService turnstileVerificationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   @RequestParam String turnstileToken) {
        try {
            // Verify Turnstile token
            boolean isTokenValid = turnstileVerificationService.verifyToken(turnstileToken);
            if (!isTokenValid) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("CAPTCHA failed."));
            }

            User user = userService.findUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Check if the user's email is verified
            if (!user.isVerified()) {
                //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not verified. Please verify your email before logging in.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("Email not verified. Please verify your email before logging in."));
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtProvider.generateToken(authentication);
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (BadCredentialsException ex) {
            SecurityContextHolder.clearContext();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest userRequest,
                                               @RequestParam String turnstileToken) {
        try {
            // Verify Turnstile token
            boolean isTokenValid = turnstileVerificationService.verifyToken(turnstileToken);
            if (!isTokenValid) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("CAPTCHA failed."));
            }
            userService.registerUser(userRequest);
            return ResponseEntity.ok("User registered successfully! Please verify your email before logging in.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public String verifyEmail(@RequestParam("token") String token) {
        boolean isValid = verificationService.verifyUser(token);
        return isValid ? "Email verified successfully. You can now log in." : "Invalid or expired verification token.";
    }
}