// src/main/java/com/gymcoach/backend_gym/dto/ExerciseRequest.java
package com.gymcoach.backend_gym.dto;

import com.gymcoach.backend_gym.model.Exercise.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {

    @NotBlank @Size(min = 2, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Size(max = 255)
    private String exerciseUrl;

    @Size(max = 200)
    private String equipment;

    @Size(max = 2000)
    private String instructions;

    @NotNull(message = "La difficulté est obligatoire")
    private Difficulty difficulty;

    @NotNull(message = "Le groupe musculaire est obligatoire")
    private Integer muscleGroupId;

    @Size(max = 100)
    private String muscleSubgroup;
}
