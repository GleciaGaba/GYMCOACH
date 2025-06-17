package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MuscleGroupDTO {
    private Integer id;
    private String label;
    private String description;
} 