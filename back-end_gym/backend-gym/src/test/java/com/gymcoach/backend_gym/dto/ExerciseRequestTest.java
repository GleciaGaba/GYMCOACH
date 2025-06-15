package com.gymcoach.backend_gym.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ExerciseRequestTest {
    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidRequest() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .exerciseUrl("https://example.com/squat")
                .equipment("Barre")
                .instructions("Placez vos pieds à largeur d'épaules")
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();

        Set<ConstraintViolation<ExerciseRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "La requête devrait être valide");
    }

    @Test
    void testInvalidName() {
        ExerciseRequest request = new ExerciseRequest();
        request.setName("ab"); // Nom trop court
        request.setDescription("Description valide");
        request.setMuscleGroupId(1);

        Set<ConstraintViolation<ExerciseRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertEquals("Le nom doit contenir entre 3 et 100 caractères", violations.iterator().next().getMessage());
    }

    @Test
    void testMissingMuscleGroupId() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .build();

        Set<ConstraintViolation<ExerciseRequest>> violations = validator.validate(request);
        assertEquals(1, violations.size());
        assertEquals("Le groupe musculaire est obligatoire", violations.iterator().next().getMessage());
    }

    @Test
    void testInvalidDescriptionLength() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("a".repeat(501)) // Description trop longue
                .exerciseUrl("https://example.com")
                .equipment("Équipement")
                .instructions("Instructions")
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();

        assertEquals(1, validator.validate(request).size(), "La description trop longue devrait être invalide");
    }

    @Test
    void testInvalidExerciseUrlLength() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .exerciseUrl("a".repeat(256)) // URL trop longue
                .equipment("Équipement")
                .instructions("Instructions")
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();

        assertEquals(1, validator.validate(request).size(), "L'URL trop longue devrait être invalide");
    }

    @Test
    void testInvalidEquipmentLength() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .exerciseUrl("https://example.com")
                .equipment("a".repeat(256)) // Équipement trop long
                .instructions("Instructions")
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();

        assertEquals(1, validator.validate(request).size(), "L'équipement trop long devrait être invalide");
    }

    @Test
    void testInvalidInstructionsLength() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .exerciseUrl("https://example.com")
                .equipment("Équipement")
                .instructions("a".repeat(1001)) // Instructions trop longues
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();

        assertEquals(1, validator.validate(request).size(), "Les instructions trop longues devraient être invalides");
    }

    @Test
    void testInvalidDifficultyLength() {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .exerciseUrl("https://example.com")
                .equipment("Équipement")
                .instructions("Instructions")
                .difficulty("a".repeat(51)) // Difficulté trop longue
                .muscleGroupId(1)
                .build();

        assertEquals(1, validator.validate(request).size(), "La difficulté trop longue devrait être invalide");
    }
} 