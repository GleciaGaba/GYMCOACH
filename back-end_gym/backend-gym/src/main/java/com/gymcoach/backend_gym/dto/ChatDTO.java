package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatDTO {
    
    private String id;
    private List<String> participants;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Informations supplémentaires pour l'affichage
    private String otherParticipantName; // Nom de l'autre participant
    private int unreadCount; // Nombre de messages non lus
    private boolean isOnline; // Statut en ligne de l'autre participant
} 