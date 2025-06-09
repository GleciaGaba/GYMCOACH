package com.gymcoach.backend_gym.controller;

/*import com.gymcoach.backend_gym.dto.AuthRequest;*/
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.dto.LoginRequest;
import com.gymcoach.backend_gym.dto.SignupRequest;
import com.gymcoach.backend_gym.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

/**
 * Contrôleur REST pour la gestion de l'authentification et de l'inscription.
 * Fournit des endpoints pour l'inscription, la confirmation d'email, la connexion, etc.
 */
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint pour l'inscription d'un coach.
     * @param req les informations d'inscription du coach
     * @return 201 Created si succès
     */
    @PostMapping("/signup/coach")
    public ResponseEntity<Void> signupCoach(@Valid @RequestBody SignupRequest req) {
        authService.signupCoach(req);
        // on ne renvoie pas de token ici, juste 201 / Void
        return ResponseEntity.status(201).build();
    }



    /**
     * Endpoint appelé par le lien de confirmation e-mail.
     * Redirige vers la page de login si succès, sinon vers une page d'erreur.
     * @param token le token de confirmation reçu par e-mail
     * @return une redirection HTTP
     */
    @GetMapping("/confirm")
    public RedirectView confirmEmail(@RequestParam("token") String token) {
        try {
            authService.confirmEmail(token);
            // si tout s'est bien passé → page de login
            return new RedirectView("http://localhost:5173/coach");
        } catch (ResponseStatusException ex) {
            // pour tous les cas d'erreur (token invalide, expiré, compte déjà activé…)
            // on redirige vers une page générique "bad request"
            return new RedirectView("http://localhost:5173/resend-confirmation");
        }
    }

    /**
     * Endpoint pour confirmer un compte via un token (appelé côté front après réception du token).
     * @param request map contenant le token
     * @return 200 OK si succès, 400 si token absent
     */
    @PostMapping("/confirm-account")
    public ResponseEntity<Void> confirmAccount(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }
        authService.confirmEmail(token);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint pour renvoyer un e-mail de confirmation à un utilisateur.
     * @param email l'adresse e-mail de l'utilisateur
     * @return 204 No Content si succès
     */
    @PostMapping("/resend-confirmation")
    public ResponseEntity<Void> resendConfirmation(@RequestParam("email") String email) {
        authService.resendConfirmationEmail(email);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint pour la connexion d'un utilisateur (coach ou sportif).
     * @param req les informations de connexion (email, mot de passe)
     * @return AuthResponse contenant le JWT et l'email
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    return ResponseEntity.ok(authService.login(req));
    }

}
