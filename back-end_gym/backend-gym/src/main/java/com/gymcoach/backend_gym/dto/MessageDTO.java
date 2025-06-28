package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    
    private String id;
    private String chatId;
    private String authorId; // Backward compatibility
    private String senderId; // Frontend expectation - ID of the sender
    private String receiverId; // Frontend expectation - ID of the receiver
    private String content;
    private boolean isRead;
    private LocalDateTime createdAt;
    
    // Informations supplémentaires pour l'affichage
    private String authorName; // Nom de l'expéditeur
    private String authorRole; // Rôle de l'expéditeur (COACH ou ATHLETE)
    private boolean isOwnMessage; // Si le message est de l'utilisateur connecté
} 