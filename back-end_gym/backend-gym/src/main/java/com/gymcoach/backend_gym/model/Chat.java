package com.gymcoach.backend_gym.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chats")
public class Chat {
    
    @Id
    private String id;
    
    @Field("participants")
    private List<String> participants; // List of user IDs (coach and athlete)
    
    @Field("lastMessage")
    private String lastMessage;
    
    @Field("lastMessageAt")
    private LocalDateTime lastMessageAt;
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    @Field("updatedAt")
    private LocalDateTime updatedAt;
    
    // Constructor for creating new chat
    public Chat(List<String> participants) {
        this.participants = participants;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
} 