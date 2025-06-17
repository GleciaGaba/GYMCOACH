package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pour gérer les opérations CRUD sur les groupes musculaires.
 * Hérite de JpaRepository, ce qui fournit :
 *  - findAll(), findById(), save(), deleteById(), etc.
 * 
 * Méthodes personnalisées ajoutées ci-dessous pour répondre à des besoins courants.
 */
@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroup, Integer> {

    /**
     * Récupère un groupe musculaire à partir de son label unique.
     * Utile si tu veux vérifier l'existence d'un groupe avant de l'enregistrer,
     * ou pour pouvoir le retrouver côté service sans connaître son ID.
     *
     * @param label le nom du groupe musculaire (ex : "jambes", "pectoraux")
     * @return un Optional contenant le MuscleGroup s'il existe
     */
    Optional<MuscleGroup> findByLabel(String label);
}
