import API from "./auth";
import {
  getConversations as getMockConversations,
  getConversationMessages as getMockConversationMessages,
  sendMessage as sendMockMessage,
  markMessagesAsRead as markMockMessagesAsRead,
  getUnreadCount as getMockUnreadCount,
} from "./chatMock";

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface ChatMessage {
  type: "MESSAGE" | "TYPING" | "READ";
  senderId: number;
  receiverId: number;
  content?: string;
  timestamp: string;
  messageId?: number;
}

export interface ConversationMessagesResponse {
  messages: Message[];
  [key: string]: any;
}

// Helper function to check if we should use mock data
const shouldUseMock = (error: any): boolean => {
  // Check for MongoDB connection errors or 500 status codes
  if (error?.response?.status === 500) {
    const errorMessage = error?.response?.data?.message || "";
    return (
      errorMessage.includes("NotPrimaryOrSecondary") ||
      errorMessage.includes("MongoDB") ||
      errorMessage.includes("database") ||
      errorMessage.includes("connection")
    );
  }
  return false;
};

// Récupérer toutes les conversations
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await API.get("/api/chat/conversations");

    // Adapter la structure des conversations du backend au format frontend
    const backendConversations = response.data;

    // Récupérer l'ID de l'utilisateur actuel depuis le token
    const token = localStorage.getItem("token");
    let currentUserId = 1; // Valeur par défaut

    if (token) {
      try {
        // Décoder le token JWT pour récupérer l'ID utilisateur
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserId = payload.sub || 1;
      } catch (e) {
        console.warn(
          "Impossible de décoder le token, utilisation de l'ID par défaut"
        );
      }
    }

    const adaptedConversations: Conversation[] = backendConversations.map(
      (conv: any) => {
        // Extraire l'ID de l'autre participant (pas l'utilisateur actuel)
        const otherParticipant = conv.participants.find(
          (p: any) => p.id !== currentUserId
        );

        return {
          id: conv.id,
          otherUserId: otherParticipant?.id || 0,
          otherUserName:
            otherParticipant?.firstName + " " + otherParticipant?.lastName ||
            "Utilisateur inconnu",
          lastMessage: conv.lastMessage || "",
          lastMessageTimestamp: conv.lastMessageAt || conv.createdAt || "",
          unreadCount: conv.unreadCount || 0,
        };
      }
    );

    return adaptedConversations;
  } catch (error: any) {
    console.warn(
      "Backend indisponible, utilisation des données mock:",
      error.message
    );
    if (shouldUseMock(error)) {
      return getMockConversations();
    }
    throw error;
  }
};

// Récupérer les messages d'une conversation
export const getConversationMessages = async (
  otherUserId: number
): Promise<Message[] | ConversationMessagesResponse> => {
  try {
    const response = await API.get(`/api/chat/conversation/${otherUserId}`);
    return response.data;
  } catch (error: any) {
    console.warn(
      "Backend indisponible, utilisation des données mock:",
      error.message
    );
    if (shouldUseMock(error)) {
      return getMockConversationMessages(otherUserId);
    }
    throw error;
  }
};

// Envoyer un message
export const sendMessage = async (
  content: string,
  receiverId: number
): Promise<Message> => {
  try {
    const response = await API.post("/api/chat/send", {
      content,
      receiverId: receiverId.toString(),
    });
    return response.data;
  } catch (error: any) {
    console.warn(
      "Backend indisponible, utilisation des données mock:",
      error.message
    );
    if (shouldUseMock(error)) {
      return sendMockMessage(content, receiverId);
    }
    throw error;
  }
};

// Marquer les messages comme lus
export const markMessagesAsRead = async (chatId: number): Promise<void> => {
  try {
    await API.put(`/api/chat/conversation/${chatId}/read`);
  } catch (error: any) {
    console.warn(
      "Backend indisponible, utilisation des données mock:",
      error.message
    );
    if (shouldUseMock(error)) {
      return markMockMessagesAsRead(chatId);
    }
    throw error;
  }
};

// Compter les messages non lus
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await API.get("/api/chat/unread-count");
    return response.data;
  } catch (error: any) {
    console.warn(
      "Backend indisponible, utilisation des données mock:",
      error.message
    );
    if (shouldUseMock(error)) {
      return getMockUnreadCount();
    }
    throw error;
  }
};

export default {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
};
