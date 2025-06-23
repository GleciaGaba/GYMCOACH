package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    /**
     * Trouve tous les messages d'une conversation, triés par date de création
     */
    List<Message> findByChatIdOrderByCreatedAtAsc(String chatId);
    
    /**
     * Trouve tous les messages d'une conversation avec pagination
     */
    Page<Message> findByChatIdOrderByCreatedAtDesc(String chatId, Pageable pageable);
    
    /**
     * Trouve les messages non lus d'un utilisateur dans une conversation
     */
    @Query("{'chatId': ?0, 'authorId': {$ne: ?1}, 'isRead': false}")
    List<Message> findUnreadMessagesByChatIdAndUserId(String chatId, String userId);
    
    /**
     * Compte les messages non lus d'un utilisateur dans une conversation
     */
    @Query("{'chatId': ?0, 'authorId': {$ne: ?1}, 'isRead': false}")
    long countUnreadMessagesByChatIdAndUserId(String chatId, String userId);
    
    /**
     * Trouve le dernier message d'une conversation
     */
    @Query("{'chatId': ?0}")
    Message findFirstByChatIdOrderByCreatedAtDesc(String chatId);
    
    /**
     * Trouve tous les messages non lus d'un utilisateur dans toutes ses conversations
     */
    @Query("{'authorId': {$ne: ?0}, 'isRead': false}")
    List<Message> findUnreadMessagesByUserId(String userId);
    
    /**
     * Supprime tous les messages d'une conversation
     */
    void deleteByChatId(String chatId);
} 