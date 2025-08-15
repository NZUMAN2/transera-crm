import crypto from 'crypto'

export class SecureStorage {
  private static algorithm = 'aes-256-gcm'
  private static secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'CHANGE-THIS-KEY-IMMEDIATELY-IN-PRODUCTION-NOW'
  
  // Encrypt data before storing
  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16)
      const salt = crypto.randomBytes(64)
      const key = crypto.pbkdf2Sync(this.secretKey, salt, 2145, 32, 'sha512')
      const cipher = crypto.createCipheriv(this.algorithm, key, iv)
      
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
      ])
      
      const tag = cipher.getAuthTag()
      
      return Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt data')
    }
  }
  
  // Decrypt data after retrieving
  static decrypt(encryptedData: string): string {
    try {
      const buffer = Buffer.from(encryptedData, 'base64')
      
      const salt = buffer.slice(0, 64)
      const iv = buffer.slice(64, 80)
      const tag = buffer.slice(80, 96)
      const encrypted = buffer.slice(96)
      
      const key = crypto.pbkdf2Sync(this.secretKey, salt, 2145, 32, 'sha512')
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv)
      decipher.setAuthTag(tag)
      
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ])
      
      return decrypted.toString('utf8')
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt data')
    }
  }
  
  // Store encrypted data with expiry
  static setItem(key: string, value: any, expiryMinutes: number = 60): void {
    const data = {
      value,
      expiry: Date.now() + (expiryMinutes * 60 * 1000),
      checksum: this.generateChecksum(JSON.stringify(value))
    }
    
    const encrypted = this.encrypt(JSON.stringify(data))
    
    // Use sessionStorage for sensitive data (cleared on browser close)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, encrypted)
    }
  }
  
  // Retrieve and decrypt data
  static getItem(key: string): any {
    if (typeof window === 'undefined') return null
    
    const encrypted = sessionStorage.getItem(key)
    if (!encrypted) return null
    
    try {
      const decrypted = this.decrypt(encrypted)
      const data = JSON.parse(decrypted)
      
      // Check expiry
      if (data.expiry && Date.now() > data.expiry) {
        sessionStorage.removeItem(key)
        return null
      }
      
      // Verify data integrity
      const checksum = this.generateChecksum(JSON.stringify(data.value))
      if (checksum !== data.checksum) {
        console.error('Data integrity check failed')
        sessionStorage.removeItem(key)
        return null
      }
      
      return data.value
    } catch (error) {
      console.error('Failed to retrieve secure data:', error)
      return null
    }
  }
  
  // Generate checksum for data integrity
  private static generateChecksum(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }
  
  // Clear all sensitive data
  static clearAll(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
  }
  
  // Migrate existing localStorage data to secure storage
  static migrateFromLocalStorage(): void {
    if (typeof window === 'undefined') return
    
    const keysToMigrate = ['candidates', 'jobs', 'clients', 'placements', 'user']
    
    keysToMigrate.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          this.setItem(key, parsed, 1440) // 24 hours
          localStorage.removeItem(key) // Remove from localStorage
        } catch (error) {
          console.error(`Failed to migrate ${key}:`, error)
        }
      }
    })
  }
}