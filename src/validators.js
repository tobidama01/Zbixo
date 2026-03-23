// src/validators.js

// --- Validador de Nome ---
// Exige pelo menos duas palavras (nome e sobrenome) com mais de 2 letras
export function isValidName(name) {
  if (!name) return false;
  const parts = name.trim().split(' ');
  return parts.length >= 2 && parts.every(part => part.length >= 2);
}

// --- Validadores de CPF e CNPJ (Algoritmo Módulo 11) ---

function cleanDoc(doc) {
  return doc.replace(/[^\d]/g, ''); // Remove tudo exceto números
}

export function isValidCPF(cpf) {
  cpf = cleanDoc(cpf);
  if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false; // Rejeita "111.111..."

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

export function isValidCNPJ(cnpj) {
  cnpj = cleanDoc(cnpj);
  if (cnpj.length !== 14 || /^(.)\1+$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(0)) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result != digits.charAt(1)) return false;

  return true;
}

export function isValidDocument(doc) {
  doc = cleanDoc(doc);
  if (doc.length === 11) {
    return isValidCPF(doc);
  }
  if (doc.length === 14) {
    return isValidCNPJ(doc);
  }
  return false;
}