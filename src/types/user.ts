import { z } from 'zod';
import { skinSchema } from './skin';

export const playerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  skin: skinSchema.nullable(),
});

export type Player = z.infer<typeof playerSchema>;

// Alias pour compatibilité avec le code existant
export const userSchema = playerSchema;
export type User = Player;

// Interface TypeScript classique pour compatibilité
export interface IPlayer {
  id: string;
  email: string;
  displayName: string | null;
  skin: {
    id: number;
    name: string;
    character: string;
  } | null;
}
