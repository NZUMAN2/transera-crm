// Using Web Crypto API for browser-compatible encryption
export class SecureStorage {
  private static encoder = new TextEncoder()
  private static decoder = new TextDecoder()
  
  // Get or create encryption key
  private static async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-key-change-this'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )
    
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode('transera-crm-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }
  
  // Encrypt data
  static async encrypt(text: string): Promise<string> {
    try {
      const key = await this.getKey()
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        this.encoder.encode(text)
      )
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv, 0)
      combined.set(new Uint8Array(encrypted), iv.length)
      
      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error('Encryption error:', error)
      return text // Fallback to plaintext in dev
    }
  }
  
  // Decrypt data
  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const key = await this.getKey()
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      )
      
      return this.decoder.decode(decrypted)
    } catch (error) {
      console.error('Decryption error:', error)
      return encryptedData // Fallback to treat as plaintext
    }
  }
  
  // Store encrypted data
  static async setItem(key: string, value: any, useSession = true): Promise<void> {
    const data = {
      value,
      timestamp: Date.now(),
      checksum: await this.generateChecksum(JSON.stringify(value))
    }
    
    const encrypted = await this.encrypt(JSON.stringify(data))
    const storage = useSession ? sessionStorage : localStorage
    
    if (typeof window !== 'undefined') {
      storage.setItem(`secure_${key}`, encrypted)
    }
  }
  
  // Retrieve and decrypt data
  static async getItem(key: string, useSession = true): Promise<any> {
    if (typeof window === 'undefined') return null
    
    const storage = useSession ? sessionStorage : localStorage
    const encrypted = storage.getItem(`secure_${key}`)
    
    if (!encrypted) {
      // Check if there's old unencrypted data to migrate
      const oldData = localStorage.getItem(key)
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData)
          await this.setItem(key, parsed, false)
          localStorage.removeItem(key) // Remove old unencrypted data
          return parsed
        } catch (e) {
          return null
        }
      }
      return null
    }
    
    try {
      const decrypted = await this.decrypt(encrypted)
      const data = JSON.parse(decrypted)
      
      // Verify checksum
      const checksum = await this.generateChecksum(JSON.stringify(data.value))
      if (checksum !== data.checksum) {
        console.error('Data integrity check failed')
        storage.removeItem(`secure_${key}`)
        return null
      }
      
      return data.value
    } catch (error) {
      console.error('Failed to retrieve secure data:', error)
      return null
    }
  }
  
  // Generate checksum for integrity
  private static async generateChecksum(data: string): Promise<string> {
    const msgBuffer = this.encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  // Clear all secure data
  static clearAll(): void {
    if (typeof window !== 'undefined') {
      // Clear both storages
      const keysToRemove: string[] = []
      
      // Find all secure_ keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('secure_')) {
          keysToRemove.push(key)
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.startsWith('secure_')) {
          keysToRemove.push(key)
        }
      }
      
      // Remove them
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    }
  }
  
  // Migrate all existing localStorage data to encrypted storage
  static async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return
    
    const keysToMigrate = ['candidates', 'jobs', 'clients', 'placements', 'user', 'tasks', 'interviews']
    
    for (const key of keysToMigrate) {
      const data = localStorage.getItem(key)
      if (data && !data.startsWith('secure_')) {
        try {
          const parsed = JSON.parse(data)
          await this.setItem(key, parsed, false) // Use localStorage for persistence
          localStorage.removeItem(key) // Remove unencrypted version
          console.log(`✅ Migrated ${key} to secure storage`)
        } catch (error) {
          console.error(`Failed to migrate ${key}:`, error)
        }
      }
    }
  }
}