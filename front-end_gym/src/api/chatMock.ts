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
