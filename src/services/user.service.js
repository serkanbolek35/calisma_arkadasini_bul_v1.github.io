// src/services/user.service.js
import {
  doc, getDoc, updateDoc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'profile', uid));
  return snap.exists() ? snap.data() : null;
};

export const getUserPreferences = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'preferences', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, profileData) => {
  await setDoc(doc(db, 'users', uid, 'profile', uid), {
    ...profileData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const updateUserPreferences = async (uid, prefsData) => {
  await setDoc(doc(db, 'users', uid, 'preferences', uid), {
    ...prefsData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const completeOnboarding = async (uid) => {
  await updateDoc(doc(db, 'users', uid), {
    isOnboardingComplete: true,
    updatedAt: serverTimestamp(),
  });
};

export const updateLastLogin = async (uid) => {
  await updateDoc(doc(db, 'users', uid), {
    lastLoginAt: serverTimestamp(),
  });
};
