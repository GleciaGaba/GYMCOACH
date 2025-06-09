package com.gymcoach.backend_gym.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ExerciseDTO {
    private Integer id;
    private String name;
    private String description;
    private String exerciseUrl;
    private String muscleGroupLabel;
} 