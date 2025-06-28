import { Conversation, Message } from "./chat";
import {
  mockConversations,
  mockMessages,
  simulateNetworkDelay,
  simulateNetworkError,
} from "../utils/mockData";

export const getConversations = async (): Promise<Conversation[]> => {
  await simulateNetworkDelay();

  if (simulateNetworkError()) {
    throw new Error("Erreur réseau simulée");
  }

  return mockConversations;
};

export const getConversationMessages = async (
  otherUserId: number
): Promise<Message[]> => {
  await simulateNetworkDelay();

  if (simulateNetworkError()) {
    throw new Error("Erreur réseau simulée");
  }

  return mockMessages[otherUserId] || [];
};

export const sendMessage = async (
  content: string,
  receiverId: number
): Promise<Message> => {
  await simulateNetworkDelay(300);

  if (simulateNetworkError()) {
    throw new Error("Erreur réseau simulée");
  }

  const newMessage: Message = {
    id: Date.now(),
    content,
    senderId: 1, // ID de l'utilisateur connecté
    receiverId,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Ajouter le message aux données mock
  if (!mockMessages[receiverId]) {
    mockMessages[receiverId] = [];
  }
  mockMessages[receiverId].push(newMessage);

  // Mettre à jour ou créer la conversation
  const existingConversationIndex = mockConversations.findIndex(
    (conv) => conv.otherUserId === receiverId
  );

  if (existingConversationIndex >= 0) {
    // Mettre à jour la conversation existante
    mockConversations[existingConversationIndex] = {
      ...mockConversations[existingConversationIndex],
      lastMessage: content,
      lastMessageTimestamp: newMessage.timestamp,
      unreadCount: 0, // Le message envoyé par l'utilisateur actuel n'est pas non lu
    };
  } else {
    // Créer une nouvelle conversation
    const newConversation: Conversation = {
      id: Date.now(),
      otherUserId: receiverId,
      otherUserName: `Utilisateur ${receiverId}`, // En mode réel, on récupérerait le nom depuis l'API
      lastMessage: content,
      lastMessageTimestamp: newMessage.timestamp,
      unreadCount: 0,
    };
    mockConversations.push(newConversation);
  }

  return newMessage;
};

export const markMessagesAsRead = async (chatId: number): Promise<void> => {
  await simulateNetworkDelay(200);
  return;
};

export const getUnreadCount = async (): Promise<number> => {
  await simulateNetworkDelay(100);
  return mockConversations.reduce((total, conv) => total + conv.unreadCount, 0);
};

export default {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
};
