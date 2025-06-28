package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.ChatDTO;
import com.gymcoach.backend_gym.dto.ChatResponse;
import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.dto.SendMessageRequest;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.security.JwtUtils;
import com.gymcoach.backend_gym.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    /**
     * Envoyer un message
     */
    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        String currentUserId = getCurrentUserId();
        MessageDTO message = chatService.sendMessage(currentUserId, request);
        return ResponseEntity.ok(message);
    }

    /**
     * Récupérer toutes les conversations de l'utilisateur connecté
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatDTO>> getUserConversations() {
        String currentUserId = getCurrentUserId();
        List<ChatDTO> conversations = chatService.getUserConversations(currentUserId);
        return ResponseEntity.ok(conversations);
    }

    /**
     * Récupérer une conversation spécifique avec ses messages
     */
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<ChatResponse> getConversation(@PathVariable String otherUserId) {
        String currentUserId = getCurrentUserId();
        ChatResponse conversation = chatService.getConversation(currentUserId, otherUserId);
        return ResponseEntity.ok(conversation);
    }

    /**
     * Récupérer les messages d'une conversation avec pagination
     */
    @GetMapping("/conversation/{chatId}/messages")
    public ResponseEntity<Page<MessageDTO>> getConversationMessages(
            @PathVariable String chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageDTO> messages = chatService.getConversationMessages(chatId, pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Marquer les messages d'une conversation comme lus
     */
    @PutMapping("/conversation/{chatId}/read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String chatId) {
        String currentUserId = getCurrentUserId();
        chatService.markMessagesAsRead(currentUserId, chatId);
        return ResponseEntity.ok().build();
    }

    /**
     * Récupérer le nombre de messages non lus
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadMessageCount() {
        String currentUserId = getCurrentUserId();
        int unreadCount = chatService.getUnreadMessageCount(currentUserId);
        return ResponseEntity.ok(unreadCount);
    }

    /**
     * Récupérer tous les messages non lus
     */
    @GetMapping("/unread-messages")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages() {
        String currentUserId = getCurrentUserId();
        List<MessageDTO> unreadMessages = chatService.getUnreadMessages(currentUserId);
        return ResponseEntity.ok(unreadMessages);
    }

    /**
     * Créer une nouvelle conversation
     */
    @PostMapping("/conversation/{otherUserId}")
    public ResponseEntity<ChatDTO> createConversation(@PathVariable String otherUserId) {
        String currentUserId = getCurrentUserId();
        ChatDTO conversation = chatService.createConversation(currentUserId, otherUserId);
        return ResponseEntity.ok(conversation);
    }

    /**
     * Supprimer une conversation
     */
    @DeleteMapping("/conversation/{chatId}")
    public ResponseEntity<Void> deleteConversation(@PathVariable String chatId) {
        String currentUserId = getCurrentUserId();
        chatService.deleteConversation(currentUserId, chatId);
        return ResponseEntity.ok().build();
    }

    /**
     * Récupérer l'ID de l'utilisateur connecté depuis le contexte de sécurité
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            // Essayer d'abord de récupérer l'ID depuis le token JWT
            try {
                // Si l'authentification contient un token JWT, l'extraire
                if (authentication.getCredentials() instanceof String) {
                    String token = (String) authentication.getCredentials();
                    Long userId = jwtUtils.getUserIdFromToken(token);
                    if (userId != null) {
                        return String.valueOf(userId);
                    }
                }
            } catch (Exception e) {
                // En cas d'erreur, continuer avec la méthode existante
            }
            
            // Méthode de fallback : récupérer l'email et chercher l'utilisateur
            String email = authentication.getName(); // L'email est stocké comme principal
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            return String.valueOf(user.getId());
        }
        throw new RuntimeException("Utilisateur non authentifié");
    }
} 