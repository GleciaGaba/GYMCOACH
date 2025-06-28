<# : batch portion
@REM ============================================================================
@REM MAVEN WRAPPER POUR WINDOWS - SCRIPT DE DÉMARRAGE
@REM ============================================================================
@REM 
@REM Ce script permet d'exécuter Maven sans installation préalable.
@REM Il télécharge automatiquement Maven si nécessaire et l'exécute.
@REM
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM
@REM Variables d'environnement optionnelles :
@REM   MVNW_REPOURL - URL de base du repository pour télécharger Maven
@REM   MVNW_USERNAME/MVNW_PASSWORD - nom d'utilisateur et mot de passe pour le téléchargement
@REM   MVNW_VERBOSE - true: active les logs détaillés; autres: silence la sortie
@REM ----------------------------------------------------------------------------

@REM ============================================================================
@REM CONFIGURATION INITIALE ET RÉCUPÉRATION DE LA COMMANDE MAVEN
@REM ============================================================================

@REM Définir le nom du script si pas déjà défini
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)

@REM Initialiser les variables
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=

@REM Sauvegarder et réinitialiser PSModulePath pour éviter les conflits
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=

@REM Exécuter PowerShell pour récupérer la commande Maven
@REM Cette partie utilise PowerShell pour analyser le script et déterminer la commande à exécuter
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
  IF "%%A"=="MVN_CMD" (set __MVNW_CMD__=%%B) ELSE IF "%%B"=="" (echo %%A) ELSE (echo %%A=%%B)
)

@REM Restaurer PSModulePath
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=
@SET __MVNW_ARG0_NAME__=

@REM Nettoyer les variables d'authentification
@SET MVNW_USERNAME=
@SET MVNW_PASSWORD=

@REM ============================================================================
@REM EXÉCUTION DE LA COMMANDE MAVEN OU GESTION D'ERREUR
@REM ============================================================================

@REM Si la commande Maven a été trouvée, l'exécuter avec tous les arguments
@IF NOT "%__MVNW_CMD__%"=="" (%__MVNW_CMD__% %*)

@REM Si aucune commande n'a été trouvée, afficher une erreur et quitter
@echo Cannot start maven from wrapper >&2 && exit /b 1
@GOTO :EOF

: end batch / begin powershell #>

@REM ============================================================================
@REM SECTION POWERSHELL - LOGIQUE PRINCIPALE DU WRAPPER
@REM ============================================================================

@REM Configuration de la gestion d'erreurs PowerShell
$ErrorActionPreference = "Stop"

@REM Activation des logs détaillés si demandé
if ($env:MVNW_VERBOSE -eq "true") {
  $VerbosePreference = "Continue"
}

@REM ============================================================================
@REM LECTURE DE LA CONFIGURATION MAVEN
@REM ============================================================================

@REM Lire l'URL de distribution depuis le fichier de propriétés
@REM Ce fichier contient la version de Maven à utiliser
$distributionUrl = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionUrl
if (!$distributionUrl) {
  Write-Error "cannot read distributionUrl property in $scriptDir/.mvn/wrapper/maven-wrapper.properties"
}

@REM ============================================================================
@REM DÉTECTION DU TYPE DE DISTRIBUTION (MAVEN CLASSIQUE OU MAVEN DAEMON)
@REM ============================================================================

@REM Déterminer si on utilise Maven Daemon (mvnd) ou Maven classique
switch -wildcard -casesensitive ( $($distributionUrl -replace '^.*/','') ) {
  "maven-mvnd-*" {
    @REM Configuration pour Maven Daemon (plus rapide)
    $USE_MVND = $true
    $distributionUrl = $distributionUrl -replace '-bin\.[^.]*$',"-windows-amd64.zip"
    $MVN_CMD = "mvnd.cmd"
    break
  }
  default {
    @REM Configuration pour Maven classique
    $USE_MVND = $false
    $MVN_CMD = $script -replace '^mvnw','mvn'
    break
  }
}

@REM ============================================================================
@REM CONFIGURATION DU REPOSITORY ET CALCUL DU MAVEN_HOME
@REM ============================================================================

@REM Appliquer l'URL du repository personnalisé si spécifiée
if ($env:MVNW_REPOURL) {
  $MVNW_REPO_PATTERN = if ($USE_MVND) { "/org/apache/maven/" } else { "/maven/mvnd/" }
  $distributionUrl = "$env:MVNW_REPOURL$MVNW_REPO_PATTERN$($distributionUrl -replace '^.*'+$MVNW_REPO_PATTERN,'')"
}

@REM Extraire le nom du fichier de distribution
$distributionUrlName = $distributionUrl -replace '^.*/',''
$distributionUrlNameMain = $distributionUrlName -replace '\.[^.]*$','' -replace '-bin$',''

@REM Calculer le répertoire parent de MAVEN_HOME
@REM Pattern: ~/.m2/wrapper/dists/{apache-maven-<version>,maven-mvnd-<version>-<platform>}/<hash>
$MAVEN_HOME_PARENT = "$HOME/.m2/wrapper/dists/$distributionUrlNameMain"
if ($env:MAVEN_USER_HOME) {
  $MAVEN_HOME_PARENT = "$env:MAVEN_USER_HOME/wrapper/dists/$distributionUrlNameMain"
}

@REM Calculer le hash MD5 de l'URL pour créer un répertoire unique
$MAVEN_HOME_NAME = ([System.Security.Cryptography.MD5]::Create().ComputeHash([byte[]][char[]]$distributionUrl) | ForEach-Object {$_.ToString("x2")}) -join ''
$MAVEN_HOME = "$MAVEN_HOME_PARENT/$MAVEN_HOME_NAME"

@REM ============================================================================
@REM VÉRIFICATION SI MAVEN EST DÉJÀ INSTALLÉ
@REM ============================================================================

@REM Si MAVEN_HOME existe déjà, l'utiliser directement
if (Test-Path -Path "$MAVEN_HOME" -PathType Container) {
  Write-Verbose "found existing MAVEN_HOME at $MAVEN_HOME"
  Write-Output "MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD"
  exit $?
}

@REM ============================================================================
@REM VALIDATION DE L'URL DE DISTRIBUTION
@REM ============================================================================

@REM Vérifier que l'URL de distribution est valide (doit se terminer par *-bin.zip)
if (! $distributionUrlNameMain -or ($distributionUrlName -eq $distributionUrlNameMain)) {
  Write-Error "distributionUrl is not valid, must end with *-bin.zip, but found $distributionUrl"
}

@REM ============================================================================
@REM PRÉPARATION DU TÉLÉCHARGEMENT
@REM ============================================================================

@REM Créer un répertoire temporaire pour le téléchargement
$TMP_DOWNLOAD_DIR_HOLDER = New-TemporaryFile
$TMP_DOWNLOAD_DIR = New-Item -Itemtype Directory -Path "$TMP_DOWNLOAD_DIR_HOLDER.dir"
$TMP_DOWNLOAD_DIR_HOLDER.Delete() | Out-Null

@REM Configuration du nettoyage automatique en cas d'erreur
trap {
  if ($TMP_DOWNLOAD_DIR.Exists) {
    try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }
    catch { Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR" }
  }
}

@REM Créer le répertoire parent de MAVEN_HOME
New-Item -Itemtype Directory -Path "$MAVEN_HOME_PARENT" -Force | Out-Null

@REM ============================================================================
@REM TÉLÉCHARGEMENT ET INSTALLATION D'APACHE MAVEN
@REM ============================================================================

Write-Verbose "Couldn't find MAVEN_HOME, downloading and installing it ..."
Write-Verbose "Downloading from: $distributionUrl"
Write-Verbose "Downloading to: $TMP_DOWNLOAD_DIR/$distributionUrlName"

@REM Créer le client web et configurer l'authentification si nécessaire
$webclient = New-Object System.Net.WebClient
if ($env:MVNW_USERNAME -and $env:MVNW_PASSWORD) {
  $webclient.Credentials = New-Object System.Net.NetworkCredential($env:MVNW_USERNAME, $env:MVNW_PASSWORD)
}

@REM Configurer TLS 1.2 pour la sécurité
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

@REM Télécharger le fichier Maven
$webclient.DownloadFile($distributionUrl, "$TMP_DOWNLOAD_DIR/$distributionUrlName") | Out-Null

@REM ============================================================================
@REM VALIDATION DU CHECKSUM SHA-256 (SÉCURITÉ)
@REM ============================================================================

@REM Lire le checksum SHA-256 depuis les propriétés
$distributionSha256Sum = (Get-Content -Raw "$scriptDir/.mvn/wrapper/maven-wrapper.properties" | ConvertFrom-StringData).distributionSha256Sum

@REM Valider le checksum si spécifié
if ($distributionSha256Sum) {
  if ($USE_MVND) {
    Write-Error "Checksum validation is not supported for maven-mvnd. `nPlease disable validation by removing 'distributionSha256Sum' from your maven-wrapper.properties."
  }
  
  @REM Importer le module pour calculer le hash
  Import-Module $PSHOME\Modules\Microsoft.PowerShell.Utility -Function Get-FileHash
  
  @REM Comparer le hash calculé avec celui attendu
  if ((Get-FileHash "$TMP_DOWNLOAD_DIR/$distributionUrlName" -Algorithm SHA256).Hash.ToLower() -ne $distributionSha256Sum) {
    Write-Error "Error: Failed to validate Maven distribution SHA-256, your Maven distribution might be compromised. If you updated your Maven version, you need to update the specified distributionSha256Sum property."
  }
}

@REM ============================================================================
@REM EXTRACTION ET INSTALLATION
@REM ============================================================================

@REM Extraire l'archive téléchargée
Expand-Archive "$TMP_DOWNLOAD_DIR/$distributionUrlName" -DestinationPath "$TMP_DOWNLOAD_DIR" | Out-Null

@REM Renommer le répertoire extrait avec le hash MD5
Rename-Item -Path "$TMP_DOWNLOAD_DIR/$distributionUrlNameMain" -NewName $MAVEN_HOME_NAME | Out-Null

@REM Déplacer vers l'emplacement final
try {
  Move-Item -Path "$TMP_DOWNLOAD_DIR/$MAVEN_HOME_NAME" -Destination $MAVEN_HOME_PARENT | Out-Null
} catch {
  if (! (Test-Path -Path "$MAVEN_HOME" -PathType Container)) {
    Write-Error "fail to move MAVEN_HOME"
  }
} finally {
  @REM Nettoyer le répertoire temporaire
  try { Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force | Out-Null }
  catch { Write-Warning "Cannot remove $TMP_DOWNLOAD_DIR" }
}

@REM ============================================================================
@REM FINALISATION - RETOUR DE LA COMMANDE MAVEN
@REM ============================================================================

@REM Retourner la commande Maven à exécuter
Write-Output "MVN_CMD=$MAVEN_HOME/bin/$MVN_CMD"
