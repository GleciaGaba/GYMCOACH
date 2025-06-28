package com.gymcoach.backend_gym.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutDTO {
    private Long id;
    private String name;
    private String muscleGroups;
    private String workoutDescription;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<WorkoutExerciseDTO> exercises;
} 