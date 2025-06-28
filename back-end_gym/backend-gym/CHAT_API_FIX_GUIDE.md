# 🔧 Guide de correction - API Chat - Problème senderId

## 🚨 Problème identifié

**Problème côté frontend :**

- Le champ `senderId` était toujours `undefined` dans les messages retournés par l'API `/api/chat/conversation/:id`
- Le frontend ne pouvait pas identifier correctement l'expéditeur de chaque message (coach ou sportif)

**Cause racine :**

- Le modèle `Message` utilisait `authorId` au lieu de `senderId`
- Il manquait le champ `receiverId` dans le modèle
- Les DTOs ne mappaient pas correctement ces champs

---

## ✅ Corrections apportées

### **1. Mise à jour du modèle Message**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/model/Message.java`

**Changements :**

- ✅ Ajout du champ `senderId` (attendu par le frontend)
- ✅ Ajout du champ `receiverId` (attendu par le frontend)
- ✅ Conservation du champ `authorId` pour la compatibilité
- ✅ Nouveau constructeur avec `senderId` et `receiverId`

```java
@Field("senderId")
private String senderId; // ID de l'expéditeur (attendu par le frontend)

@Field("receiverId")
private String receiverId; // ID du destinataire (attendu par le frontend)

// Nouveau constructeur
public Message(String chatId, String senderId, String receiverId, String content) {
    this.chatId = chatId;
    this.authorId = senderId; // Compatibilité
    this.senderId = senderId; // Frontend
    this.receiverId = receiverId; // Frontend
    this.content = content;
    this.isRead = false;
    this.createdAt = LocalDateTime.now();
}
```

### **2. Mise à jour du DTO MessageDTO**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/dto/MessageDTO.java`

**Changements :**

- ✅ Ajout du champ `senderId`
- ✅ Ajout du champ `receiverId`
- ✅ Conservation du champ `authorId` pour la compatibilité

```java
private String senderId; // Frontend expectation - ID de l'expéditeur
private String receiverId; // Frontend expectation - ID du destinataire
```

### **3. Mise à jour du service ChatServiceImpl**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/service/impl/ChatServiceImpl.java`

**Changements :**

- ✅ Utilisation du nouveau constructeur `Message` avec `senderId` et `receiverId`
- ✅ Mise à jour de `convertToMessageDTO` pour inclure les nouveaux champs

```java
// Création de message avec senderId et receiverId
Message message = new Message(chat.getId(), senderId, request.getReceiverId(), request.getContent());

// Conversion DTO avec tous les champs
return MessageDTO.builder()
    .senderId(message.getSenderId())
    .receiverId(message.getReceiverId())
    // ... autres champs
    .build();
```

### **4. Migration automatique des données existantes**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/config/MongoDataInitializer.java`

**Fonctionnalité :**

- ✅ Migration automatique des messages existants au démarrage
- ✅ Ajout de `senderId = authorId` pour les messages existants
- ✅ Gestion des erreurs de migration

```java
private void migrateExistingMessages() {
    // Trouver les messages sans senderId
    Query query = new Query(Criteria.where("senderId").exists(false));
    List<Message> messagesToMigrate = mongoTemplate.find(query, Message.class);

    // Mettre à jour chaque message
    for (Message message : messagesToMigrate) {
        Update update = new Update()
            .set("senderId", message.getAuthorId())
            .set("receiverId", null);
        mongoTemplate.updateFirst(query, update, Message.class);
    }
}
```

### **5. Tests d'intégration**

**Fichier :** `src/test/java/com/gymcoach/backend_gym/controller/ChatControllerIntegrationTest.java`

**Tests ajoutés :**

- ✅ Vérification que `senderId` et `receiverId` sont présents dans les réponses
- ✅ Test d'envoi de message avec les nouveaux champs
- ✅ Test de récupération de conversation
- ✅ Test de messages non lus

---

## 📋 Format de réponse attendu

### **Avant la correction :**

```json
{
  "id": "123",
  "content": "Bonjour !",
  "authorId": "1",
  "isRead": true,
  "createdAt": "2024-06-01T12:34:56.000Z"
}
```

### **Après la correction :**

```json
{
  "id": "123",
  "content": "Bonjour !",
  "authorId": "1",
  "senderId": "1",
  "receiverId": "2",
  "isRead": true,
  "createdAt": "2024-06-01T12:34:56.000Z",
  "authorName": "John Doe",
  "authorRole": "ATHLETE",
  "isOwnMessage": false
}
```

---

## 🧪 Tests de validation

### **1. Test d'envoi de message**

```bash
POST /api/chat/send
{
  "content": "Test message",
  "receiverId": "2"
}
```

**Réponse attendue :**

```json
{
  "id": "456",
  "content": "Test message",
  "senderId": "1",
  "receiverId": "2",
  "isRead": false,
  "createdAt": "2024-06-01T12:34:56.000Z"
}
```

### **2. Test de récupération de conversation**

```bash
GET /api/chat/conversation/2
```

**Réponse attendue :**

```json
{
  "chatId": "789",
  "messages": [
    {
      "id": "123",
      "content": "Bonjour !",
      "senderId": "1",
      "receiverId": "2",
      "isRead": true,
      "createdAt": "2024-06-01T12:34:56.000Z"
    }
  ]
}
```

---

## 🚀 Déploiement

### **1. Redémarrage du backend**

```bash
mvn spring-boot:run
```

### **2. Vérification des logs**

Les logs doivent afficher :

```
🔄 Migration des messages existants...
✅ X messages migrés avec succès
```

### **3. Test de l'API**

Utilisez Postman ou curl pour tester :

```bash
curl -X GET "http://localhost:8080/api/chat/conversation/2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔍 Vérification côté frontend

### **1. Vérifier la réponse de l'API**

```javascript
// Dans la console du navigateur
fetch("http://localhost:8080/api/chat/conversation/2", {
  headers: {
    Authorization: "Bearer " + JWT_TOKEN,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Messages:", data.messages);
    // Vérifier que senderId et receiverId sont présents
    data.messages.forEach((msg) => {
      console.log(
        `Message ${msg.id}: senderId=${msg.senderId}, receiverId=${msg.receiverId}`
      );
    });
  });
```

### **2. Mise à jour du frontend**

Le frontend peut maintenant utiliser :

- `message.senderId` pour identifier l'expéditeur
- `message.receiverId` pour identifier le destinataire
- `message.authorName` pour afficher le nom de l'expéditeur

---

## ✅ Checklist de validation

- [ ] Backend redémarré avec succès
- [ ] Migration des messages existants effectuée
- [ ] API `/api/chat/send` retourne `senderId` et `receiverId`
- [ ] API `/api/chat/conversation/:id` retourne `senderId` et `receiverId`
- [ ] Tests d'intégration passent
- [ ] Frontend peut identifier correctement les expéditeurs
- [ ] Aucune régression dans les fonctionnalités existantes

---

## 🎯 Résultat attendu

**Problème résolu :**

- ✅ Le champ `senderId` est maintenant présent dans tous les messages
- ✅ Le champ `receiverId` est maintenant présent dans tous les messages
- ✅ Le frontend peut identifier correctement l'expéditeur de chaque message
- ✅ Compatibilité maintenue avec l'ancien format (`authorId`)

**Fonctionnalités préservées :**

- ✅ Envoi de messages
- ✅ Récupération de conversations
- ✅ Messages non lus
- ✅ Marquage comme lu
- ✅ WebSocket en temps réel

---

**💡 Note :** Cette correction est rétrocompatible. Les messages existants sont automatiquement migrés et les nouveaux messages utilisent le format attendu par le frontend.
