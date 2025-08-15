import { useState, useEffect } from 'react'
import { SecureStorage } from '@/lib/security/secure-storage'

export function useSecureData<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    try {
      const stored = SecureStorage.getItem(key)
      if (stored) {
        setData(stored)
      }
    } catch (err) {
      setError('Failed to load secure data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [key])
  
  const updateData = (newData: T) => {
    try {
      SecureStorage.setItem(key, newData)
      setData(newData)
      setError(null)
    } catch (err) {
      setError('Failed to save secure data')
      console.error(err)
    }
  }
  
  return { data, updateData, loading, error }
}