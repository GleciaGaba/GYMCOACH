package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup/coach")
    public ResponseEntity<AuthResponse> signupCoach(@Valid @RequestBody AuthRequest req) {
        AuthResponse resp = authService.signupCoach(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/signup/sportif")
    public ResponseEntity<AuthResponse> signupSportif(
            @Valid @RequestBody AuthRequest req,
            Authentication auth) {
        String token = auth.getCredentials().toString();
        String coachEmail = jwtUtils.getEmailFromToken(token);
        return ResponseEntity.ok(authService.signupSportif(req, coachEmail));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
