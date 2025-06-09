package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ExerciseDTO;
import com.gymcoach.backend_gym.dto.ExerciseRequest;
import java.util.List;

/**
 * Service pour la gestion des exercices par les coachs.
 */
public interface ExerciseService {
    /**
     * Récupère la liste des exercices du coach connecté.
     * @param coachEmail l'email du coach
     * @return liste des exercices
     */
    List<ExerciseDTO> getExercisesByCoach(String coachEmail);

    /**
     * Crée un nouvel exercice pour le coach connecté.
     * @param request les infos de l'exercice
     * @param coachEmail l'email du coach
     * @return l'exercice créé
     */
    ExerciseDTO createExercise(ExerciseRequest request, String coachEmail);

    /**
     * Met à jour un exercice existant (appartenant au coach connecté).
     * @param id l'id de l'exercice
     * @param request les nouvelles infos
     * @param coachEmail l'email du coach
     * @return l'exercice mis à jour
     */
    ExerciseDTO updateExercise(Integer id, ExerciseRequest request, String coachEmail);

    /**
     * Supprime un exercice existant (appartenant au coach connecté).
     * @param id l'id de l'exercice
     * @param coachEmail l'email du coach
     */
    void deleteExercise(Integer id, String coachEmail);
} 