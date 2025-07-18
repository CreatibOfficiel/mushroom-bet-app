import { Character, Player, playerSchema } from './index';

// Exemple de données avec skin (Mario Classic Red)
export const playerWithSkinExample: Player = {
  id: 'cm123abc',
  email: 'mario@nintendo.com',
  displayName: 'Super Mario',
  skin: {
    id: 1,
    name: 'Mario Classic Red',
    character: Character.MARIO,
  },
};

// Exemple de données sans skin (Luigi)
export const playerWithoutSkinExample: Player = {
  id: 'cm456def',
  email: 'luigi@nintendo.com',
  displayName: 'Luigi Bros',
  skin: null,
};

// Fonction utilitaire pour valider les données reçues de l'API
export function validatePlayerData(data: unknown): Player {
  return playerSchema.parse(data);
}

// Fonction utilitaire pour valider la réponse API complète
export function validateApiResponse(response: unknown): { user: Player } {
  return { user: playerSchema.parse(response) };
}

// Type guard pour vérifier si un player a un skin
export function hasPlayerSkin(
  player: Player,
): player is Player & { skin: NonNullable<Player['skin']> } {
  return player.skin !== null;
}

// Exemple d'utilisation dans un composant React
export const exampleUsage = `
import { Player, validatePlayerData, hasPlayerSkin, Character } from '@/types';

// Dans votre composant ou service
const handleApiResponse = (data: unknown) => {
  try {
    const player = validatePlayerData(data);
    
    if (hasPlayerSkin(player)) {
      console.log(\`\${player.displayName} utilise le skin \${player.skin.name} avec le personnage \${player.skin.character}\`);
    } else {
      console.log(\`\${player.displayName} n'a pas de skin sélectionné\`);
    }
  } catch (error) {
    console.error('Données player invalides:', error);
  }
};
`;
