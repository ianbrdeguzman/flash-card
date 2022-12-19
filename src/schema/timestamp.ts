import { firestore } from 'firebase-admin';
import * as z from 'zod';

export const firebaseTimestampSchema = z.custom<firestore.Timestamp>(
  (data) =>
    data instanceof firestore.Timestamp || data instanceof firestore.FieldValue
);

export type FirebaseTimestamp = z.infer<typeof firebaseTimestampSchema>;
