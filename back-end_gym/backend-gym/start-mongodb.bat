@echo off
REM ============================================================================
REM SCRIPT DE DÉMARRAGE MONGODB POUR WINDOWS
REM ============================================================================
REM 
REM Ce script vérifie si MongoDB est en cours d'exécution et le démarre si nécessaire.
REM Il gère les cas où MongoDB n'est pas installé et fournit des instructions.
REM
REM Utilisation : Double-cliquez sur ce fichier ou exécutez-le depuis la ligne de commande
REM ============================================================================

echo 🚀 Démarrage de MongoDB...
echo.

REM ============================================================================
REM VÉRIFICATION SI MONGODB EST DÉJÀ EN COURS D'EXÉCUTION
REM ============================================================================

REM Utiliser netstat pour vérifier si le port 27017 (port par défaut MongoDB) est utilisé
REM findstr :27017 recherche les lignes contenant ":27017" dans la sortie de netstat
REM > nul redirige la sortie vers nul (supprime l'affichage)
netstat -an | findstr :27017 > nul

REM %errorlevel% contient le code de retour de la commande précédente
REM equ 0 signifie que la commande s'est bien exécutée (port trouvé)
if %errorlevel% equ 0 (
    echo ✅ MongoDB est déjà en cours d'exécution sur le port 27017
    echo    Aucune action nécessaire, vous pouvez continuer.
    goto :end
)

REM ============================================================================
REM TENTATIVE DE DÉMARRAGE DE MONGODB
REM ============================================================================

echo 📝 Tentative de démarrage de MongoDB...
echo.

REM ============================================================================
REM VÉRIFICATION DE L'INSTALLATION MONGODB
REM ============================================================================

REM Tester si la commande mongod est disponible dans le PATH système
REM --version affiche la version de MongoDB si installé
REM > nul 2>&1 redirige la sortie standard ET les erreurs vers nul
mongod --version > nul 2>&1

REM Si mongod est trouvé (errorlevel = 0), démarrer MongoDB
if %errorlevel% equ 0 (
    echo 🎯 MongoDB trouvé, démarrage en cours...
    
    REM ============================================================================
    REM DÉMARRAGE DE MONGODB EN ARRIÈRE-PLAN
    REM ============================================================================
    
    REM start "MongoDB" lance une nouvelle fenêtre avec le titre "MongoDB"
    REM mongod --dbpath C:\data\db démarre MongoDB avec le répertoire de données spécifié
    REM Le répertoire C:\data\db est l'emplacement par défaut des données MongoDB
    start "MongoDB" mongod --dbpath C:\data\db
    
    REM ============================================================================
    REM PAUSE POUR LAISSER LE TEMPS À MONGODB DE DÉMARRER
    REM ============================================================================
    
    REM Attendre 3 secondes pour laisser MongoDB se lancer complètement
    REM /nobreak empêche l'arrêt de l'attente avec Ctrl+C
    REM > nul supprime l'affichage du compte à rebours
    timeout /t 3 /nobreak > nul
    
    echo ✅ MongoDB démarré avec succès !
    echo    Base de données accessible sur localhost:27017
) else (
    REM ============================================================================
    REM MONGODB NON INSTALLÉ - AFFICHAGE DES INSTRUCTIONS
    REM ============================================================================
    
    echo ❌ MongoDB n'est pas installé ou n'est pas dans le PATH
    echo.
    echo 📋 Instructions d'installation MongoDB :
    echo.
    echo 1. Téléchargez MongoDB Community Server depuis : 
    echo    https://www.mongodb.com/try/download/community
    echo.
    echo 2. Installez MongoDB en suivant les instructions d'installation
    echo    - Choisissez "Complete" installation
    echo    - Cochez "Install MongoDB as a Service" si vous voulez un démarrage automatique
    echo.
    echo 3. Ajoutez MongoDB au PATH système :
    echo    - Ouvrez les Variables d'environnement système
    echo    - Ajoutez C:\Program Files\MongoDB\Server\[version]\bin au PATH
    echo.
    echo 4. Créez le dossier C:\data\db pour les données :
    echo    mkdir C:\data\db
    echo.
    echo 🔧 Alternative : Utilisez MongoDB Atlas (cloud)
    echo    - Créez un compte sur https://www.mongodb.com/atlas
    echo    - Créez un cluster gratuit
    echo    - Modifiez l'URI dans application.properties
    echo    - Exemple : mongodb+srv://username:password@cluster.mongodb.net/gymcoach
)

REM ============================================================================
REM FIN DU SCRIPT
REM ============================================================================

:end
echo.
echo 🎯 Vous pouvez maintenant démarrer votre application Spring Boot
echo    avec la commande : mvn spring-boot:run
echo.
echo 📌 Pour arrêter MongoDB plus tard :
echo    - Fermez la fenêtre MongoDB ou
echo    - Utilisez Ctrl+C dans la fenêtre MongoDB
echo.

REM ============================================================================
REM PAUSE FINALE POUR LIRE LES MESSAGES
REM ============================================================================

REM Pause pour permettre à l'utilisateur de lire les messages avant fermeture
pause 