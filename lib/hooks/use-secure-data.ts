import { useState, useEffect } from 'react'
import { SecureStorage } from '@/lib/security/secure-storage'

export function useSecureData<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadData()
  }, [key])
  
  const loadData = async () => {
    try {
      setLoading(true)
      const stored = await SecureStorage.getItem(key, false) // Use localStorage for persistence
      if (stored) {
        setData(stored)
      }
    } catch (err) {
      setError('Failed to load secure data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const updateData = async (newData: T | ((prev: T) => T)) => {
    try {
      const valueToStore = typeof newData === 'function' 
        ? (newData as (prev: T) => T)(data)
        : newData
        
      await SecureStorage.setItem(key, valueToStore, false)
      setData(valueToStore)
      setError(null)
    } catch (err) {
      setError('Failed to save secure data')
      console.error(err)
    }
  }
  
  const clearData = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`secure_${key}`)
        sessionStorage.removeItem(`secure_${key}`)
      }
      setData(initialValue)
      setError(null)
    } catch (err) {
      setError('Failed to clear data')
      console.error(err)
    }
  }
  
  return { 
    data, 
    setData: updateData, 
    loading, 
    error,
    reload: loadData,
    clear: clearData
  }
}