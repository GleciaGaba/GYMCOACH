package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.WorkoutDTO;
import com.gymcoach.backend_gym.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {
    private final WorkoutService workoutService;

    @PostMapping
    public WorkoutDTO createWorkout(@RequestBody WorkoutDTO workoutDTO) {
        return workoutService.createWorkout(workoutDTO);
    }

    @PutMapping("/{id}")
    public WorkoutDTO updateWorkout(@PathVariable Long id, @RequestBody WorkoutDTO workoutDTO) {
        return workoutService.updateWorkout(id, workoutDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
    }

    @GetMapping("/{id}")
    public WorkoutDTO getWorkout(@PathVariable Long id) {
        return workoutService.getWorkout(id);
    }

    @GetMapping
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutService.getAllWorkouts();
    }
} 