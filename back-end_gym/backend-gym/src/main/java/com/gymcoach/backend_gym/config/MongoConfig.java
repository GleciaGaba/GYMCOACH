package com.gymcoach.backend_gym.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@Configuration
public class MongoConfig {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Bean
    public CommandLineRunner initializeMongoIndexes() {
        return args -> {
            System.out.println("🚀 Initialisation MongoDB...");
            
            // Créer les index pour optimiser les requêtes
            createIndexes();
            
            System.out.println("✅ MongoDB initialisé avec succès !");
        };
    }

    private void createIndexes() {
        try {
            // Index pour la collection Chat
            mongoTemplate.indexOps("chat").ensureIndex(
                new Index().on("participants", org.springframework.data.domain.Sort.Direction.ASC)
            );
            
            mongoTemplate.indexOps("chat").ensureIndex(
                new Index().on("lastMessageAt", org.springframework.data.domain.Sort.Direction.DESC)
            );

            // Index pour la collection Message
            mongoTemplate.indexOps("message").ensureIndex(
                new Index().on("chatId", org.springframework.data.domain.Sort.Direction.ASC)
            );
            
            mongoTemplate.indexOps("message").ensureIndex(
                new Index().on("authorId", org.springframework.data.domain.Sort.Direction.ASC)
            );
            
            mongoTemplate.indexOps("message").ensureIndex(
                new Index().on("isRead", org.springframework.data.domain.Sort.Direction.ASC)
            );
            
            mongoTemplate.indexOps("message").ensureIndex(
                new Index().on("createdAt", org.springframework.data.domain.Sort.Direction.DESC)
            );

            System.out.println("📊 Index MongoDB créés avec succès");
        } catch (Exception e) {
            System.err.println("⚠️ Erreur lors de la création des index MongoDB: " + e.getMessage());
        }
    }
} 