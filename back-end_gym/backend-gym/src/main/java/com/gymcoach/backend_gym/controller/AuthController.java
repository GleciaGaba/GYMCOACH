package com.gymcoach.backend_gym.controller;

/*import com.gymcoach.backend_gym.dto.AuthRequest;*/
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.dto.LoginRequest;
import com.gymcoach.backend_gym.dto.SignupRequest;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

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
  public ResponseEntity<Void> signupCoach(@Valid @RequestBody SignupRequest req) {
    authService.signupCoach(req);
    // on ne renvoie pas de token ici, juste 201 / Void
    return ResponseEntity.status(201).build();
  }

   /*  @PostMapping("/signup/sportif")
    public ResponseEntity<AuthResponse> signupSportif(
            @Valid @RequestBody SignupRequest req,
            Authentication auth) {
        String token = auth.getCredentials().toString();
        String coachEmail = jwtUtils.getEmailFromToken(token);
        return ResponseEntity.ok(authService.signupSportif(req, coachEmail));
    }*/

    /**
     * Point de terminaison appelé par le lien de confirmation e-mail.
     * Ex : GET /api/auth/confirm?token=abcd1234
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

    @PostMapping("/resend-confirmation")
    public ResponseEntity<Void> resendConfirmation(@RequestParam("email") String email) {
        authService.resendConfirmationEmail(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    return ResponseEntity.ok(authService.login(req));
    }

}
