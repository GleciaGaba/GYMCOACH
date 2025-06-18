package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.model.Exercise;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ExerciseRepository;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.repository.CoachRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ExerciseControllerPaginationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MuscleGroupRepository muscleGroupRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String coachToken;
    private User coach;
    private MuscleGroup muscleGroup;
    private Exercise exercise1;
    private Exercise exercise2;

    @BeforeEach
    void setUp() {
        // Clean up existing data in the correct order to respect foreign key constraints
        exerciseRepository.deleteAll();
        coachRepository.deleteAll();
        muscleGroupRepository.deleteAll();
        userRepository.deleteAll();

        // Create coach
        coach = new User();
        coach.setEmail("coach" + System.currentTimeMillis() + "@test.com");
        coach.setPassword(passwordEncoder.encode("password"));
        coach.setRole("COACH");
        coach.setIsActive(true);
        coach.setFirstName("John");
        coach.setLastName("Doe");
        userRepository.save(coach);

        // Create muscle group
        muscleGroup = new MuscleGroup();
        muscleGroup.setLabel("Jambes");
        muscleGroupRepository.save(muscleGroup);

        // Create exercises
        exercise1 = new Exercise();
        exercise1.setName("Squat");
        exercise1.setDescription("Basic squat exercise");
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        exercise1.setCoach(coach);
        exercise1.setMuscleGroup(muscleGroup);
        exerciseRepository.save(exercise1);

        exercise2 = new Exercise();
        exercise2.setName("Lunges");
        exercise2.setDescription("Basic lunge exercise");
        exercise2.setDifficulty(Exercise.Difficulty.BEGINNER);
        exercise2.setCoach(coach);
        exercise2.setMuscleGroup(muscleGroup);
        exerciseRepository.save(exercise2);

        // Generate JWT token
        coachToken = "Bearer " + jwtUtils.generateToken(coach.getEmail());
    }

    @Test
    void getExercisesByCoach_WithPagination_ShouldReturnPage() throws Exception {
        mockMvc.perform(get("/api/v1/exercises/coach")
                .header("Authorization", coachToken)
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content.length()").value(2))
            .andExpect(jsonPath("$.totalElements").value(2))
            .andExpect(jsonPath("$.content[0].name").value("Squat"))
            .andExpect(jsonPath("$.content[1].name").value("Lunges"));
    }

    @Test
    void getExercisesByMuscleGroup_WithPagination_ShouldReturnPage() throws Exception {
        mockMvc.perform(get("/api/v1/exercises/muscle-group/" + muscleGroup.getId())
                .header("Authorization", coachToken)
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content.length()").value(2))
            .andExpect(jsonPath("$.totalElements").value(2))
            .andExpect(jsonPath("$.content[0].name").value("Squat"))
            .andExpect(jsonPath("$.content[1].name").value("Lunges"));
    }

    @Test
    void getExercisesByMuscleGroup_WithNonExistentMuscleGroup_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/exercises/muscle-group/999")
                .header("Authorization", coachToken)
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isNotFound());
    }

    @Test
    void getExercisesByCoach_WithoutAuth_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/exercises/coach")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isForbidden());
    }

    @Test
    void getExercisesByMuscleGroup_WithoutAuth_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/exercises/muscle-group/" + muscleGroup.getId())
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isForbidden());
    }
} 