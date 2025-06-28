package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
} 