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
public class ChatResponse {
    
    private String chatId;
    private List<String> participants;
    private List<MessageDTO> messages;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Informations sur les participants
    private String otherParticipantId;
    private String otherParticipantName;
    private String otherParticipantRole;
    
    // Statistiques
    private int totalMessages;
    private int unreadCount;
} 