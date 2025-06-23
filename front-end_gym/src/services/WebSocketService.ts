import SockJS from "sockjs-client";
import { Client, Message } from "@stomp/stompjs";
import { ChatMessage } from "../api/chat";

export interface WebSocketCallbacks {
  onMessageReceived?: (message: ChatMessage) => void;
  onTypingReceived?: (userId: number, isTyping: boolean) => void;
  onReadReceived?: (messageId: number) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
  onReconnecting?: (attempt: number) => void;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private callbacks: WebSocketCallbacks = {};
  private lastError: string | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.setupStompClient();
  }

  private setupStompClient() {
    // Utiliser l'URL de l'API depuis la configuration
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const wsUrl = apiUrl + "/ws";

    console.log("Connexion WebSocket vers:", wsUrl);

    const socket = new SockJS(wsUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = this.onConnect.bind(this);
    this.stompClient.onDisconnect = this.onDisconnect.bind(this);
    this.stompClient.onStompError = this.onError.bind(this);
  }

  private onConnect() {
    console.log("WebSocket connecté");
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.lastError = null;
    this.subscribeToTopics();
    this.callbacks.onConnected?.();
  }

  private onDisconnect() {
    console.log("WebSocket déconnecté");
    this.isConnected = false;
    this.callbacks.onDisconnected?.();

    // Tentative de reconnexion automatique
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private onError(error: any) {
    console.error("Erreur WebSocket:", error);
    this.lastError = error.message || "Erreur de connexion WebSocket";
    this.callbacks.onError?.(error);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    this.callbacks.onReconnecting?.(this.reconnectAttempts);

    this.reconnectTimer = setTimeout(() => {
      if (this.stompClient) {
        console.log(
          `Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
        );
        this.stompClient.activate();
      }
    }, this.reconnectDelay * this.reconnectAttempts); // Backoff exponentiel
  }

  private subscribeToTopics() {
    if (!this.stompClient || !this.isConnected) return;

    // S'abonner aux messages privés
    this.stompClient.subscribe("/user/queue/messages", (message: Message) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log("Message reçu:", chatMessage);
        this.callbacks.onMessageReceived?.(chatMessage);
      } catch (error) {
        console.error("Erreur parsing message:", error);
      }
    });

    // S'abonner aux indicateurs de frappe
    this.stompClient.subscribe("/user/queue/typing", (message: Message) => {
      try {
        const data = JSON.parse(message.body);
        console.log("Typing reçu:", data);
        this.callbacks.onTypingReceived?.(data.userId, data.isTyping);
      } catch (error) {
        console.error("Erreur parsing typing:", error);
      }
    });

    // S'abonner aux notifications de lecture
    this.stompClient.subscribe("/user/queue/read", (message: Message) => {
      try {
        const data = JSON.parse(message.body);
        console.log("Read reçu:", data);
        this.callbacks.onReadReceived?.(data.messageId);
      } catch (error) {
        console.error("Erreur parsing read:", error);
      }
    });
  }

  public connect(token: string) {
    if (!this.stompClient) {
      this.setupStompClient();
    }

    if (this.stompClient) {
      this.stompClient.connectHeaders = {
        Authorization: `Bearer ${token}`,
      };

      this.stompClient.activate();
    }
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.lastError = null;
  }

  public sendMessage(chatMessage: ChatMessage) {
    if (!this.stompClient || !this.isConnected) {
      console.error("WebSocket non connecté");
      return false;
    }

    this.stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });
  }

  public sendTyping(userId: number, receiverId: number, isTyping: boolean) {
    if (!this.stompClient || !this.isConnected) {
      return;
    }

    this.stompClient.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({
        type: "TYPING",
        userId,
        receiverId,
        isTyping,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  public sendRead(messageId: number, receiverId: number) {
    if (!this.stompClient || !this.isConnected) {
      return;
    }

    this.stompClient.publish({
      destination: "/app/chat.read",
      body: JSON.stringify({
        type: "READ",
        messageId,
        receiverId,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  public setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Instance singleton
const webSocketService = new WebSocketService();
export default webSocketService;
