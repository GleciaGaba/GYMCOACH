package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.MessageDTO;
import com.gymcoach.backend_gym.dto.SendMessageRequest;
import com.gymcoach.backend_gym.dto.WebSocketMessage;
import com.gymcoach.backend_gym.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Gérer l'envoi de messages en temps réel
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public WebSocketMessage sendMessage(@Payload WebSocketMessage webSocketMessage) {
        log.info("Message reçu: {}", webSocketMessage);
        
        // Sauvegarder le message en base de données
        SendMessageRequest request = new SendMessageRequest();
        request.setContent(webSocketMessage.getContent());
        request.setReceiverId(webSocketMessage.getReceiverId());
        
        MessageDTO savedMessage = chatService.sendMessage(webSocketMessage.getSenderId(), request);
        
        // Envoyer le message au destinataire spécifique
        messagingTemplate.convertAndSendToUser(
            webSocketMessage.getReceiverId(),
            "/queue/messages",
            webSocketMessage
        );
        
        return webSocketMessage;
    }

    /**
     * Gérer la connexion d'un utilisateur
     */
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public WebSocketMessage addUser(@Payload WebSocketMessage webSocketMessage, 
                                   SimpMessageHeaderAccessor headerAccessor) {
        // Ajouter l'utilisateur à la session WebSocket
        headerAccessor.getSessionAttributes().put("username", webSocketMessage.getSenderId());
        
        // Notifier que l'utilisateur est en ligne
        WebSocketMessage onlineMessage = new WebSocketMessage("ONLINE", webSocketMessage.getSenderId(), null);
        messagingTemplate.convertAndSend("/topic/online", onlineMessage);
        
        return webSocketMessage;
    }

    /**
     * Gérer l'indicateur de frappe
     */
    @MessageMapping("/chat.typing")
    public void typing(@Payload WebSocketMessage webSocketMessage) {
        // Envoyer l'indicateur de frappe au destinataire
        messagingTemplate.convertAndSendToUser(
            webSocketMessage.getReceiverId(),
            "/queue/typing",
            webSocketMessage
        );
    }

    /**
     * Marquer les messages comme lus
     */
    @MessageMapping("/chat.read")
    public void markAsRead(@Payload WebSocketMessage webSocketMessage) {
        // Marquer les messages comme lus en base de données
        chatService.markMessagesAsRead(webSocketMessage.getSenderId(), webSocketMessage.getChatId());
        
        // Notifier l'expéditeur que ses messages ont été lus
        WebSocketMessage readMessage = new WebSocketMessage("READ", webSocketMessage.getSenderId(), webSocketMessage.getReceiverId());
        readMessage.setChatId(webSocketMessage.getChatId());
        
        messagingTemplate.convertAndSendToUser(
            webSocketMessage.getReceiverId(),
            "/queue/read",
            readMessage
        );
    }

    /**
     * Gérer la déconnexion d'un utilisateur
     */
    @MessageMapping("/chat.disconnect")
    @SendTo("/topic/public")
    public WebSocketMessage disconnect(@Payload WebSocketMessage webSocketMessage) {
        // Notifier que l'utilisateur est hors ligne
        WebSocketMessage offlineMessage = new WebSocketMessage("OFFLINE", webSocketMessage.getSenderId(), null);
        messagingTemplate.convertAndSend("/topic/offline", offlineMessage);
        
        return webSocketMessage;
    }
} 