// src/services/matching.service.js
import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc,
  query, where, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const getMatches = async (userId) => {
  const q = query(
    collection(db, 'matches'),
    where('users', 'array-contains', userId),
    where('status', 'in', ['pending', 'active'])
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const sendMatchRequest = async (fromUserId, toUserId, commonSubjects = [], score = 0) => {
  const ref = await addDoc(collection(db, 'matches'), {
    users: [fromUserId, toUserId],
    initiatedBy: fromUserId,
    status: 'pending',
    compatibilityScore: score,
    commonSubjects,
    createdAt: serverTimestamp(),
    endedAt: null,
  });
  return ref.id;
};

export const respondToMatch = async (matchId, accept) => {
  await updateDoc(doc(db, 'matches', matchId), {
    status: accept ? 'active' : 'ended',
    respondedAt: serverTimestamp(),
  });
};

export const endMatch = async (matchId, reason = '') => {
  await updateDoc(doc(db, 'matches', matchId), {
    status: 'ended',
    endedAt: serverTimestamp(),
    endReason: reason,
  });
};

export const findPotentialMatches = async (userId, subjects = [], campus = '') => {
  // Aynı dersleri alan kullanıcıları bul
  const prefsSnap = await getDocs(collection(db, 'users'));
  const results = [];

  for (const userDoc of prefsSnap.docs) {
    if (userDoc.id === userId) continue;

    try {
      const prefDoc = await getDoc(doc(db, 'users', userDoc.id, 'preferences', userDoc.id));
      if (!prefDoc.exists()) continue;

      const prefs = prefDoc.data();
      const theirSubjects = prefs.subjects || [];
      const common = subjects.filter(s => theirSubjects.includes(s));

      if (common.length === 0) continue;

      const score = Math.round((common.length / Math.max(subjects.length, theirSubjects.length)) * 100);

      results.push({
        uid: userDoc.id,
        ...userDoc.data(),
        commonSubjects: common,
        compatibilityScore: score,
        campus: prefs.campus || '',
      });
    } catch (e) {
      continue;
    }
  }

  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};
