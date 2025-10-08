'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { encrypt, decrypt, getKey } from '@/lib/crypto';

type CryptoContextType = {
  encryptText: (text: string) => string;
  decryptText: (ciphertext: string) => string;
  hasKey: boolean;
  reloadKey: () => void;
};

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    // Load key from localStorage on mount
    const storedKey = getKey();
    setKey(storedKey);
  }, []);

  const reloadKey = () => {
    const storedKey = getKey();
    setKey(storedKey);
  };

  const encryptText = (text: string): string => {
    // Reload key in case it was just stored
    const currentKey = key || getKey();
    if (!currentKey) throw new Error('Encryption key not available');
    return encrypt(text, currentKey);
  };

  const decryptText = (ciphertext: string): string => {
    // Reload key in case it was just stored
    const currentKey = key || getKey();
    if (!currentKey) throw new Error('Encryption key not available');
    return decrypt(ciphertext, currentKey);
  };

  return (
    <CryptoContext.Provider value={{ encryptText, decryptText, hasKey: !!key, reloadKey }}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within CryptoProvider');
  }
  return context;
}
