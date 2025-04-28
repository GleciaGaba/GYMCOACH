package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Endpoint public pour l'inscription des coachs
     */
    @PostMapping("/signup/coach")
    public ResponseEntity<AuthResponse> signupCoach(@RequestBody AuthRequest req) {
        AuthResponse response = authService.signupCoach(req);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protégé pour la création de comptes sportifs par un coach
     */
    @PostMapping("/signup/sportif")
    public ResponseEntity<AuthResponse> signupSportif(
            @RequestBody AuthRequest req,
            Authentication auth) {
        // Extraction de l'email du coach depuis le token JWT
        String token = auth.getCredentials().toString();
        String coachEmail = jwtUtils.getEmailFromToken(token);
        AuthResponse response = authService.signupSportif(req, coachEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint de connexion pour coachs et sportifs
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }
}

