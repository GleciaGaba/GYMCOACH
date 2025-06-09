package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.CoachDTO;
import com.gymcoach.backend_gym.dto.AthleteDTO;
import com.gymcoach.backend_gym.service.CoachService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    private final CoachService coachService;

    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    /**
     * Récupère la liste des coachs d'un sportif
     * Seul le sportif connecté peut voir ses propres coachs
     */
    @GetMapping("/my-coaches")
    @PreAuthorize("hasRole('SPORTIF')")
    public ResponseEntity<List<CoachDTO>> getMyCoaches() {
        return ResponseEntity.ok(coachService.getMyCoaches());
    }

    /**
     * Récupère la liste des sportifs d'un coach
     * Seul le coach connecté peut voir ses propres sportifs
     */
    @GetMapping("/my-athletes")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<List<AthleteDTO>> getMyAthletes() {
        return ResponseEntity.ok(coachService.getMyAthletes());
    }
} 