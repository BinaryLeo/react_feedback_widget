import crypto from 'crypto';

/**
 * Service for encrypting sensitive data (API keys, tokens)
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(masterKey: string) {
    // Derive a 32-byte key from the master key using SHA-256
    this.key = crypto.createHash('sha256').update(masterKey).digest();
  }

  /**
   * Encrypts plaintext and returns encrypted string with IV and auth tag
   * Format: iv:authTag:ciphertext (all base64)
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    // Combine iv + authTag + ciphertext
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  }

  /**
   * Decrypts encrypted string
   * Throws if decryption fails (tampered data or wrong key)
   */
  decrypt(encryptedData: string): string {
    const [ivBase64, authTagBase64, ciphertext] = encryptedData.split(':');
    
    if (!ivBase64 || !authTagBase64 || !ciphertext) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * One-way hash for storing non-recoverable secrets
   */
  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash comparison (constant-time)
   */
  compareHash(data: string, hash: string): boolean {
    const dataHash = this.hash(data);
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(dataHash),
      Buffer.from(hash)
    );
  }
}
