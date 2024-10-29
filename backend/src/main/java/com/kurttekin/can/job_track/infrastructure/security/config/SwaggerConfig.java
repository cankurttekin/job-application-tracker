package com.kurttekin.can.job_track.infrastructure.security.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("ATSFS Job Application Tracker API")
                        .description("API documentation for ATSFS")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Can Kurttekin")
                                .email("can@kurttekin.com")
                                .url("https://can.kurttekin.com"))
                        .license(new License().name("GPLv3").url("https://www.gnu.org/licenses/gpl-3.0.html")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Dev. Server"),
                        new Server().url("https://api.atsfs.com").description("Production Server")
                ));

    }
}
