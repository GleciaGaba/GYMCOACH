package com.gymcoach.backend_gym.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterSportifRequest {
    @NotBlank(message = "Le prénom est requis")
    private String firstName;

    @NotBlank(message = "Le nom est requis")
    private String lastName;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    private String temporaryPassword;
} 