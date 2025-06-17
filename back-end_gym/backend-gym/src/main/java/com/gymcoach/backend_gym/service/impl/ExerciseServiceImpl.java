// src/main/java/com/gymcoach/backend_gym/service/impl/ExerciseServiceImpl.java
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseDTO> getExercisesByCoach(String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );

        return exerciseRepository.findAllByCoachId(coach.getId()).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseDTO> getExercisesByCoach(String coachEmail, Pageable pageable) {
        User coach = userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );

        return exerciseRepository.findByCoachId(coach.getId(), pageable)
            .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseDTO> getExercisesByMuscleGroup(String coachEmail,
                                                       Integer muscleGroupId,
                                                       Pageable pageable) {
        userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );
        muscleGroupRepository.findById(muscleGroupId)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Muscle group not found")
            );

        return exerciseRepository
            .findByMuscleGroup_Id(muscleGroupId, pageable)
            .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public ExerciseDTO createExercise(ExerciseRequest request, String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );

        if (!"COACH".equals(coach.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Only coaches can create exercises"
            );
        }

        MuscleGroup mg = muscleGroupRepository.findById(request.getMuscleGroupId())
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Muscle group not found")
            );

        // Le builder attend un enum Difficulty, pas une String
        Exercise exercise = Exercise.builder()
            .name(request.getName())
            .description(request.getDescription())
            .difficulty(request.getDifficulty())
            .muscleGroup(mg)
            .muscleSubgroup(request.getMuscleSubgroup())
            .coach(coach)
            .equipment(request.getEquipment())
            .exerciseUrl(request.getExerciseUrl())
            .instructions(request.getInstructions())
            .build();

        return convertToDTO(exerciseRepository.save(exercise));
    }

    @Override
    @Transactional
    public ExerciseDTO updateExercise(Integer id,
                                      ExerciseRequest request,
                                      String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );

        Exercise exercise = exerciseRepository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found")
            );

        if (!exercise.getCoach().getId().equals(coach.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You are not authorized to update this exercise"
            );
        }

        MuscleGroup mg = muscleGroupRepository.findById(request.getMuscleGroupId())
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Muscle group not found")
            );

        // Modification directe : difficulté en enum
        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setMuscleGroup(mg);
        exercise.setMuscleSubgroup(request.getMuscleSubgroup());
        exercise.setEquipment(request.getEquipment());
        exercise.setExerciseUrl(request.getExerciseUrl());
        exercise.setInstructions(request.getInstructions());

        return convertToDTO(exerciseRepository.save(exercise));
    }

    @Override
    @Transactional
    public void deleteExercise(Integer id, String coachEmail) {
        User coach = userRepository.findByEmail(coachEmail)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach not found")
            );

        long deleted = exerciseRepository.deleteByIdAndCoachId(id, coach.getId());
        if (deleted == 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You are not authorized to delete this exercise or it does not exist"
            );
        }
    }

    /** Mapping entité → DTO pour l'API REST */
    ExerciseDTO convertToDTO(Exercise ex) {
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
            .coachName(ex.getCoach().getFirstName() + " " + ex.getCoach().getLastName())
            .build();
    }
}
