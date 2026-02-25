// src/services/session.service.js
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const createSession = async (userId, sessionData) => {
  const ref = await addDoc(collection(db, 'sessions'), {
    ...sessionData,
    participants: [userId],
    status: 'planned',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserSessions = async (userId, limitCount = 10) => {
  const q = query(
    collection(db, 'sessions'),
    where('participants', 'array-contains', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getCompletedSessions = async (userId) => {
  const q = query(
    collection(db, 'sessions'),
    where('participants', 'array-contains', userId),
    where('status', '==', 'completed'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateSessionStatus = async (sessionId, status, extra = {}) => {
  await updateDoc(doc(db, 'sessions', sessionId), {
    status,
    ...extra,
    updatedAt: serverTimestamp(),
  });
};

export const addSessionRating = async (sessionId, userId, rating) => {
  await setDoc(doc(db, 'sessions', sessionId, 'ratings', userId), {
    ...rating,
    ratedAt: serverTimestamp(),
  });
};

export const getUserStats = async (userId) => {
  const snap = await getDoc(doc(db, 'users', userId, 'stats', userId));
  return snap.exists() ? snap.data() : null;
};

export const updateUserStats = async (userId, stats) => {
  await setDoc(doc(db, 'users', userId, 'stats', userId), {
    ...stats,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};
