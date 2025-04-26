package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.AuthRequest;
import com.gymcoach.backend_gym.dto.AuthResponse;

public interface AuthService {
    AuthResponse signup(AuthRequest request);
    AuthResponse login(AuthRequest request);
}

