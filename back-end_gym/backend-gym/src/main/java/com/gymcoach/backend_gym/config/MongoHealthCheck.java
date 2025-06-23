package com.gymcoach.backend_gym.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

@Configuration
public class MongoHealthCheck {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Bean
    @Order(1) // S'exécute en premier
    public CommandLineRunner checkMongoHealth() {
        return args -> {
            System.out.println("🔍 Vérification de la connexion MongoDB...");
            
            try {
                // Vérifier la connexion en essayant de lister les collections
                mongoTemplate.getCollectionNames();
                System.out.println("✅ Connexion MongoDB établie avec succès !");
                
                // Vérifier si les collections existent
                checkCollections();
                
            } catch (Exception e) {
                System.err.println("❌ Erreur de connexion MongoDB: " + e.getMessage());
                System.err.println("⚠️ Assurez-vous que MongoDB est démarré sur localhost:27017");
                System.err.println("⚠️ Commande pour démarrer MongoDB: mongod");
            }
        };
    }

    private void checkCollections() {
        try {
            // Vérifier la collection chat
            if (!mongoTemplate.collectionExists("chat")) {
                System.out.println("📝 Création de la collection 'chat'...");
                mongoTemplate.createCollection("chat");
            } else {
                System.out.println("✅ Collection 'chat' existe déjà");
            }

            // Vérifier la collection message
            if (!mongoTemplate.collectionExists("message")) {
                System.out.println("📝 Création de la collection 'message'...");
                mongoTemplate.createCollection("message");
            } else {
                System.out.println("✅ Collection 'message' existe déjà");
            }

            // Afficher le nombre de documents dans chaque collection
            long chatCount = mongoTemplate.count(new Query(), "chat");
            long messageCount = mongoTemplate.count(new Query(), "message");
            
            System.out.println("📊 Statistiques MongoDB:");
            System.out.println("   - Collection 'chat': " + chatCount + " documents");
            System.out.println("   - Collection 'message': " + messageCount + " documents");
            
        } catch (Exception e) {
            System.err.println("⚠️ Erreur lors de la vérification des collections: " + e.getMessage());
        }
    }
} 