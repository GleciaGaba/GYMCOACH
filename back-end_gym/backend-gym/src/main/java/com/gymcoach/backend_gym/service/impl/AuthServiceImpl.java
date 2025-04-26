package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(UserRepository userRepo,
                           PasswordEncoder encoder,
                           JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AuthResponse signup(AuthRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        User user = User.builder()
            .email(req.getEmail())
            .password(encoder.encode(req.getPassword()))
            .role("SPORTIF")  // ou logique pour coach/admin
            .build();
        userRepo.save(user);

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail());
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

