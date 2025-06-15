package com.gymcoach.backend_gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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
    private UserRepository userRepository;

    @Autowired
    private MuscleGroupRepository muscleGroupRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private User coach;
    private MuscleGroup muscleGroup;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        // Créer un coach
        coach = User.builder()
                .email("coach@test.com")
                .password("password")
                .firstName("John")
                .lastName("Doe")
                .role("COACH")
                .isActive(true)
                .build();
        userRepository.save(coach);

        // Créer un groupe musculaire
        muscleGroup = MuscleGroup.builder()
                .label("Jambes")
                .build();
        muscleGroupRepository.save(muscleGroup);

        // Générer le token JWT
        jwtToken = jwtUtils.generateToken(coach.getEmail());
    }

    @Test
    void createExercise_WithValidData_ShouldSucceed() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Un exercice de base pour les jambes")
                .exerciseUrl("https://example.com/squat")
                .equipment("Barre")
                .instructions("Placez vos pieds à largeur d'épaules")
                .difficulty("Intermédiaire")
                .muscleGroupId(muscleGroup.getId())
                .build();

        mockMvc.perform(post("/api/exercises")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Squat"))
                .andExpect(jsonPath("$.muscleGroupLabel").value("Jambes"));
    }

    @Test
    void createExercise_WithMissingMuscleGroupId_ShouldReturnBadRequest() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .build();

        mockMvc.perform(post("/api/exercises")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Erreur de validation"))
                .andExpect(jsonPath("$.errors.muscleGroupId").value("Le groupe musculaire est obligatoire"));
    }

    @Test
    void createExercise_WithInvalidMuscleGroupId_ShouldReturnNotFound() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .muscleGroupId(999) // ID inexistant
                .build();

        mockMvc.perform(post("/api/exercises")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Groupe musculaire avec l'ID 999 introuvable"));
    }

    @Test
    void createExercise_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        ExerciseRequest request = ExerciseRequest.builder()
                .name("Squat")
                .description("Description")
                .muscleGroupId(muscleGroup.getId())
                .build();

        mockMvc.perform(post("/api/exercises")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
} 