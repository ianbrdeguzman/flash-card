import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from '../config';

getApps().length === 0
  ? initializeApp({
      credential: cert({
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
        projectId: config.firebase.projectId
      })
    })
  : getApp();

export const db = getFirestore();
