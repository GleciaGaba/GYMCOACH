package com.gymcoach.backend_gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.model.Exercise.Difficulty;
import com.gymcoach.backend_gym.model.Coach;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.CoachRepository;
import com.gymcoach.backend_gym.repository.ExerciseRepository;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ExerciseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MuscleGroupRepository muscleGroupRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String coachToken;
    private User coach;
    private MuscleGroup muscleGroup;

    @BeforeEach
    void setUp() {
        // 1) Supprimer d'abord tous les exercices pour lever la contrainte FK vers users
        exerciseRepository.deleteAll();
        // 2) Puis les coaches
        coachRepository.deleteAll();
        // 3) Ensuite les users
        userRepository.deleteAll();
        // 4) Enfin les groupes musculaires
        muscleGroupRepository.deleteAll();

        // Crée un utilisateur COACH
        coach = new User();
        coach.setEmail("coach" + System.currentTimeMillis() + "@test.com");
        coach.setPassword(passwordEncoder.encode("password"));
        coach.setRole("COACH");
        coach.setIsActive(true);
        coach.setFirstName("John");
        coach.setLastName("Doe");
        userRepository.save(coach);

        // Crée l’entrée dans la table Coach
        Coach coachEntity = new Coach();
        coachEntity.setCoach(coach);
        coachRepository.save(coachEntity);

        // Crée un groupe musculaire
        muscleGroup = new MuscleGroup();
        muscleGroup.setLabel("Jambes");
        muscleGroupRepository.save(muscleGroup);

        // Génère le token JWT pour l’authentification
        coachToken = "Bearer " + jwtUtils.generateToken(coach.getEmail());
    }

    @Test
    void createExercise_WithValidData_ShouldSucceed() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .difficulty(Difficulty.INTERMEDIATE)
                .muscleGroupId(muscleGroup.getId())
                .build();

        mockMvc.perform(post("/api/v1/exercises")
                .header("Authorization", coachToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Squat"))
            .andExpect(jsonPath("$.muscleGroupId").value(muscleGroup.getId()));
    }

    @Test
    void createExercise_WithInvalidMuscleGroupId_ShouldReturnNotFound() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .difficulty(Difficulty.INTERMEDIATE)
                .muscleGroupId(999)
                .build();

        mockMvc.perform(post("/api/v1/exercises")
                .header("Authorization", coachToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
    }

    @Test
    void createExercise_WithoutAuth_ShouldReturnForbidden() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .difficulty(Difficulty.INTERMEDIATE)
                .muscleGroupId(muscleGroup.getId())
                .build();

        mockMvc.perform(post("/api/v1/exercises")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }
}
