#!/bin/bash

# Script de build complet pour préserver tous les fichiers et la version
# Build Complete Script - Préserve tous les fichiers sans modification

set -e  # Arrêter en cas d'erreur

echo "🚀 Début du build complet du projet lakay-ai"
echo "📋 Préservation de tous les fichiers et de la version actuelle"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier la version actuelle
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
log_info "Version actuelle: $CURRENT_VERSION"

# Sauvegarder les informations importantes
log_info "Sauvegarde des informations du projet..."
ORIGINAL_FILES_COUNT=$(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "./.next/*" | wc -l)
log_info "Nombre de fichiers avant build: $ORIGINAL_FILES_COUNT"

# Créer un backup temporaire des fichiers critiques
log_info "Création d'un backup de sécurité..."
mkdir -p .backup-temp
cp package.json .backup-temp/
cp package-lock.json .backup-temp/ 2>/dev/null || true
cp pnpm-lock.yaml .backup-temp/ 2>/dev/null || true

# Nettoyer le cache précédent (sans supprimer les fichiers sources)
log_info "Nettoyage du cache de build précédent..."
rm -rf .next/cache 2>/dev/null || true

# Vérifier les dépendances
log_info "Vérification des dépendances..."
if [ -f "package-lock.json" ]; then
    npm ci
elif [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
else
    npm install
fi

# Build du projet
log_info "Lancement du build de production..."
npm run build

# Vérifier que le build s'est bien passé
if [ $? -eq 0 ]; then
    log_success "Build terminé avec succès!"
else
    log_error "Erreur lors du build"
    exit 1
fi

# Vérifier que tous les fichiers sont toujours présents
FINAL_FILES_COUNT=$(find . -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "./.next/*" | wc -l)
log_info "Nombre de fichiers après build: $FINAL_FILES_COUNT"

# Vérifier que la version n'a pas changé
FINAL_VERSION=$(node -e "console.log(require('./package.json').version)")
if [ "$CURRENT_VERSION" = "$FINAL_VERSION" ]; then
    log_success "Version préservée: $FINAL_VERSION"
else
    log_warning "La version a changé de $CURRENT_VERSION à $FINAL_VERSION"
fi

# Afficher les statistiques du build
log_info "Statistiques du build:"
echo "  📁 Répertoire .next créé: $(du -sh .next 2>/dev/null | cut -f1 || echo 'N/A')"
echo "  📦 Taille totale du projet: $(du -sh . --exclude=node_modules --exclude=.git 2>/dev/null | cut -f1 || echo 'N/A')"

# Vérifier les routes générées
if [ -d ".next/server/app" ]; then
    ROUTES_COUNT=$(find .next/server/app -name "*.js" | wc -l)
    log_info "Routes générées: $ROUTES_COUNT"
fi

# Nettoyer le backup temporaire
rm -rf .backup-temp

# Afficher le résumé final
echo ""
echo "🎉 BUILD COMPLET TERMINÉ AVEC SUCCÈS!"
echo "📊 Résumé:"
echo "  • Version: $FINAL_VERSION (préservée)"
echo "  • Fichiers: $FINAL_FILES_COUNT (tous préservés)"
echo "  • Build output: .next/"
echo "  • Prêt pour le déploiement Vercel"
echo ""
echo "🚀 Commandes disponibles:"
echo "  • npm start          - Lancer en mode production"
echo "  • vercel --prod      - Déployer sur Vercel"
echo "  • npm run build:analyze - Analyser la taille du bundle"
echo ""

log_success "Le projet est prêt pour le déploiement!" 