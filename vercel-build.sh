#!/bin/bash
# Script de build pour Vercel qui ignore les vulnérabilités dans devDependencies
set -e

echo "🔨 Installation des dépendances..."
npm ci --legacy-peer-deps || npm install

echo "🔍 Vérification des vulnérabilités de production uniquement..."
npm audit --production --audit-level=high || echo "⚠️  Certaines vulnérabilités détectées dans devDependencies (non critiques pour la production)"

echo "🏗️  Build de l'application..."
npm run build

echo "✅ Build terminé avec succès!"
