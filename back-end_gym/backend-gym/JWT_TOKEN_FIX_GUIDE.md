# 🔧 Guide de correction - Token JWT - Problème senderId

## 🚨 Problème identifié

**Problème côté frontend :**

- Le token JWT contenait l'email dans le champ `sub` au lieu de l'ID utilisateur
- Cela empêchait le frontend d'identifier correctement l'expéditeur des messages
- Le frontend s'attendait à recevoir l'ID utilisateur dans le token pour identifier les expéditeurs

**Cause racine :**

- Le token JWT utilisait l'email comme `subject` au lieu de l'ID utilisateur
- Les autres fonctionnalités utilisaient l'email pour l'authentification
- Il fallait ajouter l'ID utilisateur sans casser l'existant

---

## ✅ Corrections apportées

### **1. Mise à jour de JwtUtils.java**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/security/JwtUtils.java`

**Changements :**

- ✅ Nouvelle méthode `generateToken(Long userId, String email, String role)` avec ID dans `sub`
- ✅ Conservation de l'ancienne méthode `generateToken(String email)` pour compatibilité
- ✅ Nouvelle méthode `getUserIdFromToken(String token)` pour extraire l'ID
- ✅ Nouvelle méthode `getRoleFromToken(String token)` pour extraire le rôle
- ✅ Mise à jour de `getEmailFromToken(String token)` pour gérer les deux formats

```java
// Nouveau format : ID dans 'sub', email et role dans des claims séparés
public String generateToken(Long userId, String email, String role) {
    return Jwts.builder()
        .setSubject(String.valueOf(userId))  // ID dans 'sub' (frontend expectation)
        .claim("email", email)               // Email dans un claim séparé
        .claim("role", role)                 // Rôle dans un claim séparé
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + jwtExpirationMs))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}

// Ancien format : email dans 'sub' (compatibilité)
public String generateToken(String email) {
    return Jwts.builder()
        .setSubject(email)  // Email dans 'sub' (ancien format)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + jwtExpirationMs))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

### **2. Mise à jour de AuthResponse.java**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/dto/AuthResponse.java`

**Changements :**

- ✅ Ajout du champ `userId` dans la réponse de login
- ✅ Conservation de tous les champs existants pour compatibilité

```java
public class AuthResponse {
    private String token;
    private String email;
    private String message;
    private String role;
    private String firstName;
    private String lastName;
    private Long userId; // Nouveau champ pour l'ID utilisateur
}
```

### **3. Mise à jour de AuthServiceImpl.java**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/service/impl/AuthServiceImpl.java`

**Changements :**

- ✅ Utilisation du nouveau format de token avec ID utilisateur
- ✅ Inclusion de l'ID utilisateur dans la réponse de login

```java
@Override
public AuthResponse login(LoginRequest req) {
    // ... validation existante ...

    // Générer le token avec le nouveau format (ID dans 'sub', email et role dans des claims)
    String token = jwtUtils.generateToken(user.getId().longValue(), user.getEmail(), user.getRole());

    AuthResponse response = new AuthResponse();
    response.setToken(token);
    response.setEmail(user.getEmail());
    response.setMessage(message);
    response.setRole(user.getRole());
    response.setFirstName(user.getFirstName());
    response.setLastName(user.getLastName());
    response.setUserId(user.getId().longValue()); // Nouveau champ
    return response;
}
```

### **4. Mise à jour de ChatController.java**

**Fichier :** `src/main/java/com/gymcoach/backend_gym/controller/ChatController.java`

**Changements :**

- ✅ Ajout de `JwtUtils` dans les dépendances
- ✅ Mise à jour de `getCurrentUserId()` pour utiliser le nouveau format de token
- ✅ Fallback vers l'ancienne méthode si le nouveau format échoue

```java
private String getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() != null) {
        // Essayer d'abord de récupérer l'ID depuis le token JWT
        try {
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
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return String.valueOf(user.getId());
    }
    throw new RuntimeException("Utilisateur non authentifié");
}
```

### **5. Tests d'intégration**

**Fichier :** `src/test/java/com/gymcoach/backend_gym/security/JwtUtilsTest.java`

**Tests ajoutés :**

- ✅ Test de génération de token avec ID utilisateur
- ✅ Test de génération de token avec email (compatibilité)
- ✅ Test d'extraction d'email depuis les deux formats
- ✅ Test d'extraction d'ID utilisateur depuis le nouveau format
- ✅ Test d'extraction de rôle depuis le nouveau format

---

## 📋 Format de token avant/après

### **Avant la correction :**

```json
{
  "sub": "user@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **Après la correction :**

```json
{
  "sub": "123",
  "email": "user@example.com",
  "role": "COACH",
  "iat": 1640995200,
  "exp": 1641081600
}
```

---

## 🧪 Tests de validation

### **1. Test de génération de token**

```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password"
}
```

**Réponse attendue :**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "test@example.com",
  "role": "COACH",
  "firstName": "John",
  "lastName": "Doe",
  "userId": 123,
  "message": null
}
```

### **2. Test de décodage côté frontend**

Le frontend peut maintenant décoder le token et obtenir :

- `sub` : ID de l'utilisateur (123)
- `email` : Email de l'utilisateur (test@example.com)
- `role` : Rôle de l'utilisateur (COACH)

### **3. Test des fonctionnalités existantes**

- ✅ Authentification continue de fonctionner
- ✅ Les tokens existants sont toujours valides
- ✅ Migration progressive sans rupture

---

## 🔄 Migration sécurisée

### **1. Compatibilité maintenue**

- ✅ Les tokens existants continuent de fonctionner
- ✅ L'ancien format est toujours supporté
- ✅ Fallback automatique vers l'ancienne méthode

### **2. Validation hybride**

```java
public String getEmailFromToken(String token) {
    try {
        // Essayer d'abord le nouveau format (email dans claim)
        Claims claims = parseClaims(token);
        String email = claims.get("email", String.class);
        if (email != null) {
            return email;
        }
        // Fallback vers l'ancien format (email dans 'sub')
        return claims.getSubject();
    } catch (Exception e) {
        return parseClaims(token).getSubject();
    }
}
```

### **3. Extraction d'ID utilisateur**

```java
public Long getUserIdFromToken(String token) {
    try {
        Claims claims = parseClaims(token);
        String subject = claims.getSubject();
        // Vérifier si le subject est un nombre (ID) ou un email
        try {
            return Long.valueOf(subject);
        } catch (NumberFormatException e) {
            // Ancien format : email dans 'sub', pas d'ID disponible
            return null;
        }
    } catch (Exception e) {
        return null;
    }
}
```

---

## 🚀 Déploiement

### **1. Redémarrage du backend**

```bash
mvn spring-boot:run
```

### **2. Test de l'API de login**

```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```

### **3. Vérification du token**

Décodez le token sur jwt.io pour vérifier que :

- `sub` contient l'ID utilisateur
- `email` contient l'email
- `role` contient le rôle

---

## 🔍 Vérification côté frontend

### **1. Décodage du token**

```javascript
// Dans la console du navigateur
const token = "eyJhbGciOiJIUzI1NiJ9...";
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("User ID:", payload.sub);
console.log("Email:", payload.email);
console.log("Role:", payload.role);
```

### **2. Mise à jour du frontend**

Le frontend peut maintenant utiliser :

- `payload.sub` pour l'ID utilisateur
- `payload.email` pour l'email
- `payload.role` pour le rôle

---

## ✅ Checklist de validation

- [ ] Backend redémarré avec succès
- [ ] API `/api/auth/login` retourne `userId` dans la réponse
- [ ] Token JWT contient l'ID utilisateur dans `sub`
- [ ] Token JWT contient l'email dans le claim `email`
- [ ] Token JWT contient le rôle dans le claim `role`
- [ ] Tests d'intégration passent
- [ ] Frontend peut identifier correctement les expéditeurs
- [ ] Aucune régression dans les fonctionnalités existantes
- [ ] Tokens existants continuent de fonctionner

---

## 🎯 Résultat attendu

**Problème résolu :**

- ✅ Le token JWT contient maintenant l'ID utilisateur dans le champ `sub`
- ✅ Le frontend peut identifier correctement l'expéditeur de chaque message
- ✅ L'email et le rôle restent accessibles via des claims séparés
- ✅ Compatibilité maintenue avec l'ancien format de token

**Fonctionnalités préservées :**

- ✅ Authentification JWT
- ✅ Tokens existants valides
- ✅ Extraction d'email depuis les deux formats
- ✅ Migration progressive sans rupture

---

## 🔧 Avantages de cette approche

✅ **Compatibilité** : Les tokens existants continuent de fonctionner
✅ **Frontend corrigé** : Le champ `sub` contient maintenant l'ID
✅ **Email préservé** : L'email reste accessible via le claim `email`
✅ **Migration progressive** : Pas de rupture de service
✅ **Rollback possible** : Facile de revenir en arrière si nécessaire
✅ **Tests complets** : Validation de tous les cas d'usage

---

**💡 Note :** Cette correction est rétrocompatible. Les nouveaux tokens utilisent le format attendu par le frontend, tandis que les anciens tokens continuent de fonctionner grâce au système de fallback.
