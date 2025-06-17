// src/main/java/com/gymcoach/backend_gym/service/ExerciseService.java
package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service qui gère toute la logique métier autour des exercices.
 * On utilise exclusivement des DTO pour séparer entités JPA et API.
 */
public interface ExerciseService {

    /**
     * Récupère la liste complète d'exercices pour un coach, sans pagination.
     * @param coachEmail l'email du coach (identifiant unique)
     * @return liste de DTO prêts à retourner en JSON
     */
    List<ExerciseDTO> getExercisesByCoach(String coachEmail);

    /**
     * Récupère une page d'exercices pour un coach donné.
     * Utile pour l'affichage paginé et le tri en front-end.
     * @param coachEmail email du coach
     * @param pageable   informations de pagination (page, taille, tri)
     * @return page de DTO d'exercice
     */
    Page<ExerciseDTO> getExercisesByCoach(String coachEmail, Pageable pageable);

    /**
     * Récupère une page d'exercices filtrés par groupe musculaire pour un coach.
     * @param coachEmail     email du coach
     * @param muscleGroupId  ID du groupe musculaire à filtrer
     * @param pageable       pagination/tri
     * @return page de DTO d'exercice filtrés
     */
    Page<ExerciseDTO> getExercisesByMuscleGroup(String coachEmail,
                                                Integer muscleGroupId,
                                                Pageable pageable);

    /**
     * Crée un nouvel exercice lié au coach.
     * @param request    données de création validées (@Valid)
     * @param coachEmail email du coach (déduit de l’authentification)
     * @return DTO de l'exercice créé
     */
    ExerciseDTO createExercise(ExerciseRequest request, String coachEmail);

    /**
     * Met à jour un exercice existant, si le coach y a droit.
     * @param id           ID de l'exercice à modifier
     * @param request      nouvelles données validées
     * @param coachEmail   email du coach (droits d'édition)
     * @return DTO de l'exercice mis à jour
     */
    ExerciseDTO updateExercise(Integer id,
                               ExerciseRequest request,
                               String coachEmail);

    /**
     * Supprime un exercice si le coach possède bien l'exercice.
     * @param id         ID de l'exercice à supprimer
     * @param coachEmail email du coach (droits de suppression)
     */
    void deleteExercise(Integer id, String coachEmail);
}
