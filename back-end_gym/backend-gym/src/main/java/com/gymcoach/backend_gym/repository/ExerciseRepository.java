package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    List<Exercise> findByCoachId(Integer coachId);
} 