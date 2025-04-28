package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;

/**
 * Service d'authentification et de création de comptes
 */
public interface AuthService {

    /**
     * Permet à un coach de s'inscrire
     * @param request DTO contenant email et mot de passe du coach
     * @return AuthResponse contenant le JWT et l'email
     */
    AuthResponse signupCoach(AuthRequest request);

    /**
     * Permet à un coach (authentifié) de créer un compte sportif
     * @param request DTO contenant email et mot de passe du sportif
     * @param coachEmail email du coach créateur
     * @return AuthResponse contenant le JWT et l'email du sportif
     */
    AuthResponse signupSportif(AuthRequest request, String coachEmail);

    /**
     * Authentifie un utilisateur (coach ou sportif)
     * @param request DTO contenant email et mot de passe
     * @return AuthResponse contenant le JWT et l'email
     */
    AuthResponse login(AuthRequest request);
}
