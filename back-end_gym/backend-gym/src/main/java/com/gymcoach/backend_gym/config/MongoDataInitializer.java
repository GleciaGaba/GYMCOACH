package com.gymcoach.backend_gym.config;

import com.gymcoach.backend_gym.model.Chat;
import com.gymcoach.backend_gym.model.Message;
import com.gymcoach.backend_gym.repository.ChatRepository;
import com.gymcoach.backend_gym.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MongoDataInitializer implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Initialisation des données MongoDB...");
        
        // Migrer les messages existants pour ajouter senderId et receiverId
        migrateExistingMessages();
        
        // Vérifier si des données existent déjà
        if (chatRepository.count() == 0) {
            createSampleData();
            log.info("✅ Données de test MongoDB créées avec succès !");
        } else {
            log.info("ℹ️ Des données existent déjà dans MongoDB, pas d'initialisation nécessaire.");
        }
        
        log.info("✅ Initialisation MongoDB terminée");
    }

    private void createSampleData() {
        try {
            // Créer quelques conversations de test
            createSampleConversations();
            
            // Créer quelques messages de test
            createSampleMessages();
            
        } catch (Exception e) {
            log.error("⚠️ Erreur lors de la création des données de test: {}", e.getMessage());
        }
    }

    private void createSampleConversations() {
        // Conversation entre coach (ID: 1) et sportif (ID: 2)
        Chat chat1 = new Chat(Arrays.asList("1", "2"));
        chat1.setLastMessage("Salut ! Comment va ton entraînement ?");
        chat1.setLastMessageAt(LocalDateTime.now().minusHours(2));
        chatRepository.save(chat1);

        // Conversation entre coach (ID: 1) et sportif (ID: 3)
        Chat chat2 = new Chat(Arrays.asList("1", "3"));
        chat2.setLastMessage("Parfait pour la séance de demain !");
        chat2.setLastMessageAt(LocalDateTime.now().minusHours(1));
        chatRepository.save(chat2);

        // Conversation entre coach (ID: 1) et sportif (ID: 4)
        Chat chat3 = new Chat(Arrays.asList("1", "4"));
        chat3.setLastMessage("N'oublie pas de boire beaucoup d'eau !");
        chat3.setLastMessageAt(LocalDateTime.now().minusMinutes(30));
        chatRepository.save(chat3);

        log.info("💬 3 conversations de test créées");
    }

    private void createSampleMessages() {
        // Messages pour la conversation 1 (coach 1 - sportif 2)
        List<Chat> chats = chatRepository.findAll();
        if (!chats.isEmpty()) {
            Chat chat1 = chats.get(0);
            
            // Message du coach
            Message msg1 = new Message(chat1.getId(), "1", "Salut ! Comment va ton entraînement ?");
            msg1.setRead(true);
            messageRepository.save(msg1);

            // Réponse du sportif
            Message msg2 = new Message(chat1.getId(), "2", "Très bien coach ! J'ai fait ma séance de cardio ce matin.");
            msg2.setRead(true);
            messageRepository.save(msg2);

            // Message du coach
            Message msg3 = new Message(chat1.getId(), "1", "Parfait ! N'oublie pas de bien t'étirer après.");
            msg3.setRead(false); // Non lu
            messageRepository.save(msg3);

            // Messages pour la conversation 2 (coach 1 - sportif 3)
            if (chats.size() > 1) {
                Chat chat2 = chats.get(1);
                
                Message msg4 = new Message(chat2.getId(), "1", "Parfait pour la séance de demain !");
                msg4.setRead(true);
                messageRepository.save(msg4);

                Message msg5 = new Message(chat2.getId(), "3", "D'accord coach, à demain !");
                msg5.setRead(false); // Non lu
                messageRepository.save(msg5);
            }

            // Messages pour la conversation 3 (coach 1 - sportif 4)
            if (chats.size() > 2) {
                Chat chat3 = chats.get(2);
                
                Message msg6 = new Message(chat3.getId(), "1", "N'oublie pas de boire beaucoup d'eau !");
                msg6.setRead(false); // Non lu
                messageRepository.save(msg6);
            }
        }

        log.info("💭 Messages de test créés");
    }

    /**
     * Migre les messages existants pour ajouter les champs senderId et receiverId
     * en utilisant authorId comme senderId pour la compatibilité
     */
    private void migrateExistingMessages() {
        try {
            log.info("🔄 Migration des messages existants...");
            
            // Trouver tous les messages qui n'ont pas de senderId
            Query query = new Query(Criteria.where("senderId").exists(false));
            List<Message> messagesToMigrate = mongoTemplate.find(query, Message.class);
            
            if (messagesToMigrate.isEmpty()) {
                log.info("✅ Aucun message à migrer");
                return;
            }
            
            log.info("📝 Migration de {} messages...", messagesToMigrate.size());
            
            int migratedCount = 0;
            for (Message message : messagesToMigrate) {
                try {
                    // Mettre à jour le message avec senderId = authorId
                    Update update = new Update()
                            .set("senderId", message.getAuthorId())
                            .set("receiverId", null); // Sera défini plus tard si nécessaire
                    
                    mongoTemplate.updateFirst(
                            new Query(Criteria.where("id").is(message.getId())),
                            update,
                            Message.class
                    );
                    
                    migratedCount++;
                } catch (Exception e) {
                    log.error("❌ Erreur lors de la migration du message {}: {}", message.getId(), e.getMessage());
                }
            }
            
            log.info("✅ {} messages migrés avec succès", migratedCount);
            
        } catch (Exception e) {
            log.error("❌ Erreur lors de la migration des messages: {}", e.getMessage());
        }
    }
} 