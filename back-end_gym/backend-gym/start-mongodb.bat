@echo off
echo 🚀 Démarrage de MongoDB...
echo.

REM Vérifier si MongoDB est déjà en cours d'exécution
netstat -an | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB est déjà en cours d'exécution sur le port 27017
    goto :end
)

REM Essayer de démarrer MongoDB
echo 📝 Tentative de démarrage de MongoDB...
echo.

REM Essayer différentes commandes pour démarrer MongoDB
mongod --version > nul 2>&1
if %errorlevel% equ 0 (
    echo 🎯 MongoDB trouvé, démarrage en cours...
    start "MongoDB" mongod --dbpath C:\data\db
    timeout /t 3 /nobreak > nul
    echo ✅ MongoDB démarré avec succès !
) else (
    echo ❌ MongoDB n'est pas installé ou n'est pas dans le PATH
    echo.
    echo 📋 Instructions d'installation MongoDB :
    echo 1. Téléchargez MongoDB Community Server depuis : https://www.mongodb.com/try/download/community
    echo 2. Installez MongoDB en suivant les instructions
    echo 3. Ajoutez MongoDB au PATH système
    echo 4. Créez le dossier C:\data\db pour les données
    echo.
    echo 🔧 Ou utilisez MongoDB Atlas (cloud) en modifiant l'URI dans application.properties
)

:end
echo.
echo 🎯 Vous pouvez maintenant démarrer votre application Spring Boot
echo.
pause 