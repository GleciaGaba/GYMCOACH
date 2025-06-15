package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MuscleGroupDTO {
    private Integer id;
    private String label;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 