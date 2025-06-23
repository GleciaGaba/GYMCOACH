import { Conversation, Message } from "../api/chat";

export const mockConversations: Conversation[] = [
  {
    id: 1,
    otherUserId: 2,
    otherUserName: "Jean Dupont",
    lastMessage: "Salut coach ! Comment ça va ?",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    unreadCount: 2,
  },
  {
    id: 2,
    otherUserId: 3,
    otherUserName: "Marie Martin",
    lastMessage: "Merci pour les conseils d'entraînement",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    unreadCount: 0,
  },
  {
    id: 3,
    otherUserId: 4,
    otherUserName: "Pierre Durand",
    lastMessage: "Je vais essayer cet exercice demain",
    lastMessageTimestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 2
    ).toISOString(), // 2 hours ago
    unreadCount: 1,
  },
  {
    id: 4,
    otherUserId: 5,
    otherUserName: "Sophie Bernard",
    lastMessage: "Bonjour ! J'ai une question sur mon programme",
    lastMessageTimestamp: new Date(
      Date.now() - 1000 * 60 * 60 * 24
    ).toISOString(), // 1 day ago
    unreadCount: 0,
  },
];

export const mockMessages: { [key: number]: Message[] } = {
  2: [
    {
      id: 1,
      content: "Salut coach ! Comment ça va ?",
      senderId: 2,
      receiverId: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
    },
    {
      id: 2,
      content: "Très bien merci ! Et toi ?",
      senderId: 1,
      receiverId: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      read: true,
    },
    {
      id: 3,
      content: "Super ! J'ai bien progressé cette semaine",
      senderId: 2,
      receiverId: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      read: false,
    },
  ],
  3: [
    {
      id: 4,
      content: "Merci pour les conseils d'entraînement",
      senderId: 3,
      receiverId: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true,
    },
    {
      id: 5,
      content: "De rien ! Continue comme ça",
      senderId: 1,
      receiverId: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: true,
    },
  ],
  4: [
    {
      id: 6,
      content: "Je vais essayer cet exercice demain",
      senderId: 4,
      receiverId: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
    },
  ],
  5: [
    {
      id: 7,
      content: "Bonjour ! J'ai une question sur mon programme",
      senderId: 5,
      receiverId: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
    },
    {
      id: 8,
      content: "Bien sûr ! Dis-moi ce qui te pose problème",
      senderId: 1,
      receiverId: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      read: true,
    },
  ],
};

export const mockUserNames: { [key: number]: string } = {
  2: "Jean Dupont",
  3: "Marie Martin",
  4: "Pierre Durand",
  5: "Sophie Bernard",
};

// Fonction pour simuler un délai réseau
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Fonction pour simuler une erreur réseau
export const simulateNetworkError = (probability: number = 0.1): boolean => {
  return Math.random() < probability;
};
