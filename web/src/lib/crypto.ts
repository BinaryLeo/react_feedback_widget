/**
 * Client-side encryption for sensitive data (API keys)
 * Uses Web Crypto API with PBKDF2 + AES-GCM
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

/**
 * Derive encryption key from password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt text with password
 */
export async function encrypt(text: string, password: string): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv as unknown as ArrayBuffer),
    salt: arrayBufferToBase64(salt as unknown as ArrayBuffer),
  };
}

/**
 * Decrypt data with password
 */
export async function decrypt(encryptedData: EncryptedData, password: string): Promise<string> {
  try {
    const salt = base64ToArrayBuffer(encryptedData.salt);
    const iv = base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);

    const key = await deriveKey(password, new Uint8Array(salt));

    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: new Uint8Array(iv) as unknown as ArrayBuffer },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt: wrong password or corrupted data');
  }
}

// Helper functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Secure storage wrapper for API keys
 * Stores encrypted in localStorage with user-provided password
 */
export class SecureStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async save(data: string, password: string): Promise<void> {
    const encrypted = await encrypt(data, password);
    localStorage.setItem(this.key, JSON.stringify(encrypted));
  }

  async load(password: string): Promise<string | null> {
    const stored = localStorage.getItem(this.key);
    if (!stored) return null;

    const encrypted: EncryptedData = JSON.parse(stored);
    return decrypt(encrypted, password);
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }

  exists(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}

// Predefined storage keys
export const AI_CONFIG_STORAGE_KEY = 'fw_ai_config_secure';
