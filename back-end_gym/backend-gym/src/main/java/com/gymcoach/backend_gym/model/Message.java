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
    private String authorId; // ID of the user who sent the message
    
    @Field("content")
    private String content;
    
    @Field("isRead")
    private boolean isRead;
    
    @Field("createdAt")
    private LocalDateTime createdAt;
    
    // Constructor for creating new message
    public Message(String chatId, String authorId, String content) {
        this.chatId = chatId;
        this.authorId = authorId;
        this.content = content;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
} 