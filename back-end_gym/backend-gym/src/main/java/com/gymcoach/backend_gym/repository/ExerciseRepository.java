// src/main/java/com/gymcoach/backend_gym/repository/ExerciseRepository.java
package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository JPA pour l'entité Exercise.
 * Spring Data crée automatiquement les requêtes grâce aux méthodes nommées.
 */
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    /**
     * Pagination des exercices d'un coach.
     * WHERE id_coach = :coachId
     */
    Page<Exercise> findByCoachId(Integer coachId, Pageable pageable);

    /**
     * Liste complète, sans pagination, des exercices d'un coach.
     */
    java.util.List<Exercise> findAllByCoachId(Integer coachId);

    /**
     * Pagination des exercices filtrés par groupe musculaire.
     * WHERE id_muscle_group = :muscleGroupId
     */
    Page<Exercise> findByMuscleGroup_Id(Integer muscleGroupId, Pageable pageable);

    /**
     * Supprime un exercice si son coach correspond, retourne 0 ou 1.
     */
    long deleteByIdAndCoachId(Integer id, Integer coachId);
}
