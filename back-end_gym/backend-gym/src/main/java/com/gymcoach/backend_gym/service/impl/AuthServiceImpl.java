package com.gymcoach.backend_gym.service.impl;

/*import com.gymcoach.backend_gym.dto.AuthRequest;*/
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.dto.LoginRequest;
import com.gymcoach.backend_gym.dto.SignupRequest;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import com.gymcoach.backend_gym.service.MailService;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final MailService mailService;

    public AuthServiceImpl(UserRepository userRepo,
                           PasswordEncoder encoder,
                           JwtUtils jwtUtils,
                           MailService mailService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.mailService = mailService;
    }

    @Override
    public AuthResponse signupCoach(SignupRequest req) {
        // 409 si email déjà présent
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(
              HttpStatus.CONFLICT,
              "Email déjà utilisé"
            );
        }

        // Génère un token unique
        String rawToken = UUID.randomUUID().toString();
        
        User coach = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("COACH")
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .isActive(false)                   // désactivé tant que non confirmé
            .verificationToken(rawToken)
            .tokenExpiry(LocalDateTime.now().plusHours(24))
            .build();
        userRepo.save(coach);

        String confirmUrl = "http://localhost:8080/api/auth/confirm?token=" + rawToken;
        mailService.sendVerificationEmail(coach.getEmail(), confirmUrl);

        // Pas de JWT à l’inscription
        return new AuthResponse(null, coach.getEmail(), "Un e-mail de confirmation vous a été envoyé.");
    }

   /*  @Override
    public AuthResponse signupSportif(AuthRequest req, String coachEmail) {
        User coach = userRepo.findByEmail(coachEmail)
            .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.NOT_FOUND,
              "Coach introuvable"
            ));

        // 403 si pas un coach
        if (!"COACH".equals(coach.getRole())) {
            throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "Seuls les coachs peuvent créer un sportif"
            );
        }
        // 409 si email déjà présent
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(
              HttpStatus.CONFLICT,
              "Email déjà utilisé"
            );
        }
        User sportif = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("SPORTIF")
            .build();
        userRepo.save(sportif);

        // envoi des identifiants
        mailService.sendCredentials(req.getEmail(), req.getPassword());

        String token = jwtUtils.generateToken(sportif.getEmail());
        return new AuthResponse(token, sportif.getEmail());
    }*/



/**
 * Valide le compte d’un utilisateur via son token de vérification.
 *
 * @param token le token de confirmation reçu par e-mail
 * @throws ResponseStatusException si le token est invalide, déjà utilisé ou expiré
 */
@Override
public void confirmEmail(String token) {
// 1) Recherche de l'utilisateur portant ce token
  User user = userRepo.findByVerificationToken(token)
    .orElseThrow(() -> new ResponseStatusException(
      HttpStatus.BAD_REQUEST, "Token invalide ou déjà utilisé"));

// 2) Vérification de la date d'expiration du token
  if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
    throw new ResponseStatusException(
      HttpStatus.GONE, "Le lien de confirmation a expiré");
  }

  // 3) si le compte est déjà activé
    if (Boolean.TRUE.equals(user.getIsActive())) {
        throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "Votre compte est déjà activé"
        );
    }
  
// 3) Activation du compte et nettoyage des champs liés à la vérification
  user.setIsActive(true);
  user.setVerificationToken(null);
  user.setTokenExpiry(null);
  userRepo.save(user);
}


/**
 * Renvoyer un nouvel e-mail de confirmation à un utilisateur non activé.
 *
 * @param email l’adresse e-mail de l’utilisateur à qui renvoyer le lien de confirmation
 * @throws ResponseStatusException si l’utilisateur n’existe pas (404) ou si le compte est déjà activé (400)
 */
@Override
public void resendConfirmationEmail(String email) {
  // 1. Rechercher l’utilisateur par son e-mail
    User user = userRepo.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Utilisateur introuvable"
        ));
// 2. Vérifier que le compte n’est pas déjà activé
    if (Boolean.TRUE.equals(user.getIsActive())) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Compte déjà activé"
        );
    }
// 3. Générer un nouveau jeton de vérification et définir sa date d’expiration
// Générer un nouveau token + date d’expiration à J+1
    String newToken = UUID.randomUUID().toString();
    LocalDateTime expiry = LocalDateTime.now().plusHours(24);
    user.setVerificationToken(newToken);
    user.setTokenExpiry(expiry);
    userRepo.save(user);

    // 4. Sauvegarder les modifications en base
    // Construire l’URL complète de confirmation
    String confirmUrl = "http://ton-frontend/confirm?token=" + newToken;

    // 6. Envoyer l’e-mail via le service dédié
    mailService.sendVerificationEmail(user.getEmail(), confirmUrl);
}

    @Override
    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.UNAUTHORIZED,
              "Identifiants invalides"
            ));

        //Refuser si compte pas encore activé
        if (!user.getIsActive()) {
              throw new ResponseStatusException(
              HttpStatus.FORBIDDEN,
              "Compte non activé. Vérifiez votre e-mail."
        );
        }

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
              HttpStatus.UNAUTHORIZED,
              "Identifiants invalides"
            );
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), null);
    }
}
