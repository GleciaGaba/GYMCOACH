package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.WorkoutDTO;
import com.gymcoach.backend_gym.dto.WorkoutExerciseDTO;
import com.gymcoach.backend_gym.model.Workout;
import com.gymcoach.backend_gym.model.WorkoutExercise;
import com.gymcoach.backend_gym.repository.WorkoutRepository;
import com.gymcoach.backend_gym.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {
    private final WorkoutRepository workoutRepository;

    @Override
    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO) {
        Workout workout = mapToEntity(workoutDTO);
        Workout saved = workoutRepository.save(workout);
        return mapToDTO(saved);
    }

    @Override
    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
        Optional<Workout> optionalWorkout = workoutRepository.findById(id);
        if (optionalWorkout.isEmpty()) {
            throw new RuntimeException("Workout not found");
        }
        Workout workout = mapToEntity(workoutDTO);
        workout.setId(id);
        Workout updated = workoutRepository.save(workout);
        return mapToDTO(updated);
    }

    @Override
    public void deleteWorkout(Long id) {
        workoutRepository.deleteById(id);
    }

    @Override
    public WorkoutDTO getWorkout(Long id) {
        return workoutRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
    }

    @Override
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- Mapping methods ---
    private WorkoutDTO mapToDTO(Workout workout) {
        return WorkoutDTO.builder()
                .id(workout.getId())
                .name(workout.getName())
                .muscleGroups(workout.getMuscleGroups())
                .workoutDescription(workout.getWorkoutDescription())
                .createdAt(workout.getCreatedAt() != null ? workout.getCreatedAt().toLocalDateTime() : null)
                .updatedAt(workout.getUpdatedAt() != null ? workout.getUpdatedAt().toLocalDateTime() : null)
                .exercises(workout.getExercises() != null ? workout.getExercises().stream()
                        .map(this::mapExerciseToDTO)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    private WorkoutExerciseDTO mapExerciseToDTO(WorkoutExercise ex) {
        return WorkoutExerciseDTO.builder()
                .exerciseId(ex.getExerciseId())
                .repetitions(ex.getRepetitions())
                .series(ex.getSeries())
                .pause(ex.getPause())
                .build();
    }

    private Workout mapToEntity(WorkoutDTO dto) {
        Workout workout = new Workout();
        workout.setId(dto.getId());
        workout.setName(dto.getName());
        workout.setMuscleGroups(dto.getMuscleGroups());
        workout.setWorkoutDescription(dto.getWorkoutDescription());
        workout.setCreatedAt(dto.getCreatedAt() != null ? Timestamp.valueOf(dto.getCreatedAt()) : null);
        workout.setUpdatedAt(dto.getUpdatedAt() != null ? Timestamp.valueOf(dto.getUpdatedAt()) : null);
        if (dto.getExercises() != null) {
            List<WorkoutExercise> exercises = dto.getExercises().stream()
                    .map(exDto -> {
                        WorkoutExercise ex = WorkoutExercise.builder()
                                .exerciseId(exDto.getExerciseId())
                                .repetitions(exDto.getRepetitions())
                                .series(exDto.getSeries())
                                .pause(exDto.getPause())
                                .workout(workout)
                                .build();
                        return ex;
                    })
                    .collect(Collectors.toList());
            workout.setExercises(exercises);
        }
        return workout;
    }
} 