package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.model.Exercise;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ExerciseRepository;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.service.ExerciseService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImpl implements ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final MuscleGroupRepository muscleGroupRepository;

    public ExerciseServiceImpl(ExerciseRepository exerciseRepository, UserRepository userRepository, MuscleGroupRepository muscleGroupRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.muscleGroupRepository = muscleGroupRepository;
    }

    /**
     * Récupère la liste des exercices du coach connecté.
     */
    @Override
    public List<ExerciseDTO> getExercisesByCoach(String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach introuvable"));
        return exerciseRepository.findByCoachId(coach.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crée un nouvel exercice pour le coach connecté.
     */
    @Override
    public ExerciseDTO createExercise(ExerciseRequest request, String coachEmail) {
        // Vérifier que le coach existe
        User coach = userRepository.findByEmail(coachEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach introuvable"));

        // Vérifier que le groupe musculaire existe
        if (request.getMuscleGroupId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'ID du groupe musculaire est obligatoire");
        }

        MuscleGroup muscleGroup = muscleGroupRepository.findById(request.getMuscleGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    String.format("Groupe musculaire avec l'ID %d introuvable", request.getMuscleGroupId())));

        // Créer l'exercice
        Exercise exercise = Exercise.builder()
                .name(request.getName())
                .description(request.getDescription())
                .exerciseUrl(request.getExerciseUrl())
                .equipment(request.getEquipment())
                .instructions(request.getInstructions())
                .difficulty(request.getDifficulty())
                .muscleGroup(muscleGroup)
                .coach(coach)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        try {
            exerciseRepository.save(exercise);
            return toDTO(exercise);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la création de l'exercice: " + e.getMessage());
        }
    }

    /**
     * Met à jour un exercice existant (appartenant au coach connecté).
     */
    @Override
    public ExerciseDTO updateExercise(Integer id, ExerciseRequest request, String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach introuvable"));
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercice introuvable"));
        if (!exercise.getCoach().getId().equals(coach.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez modifier que vos propres exercices");
        }
        MuscleGroup muscleGroup = muscleGroupRepository.findById(request.getMuscleGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe musculaire introuvable"));
        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setExerciseUrl(request.getExerciseUrl());
        exercise.setEquipment(request.getEquipment());
        exercise.setInstructions(request.getInstructions());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setMuscleGroup(muscleGroup);
        exercise.setUpdatedAt(LocalDateTime.now());
        exerciseRepository.save(exercise);
        return toDTO(exercise);
    }

    /**
     * Supprime un exercice existant (appartenant au coach connecté).
     */
    @Override
    public void deleteExercise(Integer id, String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach introuvable"));
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercice introuvable"));
        if (!exercise.getCoach().getId().equals(coach.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez supprimer que vos propres exercices");
        }
        exerciseRepository.delete(exercise);
    }

    /**
     * Convertit une entité Exercise en DTO.
     */
    private ExerciseDTO toDTO(Exercise exercise) {
        return ExerciseDTO.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .exerciseUrl(exercise.getExerciseUrl())
                .equipment(exercise.getEquipment())
                .instructions(exercise.getInstructions())
                .difficulty(exercise.getDifficulty())
                .muscleGroupLabel(exercise.getMuscleGroup() != null ? exercise.getMuscleGroup().getLabel() : null)
                .build();
    }
} 