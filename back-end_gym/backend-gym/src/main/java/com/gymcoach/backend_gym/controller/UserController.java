package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.ChangePasswordRequest;
import com.gymcoach.backend_gym.dto.RegisterSportifRequest;
import com.gymcoach.backend_gym.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST pour la gestion des utilisateurs (sportifs et coachs).
 * Fournit des endpoints pour l'inscription d'un sportif et le changement de mot de passe.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint pour qu'un coach crée un nouveau sportif.
     * Accessible uniquement par un coach authentifié.
     * @param request les informations du sportif à créer
     * @param auth l'objet d'authentification (pour récupérer l'email du coach)
     * @return 201 Created si succès
     */
    @PostMapping("/register-sportif")
    public ResponseEntity<Void> registerSportif(
            @Valid @RequestBody RegisterSportifRequest request,
            Authentication auth) {
        userService.registerSportif(request, auth.getName());
        return ResponseEntity.status(201).build();
    }

    /**
     * Endpoint pour permettre à un utilisateur de changer son mot de passe.
     * @param request les informations nécessaires au changement de mot de passe
     * @param auth l'objet d'authentification (pour récupérer l'email de l'utilisateur)
     * @return 200 OK si succès
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication auth) {
        userService.changePassword(auth.getName(), request);
        return ResponseEntity.ok().build();
    }
} 