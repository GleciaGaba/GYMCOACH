package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.WorkoutDTO;
import java.util.List;

public interface WorkoutService {
    WorkoutDTO createWorkout(WorkoutDTO workoutDTO);
    WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO);
    void deleteWorkout(Long id);
    WorkoutDTO getWorkout(Long id);
    List<WorkoutDTO> getAllWorkouts();
} 