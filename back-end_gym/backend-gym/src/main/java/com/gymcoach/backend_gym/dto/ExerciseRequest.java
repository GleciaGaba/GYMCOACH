package com.gymcoach.backend_gym.dto;

import lombok.Data;

@Data
public class ExerciseRequest {
    private String name;
    private String description;
    private String exerciseUrl;
    private Integer muscleGroupId;
} 