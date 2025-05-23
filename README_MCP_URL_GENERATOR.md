# Générateur d'URLs MCP Automatique

## Problème Résolu

Avant cette implémentation, les URLs des serveurs MCP étaient codées en dur avec des identifiants fixes, ce qui causait des conflits entre utilisateurs et des problèmes de sécurité. Tous les utilisateurs partageaient les mêmes identifiants comme `nutty-rapping-jackal-suWp-_` ou `6982cea2-b68b-4b5f-80af-216e63647791`.

## Solution Implémentée

### 1. Générateur d'Identifiants Uniques (`src/lib/user-id-generator.ts`)

Ce fichier contient les fonctions pour :
- **Générer des Customer IDs uniques** : Utilise UUID v4 pour créer des identifiants uniques
- **Générer des Agent IDs lisibles** : Combine des adjectifs, animaux et suffixes aléatoires
- **Créer des URLs personnalisées** : Génère automatiquement des URLs pour chaque service MCP
- **Gérer le stockage local** : Sauvegarde les identifiants dans localStorage pour la persistance

### 2. Interface Utilisateur Améliorée (`src/components/mcp-config-modal.tsx`)

#### Nouvelles Fonctionnalités :
- **Affichage des identifiants utilisateur** dans les statistiques
- **Modal d'informations détaillées** avec possibilité de copier les IDs
- **Bouton de régénération** pour créer de nouveaux identifiants
- **URLs automatiques** pour tous les services (Gmail, Outlook, Teams, etc.)

#### Services Supportés :
- **Gmail** : `https://mcp.composio.dev/gmail/{agentId}?agent=lakayAI`
- **Outlook** : `https://mcp.composio.dev/partner/composio/outlook?customerId={customerId}&agent=lakayAI`
- **Microsoft Teams** : `https://mcp.composio.dev/partner/composio/microsoft_teams?customerId={customerId}&agent=lakayAI`
- **Google Tasks** : `https://mcp.composio.dev/partner/composio/googletasks?customerId={customerId}&agent=lakayAI`
- **Memory** : `https://mcp.composio.dev/partner/composio/mem0?customerId={customerId}&agent=lakayAI`
- **Text to PDF** : `https://mcp.composio.dev/partner/composio/text_to_pdf?customerId={customerId}&agent=lakayAI`
- **Memory O** : `https://mcp.mem0.ai/memory?profile={agentId}&key={customerId}&client=lakayAI`

## Comment ça Fonctionne

### 1. Génération Automatique
```typescript
// Exemple d'identifiants générés
{
  customerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  agentId: "swift-eagle-a1b2c3"
}
```

### 2. URLs Personnalisées
Chaque utilisateur obtient des URLs uniques :
```
Utilisateur A: https://mcp.composio.dev/gmail/swift-eagle-a1b2c3?agent=lakayAI
Utilisateur B: https://mcp.composio.dev/gmail/clever-wolf-x9y8z7?agent=lakayAI
```

### 3. Persistance
Les identifiants sont sauvegardés dans `localStorage` sous la clé `lakayAI_user_identifiers` et réutilisés à chaque session.

## Avantages

### ✅ Sécurité
- Chaque utilisateur a ses propres identifiants uniques
- Pas de conflit entre utilisateurs
- Isolation des données

### ✅ Facilité d'Utilisation
- Génération automatique, aucune configuration manuelle
- Interface intuitive pour voir et gérer les identifiants
- Possibilité de régénérer en cas de besoin

### ✅ Évolutivité
- Facile d'ajouter de nouveaux services MCP
- Structure modulaire et réutilisable
- Support pour différents types d'URLs

### ✅ Maintenance
- Code centralisé dans `user-id-generator.ts`
- Fonctions réutilisables
- Documentation claire

## Utilisation

### Pour l'Utilisateur Final
1. Ouvrir l'Appstore Configuration
2. Cliquer sur n'importe quel bouton d'ajout d'app (Gmail, Outlook, etc.)
3. L'URL est générée automatiquement avec vos identifiants uniques
4. Voir les détails via le bouton "View Details" dans les statistiques

### Pour les Développeurs
```typescript
import { generateMCPUrls, getUserIdentifiers } from '@/lib/user-id-generator';

// Obtenir les identifiants de l'utilisateur
const { customerId, agentId } = getUserIdentifiers();

// Générer toutes les URLs
const urls = generateMCPUrls(customerId);

// Utiliser une URL spécifique
const gmailUrl = urls.gmail;
```

## Installation

Les dépendances nécessaires sont déjà installées :
```bash
npm install uuid @types/uuid
```

## Fichiers Modifiés/Créés

1. **Nouveau** : `src/lib/user-id-generator.ts` - Logique de génération d'identifiants
2. **Modifié** : `src/components/mcp-config-modal.tsx` - Interface utilisateur améliorée
3. **Nouveau** : `README_MCP_URL_GENERATOR.md` - Cette documentation

## Exemple d'URLs Générées

```
Gmail: https://mcp.composio.dev/gmail/bright-falcon-k8m2n1?agent=lakayAI
Outlook: https://mcp.composio.dev/partner/composio/outlook?customerId=a1b2c3d4-e5f6-7890-abcd-ef1234567890&agent=lakayAI
Teams: https://mcp.composio.dev/partner/composio/microsoft_teams?customerId=a1b2c3d4-e5f6-7890-abcd-ef1234567890&agent=lakayAI
```

## Support

Pour toute question ou problème, vérifiez :
1. Que les identifiants sont bien générés (visible dans les statistiques)
2. Que localStorage fonctionne correctement
3. Que les URLs générées sont valides

La régénération des identifiants peut résoudre la plupart des problèmes.
