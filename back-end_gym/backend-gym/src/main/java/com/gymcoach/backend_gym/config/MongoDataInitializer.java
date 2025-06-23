package com.gymcoach.backend_gym.config;

import com.gymcoach.backend_gym.model.Chat;
import com.gymcoach.backend_gym.model.Message;
import com.gymcoach.backend_gym.repository.ChatRepository;
import com.gymcoach.backend_gym.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class MongoDataInitializer {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Bean
    @Order(2) // S'exécute après MongoConfig
    public CommandLineRunner initializeMongoData() {
        return args -> {
            System.out.println("📝 Initialisation des données MongoDB...");
            
            // Vérifier si des données existent déjà
            if (chatRepository.count() == 0) {
                createSampleData();
                System.out.println("✅ Données de test MongoDB créées avec succès !");
            } else {
                System.out.println("ℹ️ Des données existent déjà dans MongoDB, pas d'initialisation nécessaire.");
            }
        };
    }

    private void createSampleData() {
        try {
            // Créer quelques conversations de test
            createSampleConversations();
            
            // Créer quelques messages de test
            createSampleMessages();
            
        } catch (Exception e) {
            System.err.println("⚠️ Erreur lors de la création des données de test: " + e.getMessage());
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

        System.out.println("💬 3 conversations de test créées");
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

        System.out.println("💭 Messages de test créés");
    }
} 