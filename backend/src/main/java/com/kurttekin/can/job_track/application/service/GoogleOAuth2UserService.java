package com.kurttekin.can.job_track.application.service;

import com.kurttekin.can.job_track.domain.model.user.User;
import com.kurttekin.can.job_track.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GoogleOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserService userService; // Declare UserService

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // You can directly access the user attributes from the OAuth2UserRequest
        Map<String, Object> attributes = userRequest.getAdditionalParameters();

        // Extract necessary user info (email, name, etc.) from the attributes
        String email = (String) attributes.get("email");

        // Register or retrieve the user based on the Google login
        User user = userService.registerGoogleUser(email);

        // Create a set of authorities (roles) for the user, wrapping them in SimpleGrantedAuthority
        Set<GrantedAuthority> authorities = Set.of("ROLE_USER")  // Assign a default role to the user
                .stream()
                .map(SimpleGrantedAuthority::new)  // Convert role strings to SimpleGrantedAuthority objects
                .collect(Collectors.toSet());

        // Create a custom OAuth2User with authorities and user attributes
        return new DefaultOAuth2User(authorities, attributes, "email");  // "email" is the key for the principal
    }
}

