import { useState, useEffect } from 'react'
import { fetchPublicStoreBySlug } from '../services/storeService.js'
import { hasSupabaseConfig } from '../lib/supabase.js'

export function useStore(slug) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setStore(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setStore(null)
    setError(null)
    fetchPublicStoreBySlug(slug)
      .then(data => {
        if (!cancelled) {
          setStore(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [slug])

  return {
    store,
    loading,
    error,
    source: hasSupabaseConfig ? 'supabase' : 'json',
  }
}
