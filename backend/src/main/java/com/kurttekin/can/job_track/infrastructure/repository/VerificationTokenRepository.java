package com.kurttekin.can.job_track.infrastructure.repository;

import com.kurttekin.can.job_track.domain.model.user.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
}
