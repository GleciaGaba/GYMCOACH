package com.gymcoach.backend_gym.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gymcoach.backend_gym.model.Exercise.Difficulty;
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

    @JsonProperty("exerciseUrl")
    private String exerciseUrl;

    private String equipment;
    private String instructions;

    /**
     * Utiliser l'enum Difficulty plutôt qu'une String brute
     * pour garantir l'intégrité des valeurs côté client.
     */
    private Difficulty difficulty;

    @JsonProperty("muscleGroupId")
    private Integer muscleGroupId;

    @JsonProperty("muscleGroupLabel")
    private String muscleGroupLabel;

    private String muscleSubgroup;

    @JsonProperty("coachId")
    private Integer coachId;

    @JsonProperty("coachName")
    private String coachName;

    /**
     * Méthode utilitaire pour construire un DTO à partir de l'entité.
     */
    public static ExerciseDTO fromEntity(com.gymcoach.backend_gym.model.Exercise ex) {
        return ExerciseDTO.builder()
                .id(ex.getId())
                .name(ex.getName())
                .description(ex.getDescription())
                .exerciseUrl(ex.getExerciseUrl())
                .equipment(ex.getEquipment())
                .instructions(ex.getInstructions())
                .difficulty(ex.getDifficulty())
                .muscleGroupId(ex.getMuscleGroup().getId())
                .muscleGroupLabel(ex.getMuscleGroup().getLabel())
                .muscleSubgroup(ex.getMuscleSubgroup())
                .coachId(ex.getCoach().getId())
                .coachName(ex.getCoach().getFirstName()) // ou getFullName()
                .build();
    }
}
