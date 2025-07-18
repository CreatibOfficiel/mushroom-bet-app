import { Character, Player, playerSchema } from './index';

// Example data with skin (Mario Classic Red)
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

// Example data without skin (Luigi)
export const playerWithoutSkinExample: Player = {
  id: 'cm456def',
  email: 'luigi@nintendo.com',
  displayName: 'Luigi Bros',
  skin: null,
};

// Utility function to validate data received from the API
export function validatePlayerData(data: unknown): Player {
  return playerSchema.parse(data);
}

// Utility function to validate the complete API response
export function validateApiResponse(response: unknown): { user: Player } {
  return { user: playerSchema.parse(response) };
}

// Type guard to check if a player has a skin
export function hasPlayerSkin(
  player: Player,
): player is Player & { skin: NonNullable<Player['skin']> } {
  return player.skin !== null;
}

// Example usage in a React component
export const exampleUsage = `
import { Player, validatePlayerData, hasPlayerSkin, Character } from '@/types';

// In your component or service
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
