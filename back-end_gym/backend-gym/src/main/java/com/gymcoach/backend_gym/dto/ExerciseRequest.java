package com.gymcoach.backend_gym.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, max = 100, message = "Le nom doit contenir entre 3 et 100 caractères")
    private String name;

    @Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    private String description;

    @Size(max = 255, message = "L'URL ne doit pas dépasser 255 caractères")
    private String exerciseUrl;

    @Size(max = 255, message = "L'équipement ne doit pas dépasser 255 caractères")
    private String equipment;

    @Size(max = 1000, message = "Les instructions ne doivent pas dépasser 1000 caractères")
    private String instructions;

    @Size(max = 50, message = "La difficulté ne doit pas dépasser 50 caractères")
    private String difficulty;

    @NotNull(message = "Le groupe musculaire est obligatoire")
    private Integer muscleGroupId;
} 