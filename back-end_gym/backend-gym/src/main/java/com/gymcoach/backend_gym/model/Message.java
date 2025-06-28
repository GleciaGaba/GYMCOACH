package com.gymcoach.backend_gym.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    
    @Id
    private String id;
    
    @Field("chatId")
    private String chatId;
    
    @Field("authorId")
    private String authorId; // ID of the user who sent the message (backward compatibility)
    
    @Field("senderId")
    private String senderId; // ID of the user who sent the message (frontend expectation)
    
    @Field("receiverId")
    private String receiverId; // ID of the user who receives the message (frontend expectation)
    
    @Field("content")
    private String content;
    
    @Field("isRead")
    private boolean isRead;
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    // Constructor for creating new message
    public Message(String chatId, String senderId, String receiverId, String content) {
        this.chatId = chatId;
        this.authorId = senderId; // Keep backward compatibility
        this.senderId = senderId; // New field for frontend
        this.receiverId = receiverId; // New field for frontend
        this.content = content;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor for backward compatibility
    public Message(String chatId, String authorId, String content) {
        this.chatId = chatId;
        this.authorId = authorId;
        this.senderId = authorId; // Set senderId to authorId for compatibility
        this.receiverId = null; // Will be set later if needed
        this.content = content;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
} 