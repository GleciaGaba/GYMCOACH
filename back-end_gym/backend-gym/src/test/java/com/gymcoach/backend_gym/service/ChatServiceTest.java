package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.ChatDTO;
import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.dto.SendMessageRequest;
import com.gymcoach.backend_gym.model.Chat;
import com.gymcoach.backend_gym.model.Message;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ChatRepository;
import com.gymcoach.backend_gym.repository.MessageRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.service.impl.ChatServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChatServiceImpl chatService;

    private User coach;
    private User athlete;
    private Chat chat;
    private Message message;
    private SendMessageRequest sendMessageRequest;

    @BeforeEach
    void setUp() {
        // Créer des utilisateurs de test
        coach = new User();
        coach.setId(1);
        coach.setEmail("coach@test.com");
        coach.setFirstName("John");
        coach.setLastName("Coach");
        coach.setRole("COACH");

        athlete = new User();
        athlete.setId(2);
        athlete.setEmail("athlete@test.com");
        athlete.setFirstName("Jane");
        athlete.setLastName("Athlete");
        athlete.setRole("ATHLETE");

        // Créer une conversation de test
        chat = new Chat();
        chat.setId("chat123");
        chat.setParticipants(Arrays.asList("1", "2"));
        chat.setLastMessage("Hello!");
        chat.setLastMessageAt(LocalDateTime.now());
        chat.setCreatedAt(LocalDateTime.now());
        chat.setUpdatedAt(LocalDateTime.now());

        // Créer un message de test
        message = new Message();
        message.setId("msg123");
        message.setChatId("chat123");
        message.setAuthorId("1");
        message.setContent("Hello!");
        message.setRead(false);
        message.setCreatedAt(LocalDateTime.now());

        // Créer une requête d'envoi de message
        sendMessageRequest = new SendMessageRequest();
        sendMessageRequest.setContent("Test message");
        sendMessageRequest.setReceiverId("2");
    }

    @Test
    void testSendMessage_NewConversation() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(Optional.of(coach));
        when(userRepository.findById(2)).thenReturn(Optional.of(athlete));
        when(chatRepository.findByParticipantsContaining("1", "2")).thenReturn(Optional.empty());
        when(chatRepository.save(any(Chat.class))).thenReturn(chat);
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        // Act
        MessageDTO result = chatService.sendMessage("1", sendMessageRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Hello!", result.getContent());
        verify(chatRepository, times(2)).save(any(Chat.class));
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void testSendMessage_ExistingConversation() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(Optional.of(coach));
        when(userRepository.findById(2)).thenReturn(Optional.of(athlete));
        when(chatRepository.findByParticipantsContaining("1", "2")).thenReturn(Optional.of(chat));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        // Act
        MessageDTO result = chatService.sendMessage("1", sendMessageRequest);

        // Assert
        assertNotNull(result);
        verify(chatRepository, times(1)).save(any(Chat.class));
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void testGetUserConversations() {
        // Arrange
        List<Chat> chats = Arrays.asList(chat);
        when(chatRepository.findByParticipantIdOrderByLastMessageAtDesc("1")).thenReturn(chats);
        when(userRepository.findById(2)).thenReturn(Optional.of(athlete));
        when(messageRepository.countUnreadMessagesByChatIdAndUserId("chat123", "1")).thenReturn(0L);

        // Act
        List<ChatDTO> result = chatService.getUserConversations("1");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("chat123", result.get(0).getId());
    }

    @Test
    void testGetConversation() {
        // Arrange
        when(chatRepository.findByParticipantsContaining("1", "2")).thenReturn(Optional.of(chat));
        when(messageRepository.findByChatIdOrderByCreatedAtAsc("chat123")).thenReturn(Arrays.asList(message));
        when(userRepository.findById(1)).thenReturn(Optional.of(coach));
        when(userRepository.findById(2)).thenReturn(Optional.of(athlete));
        when(messageRepository.countUnreadMessagesByChatIdAndUserId("chat123", "1")).thenReturn(0L);

        // Act
        var result = chatService.getConversation("1", "2");

        // Assert
        assertNotNull(result);
        assertEquals("chat123", result.getChatId());
        assertEquals(1, result.getMessages().size());
    }

    @Test
    void testMarkMessagesAsRead() {
        // Arrange
        List<Message> unreadMessages = Arrays.asList(message);
        when(messageRepository.findUnreadMessagesByChatIdAndUserId("chat123", "1")).thenReturn(unreadMessages);

        // Act
        chatService.markMessagesAsRead("1", "chat123");

        // Assert
        verify(messageRepository).save(message);
        assertTrue(message.isRead());
    }

    @Test
    void testGetUnreadMessageCount() {
        // Arrange
        when(messageRepository.findUnreadMessagesByUserId("1")).thenReturn(Arrays.asList(message));

        // Act
        int result = chatService.getUnreadMessageCount("1");

        // Assert
        assertEquals(1, result);
    }

    @Test
    void testCreateConversation() {
        // Arrange
        when(chatRepository.existsByParticipantsContaining("1", "2")).thenReturn(false);
        when(chatRepository.save(any(Chat.class))).thenReturn(chat);
        when(userRepository.findById(2)).thenReturn(Optional.of(athlete));
        when(messageRepository.countUnreadMessagesByChatIdAndUserId("chat123", "1")).thenReturn(0L);

        // Act
        ChatDTO result = chatService.createConversation("1", "2");

        // Assert
        assertNotNull(result);
        assertEquals("chat123", result.getId());
        verify(chatRepository).save(any(Chat.class));
    }

    @Test
    void testGetConversationMessages() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Message> messagePage = new PageImpl<>(Arrays.asList(message));
        when(messageRepository.findByChatIdOrderByCreatedAtDesc("chat123", pageable)).thenReturn(messagePage);
        when(userRepository.findById(1)).thenReturn(Optional.of(coach));

        // Act
        Page<MessageDTO> result = chatService.getConversationMessages("chat123", pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Hello!", result.getContent().get(0).getContent());
    }
} 