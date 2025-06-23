package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ChatDTO;
import com.gymcoach.backend_gym.dto.ChatResponse;
import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.dto.SendMessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService {
    
    /**
     * Envoyer un message à un utilisateur
     */
    MessageDTO sendMessage(String senderId, SendMessageRequest request);
    
    /**
     * Récupérer toutes les conversations d'un utilisateur
     */
    List<ChatDTO> getUserConversations(String userId);
    
    /**
     * Récupérer une conversation spécifique avec ses messages
     */
    ChatResponse getConversation(String userId, String otherUserId);
    
    /**
     * Récupérer les messages d'une conversation avec pagination
     */
    Page<MessageDTO> getConversationMessages(String chatId, Pageable pageable);
    
    /**
     * Marquer les messages d'une conversation comme lus
     */
    void markMessagesAsRead(String userId, String chatId);
    
    /**
     * Récupérer le nombre de messages non lus d'un utilisateur
     */
    int getUnreadMessageCount(String userId);
    
    /**
     * Créer une nouvelle conversation entre deux utilisateurs
     */
    ChatDTO createConversation(String user1Id, String user2Id);
    
    /**
     * Supprimer une conversation (optionnel)
     */
    void deleteConversation(String userId, String chatId);
    
    /**
     * Récupérer les messages non lus d'un utilisateur
     */
    List<MessageDTO> getUnreadMessages(String userId);
} 