# 🔒 Sécurité et Vulnérabilités

## Gestion des Vulnérabilités npm

### Vulnérabilités dans devDependencies
Les vulnérabilités détectées dans les `devDependencies` (comme ESLint, Vite, etc.) n'affectent **pas** la production car ces packages ne sont pas inclus dans le build final.

### Actions Prises
1. ✅ Suppression des packages inutiles (`init`, `npx`)
2. ✅ Mise à jour d'axios vers la dernière version stable
3. ✅ Configuration `.npmrc` pour optimiser les builds
4. ✅ Script postinstall pour vérifier uniquement les dépendances de production

### Vérification des Vulnérabilités

Pour vérifier les vulnérabilités dans les dépendances de production uniquement :
```bash
npm audit --production
```

Pour vérifier toutes les vulnérabilités (y compris devDependencies) :
```bash
npm audit
```

### Mise à Jour des Dépendances

Pour mettre à jour toutes les dépendances :
```bash
npm update
```

Pour mettre à jour une dépendance spécifique :
```bash
npm update <package-name>
```

### Notes Importantes

- Les vulnérabilités dans `devDependencies` sont généralement moins critiques car elles ne sont pas déployées
- Les mises à jour régulières des dépendances sont recommandées
- Vercel utilise `npm ci` qui installe exactement les versions du `package-lock.json`

### Dépendances de Production

Les dépendances suivantes sont incluses dans le build final :
- `axios` - Client HTTP
- `framer-motion` - Animations
- `react` - Framework UI
- `react-dom` - Rendu React
- `react-router-dom` - Routage

Toutes ces dépendances sont à jour et sécurisées.
