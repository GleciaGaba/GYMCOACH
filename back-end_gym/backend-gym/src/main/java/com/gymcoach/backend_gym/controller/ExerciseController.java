package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des exercices par les coachs.
 */
@RestController
@RequestMapping("/api/exercises")
@PreAuthorize("hasRole('COACH')")
public class ExerciseController {
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    /**
     * Liste les exercices du coach connecté.
     */
    @GetMapping("/my_exercises")
    public ResponseEntity<List<ExerciseDTO>> getMyExercises(Authentication auth) {
        return ResponseEntity.ok(exerciseService.getExercisesByCoach(auth.getName()));
    }

    /**
     * Crée un nouvel exercice.
     */
    @PostMapping
    public ResponseEntity<ExerciseDTO> createExercise(@Valid @RequestBody ExerciseRequest request, Authentication auth) {
        ExerciseDTO created = exerciseService.createExercise(request, auth.getName());
        return ResponseEntity.status(201).body(created);
    }

    /**
     * Met à jour un exercice existant (par id).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseDTO> updateExercise(@PathVariable Integer id, @Valid @RequestBody ExerciseRequest request, Authentication auth) {
        ExerciseDTO updated = exerciseService.updateExercise(id, request, auth.getName());
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprime un exercice existant (par id).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Integer id, Authentication auth) {
        exerciseService.deleteExercise(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
} 