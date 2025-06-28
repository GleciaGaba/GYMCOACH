package com.gymcoach.backend_gym.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.model.Chat;
import com.gymcoach.backend_gym.model.Message;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ChatRepository;
import com.gymcoach.backend_gym.repository.MessageRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
public class ChatControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    private User user1;
    private User user2;
    private Chat chat;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Créer des utilisateurs de test
        user1 = new User();
        user1.setEmail("test1@example.com");
        user1.setPassword("password");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setRole("ATHLETE");
        user1 = userRepository.save(user1);

        user2 = new User();
        user2.setEmail("test2@example.com");
        user2.setPassword("password");
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        user2.setRole("COACH");
        user2 = userRepository.save(user2);

        // Créer une conversation de test
        chat = new Chat(Arrays.asList(String.valueOf(user1.getId()), String.valueOf(user2.getId())));
        chat = chatRepository.save(chat);

        // Créer des messages de test
        Message message1 = new Message(
                chat.getId(), 
                String.valueOf(user1.getId()), 
                String.valueOf(user2.getId()), 
                "Bonjour coach !"
        );
        messageRepository.save(message1);

        Message message2 = new Message(
                chat.getId(), 
                String.valueOf(user2.getId()), 
                String.valueOf(user1.getId()), 
                "Bonjour ! Comment allez-vous ?"
        );
        messageRepository.save(message2);
    }

    @Test
    @WithMockUser(username = "test1@example.com")
    void testGetConversationMessages_ShouldIncludeSenderIdAndReceiverId() throws Exception {
        // Test de récupération des messages d'une conversation
        mockMvc.perform(get("/api/chat/conversation/{otherUserId}", user2.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages").isArray())
                .andExpect(jsonPath("$.messages[0].id").exists())
                .andExpect(jsonPath("$.messages[0].content").exists())
                .andExpect(jsonPath("$.messages[0].senderId").exists())
                .andExpect(jsonPath("$.messages[0].receiverId").exists())
                .andExpect(jsonPath("$.messages[0].timestamp").exists())
                .andExpect(jsonPath("$.messages[0].read").exists())
                .andExpect(jsonPath("$.messages[0].senderId").value(String.valueOf(user1.getId())))
                .andExpect(jsonPath("$.messages[0].receiverId").value(String.valueOf(user2.getId())))
                .andExpect(jsonPath("$.messages[1].senderId").value(String.valueOf(user2.getId())))
                .andExpect(jsonPath("$.messages[1].receiverId").value(String.valueOf(user1.getId())));
    }

    @Test
    @WithMockUser(username = "test1@example.com")
    void testSendMessage_ShouldIncludeSenderIdAndReceiverId() throws Exception {
        // Test d'envoi d'un nouveau message
        String messageContent = "Nouveau message de test";
        
        mockMvc.perform(post("/api/chat/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"" + messageContent + "\",\"receiverId\":\"" + user2.getId() + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.content").value(messageContent))
                .andExpect(jsonPath("$.senderId").value(String.valueOf(user1.getId())))
                .andExpect(jsonPath("$.receiverId").value(String.valueOf(user2.getId())))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.read").value(false));
    }

    @Test
    @WithMockUser(username = "test1@example.com")
    void testGetUnreadMessages_ShouldIncludeSenderIdAndReceiverId() throws Exception {
        // Test de récupération des messages non lus
        mockMvc.perform(get("/api/chat/unread-messages")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].senderId").exists())
                .andExpect(jsonPath("$[0].receiverId").exists());
    }

    @Test
    @WithMockUser(username = "test1@example.com")
    void testGetConversationMessagesWithPagination_ShouldIncludeSenderIdAndReceiverId() throws Exception {
        // Test de récupération des messages avec pagination
        mockMvc.perform(get("/api/chat/conversation/{chatId}/messages", chat.getId())
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].senderId").exists())
                .andExpect(jsonPath("$.content[0].receiverId").exists());
    }
} 