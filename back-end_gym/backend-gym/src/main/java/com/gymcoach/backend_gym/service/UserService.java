package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ChangePasswordRequest;
import com.gymcoach.backend_gym.dto.RegisterSportifRequest;

public interface UserService {
    void registerSportif(RegisterSportifRequest request, String coachEmail);
    void changePassword(String email, ChangePasswordRequest request);
} 