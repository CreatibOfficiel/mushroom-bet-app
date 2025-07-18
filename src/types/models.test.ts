import { describe, expect, it } from 'vitest';
import { hasPlayerSkin, validatePlayerData } from './examples';
import { Character, characterSchema, playerSchema, skinSchema } from './index';

describe('Mario Kart Models', () => {
  describe('Character enum', () => {
    it('should have all required characters', () => {
      expect(Character.MARIO).toBe('MARIO');
      expect(Character.LUIGI).toBe('LUIGI');
      expect(Character.BOWSER).toBe('BOWSER');
      expect(Character.DONKEY_KONG).toBe('DONKEY_KONG');
    });

    it('should validate character with Zod', () => {
      expect(() => characterSchema.parse(Character.MARIO)).not.toThrow();
      expect(() => characterSchema.parse('INVALID_CHARACTER')).toThrow();
    });
  });

  describe('Skin model', () => {
    it('should validate valid skin data', () => {
      const validSkin = {
        id: 1,
        name: 'Mario Classic Red',
        character: Character.MARIO,
      };

      expect(() => skinSchema.parse(validSkin)).not.toThrow();
    });

    it('should reject invalid skin data', () => {
      const invalidSkin = {
        id: 'not-a-number',
        name: '',
        character: 'INVALID_CHARACTER',
      };

      expect(() => skinSchema.parse(invalidSkin)).toThrow();
    });
  });

  describe('Player model', () => {
    it('should validate player with skin', () => {
      const playerWithSkin = {
        id: 'cm123abc',
        email: 'mario@nintendo.com',
        displayName: 'Super Mario',
        skin: {
          id: 1,
          name: 'Mario Classic Red',
          character: Character.MARIO,
        },
      };

      expect(() => playerSchema.parse(playerWithSkin)).not.toThrow();
      const validatedPlayer = playerSchema.parse(playerWithSkin);
      expect(validatedPlayer.skin).not.toBeNull();
      expect(validatedPlayer.skin?.character).toBe(Character.MARIO);
    });

    it('should validate player without skin', () => {
      const playerWithoutSkin = {
        id: 'cm456def',
        email: 'luigi@nintendo.com',
        displayName: null,
        skin: null,
      };

      expect(() => playerSchema.parse(playerWithoutSkin)).not.toThrow();
      const validatedPlayer = playerSchema.parse(playerWithoutSkin);
      expect(validatedPlayer.skin).toBeNull();
      expect(validatedPlayer.displayName).toBeNull();
    });

    it('should reject invalid player data', () => {
      const invalidPlayer = {
        id: 123, // should be string
        email: 'not-an-email',
        displayName: 'Valid Name',
        skin: {
          id: 'not-a-number',
          name: '',
          character: 'INVALID_CHARACTER',
        },
      };

      expect(() => playerSchema.parse(invalidPlayer)).toThrow();
    });
  });

  describe('Type guards', () => {
    it('should correctly identify player with skin', () => {
      const playerWithSkin = {
        id: 'cm123abc',
        email: 'mario@nintendo.com',
        displayName: 'Super Mario',
        skin: {
          id: 1,
          name: 'Mario Classic Red',
          character: Character.MARIO,
        },
      };

      const validatedPlayer = playerSchema.parse(playerWithSkin);
      expect(hasPlayerSkin(validatedPlayer)).toBe(true);
    });

    it('should correctly identify player without skin', () => {
      const playerWithoutSkin = {
        id: 'cm456def',
        email: 'luigi@nintendo.com',
        displayName: 'Luigi Bros',
        skin: null,
      };

      const validatedPlayer = playerSchema.parse(playerWithoutSkin);
      expect(hasPlayerSkin(validatedPlayer)).toBe(false);
    });
  });

  describe('Utility functions', () => {
    it('should validate player data with utility function', () => {
      const validData = {
        id: 'cm123abc',
        email: 'mario@nintendo.com',
        displayName: 'Super Mario',
        skin: {
          id: 1,
          name: 'Mario Classic Red',
          character: Character.MARIO,
        },
      };

      expect(() => validatePlayerData(validData)).not.toThrow();
      const player = validatePlayerData(validData);
      expect(player.email).toBe('mario@nintendo.com');
    });

    it('should throw on invalid data with utility function', () => {
      const invalidData = {
        id: 123,
        email: 'not-an-email',
      };

      expect(() => validatePlayerData(invalidData)).toThrow();
    });
  });
});
