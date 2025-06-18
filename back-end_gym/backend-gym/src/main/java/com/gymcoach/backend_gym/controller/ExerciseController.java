package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import com.gymcoach.backend_gym.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des exercices.
 * 
 * Responsabilités :
 * 1. Exposer des endpoints CRUD pour les exercices d'un coach authentifié.
 * 2. Supporter à la fois liste complète et pagination.
 * 3. Séparer la couche présentation (controller) de la couche métier (service).
 */
@RestController
@RequestMapping("/api/v1/exercises")
@CrossOrigin(origins = "*")           // Autorise toutes origines pour la phase de dev
@RequiredArgsConstructor              // Génère un constructeur pour tous les champs finals
public class ExerciseController {

    private final ExerciseService exerciseService;

    /**
     * GET /api/v1/exercises or /api/v1/exercises/my_exercises
     * 
     * Récupère la liste complète des exercices du coach connecté.
     * @param auth l'objet d'authentification fourni par Spring Security
     * @return 200 OK + liste JSON de ExerciseDTO
     */
    @GetMapping({ "", "/my_exercises" })
    public ResponseEntity<List<ExerciseDTO>> getAllForCoach(Authentication auth) {
        // auth est garanti non-null et authentifié grâce aux filtres Spring Security
        List<ExerciseDTO> list = exerciseService.getExercisesByCoach(auth.getName());
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/v1/exercises/page
     * 
     * Récupère une page d'exercices du coach connecté.
     * Utile pour frontends qui consomment par pagination / tri.
     * 
     * @param auth      l'objet d'authentification
     * @param pageable  page, size, sort extraits automatiquement depuis les params ?page, ?size, ?sort
     * @return 200 OK + page JSON de ExerciseDTO
     */
    @GetMapping("/page")
    public ResponseEntity<Page<ExerciseDTO>> getPageForCoach(
            Authentication auth,
            @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        Page<ExerciseDTO> page = exerciseService.getExercisesByCoach(auth.getName(), pageable);
        return ResponseEntity.ok(page);
    }

    /**
     * POST /api/v1/exercises
     * 
     * Crée un nouvel exercice pour le coach connecté.
     * Validation des données via @Valid et annotations dans ExerciseRequest.
     * 
     * @param request payload JSON validé
     * @param auth    l'objet d'authentification
     * @return 201 Created + DTO de l'exercice créé
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExerciseDTO create(
            @Valid @RequestBody ExerciseRequest request,
            Authentication auth
    ) {
        return exerciseService.createExercise(request, auth.getName());
    }

    /**
     * PUT /api/v1/exercises/{id}
     * 
     * Met à jour un exercice existant, si le coach est bien propriétaire.
     * 
     * @param id      ID de l'exercice à mettre à jour
     * @param request payload JSON validé
     * @param auth    l'objet d'authentification
     * @return 200 OK + DTO de l'exercice mis à jour
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody ExerciseRequest request,
            Authentication auth
    ) {
        ExerciseDTO updated = exerciseService.updateExercise(id, request, auth.getName());
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/v1/exercises/{id}
     * 
     * Supprime un exercice si le coach connecté en est le propriétaire.
     * 
     * @param id   ID de l'exercice à supprimer
     * @param auth l'objet d'authentification
     * @return 204 No Content si suppression réussie
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Integer id,
            Authentication auth
    ) {
        exerciseService.deleteExercise(id, auth.getName());
    }

    /**
     * GET /api/v1/exercises/{id}
     * 
     * Récupère un exercice spécifique par son ID, si le coach connecté en est le propriétaire.
     * 
     * @param id   ID de l'exercice à récupérer
     * @param auth l'objet d'authentification
     * @return 200 OK + DTO de l'exercice ou 404 Not Found si non trouvé
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getById(
            @PathVariable Integer id,
            Authentication auth
    ) {
        ExerciseDTO exercise = exerciseService.getExerciseById(id, auth.getName());
        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/coach")
    public ResponseEntity<Page<ExerciseDTO>> getExercisesByCoach(
        Authentication auth,
        @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        Page<ExerciseDTO> page = exerciseService.getExercisesByCoach(auth.getName(), pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/muscle-group/{muscleGroupId}")
    public ResponseEntity<Page<ExerciseDTO>> getExercisesByMuscleGroup(
        Authentication auth,
        @PathVariable Integer muscleGroupId,
        @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        Page<ExerciseDTO> page = exerciseService.getExercisesByMuscleGroup(auth.getName(), muscleGroupId, pageable);
        return ResponseEntity.ok(page);
    }
}
