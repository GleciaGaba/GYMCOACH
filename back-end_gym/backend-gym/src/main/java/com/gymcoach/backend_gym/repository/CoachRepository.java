package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Integer> {
    @Query("SELECT c FROM Coach c WHERE c.coach.id = :coachId")
    List<Coach> findByCoachId(@Param("coachId") Integer coachId);
    
    @Query("SELECT c FROM Coach c WHERE c.athlete.id = :athleteId")
    List<Coach> findByAthleteId(@Param("athleteId") Integer athleteId);
} 