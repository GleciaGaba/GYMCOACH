package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.ChangePasswordRequest;
import com.gymcoach.backend_gym.dto.RegisterSportifRequest;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.service.MailService;
import com.gymcoach.backend_gym.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final MailService mailService;

    public UserServiceImpl(UserRepository userRepo,
                          PasswordEncoder encoder,
                          MailService mailService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.mailService = mailService;
    }

    @Override
    public void registerSportif(RegisterSportifRequest request, String coachEmail) {
        // Vérifier que le coach existe et a le bon rôle
        User coach = userRepo.findByEmail(coachEmail)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Coach introuvable"
            ));

        if (!"COACH".equals(coach.getRole())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Seuls les coachs peuvent créer un sportif"
            );
        }

        // Vérifier si l'email est déjà utilisé
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email déjà utilisé"
            );
        }

        // Générer un token de vérification
        String verificationToken = UUID.randomUUID().toString();

        // Créer le sportif
        User sportif = User.builder()
            .email(request.getEmail())
            .password(encoder.encode(request.getTemporaryPassword()))
            .role("SPORTIF")
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .isActive(false)
            .passwordChanged(false)
            .verificationToken(verificationToken)
            .tokenExpiry(LocalDateTime.now().plusHours(24))
            .build();

        userRepo.save(sportif);

        // Envoyer l'email de confirmation
        String confirmUrl = "http://localhost:8080/api/auth/confirm?token=" + verificationToken;
        mailService.sendVerificationEmail(sportif.getEmail(), confirmUrl);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Utilisateur introuvable"
            ));

        // Vérifier l'ancien mot de passe
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Mot de passe actuel incorrect"
            );
        }

        // Mettre à jour le mot de passe
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setPasswordChanged(true);
        userRepo.save(user);
    }
} 