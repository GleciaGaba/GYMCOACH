package com.gymcoach.backend_gym.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExerciseDTO {
    private Long exerciseId;
    private int repetitions;
    private int series;
    private int pause;
} 