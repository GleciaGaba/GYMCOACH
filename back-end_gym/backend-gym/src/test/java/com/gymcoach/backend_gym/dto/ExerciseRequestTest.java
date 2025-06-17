package com.gymcoach.backend_gym.dto;

import com.gymcoach.backend_gym.model.Exercise;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour la validation des contraintes de ExerciseRequest.
 */
class ExerciseRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        // Initialise le validateur Jakarta Bean Validation
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidRequest() {
        // Construction d'une requête valide
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .difficulty(Exercise.Difficulty.INTERMEDIATE)  // Utilisation de l'enum
                .muscleGroupId(1)
                .build();

        // Aucune violation attendue
        var violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "La requête devrait être valide");
    }

    @Test
    void testInvalidName() {
        // Nom trop court (1 caractère alors que min = 2)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("A") 
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "Le nom invalide devrait générer une erreur");
    }

    @Test
    void testMissingMuscleGroupId() {
        // muscleGroupId manquant (NotNull)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "L'absence de muscleGroupId devrait générer une erreur");
    }

    @Test
    void testInvalidDescriptionLength() {
        // Description trop longue (501 > max = 500)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("a".repeat(501))
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "La description trop longue devrait être invalide");
    }

    @Test
    void testInvalidExerciseUrlLength() {
        // exerciseUrl trop longue (256 > max = 255)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .exerciseUrl("http://example.com/" + "a".repeat(240))
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "L'URL trop longue devrait être invalide");
    }

    @Test
    void testInvalidEquipmentLength() {
        // equipment trop long (201 > max = 200)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .equipment("a".repeat(201))
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "L'équipement trop long devrait être invalide");
    }

    @Test
    void testInvalidInstructionsLength() {
        // instructions trop longues (2001 > max = 2000)
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .instructions("a".repeat(2001))
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .build();

        var violations = validator.validate(request);
        assertEquals(1, violations.size(), "Les instructions trop longues devraient être invalides");
    }
}
