import { z } from 'zod';
import { Character, characterSchema } from './character';

export const skinSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: characterSchema,
});

export type Skin = z.infer<typeof skinSchema>;

// Interface TypeScript for compatibility
export interface ISkin {
  id: number;
  name: string;
  character: Character;
}
