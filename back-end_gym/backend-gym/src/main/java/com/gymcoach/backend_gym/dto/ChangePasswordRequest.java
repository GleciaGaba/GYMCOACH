package com.gymcoach.backend_gym.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;

    @NotBlank @Size(min = 12, message = "Le nouveau mot de passe doit contenir au moins 12 caractères")
    private String newPassword;
} 