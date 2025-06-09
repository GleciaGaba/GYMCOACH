package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Integer> {
    List<Coach> findByCoachId(Integer coachId);
    List<Coach> findByAthleteId(Integer athleteId);
} 