// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../services/auth.service';
import { getUser } from '../services/user.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);   // Firebase Auth user
  const [userDoc, setUserDoc] = useState(null);            // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const doc = await getUser(firebaseUser.uid);
          setUserDoc(doc);
        } catch (e) {
          setUserDoc(null);
        }
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserDoc = async () => {
    if (currentUser) {
      const doc = await getUser(currentUser.uid);
      setUserDoc(doc);
    }
  };

  const value = {
    currentUser,
    userDoc,
    loading,
    refreshUserDoc,
    isEmailVerified: currentUser?.emailVerified ?? false,
    isAdmin: userDoc?.role === 'admin',
    isOnboardingComplete: userDoc?.isOnboardingComplete ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
