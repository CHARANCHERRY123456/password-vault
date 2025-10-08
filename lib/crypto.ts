import CryptoJS from 'crypto-js';

// Derive encryption key from user password (SHA-256)
export function deriveKey(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

// Encrypt text using AES
export function encrypt(text: string, key: string): string {
  return CryptoJS.AES.encrypt(text, key).toString();
}

// Decrypt text using AES
export function decrypt(ciphertext: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Store encryption key in localStorage
export function storeKey(key: string): void {
  localStorage.setItem('encryptionKey', key);
}

// Get encryption key from localStorage
export function getKey(): string | null {
  return localStorage.getItem('encryptionKey');
}

// Remove encryption key from localStorage
export function clearKey(): void {
  localStorage.removeItem('encryptionKey');
}
