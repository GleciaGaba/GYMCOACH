package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.ChatDTO;
import com.gymcoach.backend_gym.dto.ChatResponse;
import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.dto.SendMessageRequest;
import com.gymcoach.backend_gym.model.Chat;
import com.gymcoach.backend_gym.model.Message;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.ChatRepository;
import com.gymcoach.backend_gym.repository.MessageRepository;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageDTO sendMessage(String senderId, SendMessageRequest request) {
        try {
            // Vérifier que l'expéditeur existe
            User sender = userRepository.findById(Integer.valueOf(senderId))
                    .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));
            
            // Vérifier que le destinataire existe
            User receiver = userRepository.findById(Integer.valueOf(request.getReceiverId()))
                    .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));

            // Trouver ou créer la conversation
            Chat chat = findOrCreateConversation(senderId, request.getReceiverId());

            // Créer et sauvegarder le message
            Message message = new Message(chat.getId(), senderId, request.getContent());
            Message savedMessage = messageRepository.save(message);

            // Mettre à jour la conversation avec le dernier message
            chat.setLastMessage(request.getContent());
            chat.setLastMessageAt(LocalDateTime.now());
            chat.setUpdatedAt(LocalDateTime.now());
            chatRepository.save(chat);

            // Retourner le DTO du message
            return convertToMessageDTO(savedMessage, sender);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du message: " + e.getMessage());
        }
    }

    @Override
    public List<ChatDTO> getUserConversations(String userId) {
        try {
            List<Chat> chats = chatRepository.findByParticipantIdOrderByLastMessageAtDesc(userId);
            if (chats == null) {
                return new ArrayList<>();
            }
            return chats.stream()
                    .map(chat -> convertToChatDTO(chat, userId))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // En cas d'erreur, on retourne une liste vide
            return new ArrayList<>();
        }
    }

    @Override
    public ChatResponse getConversation(String userId, String otherUserId) {
        try {
            // Trouver la conversation
            Optional<Chat> chatOpt = chatRepository.findByParticipantsContaining(userId, otherUserId);
            if (chatOpt.isEmpty()) {
                throw new RuntimeException("Conversation non trouvée");
            }

            Chat chat = chatOpt.get();
            
            // Récupérer les messages
            List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chat.getId());
            if (messages == null) {
                messages = new ArrayList<>();
            }
            
            // Marquer les messages comme lus
            markMessagesAsRead(userId, chat.getId());

            // Convertir en DTOs
            List<MessageDTO> messageDTOs = messages.stream()
                    .map(message -> {
                        User author = userRepository.findById(Integer.valueOf(message.getAuthorId()))
                                .orElse(null);
                        return convertToMessageDTO(message, author);
                    })
                    .collect(Collectors.toList());

            // Trouver l'autre participant
            String otherParticipantId = chat.getParticipants().stream()
                    .filter(id -> !id.equals(userId))
                    .findFirst()
                    .orElse(null);

            User otherUser = null;
            if (otherParticipantId != null) {
                try {
                    otherUser = userRepository.findById(Integer.valueOf(otherParticipantId))
                            .orElse(null);
                } catch (Exception e) {
                    // En cas d'erreur, on continue avec otherUser = null
                }
            }

            // Compter les messages non lus de manière sécurisée
            int unreadCount = 0;
            try {
                Long count = messageRepository.countUnreadMessagesByChatIdAndUserId(chat.getId(), userId);
                unreadCount = count != null ? count.intValue() : 0;
            } catch (Exception e) {
                // En cas d'erreur, on retourne 0
                unreadCount = 0;
            }

            return ChatResponse.builder()
                    .chatId(chat.getId())
                    .participants(chat.getParticipants())
                    .messages(messageDTOs)
                    .createdAt(chat.getCreatedAt())
                    .updatedAt(chat.getUpdatedAt())
                    .otherParticipantId(otherParticipantId)
                    .otherParticipantName(otherUser != null ? otherUser.getFirstName() + " " + otherUser.getLastName() : "Inconnu")
                    .otherParticipantRole(otherUser != null ? otherUser.getRole() : "")
                    .totalMessages(messageDTOs.size())
                    .unreadCount(unreadCount)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération de la conversation: " + e.getMessage());
        }
    }

    @Override
    public Page<MessageDTO> getConversationMessages(String chatId, Pageable pageable) {
        try {
            Page<Message> messages = messageRepository.findByChatIdOrderByCreatedAtDesc(chatId, pageable);
            return messages.map(message -> {
                User author = userRepository.findById(Integer.valueOf(message.getAuthorId()))
                        .orElse(null);
                return convertToMessageDTO(message, author);
            });
        } catch (Exception e) {
            // En cas d'erreur, on retourne une page vide
            return Page.empty(pageable);
        }
    }

    @Override
    public void markMessagesAsRead(String userId, String chatId) {
        try {
            List<Message> unreadMessages = messageRepository.findUnreadMessagesByChatIdAndUserId(chatId, userId);
            if (unreadMessages != null) {
                unreadMessages.forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });
            }
        } catch (Exception e) {
            // En cas d'erreur, on ignore silencieusement
            // Cela évite de casser le flux principal
        }
    }

    @Override
    public int getUnreadMessageCount(String userId) {
        try {
            List<Message> unreadMessages = messageRepository.findUnreadMessagesByUserId(userId);
            return unreadMessages != null ? unreadMessages.size() : 0;
        } catch (Exception e) {
            // En cas d'erreur, on retourne 0
            return 0;
        }
    }

    @Override
    public ChatDTO createConversation(String user1Id, String user2Id) {
        try {
            // Vérifier que la conversation n'existe pas déjà
            if (chatRepository.existsByParticipantsContaining(user1Id, user2Id)) {
                throw new RuntimeException("Une conversation existe déjà entre ces utilisateurs");
            }

            Chat chat = new Chat(Arrays.asList(user1Id, user2Id));
            Chat savedChat = chatRepository.save(chat);
            
            return convertToChatDTO(savedChat, user1Id);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création de la conversation: " + e.getMessage());
        }
    }

    @Override
    public void deleteConversation(String userId, String chatId) {
        try {
            Chat chat = chatRepository.findById(chatId)
                    .orElseThrow(() -> new RuntimeException("Conversation non trouvée"));
            
            // Vérifier que l'utilisateur fait partie de la conversation
            if (!chat.getParticipants().contains(userId)) {
                throw new RuntimeException("Vous n'êtes pas autorisé à supprimer cette conversation");
            }

            // Supprimer tous les messages de la conversation
            try {
                messageRepository.deleteByChatId(chatId);
            } catch (Exception e) {
                // En cas d'erreur lors de la suppression des messages, on continue
            }
            
            // Supprimer la conversation
            chatRepository.delete(chat);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression de la conversation: " + e.getMessage());
        }
    }

    @Override
    public List<MessageDTO> getUnreadMessages(String userId) {
        try {
            List<Message> unreadMessages = messageRepository.findUnreadMessagesByUserId(userId);
            if (unreadMessages == null) {
                return new ArrayList<>();
            }
            return unreadMessages.stream()
                    .map(message -> {
                        User author = userRepository.findById(Integer.valueOf(message.getAuthorId()))
                                .orElse(null);
                        return convertToMessageDTO(message, author);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // En cas d'erreur, on retourne une liste vide
            return new ArrayList<>();
        }
    }

    // Méthodes utilitaires privées
    private Chat findOrCreateConversation(String user1Id, String user2Id) {
        try {
            return chatRepository.findByParticipantsContaining(user1Id, user2Id)
                    .orElseGet(() -> {
                        try {
                            Chat newChat = new Chat(Arrays.asList(user1Id, user2Id));
                            return chatRepository.save(newChat);
                        } catch (Exception e) {
                            throw new RuntimeException("Erreur lors de la création de la conversation: " + e.getMessage());
                        }
                    });
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la recherche/création de la conversation: " + e.getMessage());
        }
    }

    private ChatDTO convertToChatDTO(Chat chat, String currentUserId) {
        try {
            // Trouver l'autre participant
            String otherParticipantId = chat.getParticipants().stream()
                    .filter(id -> !id.equals(currentUserId))
                    .findFirst()
                    .orElse(null);

            User otherUser = null;
            if (otherParticipantId != null) {
                try {
                    otherUser = userRepository.findById(Integer.valueOf(otherParticipantId))
                            .orElse(null);
                } catch (Exception e) {
                    // En cas d'erreur, on continue avec otherUser = null
                }
            }

            // Compter les messages non lus de manière sécurisée
            int unreadCount = 0;
            try {
                Long count = messageRepository.countUnreadMessagesByChatIdAndUserId(chat.getId(), currentUserId);
                unreadCount = count != null ? count.intValue() : 0;
            } catch (Exception e) {
                // En cas d'erreur, on retourne 0
                unreadCount = 0;
            }

            return ChatDTO.builder()
                    .id(chat.getId())
                    .participants(chat.getParticipants())
                    .lastMessage(chat.getLastMessage())
                    .lastMessageAt(chat.getLastMessageAt())
                    .createdAt(chat.getCreatedAt())
                    .updatedAt(chat.getUpdatedAt())
                    .otherParticipantName(otherUser != null ? otherUser.getFirstName() + " " + otherUser.getLastName() : "Inconnu")
                    .unreadCount(unreadCount)
                    .isOnline(false) // À implémenter avec WebSocket
                    .build();
        } catch (Exception e) {
            // En cas d'erreur, on retourne un DTO minimal
            return ChatDTO.builder()
                    .id(chat.getId())
                    .participants(chat.getParticipants())
                    .lastMessage(chat.getLastMessage())
                    .lastMessageAt(chat.getLastMessageAt())
                    .createdAt(chat.getCreatedAt())
                    .updatedAt(chat.getUpdatedAt())
                    .otherParticipantName("Inconnu")
                    .unreadCount(0)
                    .isOnline(false)
                    .build();
        }
    }

    private MessageDTO convertToMessageDTO(Message message, User author) {
        try {
            return MessageDTO.builder()
                    .id(message.getId())
                    .chatId(message.getChatId())
                    .authorId(message.getAuthorId())
                    .content(message.getContent())
                    .isRead(message.isRead())
                    .createdAt(message.getCreatedAt())
                    .authorName(author != null ? author.getFirstName() + " " + author.getLastName() : "Inconnu")
                    .authorRole(author != null ? author.getRole() : "")
                    .isOwnMessage(false) // À définir selon le contexte
                    .build();
        } catch (Exception e) {
            // En cas d'erreur, on retourne un DTO minimal
            return MessageDTO.builder()
                    .id(message.getId())
                    .chatId(message.getChatId())
                    .authorId(message.getAuthorId())
                    .content(message.getContent())
                    .isRead(message.isRead())
                    .createdAt(message.getCreatedAt())
                    .authorName("Inconnu")
                    .authorRole("")
                    .isOwnMessage(false)
                    .build();
        }
    }
} 