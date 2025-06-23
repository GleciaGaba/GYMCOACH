package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    
    @NotBlank(message = "Le contenu du message ne peut pas être vide")
    private String content;
    
    @NotNull(message = "L'ID du destinataire est requis")
    private String receiverId; // ID de l'utilisateur qui va recevoir le message
} 