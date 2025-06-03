package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String message;
    private String role;
    private String firstName;
    private String lastName;
}

