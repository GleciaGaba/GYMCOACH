package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import com.gymcoach.backend_gym.service.MailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        User coach = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("COACH")
            .build();
        userRepo.save(coach);
        String token = jwtUtils.generateToken(coach.getEmail());
        return new AuthResponse(token, coach.getEmail());
    }

    @Override
    public AuthResponse signupSportif(AuthRequest req, String coachEmail) {
        User coach = userRepo.findByEmail(coachEmail)
            .orElseThrow(() -> new RuntimeException("Coach introuvable"));
        if (!"COACH".equals(coach.getRole())) {
            throw new RuntimeException("Seuls les coachs peuvent créer un sportif");
        }
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        User sportif = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("SPORTIF")
            .build();
        userRepo.save(sportif);
        // Envoie des identifiants par email
        mailService.sendCredentials(req.getEmail(), req.getPassword());
        String token = jwtUtils.generateToken(sportif.getEmail());
        return new AuthResponse(token, sportif.getEmail());
    }

    @Override
    public AuthResponse login(AuthRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Identifiants invalides");
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail());
    }
}