// src/services/auth.service.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export { auth };

export const isEduEmail = (email) => {
  return email.toLowerCase().endsWith('.edu.tr');
};

export const registerUser = async ({ email, password, displayName }) => {
  if (!isEduEmail(email)) {
    throw new Error('Sadece .edu.tr uzantılı e-posta adresleri kabul edilmektedir.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email.toLowerCase(),
      displayName,
      role: 'user',
      isVerified: false,
      isOnboardingComplete: false,
      accountStatus: 'active',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore write failed:', e);
  }

  try {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/email-dogrulama-basarili`,
    });
  } catch (e) {
    console.warn('Email verification failed:', e);
  }

  return user;
};

export const loginUser = async ({ email, password }) => {
  if (!isEduEmail(email)) {
    throw new Error('Sadece .edu.tr uzantılı e-posta adresleri kabul edilmektedir.');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);

export const requestPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/giris`,
  });
};

export const updateUserPassword = async (newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Oturum açık değil.');
  await updatePassword(user, newPassword);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getAuthErrorMessage = (code) => {
  const messages = {
    'auth/user-not-found': 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password': 'E-posta veya şifre hatalı.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanımda.',
    'auth/weak-password': 'Şifre en az 8 karakter olmalıdır.',
    'auth/too-many-requests': 'Çok fazla başarısız deneme. Lütfen bir süre bekleyin.',
    'auth/user-disabled': 'Bu hesap askıya alınmıştır.',
    'auth/invalid-email': 'Geçersiz e-posta formatı.',
    'auth/network-request-failed': 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
  };
  return messages[code] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
};