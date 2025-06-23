package com.gymcoach.backend_gym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    
    private String type; // "MESSAGE", "TYPING", "READ", "ONLINE", "OFFLINE"
    private String chatId;
    private String senderId;
    private String receiverId;
    private String content;
    private LocalDateTime timestamp;
    private Object data; // Données supplémentaires selon le type
    
    // Constructeur pour les messages de chat
    public WebSocketMessage(String type, String chatId, String senderId, String receiverId, String content) {
        this.type = type;
        this.chatId = chatId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructeur pour les événements simples
    public WebSocketMessage(String type, String senderId, String receiverId) {
        this.type = type;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.timestamp = LocalDateTime.now();
    }
} 