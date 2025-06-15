package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    @Query("SELECT e FROM Exercise e WHERE e.coach.id = :coachId")
    List<Exercise> findByCoachId(@Param("coachId") Integer coachId);
} 