import * as z from 'zod';
import { firebaseTimestampSchema } from './timestamp';

export const deckSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: firebaseTimestampSchema
});

export type Deck = z.infer<typeof deckSchema>;
