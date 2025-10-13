package com.kurttekin.can.job_track.infrastructure.security.jwt;

import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtProvider {

    private SecretKey secretKey = Jwts.SIG.HS256.key().build();

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        Date now = new Date();
        Date expire = new Date(now.getTime() + jwtExpirationInMs);
        log.info("Creating JWT for user: " + authentication.getName());
        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(new Date())
                .expiration(expire)
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().
                    verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            log.error("Could not validate JWT - {}", ex);

        }
        return false;
    }
}
