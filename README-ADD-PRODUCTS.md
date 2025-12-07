# Script d'ajout de produits

Ce script permet d'ajouter 25 produits informatiques avec des images et descriptions dans votre base de données.

## Prérequis

1. Node.js installé sur votre machine
2. Le backend Laravel doit être en cours d'exécution (`php artisan serve`)
3. Un compte administrateur avec un token d'authentification (optionnel)

## Installation

Installez axios si ce n'est pas déjà fait :

```bash
cd mon-shop-frontend
npm install axios
```

## Utilisation

1. Assurez-vous que votre backend Laravel est démarré :
   ```bash
   cd mon-shop-backend
   php artisan serve
   ```

2. Exécutez le script :
   ```bash
   cd mon-shop-frontend
   node add-products.js
   ```

3. Le script vous demandera votre token d'authentification admin. Vous pouvez :
   - Entrer votre token si vous avez un compte admin
   - Appuyer sur Entrée pour continuer sans token (si l'authentification n'est pas requise)

## Produits ajoutés

Le script ajoute 25 produits informatiques incluant :
- Claviers et souris gaming
- Écrans et moniteurs
- Composants PC (CPU, GPU, RAM, SSD, etc.)
- Périphériques audio (casques, microphones, enceintes)
- Accessoires (câbles, hubs, supports, etc.)

Chaque produit a :
- Un nom descriptif
- Une description détaillée
- Un prix réaliste
- Un stock initial
- Une URL d'image (via picsum.photos)

## Note

Les images utilisent le service picsum.photos qui génère des images aléatoires. Si vous souhaitez utiliser des images spécifiques de produits, vous pouvez modifier les URLs dans le fichier `add-products.js`.

