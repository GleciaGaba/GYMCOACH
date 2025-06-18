package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.MuscleGroupDTO;
import com.gymcoach.backend_gym.service.MuscleGroupService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des groupes musculaires.
 * Ce contrôleur est essentiel car il permet de :
 * 1. Catégoriser les exercices par groupe musculaire (ex: jambes, dos, pectoraux, etc.)
 * 2. Faciliter la recherche et le filtrage des exercices par groupe musculaire
 * 3. Aider les utilisateurs à organiser leurs entraînements en fonction des muscles ciblés
 * 4. Fournir une structure standardisée pour la classification des exercices
 */
@RestController
@RequestMapping("/api/muscle-groups")
public class MuscleGroupController {
    private final MuscleGroupService muscleGroupService;

    public MuscleGroupController(MuscleGroupService muscleGroupService) {
        this.muscleGroupService = muscleGroupService;
    }

    /**
     * Récupère la liste de tous les groupes musculaires disponibles.
     * Cette endpoint est utilisé pour :
     * - Afficher les groupes musculaires dans l'interface utilisateur
     * - Permettre aux utilisateurs de filtrer les exercices par groupe musculaire
     * - Aider les coaches à catégoriser leurs exercices
     * 
     * Cache activé pour réduire les appels répétés depuis le frontend.
     * 
     * @return ResponseEntity<List<MuscleGroupDTO>> Liste des groupes musculaires avec leurs détails
     */
    @GetMapping
    @Cacheable("muscleGroups")
    public ResponseEntity<List<MuscleGroupDTO>> getAllMuscleGroups() {
        return ResponseEntity.ok(muscleGroupService.getAllMuscleGroups());
    }
} 