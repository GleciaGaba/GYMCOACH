package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    
    /**
     * Trouve une conversation entre deux utilisateurs
     */
    @Query("{'participants': {$all: [?0, ?1]}}")
    Optional<Chat> findByParticipantsContaining(String user1Id, String user2Id);
    
    /**
     * Trouve toutes les conversations d'un utilisateur
     */
    @Query("{'participants': ?0}")
    List<Chat> findByParticipantId(String userId);
    
    /**
     * Trouve toutes les conversations d'un utilisateur, triées par date de dernier message
     */
    @Query("{'participants': ?0}")
    List<Chat> findByParticipantIdOrderByLastMessageAtDesc(String userId);
    
    /**
     * Vérifie si une conversation existe entre deux utilisateurs
     */
    @Query("{'participants': {$all: [?0, ?1]}}")
    boolean existsByParticipantsContaining(String user1Id, String user2Id);
} 