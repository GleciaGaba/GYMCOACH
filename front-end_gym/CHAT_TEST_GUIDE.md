# Guide de Test - Système de Chat

## 🧪 Tests à Effectuer

### 1. **Test de Connexion et Authentification**

#### ✅ Test de Login

- [ ] Se connecter en tant que coach
- [ ] Se connecter en tant que sportif
- [ ] Vérifier que le JWT est stocké
- [ ] Vérifier que l'utilisateur est redirigé vers le bon dashboard

#### ✅ Test d'Accès au Chat

- [ ] Accéder au chat depuis le dashboard coach
- [ ] Accéder au chat depuis le dashboard sportif
- [ ] Vérifier que l'URL `/chat` fonctionne
- [ ] Vérifier que les utilisateurs non connectés sont redirigés

### 2. **Test de l'Interface Utilisateur**

#### ✅ Test de la Liste des Conversations

- [ ] Vérifier que la liste se charge correctement
- [ ] Vérifier l'affichage des avatars avec initiales
- [ ] Vérifier l'affichage des badges de messages non lus
- [ ] Vérifier le formatage des timestamps
- [ ] Vérifier la sélection d'une conversation

#### ✅ Test de la Recherche

- [ ] Taper dans la barre de recherche
- [ ] Vérifier le filtrage par nom d'utilisateur
- [ ] Vérifier le filtrage par contenu de message
- [ ] Vérifier le bouton d'effacement de recherche
- [ ] Vérifier l'affichage "Aucune conversation trouvée"

#### ✅ Test de la Fenêtre de Chat

- [ ] Vérifier l'affichage des messages
- [ ] Vérifier la distinction messages envoyés/reçus
- [ ] Vérifier l'affichage des timestamps
- [ ] Vérifier les indicateurs de lecture (✓/✓✓)
- [ ] Vérifier le scroll automatique

### 3. **Test des Fonctionnalités Temps Réel**

#### ✅ Test WebSocket

- [ ] Vérifier l'indicateur de statut de connexion
- [ ] Vérifier la reconnexion automatique
- [ ] Vérifier les tentatives de reconnexion
- [ ] Vérifier l'affichage des erreurs

#### ✅ Test des Indicateurs de Frappe

- [ ] Taper dans la zone de saisie
- [ ] Vérifier l'envoi de l'événement "typing"
- [ ] Vérifier l'affichage "X est en train d'écrire..."
- [ ] Vérifier l'arrêt de l'indicateur après 2 secondes

#### ✅ Test des Notifications

- [ ] Recevoir un message dans une autre conversation
- [ ] Vérifier l'affichage de la notification
- [ ] Vérifier l'auto-fermeture après 5 secondes
- [ ] Vérifier le clic pour ouvrir la conversation

### 4. **Test de l'Envoi de Messages**

#### ✅ Test d'Envoi

- [ ] Taper un message et appuyer sur Entrée
- [ ] Taper un message et cliquer sur "Envoyer"
- [ ] Vérifier l'ajout du message à la conversation
- [ ] Vérifier l'envoi via REST API
- [ ] Vérifier l'envoi via WebSocket

#### ✅ Test de Validation

- [ ] Essayer d'envoyer un message vide
- [ ] Vérifier que le bouton est désactivé
- [ ] Vérifier les messages d'erreur

### 5. **Test de Responsive Design**

#### ✅ Test Mobile

- [ ] Tester sur écran mobile (768px)
- [ ] Vérifier la disposition en colonnes
- [ ] Vérifier la taille des éléments
- [ ] Vérifier la navigation tactile

#### ✅ Test Desktop

- [ ] Tester sur écran large
- [ ] Vérifier la disposition côte à côte
- [ ] Vérifier les animations
- [ ] Vérifier les hover effects

### 6. **Test de Gestion d'Erreurs**

#### ✅ Test de Perte de Connexion

- [ ] Simuler une perte de réseau
- [ ] Vérifier l'indicateur de déconnexion
- [ ] Vérifier les tentatives de reconnexion
- [ ] Vérifier la récupération automatique

#### ✅ Test d'Erreurs API

- [ ] Simuler une erreur 401 (token expiré)
- [ ] Vérifier la redirection vers login
- [ ] Simuler une erreur 500
- [ ] Vérifier l'affichage des messages d'erreur

### 7. **Test de Performance**

#### ✅ Test de Chargement

- [ ] Mesurer le temps de chargement initial
- [ ] Vérifier l'affichage des spinners
- [ ] Vérifier la pagination (si implémentée)

#### ✅ Test de Mémoire

- [ ] Ouvrir plusieurs conversations
- [ ] Vérifier la gestion de la mémoire
- [ ] Vérifier l'absence de fuites mémoire

## 🚀 Scénarios de Test

### **Scénario 1 : Conversation Coach-Sportif**

1. Ouvrir deux onglets navigateur
2. Se connecter en tant que coach dans l'onglet 1
3. Se connecter en tant que sportif dans l'onglet 2
4. Accéder au chat dans les deux onglets
5. Envoyer des messages dans les deux sens
6. Vérifier la réception en temps réel
7. Tester les indicateurs de frappe
8. Vérifier les notifications

### **Scénario 2 : Gestion des Erreurs**

1. Démarrer une conversation
2. Couper la connexion internet
3. Essayer d'envoyer un message
4. Vérifier l'affichage de l'erreur
5. Rétablir la connexion
6. Vérifier la reconnexion automatique
7. Vérifier que les messages sont envoyés

### **Scénario 3 : Interface Utilisateur**

1. Tester la recherche de conversations
2. Tester la navigation entre conversations
3. Tester l'affichage des messages non lus
4. Tester le responsive design
5. Tester les animations et transitions

## 📊 Métriques à Vérifier

### **Performance**

- Temps de chargement initial : < 2 secondes
- Temps de réponse WebSocket : < 100ms
- Temps d'affichage des messages : < 500ms

### **Fiabilité**

- Taux de reconnexion WebSocket : > 95%
- Taux de livraison des messages : 100%
- Gestion des erreurs : 100%

### **UX**

- Responsive design : 100% des écrans
- Accessibilité : WCAG 2.1 AA
- Navigation intuitive : 100%

## 🐛 Bugs Courants à Vérifier

### **Problèmes de Connexion**

- [ ] WebSocket ne se connecte pas
- [ ] Reconnexion en boucle
- [ ] Perte de messages pendant la reconnexion

### **Problèmes d'Interface**

- [ ] Messages qui ne s'affichent pas
- [ ] Scroll qui ne fonctionne pas
- [ ] Indicateurs de frappe qui restent bloqués

### **Problèmes de Performance**

- [ ] Lenteur lors du chargement
- [ ] Consommation mémoire excessive
- [ ] Ralentissement avec beaucoup de messages

## ✅ Checklist de Validation

### **Fonctionnalités Core**

- [ ] Connexion WebSocket
- [ ] Envoi/réception de messages
- [ ] Indicateurs de frappe
- [ ] Statut de lecture
- [ ] Notifications

### **Interface**

- [ ] Liste des conversations
- [ ] Fenêtre de chat
- [ ] Recherche
- [ ] Responsive design
- [ ] Animations

### **Robustesse**

- [ ] Gestion des erreurs
- [ ] Reconnexion automatique
- [ ] Validation des données
- [ ] Sécurité

### **Performance**

- [ ] Temps de réponse
- [ ] Gestion mémoire
- [ ] Optimisations

## 📝 Rapport de Test

Après chaque test, documenter :

- ✅ Fonctionnalité testée
- ✅ Résultat attendu
- ✅ Résultat obtenu
- ✅ Problèmes rencontrés
- ✅ Actions correctives

---

**Note** : Ce guide doit être utilisé à chaque déploiement et mise à jour majeure du système de chat.
