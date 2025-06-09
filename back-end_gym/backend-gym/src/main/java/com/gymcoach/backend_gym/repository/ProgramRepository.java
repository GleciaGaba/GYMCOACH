package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Integer> {
    @Query("SELECT MAX(p.expiresAt) FROM Program p WHERE p.user.id = :userId")
    LocalDateTime findLastProgramExpiresAtByUserId(@Param("userId") Integer userId);
} 