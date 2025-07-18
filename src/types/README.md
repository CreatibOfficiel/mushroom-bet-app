# Types Mario Kart Betting System

Ce dossier contient tous les modèles TypeScript pour le système de paris Mario Kart, avec validation Zod intégrée.

## 📁 Structure

```
src/types/
├── character.ts    # Enum des personnages Mario Kart
├── skin.ts         # Modèle Skin (id, name, character)
├── user.ts         # Modèle Player/User (mis à jour)
├── examples.ts     # Exemples d'utilisation et utilitaires
├── index.ts        # Exports centralisés
└── README.md       # Cette documentation
```

## 🎮 Modèles Disponibles

### Character (Enum)

Tous les personnages Mario Kart disponibles :

```typescript
import { Character } from '@/types';

// Utilisation
const myCharacter = Character.MARIO;
const anotherCharacter = Character.BOWSER;
```

**Personnages disponibles :**

- **Héros :** MARIO, LUIGI, PEACH, DAISY, ROSALINA, PAULINE
- **Yoshi & Amis :** YOSHI, BIRDO, TOAD, TOADETTE
- **Bébés :** BABY_MARIO, BABY_LUIGI, BABY_PEACH, BABY_DAISY, BABY_ROSALINA
- **Vilains :** BOWSER, BOWSER_JR, KING_BOO
- **Ennemis :** GOOMBA, KOOPA_TROOPA, DRY_BONES, PIRANHA_PLANT, HAMMER_BRO, etc.
- **Autres :** DONKEY_KONG, WARIO, WALUIGI, NABBIT, et bien d'autres...

### Skin

Représente un skin/costume pour un personnage :

```typescript
import { Character, Skin } from '@/types';

const marioSkin: Skin = {
  id: 1,
  name: 'Mario Classic Red',
  character: Character.MARIO,
};
```

### Player

Représente un joueur avec un skin optionnel :

```typescript
import { Player } from '@/types';

const player: Player = {
  id: 'cm123abc',
  email: 'mario@nintendo.com',
  displayName: 'Super Mario',
  skin: {
    id: 1,
    name: 'Mario Classic Red',
    character: Character.MARIO,
  },
};

// Ou sans skin
const playerNoSkin: Player = {
  id: 'cm456def',
  email: 'luigi@nintendo.com',
  displayName: 'Luigi Bros',
  skin: null,
};
```

## 🔧 Validation avec Zod

Tous les modèles incluent des schemas Zod pour la validation :

```typescript
import { characterSchema, playerSchema, skinSchema } from '@/types';

// Valider des données de l'API
try {
  const validPlayer = playerSchema.parse(apiResponse);
  console.log('Données valides:', validPlayer);
} catch (error) {
  console.error('Données invalides:', error);
}
```

## 🛠️ Utilitaires

### Type Guards

```typescript
import { hasPlayerSkin } from '@/types/examples';

if (hasPlayerSkin(player)) {
  // TypeScript sait maintenant que player.skin n'est pas null
  console.log(player.skin.name);
}
```

### Validation API

```typescript
import { validateApiResponse, validatePlayerData } from '@/types/examples';

// Valider un player directement
const player = validatePlayerData(unknownData);

// Valider une réponse API complète
const { user } = validateApiResponse(apiResponse);
```

## 📋 Exemples d'Usage

### Dans un composant React

```typescript
import { useState } from 'react';
import { Player, Character, hasPlayerSkin } from '@/types';

export function PlayerProfile({ playerId }: { playerId: string }) {
  const [player, setPlayer] = useState<Player | null>(null);

  const loadPlayer = async () => {
    const response = await fetch(`/api/players/${playerId}`);
    const data = await response.json();

    try {
      const validPlayer = validatePlayerData(data.user);
      setPlayer(validPlayer);
    } catch (error) {
      console.error('Données player invalides:', error);
    }
  };

  if (!player) return <div>Chargement...</div>;

  return (
    <div>
      <h2>{player.displayName || 'Joueur anonyme'}</h2>
      <p>Email: {player.email}</p>

      {hasPlayerSkin(player) ? (
        <div>
          <p>Skin: {player.skin.name}</p>
          <p>Personnage: {player.skin.character}</p>
        </div>
      ) : (
        <p>Aucun skin sélectionné</p>
      )}
    </div>
  );
}
```

### Dans un service API

```typescript
import { Player, playerSchema } from '@/types';

export class PlayerService {
  async getPlayer(id: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du player');
    }

    const data = await response.json();

    // Validation automatique avec Zod
    return playerSchema.parse(data.user);
  }

  async updatePlayerSkin(playerId: string, skinId: number): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${playerId}/skin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ skinId }),
    });

    const data = await response.json();
    return playerSchema.parse(data.user);
  }
}
```

## 🔄 Migration depuis l'ancien User

L'ancien type `User` est maintenant un alias de `Player` pour la compatibilité :

```typescript
// ✅ Fonctionne encore (rétrocompatible)
// ✅ Nouveau recommandé
import { Player, playerSchema, User, userSchema } from '@/types';
```

## 🎯 Bonnes Pratiques

1. **Toujours valider** les données de l'API avec les schemas Zod
2. **Utiliser les type guards** pour vérifier les propriétés optionnelles
3. **Préférer `Player`** au lieu de `User` pour les nouveaux développements
4. **Importer depuis `@/types`** pour avoir accès à tous les exports

## 🧪 Tests

```typescript
import { Character, playerSchema } from '@/types';

describe('Player validation', () => {
  it('should validate player with skin', () => {
    const playerData = {
      id: 'test123',
      email: 'test@test.com',
      displayName: 'Test Player',
      skin: {
        id: 1,
        name: 'Test Skin',
        character: Character.MARIO,
      },
    };

    expect(() => playerSchema.parse(playerData)).not.toThrow();
  });

  it('should validate player without skin', () => {
    const playerData = {
      id: 'test123',
      email: 'test@test.com',
      displayName: null,
      skin: null,
    };

    expect(() => playerSchema.parse(playerData)).not.toThrow();
  });
});
```
