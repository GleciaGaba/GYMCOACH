package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private Integer id;
    private String name;
    private String description;
    private String exerciseUrl;
    private String equipment;
    private String instructions;
    private String difficulty;
    private String muscleGroupLabel;
} 