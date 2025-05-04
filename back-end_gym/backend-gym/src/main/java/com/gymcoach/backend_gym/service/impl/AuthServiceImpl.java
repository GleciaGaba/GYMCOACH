package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import com.gymcoach.backend_gym.service.MailService;
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
    public AuthResponse signupCoach(AuthRequest req) {
        // 409 si email déjà présent
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(
              HttpStatus.CONFLICT,
              "Email déjà utilisé"
            );
        }
        User coach = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("COACH")
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .build();
        userRepo.save(coach);

        String token = jwtUtils.generateToken(coach.getEmail());
        return new AuthResponse(token, coach.getEmail());
    }

    @Override
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
    }

    @Override
    public AuthResponse login(AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.UNAUTHORIZED,
              "Identifiants invalides"
            ));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
              HttpStatus.UNAUTHORIZED,
              "Identifiants invalides"
            );
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail());
    }
}
