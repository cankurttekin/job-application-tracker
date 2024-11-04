package com.kurttekin.can.job_track.infrastructure.security.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Slf4j
@Configuration
public class CorsConfig {

    @Value("${ALLOWED_ORIGINS:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();

        // Log the allowed origins
        log.info("Allowed Origins: {}", allowedOrigins);

        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        //configuration.addAllowedOrigin("http://localhost:3000");
        //configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "${ALLOWED_ORIGINS}"));
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(","))); // Split the allowed origins
        configuration.setAllowCredentials(true);
        source.registerCorsConfiguration("/**",configuration);

        return source;
    }
}