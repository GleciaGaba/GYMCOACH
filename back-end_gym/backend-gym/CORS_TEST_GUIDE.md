# 🔧 Guide de Test CORS - Chat API

## ✅ Configuration CORS appliquée

### **Ports autorisés :**

- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternative)
- `http://localhost:5175` (Vite alternative)
- `http://localhost:5176` (Vite alternative)
- `http://localhost:5177` (Vite alternative)
- `http://localhost:3000` (React default)
- `http://localhost:8080` (Spring Boot)

### **Méthodes HTTP autorisées :**

- GET, POST, PUT, DELETE, OPTIONS, HEAD, TRACE, CONNECT

### **Headers autorisés :**

- Authorization, Content-Type, X-Requested-With, Accept, \*

---

## 🧪 Tests à effectuer

### **1. Test API REST (avec Postman ou navigateur)**

```bash
# Test 1: Récupérer les conversations
GET http://localhost:8080/api/chat/conversations
Headers:
  Authorization: Bearer <votre_jwt_token>
  Content-Type: application/json

# Test 2: Envoyer un message
POST http://localhost:8080/api/chat/send
Headers:
  Authorization: Bearer <votre_jwt_token>
  Content-Type: application/json
Body:
{
  "content": "Test message",
  "receiverId": "2"
}
```

### **2. Test WebSocket (avec navigateur console)**

```javascript
// Test de connexion WebSocket
const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: "Bearer " + JWT_TOKEN },
  function (frame) {
    console.log("✅ WebSocket connecté:", frame);
  },
  function (error) {
    console.error("❌ Erreur WebSocket:", error);
  }
);
```

### **3. Test depuis le frontend**

```javascript
// Test API REST depuis le frontend
fetch("http://localhost:8080/api/chat/conversations", {
  method: "GET",
  headers: {
    Authorization: "Bearer " + JWT_TOKEN,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    console.log("✅ API REST fonctionne:", response.status);
    return response.json();
  })
  .then((data) => console.log("Données:", data))
  .catch((error) => console.error("❌ Erreur API:", error));
```

---

## 🚨 Erreurs CORS courantes et solutions

### **Erreur : "Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:5176' has been blocked by CORS policy"**

**Solutions :**

1. ✅ Vérifiez que le backend tourne sur le port 8080
2. ✅ Vérifiez que le frontend utilise un des ports autorisés
3. ✅ Redémarrez le backend après modification de la config CORS
4. ✅ Vérifiez que le header `Authorization` est bien envoyé

### **Erreur : "WebSocket connection to 'ws://localhost:8080/ws' failed"**

**Solutions :**

1. ✅ Vérifiez que le backend supporte WebSocket
2. ✅ Vérifiez que l'URL WebSocket est correcte
3. ✅ Vérifiez que le token JWT est valide
4. ✅ Vérifiez les logs du backend pour les erreurs d'authentification

---

## 📋 Checklist de vérification

- [ ] Backend Spring Boot démarré sur le port 8080
- [ ] MongoDB démarré et accessible
- [ ] MySQL démarré et accessible
- [ ] JWT token valide obtenu via `/api/auth/login`
- [ ] Test API REST réussi (status 200)
- [ ] Test WebSocket réussi (connexion établie)
- [ ] Frontend peut envoyer des requêtes sans erreur CORS
- [ ] Messages peuvent être envoyés et reçus en temps réel

---

## 🔍 Debug avancé

### **Vérifier les logs Spring Boot :**

```bash
# Dans les logs du backend, cherchez :
- "CORS configuration applied"
- "WebSocket endpoint registered"
- "User authenticated for WebSocket"
```

### **Vérifier les requêtes réseau :**

1. Ouvrez les DevTools du navigateur
2. Allez dans l'onglet "Network"
3. Vérifiez que les requêtes OPTIONS (preflight) passent
4. Vérifiez que les requêtes principales ont le bon status

### **Test avec curl :**

```bash
# Test preflight CORS
curl -X OPTIONS http://localhost:8080/api/chat/conversations \
  -H "Origin: http://localhost:5176" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Test réel
curl -X GET http://localhost:8080/api/chat/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Origin: http://localhost:5176" \
  -v
```

---

## 🎯 Prochaines étapes

Une fois CORS configuré et testé :

1. **Intégrer dans le frontend** l'exemple JavaScript fourni
2. **Tester l'envoi/réception de messages** en temps réel
3. **Implémenter l'interface utilisateur** (liste des conversations, fenêtre de chat)
4. **Ajouter les fonctionnalités avancées** (indicateur de frappe, notifications)

---

**💡 Conseil :** Si vous avez encore des problèmes CORS, vérifiez que votre frontend n'utilise pas un proxy ou une configuration qui pourrait interférer avec les requêtes directes vers le backend.
