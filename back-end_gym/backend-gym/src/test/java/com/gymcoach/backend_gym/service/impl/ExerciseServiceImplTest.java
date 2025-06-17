package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
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
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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

    private User coach;
    private MuscleGroup muscleGroup;
    private Exercise exercise;
    private ExerciseRequest exerciseRequest;

    @BeforeEach
    void setUp() {
        coach = new User();
        coach.setId(1);
        coach.setEmail("coach@test.com");
        coach.setRole("COACH");
        coach.setFirstName("John");
        coach.setLastName("Doe");

        muscleGroup = new MuscleGroup();
        muscleGroup.setId(1);
        muscleGroup.setLabel("Jambes");

        exercise = new Exercise();
        exercise.setId(1);
        exercise.setName("Squat");
        exercise.setCoach(coach);
        exercise.setMuscleGroup(muscleGroup);
        exercise.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        exercise.setDescription("Un exercice de base pour les jambes");
        exercise.setExerciseUrl("http://example.com/exercise");
        exercise.setEquipment("Barbell");
        exercise.setInstructions("Step by step instructions");

        exerciseRequest = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .difficulty(Exercise.Difficulty.INTERMEDIATE)
                .muscleGroupId(1)
                .exerciseUrl("http://example.com/exercise")
                .equipment("Barbell")
                .instructions("Step by step instructions")
                .build();
    }

    @Test
    void getExercisesByCoach_ShouldReturnExercises() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.findAllByCoachId(coach.getId()))
            .thenReturn(Arrays.asList(exercise));

        List<ExerciseDTO> result = exerciseService.getExercisesByCoach(coach.getEmail());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(exercise.getName(), result.get(0).getName());
    }

    @Test
    void getExercisesByCoach_WithNonExistentCoach_ShouldThrowException() {
        when(userRepository.findByEmail(anyString()))
            .thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.getExercisesByCoach("nonexistent@test.com"));

        assertTrue(ex.getMessage().contains("404 NOT_FOUND \"Coach not found\""));
    }

    @Test
    void getExercisesByCoach_WithPagination_ShouldReturnPage() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Exercise> exercisePage = new PageImpl<>(Arrays.asList(exercise));
        
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.findByCoachId(coach.getId(), pageable))
            .thenReturn(exercisePage);

        // When
        Page<ExerciseDTO> result = exerciseService.getExercisesByCoach(coach.getEmail(), pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(exercise.getName(), result.getContent().get(0).getName());
    }

    @Test
    void createExercise_WithValidData_ShouldSucceed() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(muscleGroupRepository.findById(muscleGroup.getId()))
            .thenReturn(Optional.of(muscleGroup));
        when(exerciseRepository.save(any(Exercise.class)))
            .thenReturn(exercise);

        ExerciseDTO result = exerciseService.createExercise(exerciseRequest, coach.getEmail());

        assertNotNull(result);
        assertEquals(exercise.getName(), result.getName());
        verify(exerciseRepository).save(any(Exercise.class));
    }

    @Test
    void createExercise_WithNonExistentCoach_ShouldThrowException() {
        when(userRepository.findByEmail(anyString()))
            .thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.createExercise(exerciseRequest, "nonexistent@test.com"));

        assertTrue(ex.getMessage().contains("404 NOT_FOUND \"Coach not found\""));
    }

    @Test
    void createExercise_WithNonExistentMuscleGroup_ShouldThrowException() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(muscleGroupRepository.findById(anyInt()))
            .thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.createExercise(exerciseRequest, coach.getEmail()));

        assertTrue(ex.getMessage().contains("404 NOT_FOUND \"Muscle group not found\""));
    }

    @Test
    void updateExercise_WithValidData_ShouldSucceed() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.findById(exercise.getId()))
            .thenReturn(Optional.of(exercise));
        when(muscleGroupRepository.findById(muscleGroup.getId()))
            .thenReturn(Optional.of(muscleGroup));
        when(exerciseRepository.save(any(Exercise.class)))
            .thenReturn(exercise);

        ExerciseDTO result = exerciseService.updateExercise(exercise.getId(), exerciseRequest, coach.getEmail());

        assertNotNull(result);
        assertEquals(exercise.getName(), result.getName());
        verify(exerciseRepository).save(any(Exercise.class));
    }

    @Test
    void updateExercise_WithNonExistentExercise_ShouldThrowException() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.findById(anyInt()))
            .thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.updateExercise(999, exerciseRequest, coach.getEmail()));

        assertTrue(ex.getMessage().contains("404 NOT_FOUND \"Exercise not found\""));
    }

    @Test
    void updateExercise_WithUnauthorizedCoach_ShouldThrowException() {
        User otherCoach = new User();
        otherCoach.setId(2);
        otherCoach.setEmail("other@test.com");
        otherCoach.setRole("COACH");

        when(userRepository.findByEmail(otherCoach.getEmail()))
            .thenReturn(Optional.of(otherCoach));
        when(exerciseRepository.findById(exercise.getId()))
            .thenReturn(Optional.of(exercise));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.updateExercise(exercise.getId(), exerciseRequest, otherCoach.getEmail()));

        assertTrue(ex.getMessage().contains("403 FORBIDDEN \"You are not authorized to update this exercise\""));
    }

    @Test
    void deleteExercise_WithValidData_ShouldSucceed() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.deleteByIdAndCoachId(exercise.getId(), coach.getId()))
            .thenReturn(1L);

        assertDoesNotThrow(() -> exerciseService.deleteExercise(exercise.getId(), coach.getEmail()));
        verify(exerciseRepository).deleteByIdAndCoachId(exercise.getId(), coach.getId());
    }

    @Test
    void deleteExercise_WithNonExistentExercise_ShouldThrowException() {
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(exerciseRepository.deleteByIdAndCoachId(anyInt(), eq(coach.getId())))
            .thenReturn(0L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.deleteExercise(999, coach.getEmail()));

        assertTrue(ex.getMessage().contains("403 FORBIDDEN"));
    }

    @Test
    void deleteExercise_WithUnauthorizedCoach_ShouldThrowException() {
        User otherCoach = new User();
        otherCoach.setId(2);
        otherCoach.setEmail("other@test.com");
        otherCoach.setRole("COACH");

        when(userRepository.findByEmail(otherCoach.getEmail()))
            .thenReturn(Optional.of(otherCoach));
        when(exerciseRepository.deleteByIdAndCoachId(exercise.getId(), otherCoach.getId()))
            .thenReturn(0L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.deleteExercise(exercise.getId(), otherCoach.getEmail()));

        assertTrue(ex.getMessage().contains("403 FORBIDDEN"));
    }

    @Test
    void getExercisesByMuscleGroup_WithPagination_ShouldReturnPage() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Exercise> exercisePage = new PageImpl<>(Arrays.asList(exercise));
        
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(muscleGroupRepository.findById(muscleGroup.getId()))
            .thenReturn(Optional.of(muscleGroup));
        when(exerciseRepository.findByMuscleGroup_Id(muscleGroup.getId(), pageable))
            .thenReturn(exercisePage);

        // When
        Page<ExerciseDTO> result = exerciseService.getExercisesByMuscleGroup(
            coach.getEmail(), 
            muscleGroup.getId(), 
            pageable
        );

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(exercise.getName(), result.getContent().get(0).getName());
    }

    @Test
    void getExercisesByMuscleGroup_WithNonExistentMuscleGroup_ShouldThrowException() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        
        when(userRepository.findByEmail(coach.getEmail()))
            .thenReturn(Optional.of(coach));
        when(muscleGroupRepository.findById(anyInt()))
            .thenReturn(Optional.empty());

        // When/Then
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
            () -> exerciseService.getExercisesByMuscleGroup(coach.getEmail(), 999, pageable));

        assertTrue(ex.getMessage().contains("404 NOT_FOUND \"Muscle group not found\""));
    }

    @Test
    void convertToDTO_ShouldIncludeAllFields() {
        // When
        ExerciseDTO dto = exerciseService.convertToDTO(exercise);

        // Then
        assertNotNull(dto);
        assertEquals(exercise.getName(), dto.getName());
        assertEquals(exercise.getDescription(), dto.getDescription());
        assertEquals(exercise.getExerciseUrl(), dto.getExerciseUrl());
        assertEquals(exercise.getEquipment(), dto.getEquipment());
        assertEquals(exercise.getInstructions(), dto.getInstructions());
        assertEquals(exercise.getDifficulty(), dto.getDifficulty());
        assertEquals(exercise.getMuscleGroup().getId(), dto.getMuscleGroupId());
        assertEquals(exercise.getMuscleGroup().getLabel(), dto.getMuscleGroupLabel());
        assertEquals(exercise.getMuscleSubgroup(), dto.getMuscleSubgroup());
        assertEquals(exercise.getCoach().getId(), dto.getCoachId());
        assertEquals(
            exercise.getCoach().getFirstName() + " " + exercise.getCoach().getLastName(),
            dto.getCoachName()
        );
    }
}
