package com.gymcoach.backend_gym.service;

import org.springframework.web.server.ResponseStatusException;

/*import com.gymcoach.backend_gym.dto.AuthRequest;*/
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.dto.LoginRequest;
import com.gymcoach.backend_gym.dto.SignupRequest;

/**
 * Service d'authentification et de création de comptes
 */
public interface AuthService {

    /**
     * Permet à un coach de s'inscrire
     * @param request DTO contenant email et mot de passe du coach
     * @return AuthResponse contenant le JWT et l'email
     */
    AuthResponse signupCoach(SignupRequest request);

    /**
     * Permet à un coach (authentifié) de créer un compte sportif
     * @param request DTO contenant email et mot de passe du sportif
     * @param coachEmail email du coach créateur
     * @return AuthResponse contenant le JWT et l'email du sportif
     */
    /*AuthResponse signupSportif(AuthRequest request, String coachEmail);*/

    /**
     * Authentifie un utilisateur (coach ou sportif)
     * @param request DTO contenant email et mot de passe
     * @return AuthResponse contenant le JWT et l'email
     */
    AuthResponse login(LoginRequest request);
    
    /**
     * Confirme l'adresse e-mail d'un utilisateur en validant le token de vérification.
     * <p>
     * Active le compte si le token est valide et non expiré, puis supprime le token
     * et sa date d'expiration de la base. En cas de token invalide ou expiré,
     * une ResponseStatusException est levée avec le code HTTP approprié.
     *
     * @param token le jeton de vérification envoyé par e-mail
     * @throws ResponseStatusException si le token est invalide (400) ou expiré (410)
     */
    void confirmEmail(String token);

/**
 * Renvoyer un nouvel e-mail de confirmation pour un compte non encore activé.
 *
 * @param email l’adresse e-mail de l’utilisateur concerné
 * @throws ResponseStatusException avec statut 404 si l’utilisateur n’existe pas
 * @throws ResponseStatusException avec statut 400 si le compte est déjà activé
 */
    void resendConfirmationEmail(String email);
}
