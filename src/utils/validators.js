// src/utils/validators.js

export const isEduEmail = (email) =>
  typeof email === 'string' && email.toLowerCase().endsWith('.edu.tr');

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('En az 8 karakter olmalıdır');
  if (!/[A-Z]/.test(password)) errors.push('En az bir büyük harf içermelidir');
  if (!/[a-z]/.test(password)) errors.push('En az bir küçük harf içermelidir');
  if (!/[0-9]/.test(password)) errors.push('En az bir rakam içermelidir');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    errors.push('En az bir özel karakter içermelidir');
  return errors;
};

export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { level: 'weak', label: 'Zayıf', color: '#C84040' };
  if (score <= 4) return { level: 'medium', label: 'Orta', color: '#E8A020' };
  return { level: 'strong', label: 'Güçlü', color: '#3A8A5A' };
};
