package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String message;
    private String role;
    private String firstName;
    private String lastName;
    private Long userId;

    public AuthResponse(String token, String email, String message, String role) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.role = role;
    }

    public AuthResponse(String token, String email, String message, String role, String firstName, String lastName) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

