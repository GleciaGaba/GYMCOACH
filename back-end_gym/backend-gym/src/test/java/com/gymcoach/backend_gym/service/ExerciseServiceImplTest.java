package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.model.Exercise;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ExerciseRepository;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.service.impl.ExerciseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseServiceImplTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MuscleGroupRepository muscleGroupRepository;

    @InjectMocks
    private ExerciseServiceImpl exerciseService;

    private User mockCoach;
    private MuscleGroup mockMuscleGroup;
    private ExerciseRequest validRequest;

    @BeforeEach
    void setUp() {
        // Créer un coach mock
        mockCoach = User.builder()
                .id(1)
                .email("coach@test.com")
                .build();

        // Créer un groupe musculaire mock
        mockMuscleGroup = MuscleGroup.builder()
                .id(1)
                .label("Jambes")
                .build();

        // Créer une requête valide
        validRequest = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .exerciseUrl("https://example.com/squat")
                .equipment("Barre")
                .instructions("Placez vos pieds à largeur d'épaules")
                .difficulty("Intermédiaire")
                .muscleGroupId(1)
                .build();
    }

    @Test
    void createExercise_WithValidData_ShouldSucceed() {
        // Arrange
        when(userRepository.findByEmail("coach@test.com")).thenReturn(Optional.of(mockCoach));
        when(muscleGroupRepository.findById(1)).thenReturn(Optional.of(mockMuscleGroup));
        when(exerciseRepository.save(any(Exercise.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        var result = exerciseService.createExercise(validRequest, "coach@test.com");

        // Assert
        assertNotNull(result);
        assertEquals("Squat", result.getName());
        assertEquals("Jambes", result.getMuscleGroupLabel());
        verify(exerciseRepository).save(any(Exercise.class));
    }

    @Test
    void createExercise_WithNonExistentCoach_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        var exception = assertThrows(ResponseStatusException.class, () ->
            exerciseService.createExercise(validRequest, "nonexistent@test.com")
        );
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Coach introuvable", exception.getReason());
    }

    @Test
    void createExercise_WithNullMuscleGroupId_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail("coach@test.com")).thenReturn(Optional.of(mockCoach));
        var requestWithoutMuscleGroup = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .build();

        // Act & Assert
        var exception = assertThrows(ResponseStatusException.class, () ->
            exerciseService.createExercise(requestWithoutMuscleGroup, "coach@test.com")
        );
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("L'ID du groupe musculaire est obligatoire", exception.getReason());
    }

    @Test
    void createExercise_WithNonExistentMuscleGroup_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail("coach@test.com")).thenReturn(Optional.of(mockCoach));
        when(muscleGroupRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        var exception = assertThrows(ResponseStatusException.class, () ->
            exerciseService.createExercise(validRequest, "coach@test.com")
        );
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        String reason = exception.getReason();
        assertNotNull(reason, "La raison de l'exception ne devrait pas être null");
        assertTrue(reason.contains("Groupe musculaire avec l'ID 1 introuvable"));
    }

    @Test
    void createExercise_WhenSaveFails_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail("coach@test.com")).thenReturn(Optional.of(mockCoach));
        when(muscleGroupRepository.findById(1)).thenReturn(Optional.of(mockMuscleGroup));
        when(exerciseRepository.save(any(Exercise.class))).thenThrow(new RuntimeException("Erreur de base de données"));

        // Act & Assert
        var exception = assertThrows(ResponseStatusException.class, () ->
            exerciseService.createExercise(validRequest, "coach@test.com")
        );
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        String reason = exception.getReason();
        assertNotNull(reason, "La raison de l'exception ne devrait pas être null");
        assertTrue(reason.contains("Erreur lors de la création de l'exercice"));
    }
} 