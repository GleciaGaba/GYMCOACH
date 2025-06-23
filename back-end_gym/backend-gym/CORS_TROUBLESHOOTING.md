# 🚨 Guide de dépannage CORS - Erreur port 5177

## ✅ Problème résolu !

**Erreur rencontrée :**

```
Access to XMLHttpRequest at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:5177' has been blocked by CORS policy
```

**Solution appliquée :**

- ✅ Ajout du port `5177` à la configuration CORS dans `SecurityConfig.java`
- ✅ Ajout du port `5177` à la configuration WebSocket dans `WebSocketConfig.java`
- ✅ Mise à jour des guides de documentation

---

## 🔧 Configuration CORS mise à jour

### **Ports maintenant autorisés :**

- `http://localhost:5173` (Vite default)
- `http://localhost:5174` (Vite alternative)
- `http://localhost:5175` (Vite alternative)
- `http://localhost:5176` (Vite alternative)
- `http://localhost:5177` (Vite alternative) ← **NOUVEAU**
- `http://localhost:3000` (React default)
- `http://localhost:8080` (Spring Boot)

---

## 🚀 Actions à effectuer

### **1. Redémarrer le backend Spring Boot**

```bash
# Arrêtez votre application Spring Boot (Ctrl+C)
# Puis redémarrez-la
mvn spring-boot:run
```

### **2. Vérifier que les changements sont appliqués**

Dans les logs du démarrage, vous devriez voir :

```
CORS configuration applied
WebSocket endpoint registered
```

### **3. Tester la connexion**

Votre frontend sur `http://localhost:5177` devrait maintenant pouvoir :

- ✅ Se connecter à l'API REST
- ✅ Se connecter au WebSocket
- ✅ Envoyer et recevoir des messages

---

## 🧪 Test rapide

### **Test API REST :**

```javascript
// Dans la console du navigateur
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "test@example.com",
    password: "password",
  }),
})
  .then((response) => console.log("✅ CORS OK:", response.status))
  .catch((error) => console.error("❌ CORS Error:", error));
```

### **Test WebSocket :**

```javascript
// Dans la console du navigateur
const socket = new SockJS("http://localhost:8080/ws");
const stompClient = Stomp.over(socket);
stompClient.connect(
  {},
  () => console.log("✅ WebSocket OK"),
  (error) => console.error("❌ WebSocket Error:", error)
);
```

---

## 🚨 Si le problème persiste

### **Vérifications à effectuer :**

1. **Backend démarré ?**

   ```bash
   # Vérifiez que le backend tourne sur le port 8080
   curl http://localhost:8080/actuator/health
   ```

2. **Port correct ?**

   - Vérifiez que votre frontend utilise bien le port 5177
   - Vérifiez l'URL dans la barre d'adresse du navigateur

3. **Cache du navigateur ?**

   - Videz le cache du navigateur (Ctrl+Shift+R)
   - Ou ouvrez une fenêtre de navigation privée

4. **Headers corrects ?**
   - Vérifiez que vous envoyez bien `Content-Type: application/json`
   - Pour les requêtes authentifiées : `Authorization: Bearer <token>`

### **Debug avancé :**

1. **Ouvrir les DevTools** (F12)
2. **Aller dans l'onglet Network**
3. **Effectuer la requête qui pose problème**
4. **Vérifier les headers de la requête OPTIONS (preflight)**

Vous devriez voir :

```
Access-Control-Allow-Origin: http://localhost:5177
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD, TRACE, CONNECT
Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, Accept, *
```

---

## 📞 Si rien ne fonctionne

1. **Vérifiez les logs du backend** pour des erreurs
2. **Testez avec Postman** pour isoler le problème
3. **Vérifiez la configuration** dans `SecurityConfig.java`
4. **Contactez l'équipe backend** avec les logs d'erreur

---

## 🎯 Prochaines étapes

Une fois CORS résolu :

1. ✅ Testez l'authentification (`/api/auth/login`)
2. ✅ Testez les endpoints de chat
3. ✅ Testez la connexion WebSocket
4. ✅ Intégrez dans votre application frontend

---

**💡 Conseil :** Si vous utilisez un port différent à l'avenir, ajoutez-le simplement à la liste des `allowedOrigins` dans `SecurityConfig.java` et redémarrez le backend.
